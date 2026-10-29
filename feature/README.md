# Indeks Spek Fondasi — DebateAI

> Folder `feature/` adalah tempat spek per-fitur. Isi awalnya adalah **spek fondasi** yang wajib
> dikunci sebelum spek fitur debat baru ditulis. Acuan audit: branch `feature/base-code`.

## Daftar spek fondasi (urutan pengerjaan)

| # | File | Status | Prioritas | Isi |
|---|---|---|---|---|
| 0 | `feature/README.md` (file ini) | DISETUJUI | — | Indeks, template, antrean fase berikut |
| 00 | `feature/00-daftar-kebutuhan.md` | DISETUJUI | — | Master backlog REQ-01–19 + urutan eksekusi |
| 1 | `feature/database/01-erd-sumber-kebenaran.md` | DRAFT | P0 | Satu sumber kebenaran skema, tutup selisih ERD/Prisma/DDL/kode |
| 2 | `feature/Backend/02-auth-otorisasi-sesi.md` | DRAFT | P0 | Token WS wajib, otorisasi sesi REST+WS, pencabutan akses |
| 3 | `feature/Backend/03-secret-tls-target-infra.md` | DRAFT | P0 | Tolak secret default, target pilot internal, TLS, batas jaringan |
| 4 | `feature/Backend/04-batas-resource-kuota.md` | DRAFT | P1 | Batas PDF, role admin ingestion, rate limit WS, kuota harian |
| 5 | `feature/Backend/05-observabilitas-biaya-ai.md` | DRAFT | P1 | Health ber-dependency, hapus embedding nol, telemetri jujur |

Nilai status: `DRAFT` → `DISETUJUI` → `DIIMPLEMENTASI` → `KEDALUWARSA`.
Ubah status dengan commit terpisah dan cantumkan tanggal + siapa yang menyetujui.

## Konvensi penulisan spek

1. Satu file = satu keputusan fondasi/fitur. Nama file: `<nomor-urut>-<nama-singkat>.md`.
2. Setiap klaim tentang kode wajib mencantumkan path + baris yang sudah dibaca,
   bukan mengutip dokumen lain. Contoh: `apps/api-gateway/internal/auth/middleware.go:63`.
3. Setiap spek wajib punya: Tujuan, Keputusan, Non-goal, Acceptance Criteria,
   File acuan/target, Verifikasi. Daftar uji harus bisa dijawab ya/tidak.
4. Ketidakpastian ditulis sebagai `PR lanjutan`, bukan asumsi diam-diam.
5. Klaim "selesai" hanya sah jika ada bukti: output perintah, hasil uji, atau tautan commit.

## Template baku spek

```markdown
# NN — Judul Spek

- Status: DRAFT | DISETUJUI | DIIMPLEMENTASI | KEDALUWARSA
- Tanggal: YYYY-MM-DD
- Acuan audit: branch `feature/base-code`

## Tujuan
Satu-dua kalimat: masalah apa yang dikunci spek ini.

## Temuan (kode yang sudah dibaca)
- `path/file:baris` — fakta singkat.

## Keputusan
- K-1: ... (alasan: ...)
- K-2: ...

## Non-goal
- Yang eksplisit TIDAK dikerjakan di spek ini.

## Acceptance Criteria
- [ ] AC-1: ... (cara cek: ...)

## File target implementasi
- `path/file` — perubahan yang diharapkan.

## Verifikasi
Perintah / langkah manual + bukti yang diharapkan.

## PR lanjutan
- Hal yang ditunda eksplisit + pemiliknya.
```

## Antrean fase berikut (bukan spek penuh)

Ditulis menjadi spek penuh hanya setelah spek 01–05 DISETUJUI dan P0 diimplementasikan.
Urutan sesuai alur pengguna solo vs AI (kode intinya sudah ada, tinggal dikeraskan):

1. **Arena solo vs AI** — lifecycle sesi, format debat, timer giliran, pesan WS.
2. **Juri & penonton AI** — rubrik 3 juri, agregasi skor, fallacy banner, crowd bar.
3. **Hasil & transkrip** — pemenang, rincian pilar, feedback narasi, riwayat sesi.
4. **RAG ingestion & kurasi** — pipeline YouTube/PDF, review chunk, retensi dokumen.
5. **Multiplayer room** — kode room, peran host/opponent/observer, penyelesaian sengketa giliran.
6. **Monetisasi & sosial** — langganan Pro, leaderboard, badge, share card.

## Cara pakai

0. Mulai dari `feature/00-daftar-kebutuhan.md` untuk melihat apa yang dibutuhkan dan urutannya.
1. Diskusikan satu spek DRAFT sampai semua keputusan disepakati.
2. Tandai `DISETUJUI` + tanggal. Implementasi kode mengacu ke spek ini.
3. Setelah kode lolos Acceptance Criteria, tandai `DIIMPLEMENTASI`.
4. Jika keputusan berubah, buat revisi spek (naikkan tanggal), jangan edit diam-diam.
