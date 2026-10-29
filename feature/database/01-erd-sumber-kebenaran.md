# 01 — ERD & Sumber Kebenaran Skema

- Status: DRAFT
- Tanggal: 2026-10-29
- Acuan audit: branch `feature/base-code`

## Tujuan

Menetapkan satu sumber kebenaran skema database dan menutup selisih antara
ERD/Prisma (`Database_Design_Prisma.md`), DDL (`scripts/migrations/001_initial_schema.sql`),
dan query di kode Go/Python — sebelum fitur baru menambah tabel.

## Temuan (kode yang sudah dibaca)

- `scripts/migrations/001_initial_schema.sql` — DDL punya **24 tabel**: `users`,
  `oauth_providers`, `refresh_tokens`, `personas`, `debate_sessions`,
  `debate_participants`, `debate_arguments`, `judge_scores`, `audience_reactions`,
  `session_results`, `kb_documents`, `kb_chunks`, `subscriptions`, `ai_usage_logs`,
  `elo_histories`, `notification_tokens`, `kb_submissions`, `admin_audit_logs`,
  `user_reports`, `user_daily_usage`, `debate_motions`, `session_templates`,
  `badges`, `user_badges`. **Tidak ada** `moderation_logs`.
- `Database_Design_Prisma.md` — model Prisma punya `ModerationLog` dan `AdminAuditLog`
  sebagai dua model terpisah (dilaporkan `pr.md` §1).
- `apps/api-gateway/internal/auth/auth.go:82` — `Register` insert kolom
  `id, name, email, password_hash, role`; `Login` baca `is_banned, is_suspended`
  (`auth.go:117`); token refresh disimpan di `refresh_tokens` (`auth.go:262`).
- `apps/api-gateway/internal/session/handler.go` — sesi memakai `host_user_id`
  implisit (host = pembuat) + tabel `debate_participants` untuk keanggotaan;
  `SubmitArgument` menolak non-partisipan (`handler.go:335`).
- `docker-compose.yml:91` — `EMBEDDING_DIMENSION: "768"`; engine menghasilkan
  vektor 768 dimensi (`knowledge_servicer.py:109`); DDL `kb_chunks` harus 768.
- `pkg/config/config.go:67` — `FREE_SESSIONS_PER_DAY` default 5; DDL sudah punya
  `user_daily_usage`, tetapi `session/handler.go:Create` belum mengecek kuota.

## Keputusan

- K-1: **DDL SQL + migrasi bernomor adalah sumber kebenaran.** Alasan: kode Go
  (pgx) dan Python (asyncpg) query langsung ke PostgreSQL; tidak ada Prisma
  Client yang dipakai runtime. File Prisma/ERD menjadi turunan yang wajib
  diselaraskan setiap ada migrasi baru.
- K-2: **`ModerationLog` digabung, tidak dibuatkan tabel.** Alasan: DDL sudah
  punya `admin_audit_logs` (jejak aksi admin) dan `user_reports` (laporan +
  status review). Tabel ketiga tanpa pemilik fitur hanya menambah drift.
  Konsekuensi: hapus model `ModerationLog` dari Prisma/ERD, atau beri catatan
  eksplisit "tidak diimplementasikan" jika dipertahankan sebagai wacana.
- K-3: **Otorisasi sesi memakai dua lapis**: `debate_sessions.host_user_id`
  untuk kepemilikan, `debate_participants(user_id, session_id)` untuk
  keanggotaan. Setiap query baca/ubah sesi wajib melewati salah satu lapis ini
  (detail di spek 02).
- K-4: **Kuota harian**: `user_daily_usage` unique `(user_id, usage_date)`,
  reset per hari zona **Asia/Jakarta**, Free = 5 sesi/hari, Pro = tanpa batas.
  Inkremen dan pengecekan harus dalam satu transaksi pembuatan sesi.
- K-5: **Statistik user turunan, bukan sumber**: `total_sessions`, `total_wins`,
  `elo_rating`, `total_points` dihitung dari `session_results`/`elo_histories`;
  kolom di `users` hanya cache yang boleh di-recompute. Mencegah angka
  "hantu" saat hasil dihapus/diperbaiki.
- K-6: **KB**: dimensi embedding **768** tetap; `kb_chunks` wajib `is_active`,
  hash konten untuk deduplikasi, dan relasi ke `kb_documents` dengan
  `ON DELETE CASCADE` + aturan retensi di spek RAG nanti.
- K-7: **Tata kelola migrasi**: perubahan setelah instalasi awal memakai file
  `scripts/migrations/NNN_<nama>.sql` + smoke test migrate-from-empty dan
  migrate-from-seeded; seed wajib idempotent (guard `ON CONFLICT DO NOTHING`).

## Non-goal

- Mendesain tabel baru untuk classroom/organisasi, payment detail, atau notifikasi push.
- Menambah index lanjutan sebelum pola query final (cukup index hasil audit pola saat ini).
- Kebijakan retensi rinci per tabel (dicatat sebagai PR lanjutan).

## Acceptance Criteria

- [ ] AC-1: Ada ADR satu paragraf yang menyatakan DDL sebagai sumber kebenaran (cara cek: baca `pr.md` hasil revisi / catatan ADR).
- [ ] AC-2: Inventaris 24 tabel DDL → pemilik fitur + relasi + aturan akses, tanpa tabel yatim.
- [ ] AC-3: Selisih `ModerationLog` ditutup (dihapus dari Prisma/ERD atau ditandai tidak dipakai).
- [ ] AC-4: Prisma schema, ERD Mermaid, kamus data, dan DDL menyebut dimensi embedding 768 dan kolom otorisasi yang sama.
- [ ] AC-5: Template `scripts/migrations/002_example.sql` + perintah uji migrate-from-empty terdokumentasi.
- [ ] AC-6: Seed `001_seed_data.sql` idempotent (dijalankan 2x tanpa error duplikat).

## File target implementasi

- `Database_Design_Prisma.md` — hapus/selaraskan `ModerationLog`, kunci 768d, tambah catatan sumber kebenaran.
- `scripts/migrations/002_*.sql` (jika audit menemukan kolom/index kurang) — belum tentu ada; diputuskan saat inventaris.
- `pr.md` §1 — centang item yang ditutup spek ini, sisanya jadi PR lanjutan eksplisit.

## Verifikasi

1. `Select-String -Path scripts/migrations/001_initial_schema.sql -Pattern 'CREATE TABLE'` → 24 tabel, cocokkan satu per satu ke inventaris.
2. Cari `moderation_logs|ModerationLog` di repo → hanya muncul sebagai catatan "tidak dipakai" atau tidak sama sekali.
3. Jalankan seed 2x di DB lokal → tidak ada error unique violation.
4. Review sejawat: tiap tabel punya baris pemilik fitur + aturan akses.

## PR lanjutan

- Kebijakan retensi & penghapusan per tabel (pemilik: spek PDP/privasi nanti).
- Keputusan classroom/organisasi multi-tenant (pemilik: spek fase B2B).
- Index leaderboard & audit skala besar setelah target beban dikunci (spek 03).
