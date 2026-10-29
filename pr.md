# PR Aplikasi DebateAI — Daftar Pekerjaan Lanjutan

> **Arti PR di dokumen ini:** pekerjaan rumah/daftar kerja proyek, bukan pull request GitHub.
>
> Tujuan dokumen ini adalah merangkum keputusan dan pekerjaan yang masih perlu ditinjau sebelum tim menyatakan desain final atau aplikasi siap dipakai publik. Semua item dimulai sebagai belum dikerjakan; checklist lama yang menyatakan “100% selesai” perlu diverifikasi terhadap kode dan perilaku nyata.

## Ringkasan status saat ini

- Rancangan [Database_Design_Prisma.md](Database_Design_Prisma.md) memiliki model `ModerationLog`, tetapi tabel tersebut belum terlihat di [migrasi SQL utama](scripts/migrations/001_initial_schema.sql). Perlu diputuskan apakah tabel ini memang dibutuhkan terpisah dari `AdminAuditLog`.
- [Implementation_Plan_DebateAI.md](Implementation_Plan_DebateAI.md) masih memuat beberapa rencana Node.js/Express, Prisma, dan Socket.IO. Kode yang ada sekarang memakai Gateway Go, gRPC, WebSocket Gorilla, dan query PostgreSQL melalui pgx. Dokumen harus diselaraskan dengan arsitektur yang benar-benar dipilih.
- Rencana infrastruktur produksi menyebut GCP Jakarta/GKE, Cloud SQL, dan Memorystore, sedangkan Compose yang ada adalah stack lokal. Belum ada keputusan implementasi staging/production yang tervalidasi.
- [FEATURE_LIST.md](FEATURE_LIST.md) dan [execute_plan.md](execute_plan.md) menyatakan banyak area selesai, tetapi daftar fitur yang belum selesai dan bagian admin statis menunjukkan bahwa status perlu diaudit ulang per alur end-to-end.
- Tinjauan kode sebelumnya menemukan risiko akses lintas sesi, secret default, gRPC tanpa TLS, dan batas unggahan PDF yang belum eksplisit. Isu keamanan tersebut menjadi gerbang sebelum beta publik.

## 1. PR: audit dan persetujuan ERD / rancangan database

### 1.1 Tetapkan kebutuhan data sebelum menyetujui ERD

- [ ] Tetapkan segmen pengguna utama untuk MVP: mahasiswa NUDC/KDMI, pelajar, atau pengguna umum.
- [ ] Tetapkan jenis sesi yang benar-benar masuk MVP: latihan user vs AI, sesi privat dengan observer, atau multiplayer user vs user.
- [ ] Tetapkan role dan kewenangan: user, moderator, admin, dan superadmin; dokumentasikan operasi yang boleh dilakukan masing-masing.
- [ ] Putuskan apakah skema sejak awal perlu mendukung sekolah sebagai organisasi/tenant, kelas, guru, siswa, dan undangan; jika ya, semua data kelas dan sesi harus dibatasi pada sekolah yang berwenang.
- [ ] Tentukan kebijakan retensi dan penghapusan untuk profil, transkrip, skor, laporan moderasi, log audit, data AI, dan dokumen KB.
- [ ] Tentukan apakah hasil skor, ELO, kuota, badge, dan statistik disimpan sebagai data utama atau dihitung dari rekaman sesi.

### 1.2 Cocokkan ERD, Prisma, DDL, dan query aplikasi

- [ ] Buat inventaris per entitas: model Prisma, tabel SQL, siapa yang menulis/membaca, dan fitur yang menggunakannya.
- [ ] Selesaikan selisih `ModerationLog` dengan `moderation_logs` yang ada di Prisma/ERD tetapi tidak ada di DDL: tambahkan tabel, gabungkan dengan `admin_audit_logs`, atau hapus model yang tidak dipakai.
- [ ] Periksa seluruh relasi foreign key, nullability, unique constraint, default, enum, index, dan aturan `ON DELETE` terhadap alur nyata.
- [ ] Tinjau relasi `User` ↔ `DebateSession` ↔ `DebateParticipant` ↔ `DebateArgument`; pastikan ownership dan membership dapat digunakan untuk otorisasi setiap query.
- [ ] Tinjau apakah `SessionResult`, `JudgeScore`, dan `AudienceReaction` memiliki siklus hidup dan constraint yang mencegah hasil ganda atau data yatim.
- [ ] Tinjau konsistensi `users.total_sessions`, `total_wins`, `elo_rating`, dan `total_points` dengan sumber transaksi yang menghasilkan nilainya.
- [ ] Tinjau kuota harian: constraint unik user/tanggal, zona waktu reset, transaksi serentak, dan beda aturan pengguna Free/Pro.
- [ ] Tinjau KB: hubungan dokumen/chunk, deduplikasi hash, status aktif, sumber, hak penggunaan, bahasa, tanggal terbit, dan konsistensi dimensi embedding 768.
- [ ] Tinjau index berdasarkan pola query sebenarnya; tambahkan rencana index untuk transkrip, laporan, audit, penggunaan AI, dan pencarian leaderboard jika fitur tersebut disetujui.
- [ ] Tinjau skema soft-delete dan ekspor data PDP: data apa yang dianonimkan, dihapus, tetap dipertahankan, dan berapa lama.

