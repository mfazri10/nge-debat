# 02 — Satu Postgres + pgvector sebagai Sumber Kebenaran Data

- Status: DRAFT
- Tanggal: 2026-11-03
- Acuan audit: branch `feature/base-code`

## Tujuan

Menetapkan satu sumber kebenaran untuk setiap jenis data — Postgres
untuk fakta, Redis untuk state sementara, R2/S3 untuk blob — agar tidak
ada angka "hantu" dan tidak ada infra vector DB kedua yang belum perlu.

## Temuan (kode yang sudah dibaca)

- `scripts/migrations/001_initial_schema.sql` — DDL memiliki 24 tabel
  (`users` … `user_badges`); satu-satunya skema yang dipakai runtime
  Go (pgx) dan Python (asyncpg).
- `feature/database/01-erd-sumber-kebenaran.md:37-40` — spek 01 sudah
  memutuskan DDL SQL sebagai sumber kebenaran, Prisma/ERD sebagai turunan.
- `docker-compose.yml:6,30` — data layer saat ini: `pgvector/pgvector:pg17`
  dan `redis:7-alpine`; tidak ada vector DB terpisah.
- `docker-compose.yml:91` + `apps/debate-engine/app/servicers/knowledge_servicer.py:109`
  — dimensi embedding 768 (Gemini `text-embedding-004`).
- `apps/api-gateway/pkg/redisclient/redis.go:10-12` — wrapper `go-redis`
  sudah ada, dipakai untuk refresh token dan cache sesi.
- `apps/api-gateway/pkg/config/config.go:37-40` — config sudah menyiapkan
  field R2 (`R2AccountID/BucketName`), tetapi belum ada writer blob aktif.
- `apps/debate-engine/app/tasks/celery_app.py` — kerangka Celery + Redis
  broker sudah ada untuk job async (ingestion KB).
- `PRD_DebateAI.md:627-634` — target skala: 50rb chunk (launch) → 500rb
  chunk (tahun 1); 1.000 → 10.000 rps.

## Keputusan

- K-1: **Postgres + pgvector adalah satu-satunya sumber kebenaran fakta**
  (user, sesi, argumen, skor, chunk KB, langganan, audit). Alasan: satu
  transaksi ACID untuk sesi+argumen+skor; 500rb chunk masih muat di
  pgvector + index HNSW tanpa infra tambahan.
- K-2: **Dimensi embedding dikunci 768 (Gemini default).** Alasan: DDL,
  engine, dan Compose sudah 768. Ganti dimensi = migrasi skema + re-embed
  seluruh chunk, harus lewat ADR revisi.
- K-3: **Redis hanya untuk data yang boleh hilang**: presence koneksi,
  rate-limit counter, pub/sub antar-replika, circuit breaker provider AI,
  antrean Celery. Alasan: semua ini bisa di-rebuild dari Postgres atau
  dari koneksi ulang. Dilarang menyimpan fakta bisnis hanya di Redis.
- K-4: **Blob besar di R2/S3, bukan di Postgres**: PDF asli, audio STT/TTS,
  export JSON PDP. Postgres menyimpan hanya metadata + URL/key + hash.
  Alasan: menjaga tabel ramping dan backup DB tetap kecil.
- K-5: **Statistik user adalah turunan (cache), bukan sumber.**
  `total_sessions/wins/elo/points` dihitung ulang dari `session_results` /
  `elo_histories`. Alasan: mencegah angka hantu saat hasil diperbaiki.
  (Meneruskan spek 01 K-5.)
- K-6: **Ingestion KB wajib async via worker**, tidak di request HTTP.
  Status dokumen `pending → processing → ready/failed` dengan retry dan
  dedup hash SHA-256. Alasan: ingest 1 video <5 menit tidak boleh menahan
  koneksi HTTP atau menghabiskan memori gateway.
- K-7: **Tidak menambah database kedua** (Qdrant, Elastic, dsb.) sebelum
  pgvector terbukti gagal di uji beban 500rb chunk + 5.000 sesi konkuren.
  Ambang revisi ditulis di ADR-03.

## Non-goal

- Desain tabel baru classroom/organisasi/payment-detail (fase B2B).
- Kebijakan retensi per tabel (dicatat sebagai PR lanjutan).
- Migrasi dimensi embedding ke 1536 (OpenAI) — ditunda eksplisit.

## Acceptance Criteria

- [ ] AC-1: Ada daftar 24 tabel → pemilik fitur + aturan akses, tanpa tabel yatim (cara cek: inventaris spek 01 AC-2).
- [ ] AC-2: `kb_chunks.embedding` 768 di DDL, Prisma, dan engine (cara cek: grep `768|vector(` ketiga file cocok).
- [ ] AC-3: Tidak ada fakta bisnis yang hanya ditulis ke Redis (cara cek: grep `redisclient.*Set` → semua key punya TTL + sumber rebuild).
- [ ] AC-4: Ingest YouTube/PDF mengembalikan job-id dalam <2 dtk dan status bisa di-poll (cara cek: panggil endpoint, terima 202 + `job_id`).

## File target implementasi

- `Database_Design_Prisma.md` — selaraskan 768d + hapus `ModerationLog` ganda (milik spek 01).
- `scripts/migrations/002_*.sql` — hanya jika inventaris menemukan kolom/index kurang.
- `apps/api-gateway/internal/knowledge/handler.go` — ubah ingest sinkron menjadi enqueue 202.
- `apps/debate-engine/app/tasks/` — worker ingest + update status dokumen.

## Verifikasi

1. `Select-String -Path scripts/migrations/001_initial_schema.sql -Pattern 'CREATE TABLE'` → 24 tabel.
2. `Select-String -Path docker-compose.yml -Pattern 'pgvector|redis:7'` → hanya 2 data service.
3. Panggil `POST /v1/knowledge/ingest/youtube` → respons 202 + `job_id`, bukan menunggu 5 menit.

## PR lanjutan

- Uji beban pgvector 500rb chunk + HNSW tuning (pemilik: ADR-03).
- Keputusan retensi chunk usang + arsip sesi lama (pemilik: spek PDP nanti).
- Aktifkan writer R2 untuk PDF/audio (pemilik: spek ingestion).
