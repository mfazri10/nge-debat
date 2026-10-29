# 04 — Batas Resource, Role Ingestion & Kuota (P1)

- Status: DRAFT
- Tanggal: 2026-10-29
- Acuan audit: branch `feature/base-code`

## Tujuan

Mencegah satu pengguna menghabiskan memori, DB, atau kuota AI lewat unggahan
besar, spam pesan WS, atau pembuatan sesi tanpa batas — dengan batas eksplisit
dan pesan error yang jelas.

## Temuan (kode yang sudah dibaca)

- `internal/knowledge/handler.go:188` — `IngestPDF` memakai `io.ReadAll` tanpa
  batas ukuran; file lalu dikirim utuh via gRPC (engine mengizinkan sampai 50MB,
  `main.py:30-31`) dan memicu ekstraksi + embedding berbayar.
- `cmd/server/main.go:124-127` — rute knowledge (termasuk ingestion YouTube/PDF)
  hanya butuh JWT, **tanpa cek peran admin**.
- `cmd/server/main.go:60` — rate limiter HTTP memakai memory store global (100),
  tidak per-pengguna dan tidak berlaku untuk pesan WS setelah koneksi terbentuk.
- `internal/debate/handler.go:111` — tiap pesan WS melahirkan goroutine;
  tiap argumen memicu embedding + search + LLM tanpa batas pesan per pengguna.
  Batas ukuran pesan 64KB ada (`handler.go:73`), batas *jumlah* tidak ada.
- `pkg/config/config.go:67` — `FREE_SESSIONS_PER_DAY` default 5; DDL punya
  `user_daily_usage`, tetapi `session/handler.go:Create` **tidak** mengecek
  maupun menginkremen kuota.
- Sudah baik: timeout gRPC per operasi di `pkg/grpcclient/client.go`
  (opponent 30s, scoring 15s, audience 8s, embedding 5s, search 3s) dan
  context timeout ingestion 90/120s (`knowledge/handler.go:134,213`).

## Keputusan

- K-1: **Batas unggah PDF**: body HTTP maks **15MB** (`4096` dievaluasi ulang
  saat pilot) ditolak dengan 413 sebelum dibaca penuh; engine menolak teks
  hasil ekstraksi > **200 ribu karakter** atau > **100 halaman** dengan error
  eksplisit. Batas diumumkan di respons error dan UI admin.
- K-2: **Ingestion khusus admin.** `POST /knowledge/ingest/*` wajib
  `RequireRole("ADMIN","SUPERADMIN")` (middleware dari spek 02 K-8).
  `GET /knowledge` (search) tetap untuk user terdaftar + rate limit sendiri.
- K-3: **Rate limit WS per koneksi**: maks **20 pesan/menit** per koneksi dan
  maks **1 argumen in-flight** per user per sesi (argumen baru saat AI masih
  memproses → tolak `RATE_LIMITED` dengan `retry_after_ms`, bukan antrean
  tanpa batas). Pelanggaran berulang → tutup koneksi dengan code 4409.
- K-4: **Kuota harian**: middleware `checkQuota` sebelum `POST /sessions` —
  Free maks 5 sesi/hari (zona Asia/Jakarta, tabel `user_daily_usage`),
  Pro tanpa batas. Kuota habis → 429
  `{ error: "DAILY_QUOTA_EXCEEDED", message_id: "Kuota harian Anda telah habis. ..." }`.
  Inkremen dalam transaksi yang sama dengan pembuatan sesi (anti race).
- K-5: **Rate limit REST per pengguna** (ganti memory store global): 60 req/menit
  per user untuk endpoint umum, 10 req/menit untuk ingestion/search, memakai
  Redis store agar konsisten antar-replika.
- K-6: **Batas argumen**: konten argumen maks **4000 karakter** (REST+WS);
  lebih → 400/WS error `ARGUMENT_TOO_LONG`. Mencegah prompt raksasa ke LLM.

## Non-goal

- Kuota berbasis token AI per user (butuh akuntansi token stabil — spek 05 dulu).
- WAF/CDN atau proteksi DDoS level jaringan.
- Antrean background Celery untuk ingestion (tetap streaming sinkron untuk pilot).

## Acceptance Criteria

- [ ] AC-1: Upload PDF 20MB → 413 sebelum ekstraksi; tidak ada job embedding yang jalan.
- [ ] AC-2: User role USER memanggil ingest → 403; ADMIN → lolos.
- [ ] AC-3: 25 pesan WS dalam 1 menit → pesan ke-21+ ditolak `RATE_LIMITED`.
- [ ] AC-4: 2 argumen bersamaan dalam 1 sesi → 1 diproses, 1 ditolak dengan `retry_after_ms`.
- [ ] AC-5: User Free membuat sesi ke-6 di hari yang sama → 429 `DAILY_QUOTA_EXCEEDED`; Pro → lolos.
- [ ] AC-6: 2 request paralel saat sisa kuota 1 → tepat 1 sesi tercipta.
- [ ] AC-7: Argumen 5000 karakter → 400/`ARGUMENT_TOO_LONG`, tanpa panggilan LLM.

## File target implementasi

- `cmd/server/main.go` — pasang `RequireRole` di rute ingestion, Redis rate limiter, `checkQuota` di `POST /sessions`.
- `internal/knowledge/handler.go` — batas body + teruskan batas ke engine.
- `internal/debate/handler.go` — limiter per koneksi + in-flight guard.
- `internal/session/handler.go` — cek + inkremen kuota transaksional.
- `apps/debate-engine/app/servicers/knowledge_servicer.py` — tolak teks/halaman berlebih.
- `apps/admin-panel` halaman RAG — tampilkan batas di UI upload.

## Verifikasi

1. Uji beban ringan per AC (curl + skrip WS) dengan timer; catat kode respons.
2. Uji race AC-6: 2 proses paralel → `SELECT session_count` = ekspektasi, tidak ada sesi ke-6.
3. Cek Redis: key rate limit terbentuk per user, bukan global.
4. Cek tagihan/log AI saat uji AC-1/AC-7: tidak ada panggilan embedding/LLM baru.

## PR lanjutan

- Kuota token AI per user/hari setelah akuntansi token stabil (spek 05).
- Kebijakan fair-use dan pesan upgrade Pro di mobile (spek monetisasi).
- Evaluasi angka batas (15MB/20/menit/4000 char) dari data pilot 2 minggu.
