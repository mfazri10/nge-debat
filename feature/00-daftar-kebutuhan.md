# 00 — Daftar Kebutuhan (Master Backlog)

- Status: DISETUJUI
- Tanggal: 2026-10-29
- Acuan audit: branch `feature/base-code`

> Indeks semua kebutuhan (REQ-01–19) berdasarkan kondisi nyata kode, bukan klaim
> dokumen. REQ yang sudah punya spek rinci menaut ke file speknya; sisanya ditulis
> menjadi spek penuh sesuai urutan eksekusi. Lihat juga `feature/README.md`.

## Ringkasan kondisi saat ini

- **Nyata dan berisi**: gateway Go (11 file handler, rute lengkap, JWT + refresh
  token, hub WS + orkestrator gRPC), engine Python (opponent, 3 juri
  LOGIKA/RETORIKA/DAMPAK, audience, knowledge servicer), mobile Flutter (22 file:
  login, lobby, arena, hasil, profil), DDL 24 tabel + seed, 3 file proto.
- **Lemah/palsu**: otorisasi sesi REST+WS, secret default, gRPC tanpa TLS, angka
  dashboard admin hardcoded, auth mobile (bypass login, tanpa refresh, token di
  SharedPreferences), ingestion tanpa batas/role, embedding fallback vektor-nol.
- **Nol**: test proyek, CI, Makefile. Compose ganda yang sudah menyimpang.

## Daftar kebutuhan

### Fondasi (spek sudah ada — tinggal implementasi)

- [ ] **REQ-01 — Sumber kebenaran skema.** Apa: kunci DDL sebagai sumber kebenaran,
  tutup selisih Prisma/DDL/kode. Bagaimana: ADR + inventaris 24 tabel + hapus
  `ModerationLog` ganda. Prioritas: P0. Spek: `feature/database/01-erd-sumber-kebenaran.md`.
- [ ] **REQ-02 — Otorisasi sesi REST+WS.** Apa: tutup akses lintas sesi + cabut
  token akun terblokir. Bagaimana: token WS wajib, binding sesi ke koneksi,
  `RequireParticipant`/`RequireHost`, `token_version`. Prioritas: P0.
  Spek: `feature/Backend/02-auth-otorisasi-sesi.md`.
- [ ] **REQ-03 — Secret, TLS, target infra.** Apa: tolak secret default, kunci
  pilot internal, tutup port internal. Bagaimana: fail-fast `mustEnv`, Compose
  basis + override pilot, reverse proxy HTTPS/WSS, token internal gRPC.
  Prioritas: P0. Spek: `feature/Backend/03-secret-tls-target-infra.md`.
- [ ] **REQ-04 — Batas resource & kuota.** Apa: batas PDF, role admin ingestion,
  rate limit WS, kuota harian Free. Bagaimana: 15MB/200rb char/100 hal, 20 pesan
  WS/menit, 1 argumen in-flight, 429 kuota habis. Prioritas: P1.
  Spek: `feature/Backend/04-batas-resource-kuota.md`.
- [ ] **REQ-05 — Observabilitas & biaya AI.** Apa: health ber-dependency, hapus
  vektor-nol, akuntansi token jujur. Bagaimana: `/health/live`+`/ready`, gagal
  terbuka embedding, factory lapor provider aktual, circuit di Redis, tulis
  `ai_usage_logs`, badge `MOCK` di admin. Prioritas: P1.
  Spek: `feature/Backend/05-observabilitas-biaya-ai.md`.

### Backend lanjutan (butuh spek)

- [ ] **REQ-06 — Endpoint admin nyata.** Apa: sesi aktif, intip live, force
  pause/terminate, moderasi user (warn/suspend/ban), audit log. Kondisi kini:
  tidak ada handler/store-nya; admin hanya membungkus personas/knowledge/motions
  (`apps/admin-panel/src/lib/api.ts`). Bagaimana: handler + store baru dengan
  `RequireRole`; halaman admin disambung bertahap. Prioritas: P1.
- [ ] **REQ-07 — Join room mendaftarkan partisipan.** Apa: `POST /sessions/join`
  kini hanya mengembalikan sesi (`internal/session/handler.go:208`). Bagaimana:
  insert partisipan USER idempotent + batas kapasitas + tolak join sesi selesai.
  Prioritas: P1.
- [ ] **REQ-08 — State sesi engine diberi TTL.** Apa: dict `_sessions` in-memory
  tak terbatas (`debate_servicer.py:33`) → bocor memori. Bagaimana: TTL per sesi
  + batas ukuran + cleanup saat sesi end/CANCELLED. Prioritas: P1.

