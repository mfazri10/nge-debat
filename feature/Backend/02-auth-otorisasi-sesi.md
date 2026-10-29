# 02 — Auth, Otorisasi Sesi REST & WebSocket (P0)

- Status: DRAFT
- Tanggal: 2026-10-29
- Acuan audit: branch `feature/base-code`

## Tujuan

Menutup akses lintas sesi: hanya pemilik/partisipan yang bisa membaca, mengubah,
atau mengakhiri sesinya — di REST maupun WebSocket. Ini gerbang keamanan sebelum
uji coba publik apa pun.

## Temuan (kode yang sudah dibaca)

- `internal/auth/middleware.go:63-67` — WS tanpa token diberi identitas tamu
  (`guest-user-<ip>`) dan diloloskan. REST menolak tanpa token (`middleware.go:17`).
- `internal/auth/middleware.go:70-72` — WS tidak memvalidasi signing method
  (REST memvalidasi HMAC di `middleware.go:29-34`).
- `internal/debate/handler.go:16-23` — `CheckOrigin` selalu `true` (TODO production).
- `internal/debate/handler.go:111` — tiap pesan WS diproses di goroutine baru tanpa batas.
- `internal/debate/handler.go:157-159,167,303-307` — aksi pause/resume/argument/forfeit
  memakai `sessionId` dari **payload**, bukan dari path koneksi (`:sessionId`).
- `internal/debate/handler.go:180-199` — pengirim yang bukan partisipan otomatis
  **didaftarkan** sebagai partisipan HOST (jalur "guest dev").
- `internal/session/handler.go:159-202,221,274` — `GetByID`, `Start`, `Pause`,
  `Resume`, `End`, `GetResults`, `GetTranscript` hanya butuh JWT valid, tanpa cek
  pemilik/partisipan. Siapa pun bertoken dengan ID sesi bisa membaca transkrip
  atau menghentikan sesi orang lain.
- Pola benar yang sudah ada: `SubmitArgument` menolak non-partisipan
  (`session/handler.go:335-338`) — dijadikan pola acuan.
- `internal/auth/auth.go:117-131` — cek banned/suspend hanya di `Login`; middleware
  JWT tidak mengecek status akun, sehingga token lama lolos sampai kedaluwarsa
  (default 15 menit, `config.go:64`).
- `apps/mobile/lib/core/constants/api_endpoints.dart:50-51` — token WS dikirim
  sebagai query param (`?token=`), rawan masuk log/proxy.

## Keputusan

- K-1: **Token WS wajib.** Hapus fallback tamu. Pengecualian demo lokal hanya via
  flag eksplisit (`ALLOW_WS_GUEST=true` + `APP_ENV=development`); build/staging
  produksi menolak koneksi tanpa token dengan 401.
- K-2: **Samakan validasi JWT WS dengan REST** (cek signing method HMAC, issuer,
  expiry). Satu fungsi verifikasi dipakai dua middleware.
- K-3: **Ikat sesi ke koneksi.** `sessionId` path (`/ws/debate/:sessionId`) adalah
  satu-satunya sumber; payload dengan `sessionId` berbeda → tolak dengan
  `INVALID_SESSION_BINDING` dan tutup koneksi setelah 3 pelanggaran.
- K-4: **Hapus auto-add partisipan.** Pengirim bukan partisipan → tolak dengan
  `FORBIDDEN_NOT_PARTICIPANT`, tanpa menulis ke DB.
- K-5: **Helper otorisasi tunggal** di paket session, dipakai REST dan WS:
  `RequireParticipant(ctx, sessionID, userID)` dan `RequireHost(ctx, sessionID, userID)`.
  Matriks akses:
  | Aksi | Syarat |
  |---|---|
  | `GET /sessions/:id`, hasil, transkrip | partisipan (+ admin, lihat K-8) |
  | `start/resume/end`, WS argument/forfeit | host ATAU partisipan sesi |
  | `pause` | host |
  | `POST /sessions/join` | kode room valid; join mendaftarkan partisipan USER (bukan HOST), maks 1x |