### 1.3 Putuskan sumber kebenaran dan tata kelola migrasi

- [ ] Putuskan satu sumber kebenaran skema: DDL SQL dan migrasi, atau Prisma schema + generator/migrasi. Catat keputusan ini sebagai ADR.
- [ ] Selaraskan ERD, Prisma, DDL, seed, query Go/Python, dan dokumentasi setelah keputusan dibuat.
- [ ] Tetapkan tool dan pola migrasi untuk perubahan setelah instalasi awal; jangan mengandalkan skrip Docker init yang hanya berjalan pada volume database baru.
- [ ] Definisikan cara menguji migrasi dari database kosong dan memperbarui database yang sudah berisi data.
- [ ] Tetapkan proses backup sebelum migrasi berisiko, rollback atau forward-fix, dan perlindungan agar seed tidak menggandakan data.

### Kriteria selesai ERD

- [ ] Semua entitas di ERD memiliki pemetaan ke tabel atau alasan eksplisit untuk tidak dibuat.
- [ ] Semua tabel pada DDL memiliki pemilik fitur, relasi, aturan akses, serta kebutuhan retensi yang terdokumentasi.
- [ ] Selisih antara Prisma, ERD, DDL, dan kode query sudah ditutup atau dicatat sebagai keputusan yang disetujui.
- [ ] ERD versi final, data dictionary, dan migrasi pertama disetujui sebelum fitur baru menambah tabel.

## 2. PR: keputusan dan rancangan infrastruktur

### 2.1 Pilih target deployment dan skala awal

- [ ] Tetapkan target tahap pertama: lokal, pilot internal, beta terbatas, atau peluncuran publik.
- [ ] Tetapkan cloud/provider, region, batas anggaran bulanan, target concurrent sessions, dan asumsi volume pengguna.
- [ ] Bandingkan opsi untuk MVP: Compose pada VM/container sederhana versus GKE/Kubernetes. Pilih kompleksitas sesuai kebutuhan awal; jangan menganggap GKE sebagai keputusan final hanya karena ada di dokumen.
- [ ] Putuskan apakah GCP Jakarta tetap menjadi target, termasuk Cloud SQL/pgvector, Redis terkelola, object storage, registry, dan CDN/WAF.
- [ ] Buat estimasi biaya per sesi: panggilan lawan AI, tiga juri, audiens, embedding, penyimpanan, dan trafik. Tetapkan batas biaya dan kuota Free/Pro.

### 2.2 Gambar arsitektur dan batas jaringan

- [ ] Buat diagram deployment untuk Mobile/Web → API Gateway → gRPC Engine → PostgreSQL/pgvector, Redis, Celery Worker, dan object storage.
- [ ] Tandai layanan yang dapat diakses publik dan layanan yang hanya boleh ada di jaringan privat.
- [ ] Tentukan apakah gRPC engine, database, dan Redis tidak dipublikasikan ke host/internet; dokumentasikan port dan akses yang diperlukan.
- [ ] Tetapkan TLS untuk HTTPS, WSS, dan komunikasi antarservice; definisikan manajemen sertifikat dan rotasinya.
- [ ] Tentukan penggunaan object storage untuk PDF/audio, batas ukuran, retensi, enkripsi, dan kebijakan URL akses.
- [ ] Putuskan topologi WebSocket untuk lebih dari satu Gateway: Redis Pub/Sub/adapter, session affinity bila perlu, serta penyimpanan turn/session state yang konsisten.

### 2.3 Lingkungan, rahasia, deployment, dan operasi

