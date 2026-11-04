# Indeks Arsitektur — DebateAI

- Status: DRAFT (usulan, menunggu persetujuan)
- Tanggal: 2026-11-03
- Acuan audit: branch `feature/base-code`

> Folder `feature/architecture/` berisi keputusan arsitektur (ADR) yang mengikat
> semua spek fitur. Spek fondasi di `feature/database/` dan `feature/Backend/`
> adalah turunan dari keputusan di sini. Jika ADR berubah, spek turunan wajib
> direvisi eksplisit, bukan diam-diam.

## Gambaran yang diusulkan (ringkas)

```
Flutter / Admin Panel (Next.js)
  │  HTTPS + WSS — satu pintu via Gateway
  ▼
Go Gateway (Echo) ── satu-satunya penulis OLTP + hub WebSocket
  │  gRPC internal (stateless)     │  enqueue job async
  ▼                                ▼
Python Engine (opponent,          Worker (Celery + Redis):
3 juri paralel, audience,         ingest YouTube/PDF → chunk →
RAG retrieval)                    embedding → pgvector
  │                                    │
  └──────► Postgres 16 + pgvector ◄─────┘
           (768d, HNSW — sumber kebenaran)
           Redis (presence, rate-limit, pub/sub, circuit breaker)
           R2/S3 (blob: PDF asli, audio TTS/STT)
```

## Daftar ADR

| # | File | Status | Isi |
|---|---|---|---|
| 0 | `README.md` (file ini) | DRAFT | Indeks + gambaran + relasi ke spek |
| 1 | `01-gateway-go-bukan-node.md` | DRAFT | Kunci Go+Echo+gRPC; nyatakan PRD §13 Node kedaluwarsa |
| 2 | `02-satu-postgres-sebagai-sumber-kebenaran.md` | DRAFT | Satu Postgres+pgvector; Redis ephemeral; R2 untuk blob |
| 3 | `03-realtime-dan-skala.md` | DRAFT | Kontrak WS, Redis pub/sub multi-replika, engine stateless, target beban |

## Relasi ke spek fondasi yang sudah ada

| Spek | Bergantung ke ADR |
|---|---|
| `feature/database/01-erd-sumber-kebenaran.md` | ADR-02 (sumber kebenaran DDL, 768d) |
| `feature/Backend/02-auth-otorisasi-sesi.md` | ADR-01 (pintu Go) + ADR-03 (binding sesi WS) |
| `feature/Backend/03-secret-tls-target-infra.md` | ADR-01 (batas jaringan antar service) |
| `feature/Backend/04-batas-resource-kuota.md` | ADR-02 (worker async) + ADR-03 (rate limit WS) |
| `feature/Backend/05-observabilitas-biaya-ai.md` | ADR-01 (provider aktual) + ADR-03 (circuit di Redis) |

## Cara menyetujui

1. Baca ADR 01–03 berurutan.
2. Diskusikan per-Keputusan (K-1, K-2, ...) sampai disepakati.
3. Ubah status tiap file menjadi `DISETUJUI` + tanggal + nama penyetuju (commit terpisah).
4. Setelah itu implementasi kode mengacu ke ADR + spek turunannya.
