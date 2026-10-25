package knowledge

import (
	"context"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	pb "github.com/debateai/api-gateway/gen/go/debateai/v1"
	"github.com/debateai/api-gateway/pkg/database"
	"github.com/debateai/api-gateway/pkg/grpcclient"
	"github.com/labstack/echo/v4"
)

type Handler struct {
	db          *database.DB
	grpcClients *grpcclient.Clients
}

func NewHandler(db *database.DB, grpcClients *grpcclient.Clients) *Handler {
	return &Handler{
		db:          db,
		grpcClients: grpcClients,
	}
}

type IngestYouTubeRequest struct {
	URL         string   `json:"url" validate:"required,url"`
	Title       string   `json:"title" validate:"required"`
	Language    string   `json:"language"`
	TopicTags   []string `json:"topic_tags"`
	PersonaTags []string `json:"persona_tags"`
}

// Search melakukan vector search semantic retrieval di Knowledge Base.
func (h *Handler) Search(c echo.Context) error {
	query := strings.TrimSpace(c.QueryParam("q"))
	if query == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "Parameter query 'q' wajib diisi")
	}

	topK := 5
	if k := c.QueryParam("top_k"); k != "" {
		if val, err := strconv.Atoi(k); err == nil && val > 0 && val <= 20 {
			topK = val
		}
	}

	threshold := float32(0.65)
	if th := c.QueryParam("threshold"); th != "" {
		if val, err := strconv.ParseFloat(th, 32); err == nil && val >= 0 && val <= 1 {
			threshold = float32(val)
		}
	}

	lang := c.QueryParam("lang")
	if lang == "" {
		lang = "ID"
	}

	ctx, cancel := context.WithTimeout(c.Request().Context(), 8*time.Second)
	defer cancel()

	// 1. Generate query embedding vektor 768-dimensi via Gemini
	embResp, err := h.grpcClients.GenerateEmbedding(ctx, &pb.EmbeddingRequest{
		Text:     query,
		Language: strings.ToUpper(lang),
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "Gagal menghasilkan embedding query: "+err.Error())
	}

	// 2. Vector search pgvector via gRPC KnowledgeBase
	searchResp, err := h.grpcClients.SearchKnowledge(ctx, &pb.SearchRequest{
		Embedding: embResp.Embedding,
		TopK:      int32(topK),
		Threshold: threshold,
		Language:  strings.ToUpper(lang),
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "Gagal melakukan pencarian knowledge base: "+err.Error())
	}

	type ChunkItem struct {
		ID            string  `json:"id"`
		Content       string  `json:"content"`
		DocumentTitle string  `json:"document_title"`
		SourceURL     string  `json:"source_url"`
		Similarity    float32 `json:"similarity"`
	}

	results := make([]ChunkItem, 0, len(searchResp.Chunks))
	for _, chunk := range searchResp.Chunks {
		results = append(results, ChunkItem{
			ID:            chunk.Id,
			Content:       chunk.Content,
			DocumentTitle: chunk.DocumentTitle,
			SourceURL:     chunk.SourceUrl,
			Similarity:    chunk.Similarity,
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"query":       query,
		"total":       len(results),
		"latency_ms":  embResp.LatencyMs,
		"model_used":  embResp.ModelUsed,
		"results":     results,
	})
}

// IngestYouTube mengekstrak transkrip YouTube, chunking, embedding, dan menyimpannya ke pgvector.
func (h *Handler) IngestYouTube(c echo.Context) error {
	var req IngestYouTubeRequest
	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Payload request tidak valid")
	}

	req.URL = strings.TrimSpace(req.URL)
	if req.URL == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "URL YouTube wajib diisi")
	}
	if req.Title == "" {
		req.Title = "YouTube Video Knowledge"
	}
	if req.Language == "" {
		req.Language = "ID"
	}

	userID, _ := c.Get("user_id").(string)

	ctx, cancel := context.WithTimeout(c.Request().Context(), 90*time.Second)
	defer cancel()

	stream, err := h.grpcClients.KnowledgeBase.IngestDocument(ctx, &pb.IngestRequest{
		SourceType:   "YOUTUBE",
		SourceUrl:    req.URL,
		Title:        req.Title,
		Language:     strings.ToUpper(req.Language),
		TopicTags:    req.TopicTags,
		PersonaTags:  req.PersonaTags,
		IngestedById: userID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "Gagal memulai pipeline ingestion YouTube: "+err.Error())
	}

	var lastProgress *pb.IngestProgress
	for {
		progress, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Error saat ingestion YouTube: "+err.Error())
		}
		lastProgress = progress
		if progress.Status == "ERROR" {
			return echo.NewHTTPError(http.StatusUnprocessableEntity, progress.ErrorMessage)
		}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":           "COMPLETED",
		"title":            req.Title,
		"source_url":       req.URL,
		"chunks_processed": lastProgress.GetChunksProcessed(),
		"total_chunks":     lastProgress.GetTotalChunks(),
		"message":          lastProgress.GetCurrentStep(),
	})
}

// IngestPDF menerima upload file PDF, mengekstrak teks halaman, chunking, dan menyimpan vektor ke DB.
func (h *Handler) IngestPDF(c echo.Context) error {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "File PDF wajib disertakan (multipart form 'file')")
	}

	src, err := fileHeader.Open()
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal membaca file upload")
	}
	defer src.Close()

	fileBytes, err := io.ReadAll(src)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Gagal memproses byte file PDF")
	}

	title := strings.TrimSpace(c.FormValue("title"))
	if title == "" {
		title = fileHeader.Filename
	}
	language := strings.ToUpper(strings.TrimSpace(c.FormValue("language")))
	if language == "" {
		language = "ID"
	}

	topicTags := []string{}
	if rawTags := c.FormValue("topic_tags"); rawTags != "" {
		for _, t := range strings.Split(rawTags, ",") {
			if trimmed := strings.TrimSpace(t); trimmed != "" {
				topicTags = append(topicTags, trimmed)
			}
		}
	}

	userID, _ := c.Get("user_id").(string)

	ctx, cancel := context.WithTimeout(c.Request().Context(), 120*time.Second)
	defer cancel()

	stream, err := h.grpcClients.KnowledgeBase.IngestDocument(ctx, &pb.IngestRequest{
		SourceType:   "PDF",
		Title:        title,
		Language:     language,
		TopicTags:    topicTags,
		FileContent:  fileBytes,
		IngestedById: userID,
	})
	if err != nil {
		return echo.NewHTTPError(http.StatusBadGateway, "Gagal memulai pipeline ingestion PDF: "+err.Error())
	}

	var lastProgress *pb.IngestProgress
	for {
		progress, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Error saat ekstraksi/embedding PDF: "+err.Error())
		}
		lastProgress = progress
		if progress.Status == "ERROR" {
			return echo.NewHTTPError(http.StatusUnprocessableEntity, progress.ErrorMessage)
		}
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":           "COMPLETED",
		"filename":         fileHeader.Filename,
		"title":            title,
		"chunks_processed": lastProgress.GetChunksProcessed(),
		"total_chunks":     lastProgress.GetTotalChunks(),
		"message":          lastProgress.GetCurrentStep(),
	})
}