- [ ] Definisikan konfigurasi development, staging, dan production; pastikan URL/API origin berbeda per environment.
- [ ] Gunakan secret manager untuk JWT, kredensial AI, database, Redis, dan storage. Aplikasi produksi harus menolak secret default atau kosong.
- [ ] Buat pipeline CI untuk lint, type check, tes, build container, dan pemeriksaan migrasi.
- [ ] Buat pipeline CD dengan image immutable, promosi ke staging, persetujuan deployment produksi, smoke check, serta prosedur rollback.
- [ ] Tentukan strategi migrasi database per environment dan perlindungan data sebelum deployment.
- [ ] Tentukan backup otomatis, point-in-time recovery, uji restore, RPO/RTO, dan pemilik operasional.
- [ ] Tentukan observability: log terstruktur dengan correlation/session ID, metrik API/gRPC/DB/Redis, tracing, dashboard, dan alert yang memiliki pemilik.
- [ ] Tetapkan SLO/ambang alert untuk availability, latensi API, waktu respons AI, error rate, biaya AI, dan antrean ingestion.
- [ ] Jalankan uji beban bertahap untuk WebSocket, sesi paralel, ingestion PDF, dan lonjakan panggilan provider sebelum menentukan ukuran production.
- [ ] Buat runbook untuk provider AI down, database penuh, Redis down, migrasi gagal, lonjakan biaya, dan insiden keamanan.

### 2.4 Gerbang keamanan sebelum beta publik

- [ ] Wajibkan autentikasi WebSocket di luar demo lokal; validasi Origin dan ikat setiap pesan ke sesi koneksi.
- [ ] Terapkan pemeriksaan ownership/membership pada route baca dan perubahan status sesi.
- [ ] Tutup akses langsung ke gRPC dari jaringan publik dan autentikasi komunikasi service-to-service.
- [ ] Terapkan secret JWT kuat yang wajib dikonfigurasi; hilangkan default secret dari konfigurasi runtime produksi.
- [ ] Terapkan HTTPS/WSS, batas body dan ukuran PDF, kuota ingestion per pengguna, timeout, serta backpressure pesan WebSocket.
- [ ] Pisahkan hak admin/moderator dari user biasa dan wajibkan role admin untuk moderasi serta ingestion KB yang dikurasi.
- [ ] Pastikan ban, suspend, dan penghapusan akun menghentikan akses token yang masih berlaku sesuai kebijakan produk.

### Kriteria selesai infrastruktur

- [ ] ADR deployment menjelaskan pilihan provider, region, layanan, biaya perkiraan, skala awal, dan alasan pemilihan.
- [ ] Diagram jaringan menunjukkan akses publik/privat, TLS, port, rahasia, storage, dan dependensi.
- [ ] Ada environment staging yang dapat di-deploy ulang dari pipeline dan punya backup/restore serta dashboard/alert dasar.
- [ ] Checklist keamanan beta sudah ditutup atau risiko yang tersisa disetujui secara eksplisit.

## 3. PR: pilih fitur yang benar-benar akan dibangun

### 3.1 Tentukan produk dan format MVP

- [ ] Tetapkan satu pengguna utama dan satu kebutuhan inti yang akan divalidasi pada pilot.
- [ ] Catat arah jangka panjang yang masih berupa gagasan: produk tidak harus terbatas untuk pengguna umum. Ada rencana membuat aplikasi terpisah bernama **Nalar**, khusus baduta–balita, untuk membantu anak mengeksplorasi pengetahuan dan teknik berbicara. Gagasan ini belum menjadi ruang lingkup MVP DebateAI.
- [ ] Sebelum menyusun scope Nalar, validasi kelompok usia dan tujuan belajarnya bersama orang tua serta pendidik/ahli perkembangan anak; rancang konten sesuai usia, keterlibatan pendamping, dan perlindungan data anak.
- [ ] Catat arah penggunaan sekolah: guru dapat mengatur kelas dan tugas debat, memilih/menyumbang mosi atau materi, lalu meninjau progres belajar siswa. Ini kebutuhan pasca-MVP yang perlu divalidasi dengan guru dan sekolah.
- [ ] Tentukan batas kontribusi guru: konten yang hanya berlaku untuk kelas/sekolah, konten yang dapat dibagikan lintas sekolah, proses pemeriksaan sumber/hak pakai, serta siapa yang menyetujui publikasi ke Knowledge Base umum.
- [ ] Tetapkan format kompetisi pertama yang didukung penuh. Usulan awal: KDMI/NUDC; BP dapat menjadi format berikutnya jika kebutuhan pengguna terbukti.
- [ ] Tulis aturan untuk setiap format yang didukung: jumlah pembicara/ronde, durasi, urutan giliran, POI/interupsi, waktu persiapan, hasil, dan rubrik penilaian.
- [ ] Definisikan bagaimana format “Oxford” berbeda dari format kompetisi formal lain, atau keluarkan dari MVP sampai aturan produk jelas.
- [ ] Tentukan apakah AI Judge memberi coaching per argumen, adjudikasi akhir, atau keduanya. Pisahkan nilai logika/retorika/dampak dari keputusan pemenang jika rubrik format mensyaratkannya.
- [ ] Tetapkan sumber aturan dan bukti untuk Knowledge Base; setiap potongan harus memiliki penerbit, URL, tanggal, bahasa, status/versi, dan rujukan halaman bila tersedia.

