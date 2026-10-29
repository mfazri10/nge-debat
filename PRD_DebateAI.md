# 🎙️ Product Requirements Document (PRD)
## DebateAI — Aplikasi Debat Berbasis Kecerdasan Buatan

| | |
|---|---|
| **Versi** | 2.0 (Final) |
| **Tanggal** | September 2026 |
| **Status** | ✅ Disetujui |
| **Bahasa** | Bahasa Indonesia (Bilingual App: ID + EN) |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Visi & Misi Produk](#2-visi--misi-produk)
3. [Analisis Pasar](#3-analisis-pasar)
4. [Analisis Kompetitor](#4-analisis-kompetitor)
5. [User Personas](#5-user-personas)
6. [Problem Statement](#6-problem-statement)
7. [Solusi & Value Proposition](#7-solusi--value-proposition)
8. [Feature Requirements](#8-feature-requirements)
9. [User Stories & Acceptance Criteria](#9-user-stories--acceptance-criteria)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Sistem AI: Juri, Penonton & Lawan](#11-sistem-ai-juri-penonton--lawan)
12. [Knowledge Base & RAG Strategy](#12-knowledge-base--rag-strategy)
13. [Technical Architecture](#13-technical-architecture)
14. [Database Schema](#14-database-schema)
15. [API Design](#15-api-design)
16. [User Flow](#16-user-flow)
17. [Security & Compliance](#17-security--compliance)
18. [Monetization Strategy](#18-monetization-strategy)
19. [Go-to-Market Plan](#19-go-to-market-plan)
20. [Success Metrics & KPI](#20-success-metrics--kpi)
21. [Risk & Mitigation](#21-risk--mitigation)
22. [Product Roadmap](#22-product-roadmap)
23. [Glosarium](#23-glosarium)

---

## 1. Executive Summary

**DebateAI** adalah platform debat lintas-platform (mobile, desktop, web) yang menggabungkan simulasi debat berbasis AI, knowledge base debat nyata, dan mekanisme penilaian otomatis oleh juri AI. Pengguna dapat berdebat tentang topik apa pun, melakonkan peran tokoh tertentu (presiden, CEO, hakim, dll.), berhadapan dengan AI atau sesama pengguna secara *real-time*, sementara juri AI memberikan penilaian terstruktur dan penonton AI mensimulasikan reaksi publik.

**Mengapa sekarang?**

- Pasar AI EdTech global bernilai **$2,06 miliar (2025)** dan tumbuh **23,5% CAGR** menuju $10,92 miliar pada 2033.
- Indonesia memiliki lebih dari **50 juta pelajar** dan ekosistem kompetisi debat nasional yang mapan (NUDC, KDMI, NSDC, LDBI).
- Kemendikbudristek melalui *Kurikulum Merdeka* secara eksplisit memprioritaskan **"Bernalar Kritis"** sebagai salah satu dari 6 dimensi Profil Pelajar Pancasila.
- Belum ada platform yang memadukan **sparring suara real-time**, **format debat formal**, **scorecard juri otomatis**, dan **knowledge base berbasis debat nyata** — khususnya dalam konteks Indonesia.

**Target Utama**: Pelajar & mahasiswa Indonesia (SMA–S2), calon penerima beasiswa, profesional, dan politisi yang membutuhkan latihan debat berkualitas tinggi tanpa batasan waktu dan akses.

---

## 2. Visi & Misi Produk

### Visi
> *"Menjadi platform debat terkemuka di Asia Tenggara yang memberdayakan siapa pun untuk berpikir lebih kritis, berbicara lebih persuasif, dan memahami isu dari berbagai perspektif — dengan AI sebagai mitra berlatih yang tak pernah berhenti."*

### Misi
- Membuat latihan debat berkualitas tinggi dapat diakses oleh **siapa saja, kapan saja, di mana saja**.
- Menyediakan feedback **objektif dan terstruktur** yang selama ini hanya bisa didapat dari juri/pelatih manusia berpengalaman.
- Membangun **knowledge base** dari debat-debat nyata yang beredar di YouTube, dokumen sidang, dan transkrip parlemen sebagai referensi bagi AI dan pengguna.
- Menciptakan ruang yang **aman dan menyenangkan** untuk berlatih mengutarakan pendapat tanpa rasa takut dihakimi.

### Nilai Produk (Core Values)

| Nilai | Deskripsi |
|---|---|
| 🧠 **Kritis** | Mendorong penalaran berbasis bukti, bukan emosi |
| 🎯 **Personal** | Feedback spesifik untuk setiap individu, bukan generik |
| 🌏 **Inklusif** | Bisa diakses pelajar desa maupun profesional kota |
| 🔒 **Aman** | Lingkungan bebas perundungan dengan moderasi ketat |
| 🎭 **Imersif** | Pengalaman roleplay yang mendebarkan dan realistis |

---

## 3. Analisis Pasar

### 3.1 Ukuran Pasar Global

| Segmen | Nilai 2025 | Proyeksi | CAGR |
|---|---|---|---|
| AI dalam EdTech & Language Learning | $2,06 Miliar | $10,92 M (2033) | 23,5% |
| Communication & Presentation Training | $5,8 Miliar | $11,2 M (2034) | 7,6% |
| AI Roleplay & Conversational Simulation | $1,2 Miliar | $4,5 M (2033) | 19,8% |
| Corporate Soft Skills Training | $37–39 Miliar | $68–97 M (2034) | 9–11% |

### 3.2 Konteks Pasar Indonesia

| Indikator | Data |
|---|---|
| Pasar EdTech Indonesia (2024) | $3,23 Miliar |
| Proyeksi (2033) | $8,81–10,04 Miliar (CAGR 11–12%) |
| Jumlah pelajar K-12 + Perguruan Tinggi | 50+ juta |
| Pengguna smartphone | 190+ juta |
| Event debat nasional tahunan | NUDC, KDMI, NSDC, LDBI, NMCC, LPDP Interview |
| Kurikulum Merdeka: Bernalar Kritis | Wajib dalam Profil Pelajar Pancasila |

### 3.3 Popularitas Konten Debat di YouTube

**Global:**

| Channel | Subscribers | Views Viral | Format |
|---|---|---|---|
| Jubilee Media | 9 juta | 5–15 juta/video | Panel sosial, 1 vs 20 |
| The Oxford Union | 1 juta+ | 5–20 juta/video | British Parliamentary |
| Debat Capres AS 2024 | — | 67,1 juta penonton siaran | Presidential |

**Indonesia:**

| Channel | Subscribers | Views Viral | Format |
|---|---|---|---|
| Debat Capres KPU 2024 | — | 394 juta total kumulatif TV | Presidensial |
| Mata Najwa | 10,5 juta | 1–5 juta/video | Investigatif & politik |
| Indonesia Lawyers Club | 5,8 juta | 50 juta/bulan | Hukum & politik |
| Total Politik | — | Ratusan ribu/video | Ideologi & kebijakan |

### 3.4 Peluang Pasar yang Belum Terlayani

```
Kebutuhan Nyata               Platform yang Ada        Gap
────────────────────────────────────────────────────────────────
Sparring suara real-time   → Yoodli (komunikasi)   → Tidak spesifik debat
Format KDMI/NUDC/BP        → Tabbycat (admin)      → Hanya backend turnamen
Feedback juri otomatis     → DebateArt (teks)      → Lambat, tidak real-time
Roleplay tokoh tertentu    → Character.ai          → Tidak punya format debat
Konten debat Indonesia     → Tidak ada             → GAP TOTAL
Knowledge base debat lokal → Tidak ada             → GAP TOTAL
```

---

## 4. Analisis Kompetitor

### 4.1 Matriks Kompetitor

| Fitur | DebateAI | Kialo Edu | DebateArt | Debatable | Yoodli | Character.ai |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Format debat formal | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Real-time voice debate | ✅ | ❌ | ❌ | ✅ | ✅ | Sebagian |
| AI lawan | ✅ | ❌ | ❌ | ✅ (terbatas) | ✅ | ✅ |
| AI juri + scorecard | ✅ | ❌ | ❌ | ✅ (dasar) | ✅ (pidato) | ❌ |
| AI penonton / reaksi | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Roleplay tokoh tertentu | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Knowledge base debat nyata | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Bahasa Indonesia | ✅ | ❌ | ❌ | ❌ | ❌ | Sebagian |
| Offline mode (vs AI) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Mobile native | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |

### 4.2 Profil Kompetitor Detail

**🔵 Kialo / Kialo Edu**
- **Model**: Peta argumen kolaboratif (Pro/Kontra hierarkis)
- **Kekuatan**: Sangat bagus untuk pendidikan kritis, struktur argumen visual
- **Kelemahan**: Asinkron, teks saja, tidak ada AI lawan, tidak ada suasana kompetitif
- **Ancaman bagi DebateAI**: Rendah — segmen berbeda

**🟠 DebateArt**
- **Model**: Debat teks 1v1 multi-ronde (komunitas)
- **Kekuatan**: Kedalaman argumen tinggi, sistem ELO, juri komunitas
- **Kelemahan**: Sangat lambat (hitungan hari per ronde), tidak ada suara, intimidatif bagi pemula
- **Ancaman bagi DebateAI**: Rendah

**🟡 Debatable (itsdebatable.com)**
- **Model**: Debat video 1v1 real-time dengan AI referee dasar
- **Kekuatan**: Tekanan bicara publik yang realistis, avatar anonim
- **Kelemahan**: Susah dapat lawan saat off-peak, tidak ada knowledge base, tidak ada bahasa Indonesia
- **Ancaman bagi DebateAI**: **Sedang** — tumpang tindih di fitur realtime

**🟢 Yoodli**
- **Model**: AI speech coach untuk komunikasi profesional
- **Kekuatan**: Analisis bicara mendalam, enterprise-ready
- **Kelemahan**: Bukan platform debat, tidak ada format debat formal
- **Ancaman bagi DebateAI**: Rendah — diferensiasi jelas

**🔴 Debate.org (Tutup 2022) — Pelajaran Penting**
- Platform debat terbesar selama satu dekade tutup karena moderasi gagal, bot spam, dan monetisasi buruk.
- **Implikasi**: Moderasi konten adalah **kritis untuk kelangsungan hidup** produk debat.

---

## 5. User Personas

### Persona 1 — Rani: Mahasiswi Debat Kompetitif

```
Usia     : 20 tahun | Lokasi: Bandung | Semester 4, Fakultas Hukum
Perangkat: Android (utama), laptop (sekunder) | Bilingual (ID & EN)

KEBUTUHAN
  ✦ Sparring partner 24/7 — teman tim tidak selalu tersedia
  ✦ Timer otomatis untuk pidato 7 menit WSDC/NUDC
  ✦ Feedback logis: argumen "dropped", argumen direspons
  ✦ Database mosi untuk latihan impromptu

PAIN POINTS
  ✦ Tidak bisa latihan tengah malam (tidak ada teman)
  ✦ Feedback senior subjektif dan tidak konsisten
  ✦ Tidak ada simulasi POI (Point of Information) intens

GOALS: Lolos ke NUDC Nasional semester depan
```

---

### Persona 2 — Budi: Calon Penerima Beasiswa LPDP

```
Usia     : 26 tahun | Lokasi: Surabaya | Fresh graduate S1 Teknik
Perangkat: Smartphone iOS

KEBUTUHAN
  ✦ Simulasi tanya jawab wawancara LPDP yang keras
  ✦ Latihan mempertahankan rencana studi di bawah tekanan
  ✦ Feedback khusus cara menjawab "mengapa Indonesia?"

PAIN POINTS
  ✦ Tidak punya mentor yang pernah lolos LPDP
  ✦ Takut gugup saat dicecar pewawancara

GOALS: Lulus seleksi LPDP periode berikutnya
```

---

### Persona 3 — Hendra: Manajer Penjualan Perusahaan FMCG

```
Usia     : 34 tahun | Lokasi: Jakarta | Manajemen menengah
Perangkat: Smartphone iOS + MacBook

KEBUTUHAN
  ✦ Simulasi pitching produk ke klien skeptis
  ✦ Latihan menangani objeksi harga dalam negosiasi
  ✦ Peningkatan kepercayaan diri bicara di depan direksi

PAIN POINTS
  ✦ Pelatihan internal generik, tidak relevan konteks kerjanya
  ✦ Tidak ada ruang aman untuk "gagal" tanpa malu

GOALS: Naik jabatan ke posisi Sales Director
```

---

### Persona 4 — Anisa: Siswa SMA Aktif Organisasi

```
Usia     : 17 tahun | Lokasi: Yogyakarta | Kelas 11 SMA Negeri
Perangkat: Android entry-level

KEBUTUHAN
  ✦ Berlatih debat untuk seleksi OSIS dan LDBI sekolah
  ✦ Konten menarik, tidak membosankan (gamifikasi)
  ✦ Bisa berdebat dalam bahasa Indonesia

PAIN POINTS
  ✦ Buku panduan debat kering dan tidak interaktif
  ✦ Takut salah dan malu di depan teman

GOALS: Terpilih jadi ketua OSIS, mewakili sekolah di LDBI
```

---

### Persona 5 — Pak Reza: Politisi / Staf Komunikasi

```
Usia     : 42 tahun | Lokasi: Jakarta | Staf ahli fraksi DPR
Perangkat: iPad + MacBook

KEBUTUHAN
  ✦ Simulasi konferensi pers dengan wartawan agresif
  ✦ Latihan debat dengan persona "lawan politik" realistis
  ✦ Persiapan menghadapi Debat Capres/Cagub

PAIN POINTS
  ✦ Persiapan debat hanya dengan tim internal (echo chamber)
  ✦ Tidak ada cara latihan menghadapi narasi lawan tak terduga

GOALS: Tampil lebih percaya diri dan otoritatif di media publik
```

---

### Persona 6 — Dr. Sinta: Dosen Hukum & Pelatih Debat

```
Usia     : 38 tahun | Lokasi: Makassar | Dosen Universitas Hasanuddin
Perangkat: Laptop + proyektor kelas

KEBUTUHAN
  ✦ Alat bantu mengajar yang membuat kelas lebih interaktif
  ✦ Sistem penilaian objektif yang bisa dilihat semua mahasiswa
  ✦ Arsip mosi dan contoh debat berkualitas

PAIN POINTS
  ✦ Menilai 30 mahasiswa sendiri tidak efisien
  ✦ Feedback tertulis satu per satu memakan waktu lama

GOALS: Menghasilkan lulusan siap untuk NMCC dan litigasi nyata
```

---

### Persona 7 — Kevin: Content Creator / Podcaster Politik

```
Usia     : 29 tahun | Lokasi: Jakarta | 250K subscribers YouTube
Perangkat: Desktop PC + streaming setup

KEBUTUHAN
  ✦ Berlatih sebelum episode podcast debat dengan tamu besar
  ✦ Cari counter-argumen yang belum terpikirkan
  ✦ Potensi konten: streaming sesi debat vs AI di channel

PAIN POINTS
  ✦ Riset kontra-argumen manual butuh waktu berjam-jam
  ✦ Tidak ada cara asik untuk "warm-up" sebelum rekaman

GOALS: Konten debat yang lebih tajam dan viral
```

---

## 6. Problem Statement

### 6.1 Core Problem

> **Berlatih debat berkualitas tinggi saat ini sangat tergantung pada ketersediaan manusia lain** — teman tim, senior, pelatih, atau lawan tanding. Ketika tidak ada yang tersedia, kualitas latihan menurun drastis. Feedback yang ada pun seringkali subjektif, tidak konsisten, dan tidak terstruktur.

### 6.2 Problem Breakdown

| # | Masalah | Dampak | Siapa yang Terdampak |
|---|---|---|---|
| P1 | Tidak ada sparring partner 24/7 | Frekuensi latihan rendah | Semua persona |
| P2 | Feedback juri/senior subjektif & tidak konsisten | Sulit mengukur progres | Persona 1, 4, 6 |
| P3 | Tidak ada simulasi lawan yang "tidak terduga" | Latihan jadi echo chamber | Persona 1, 5, 6 |
| P4 | Konten debat Indonesia tidak terdigitalisasi | AI tidak memiliki konteks lokal | Semua persona |
| P5 | Latihan debat intimidatif bagi pemula | Barrier masuk tinggi, takut malu | Persona 2, 4 |
| P6 | Tidak ada alat bantu mengajar debat yang modern | Kelas debat tidak efisien | Persona 6 |
| P7 | Tidak ada platform debat berbahasa Indonesia | Pasar 50 juta pelajar tidak terlayani | Semua persona Indonesia |

---

## 7. Solusi & Value Proposition

### 7.1 Solusi Utama

```
MASALAH                        SOLUSI DEBATEAI
──────────────────────────────────────────────────────────────
Tidak ada partner 24/7     →  AI Lawan siap setiap saat
Feedback subjektif         →  3 AI Juri dengan rubrik terstandar
Echo chamber               →  AI dengan stance & persona berbeda
Konten Indonesia kosong    →  Knowledge base dari MKRI, KPU, ILC, dll.
Intimidatif bagi pemula    →  Mode privat, avatar anonim, level kesulitan
Kelas tidak efisien        →  Classroom Mode untuk dosen
Tidak ada platform Indo    →  Bilingual full, konteks lokal kuat
```

### 7.2 Unique Value Proposition

> *"Satu-satunya platform debat di Indonesia yang memadukan AI lawan dengan persona nyata, juri AI terstruktur, penonton simulasi, dan knowledge base dari debat-debat yang sesungguhnya — tersedia 24/7, dalam bahasa Indonesia maupun Inggris."*

### 7.3 Positioning Statement

Untuk **pelajar, mahasiswa, dan profesional Indonesia** yang ingin meningkatkan kemampuan debat dan berpikir kritis, **DebateAI** adalah **platform latihan debat berbasis AI** yang menyediakan sparring partner, juri, dan penonton simulasi kapan saja — tidak seperti aplikasi komunikasi umum seperti Yoodli, DebateAI dirancang khusus untuk format debat formal Indonesia (KDMI, NUDC) dan konteks lokal yang kaya.

---

## 8. Feature Requirements

### 8.1 Metode Prioritasi (MoSCoW)

| Label | Keterangan |
|---|---|
| **M — Must Have** | Wajib ada di MVP. Tanpa ini produk tidak bisa diluncurkan. |
| **S — Should Have** | Penting, masuk iterasi awal setelah MVP. |
| **C — Could Have** | Nilai tambah, masuk jika sumber daya memadai. |
| **W — Won't Have** | Tidak ada di roadmap ini, bisa dikaji ulang di masa depan. |

---

### 8.2 Modul: Autentikasi & Profil

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| A-01 | Registrasi email & password | M | Wajib |
| A-02 | Login Google OAuth | M | Kemudahan onboarding |
| A-03 | Login Apple ID | S | Wajib untuk iOS App Store review |
| A-04 | Profil pengguna (nama, foto, bio, level debat) | M | |
| A-05 | Pilihan bahasa antarmuka (ID / EN) | M | |
| A-06 | Riwayat sesi debat (list & detail) | M | |
| A-07 | Statistik personal (win rate, avg score, jumlah sesi) | S | |
| A-08 | Badge & achievement | C | Gamifikasi ringan |
| A-09 | Pengaturan notifikasi | S | |
| A-10 | Hapus akun & export data (UU PDP) | M | Compliance wajib |

---

### 8.3 Modul: Pembuatan Sesi Debat (Lobby)

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| L-01 | Pilih tema dari kategori | M | Politik, Hukum, Ekonomi, Sosial, Teknologi, Bebas |
| L-02 | Input topik kustom bebas | M | |
| L-03 | Pilih format debat | M | Oxford, British Parliamentary, KDMI, NUDC, Bebas, Wawancara |
| L-04 | Pilih persona diri sendiri | M | Template atau kustom |
| L-05 | Pilih stance (Pro / Kontra / Netral) | M | |
| L-06 | Pilih lawan: AI atau undang user | M | |
| L-07 | Konfigurasi AI Lawan: persona, level, provider | M | |
| L-08 | Konfigurasi AI Juri: aktif/nonaktif per juri | S | |
| L-09 | Konfigurasi AI Penonton: aktif/nonaktif | S | |
| L-10 | Atur jumlah ronde (1, 3, 5, 7) | M | |
| L-11 | Atur durasi per giliran (1–15 menit, timer bebas) | M | |
| L-12 | Invite user via kode room (online mode) | S | |
| L-13 | Matchmaking otomatis (level & topik sejenis) | C | Fase 2 |
| L-14 | Mode kelas: 1 host, banyak observer | C | Untuk dosen/instruktur |
| L-15 | Simpan konfigurasi sesi sebagai template | S | |

---

### 8.4 Modul: Arena Debat (Core Feature)

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| D-01 | Input teks argumen dengan rich text | M | |
| D-02 | Countdown timer per giliran | M | |
| D-03 | Input suara (speech-to-text real-time) | M | |
| D-04 | Indikator giliran bicara yang jelas | M | |
| D-05 | Respons AI Lawan (teks) | M | |
| D-06 | Respons AI Lawan (suara/TTS) | S | |
| D-07 | Feedback real-time AI Juri per argumen | M | |
| D-08 | Reaksi visual AI Penonton (emoji/animasi) | S | |
| D-09 | Komentar singkat AI Penonton (gelembung teks) | S | |
| D-10 | Progress bar intensitas debat | C | Visual engagement |
| D-11 | Referensi knowledge base yang digunakan AI | S | Transparansi AI |
| D-12 | Interupsi POI (Point of Information) | C | Format WSDC/BP |
| D-13 | Pause & resume sesi | S | |
| D-14 | Forfeit / menyerah dengan konfirmasi | M | |
| D-15 | Chat samping (online mode) | S | |
| D-16 | Transkip argumen berjalan (live transcript) | S | |
| D-17 | Notifikasi suara saat giliran berubah | M | UX penting |
| D-18 | Indikator "AI sedang berpikir" (loading state) | M | UX penting |

---

### 8.5 Modul: Hasil & Analisis

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| R-01 | Scorecard lengkap per aspek (0–100) | M | |
| R-02 | Narasi feedback dari setiap juri AI | M | |
| R-03 | Highlight argumen terkuat & terlemah | M | |
| R-04 | Deteksi fallacy logika | S | Ad hominem, straw man, dll. |
| R-05 | Perbandingan performa dengan sesi sebelumnya | S | Grafik progres |
| R-06 | Transkip lengkap debat | M | |
| R-07 | Rekap reaksi & mood penonton | S | |
| R-08 | Saran latihan untuk sesi berikutnya | S | AI-generated tips |
| R-09 | Share ringkasan ke media sosial | C | Gambar hasil debat |
| R-10 | Unduh PDF laporan debat | C | |

---

### 8.6 Modul: Knowledge Base

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| K-01 | Admin ingest transcript YouTube via URL | M | |
| K-02 | Admin upload PDF/TXT dokumen | M | |
| K-03 | Pencarian knowledge base untuk pengguna | S | |
| K-04 | Knowledge base otomatis tersuntikkan ke AI | M | RAG saat debat |
| K-05 | Sumber referensi ditampilkan saat AI menggunakannya | S | |
| K-06 | User submit sumber baru (moderasi admin) | C | |
| K-07 | Auto-scraping terjadwal | C | Fase 3 |
| K-08 | Tag topik & persona per dokumen | M | Filtering RAG |
| K-09 | Hapus/nonaktifkan dokumen yang usang | M | Admin panel |

---

### 8.7 Modul: Roleplay & Persona

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| P-01 | Library template persona tokoh terkenal | M | Min 20 template saat launch |
| P-02 | Buat persona kustom (nama, deskripsi, stance, gaya) | M | |
| P-03 | AI Lawan konsisten dengan gaya bicara persona | M | |
| P-04 | Persona pack skenario historis | S | Debat kemerdekaan, sidang MK |
| P-05 | Simpan & kelola persona favorit | S | |

---

### 8.8 Modul: Sosial & Gamifikasi

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| G-01 | Sistem poin per sesi & argumen berkualitas | S | |
| G-02 | ELO rating (online debat) | S | |
| G-03 | Leaderboard mingguan & bulanan | S | |
| G-04 | Badge pencapaian | C | |
| G-05 | Tantangan debat harian | C | |
| G-06 | Mode turnamen (bracket) | W | Tidak di roadmap ini |

---

### 8.9 Modul: Admin Panel

| ID | Fitur | Prioritas | Keterangan |
|---|---|:---:|---|
| ADM-01 | Dashboard: sesi aktif, user aktif, error | M | |
| ADM-02 | Manajemen knowledge base (CRUD) | M | |
| ADM-03 | Konfigurasi AI provider & API key | M | |
| ADM-04 | Moderasi: laporan pengguna, konten flagged | M | |
| ADM-05 | Manajemen pengguna (ban, suspend, reset) | M | |
| ADM-06 | Analytics: DAU, MAU, retention | S | |
| ADM-07 | Manajemen langganan & pembayaran | S | |
| ADM-08 | Log audit semua aksi admin | M | Security compliance |

---

## 9. User Stories & Acceptance Criteria

### US-01: Latihan Debat vs AI
> *Sebagai mahasiswa debat (Persona 1), saya ingin memulai sesi debat melawan AI kapan saja, agar saya bisa berlatih meski tidak ada teman tim.*

**Acceptance Criteria:**
- [ ] Pengguna dapat membuat sesi baru dalam ≤ 3 langkah utama
- [ ] AI Lawan merespons dalam < 5 detik setelah argumen dikirim
- [ ] Timer countdown berjalan akurat (toleransi ±1 detik)
- [ ] Sesi dapat dimulai tanpa koneksi ke user lain

---

### US-02: Menerima Feedback Juri
> *Sebagai pengguna, saya ingin menerima scorecard dari juri AI setelah setiap argumen, agar saya tahu aspek mana yang perlu ditingkatkan.*

**Acceptance Criteria:**
- [ ] Feedback juri muncul dalam < 8 detik setelah argumen dikirim
- [ ] Feedback mencakup minimal 3 aspek: logika, retorika, fakta
- [ ] Feedback ditulis dalam bahasa yang sama dengan bahasa sesi
- [ ] Skor ditampilkan dalam format visual (bar) dan teks narasi

---

### US-03: Debat Online Real-time
> *Sebagai pengguna, saya ingin mengundang teman/lawan untuk berdebat secara live.*

**Acceptance Criteria:**
- [ ] Pengguna dapat membuat kode room dan berbagi ke lawan
- [ ] Lawan dapat bergabung dalam < 10 detik
- [ ] Latensi giliran bicara < 2 detik pada jaringan normal (4G)
- [ ] Jika user disconnect > 30 detik, sistem berikan opsi: lanjut dengan AI atau akhiri

---

### US-04: Roleplay Tokoh Tertentu
> *Sebagai pengguna, saya ingin memilih/membuat persona tokoh, agar sesi debat lebih imersif.*

**Acceptance Criteria:**
- [ ] Library berisi minimal 20 template persona saat launch (10 ID, 10 EN)
- [ ] Pengguna dapat membuat persona kustom: nama, deskripsi, stance
- [ ] AI Lawan konsisten menggunakan gaya bahasa persona sepanjang sesi
- [ ] Persona dapat disimpan dan digunakan kembali

---

### US-05: Knowledge Base Digunakan AI
> *Sebagai admin, saya ingin memasukkan transcript debat YouTube, agar AI menggunakan referensi debat nyata.*

**Acceptance Criteria:**
- [ ] Admin masukkan URL YouTube, sistem ekstrak transcript otomatis
- [ ] Proses ingestion selesai dalam < 5 menit per video
- [ ] Saat AI menggunakan referensi KB, sumber ditampilkan ke pengguna
- [ ] Sistem menolak konten duplikat (cek hash)

---

### US-06: Melihat Hasil & Analisis Akhir
> *Sebagai pengguna, saya ingin melihat ringkasan performa lengkap setelah debat selesai.*

**Acceptance Criteria:**
- [ ] Halaman hasil menampilkan skor total dan per-aspek untuk setiap ronde
- [ ] Argumen terkuat dan terlemah disorot secara visual
- [ ] Transkip lengkap dapat dilihat dan dicari
- [ ] Data tersimpan di riwayat akun secara permanen

---

### US-07: Wawancara Simulasi LPDP
> *Sebagai calon penerima LPDP, saya ingin memilih skenario "Wawancara LPDP" dan berhadapan dengan AI pewawancara yang keras.*

**Acceptance Criteria:**
- [ ] Format "Wawancara" tersedia sebagai opsi format sesi
- [ ] Template persona "Pewawancara LPDP" tersedia di library
- [ ] AI mengajukan pertanyaan relevan dengan skenario LPDP
- [ ] Feedback juri fokus pada kejelasan jawaban dan kepercayaan diri

---

### US-08: Mode Kelas (Classroom Mode)
> *Sebagai dosen, saya ingin membuat sesi debat yang bisa diobservasi oleh seluruh kelas.*

**Acceptance Criteria:**
- [ ] Host dapat membuat sesi dan undang observer via kode kelas
- [ ] Observer dapat melihat argumen, skor, dan reaksi penonton real-time
- [ ] Hasil sesi dapat diekspor sebagai laporan untuk penilaian
- [ ] Host dapat menghentikan/pause sesi kapan saja

---

## 10. Non-Functional Requirements

### 10.1 Performa

| Metrik | Target |
|---|---|
| Waktu respons AI Lawan | < 5 detik (95th percentile) |
| Waktu feedback AI Juri | < 8 detik setelah argumen dikirim |
| Latensi WebSocket (online mode) | < 200ms |
| App startup time (cold start) | < 3 detik |
| Waktu ingestion KB (per video YouTube) | < 5 menit |
| Waktu pencarian knowledge base | < 1 detik |

### 10.2 Skalabilitas

| Metrik | Target Launch | Target Tahun 1 |
|---|---|---|
| Sesi debat concurrent | 500 sesi | 5.000 sesi |
| Pengguna terdaftar | 1.000 | 50.000 |
| Dokumen KB (chunk) | 50.000 | 500.000 |
| Throughput API | 1.000 req/detik | 10.000 req/detik |

### 10.3 Keandalan (Reliability)

- **Uptime**: 99,5% (tidak termasuk maintenance window terjadwal)
- **Recovery Point Objective (RPO)**: < 1 jam
- **Recovery Time Objective (RTO)**: < 4 jam
- **Sesi terputus**: Jika koneksi < 60 detik, sesi dapat dilanjutkan dari titik terakhir
- **Backup database**: Setiap 6 jam, retensi 30 hari

### 10.4 Kompatibilitas Platform

| Platform | Versi Minimum |
|---|---|
| Android | 8.0 (API 26) |
| iOS | 14.0 |
| Web | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |
| Desktop Windows | Windows 10 |
| Desktop macOS | macOS 11 Big Sur |
| Desktop Linux | Ubuntu 20.04+ |

### 10.5 Aksesibilitas

- Dukungan screen reader (TalkBack Android, VoiceOver iOS)
- Ukuran font adjustable (min 14sp, max 24sp)
- Kontras warna minimum WCAG AA (4,5:1)
- Tidak bergantung pada warna saja untuk info kritis
- Keyboard navigation lengkap untuk versi web/desktop
- Focus indicator yang jelas pada semua elemen interaktif
- Subtitle/caption untuk output TTS AI Lawan
- Opsi "Reduced Motion" untuk menonaktifkan animasi penonton
- Semantic HTML pada versi web (heading hierarchy, ARIA labels)
- Target sentuh minimum 48x48dp untuk elemen interaktif mobile

---

## 11. Sistem AI: Juri, Penonton & Lawan

### 11.1 AI Lawan Debat

**Input yang diterima AI Lawan:**
1. Persona (nama, deskripsi, gaya bicara, stance)
2. Format debat dan aturannya
3. Topik/mosi debat
4. Riwayat argumen (semua giliran sebelumnya)
5. Top-5 chunk relevan dari knowledge base (RAG)
6. Level kesulitan

**Tingkat Kesulitan:**

| Level | Karakteristik Argumen | Strategi |
|---|---|---|
| 🟢 Pemula | Satu poin per giliran, bahasa sederhana | Hanya menyatakan posisi, tidak menyerang |
| 🟡 Menengah | Multi-poin, mengutip data, sesekali menyerang premis | Rebuttal dasar + counter-argumen |
| 🔴 Ahli | Berlapis, deteksi kelemahan logis lawan, referensi data real | Full attack: premis, data, implikasi, fallacy |

**AI Provider yang Dapat Dipilih:**

| Provider | Model | Keunggulan |
|---|---|---|
| Google | Gemini 1.5 Pro / 2.0 Flash | Konteks panjang, grounding |
| OpenAI | GPT-4o | Kualitas bahasa natural tinggi |
| Anthropic | Claude 3.5 Sonnet | Nuanced reasoning, ikuti instruksi kompleks |

---

### 11.2 Sistem AI Juri

Tiga juri dengan perspektif berbeda menilai setiap argumen secara independen:

| Juri | Nama | Fokus |
|---|---|---|
| ⚖️ Juri 1 | Juri Logika | Validitas logika, akurasi fakta, deteksi fallacy |
| 🎭 Juri 2 | Juri Retorika | Struktur, persuasi, diksi, gaya bicara |
| 🌏 Juri 3 | Juri Dampak | Relevansi sosial, implikasi kebijakan, nilai moral |

**Rubrik Penilaian (per argumen, 0–100):**

| Aspek | Bobot | Deskripsi Detail |
|---|---|---|
| Kekuatan Argumen | 30% | Logika valid, premis kuat, tidak ada fallacy, internal konsisten |
| Penggunaan Fakta & Data | 25% | Akurasi data, relevansi sumber, spesifisitas |
| Teknik Retorika | 20% | Struktur PREP/CWI, diksi tepat, urgensi, persuasivitas |
| Responsivitas | 15% | Seberapa baik merespons & menyerang argumen lawan sebelumnya |
| Kejelasan & Struktur | 10% | Mudah dipahami, terorganisir, tidak bertele-tele |

**Output JSON Juri (contoh):**
```json
{
  "juri_type": "logika",
  "skor_total": 78,
  "breakdown": {
    "kekuatan_argumen": 80,
    "fakta_data": 65,
    "retorika": 82,
    "responsivitas": 75,
    "kejelasan": 88
  },
  "ringkasan": "Argumen memiliki premis kuat, namun data statistik dikutip tanpa sumber yang jelas.",
  "highlight_positif": ["Identifikasi masalah inti tepat", "Analogi yang relevan"],
  "highlight_negatif": ["Data tidak bersumber", "Terlalu bergantung pada emosi di penutup"],
  "fallacy_detected": null,
  "saran": "Sertakan sumber data spesifik untuk memperkuat argumen faktual."
}
```

**Fallacy yang Dideteksi:**

| Fallacy | Keterangan |
|---|---|
| Ad Hominem | Menyerang pribadi, bukan argumen |
| Straw Man | Mendistorsi argumen lawan |
| False Dilemma | Hanya menyajikan dua pilihan padahal ada lebih |
| Slippery Slope | Menganggap satu langkah otomatis mengarah ke ekstrem |
| Appeal to Authority | Mengutip otoritas yang tidak relevan |
| Circular Reasoning | Kesimpulan = premis |
| Hasty Generalization | Generalisasi dari sampel kecil |

---

### 11.3 Sistem AI Penonton

**Tabel Reaksi berdasarkan Skor Argumen:**

| Skor Rata-rata Juri | Reaksi Penonton | Intensitas |
|---|---|---|
| 85–100 | 👏 Tepuk tangan panjang + komentar antusias | Tinggi |
| 70–84 | 👍 Anggukan persetujuan + komentar positif | Sedang-Tinggi |
| 50–69 | 🤔 Reaksi netral / campuran | Rendah-Sedang |
| 30–49 | 😤 Beberapa sorakan + komentar skeptis | Sedang |
| 0–29 | 😬 Sorakan keras + komentar negatif | Tinggi (negatif) |

**Karakteristik Komentar Penonton (5–8 per argumen):**
- Mix antara komentar mendukung, netral, dan skeptis
- Bahasa santai dan natural (bukan formal)
- Contoh: *"Poin yang bagus soal anggaran!"*, *"Itu bukan fakta yang akurat..."*, *"Nah ini baru argumen yang kuat 🔥"*

---

### 11.4 Arsitektur Multi-Agent

```
User mengirim argumen
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │                 DEBATE ORCHESTRATOR                  │
 │                                                      │
 │  1. Ekstrak argumen user                             │
 │  2. Query knowledge base (RAG) → top-5 chunks        │
 │  3. Inject context ke semua agent                    │
 └────────┬────────────────────┬───────────────────────┘
          │                    │
    ┌─────▼──────┐      ┌──────▼──────┐
    │  AI LAWAN  │      │  AI JURI    │
    │            │      │  (x3 paralel│
    │  Generate  │      │   per aspek)│
    │  respons   │      │             │
    └─────┬──────┘      └──────┬──────┘
          │                    │
          │             ┌──────▼──────┐
          │             │ AI PENONTON │
          │             │  (reaksi &  │
          │             │  komentar)  │
          │             └──────┬──────┘
          │                    │
          └─────────┬──────────┘
                    │
                    ▼
              Render ke UI
```

---

## 12. Knowledge Base & RAG Strategy

### 12.1 Sumber Data

| Kategori | Sumber | Format | Prioritas |
|---|---|---|---|
| Debat Presiden RI | KPU (2014, 2019, 2024) | Video/Teks | 🔴 Tinggi |
| Sidang MK | mkri.id Risalah Sidang | PDF | 🔴 Tinggi |
| Debat Parlemen | dpr.go.id Risalah Rapat | PDF | 🟡 Sedang |
| YouTube Indonesia | Mata Najwa, ILC, Total Politik | Transcript API | 🔴 Tinggi |
| Mosi Kompetisi | NekoTab (36.000+ mosi), IDEA Debatabase | JSON/Web | 🔴 Tinggi |
| Dataset Debat Global | OpenCaselist (3,5 juta dok), IBM Project Debater | JSON | 🟡 Sedang |
| Debat Parlemen Global | Hansard UK, ParlSpeech, US Congressional | Text | 🟢 Rendah |
| Debat Presiden AS | UCSB American Presidency Project (1960–2024) | Text | 🟡 Sedang |

### 12.2 Alur Ingestion (Pipeline)

```
Sumber Input (URL YouTube / PDF / URL Web)
           │
           ▼
    Ekstraksi Konten
    ┌───────────────────────────────────────┐
    │ YouTube → youtube-transcript-api      │
    │ PDF     → PyMuPDF / pdfplumber        │
    │ Web     → BeautifulSoup / Playwright  │
    └───────────────────────────────────────┘
           │
           ▼
    Pembersihan & Normalisasi Teks
           │
           ▼
    Language Detection (ID / EN)
           │
           ▼
    Chunking (500 token, overlap 50 token)
           │
           ▼
    Metadata Extraction
    (judul, sumber, URL, tanggal, topik, tokoh, bahasa)
           │
           ▼
    Embedding Generation
    (Gemini text-embedding-004 768d — default
     atau OpenAI text-embedding-3-large 1536d — opsional, perlu ubah schema)
           │
           ▼
    Deduplication Check (SHA-256 hash)
           │
           ▼
    Simpan ke PostgreSQL + pgvector
```

### 12.3 Retrieval saat Debat (RAG)

```
Argumen User (teks)
        │
        ▼
Generate Query Embedding
        │
        ▼
Cosine Similarity Search di pgvector
(filter: bahasa, topik debat)
        │
        ▼
Ambil Top-5 Chunk (threshold similarity > 0.75)
        │
        ▼
Inject ke System Prompt AI Lawan + AI Juri
```

### 12.4 Strategi Kualitas Knowledge Base

- Chunk dengan similarity score < 0,75 tidak digunakan
- Setiap chunk wajib memiliki tag topik dan bahasa
- Admin dapat deactivate chunk individual jika konten usang/salah
- Chunk dari sumber primer (KPU, MKRI) diberi bobot lebih tinggi
- Review konten berkala setiap 3 bulan

---

## 13. Technical Architecture

### 13.1 Gambaran Arsitektur Sistem

```
┌──────────────────────────────────────────────────────┐
│                     CLIENT LAYER                     │
│         Flutter (iOS / Android / Web / Desktop)       │
│  Riverpod State Mgmt │ Socket.IO Client │ WebRTC      │
└────────────────┬─────────────────────────────────────┘
                 │ HTTPS + WSS
                 ▼
┌──────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                  │
│              Node.js + Express + TypeScript           │
│  Auth (JWT) │ Rate Limiting │ Load Balancer │ Logging  │
│  WebSocket Manager (Socket.IO Server)                │
└────┬──────────────────────────────────┬──────────────┘
     │ Internal REST/gRPC               │ WebSocket
     ▼                                  ▼
┌────────────────┐              ┌──────────────────────┐
│ DEBATE ENGINE  │              │   REALTIME SERVICE   │
│ Python FastAPI │              │   Redis Pub/Sub       │
│                │              │   + Socket.IO Adapter │
│ AI Orchestrator│              └──────────────────────┘
│ RAG Service    │
│ Scoring Engine │
│ KB Pipeline    │
└────┬───────────┘
     │
     ▼
┌──────────────────────────────────────────────────────┐
│                    AI PROVIDERS                      │
│   Google Gemini API │ OpenAI API │ Anthropic API     │
│   Whisper STT API   │ ElevenLabs TTS API             │
└──────────────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────────┐
│                   DATA LAYER                         │
│  PostgreSQL + pgvector  │  Redis Cache  │  S3/R2     │
└──────────────────────────────────────────────────────┘
```

### 13.2 Stack Teknologi Detail

**Frontend (Client)**

| Komponen | Teknologi | Alasan |
|---|---|---|
| Framework | Flutter 3.x (Dart) | Satu codebase iOS/Android/Web/Desktop |
| State Management | Riverpod | Reactive, testable, tidak bergantung BuildContext |
| Navigasi | GoRouter | Deep linking, URL-based, declarative |
| WebSocket | Socket.IO Dart client | Realtime debat online |
| Voice STT | speech_to_text package | On-device, lintas platform |
| Voice TTS | flutter_tts / ElevenLabs SDK | AI Lawan berbicara |
| HTTP Client | Dio | Interceptor, retry, logging |
| Local Storage | Hive / Isar | Offline data & cache |
| Animasi | Flutter Animate + Rive | Animasi penonton & UI imersif |

**Backend API Gateway**

| Komponen | Teknologi | Alasan |
|---|---|---|
| Runtime | Node.js 20 LTS | Ekosistem luas, async I/O |
| Framework | Express.js + TypeScript | Matang, banyak middleware |
| WebSocket | Socket.IO | Fallback otomatis, room management |
| Auth | JWT + bcrypt | Stateless, scalable |
| ORM | Prisma | Type-safe, migration |
| Validation | Zod | Runtime type validation |
| Rate Limiting | express-rate-limit + Redis | Anti-abuse |

**Debate Engine**

| Komponen | Teknologi | Alasan |
|---|---|---|
| Framework | Python FastAPI | Async, cepat, auto-docs |
| AI Orchestration | LangChain + LangGraph | Multi-agent flow, RAG chain |
| Vector Search | pgvector (PostgreSQL) | Tidak butuh infra DB tambahan |
| YouTube Transcript | youtube-transcript-api | Gratis, handal |
| PDF Parser | PyMuPDF (fitz) | Cepat, akurat |
| Task Queue | Celery + Redis | Background ingestion KB |

**Infrastructure**

| Komponen | Teknologi |
|---|---|
| Database utama | PostgreSQL 16 |
| Cache & Pub/Sub | Redis 7 |
| Object Storage | Cloudflare R2 / AWS S3 |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Monitoring | Grafana + Prometheus |
| Logging | Loki + Grafana |
| CDN | Cloudflare |

### 13.3 Struktur Folder Proyek

```
debate-ai/
├── apps/
│   ├── mobile/                      # Flutter cross-platform app
│   │   ├── lib/
│   │   │   ├── core/
│   │   │   │   ├── theme/
│   │   │   │   ├── routing/
│   │   │   │   ├── di/
│   │   │   │   └── utils/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── lobby/
│   │   │   │   ├── debate/
│   │   │   │   │   ├── arena/
│   │   │   │   │   ├── judge/
│   │   │   │   │   └── audience/
│   │   │   │   ├── roleplay/
│   │   │   │   ├── results/
│   │   │   │   └── knowledge/
│   │   │   └── shared/
│   │   └── pubspec.yaml
│   │
│   ├── api-gateway/                 # Node.js + Express + TypeScript
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── websocket/
│   │   │   ├── middleware/
│   │   │   └── services/
│   │   ├── prisma/schema.prisma
│   │   └── package.json
│   │
│   ├── debate-engine/               # Python FastAPI
│   │   ├── app/
│   │   │   ├── agents/
│   │   │   │   ├── opponent.py
│   │   │   │   ├── judge.py
│   │   │   │   └── audience.py
│   │   │   ├── rag/
│   │   │   │   ├── retriever.py
│   │   │   │   ├── embeddings.py
│   │   │   │   └── chunker.py
│   │   │   ├── pipelines/
│   │   │   │   ├── youtube.py
│   │   │   │   ├── pdf.py
│   │   │   │   └── web.py
│   │   │   ├── scoring/rubric.py
│   │   │   ├── routers/
│   │   │   └── core/
│   │   └── requirements.txt
│   │
│   └── admin-panel/                 # Next.js Admin UI
│       └── pages/
│
├── packages/
│   └── shared-types/
│
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│
└── scripts/
    ├── seed-kb.py
    └── migrate.sh
```

---

## 14. Database Schema

### 14.1 Entity Relationship

```
users ──────────── debate_sessions ──────────── debate_participants
  │                      │                              │
  │               debate_arguments ──────────── judge_scores
  │                      │
  │               audience_reactions
  │
  └── personas ─── (used in) ─── debate_participants

kb_documents ──── kb_chunks (+ pgvector embedding)
```

### 14.2 Schema SQL Lengkap

> **Catatan**: Schema SQL di bawah ini adalah ringkasan. Schema lengkap dan terkini ada di
> [Database_Design_Prisma.md](./Database_Design_Prisma.md) yang merupakan **single source of truth**
> untuk seluruh skema database.

```sql
-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),
    name            VARCHAR(100) NOT NULL,
    avatar_url      TEXT,
    bio             TEXT,
    preferred_language  VARCHAR(5) DEFAULT 'id',
    debate_level    VARCHAR(20) DEFAULT 'beginner',
    elo_rating      INTEGER DEFAULT 1000,
    total_sessions  INTEGER DEFAULT 0,
    total_wins      INTEGER DEFAULT 0,
    is_pro          BOOLEAN DEFAULT FALSE,
    role            VARCHAR(20) DEFAULT 'USER',
    warning_count   INTEGER DEFAULT 0,
    is_banned       BOOLEAN DEFAULT FALSE,
    is_suspended    BOOLEAN DEFAULT FALSE,
    suspended_until TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TABLE oauth_providers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider    VARCHAR(20) NOT NULL,
    provider_id VARCHAR(255) NOT NULL,
    UNIQUE(provider, provider_id)
);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PERSONAS
-- ============================================================

CREATE TABLE personas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT NOT NULL,
    speaking_style  TEXT,
    stance_default  VARCHAR(10),
    language        VARCHAR(5) DEFAULT 'id',
    avatar_url      TEXT,
    is_template     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEBATE MOTIONS
-- ============================================================

CREATE TABLE debate_motions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text            TEXT NOT NULL,
    category        VARCHAR(50) NOT NULL,
    format          VARCHAR(30),
    language        VARCHAR(5) DEFAULT 'id',
    difficulty      VARCHAR(20) DEFAULT 'MEDIUM',
    source          VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    usage_count     INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSION TEMPLATES
-- ============================================================

CREATE TABLE session_templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    topic           TEXT,
    category        VARCHAR(50) DEFAULT 'FREE',
    format          VARCHAR(30) DEFAULT 'FREE',
    total_rounds    INTEGER DEFAULT 3,
    time_per_turn   INTEGER DEFAULT 300,
    ai_provider     VARCHAR(20) DEFAULT 'GEMINI',
    ai_difficulty   VARCHAR(20),
    persona_id      UUID,
    is_judged       BOOLEAN DEFAULT TRUE,
    has_audience    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEBATE SESSIONS
-- ============================================================

CREATE TABLE debate_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255),
    topic           TEXT NOT NULL,
    motion          TEXT,
    format          VARCHAR(30) NOT NULL,
    category        VARCHAR(50) DEFAULT 'FREE',
    language        VARCHAR(5) DEFAULT 'id',
    status          VARCHAR(20) DEFAULT 'waiting',
    mode            VARCHAR(10) DEFAULT 'offline',
    total_rounds    INTEGER DEFAULT 3,
    current_round   INTEGER DEFAULT 0,
    time_per_turn   INTEGER DEFAULT 300,
    host_user_id    UUID NOT NULL REFERENCES users(id),
    room_code       VARCHAR(8),
    ai_provider     VARCHAR(20) DEFAULT 'gemini',
    current_turn    INTEGER DEFAULT 1,
    is_judged       BOOLEAN DEFAULT TRUE,
    has_audience    BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    started_at      TIMESTAMPTZ,
    ended_at        TIMESTAMPTZ
);

-- ============================================================
-- PARTICIPANTS
-- ============================================================

CREATE TABLE debate_participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES debate_sessions(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    persona_id      UUID REFERENCES personas(id),
    persona_name    VARCHAR(100),
    stance          VARCHAR(10) NOT NULL,
    role            VARCHAR(20) NOT NULL,
    is_ai           BOOLEAN DEFAULT FALSE,
    ai_difficulty   VARCHAR(20),
    join_order      INTEGER DEFAULT 1,
    last_active_at  TIMESTAMPTZ,
    joined_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ARGUMENTS
-- ============================================================

CREATE TABLE debate_arguments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES debate_sessions(id) ON DELETE CASCADE,
    participant_id  UUID NOT NULL REFERENCES debate_participants(id),
    content         TEXT NOT NULL,
    content_type    VARCHAR(10) DEFAULT 'text',
    audio_url       TEXT,
    round_number    INTEGER NOT NULL,
    turn_number     INTEGER NOT NULL,
    duration_sec    INTEGER,
    kb_refs         JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- JUDGE SCORES
-- ============================================================

CREATE TABLE judge_scores (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id          UUID NOT NULL REFERENCES debate_sessions(id) ON DELETE CASCADE,
    argument_id         UUID NOT NULL REFERENCES debate_arguments(id) ON DELETE CASCADE,
    judge_type          VARCHAR(20) NOT NULL,
    argument_strength   INTEGER NOT NULL,
    fact_data_usage     INTEGER NOT NULL,
    rhetoric_technique  INTEGER NOT NULL,
    responsiveness      INTEGER NOT NULL,
    clarity_structure   INTEGER NOT NULL,
    total_score         NUMERIC(5,2) NOT NULL,
    summary             TEXT NOT NULL,
    highlights_positive JSONB,
    highlights_negative JSONB,
    fallacy_detected    VARCHAR(50),
    suggestion          TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUDIENCE REACTIONS
-- ============================================================

CREATE TABLE audience_reactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES debate_sessions(id) ON DELETE CASCADE,
    argument_id     UUID NOT NULL REFERENCES debate_arguments(id) ON DELETE CASCADE,
    reaction_type   VARCHAR(20) NOT NULL,
    intensity       INTEGER DEFAULT 50,
    comments        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSION RESULTS
-- ============================================================

CREATE TABLE session_results (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id              UUID UNIQUE NOT NULL REFERENCES debate_sessions(id),
    winner_participant_id   UUID REFERENCES debate_participants(id),
    is_draw                 BOOLEAN DEFAULT FALSE,
    final_scores            JSONB NOT NULL,
    summary                 TEXT,
    key_moments             JSONB,
    suggestions             JSONB,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan                    VARCHAR(20) NOT NULL,
    status                  VARCHAR(20) DEFAULT 'PENDING',
    midtrans_order_id       VARCHAR(100) UNIQUE,
    midtrans_transaction_id VARCHAR(100),
    current_period_start    TIMESTAMPTZ NOT NULL,
    current_period_end      TIMESTAMPTZ NOT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AI USAGE LOGS
-- ============================================================

CREATE TABLE ai_usage_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID,
    provider        VARCHAR(20) NOT NULL,
    model_name      VARCHAR(100) NOT NULL,
    prompt_tokens   INTEGER NOT NULL,
    comp_tokens     INTEGER NOT NULL,
    total_cost_usd  NUMERIC(10,6) NOT NULL,
    purpose         VARCHAR(50) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ELO HISTORY
-- ============================================================

CREATE TABLE elo_histories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id  UUID NOT NULL,
    old_rating  INTEGER NOT NULL,
    new_rating  INTEGER NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATION TOKENS
-- ============================================================

CREATE TABLE notification_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(500) UNIQUE NOT NULL,
    device_type VARCHAR(20) NOT NULL,
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- KB SUBMISSIONS (Community)
-- ============================================================

CREATE TABLE kb_submissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    source_url  TEXT NOT NULL,
    description TEXT,
    status      VARCHAR(20) DEFAULT 'PENDING',
    reviewer_id UUID REFERENCES users(id),
    review_note TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ADMIN AUDIT LOGS
-- ============================================================

CREATE TABLE admin_audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id    UUID NOT NULL REFERENCES users(id),
    action      VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id   UUID,
    metadata    JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BADGES & GAMIFICATION
-- ============================================================

CREATE TABLE badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_url    TEXT,
    category    VARCHAR(50) DEFAULT 'general',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id    UUID NOT NULL REFERENCES badges(id),
    earned_at   TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

-- ============================================================
-- KNOWLEDGE BASE
-- ============================================================

CREATE TABLE kb_documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(500) NOT NULL,
    source_type     VARCHAR(20) NOT NULL,
    source_url      TEXT,
    language        VARCHAR(5) DEFAULT 'id',
    topic_tags      TEXT[],
    persona_tags    TEXT[],
    total_chunks    INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT TRUE,
    ingested_by     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kb_chunks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id     UUID NOT NULL REFERENCES kb_documents(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    content_hash    VARCHAR(64) UNIQUE NOT NULL,
    chunk_index     INTEGER NOT NULL,
    embedding       vector(768),
    token_count     INTEGER,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kb_chunks_embedding
    ON kb_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_debate_arguments_session
    ON debate_arguments(session_id, turn_number);

CREATE INDEX idx_judge_scores_argument
    ON judge_scores(argument_id);

CREATE INDEX idx_audience_reactions_argument
    ON audience_reactions(argument_id);

CREATE INDEX idx_kb_documents_language
    ON kb_documents(language);
```

---

## 15. API Design

### 15.1 Konvensi API

- **Base URL**: `https://api.debateai.id/v1`
- **Auth**: `Authorization: Bearer <JWT_TOKEN>`
- **Format**: JSON
- **Error format**:
  ```json
  {
    "success": false,
    "error": {
      "code": "DEBATE_NOT_FOUND",
      "message": "Sesi debat tidak ditemukan"
    }
  }
  ```

### 15.2 Endpoint Utama

**Auth:**
```
POST   /auth/register
POST   /auth/login
POST   /auth/google
POST   /auth/apple
POST   /auth/refresh
POST   /auth/logout
DELETE /auth/account
```

**Users:**
```
GET    /users/me
PATCH  /users/me
GET    /users/me/sessions
GET    /users/me/stats
GET    /users/me/export
```

**Personas:**
```
GET    /personas
GET    /personas/:id
POST   /personas
PATCH  /personas/:id
DELETE /personas/:id
```

**Debate Sessions:**
```
POST   /sessions
GET    /sessions/:id
PATCH  /sessions/:id/start
PATCH  /sessions/:id/pause
PATCH  /sessions/:id/resume
PATCH  /sessions/:id/end
POST   /sessions/join
GET    /sessions/:id/results
GET    /sessions/:id/transcript
```

**Debate Motions:**
```
GET    /motions?category=&language=&format=
```

**Session Templates:**
```
GET    /session-templates
POST   /session-templates
DELETE /session-templates/:id
```

**Arguments:**
```
POST   /sessions/:id/arguments
GET    /sessions/:id/arguments
GET    /sessions/:id/arguments/:argId
```

**Knowledge Base:**
```
GET    /knowledge
POST   /knowledge/ingest/youtube
POST   /knowledge/ingest/pdf
GET    /knowledge/documents
DELETE /knowledge/documents/:id
```

### 15.3 WebSocket Events (Socket.IO)

**Client → Server:**
```
debate:join          { sessionId, userId }
debate:argument      { sessionId, content, contentType }
debate:forfeit       { sessionId }
debate:pause         { sessionId }
debate:resume        { sessionId }
```

**Server → Client:**
```
debate:joined             { session, participants }
debate:turn_change        { currentParticipantId, turnNumber, timeLeft }
debate:argument_received  { argument }
debate:ai_thinking        { }
debate:ai_response        { argument }
debate:judge_score        { judgeType, score, feedback }
debate:audience           { reactionType, intensity, comments }
debate:round_end          { roundNumber, scores }
debate:session_end        { results }
debate:error              { code, message }
```

---

## 16. User Flow

### 16.1 Flow Utama: Buat & Jalankan Sesi Debat vs AI

```
[SPLASH + HOME SCREEN]
    │
    ├── "Mulai Debat Baru" →
    │
    ▼
[STEP 1: PILIH TOPIK]
    ├── Pilih kategori (Politik / Hukum / Ekonomi / Sosial / Bebas)
    ├── Atau ketik topik kustom
    └── → Lanjut →

[STEP 2: FORMAT & ATURAN]
    ├── Format: Oxford / BP / KDMI / NUDC / Bebas / Wawancara
    ├── Jumlah ronde: 3 / 5 / 7
    ├── Waktu per giliran: 1–15 menit
    └── → Lanjut →

[STEP 3: PERSONA DIRI]
    ├── Pilih dari library template
    ├── Atau buat persona baru
    ├── Pilih stance: Pro / Kontra
    └── → Lanjut →

[STEP 4: PILIH LAWAN]
    ├── "Lawan AI":
    │   ├── Pilih persona AI lawan
    │   ├── Pilih level: Pemula / Menengah / Ahli
    │   └── Pilih AI provider: Gemini / GPT-4o / Claude
    └── "Lawan Pengguna" → Buat kode room → Tunggu

[STEP 5: KONFIGURASI]
    ├── Toggle: Aktifkan AI Juri (default: ON)
    ├── Toggle: Aktifkan AI Penonton (default: ON)
    └── → "Mulai Debat!" →

[ARENA DEBAT]
    ├── Opening: Countdown 3-2-1
    │
    ├── [Giliran User]
    │   ├── Input teks ATAU mic untuk suara
    │   ├── Timer countdown berjalan
    │   └── Tekan "Kirim Argumen"
    │
    ├── [Proses AI - paralel]
    │   ├── RAG: Retrieve top-5 chunk KB
    │   ├── AI Lawan: Generate respons
    │   ├── AI Juri x3: Score argumen user
    │   └── AI Penonton: Generate reaksi
    │
    ├── [Tampilkan Respons]
    │   ├── Teks AI Lawan muncul (streaming)
    │   ├── TTS: AI Lawan berbicara (opsional)
    │   ├── Skor juri slide masuk
    │   ├── Reaksi penonton + komentar gelembung
    │   └── Giliran berganti ke AI Lawan
    │
    └── [Ronde Selesai → Ronde Berikutnya → Selesai]

[HALAMAN HASIL]
    ├── Pengumuman pemenang + efek visual
    ├── Scorecard total (chart radar per aspek)
    ├── Breakdown per ronde
    ├── Highlight: argumen terkuat & terlemah
    ├── Feedback narasi dari setiap juri
    ├── Saran untuk sesi berikutnya
    └── Tombol: "Debat Lagi" / "Lihat Transkip" / "Bagikan"
```

### 16.2 Flow Onboarding Pengguna Baru

```
Buka App (Pertama kali)
    │
    ▼
Splash + Intro Slide (3 slide)
    │
    ▼
Daftar / Masuk
    ├── Email + Password
    └── Google / Apple OAuth
    │
    ▼
Tutorial Interaktif (skippable)
    ├── Guided tour singkat
    └── Debat perdana dengan AI level Pemula
    │
    ▼
Home Screen
```

### 16.3 Flow Admin: Ingest Knowledge Base

```
Admin Login → Admin Panel → Knowledge Base
    │
    ▼
"Tambah Sumber Baru"
    ├── YouTube URL → Preview → Tag → Ingest (background job)
    ├── PDF Upload → Metadata → Tag → Ingest (background job)
    └── Web URL → Preview → Tag → Ingest (background job)
    │
    ▼
Status tracking: Pending → Processing → Done / Error
    │
    ▼
Dokumen muncul di daftar KB
Admin: Review chunks, deactivate, tag ulang, hapus
```

---

## 17. Security & Compliance

### 17.1 Autentikasi & Otorisasi

| Mekanisme | Detail |
|---|---|
| Access Token | JWT, expiry 15 menit, RS256 signed |
| Refresh Token | Opaque token, expiry 30 hari, hash di database |
| Rotasi Token | Setiap refresh, token lama diinvalidasi |
| OAuth PKCE | Untuk Google dan Apple login di mobile |
| Role-based | user / admin / superadmin |

### 17.2 Enkripsi & Transmisi

- **In-transit**: TLS 1.3 wajib, HSTS
- **At-rest**: AES-256 untuk data sensitif
- **Password**: bcrypt cost factor 12
- **API Key AI**: Environment variable / secret manager (tidak pernah di client)

### 17.3 Moderasi Konten

```
User mengirim argumen
        │
        ▼
Pre-filter: Deteksi hate speech, SARA, eksplisit, doxxing
├── Terdeteksi → Blokir + warn user
└── Aman → Kirim ke AI
        │
        ▼
AI menghasilkan respons
        │
        ▼
Post-filter: Cek respons AI untuk konten berbahaya
├── Terdeteksi → Ganti dengan pesan fallback
└── Aman → Tampilkan ke user
```

**Sistem Laporan:**
- Pengguna dapat melaporkan konten/sesi
- Review manual admin dalam 24 jam
- 3 peringatan → suspend | Pelanggaran berat → ban permanen

### 17.4 Compliance UU PDP Indonesia

| Kewajiban | Implementasi |
|---|---|
| Persetujuan data | Consent screen saat registrasi |
| Hak hapus data | Tombol "Hapus Akun", data dihapus dalam 30 hari |
| Hak akses data | Export data dalam format JSON |
| Notifikasi kebocoran | Prosedur respons insiden, notifikasi dalam 14 hari |
| Retensi data | Konten debat dihapus setelah 1 tahun (kecuali opt-in) |

### 17.5 Keamanan Infrastruktur

| Area | Tindakan |
|---|---|
| Rate limiting | 100 req/menit per IP endpoint publik |
| DDoS protection | Cloudflare WAF + Rate Limit |
| SQL Injection | Parameterized queries (Prisma + Pydantic) |
| Input validation | Sanitasi di layer API (Zod + Pydantic) |
| Dependency audit | GitHub Dependabot + Snyk |
| Penetration testing | Setiap 6 bulan |

---

## 18. Monetization Strategy

### 18.1 Model Bisnis: Freemium + B2B

```
┌──────────────────┬────────────────────┬──────────────────────┐
│  FREE (Gratis)   │  PRO (~Rp79rb/bln) │ INSTITUSI (Custom)   │
├──────────────────┼────────────────────┼──────────────────────┤
│ 5 sesi/hari      │ Sesi tak terbatas  │ Classroom mode       │
│ AI level Pemula  │ Semua level AI     │ Dashboard instruktur  │
│ 1 AI Juri        │ 3 AI Juri penuh    │ Laporan per mahasiswa │
│ Teks only        │ Voice + TTS        │ SLA + support        │
│ 3 template       │ Semua persona      │ Persona branded       │
│ KB terbatas      │ KB penuh           │ KB kustom institusi  │
│ 30 hari riwayat  │ Riwayat penuh      │ Unlimited riwayat    │
│                  │ Export PDF         │ Multi-tenant         │
└──────────────────┴────────────────────┴──────────────────────┘
```

### 18.2 Tabel Harga

| Paket | Harga | Target Segmen |
|---|---|---|
| Free | Gratis | Coba-coba, pelajar SMA |
| PRO Monthly | Rp 79.000/bulan | Mahasiswa, profesional |
| PRO Yearly | Rp 699.000/tahun (hemat 26%) | Pengguna setia |
| Institusi Small | Rp 5 juta/tahun (≤50 users) | SMA/SMK |
| Institusi Medium | Rp 15 juta/tahun (≤200 users) | Perguruan tinggi |
| Institusi Enterprise | Rp 25–50 juta/tahun (unlimited) | Universitas besar |

### 18.3 Revenue Streams

| Stream | Model | Target Kontribusi (Tahun 2) |
|---|---|---|
| Langganan PRO individual | Bulanan/tahunan | 60% |
| Lisensi institusi (B2B) | Tahunan per institusi | 25% |
| API access developer | Pay-per-call | 10% |
| Konten premium (persona pack) | One-time purchase | 5% |

### 18.4 Unit Economics (Proyeksi)

| Metrik | Nilai |
|---|---|
| Customer Acquisition Cost (CAC) | Rp 25.000 (digital), Rp 80.000 (B2B) |
| Lifetime Value PRO User (LTV) | Rp 600.000 (rata-rata 7,5 bulan) |
| LTV:CAC Ratio (target) | > 3x |
| Gross Margin | ~70% (setelah biaya API AI) |
| Biaya API AI per sesi (estimasi) | Rp 500–1.500 (tergantung panjang & model) |

---

## 19. Go-to-Market Plan

### 19.1 Fase Pre-Launch (2–3 Bulan Sebelum)

| Aktivitas | Detail | Target |
|---|---|---|
| Closed Beta | Rekrut 200 beta tester dari komunitas debat | 200 pengguna |
| UKM Debat Partnership | Kerjasama 10 UKM Debat (UI, ITB, UGM, UNPAD, UNDIP) | 10 UKM |
| Landing Page + Waitlist | Email waitlist dengan incentive PRO gratis 3 bulan | 1.000 email |
| Konten Edukasi | Thread Twitter/X, artikel Medium tentang tips debat | 50K impresi |
| Influencer Edukasi | Micro-influencer: YouTuber tips belajar, debat mahasiswa | 5 influencer |

### 19.2 Fase Launch (Bulan 1)

| Aktivitas | Detail | Target |
|---|---|---|
| Product Hunt Launch | Target "Product of the Day" | Top 5 |
| Press Release | Kompas, CNBC Indonesia, Tirto, Tempo | 3 media coverage |
| Demo Video | 60 detik demonstrasi di YouTube + TikTok | 100K views |
| Promo Launch | 3 bulan PRO gratis untuk 500 pengguna pertama | 500 PRO users |
| App Store Optimization | Keyword: "debat", "latihan debat", "public speaking" | Top 10 kategori |

### 19.3 Fase Growth (Bulan 2–6)

| Aktivitas | Detail | Target |
|---|---|---|
| Referral Program | Ajak teman → 1 bulan PRO gratis (keduanya) | 30% new users |
| LPDP Community | Grup Telegram LPDP Hunters (50K+ member) | 2.000 pengguna |
| Content Marketing | 4 artikel/minggu: tips debat, analisis mosi, LPDP | 10K visit/bulan |
| TikTok Challenge | #DebatBarengAI — rekam debat vs AI | 500K views |
| Puspresnas Partnership | Integrasi tools persiapan NUDC/KDMI | 1 MoU |
| B2B Sales | Demo ke Dekan 50 universitas | 10 institusi aktif |

### 19.4 Fase Scale (Bulan 7–12)

| Aktivitas | Detail | Target |
|---|---|---|
| Corporate Training | Paket untuk tim sales, PR, eksekutif | 5 perusahaan |
| Classroom Mode Release | Rilis formal untuk dosen dan guru | 20 institusi |
| Regional Expansion | Marketing ke Malaysia, Singapura (Inggris) | 5% user luar negeri |
| Podcast Partnership | Sponsorship Total Politik, Podcast Narasi | 3 partnership |

### 19.5 Metrik Akuisisi per Channel (Target Tahun 1)

| Channel | % Akuisisi | CAC |
|---|---|---|
| Komunitas debat & UKM | 30% | Rp 10.000 |
| Organic SEO & konten | 25% | Rp 5.000 |
| Social media (TikTok/IG) | 20% | Rp 20.000 |
| Referral program | 15% | Rp 12.000 |
| Paid ads (Google/Meta) | 10% | Rp 45.000 |

---

## 20. Success Metrics & KPI

### 20.1 North Star Metric

> **"Jumlah argumen berkualitas yang disampaikan pengguna per minggu"**
> *(Proxy terbaik untuk engagement nyata dan nilai yang didapat pengguna)*

### 20.2 Metrics Produk (6 Bulan Pertama)

| Kategori | Metrik | Target M1 | Target M3 | Target M6 |
|---|---|---|---|---|
| **Akuisisi** | Pengguna terdaftar | 1.000 | 5.000 | 10.000 |
| **Aktivasi** | % user selesaikan sesi pertama | > 60% | > 65% | > 70% |
| **Engagement** | DAU/MAU ratio | > 20% | > 25% | > 30% |
| **Engagement** | Sesi/pengguna aktif/minggu | > 2 | > 3 | > 4 |
| **Engagement** | Rata-rata durasi sesi | > 8 menit | > 10 menit | > 12 menit |
| **Retensi** | Retention D7 | > 35% | > 40% | > 45% |
| **Retensi** | Retention D30 | > 15% | > 20% | > 25% |
| **Monetisasi** | Konversi Free → PRO | > 3% | > 5% | > 7% |
| **Kualitas** | Rating App Store | > 4,2 | > 4,3 | > 4,5 |
| **Kualitas** | NPS | > 30 | > 40 | > 50 |

### 20.3 Metrics Bisnis (Tahun 1)

| Metrik | Target |
|---|---|
| MAU (Monthly Active Users) | 25.000 |
| Pengguna PRO berbayar | 1.500 |
| Institusi aktif (B2B) | 10 |
| MRR (Monthly Recurring Revenue) | Rp 150 juta |
| ARR (Annual Recurring Revenue) | Rp 1,8 miliar |
| Gross Margin | > 65% |

### 20.4 Metrics Teknis

| Metrik | Target |
|---|---|
| Uptime | > 99,5% |
| Waktu respons AI (p95) | < 5 detik |
| Waktu respons API (p95) | < 500ms |
| Crash rate | < 0,1% |
| KB coverage saat launch | > 50.000 chunk |

### 20.5 Metrics Kualitas AI

| Metrik | Cara Mengukur | Target |
|---|---|---|
| Kepuasan feedback juri | Rating per sesi (1–5 bintang) | > 4,0 |
| Relevansi KB yang digunakan | % pengguna klik "referensi berguna" | > 40% |
| Konsistensi persona AI | Survey pengguna bulanan | > 80% puas |
| Deteksi fallacy accuracy | Uji coba manual | > 75% |

---

## 21. Risk & Mitigation

| # | Risiko | Prob. | Dampak | Mitigasi |
|---|---|:---:|:---:|---|
| R1 | **Biaya API AI terlalu tinggi** — token besar untuk Juri x3 + Lawan + Penonton | 🔴 | 🔴 | Caching respons AI; model lebih kecil untuk penonton; batas panjang argumen; monitoring cost per sesi; free tier dibatasi |
| R2 | **Kualitas respons AI tidak memuaskan** — argumen generik, persona tidak konsisten | 🟡 | 🔴 | Investasi prompt engineering; fine-tune system prompt per format; A/B test antar provider; feedback loop dari pengguna |
| R3 | **Moderasi konten gagal** — hate speech, SARA lolos | 🟡 | 🔴 | Content filter berlapis (pre & post); laporan pengguna; review manual; blacklist kata; belajar dari Debate.org (tutup 2022) |
| R4 | **Latensi tinggi** di jaringan Indonesia | 🔴 | 🟡 | Server di Jakarta (GCP asia-southeast2); streaming response; progressive loading; offline mode untuk data statis |
| R5 | **Lock-in AI provider** — perubahan harga/kebijakan mendadak | 🟡 | 🔴 | Multi-provider dari awal; abstraksi layer; kontrak volume; fallback otomatis |
| R6 | **Kompetisi dari pemain besar** | 🟢 | 🔴 | Fokus niche Indonesia + format lokal; KB lokal sebagai moat; komunitas debat sebagai channel distribusi |
| R7 | **Rendahnya literasi cara berdebat** | 🟡 | 🟡 | Onboarding tutorial interaktif; mode "guided debate"; tooltip in-app; format "Bebas" tanpa aturan ketat |
| R8 | **Ketidakpatuhan UU PDP** | 🟢 | 🔴 | Konsultasi hukum sebelum launch; privacy policy jelas dalam bahasa Indonesia; data deletion dalam 30 hari |
| R9 | **Pengguna tidak mau bayar** | 🟡 | 🟡 | Free tier cukup bernilai; PRO harus berasa "worth it"; harga di bawah Rp 100rb/bulan |
| R10 | **Skalabilitas WebSocket** | 🟢 | 🟡 | Horizontal scaling Socket.IO + Redis adapter; load testing sebelum launch; auto-scaling |

---

## 22. Product Roadmap

### 22.1 Timeline Visual

```
 Q4 2026         Q1 2027         Q2 2027         Q3 2027+
 ──────────────────────────────────────────────────────────
 FASE 1: MVP     FASE 2: Core    FASE 3: Scale   FASE 4: Adv
 ──────────────────────────────────────────────────────────
 ▪ Auth & profil  ▪ KB pipeline   ▪ Realtime 1v1  ▪ Classroom
 ▪ Lobby debat   ▪ RAG aktif     ▪ Matchmaking   ▪ Leaderboard
 ▪ AI Lawan teks ▪ AI Penonton   ▪ Multi-AI sw.  ▪ Tournament
 ▪ 1 AI Juri     ▪ 3 AI Juri     ▪ Voice TTS/STT ▪ API extern
 ▪ Hasil/skor    ▪ Persona kust. ▪ Langganan PRO ▪ White-label
 ▪ Admin panel   ▪ Format formal ▪ Laporan PDF   ▪ Ekspansi SEA
 ▪ Cross-platform▪ Gamifikasi    ▪ Analytics adv ▪ Puspresnas MoU
```

### 22.2 Fase 1 — MVP (Q4 2026, 8 Minggu)

**Goal**: Pengguna bisa membuat sesi debat, berdebat teks dengan AI, dan menerima feedback juri.

- [ ] Flutter app: Android, iOS, Web
- [ ] Autentikasi: email + Google OAuth
- [ ] Lobby: pilih topik, format (Oxford/Bebas/Wawancara), ronde
- [ ] Persona: 10 template bawaan + buat kustom sederhana
- [ ] Debat teks turn-by-turn dengan AI Lawan (Gemini)
- [ ] AI Juri: 1 juri (Logika), feedback per argumen
- [ ] Halaman hasil: scorecard, transkip, narasi feedback
- [ ] Admin panel: CRUD KB manual, monitoring sesi
- [ ] Moderasi: content filter dasar

**Success Criteria**: 100 beta user, ≥ 1 sesi selesai/user, 0 crash fatal.

---

### 22.3 Fase 2 — Core Features (Q1 2027, 8 Minggu)

**Goal**: Knowledge base RAG aktif, pengalaman imersif, format formal.

- [ ] Knowledge base pipeline: YouTube + PDF → pgvector
- [ ] RAG aktif: AI Lawan & Juri menggunakan referensi nyata
- [ ] AI Penonton: reaksi dan komentar per argumen
- [ ] 3 AI Juri independen (Logika, Retorika, Dampak)
- [ ] Roleplay persona kustom lengkap
- [ ] Format KDMI, NUDC, British Parliamentary
- [ ] Offline mode (user vs AI, tidak perlu user lain)
- [ ] Gamifikasi: poin per sesi, level pengguna
- [ ] 20 template persona (10 ID, 10 EN)

**Success Criteria**: 2.000 pengguna, skor kepuasan feedback ≥ 3,8/5.

---

### 22.4 Fase 3 — Scale & Monetisasi (Q2 2027, 8 Minggu)

**Goal**: Siap pengguna massal dan pendapatan aktif.

- [ ] Real-time online debat via WebSocket (1v1 user)
- [ ] Matchmaking otomatis
- [ ] Voice input (STT) + AI berbicara (TTS)
- [ ] Multi-AI provider switcher
- [ ] Langganan PRO aktif (Midtrans payment gateway)
- [ ] Laporan PDF sesi debat
- [ ] Push notification & re-engagement
- [ ] Statistik progres pengguna (grafik per minggu)

**Success Criteria**: 10.000 pengguna, 500 PRO, MRR Rp 40 juta.

---

### 22.5 Fase 4 — Advanced (Q3 2027+)

**Goal**: Ekspansi ke institusi dan fitur sosial lanjutan.

- [ ] Classroom mode untuk dosen/instruktur
- [ ] Leaderboard & ELO rating
- [ ] White-label untuk kampus dan perusahaan
- [ ] API untuk developer eksternal
- [ ] Community knowledge base contribution
- [ ] Ekspansi bahasa: Melayu untuk Malaysia
- [ ] Integrasi resmi dengan Puspresnas (NUDC/KDMI)

---

## 23. Glosarium

| Istilah | Definisi |
|---|---|
| **RAG** | Retrieval-Augmented Generation: teknik AI mengambil dokumen relevan dari knowledge base sebelum menghasilkan respons |
| **BP / British Parliamentary** | Format debat 4 tim (2 orang/tim), populer di kompetisi internasional (WUDC) |
| **KDMI** | Kompetisi Debat Mahasiswa Indonesia (Bahasa Indonesia), diselenggarakan Puspresnas |
| **NUDC** | National University Debating Championship (Bahasa Inggris) |
| **NSDC** | National Schools Debating Championship (SMA, Bahasa Inggris) |
| **LDBI** | Lomba Debat Bahasa Indonesia (SMA) |
| **LPDP** | Lembaga Pengelola Dana Pendidikan — beasiswa S2/S3 pemerintah RI |
| **NMCC** | National Moot Court Competition — simulasi pengadilan mahasiswa hukum |
| **Mosi** | Pernyataan/resolusi yang diperdebatkan dalam debat formal |
| **POI** | Point of Information: interupsi singkat saat lawan berbicara (format WSDC/BP) |
| **pgvector** | Ekstensi PostgreSQL untuk menyimpan dan mencari vector embeddings |
| **ELO** | Sistem rating kompetitif dinamis — menang vs lawan kuat = naik banyak |
| **MoSCoW** | Metode prioritasi fitur: Must / Should / Could / Won't Have |
| **LTV** | Lifetime Value — total pendapatan dari satu pelanggan |
| **CAC** | Customer Acquisition Cost — biaya rata-rata mendapatkan pelanggan baru |
| **MRR** | Monthly Recurring Revenue — pendapatan berulang bulanan |
| **ARR** | Annual Recurring Revenue — MRR × 12 |
| **NPS** | Net Promoter Score — ukuran loyalitas pelanggan (-100 hingga +100) |
| **RPO** | Recovery Point Objective — berapa lama data yang boleh hilang |
| **RTO** | Recovery Time Objective — berapa lama sistem boleh down |
| **DAU/MAU** | Daily Active Users / Monthly Active Users |
| **UU PDP** | Undang-Undang Perlindungan Data Pribadi (Indonesia, 2022) |
| **STT** | Speech-to-Text — konversi ucapan jadi teks |
| **TTS** | Text-to-Speech — konversi teks jadi ucapan |
| **Fallacy** | Kesalahan logika dalam argumen |
| **Chunk** | Potongan kecil teks dari dokumen untuk disimpan di knowledge base |
| **Embedding** | Representasi teks sebagai vektor numerik untuk pencarian semantik |
| **Cosine Similarity** | Ukuran kemiripan antara dua vektor (0–1) |

---

*Dokumen ini adalah living document. Setiap perubahan signifikan dicatat dengan versi dan tanggal baru.*

**Riwayat Versi:**

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Sep 2026 | Draft awal (MVP scope) |
| 2.0 | Sep 2026 | Final: Tambah Technical Architecture, DB Schema, API Design, User Flow, Security, GTM Plan |
