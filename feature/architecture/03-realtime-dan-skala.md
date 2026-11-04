# 03 — Real-time, Skala, dan Batas Beban

- Status: DRAFT
- Tanggal: 2026-11-03
- Acuan audit: branch `feature/base-code`

## Tujuan

Mengunci kontrak real-time WebSocket dan strategi skala — kapan 1 VPS
cukup, kapan harus multi-replika — berdasarkan target beban PRD, agar
keputusan infra (pub/sub, stateless, uji beban) tidak ditebak.

## Temuan (kode yang sudah dibaca)

- `PRD_DebateAI.md:616-643` — NFR: respons lawan <5 dtk (p95), juri <8 dtk,
  latensi WS <200ms, resume sesi jika putus <60 dtk; skala 500 sesi konkuren
  (launch) → 5.000 (tahun 1); uptime 99,5%.
- `apps/api-gateway/cmd/server/main.go:60,134-136` — rate limiter masih
  memory-store; WS terdaftar dengan middleware WS khusus.
- `apps/api-gateway/internal/debate/hub.go:48-56` — `Client` menyimpan
  `sessionID+userID` per koneksi; hub in-memory per proses (tanpa pub/sub).
- `apps/api-gateway/internal/debate/handler.go:111` (dilaporkan spek 02) —
  tiap pesan WS memicu goroutine baru tanpa batas; rate limit HTTP tidak
  membatasi pesan setelah koneksi terbentuk.
- `proto/debate.proto:48` — tersedia bidi-streaming `OrchestrateDebate`
  untuk 1 koneksi gRPC per sesi (opponent+juri+audience sekaligus).
- `apps/debate-engine/app/core/ai_factory.py:10-12` — circuit breaker
  masih in-memory per proses (`_failure_counts`, `_circuit_open`).
- `apps/debate-engine/app/servicers/debate_servicer.py:33` (dilaporkan
  backlog REQ-08) — state sesi `_sessions` dict in-memory tanpa TTL.
- `docker-compose.yml:26-41` — Redis 7 tersedia sebagai kandidat pub/sub
  dan store circuit breaker terdistribusi.

## Keputusan

- K-1: **Kontrak WS per koneksi**: 1 koneksi = 1 sesi (path `:sessionId`
  mengikat); token wajib; maks 20 pesan/menit per koneksi; maks 1 argumen
  AI in-flight per sesi; pesan `sessionId` yang tidak cocok → tolak
  `INVALID_SESSION_BINDING`. (Rincian auth di spek 02, rate di spek 04.)
- K-2: **Gateway stateless kecuali koneksi lokal.** State sesi yang harus
  selamat (transkrip, skor, status) hanya di Postgres. Restart gateway
  boleh memutus WS, tetapi sesi bisa di-resume dari DB (<60 dtk).
- K-3: **Engine stateless + TTL.** Hapus dict sesi abadi; tiap entri sesi
  wajib TTL (mis. 2 jam) + batas ukuran + cleanup saat sesi end/CANCELLED.
  Engine boleh di-scale horizontal tanpa sticky session.
- K-4: **Redis pub/sub aktif saat gateway >1 replika.** Pesan kontrol admin
  (force-pause/terminate) dan broadcast sesi disebar via Redis, bukan
  memori lokal. Dengan 1 replika, pub/sub boleh nonaktif (fallback lokal).
- K-5: **Circuit breaker provider AI pindah ke Redis** (mengganti in-memory
  `ai_factory.py`). Alasan: status provider harus konsisten antar-replika
  engine dan terlihat di dashboard telemetri.
- K-6: **Dua target beban yang dikunci**:
  - Pilot internal: ≤50 sesi konkuren, 1 VPS, 1 replika tiap service.
  - Publik launch: 500 sesi konkuren, gateway ≥2 replika + Redis pub/sub,
    engine ≥2 replika, Postgres managed + backup 6 jam.
  - Tahun 1 (5.000 konkuren) = PR lanjutan, bukan target ADR ini.
- K-7: **Uji beban adalah gerbang naik tingkat.** Naik dari pilot ke publik
  wajib lolos: 500 WS konkuren × 10 menit, p95 lawan <5 dtk, retrieval RAG
  <1 dtk di 50rb chunk, tidak ada OOM. Hasilnya dilampirkan di PR.

## Non-goal

- Autoscaling K8s/HPA dan multi-region (ditunda sampai target tahun 1).
- Protokol voice real-time (WebRTC) — arena v1 tetap teks + STT/TTS file.
- Detail tarif/budget token AI (milik spek 05 + keputusan produk).

## Acceptance Criteria

- [ ] AC-1: Batas WS (20/mnt, 1 in-flight) ditegakkan dan diuji (cara cek: uji spam 30 pesan → pesan ke-21+ ditolak 429/WS error).
- [ ] AC-2: Resume sesi <60 dtk bekerja setelah gateway restart (cara cek: matikan gateway 10 dtk → reconnect → transkrip utuh dari DB).
- [ ] AC-3: Circuit breaker terlihat konsisten di 2 replika engine (cara cek: matikan 1 provider → kedua replika fallback sama).
- [ ] AC-4: Hasil uji beban pilot (50 konkuren) terdokumentasi sebelum klaim "siap pilot".

## File target implementasi

- `apps/api-gateway/internal/debate/` — binding sesi, rate limit WS, 1 in-flight (spek 02+04).
- `apps/api-gateway/internal/session/` — resume dari DB, transisi status (spek 02).
- `apps/debate-engine/app/servicers/debate_servicer.py` — TTL sesi (REQ-08).
- `apps/debate-engine/app/core/ai_factory.py` — circuit Redis (spek 05).
- `infra/` — Compose basis + override pilot/publik (spek 03).

## Verifikasi

1. Spam WS 30 pesan/menit → 20 lolos, sisanya ditolak; 1 sesi tidak pernah punya 2 respons AI paralel.
2. Restart gateway di tengah sesi → klien reconnect dan lanjut dari ronde terakhir.
3. `ai_factory` membaca/menulis status circuit ke Redis (bukan dict lokal).
4. Laporan uji beban pilot tersimpan di `docs/` atau lampiran PR.

## PR lanjutan

- Desain skala tahun 1 (5.000 konkuren): HPA, connection draining, read-replica Postgres.
- Pilih strategi broadcast crowd-bar di 5.000 sesi (sampling vs full-fanout).
- SLO biaya AI per sesi (pemilik: produk + spek 05).
