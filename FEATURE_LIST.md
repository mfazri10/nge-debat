# 📋 Feature Matrix & Checklist — DebateAI (Web & Mobile)

> Dokumen acuan lengkap daftar seluruh fitur platform **DebateAI** yang dialokasikan untuk antarmuka **Mobile Client (Flutter)** dan **Web / Admin Panel (Next.js)**.
> Gunakan dokumen ini sebagai checklist progres pengembangan, pengujian (QA), dan perilisan fitur.

---

## 📊 Ringkasan Matriks Distribusi Platform

| Modul / Domain | Fitur Utama | Mobile Client (Flutter) | Web Admin Panel (Next.js) | Status Arsitektur |
|---|---|:---:|:---:|:---:|
| **Autentikasi & Profil** | Register, Login, OAuth, PDP Compliance | ✅ Client User | ✅ Admin Auth & Audit | Selesai |
| **Lobby & Matchmaking** | Pilih Mosi, Persona, Format Debat, Kuota | ✅ Pengguna Utama | ❌ (Hanya Konfigurasi) | Selesai |
| **Arena Debat Real-Time** | Live Audio/Text, Lawan AI, 3 Juri, Penonton | ✅ Pengguna Utama | 👁️ Live Monitor (Spectator) | Selesai |
| **Scorecard & Hasil** | Penilaian Logika/Retorika/Dampak, Fallacy | ✅ Pengguna Utama | 📊 Review Evaluasi Sesi | Selesai |
| **Gamifikasi & Sosial** | ELO Rating, 10 Badges, Leaderboard | ✅ Pengguna Utama | ⚙️ Master Data Badges | Selesai |
| **Knowledge Base (RAG)** | Ingest YouTube, Ingest PDF, Vector Search | 🔍 Pencarian & Referensi | 🛠️ Ingestion & Review Chunks | Selesai |
| **Manajemen Persona** | Create/Edit Persona, AI Prompt Builder | 🎭 Seleksi & Favorit | 🛠️ CRUD Master & Prompt Tuner | Selesai |
| **Moderasi & Keamanan** | Pelaporan Konten, Ban User, Audit Log | 🚨 Tombol Report | 🛡️ Review & Tindakan Tegas | Selesai |
| **Telemetri & AI Cost** | Monitoring Token, Latensi, Provider Failover | ❌ | 📈 Telemetry Dashboard | Selesai |

---

## 📱 1. Fitur Mobile Client (Flutter)

Aplikasi klien yang digunakan oleh peserta debat (siswa, mahasiswa, profesional) di perangkat iOS, Android, maupun Web browser.

### 1.1 Modul Autentikasi & Akun Pengguna
- [x] **M-AUTH-01: Registrasi Akun Mandiri**
  - Registrasi menggunakan email & password dengan validasi format dan keamanan.
  - *File acuan:* `apps/mobile/lib/features/auth/login_screen.dart`
- [x] **M-AUTH-02: Login JWT & Secure Storage**
  - Autentikasi dengan penyimpanan token lokal (`SharedPreferences`) dan auto-refresh token.
  - *File acuan:* `apps/mobile/lib/features/auth/auth_provider.dart`
- [ ] **M-AUTH-03: Social Login (Google & Apple ID)**
  - Single Sign-On (SSO) Google OAuth 2.0 dan Apple ID (khusus iOS App Store).
  - *Status:* Endpoint backend siap (`/v1/auth/google`), integrasi UI SDK mobile.
- [x] **M-AUTH-04: Kepatuhan UU PDP (Hak Privasi)**
  - Unduh arsip data pribadi pengguna (`/users/me/export`).
  - Hapus akun secara permanen (Right to be Forgotten).
  - *File acuan:* `apps/mobile/lib/features/profile/widgets/pdp_compliance_card.dart`

---

### 1.2 Modul Lobby & Pemilihan Topik
- [x] **M-LOBBY-01: Kartu Profil & Kuota Harian**
  - Menampilkan nama, status member (Free vs Pro), ELO rating saat ini, dan indikator kuota debat (misal: 3/5 sesi harian gratis).
  - *File acuan:* `apps/mobile/lib/features/lobby/widgets/user_stat_card.dart`
- [x] **M-LOBBY-02: Kurasi Mosi Debat (Motion Picker)**
  - Pemilihan mosi berdasarkan kategori: *Politik, Hukum, Ekonomi, Sosial, Teknologi, Pendidikan*.
  - Menampilkan tingkat kesulitan mosi (*Beginner, Intermediate, Advanced*).
  - Input mosi kustom (*User Custom Topic*).
  - *File acuan:* `apps/mobile/lib/features/lobby/widgets/motion_picker.dart`
