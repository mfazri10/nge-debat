import asyncio
import hashlib
import logging
from celery import Celery
from app.core.config import settings

logger = logging.getLogger(__name__)

# Inisialisasi Celery app dengan Redis broker & backend
celery_app = Celery(
    "debateai_engine",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Jakarta",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,        # 5 menit max per task
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)


@celery_app.task(name="app.tasks.healthcheck")
def healthcheck():
    """Liveness check untuk Celery worker."""
    return {"status": "ok", "env": settings.APP_ENV}


@celery_app.task(name="app.tasks.ingest_youtube_async", bind=True)
def ingest_youtube_async(self, url: str, title: str, language: str = "ID", topic_tags: list = None, ingested_by: str = None):
    """Ekstraksi transkrip YouTube secara asynchronous di background worker."""
    logger.info(f"[Celery:YouTube] Memulai ingestion: {url}")
    return asyncio.run(_run_youtube_ingestion(url, title, language, topic_tags or [], ingested_by))


async def _run_youtube_ingestion(url: str, title: str, language: str, topic_tags: list, ingested_by: str = None):
    import asyncpg
    from youtube_transcript_api import YouTubeTranscriptApi
    import re

    # 1. Ekstrak video ID
    match = re.search(r"(?:v=|youtu\.be/|embed/)([a-zA-Z0-9_-]{11})", url)
    if not match:
        raise ValueError(f"URL YouTube tidak valid: {url}")
    video_id = match.group(1)

    # 2. Ambil transkrip
    transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
    transcript = None
    lang_codes = [language.lower(), "id", "en"]
    for lc in lang_codes:
        try:
            transcript = transcript_list.find_transcript([lc])
            break
        except Exception:
            continue
    if transcript is None:
        transcript = transcript_list.find_generated_transcript(["id", "en"])

    entries = transcript.fetch()
    raw_text = " ".join(e["text"] for e in entries)

    # 3. Chunking teks
    words = raw_text.split()
    chunk_size = settings.RAG_CHUNK_SIZE
    overlap = settings.RAG_CHUNK_OVERLAP
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        start += chunk_size - overlap
        if end == len(words):
            break

    # 4. Generate embeddings via Gemini
    embeddings = []
    if settings.GEMINI_API_KEY:
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        emb_model = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=settings.GEMINI_API_KEY,
        )
        embeddings = await emb_model.aembed_documents(chunks)
    else:
        embeddings = [[0.0] * settings.EMBEDDING_DIMENSION for _ in chunks]

    # 5. Simpan ke PostgreSQL + pgvector
    db_url = settings.DATABASE_URL.replace("postgres+asyncpg://", "postgres://")
    conn = await asyncpg.connect(db_url)
    try:
        doc_id = await conn.fetchval(
            """
            INSERT INTO kb_documents (title, source_type, source_url, language, topic_tags, total_chunks, ingested_by)
            VALUES ($1, 'YOUTUBE', $2, $3, $4, $5, $6)
            RETURNING id
            """,
            title, url, language, topic_tags, len(chunks), ingested_by,
        )

        for i, (chunk_text, emb) in enumerate(zip(chunks, embeddings)):
            content_hash = hashlib.sha256(chunk_text.encode("utf-8")).hexdigest()
            embedding_str = "[" + ",".join(str(x) for x in emb) + "]"
            await conn.execute(
                """
                INSERT INTO kb_chunks (document_id, content, content_hash, chunk_index, embedding, token_count)
                VALUES ($1, $2, $3, $4, $5::vector, $6)
                ON CONFLICT (content_hash) DO NOTHING
                """,
                doc_id, chunk_text, content_hash, i, embedding_str, len(chunk_text.split()),
            )

        return {"status": "SUCCESS", "document_id": str(doc_id), "total_chunks": len(chunks)}
    finally:
        await conn.close()


@celery_app.task(name="app.tasks.calculate_elo")
def calculate_elo(winner_elo: int, loser_elo: int, k_factor: int = 32):
    """Menghitung perubahan rating ELO setelah debat selesai."""
    expected_winner = 1.0 / (1.0 + 10.0 ** ((loser_elo - winner_elo) / 400.0))
    expected_loser = 1.0 / (1.0 + 10.0 ** ((winner_elo - loser_elo) / 400.0))

    new_winner_elo = round(winner_elo + k_factor * (1.0 - expected_winner))
    new_loser_elo = round(loser_elo + k_factor * (0.0 - expected_loser))

    return {
        "winner_old": winner_elo,
        "winner_new": new_winner_elo,
        "winner_change": new_winner_elo - winner_elo,
        "loser_old": loser_elo,
        "loser_new": new_loser_elo,
        "loser_change": new_loser_elo - loser_elo,
    }
