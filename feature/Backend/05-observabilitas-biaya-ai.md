# 05 — Observabilitas & Pencatatan Biaya AI (P1)

- Status: DRAFT
- Tanggal: 2026-10-29
- Acuan audit: branch `feature/base-code`

## Tujuan

Membuat kesehatan sistem dan biaya AI bisa dipercaya: health check yang membedakan
"sehat" dari "DB putus", tanpa vektor embedding palsu, dan setiap rupiah token
tercatat dengan provider yang benar-benar dipakai.

## Temuan (kode yang sudah dibaca)

- `cmd/server/main.go:66-68` — `/health` selalu menjawab `{"status":"ok"}`
  tanpa memeriksa DB, Redis, atau gRPC.
- `app/servicers/knowledge_servicer.py:107-115` — jika API key kosong atau
  embedding gagal, engine mengembalikan **vektor nol 768** dengan penanda
  `model_used` = `dummy-zero-768` / `error-fallback-768`. Ingestion/search
  tampak berhasil tetapi hasilnya tidak valid secara semantik.
- `app/agents/opponent.py:99` — jalur non-streaming melaporkan
  `provider_used = provider yang diminta`, padahal factory bisa mengembalikan
  provider fallback (`ai_factory.py:24-32`).
- `app/agents/opponent.py:120,128,131` — jalur streaming melabeli selesai dengan
  provider yang diminta, fallback berlabel `GEMINI_FALLBACK`, gagal total `ERROR`.
- `app/core/ai_factory.py:11-12,81-84` — circuit breaker in-memory per proses
  (tidak konsisten antar-replika) dan recovery masih TODO.
- `apps/admin-panel/src/components/telemetry/stat-cards.tsx:16,29-31` — angka
  dashboard hardcoded (`14` sesi, `1.84M` token, `$3.42`) tanpa sumber API.

## Keputusan

- K-1: **Health check dua lapis**: `GET /health/live` (proses hidup) dan
  `GET /health/ready` (cek DB `SELECT 1`, Redis `PING`, gRPC `channel_ready`
  ≤ 3 detik). Compose dan reverse proxy memakai `/health/ready` untuk routing.
- K-2: **Hapus embedding nol.** Engine wajib mengembalikan gRPC error
  (`UNAVAILABLE`/`INVALID_ARGUMENT`) saat embedding gagal, bukan vektor nol.
  Masa transisi 1 rilis: gateway menolak respons dengan
  `model_used IN (dummy-zero-768, error-fallback-768)` menjadi 502
  `EMBEDDING_UNAVAILABLE` + log error; lalu engine diwajibkan gagal-terbuka.
- K-3: **Factory jujur.** `get_llm` mengembalikan `(llm, provider_aktual)` agar
  agen mencatat provider yang benar-benar dipakai, termasuk saat fallback.
  Label fallback bebas (`*_FALLBACK`) dipertahankan sebagai suffix, bukan
  pengganti nama provider.
- K-4: **Circuit breaker di Redis** (state + failure count + `opened_at` bersama),
  threshold dari config, recovery otomatis setelah 5 menit. Endpoint baca status
  untuk admin: `GET /admin/ai-providers` (ringkasan per provider).
- K-5: **Akuntansi token**: setiap panggilan lawan/juri/audience/embedding
  menulis 1 baris `ai_usage_logs` (provider aktual, model, prompt/comp tokens,
  estimasi biaya, purpose, session_id). Tanpa baris ini, panggilan dianggap bocor.
- K-6: **Admin panel jujur**: widget tanpa sumber API diberi badge `MOCK`
  sampai tersambung ke endpoint nyata; endpoint telemetri minimal:
  sesi aktif, DAU, token & biaya per provider/hari, latensi p50/p95 time-to-first-token.
- K-7: **Log terstruktur**: tiap request membawa `request_id` (sudah ada middleware
  RequestID) sampai ke log engine via gRPC metadata; error AI selalu log
  provider, model, latensi, dan potongan error yang aman (tanpa key).

## Non-goal

- Stack APM penuh (Prometheus/Grafana/OTel) — cukup endpoint + log untuk pilot;
  dievaluasi saat beta bila ada operator.
- Alerting otomatis (PagerDuty/dll.) — notifikasi manual dari dashboard dulu.
- Rekonsiliasi tagihan provider vs `ai_usage_logs` (bulanan, manual).

## Acceptance Criteria

- [ ] AC-1: Matikan Postgres → `/health/ready` 503 menyebut `database`; nyalakan → 200. Sama untuk Redis dan engine.
- [ ] AC-2: Tanpa `GEMINI_API_KEY` → embedding/search/ingest gagal dengan error eksplisit; tidak ada vektor nol tersimpan (cek: tidak ada chunk dengan norm 0).
- [ ] AC-3: Paksa provider utama gagal → respons sukses via fallback TERCATAT dengan provider aktual + suffix fallback.
- [ ] AC-4: 2 replika engine berbagi status circuit yang sama (buka di A → terlihat di B).
- [ ] AC-5: 1 sesi debat penuh menghasilkan baris `ai_usage_logs` untuk tiap panggilan AI (lawan + 3 juri + audience + embedding).
- [ ] AC-6: Dashboard admin: tidak ada angka tanpa sumber; widget belum tersambung berlabel `MOCK`.
- [ ] AC-7: Grep log: tiap error AI memuat request_id + provider + model + latensi.

## File target implementasi

- `cmd/server/main.go` — `/health/live`, `/health/ready`, teruskan request_id ke gRPC metadata.
- `pkg/grpcclient/client.go` — tolak `model_used` dummy/error (masa transisi).
- `app/servicers/knowledge_servicer.py` — gagal-terbuka untuk embedding (hapus zero-vector).
- `app/core/ai_factory.py` — kembalikan provider aktual + state Redis + recovery.
- `app/agents/opponent.py`, `judge.py`, `audience.py` — catat provider aktual; tulis `ai_usage_logs`.
- `apps/admin-panel/src/components/telemetry/*` — badge `MOCK` + sambung endpoint nyata bertahap.
- `apps/admin-panel/src/lib/api.ts` — client endpoint telemetri/admin baru.

## Verifikasi

1. Uji kill-dependency per AC-1 berurutan; catat body respons ready-check.
2. `SELECT COUNT(*) FROM kb_chunks WHERE embedding = '[0,...]'` (norm 0) → 0 setelah uji AC-2.
3. Simulasi fallback (cabut 1 API key) → baca `ai_usage_logs` terbaru, cocokkan provider.
4. Buka dashboard admin → screenshot tiap widget: angka ber-sumber atau berlabel MOCK.
5. `SELECT purpose, COUNT(*) FROM ai_usage_logs WHERE session_id=... GROUP BY 1` setelah 1 sesi → lengkap.

## PR lanjutan

- Evaluasi Prometheus/Grafana + alerting saat beta (pemilik: spek infra-beta).
- Estimasi biaya per sesi dari data `ai_usage_logs` pilot (pemilik: spek monetisasi).
- Jejak audit penolakan 403/429 ke `admin_audit_logs` (pemilik: spek moderasi).