- [x] **M-LOBBY-03: Pemilihan Persona Lawan AI (Persona Slider)**
  - Carousel horizontal untuk memilih lawan AI dengan ragam karakteristik:
    - *Rocky G. (Kritis & Menyerang Logika)*
    - *Najwa S. (Investigatif & Berbasis Bukti)*
    - *Hotman P. (Lugas, Tajam, & Berorientasi Hukum)*
    - Tokoh Akademisi, Teknokrat, dan Diplomat lainnya.
  - *File acuan:* `apps/mobile/lib/features/lobby/widgets/persona_slider.dart`
- [x] **M-LOBBY-04: Konfigurasi Stance & Format Debat**
  - Pilihan posisi argumen: **Tim Pro (Afirmatif)** atau **Tim Kontra (Oposisi)**.
  - Pilihan format: *Oxford Style, British Parliamentary (BP), KDMI/NUDC, atau Bebas*.
  - *File acuan:* `apps/mobile/lib/features/lobby/lobby_screen.dart`
- [ ] **M-LOBBY-05: Mode Multiplayer & Kode Room**
  - Buat room atau gabung ke room debat lawan pengguna manusia lain via kode 6-digit.
  - *Status:* Endpoint sesi join (`/sessions/join`) siap di backend.

---

### 1.3 Modul Arena Debat Real-Time (Core Experience)
- [x] **M-ARENA-01: WebSocket Arena Real-Time**
  - Pertukaran argumen dua arah secara instan melalui koneksi WebSocket (`/ws/debate/:sessionId`).
  - *File acuan:* `apps/mobile/lib/features/debate/arena_screen.dart`
- [x] **M-ARENA-02: Stream Balasan AI Lawan (Token-by-Token)**
  - Teks argumen lawan AI muncul mengalir secara live layaknya lawan sedang berbicara.
  - *File acuan:* `apps/mobile/lib/features/debate/widgets/debate_speech_bubble.dart`
- [x] **M-ARENA-03: Input Argumen Ganda (Teks & Speech-to-Text)**
  - Input cepat menggunakan ketikan teks dengan batas karakter terukur.
  - Input suara langsung menggunakan mikrofon (*Voice Input / STT*).
  - *File acuan:* `apps/mobile/lib/features/debate/widgets/debate_input_bar.dart`
- [x] **M-ARENA-04: Countdown Timer Dinamis**
  - Penghitung mundur waktu bicara per giliran (misal: 60 - 180 detik) dengan indikator visual.
- [x] **M-ARENA-05: Live Scorecard 3 AI Juri**
  - Overlay transparan yang menampilkan evaluasi instan setelah argumen disampaikan:
    - **Juri 1 (Logika)**: Konsistensi silogisme & premis.
    - **Juri 2 (Retorika)**: Persuasi, artikulasi, dan gaya bahasa.
    - **Juri 3 (Dampak)**: Relevansi fakta dan signifikansi solusi.
  - *File acuan:* `apps/mobile/lib/features/debate/widgets/scorecard_overlay.dart`
- [x] **M-ARENA-06: Deteksi Cacat Logika (Fallacy Detection Banner)**
  - Peringatan instan jika argumen mengandung fallacy: *Ad Hominem, Strawman, Slippery Slope, False Dilemma, Circular Reasoning*.
  - *File acuan:* `apps/mobile/lib/features/debate/widgets/scorecard_overlay.dart`
- [x] **M-ARENA-07: Crowd Sentiment Bar (Simulasi Penonton AI)**
  - Bar reaksi penonton yang bergerak dinamis (Pro vs Kontra) disertai lontaran reaksi singkat dari audiens virtual.
  - *File acuan:* `apps/mobile/lib/features/debate/widgets/crowd_sentiment_bar.dart`
- [ ] **M-ARENA-08: Text-to-Speech (Suara AI Lawan)**
  - Pemutaran audio suara sintetis untuk persona AI saat menyampaikan bantahan.
  - *Status:* Integrasi audio player stream di mobile.
- [ ] **M-ARENA-09: Point of Information (POI / Interupsi)**
  - Tombol interupsi di tengah giliran bicara lawan sesuai format WSDC/BP.

---

### 1.4 Modul Hasil, Evaluasi & Transkrip
- [x] **M-RES-01: Pengumuman Pemenang & Ringkasan Skor**
  - Pengumuman status debat: Kemenangan Telak, Menang Tipis, Seri, atau Kalah.
  - Total skor kumulatif pengguna vs AI Lawan.
  - *File acuan:* `apps/mobile/lib/features/results/results_screen.dart`