- K-6: **Transisi status dijaga**: `WAITING→ACTIVE→PAUSED→ACTIVE→COMPLETED`,
  `*→CANCELLED` (hanya host). Transisi ilegal → 409 `INVALID_STATUS_TRANSITION`.
- K-7: **Pencabutan akses**: tambah kolom `users.token_version` (default 1) +
  claim `tv` di JWT. Login/refresh/ban/suspend/hapus-akun menaikkan versi;
  middleware menolak token dengan `tv` lama. Batas toleransi: pencabutan berlaku
  ≤ 60 detik (cache Redis untuk versi).
- K-8: **Peran admin**: tambah middleware `RequireRole("ADMIN","SUPERADMIN")` untuk
  rute admin (dipakai penuh di spek 04 untuk ingestion; di sini untuk akses baca
  sesi oleh admin/moderator).
- K-9: **Token WS pindah dari URL ke header** (`Authorization: Bearer`) atau
  subprotocol WS. Masa transisi: terima keduanya selama 1 rilis, log peringatan
  tiap pemakaian query param, lalu cabut dukungan query param.

## Non-goal

- Social login Google/Apple (endpoint kini 501, `auth.go:149-151`) — spek tersendiri.
- Refresh token mobile di interceptor — dicatat di spek mobile nanti.
- Enkripsi isi argumen at-rest (cukup TLS + akses DB terbatas untuk pilot).

## Acceptance Criteria

- [ ] AC-1: WS tanpa token di `APP_ENV=production` → 401, tanpa identitas tamu.
- [ ] AC-2: WS dengan `Origin` di luar allowlist → handshake ditolak.
- [ ] AC-3: Payload `sessionId` ≠ path sesi → `INVALID_SESSION_BINDING`.
- [ ] AC-4: Non-partisipan kirim argumen → `FORBIDDEN_NOT_PARTICIPANT`, tidak ada baris baru di `debate_participants`/`debate_arguments`.
- [ ] AC-5: User B memanggil `GET /sessions/:id`, hasil, transkrip, start/pause/resume/end milik user A → 403/404 tanpa bocor isi.
- [ ] AC-6: Pause oleh non-host → 403; `COMPLETED→ACTIVE` → 409.
- [ ] AC-7: Setelah ban/suspend/hapus akun, access token lama ditolak ≤ 60 detik.
- [ ] AC-8: Join room valid mendaftarkan tepat 1 partisipan USER; join ganda idempotent.

## File target implementasi

- `apps/api-gateway/internal/auth/middleware.go` — hapus guest, samakan validasi, cek `tv`, `RequireRole`.
- `apps/api-gateway/internal/auth/auth.go` — tambah claim `tv`, naikkan versi saat ban/suspend/hapus.
- `apps/api-gateway/internal/debate/handler.go` — origin allowlist, binding sesi, hapus auto-add.
- `apps/api-gateway/internal/session/handler.go` — pasang `RequireParticipant`/`RequireHost` di semua handler + guard transisi.
- `apps/api-gateway/internal/session/store.go` — helper otorisasi + kenaikan versi token.
- `apps/mobile/lib/core/constants/api_endpoints.dart` + WS client — kirim token via header/subprotocol.
- `scripts/migrations/002_*.sql` — kolom `users.token_version`.

## Verifikasi

1. Uji manual per AC dengan 2 akun (A pemilik, B penyerang): catat status kode tiap skenario.
2. Uji otomatis wajib (baru): tabel-driven test untuk matriks K-5 + K-6 dan skenario K-7.
3. Grep regresi: tidak ada lagi string `guest-user-` di luar blok flag demo; tidak ada `CheckOrigin` yang selalu true di luar development.
4. Cek DB pasca-uji AC-4: `SELECT COUNT(*) FROM debate_participants WHERE session_id=...` tidak bertambah.

## PR lanjutan

- Rate limit & backpressure WS → spek 04.
- Audit log tiap penolakan 403 (korelasi dengan `admin_audit_logs`) → spek 05.
- Kebijakan retensi transkrip sesi privat → spek PDP/privasi.