### 3.2 Prioritas fitur — usulan awal untuk disetujui

| Prioritas | Fitur | Batas hasil yang diharapkan |
|---|---|---|
| **Must — MVP** | Autentikasi dan akun | Registrasi/login, refresh/logout, profil, akses privat, penghapusan/ekspor data sesuai kebijakan. |
| **Must — MVP** | Lobby debat | Pilih mosi, stance, format yang disetujui, persona AI, tingkat kesulitan, lalu buat sesi tersimpan. |
| **Must — MVP** | Debat teks real-time vs AI | Giliran terkontrol, WebSocket aman, argumen tersimpan, respons AI streaming, penanganan disconnect/error. |
| **Must — MVP** | Evaluasi dan hasil sesi | Feedback dengan rubrik terjelaskan, hasil akhir, transkrip, riwayat, serta tautan sumber untuk klaim faktual dari KB. |
| **Must — MVP** | Admin dasar yang nyata | Login/role admin, kelola persona dan sumber KB, lihat status layanan, moderasi dasar; semua data berasal dari API, bukan data contoh. |
| **Should — setelah MVP stabil** | RAG terkurasi | Ingest PDF/YouTube oleh role yang berwenang, approval, pencarian semantik, sumber/citation, dan indikator data usang. |
| **Should — setelah MVP stabil** | Voice input/STT | Rekam/transkripsi Bahasa Indonesia dan Inggris, konfirmasi teks sebelum dikirim, serta batas privasi audio. |
| **Should — setelah MVP stabil** | Latihan terarah | Tutorial format, latihan rebuttal, latihan definisi/claim-evidence-reasoning, serta progres per keterampilan. |
| **Should — pilot sekolah setelah MVP** | Mode kelas untuk guru | Buat kelas, undang siswa, tetapkan mosi/format/tenggat, atur rubrik, lihat progres, dan tinjau hasil; materi kontribusi guru memiliki sumber serta pengaturan akses. |
| **Could — bila ada kebutuhan** | POI, TTS, export/share card, laporan PDF, leaderboard, badge lanjutan. | Pilih hanya fitur yang memperbaiki hasil belajar atau retensi; definisikan aturan dan biaya operasionalnya. |
| **Later — perlu validasi bisnis/operasi** | Integrasi LMS/SIS, multiplayer skala besar, langganan/pembayaran, auto-ingest berkala, API publik. | Butuh desain integrasi, moderasi, support, biaya, privasi, dan proteksi abuse sebelum masuk roadmap. |

> Prioritas di tabel adalah **usulan untuk dibahas**, bukan keputusan produk yang sudah disetujui.

> **Catatan penggunaan sekolah:** sebaiknya diakomodasi sebagai jalur produk DebateAI. Mulai dari pilot kelas kecil setelah alur debat inti stabil; jangan dulu membangun integrasi LMS/SIS atau pengelolaan sekolah berskala besar. Guru perlu dapat memberi tugas dan materi, sedangkan kontribusi ke KB umum harus melalui pemeriksaan sumber dan persetujuan.

> **Catatan arah produk:** DebateAI berfokus pada debat dan latihan argumentasi. Nalar adalah gagasan aplikasi terpisah untuk baduta–balita; kebutuhan, pengalaman pengguna, konten, serta kebijakan privasinya perlu dirancang dan divalidasi tersendiri sebelum masuk roadmap pengembangan.

### 3.3 Audit implementasi fitur terhadap kode nyata