### Engine AI (ditutup REQ-05 + spek lanjutan)

- [ ] **REQ-09 — Provider aktual + circuit Redis.** Ditutup oleh REQ-05 (K-3, K-4).
  Bukti kini: `opponent.py:99` lapor provider yang diminta; circuit in-memory
  (`ai_factory.py:11-12`) + TODO recovery. Prioritas: P1.
- [ ] **REQ-10 — Hapus fallback vektor-nol.** Ditutup oleh REQ-05 (K-2). Bukti:
  `knowledge_servicer.py:107-115`. Prioritas: P1.
- [ ] **REQ-11 — Tulis `ai_usage_logs` tiap panggilan AI.** Ditutup oleh REQ-05
  (K-5). Prioritas: P1.

### Mobile (butuh spek)

- [ ] **REQ-12 — Refresh token + secure storage.** Apa: isi handler 401
  (`api_client.dart:32-34`), pindah token dari SharedPreferences ke secure
  storage. Bagaimana: interceptor refresh + antre request saat refresh berjalan.
  Prioritas: P1.
- [ ] **REQ-13 — Hapus bypass login dari rilis.** Apa: login gagal tetap ke lobby
  (`login_screen.dart:34-37`), tombol tamu (`login_screen.dart:124-130`),
  kredensial demo hardcoded (`login_screen.dart:15-16`). Bagaimana: tampilkan
  error saat gagal; mode demo hanya via flag build eksplisit. Prioritas: P0.
- [ ] **REQ-14 — Token WS via header + URL per-env.** Apa: token kini di query
  param (`api_endpoints.dart:50-51`), http/ws hardcoded (`api_endpoints.dart:14-15`).
  Bagaimana: header/subprotocol + `--dart-define` base URL; rilis = https/wss.
  Prioritas: P1.

### Admin panel (butuh spek)

- [ ] **REQ-15 — Sambung halaman ke API nyata.** Apa: sessions/moderation/telemetry
  masih statis/mock (`stat-cards.tsx:16,29-31` hardcoded). Bagaimana: butuh
  REQ-06 + REQ-05 K-6; sementara badge `MOCK` di tiap widget tanpa sumber.
  Prioritas: P2.
- [ ] **REQ-16 — Upload PDF dari admin.** Apa: `api.ts` belum punya `ingestPDF`.
  Bagaimana: tambah client + UI batas (ikut REQ-04 K-1/K-2). Prioritas: P2.

### Kualitas rekayasa

- [ ] **REQ-17 — Test fondasi + CI.** Apa: nol test proyek, nol CI (terverifikasi:
  hanya test bawaan `node_modules`). Bagaimana: test Go (auth, matriks otorisasi,
  race kuota, binding WS) + pytest engine (fallback, embedding gagal) + workflow
  CI (lint, test, build, cek migrasi). Prioritas: P1, dimulai paralel sejak awal.
- [ ] **REQ-18 — Satukan Compose ganda.** Apa: `docker-compose.yml` vs
  `infra/docker-compose.yml` hampir sama dan sudah menyimpang (default JWT beda).
  Bagaimana: ditutup REQ-03 (K-6): basis + override pilot. Prioritas: P1.

### Dokumentasi

- [ ] **REQ-19 — Selaraskan status dokumen.** Apa: `FEATURE_LIST.md` dan
  `execute_plan.md` mengklaim selesai berlebihan; README admin masih template
  Next.js. Bagaimana: tandai tiap fitur NYATA/MOCK/BELUM dengan bukti file;
  tulis ulang README admin. Prioritas: P2.

## Urutan eksekusi

1. REQ-01–05 (fondasi) + REQ-13 (bypass login, P0 murah) + mulai REQ-17 paralel.
2. REQ-06–08 (backend lanjutan).
3. REQ-09–11 (sudah tercakup REQ-05; implementasi mengikuti).
4. REQ-12, REQ-14 (mobile).
5. REQ-15–16 (admin).
6. REQ-19 (docs) + tutup REQ-18 bersama REQ-03.

Fitur debat baru (arena lanjutan, multiplayer, monetisasi) masuk antrean di
`feature/README.md` dan baru dispek setelah fondasi DISETUJUI + P0 diimplementasikan.

## Cara pakai

- Saat REQ "butuh spek" mulai dikerjakan: buat file spek bernomor lanjut
  (06, 07, ...) mengikuti template di `feature/README.md`, lalu ganti status
  REQ di file ini menjadi `Ada spek: <path>`.
- Centang `[x]` hanya saat Acceptance Criteria speknya lolos dengan bukti.
- REQ baru ditambahkan dengan nomor lanjut (REQ-20, ...) + bukti kondisi kini.
