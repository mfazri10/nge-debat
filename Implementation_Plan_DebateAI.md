# 🛠️ Implementation Plan
## DebateAI — Rencana Implementasi Teknis

| | |
|---|---|
| **Versi** | 1.0 |
| **Tanggal** | September 2026 |
| **Referensi** | PRD DebateAI v2.0 |
| **Status** | Siap untuk Review |

---

## Daftar Isi

1. [Prinsip Pengembangan](#1-prinsip-pengembangan)
2. [Gambaran Fase & Timeline](#2-gambaran-fase--timeline)
3. [Setup Awal (Pre-Development)](#3-setup-awal-pre-development)
4. [Fase 1 — MVP](#4-fase-1--mvp-q4-2026-8-minggu)
5. [Fase 2 — Core Features](#5-fase-2--core-features-q1-2027-8-minggu)
6. [Fase 3 — Scale & Monetisasi](#6-fase-3--scale--monetisasi-q2-2027-8-minggu)
7. [Fase 4 — Advanced](#7-fase-4--advanced-q3-2027)
8. [Keputusan Teknis Kritis](#8-keputusan-teknis-kritis)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Definition of Done](#11-definition-of-done)
12. [Dependency Map](#12-dependency-map)

---

## 1. Prinsip Pengembangan

| Prinsip | Penerapan |
|---|---|
| **API-First** | Definisikan kontrak API sebelum membangun UI atau business logic |
| **Offline-Capable** | Setiap fitur dirancang untuk degradasi graceful tanpa koneksi pengguna lain |
| **AI-Abstracted** | Semua panggilan AI provider melewati satu abstraksi layer — mudah switch provider |
| **Test-as-you-go** | Unit test ditulis bersamaan dengan kode, bukan setelah |
| **Mobile-First** | Desain UI mulai dari layar kecil (360dp), lalu scale up ke tablet dan desktop |
| **Security-by-Default** | Auth, validasi, dan sanitasi input adalah bawaan, bukan tambahan belakangan |
| **Iterative Delivery** | Setiap 2 minggu ada sesuatu yang bisa di-demo dan di-test oleh end user |

---

## 2. Gambaran Fase & Timeline

```
Sep 2026       Okt 2026       Nov 2026       Des 2026
───────────────────────────────────────────────────────
[Pre-Dev]      [━━━━━━━━━ FASE 1: MVP ━━━━━━━━━━━━━━━]
 2 minggu       Sprint 1    Sprint 2    Sprint 3    Sprint 4

Jan 2027       Feb 2027       Mar 2027
────────────────────────────────────────
[━━━━━━━━━ FASE 2: CORE FEATURES ━━━━━━]
 Sprint 5    Sprint 6    Sprint 7    Sprint 8

Apr 2027       Mei 2027       Jun 2027
────────────────────────────────────────
[━━━━━━━━━ FASE 3: SCALE & MONETISASI ━]
 Sprint 9    Sprint 10   Sprint 11   Sprint 12

Jul 2027+
────────────────
[FASE 4: ADVANCED — ongoing]
```

**Sprint = 2 minggu.** Setiap akhir sprint: demo internal + retrospektif.

---

## 3. Setup Awal (Pre-Development)

> **Durasi**: 2 minggu | Sebelum Sprint 1.
> Semua item WAJIB selesai 100% sebelum sprint pertama. Tidak ada feature coding sampai setup selesai.

### 3.1 Infrastruktur Repositori

- [ ] Buat monorepo di GitHub:
  ```
  debate-ai/
  ├── apps/mobile/           (Flutter)
  ├── apps/api-gateway/      (Node.js + TypeScript)
  ├── apps/debate-engine/    (Python FastAPI)
  ├── apps/admin-panel/      (Next.js)
  ├── packages/shared-types/ (TypeScript interfaces)
  ├── infra/
  └── scripts/
  ```
- [ ] Branch protection: `main` merge hanya via PR + 1 review
- [ ] Branch strategy: `main` → `develop` → `feature/*`, `fix/*`, `hotfix/*`
- [ ] `.gitignore` untuk Node, Python, Dart, Docker
- [ ] GitHub Actions CI: lint + test di setiap PR ke `develop`

### 3.2 Environment & Secrets

- [ ] Daftarkan API key: Google Gemini, OpenAI, Anthropic
- [ ] Setup GitHub Secrets untuk CI/CD
- [ ] Buat `.env.example` per app (tanpa value)
- [ ] Definisikan 3 environment: `development`, `staging`, `production`
- [ ] Daftar cloud provider: GCP `asia-southeast2` (Jakarta)

### 3.3 Setup Database Lokal (Docker)

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: debateai_dev
      POSTGRES_USER: debateai
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
```
- [ ] Verifikasi pgvector: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Buat database `debateai_dev` dan `debateai_test`

### 3.4 Setup Flutter

- [ ] Install Flutter 3.x stable, verifikasi `flutter doctor`
- [ ] Dependency utama: `flutter_riverpod`, `go_router`, `dio`, `socket_io_client`, `speech_to_text`, `flutter_tts`, `hive_flutter`, `fl_chart`, `flutter_animate`, `connectivity_plus`
- [ ] Struktur folder: `features/`, `core/`, `shared/`
- [ ] Flavor: `dev`, `staging`, `production`
- [ ] Linting: `flutter_lints` + `analysis_options.yaml`
- [ ] Verifikasi build di Android, iOS Simulator, dan Web

### 3.5 Setup API Gateway (Node.js)

- [ ] TypeScript + ESLint + Prettier
- [ ] Dependency: `express`, `prisma`, `socket.io`, `jsonwebtoken`, `bcrypt`, `zod`, `ioredis`
- [ ] Dependency tambahan: `@opentelemetry/api`, `@opentelemetry/sdk-node`, `@opentelemetry/exporter-jaeger`
- [ ] Prisma init + migrasi schema awal (semua tabel PRD §14)
- [ ] Struktur: `routes/`, `middleware/`, `services/`, `websocket/`
- [ ] Health check: `GET /health → { status: "ok" }`

### 3.6 Setup Debate Engine (Python)

- [ ] Virtual environment, install: `fastapi uvicorn langchain langgraph langchain-google-genai langchain-openai langchain-anthropic sqlalchemy asyncpg pgvector celery redis youtube-transcript-api pymupdf pydantic-settings`
- [ ] Dependency tambahan: `opentelemetry-api`, `opentelemetry-sdk`, `opentelemetry-exporter-jaeger`
- [ ] Struktur: `agents/`, `rag/`, `pipelines/`, `scoring/`, `routers/`, `core/`
- [ ] Health check: `GET /health`
- [ ] Linting: `ruff` + `mypy`

### 3.7 Setup Admin Panel (Next.js)

- [ ] `npx create-next-app@latest admin --typescript --tailwind --app`
- [ ] Install: `@tanstack/react-table`, `recharts`, `shadcn/ui`, `axios`
- [ ] Autentikasi admin (JWT, role `admin`)

### 3.8 Design System

- [ ] Color palette: Primary `#1A56FF`, Secondary `#FF6B35`, Success `#22C55E`, Danger `#EF4444`, BG Dark `#0F172A`
- [ ] Font: Inter (Latin), Noto Sans (ID)
- [ ] Komponen Flutter: `AppButton`, `AppTextField`, `AppCard`, `AppScaffold`, `AppDialog`
- [ ] Wireframe 5 layar utama sebelum coding UI

### 3.9 Shared TypeScript Types

```typescript
interface DebateSession { id, topic, format, status, language, totalRounds, ... }
interface DebateArgument { id, sessionId, content, contentType, roundNumber, ... }
interface JudgeScore { judgeType, totalScore, breakdown, summary, highlights... }
interface AudienceReaction { reactionType, intensity, comments }
interface Persona { id, name, description, speakingStyle, stanceDefault, ... }
interface KbDocument { id, title, sourceType, topicTags, totalChunks, ... }
interface User { id, email, name, preferredLanguage, debateLevel, eloRating, ... }
```

---

## 4. Fase 1 — MVP (Q4 2026, 8 Minggu)

> **Goal**: Pengguna bisa membuat sesi debat teks, berdebat dengan AI (Gemini), dan menerima scorecard dari 1 AI Juri Logika.

### Sprint 1 (Minggu 1–2): Foundation Backend

#### 4.1.1 Auth System (API Gateway)

- [ ] `POST /auth/register` — validasi Zod, bcrypt hash, JWT + refresh token
- [ ] `POST /auth/login` — verifikasi bcrypt, return tokens
- [ ] `POST /auth/google` — verifikasi Google ID token, upsert user
- [ ] `POST /auth/refresh` — rotasi refresh token
- [ ] `POST /auth/logout` — hapus refresh token dari DB
- [ ] `DELETE /auth/account` — soft delete (set `deleted_at`)
- [ ] Middleware `verifyJWT` — extract & validasi Bearer token
- [ ] Rate limit auth endpoint: 10 req/menit per IP

#### 4.1.2 User Profile (API Gateway)

- [ ] `GET /users/me` — return profil user
- [ ] `PATCH /users/me` — update nama, bio, bahasa, avatar

#### 4.1.3 Database Migration

- [ ] Jalankan Prisma migration: semua tabel Fase 1
- [ ] Seed 10 template persona (5 ID, 5 EN):
  - ID: Presiden RI, Menteri Keuangan, Hakim MK, Aktivis Lingkungan, CEO Startup
  - EN: US President, Harvard Professor, UN Diplomat, Tech CEO, Human Rights Lawyer
- [ ] Seed 20 mosi debat populer (10 ID dari KDMI/NUDC, 10 EN dari WUDC/IDEA)
- [ ] Seed 10 badge dasar:
  - `first_debate`: "Debater Pertama" — Selesaikan debat pertama
  - `first_win`: "Kemenangan Perdana" — Menangkan debat pertama
  - `streak_3`: "Hat-trick" — Menang 3x berturut-turut
  - `streak_5`: "Unstoppable" — Menang 5x berturut-turut
  - `points_100`: "Debater Resmi" — Kumpulkan 100 poin
  - `points_500`: "Debater Ahli" — Kumpulkan 500 poin
  - `points_1500`: "Debate Master" — Kumpulkan 1500 poin
  - `perfect_score`: "Sempurna" — Raih skor 95+ dari semua juri
  - `all_formats`: "Polyglot" — Coba semua format debat
  - `kb_contributor`: "Kontributor" — Submit KB yang disetujui

#### 4.1.4 AI Foundation (Debate Engine)

- [ ] `core/ai_factory.py` — abstraksi multi-provider (Gemini / OpenAI / Anthropic)
- [ ] `agents/opponent.py` — AI Lawan dengan injeksi persona + format + history
- [ ] `agents/judge.py` — AI Juri Logika dengan structured output (Pydantic)
- [ ] `POST /debate/generate` — jalankan AI Lawan + Juri secara `asyncio.gather`

---

### Sprint 2 (Minggu 3–4): Core Debate Flow Backend

#### 4.2.1 Session Management

- [ ] `POST /sessions` — buat sesi + participants (user + AI)
- [ ] `GET /sessions/:id` — detail sesi
- [ ] `PATCH /sessions/:id/start` — mulai sesi (set `started_at`, status `ongoing`)
- [ ] `PATCH /sessions/:id/end` — akhiri sesi, trigger kalkulasi hasil
- [ ] `POST /sessions/join` — bergabung via room_code

#### 4.2.2 Argument Flow

- [ ] `POST /sessions/:id/arguments`:
  - Validasi giliran (turn sequence)
  - Insert argumen user
  - Call Debate Engine → AI Lawan respons + skor juri
  - Insert AI argument + judge_score
  - Return: `{ aiArgument, judgeScore }`
- [ ] `GET /sessions/:id/arguments` — list semua argumen
- [ ] `GET /sessions/:id/transcript` — transkip terformat

#### 4.2.3 Scoring & Results

- [ ] Kalkulasi `session_results` (dipanggil saat sesi berakhir):
  - Weighted total score per participant per ronde
  - Tentukan pemenang (draw jika selisih < 5 poin)
  - AI summary 2–3 paragraf narasi
  - Identifikasi argumen terkuat & terlemah
- [ ] `GET /sessions/:id/results`

#### 4.2.4 Persona CRUD

- [ ] `GET /personas` — template + milik sendiri
- [ ] `GET /personas/:id`, `POST /personas`, `PATCH /personas/:id`, `DELETE /personas/:id`

---

### Sprint 3 (Minggu 5–6): Flutter Core UI

#### 4.3.1 Navigation & Providers

- [ ] GoRouter: semua routes (`/`, `/onboarding`, `/auth/*`, `/home`, `/lobby/new`, `/debate/:id`, `/results/:id`, `/profile`)
- [ ] Riverpod: `authProvider`, `sessionProvider`, `debateProvider`, `personaProvider`

#### 4.3.2 Auth Screens

- [ ] SplashScreen → cek token → redirect
- [ ] OnboardingScreen (3 slide)
- [ ] LoginScreen (email/password + Google OAuth)
- [ ] RegisterScreen
- [ ] ProfileScreen (avatar, statistik, riwayat, logout)

#### 4.3.3 Lobby — 5-Step Wizard

- [ ] **Step 1 TopicScreen**: grid kategori + text field kustom + chip mosi saran
- [ ] **Step 2 FormatScreen**: cards format + segmented ronde + slider waktu
- [ ] **Step 3 PersonaScreen**: scroll card template + bottom sheet buat persona baru + chip stance
- [ ] **Step 4 OpponentScreen**: toggle AI/User · AI: pilih persona + level + provider · Online: kode room
- [ ] **Step 5 ConfigScreen**: toggle juri + toggle penonton + ringkasan + tombol "Mulai Debat!"

#### 4.3.4 Debate Arena Screen

Layout (dari atas ke bawah):
```
[AppBar: Ronde X/Y · format · forfeit]
[TurnIndicator: "Giliran Kamu" 🟢 / "AI sedang berpikir..." ⏳]
[TimerWidget: countdown, merah < 30 dtk]
[ArgumentList: chat-style gelembung, kiri AI / kanan User] ← expand
[JudgeScoreCard: slide-up animation] ← muncul setelah argumen user
[AudienceBar: emoji animasi + gelembung komentar]
[InputArea: TextField + MicButton + SendButton]
```
- [ ] TimerWidget: AnimatedContainer + warna berubah merah + haptic < 10 dtk
- [ ] ArgumentBubble: avatar persona + nama + timestamp
- [ ] JudgeScoreCard: skor total + 5 mini bar + 2 highlight + tombol "Detail"
- [ ] InputArea: disable saat giliran AI, counter karakter, mic button

#### 4.3.5 Results Screen

- [ ] WinnerBanner (konfeti animasi)
- [ ] ScoreRadarChart (fl_chart, 5 aspek, user vs AI)
- [ ] RoundBreakdown (ExpansionTile per ronde)
- [ ] ArgumentHighlight (card hijau terkuat + merah terlemah)
- [ ] JudgeFeedbackTabs (1 tab per juri)
- [ ] TranscriptView (ListView + search)
- [ ] ActionRow (Debat Lagi · Transkip · Bagikan)

---

### Sprint 4 (Minggu 7–8): Integrasi, Admin & Polish

#### 4.4.1 End-to-End Integration

- [ ] Test flow: register → login → buat sesi → 3 ronde → lihat hasil
- [ ] Test semua error case (token expired, AI timeout, koneksi terputus)
- [ ] Test concurrent: 5 sesi paralel

#### 4.4.1b Data Export (UU PDP Compliance)

- [ ] `GET /users/me/export` — export seluruh data pengguna dalam format JSON:
  - Profil (nama, email, bio, bahasa, level)
  - Seluruh sesi debat (topik, format, skor)
  - Seluruh argumen yang pernah dikirim
  - Seluruh skor juri yang diterima
  - Statistik akumulatif
- [ ] Response: JSON file download (Content-Disposition: attachment)
- [ ] Rate limit: 1 request per jam per user
- [ ] Hanya data milik user sendiri (tidak termasuk argumen AI atau user lain)

#### 4.4.2 Admin Panel MVP

- [ ] Login admin (role `admin`)
- [ ] Dashboard: 4 stat card + line chart sesi 7 hari
- [ ] Tabel Users: email, nama, sesi, joined, aksi ban/view
- [ ] Tabel Sessions: topic, format, status, durasi
- [ ] Halaman KB: tabel kosong (aktif Fase 2)

#### 4.4.3 Content Moderation Dasar

- [ ] Pre-filter argumen: blacklist SARA, kekerasan, eksplisit → HTTP 422
- [ ] Post-filter respons AI: fallback message jika konten berbahaya
- [ ] Log semua moderation trigger ke `moderation_logs`

#### 4.4.3b Free Tier Quota Enforcement

- [ ] Middleware `checkQuota`: cek `user_daily_usage` sebelum `POST /sessions`
  - Free user: max 5 sesi/hari
  - PRO user: unlimited
- [ ] Upsert `user_daily_usage` saat sesi dibuat (`sessionCount++`)
- [ ] Reset otomatis: record baru per hari (unique constraint `[userId, usageDate]`)
- [ ] Response HTTP 429 jika kuota habis: `{ error: "DAILY_QUOTA_EXCEEDED", message: "Kuota harian Anda telah habis. Upgrade ke PRO untuk sesi tak terbatas." }`
- [ ] Flutter: tampilkan sisa kuota di Home Screen ("3/5 sesi tersisa hari ini")

#### 4.4.4 UX Polish

- [ ] Global error handler → SnackBar user-friendly (bukan "Error 500")
- [ ] Skeleton loading semua halaman yang fetch data
- [ ] Empty states dengan ilustrasi
- [ ] Haptic feedback saat giliran berganti + skor muncul
- [ ] i18n: semua teks tersedia ID dan EN via `AppLocalizations`

#### 4.4.5 ✅ Definition of Done — Fase 1

- [ ] Semua fitur M-priority Fase 1 dari PRD §8 berjalan tanpa bug
- [ ] Zero crash pada 100 sesi test berurutan
- [ ] AI response time < 8 detik pada ≥ 95% kasus
- [ ] Flutter build APK Android dan Web berhasil tanpa error
- [ ] 10 beta user menyelesaikan ≥ 1 sesi penuh tanpa bantuan developer

---

## 5. Fase 2 — Core Features (Q1 2027, 8 Minggu)

> **Goal**: RAG aktif, 3 AI Juri, AI Penonton, persona lengkap, format formal.

### Sprint 5 (Minggu 9–10): Knowledge Base Pipeline

#### 5.1.1 pgvector & Embedding Service

- [ ] Aktifkan pgvector di production, migration tabel `kb_documents` + `kb_chunks`
- [ ] Buat IVFFLAT index: `CREATE INDEX ... USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`
- [ ] `rag/embeddings.py` — abstraksi Gemini embedding (default) / OpenAI embedding (opsional)

#### 5.1.2 YouTube Pipeline

- [ ] `pipelines/youtube.py`:
  - Extract transcript via `youtube-transcript-api`
  - Chunking: `RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)`
  - Dedup via SHA-256 hash
  - Generate embedding → simpan ke pgvector
- [ ] Celery task background: status `pending → processing → done/error`
- [ ] Endpoint admin: `POST /knowledge/ingest/youtube`
- [ ] Admin UI: form URL + tag + progress bar polling

#### 5.1.3 PDF Pipeline

- [ ] `pipelines/pdf.py` dengan PyMuPDF: ekstrak teks → chunk → embed → simpan
- [ ] Endpoint: `POST /knowledge/ingest/pdf` (multipart, max 50MB)

#### 5.1.4 RAG Retriever

- [ ] `rag/retriever.py`: query embedding → cosine similarity search pgvector → filter threshold ≥ 0.75 → return top-5
- [ ] Inject KB chunks ke system prompt AI Lawan + AI Juri
- [ ] Update response arguments: sertakan `kb_refs` yang digunakan

#### 5.1.5 Admin KB UI

- [ ] Tabel dokumen: judul, tipe, status, chunk count, bahasa, tanggal, aksi
- [ ] Activate/Deactivate per dokumen
- [ ] Drawer detail: preview chunk + metadata
- [ ] Search & filter (judul, bahasa, tipe, tag)

---

### Sprint 6 (Minggu 11–12): 3 AI Juri & AI Penonton

#### 5.2.1 3 AI Juri Paralel

- [ ] 3 fungsi juri terpisah: `judge_logika`, `judge_retorika`, `judge_dampak`
- [ ] Jalankan dengan `asyncio.gather` (paralel, bukan sekuensial)
- [ ] System prompt khusus per juri sesuai PRD §11.2
- [ ] Fallacy Detector: 7 tipe (ad_hominem, straw_man, false_dilemma, slippery_slope, appeal_to_authority, circular_reasoning, hasty_generalization)
- [ ] Flutter UI: TabBar 3 tab di JudgeScoreCard

#### 5.2.2 AI Penonton

- [ ] `agents/audience.py`: tentukan reaction_type dari avg_score, generate 5–8 komentar mix
- [ ] Flutter `AudienceReactionWidget`: emoji overlay melayang + komentar gelembung bergantian 0.5 dtk, fade-out 4 dtk

---

### Sprint 7 (Minggu 13–14): Format Formal & Roleplay Penuh

#### 5.3.1 Format Engine

- [ ] `core/format_rules.py`: konfigurasi 6 format (oxford, kdmi, bp, nudc, interview, free)
- [ ] Apply aturan ke: timer, instruksi AI, label UI
- [ ] Info card format di Step 2 Lobby

#### 5.3.2 Roleplay Persona

- [ ] Seed 20 template persona (10 ID, 10 EN) dengan `speaking_style` detail
- [ ] Persona consistency: `speaking_style` diinjeksi ke system prompt AI setiap giliran
- [ ] Flutter: `PersonaDetailSheet` + `CreatePersonaSheet`

#### 5.3.3 Resiliensi Offline

- [ ] Hive: simpan draft sesi + argumen yang sedang ditik secara lokal
- [ ] `connectivity_plus`: detect disconnect → banner → auto-reconnect exponential backoff
- [ ] Jika reconnect gagal > 60 dtk → tawarkan simpan & lanjutkan nanti

---

### Sprint 8 (Minggu 15–16): Gamifikasi & Polish Fase 2

#### 5.4.1 Sistem Poin & Level

- [ ] Poin: +10/sesi selesai, +5/argumen skor ≥ 70, +20/menang online, +50/sesi pertama
- [ ] Level: Pemula (0–99), Debater (100–499), Ahli (500–1.499), Master (1.500+)
- [ ] Flutter: progress bar level + animasi level up di ProfileScreen

#### 5.4.2 KB Search (User-facing)

- [ ] `GET /knowledge?q=&language=&topic=&page=`
- [ ] Flutter KnowledgeBaseScreen: search debounce 500ms + filter chips + card hasil

#### 5.4.3 ✅ Definition of Done — Fase 2

- [ ] RAG aktif dan terverifikasi via log di setiap sesi relevan
- [ ] 3 juri paralel selesai dalam < 10 detik total (diukur)
- [ ] Animasi penonton tanpa jank (≥ 55fps di Android mid-range)
- [ ] 20 persona tersedia, AI konsisten gaya bicara (manual review 10 sesi)
- [ ] Format KDMI dan Oxford berjalan dengan aturan benar

---

## 6. Fase 3 — Scale & Monetisasi (Q2 2027, 8 Minggu)

> **Goal**: Online debat 1v1, voice, multi-AI switcher, langganan PRO aktif.

### Sprint 9 (Minggu 17–18): Real-time Online Debat

#### 6.1.1 WebSocket (Socket.IO)

- [ ] Setup Socket.IO server + Redis Adapter untuk horizontal scaling
- [ ] Handler: `debate:join`, `debate:argument`, `debate:forfeit`, `disconnect`
- [ ] Emit semua events dari PRD §15.3

#### 6.1.2 Turn Management Online

- [ ] TurnManager via Redis: track giliran, enforce hanya participant aktif yang submit
- [ ] Auto-skip saat timer habis
- [ ] Disconnect < 60 dtk: pause + emit `debate:opponent_disconnected`
- [ ] Disconnect > 60 dtk: emit `debate:opponent_left` + tawarkan lanjut vs AI

#### 6.1.3 Matchmaking

- [ ] Redis queue per `{language}:{category}:{level}`
- [ ] `POST /sessions/matchmake`: join queue → match → atau timeout 60 dtk → vs AI
- [ ] Flutter MatchmakingScreen: animasi pencarian + cancel

---

### Sprint 10 (Minggu 19–20): Voice Features

#### 6.2.1 Speech-to-Text

- [ ] Flutter `VoiceInputWidget`: tahan mic → rekam → lepas → transkripsi real-time
- [ ] Waveform animasi saat merekam
- [ ] Upload audio ke Cloudflare R2, simpan URL di `debate_arguments.audio_url`

#### 6.2.2 Text-to-Speech

- [ ] `services/tts_service.py`: ElevenLabs API → upload R2 → return URL
- [ ] Mapping persona → voice_id ElevenLabs
- [ ] Flutter: auto-play audio AI + toggle on/off di settings

---

### Sprint 11 (Minggu 21–22): Multi-AI & PRO Features

#### 6.3.1 Multi-AI Provider UI

- [ ] Flutter Settings: pilih AI provider default
- [ ] Fallback chain di Debate Engine: primary → gemini → openai → anthropic → error graceful
- [ ] Log token usage ke `ai_usage_logs`
- [ ] Admin: cost dashboard per provider per hari

#### 6.3.2 Langganan PRO (Midtrans)

- [ ] Tabel `subscriptions` + migration
- [ ] Integrasi Midtrans Snap: `POST /payments/subscribe` → return payment URL
- [ ] Webhook handler: `POST /payments/webhook` → verifikasi signature → update status
- [ ] Feature gating middleware: cek subscription aktif sebelum akses fitur PRO
- [ ] Flutter PaywallScreen: daftar fitur + pilih paket + buka Midtrans WebView
- [ ] Flutter SubscriptionScreen: status + tanggal berakhir + kelola

#### 6.3.3 Laporan PDF

- [ ] Backend: generate PDF via WeasyPrint (template HTML)
- [ ] Konten: scorecard, feedback juri, transkip, saran
- [ ] `GET /sessions/:id/report` (PRO only)
- [ ] Flutter: tombol "Unduh PDF" di ResultsScreen (PRO badge)

---

### Sprint 12 (Minggu 23–24): Analytics, Push Notif & Launch

#### 6.4.1 Analytics

- [ ] Setup PostHog (self-hosted) atau Mixpanel
- [ ] Track events: session_created, session_completed, argument_submitted, pro_upgraded, dll.
- [ ] Admin Analytics: DAU/MAU chart, funnel konversi, top topik debat

#### 6.4.2 Push Notifications

- [ ] Setup Firebase Cloud Messaging (Android + iOS)
- [ ] Notifikasi: giliran online debat, renewal reminder, (Fase 4) daily challenge
- [ ] Tabel `notification_tokens`

#### 6.4.3 App Store Submission

- [ ] App Store Connect + Google Play Console developer account
- [ ] Aset: icon 1024×1024, screenshot semua device size, feature graphic
- [ ] Deskripsi ID + EN, privacy policy URL
- [ ] Submit review Apple App Store + Google Play

#### 6.4.4 ✅ Definition of Done — Fase 3

- [ ] Online debat 1v1 stabil dalam 10 sesi uji berturut tanpa disconnect tak terduga
- [ ] STT akurasi ≥ 85% untuk Bahasa Indonesia dan Inggris
- [ ] Pembayaran PRO berhasil end-to-end (pilih → bayar → fitur aktif)
- [ ] App tersedia di Google Play dan App Store
- [ ] MRR ≥ Rp 10 juta dari pembayaran PRO nyata

---

## 7. Fase 4 — Advanced (Q3 2027+)

> **Goal**: Ekspansi B2B institusi, fitur sosial kompetitif, white-label.

### 7.1 Classroom Mode

- [ ] Role `observer` di `debate_participants`
- [ ] `POST /sessions/:id/observers/join` (bergabung dengan kode kelas)
- [ ] Flutter ObserverView: read-only, real-time via WebSocket
- [ ] InstructorDashboard: daftar sesi kelas + skor semua debater
- [ ] Export laporan kelas (Excel/PDF)

### 7.2 ELO Rating & Leaderboard

- [ ] Algoritma ELO `services/elo_service.py`
- [ ] Update ELO hanya untuk online mode (bukan vs AI)
- [ ] Tabel `elo_history`
- [ ] Flutter LeaderboardScreen: tab Mingguan/Bulanan/All-Time, top 100 + posisi sendiri

### 7.3 White-Label & Public API

- [ ] Tabel `organizations` + tenant isolation di semua query
- [ ] Public REST API dengan API key (rate limited)
- [ ] Developer Portal: OpenAPI docs, API key management, usage dashboard

### 7.4 Community Knowledge Base

- [ ] Tabel `kb_submissions` (user_id, url, status, review_note)
- [ ] User submit → admin review → approve/reject
- [ ] Poin bonus +30 jika submission disetujui

---

## 8. Keputusan Teknis Kritis

> Wajib ditetapkan dan terdokumentasi sebelum Sprint 1.

### 8.1 AI Provider Priority Chain

```
Default (hemat)  : Gemini 2.0 Flash
Fallback 1       : GPT-4o Mini
Fallback 2       : Claude 3.5 Haiku
```
Gemini lebih murah untuk volume tinggi. Fallback otomatis menjamin availability.

### 8.2 Vector Embedding

```
Default  : Gemini text-embedding-004 (768 dim, lebih murah)
Alternatif: OpenAI text-embedding-3-large (1536 dim, lebih akurat)
```
Mulai Gemini, evaluasi setelah 1.000 query nyata. Upgrade jika recall < 70%.

### 8.3 Chunking Strategy

| Parameter | Nilai |
|---|---|
| Ukuran chunk | 500 token |
| Overlap | 50 token |
| Splitter | RecursiveCharacterTextSplitter |
| Urutan split | Paragraf → baris → kalimat → spasi |
| Threshold RAG | similarity ≥ 0.75 |

### 8.4 Flutter State Management

```
Pilihan : Riverpod 2.x (AsyncNotifier + code generation)
```
Compile-time safety, tidak bergantung BuildContext, fully testable, code generation mempercepat development.

### 8.5 Streaming AI Response

```
AI → FastAPI         : SSE (Server-Sent Events)
FastAPI → API Gateway: HTTP chunked response
API Gateway → Flutter: Socket.IO event 'debate:ai_chunk'
```
Teks muncul karakter per karakter seperti ChatGPT, meningkatkan perceived performance.

### 8.6 Audio Storage

| Parameter | Nilai |
|---|---|
| Provider | Cloudflare R2 |
| Format | WebM/Opus |
| Retensi | 90 hari (free) · 1 tahun (PRO) |
| Max size | 10MB per file |

### 8.7 Production Server

```
Cloud    : GCP asia-southeast2 (Jakarta) — latency terbaik untuk Indonesia
Setup    : Kubernetes (GKE) + auto-scaling + rolling deployment
Database : Cloud SQL PostgreSQL 16 + pgvector
Cache    : Memorystore Redis
CDN      : Cloudflare
```

### 8.8 Redis Caching Strategy

| Data | Key Pattern | TTL | Tipe Redis |
|---|---|---|---|
| Active session state | `session:{id}:state` | Selama sesi aktif | Hash |
| Current turn tracker | `session:{id}:turn` | Selama sesi aktif | String |
| User profile (sering diakses) | `user:{id}:profile` | 5 menit | String (JSON) |
| Persona templates | `personas:templates:{lang}` | 1 jam | String (JSON) |
| Free tier daily quota | `quota:{userId}:{date}` | 24 jam | String (counter) |
| Rate limit counters | `ratelimit:{ip}:{endpoint}` | 1 menit | String (counter) |
| Matchmaking queue | `matchmake:{lang}:{category}:{level}` | Saat antri | List |
| KB search result cache | `kb:search:{queryHash}` | 10 menit | String (JSON) |
| AI provider circuit breaker | `circuit:{provider}` | 5 menit | String |

**Invalidation rules**:
- `user:*` dihapus saat profil diupdate
- `personas:templates:*` dihapus saat admin edit/tambah persona template
- `session:*` dihapus saat sesi berakhir

### 8.9 Error Handling Matrix

#### AI Provider Errors

| Error | Deteksi | Aksi | Fallback |
|---|---|---|---|
| Provider timeout (>10s) | HTTP timeout | Log + retry 1x | Switch ke provider berikut di chain |
| Rate limit (429) | HTTP status | Log + backoff 30s | Switch provider |
| Provider down (5xx) | HTTP status | Log + circuit breaker aktif | Switch provider |
| Invalid response format | JSON parse error | Log + retry 1x | Re-prompt dengan instruksi lebih ketat |
| Content filter triggered | Provider flag | Log | Re-prompt tanpa konten sensitif |
| Semua provider gagal | 3x fallback fail | Log critical alert | Return pesan error user-friendly + opsi retry manual |

#### Circuit Breaker Config

| Parameter | Nilai |
|---|---|
| Failure threshold | 3 kali gagal berturut-turut |
| Recovery timeout | 5 menit |
| Half-open test | 1 request test setelah recovery |

#### Debate Session Errors

| Error | Aksi |
|---|---|
| AI Lawan gagal merespons | Tampilkan pesan "AI sedang kesulitan, coba kirim ulang" + tombol retry |
| 1 dari 3 Juri gagal | Tampilkan skor 2 juri yang berhasil + catatan "1 juri tidak tersedia" |
| Semua Juri gagal | Skip skor ronde ini, lanjutkan debat, hitung ulang di akhir |
| AI Penonton gagal | Skip reaksi penonton, debat tetap lanjut (non-critical) |
| WebSocket disconnect | Auto-reconnect exponential backoff (1s, 2s, 4s, 8s, max 30s) |
| Database write gagal | Retry 3x, jika tetap gagal simpan lokal (Hive) lalu sync saat reconnect |

---

## 9. Testing Strategy

### 9.1 Piramida Testing

```
        [E2E — Patrol (Flutter) + Cypress (Web)]
       [Integration — Supertest (Node) + pytest (Python)]
      [Unit — Jest (Node) + pytest (Python) + flutter_test]
```

### 9.2 Unit Test Scope

**API Gateway (Jest):**
- [ ] Auth: semua endpoint (valid + invalid cases)
- [ ] Validation: semua Zod schema
- [ ] Scoring: kalkulasi session_results dengan berbagai skor
- [ ] Rate limiter: block setelah limit tercapai

**Debate Engine (pytest):**
- [ ] Rubric calculator: weighted score dengan berbagai input
- [ ] Chunker: tidak memotong di tengah kata
- [ ] Retriever: mock pgvector, test filtering + threshold
- [ ] Fallacy detector: 7 tipe × 2 kasus = 14 test
- [ ] ELO: edge cases (sama rating, besar vs kecil)

**Flutter (flutter_test):**
- [ ] Provider: AsyncNotifier dengan mock HTTP client
- [ ] Widget: DebateArenaScreen render state berbeda
- [ ] Timer: countdown akurat, berhenti di 0

### 9.3 Integration Test

- [ ] Auth flow: register → login → endpoint protected → refresh → logout
- [ ] Debate flow: buat sesi → start → 3 argumen → end → hasil
- [ ] KB pipeline: ingest (mock API) → process → query retriever
- [ ] WebSocket: 2 koneksi → debat → disconnect → reconnect

### 9.4 Performance Test (k6)

```javascript
export const options = {
  scenarios: {
    debate_sessions: { executor: 'constant-vus', vus: 500, duration: '5m' }
  },
  thresholds: {
    http_req_duration: ['p(95)<8000'],  // AI response < 8 detik
    http_req_failed: ['rate<0.01'],      // Error < 1%
  }
};
```

### 9.5 AI Quality Test (Manual)

- [ ] Persona consistency: 10 sesi persona "Presiden RI" — manual review gaya bicara
- [ ] Fallacy precision: 50 argumen berlabel → ukur precision & recall
- [ ] RAG relevance: 20 query → manual verifikasi relevansi chunk
- [ ] Bilingual: 5 sesi ID + 5 EN → AI merespons dalam bahasa yang benar

### 9.6 Coverage Target

| Layer | Target |
|---|---|
| API Gateway | ≥ 80% |
| Debate Engine | ≥ 75% |
| Flutter Unit + Widget | ≥ 70% |
| E2E critical user stories | 100% |

---

## 10. Deployment Strategy

### 10.1 Environment

| Env | Infrastructure | Purpose |
|---|---|---|
| Local | Docker Compose | Development harian |
| Staging | GCP Jakarta, 1 VM | Testing & QA |
| Production | GCP Jakarta, Kubernetes 3+ node | Live users |

### 10.2 CI/CD Pipeline

```
Push ke feature/*
    │
    ▼
GitHub Actions CI
├── Lint (ESLint, Ruff, flutter analyze)
├── Type check (tsc, mypy, dart analyze)
├── Unit tests (Jest, pytest, flutter test)
└── Build check

Merge ke develop → CD Staging
├── Build + push Docker image
├── Deploy ke staging
├── Integration tests
└── Notify Slack

Merge ke main → CD Production
├── Build + push Docker image (semver tag)
├── kubectl apply (rolling update, zero downtime)
├── Smoke test
└── Notify Slack
```

### 10.3 Docker Services (Production)

```yaml
services:
  nginx:    { image: nginx:alpine, ports: [80, 443] }
  api-gateway:   { image: gcr.io/debateai/api-gateway:${VERSION}, restart: always }
  debate-engine: { image: gcr.io/debateai/debate-engine:${VERSION}, restart: always }
  celery-worker: { command: celery -A app.celery_app worker, restart: always }
  admin-panel:   { image: gcr.io/debateai/admin-panel:${VERSION}, restart: always }
```

### 10.4 Database Migration

- Schema changes: Prisma Migrate (Node) + Alembic (Python)
- Ke staging: otomatis saat deploy
- Ke production: **manual** + backup dulu
- Maintenance window: Minggu 02.00–04.00 WIB

### 10.5 Monitoring & Alerting

| Komponen | Tool | Alert Jika |
|---|---|---|
| Uptime | Grafana + Prometheus | Service down > 1 menit |
| Error rate API | Loki + Grafana | Error > 1% dalam 5 menit |
| AI response time | Custom metric | p95 > 8 dtk selama 10 menit |
| DB connections | Postgres Exporter | > 80% max pool |
| Celery backlog | Celery Flower | > 50 tasks selama > 5 menit |
| AI API cost | Custom dashboard | Daily spend > batas harian |
| Distributed tracing | OpenTelemetry + Jaeger | Latensi request lintas service > 5 dtk |

---

## 11. Definition of Done

### Per Task

- [ ] Kode ditulis dan ditest lokal
- [ ] Unit test relevan ditulis dan passing
- [ ] Tidak ada warning lint/type error baru
- [ ] PR dibuat, direview ≥ 1 orang
- [ ] Dideploy ke staging dan diverifikasi

### Per Sprint

- [ ] Semua task yang dicommit selesai
- [ ] Demo internal kepada stakeholder
- [ ] Semua tes passing di staging
- [ ] Tidak ada bug HIGH/CRITICAL terbuka
- [ ] Sprint review notes ditulis

### Per Fase

- Fase 1: §4.4.5 | Fase 2: §5.4.3 | Fase 3: §6.4.4

---

## 12. Dependency Map

### 12.1 Komponen

```
packages/shared-types
    ↓
apps/api-gateway ←→ apps/debate-engine
    ↓                      ↓
apps/mobile          apps/admin-panel
```

### 12.2 Fitur (Urutan Wajib)

```
[Auth] → [Persona CRUD] → [Create Session] → [Debate Arena (Fase 1)]
    → [Results] → [KB Pipeline] → [RAG] → [3 Juri + Penonton (Fase 2)]
    → [Format Formal] → [WebSocket] → [Online Debat] → [Payment PRO (Fase 3)]
    → [Classroom Mode] → [White-label] (Fase 4)
```

### 12.3 External Dependencies & Fallback

| Dependency | Fungsi | Fallback |
|---|---|---|
| Google Gemini API | AI default | OpenAI GPT-4o-mini |
| OpenAI API | Embedding (opsional) + AI opsi | Gemini embedding |
| Anthropic API | AI opsi | Hilangkan sementara |
| ElevenLabs API | TTS AI Lawan | Google Cloud TTS |
| youtube-transcript-api | Ingestion YouTube | Upload manual |
| Midtrans | Payment gateway ID | Xendit |
| Cloudflare R2 | Storage audio + PDF | AWS S3 |
| Firebase FCM | Push notification | Disable sementara |
| pgvector | Vector search | OpenSearch |

---

> [!IMPORTANT]
> **Urutan mutlak**: Setup Pre-Dev 100% → Fase 1 DoD terpenuhi → Fase 2 → seterusnya. Jangan memulai fase berikutnya sebelum fase sebelumnya lulus Definition of Done.

> [!WARNING]
> **Monitor biaya AI dari hari pertama.** Dengan 3 juri + 1 lawan + 1 penonton paralel per argumen, biaya bisa melonjak. Pasang alert harian sejak Sprint 1. Estimasi: Rp 500–1.500 per sesi.

> [!TIP]
> **Prioritaskan visual Arena lebih awal.** Animasi timer merah, emoji penonton melayang, gelembung komentar — ini yang membuat beta user terkesan, bukan kualitas argumen AI yang sempurna.

> [!NOTE]
> **Sprint rhythm**: Demo 30 menit + retrospektif 30 menit setiap Jumat akhir sprint. Jangan skip. Catatan sprint adalah aset onboarding anggota baru.

---

*Riwayat Versi:*

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | Sep 2026 | Initial — berdasarkan PRD DebateAI v2.0 |