- [x] **M-RES-02: Rincian Nilai 3 Pilar Penjurian**
  - Grafik batang perbandingan nilai *Logika, Retorika, dan Dampak*.
  - *File acuan:* `apps/mobile/lib/features/results/results_screen.dart`
- [x] **M-RES-03: Feedback Narasi & Rekomendasi Latihan**
  - Ulasan tertulis dari dewan juri mengenai kelebihan dan celah argumen pengguna.
  - Tips spesifik apa yang harus dilatih pada sesi berikutnya.
- [x] **M-RES-04: Transkrip Lengkap Sesi Debat**
  - Riwayat lengkap seluruh percakapan argumen ronde per ronde dari awal hingga akhir.
- [ ] **M-RES-05: Export & Bagikan Hasil (Social Share Card)**
  - Ekspor rangkuman hasil debat dalam bentuk kartu visual yang siap dibagikan ke Instagram Story / WhatsApp.

---

### 1.5 Modul Profil, Statistik & Gamifikasi
- [x] **M-PROF-01: Ringkasan Statistik Debat**
  - Total sesi yang diselesaikan, win rate persentase, dan ranking ELO.
  - *File acuan:* `apps/mobile/lib/features/profile/profile_screen.dart`
- [x] **M-PROF-02: 10 Gamification Badges**
  - Etalase lencana penghargaan (Bronze, Silver, Gold, Platinum):
    - *First Blood* (Sesi debat pertama)
    - *Master of Logic* (Skor logika > 90)
    - *Rhetoric King* (Skor retorika > 90)
    - *Debate Veteran* (Menyelesaikan 50 sesi debat)
    - Dan badge prestasi lainnya.
  - *File acuan:* `apps/mobile/lib/features/profile/widgets/badge_grid.dart`
- [ ] **M-PROF-03: Leaderboard Pemain Nasional**
  - Peringkat mingguan dan bulanan peserta debat dengan ELO tertinggi di Indonesia.

---

## 💻 2. Fitur Web & Admin Panel (Next.js)

Dashboard kendali pusat yang diakses melalui browser (`http://localhost:3000`) untuk keperluan operasional, pemantauan AI, kurasi data, dan administrasi pengguna.

### 2.1 Dashboard Utama & AI Telemetry
- [x] **W-DASH-01: Metrik Ringkasan Real-Time**
  - Jumlah sesi aktif yang sedang berlangsung secara bersamaan (*Concurrent Sessions*).
  - Total pengguna terdaftar dan pengguna aktif harian (DAU).
  - Konsumsi kredit/token LLM dan estimasi biaya per provider (Gemini, OpenAI, Anthropic).
  - *File acuan:* `apps/admin-panel/src/app/page.tsx`
- [x] **W-DASH-02: Health & Latency Monitor**
  - Pemantauan status kesehatan engine gRPC (`Debate Engine :50051`), API Gateway (`Echo :8080`), database PostgreSQL, dan Redis.
  - Rata-rata latensi waktu respons AI (*Time to First Token*).

---

### 2.2 Pemantauan Sesi Live (Live Sessions Monitor)
- [x] **W-SESS-01: Daftar Sesi Berjalan (Active Sessions Table)**
  - Melihat seluruh room debat yang aktif: ID Sesi, nama peserta, mosi yang diperdebatkan, persona lawan yang digunakan, ronde saat ini, dan waktu mulai.
  - *File acuan:* `apps/admin-panel/src/app/sessions/page.tsx`
- [x] **W-SESS-02: Mode Pengamat (Spectator / Live Observer)**
  - Membuka sesi live untuk mengamati transkrip teks percakapan peserta vs AI secara *real-time* tanpa mengganggu jalannya debat.
- [x] **W-SESS-03: Intervensi Sesi (Force Pause / Terminate)**
  - Tombol darurat bagi administrator untuk menghentikan sesi yang melanggar aturan (*abuse* / ujaran kebencian).

---

### 2.3 Manajemen Karakter & Persona AI (Persona Studio)
- [x] **W-PERS-01: Katalog Master Persona**
  - Tampilan daftar persona AI lengkap dengan avatar, deskripsi karakter, dan kecenderungan gaya bicara.
  - *File acuan:* `apps/admin-panel/src/app/personas/page.tsx`
- [x] **W-PERS-02: CRUD Persona Kustom**
  - Tambah, ubah, dan hapus karakter persona baru ke database.
