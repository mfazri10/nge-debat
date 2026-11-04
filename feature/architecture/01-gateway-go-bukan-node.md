# 01 — Gateway Go + Engine Python via gRPC (bukan Node)

- Status: DRAFT
- Tanggal: 2026-11-03
- Acuan audit: branch `feature/base-code`

## Tujuan

Mengunci batas runtime yang sudah berjalan di kode — Go sebagai pintu
tunggal HTTP+WebSocket, Python sebagai engine AI stateless via gRPC —
dan menyatakan bagian PRD yang menyebut Node.js sebagai kedaluwarsa.

## Temuan (kode yang sudah dibaca)

- `PRD_DebateAI.md:902-906` — PRD §13.1/§13.2 menyebut API Gateway
  `Node.js + Express + TypeScript` dengan `Socket.IO`.
- `apps/api-gateway/cmd/server/main.go:25-27,53` — kode nyata memakai
  Echo (`github.com/labstack/echo/v4`), bukan Express.
- `apps/api-gateway/cmd/server/main.go:46,101,124,130-136` — Gateway
  membuka koneksi gRPC ke Debate Engine, mendaftarkan route REST
  (auth/user/persona/session/motion/template/knowledge), dan route
  WebSocket `GET /ws/debate/:sessionId`.
- `apps/api-gateway/internal/debate/hub.go:10,14-33` — hub WS memakai
  `gorilla/websocket` dengan tipe pesan `debate:*`, bukan Socket.IO.
- `proto/debate.proto:15-48` — kontrak antar service adalah gRPC
  `DebateEngine` (unary, server-streaming, dan bidi-streaming
  `OrchestrateDebate`), bukan REST internal.
- `apps/debate-engine/app/core/ai_factory.py:1-6` — engine memakai
  LangChain (Gemini/OpenAI/Anthropic); alasan Python adalah ekosistem AI.
- `docker-compose.yml:46-70` — Compose menjalankan `api-gateway` (Go)
  dan `debate-engine` (Python) sebagai dua service terpisah.

## Keputusan

- K-1: **Go (Echo) adalah satu-satunya pintu masuk HTTP+WebSocket.**
  Alasan: sudah berjalan, unggul untuk WS konkuren dan latensi rendah.
  Flutter dan Admin Panel dilarang memanggil engine Python langsung.
- K-2: **Python adalah engine AI stateless di belakang gRPC.**
  Alasan: ekosistem LangChain/multi-agent. Engine tidak menyimpan state
  sesi yang harus selamat dari restart (detail di ADR-03).
- K-3: **`proto/*.proto` adalah satu-satunya kontrak antar service.**
  Perubahan API internal = ubah `.proto` dulu, baru generate Go+Python.
  Kode generated (`gen/go`, `gen/python`) dilarang diedit manual.
- K-4: **PRD §13.1–§13.2 yang menyebut Node/Express/Socket.IO/Prisma
  runtime dinyatakan KEDALUWARSA.** Alasan: tidak sesuai kode berjalan.
  PRD tetap berlaku untuk produk, bukan untuk pilihan runtime.
- K-5: **Tidak menambah bahasa/runtime ketiga** sebelum ADR ini direvisi.
  Worker async ikut Python (Celery) atau Go, bukan runtime baru.

## Non-goal

- Menulis ulang Gateway ke Node atau engine ke Go.
- Memecah Gateway menjadi microservices (auth-service, session-service, ...).
- Keputusan skema database (itu ADR-02) dan kontrak WS rinci (itu ADR-03).

## Acceptance Criteria

- [x] AC-1: Dokumen ini DISETUJUI dan PRD §13 diberi catatan kedaluwarsa runtime (cara cek: baca PRD §13).
- [x] AC-2: Tidak ada route HTTP/WS yang dilayani engine Python langsung di Compose (cara cek: `docker-compose.yml` hanya expose 8080 ke publik, 50051 internal).
- [x] AC-3: Semua tipe pesan WS terdaftar di `hub.go` dan dipakai handshake Flutter (cara cek: grep `debate:` di `apps/mobile` cocok dengan `hub.go`).

## File target implementasi

- `PRD_DebateAI.md` §13 — tambah banner "runtime kedaluwarsa, lihat `feature/architecture/01-*`".
- `README.md` — pastikan diagram stack menyebut Go+Echo+gRPC (bukan Node).
- `docker-compose.yml` + `infra/docker-compose.yml` — kunci port internal (lihat spek 03).

## Verifikasi

1. `Select-String -Path apps/api-gateway/cmd/server/main.go -Pattern 'echo|grpcclient|/ws/debate'` → Echo + gRPC + WS terdaftar.
2. `Select-String -Path proto/debate.proto -Pattern 'service DebateEngine'` → kontrak gRPC ada.
3. Buka PRD §13 → ada catatan kedaluwarsa yang menunjuk ke ADR ini.

## PR lanjutan

- Benchmark WS Go vs kebutuhan 500 sesi konkuren (pemilik: ADR-03).
- Keputusan framework worker: Celery (Python) vs worker Go (pemilik: ADR-02).