- [ ] Ubah feature matrix menjadi status yang dapat diverifikasi: `End-to-end`, `Backend only`, `UI/mock`, `Belum ada`, atau `Dihapus dari scope`.
- [ ] Tandai klaim yang belum benar-benar terhubung: OAuth, multiplayer/join room, POI, TTS, leaderboard, moderasi admin, live telemetry, dan CRUD persona yang tersimpan.
- [ ] Periksa bahwa status sesi, transkrip, skor, kuota, dan profil pada UI mengambil data backend, bukan data statis atau fallback yang tampak seperti data produksi.
- [ ] Untuk setiap fitur MVP, tulis user story, aturan bisnis, endpoint/event, perubahan database, izin akses, state error/loading/offline, dan acceptance criteria.
- [ ] Buat peta dependensi fitur agar urutannya jelas: ERD/otorisasi → API/engine → UI → telemetry → rollout.
- [ ] Tentukan fitur yang tidak akan dibangun pada MVP dan pindahkan ke backlog later; hindari membiarkan checkbox lama tampak sebagai komitmen aktif.
- [ ] Tentukan metrik keberhasilan pilot: sesi selesai, sesi pertama berhasil, penggunaan feedback, kualitas retrieval, latensi, biaya per sesi, laporan konten, dan crash/error.

### Definition of Done untuk fitur MVP

- [ ] Fitur berfungsi end-to-end di klien, API, database, dan engine yang relevan; bukan sekadar komponen UI atau endpoint stub.
- [ ] Akses dan role diverifikasi, input memiliki batas/validasi, serta alur kegagalan ditangani.
- [ ] Data dan event yang ditampilkan berasal dari backend serta dapat ditelusuri melalui log/telemetry.
- [ ] Acceptance criteria dan tes relevan ditulis; fitur kritis telah dicoba pada staging.
- [ ] Dokumentasi, feature matrix, dan status rollout diperbarui.

## Urutan kerja yang disarankan

1. **Sprint 0 — keputusan dan audit:** tetapkan pengguna/format MVP, pilih sumber kebenaran database, selesaikan selisih ERD–DDL, dan buat ADR arsitektur.
2. **Sprint 1 — fondasi aman:** perbaiki otorisasi sesi/WebSocket, secret, TLS/jaringan, migrasi, staging, backup, dan telemetry dasar.
3. **Sprint 2 — MVP end-to-end:** selesaikan auth/lobby/debat teks/hasil/riwayat/admin dasar dengan data nyata.
4. **Pilot individu — validasi:** uji dengan debater dan adjudicator, ukur kualitas feedback, kecocokan aturan, biaya, serta reliabilitas.
5. **Pilot sekolah — validasi lanjutan:** coba mode kelas terbatas dengan guru dan siswa; uji alur tugas, kontribusi materi, kontrol akses, dan nilai laporan progres sebelum memperluasnya.
6. **Setelah pilot — tambah fitur:** prioritaskan RAG terkurasi dan voice; lanjutkan integrasi sekolah, multiplayer, monetisasi, dan fitur sosial sesuai kebutuhan serta kapasitas yang terbukti.

## Dokumen acuan yang harus diselaraskan

- [PRD_DebateAI.md](PRD_DebateAI.md) — kebutuhan dan roadmap produk.
- [Database_Design_Prisma.md](Database_Design_Prisma.md) — model dan ERD saat ini.
- [scripts/migrations/001_initial_schema.sql](scripts/migrations/001_initial_schema.sql) — DDL yang benar-benar dipakai untuk database awal.
- [Implementation_Plan_DebateAI.md](Implementation_Plan_DebateAI.md) — perlu diselaraskan dengan Go/gRPC/Python/Flutter/Next.js.
- [FEATURE_LIST.md](FEATURE_LIST.md) — status nyata fitur dan prioritas MVP.
- [execute_plan.md](execute_plan.md) — perlu mengganti klaim progres global dengan status yang didukung kode dan bukti verifikasi.

## Keputusan yang masih harus diisi pemilik produk

- Pengguna pertama: `____________________________`
- Status gagasan Nalar dan waktu discovery: `____________________________`
- Sekolah pilot dan guru yang akan diwawancarai: `____________________________`
- Data progres siswa yang perlu dilihat guru: `____________________________`
- Format debat MVP: `____________________________`
- Fitur Must yang disetujui: `____________________________`
- Target pilot dan jumlah pengguna: `____________________________`
- Cloud/provider dan anggaran bulanan awal: `____________________________`
- Target concurrent sessions dan SLO: `____________________________`
- Pemilik review ERD/database: `____________________________`
- Pemilik keputusan infrastruktur: `____________________________`
- Tanggal review berikutnya: `____________________________`