- [x] **W-PERS-03: Prompt Engineering & Behavior Tuner**
  - Editor konfigurasi *System Prompt*, parameter *Temperature* (kreativitas vs ketat logis), *Top-P*, dan *Stance Tendency* untuk masing-masing persona.

---

### 2.4 Knowledge Base & RAG Pipeline (Data Ingestion)
- [x] **W-RAG-01: Ingestion Transkrip Debat YouTube**
  - Input URL video debat (misal: debat capres KPU, sidang MKRI, podcast ILC, Oxford Union).
  - Sistem otomatis mengekstrak transkrip teks, melakukan pemotongan (*chunking*), membuat vektor embedding 768 dimensi, dan menyimpan ke PostgreSQL pgvector.
  - *File acuan:* `apps/admin-panel/src/app/rag/page.tsx`
- [x] **W-RAG-02: Ingestion Dokumen Riset (PDF & TXT)**
  - Unggah naskah kebijakan publik, jurnal ilmiah, naskah akademik RUU, atau undang-undang untuk memperkaya basis bukti AI saat berdebat.
- [x] **W-RAG-03: Vector Search & Chunk Inspector**
  - Fasilitas pencarian semantik untuk menguji apakah dokumen yang di-ingest dapat ditemukan relevansinya dengan topik mosi tertentu.
- [x] **W-RAG-04: Kurasi & Review Dokumen**
  - Opsi untuk mengaktifkan, menonaktifkan, atau menghapus chunk data yang usang atau tidak akurat.

---

### 2.5 Moderasi Pengguna & Keamanan
- [x] **W-MOD-01: Inbox Laporan Konten (User Reports)**
  - Daftar laporan pelanggaran dari peserta terhadap ujaran SARA, pelecehan, atau eksploitasi prompt AI (*jailbreaking*).
  - *File acuan:* `apps/admin-panel/src/app/moderation/page.tsx`
- [x] **W-MOD-02: Tindakan Disipliner Pengguna**
  - Penambahan surat peringatan (*warning count*), suspensi akun sementara, hingga pemblokiran permanen (*Banned*).
- [x] **W-MOD-03: Log Audit Keamanan**
  - Catatan aktivitas administratif untuk audit kepatuhan keamanan dan transparansi.

---

## 🔄 3. Pemetaan Alur Data (Mobile ↔ Backend ↔ Web)

```
                       ┌────────────────────────────┐
                       │   Mobile Client (Flutter)  │
                       │  - Peserta Debat           │
                       │  - STT & Real-time UI      │
                       └─────────────┬──────────────┘
                                     │
                        REST / WS (Port 8080)
                                     │
                                     ▼
 ┌──────────────────────┐  gRPC (50051)  ┌───────────────────────────┐
 │   Admin Panel (Web)  │◄──────────────►│    API Gateway & Engine   │
 │   - Dashboard        │                │  - Go Echo (Auth & WS)    │
 │   - Live Spectator   │                │  - Python LangChain (AI)  │
 │   - RAG Ingest       │                │  - Celery Worker (Async)  │
 └──────────────────────┘                └─────────────┬─────────────┘
                                                       │
                                                 SQL & Vectors
                                                       │
                                                       ▼
                                         ┌───────────────────────────┐
                                         │  PostgreSQL 17 + pgvector │
                                         │  Redis 7 (Session Cache)  │
                                         └───────────────────────────┘
```

---

## 🎯 4. Rekomendasi Tahapan Peluncuran (Sprint Roadmap)

### 🟢 Fase 1: MVP Testing (Saat Ini — Status Ready)
- [x] Backend Go + Python gRPC + PostgreSQL 17 + Redis beroperasi penuh.
- [x] Mobile Client dapat login, memilih persona & mosi, melakukan debat real-time, dan menerima scorecard juri.
- [x] Web Admin Panel dapat memantau telemetri, mengatur persona, dan ingest dokumen RAG.

### 🟡 Fase 2: Peningkatan UX & Fitur Sosial (Next Step)
- [ ] Text-to-Speech (TTS) suara persona lawan AI di mobile.
- [ ] Mode Room Multiplayer (User vs User dengan Juri AI).
- [ ] Integrasi Login Google OAuth di mobile.
- [ ] Leaderboard mingguan peserta debat nasional.

### 🔵 Fase 3: Skalabilitas & Monetisasi B2B
- [ ] Classroom Mode untuk Dosen & Institusi Kampus (Web & Mobile).
- [ ] Payment gateway langganan akun Pro (Midtrans / Xendit).
- [ ] Auto-scraping transkrip debat parlemen & pengadilan berkala.
