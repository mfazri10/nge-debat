# 03 — Secret, TLS & Target Infra (P0)

- Status: DRAFT
- Tanggal: 2026-10-29
- Acuan audit: branch `feature/base-code`

## Tujuan

Mengunci target deployment tahap pertama dan menutup konfigurasi development
(secret default, DB trust, gRPC tanpa TLS, port internal terekspos) agar tidak
terbawa ke lingkungan apa pun di luar laptop developer.

## Temuan (kode yang sudah dibaca)

- `pkg/config/config.go:63` — `JWT_SECRET` default harcoded
  `super-secret-jwt-key-debateai-2026`; `docker-compose.yml:59` memakai nilai sama.
  Tidak ada penolakan startup jika secret kosong/default.
- `pkg/config/config.go:93-99` — fungsi `mustEnv` (fail-fast) sudah ada tetapi
  **tidak dipakai** di `Load()`. Pola perbaikannya tinggal dipakai.
- `docker-compose.yml:12` — Postgres `POSTGRES_HOST_AUTH_METHOD: trust`.
- `apps/debate-engine/main.py:49` — gRPC `add_insecure_port` (TODO TLS).
- `pkg/grpcclient/client.go:25` — gateway memakai `insecure.NewCredentials` (TODO TLS).
- `docker-compose.yml:80-81` — port gRPC `50051` dipetakan ke host; siapa pun yang
  mencapai host bisa memanggil RPC langsung melewati gateway.
- `docker-compose.yml:136-137` — `NEXTAUTH_SECRET` juga punya default hardcoded.
- `apps/mobile/lib/core/constants/api_endpoints.dart:14-15` — mobile memakai
  `http://` dan `ws://` tanpa TLS.
- Dilaporkan `ANALISIS_PROJECT.md`: ada dua file Compose (`docker-compose.yml` dan
  `infra/docker-compose.yml`) yang hampir sama dan bisa menyimpang (belum
  diverifikasi ulang di audit ini — jadi item verifikasi).

## Keputusan

- K-1: **Target tahap pertama = pilot internal** (Compose di 1 VM, user terbatas,
  undangan). Kubernetes/GKE, Cloud SQL, Memorystore eksplisit **ditunda** sampai
  keputusan beta (lihat Non-goal). Alasan: beban pilot tidak butuh orkestrasi;
  kompleksitas K8s tanpa operator adalah risiko, bukan pengaman.
- K-2: **Fail-fast secret.** `Load()` memakai pola `mustEnv` untuk
  `JWT_SECRET`, `POSTGRES_PASSWORD`, dan kredensial AI saat `APP_ENV != development`,
  plus menolak nilai yang sama dengan default yang diketahui. Aplikasi keluar
  dengan pesan jelas, bukan berjalan pincang.
- K-3: **Batas jaringan pilot**: hanya 443 (HTTPS/WSS via reverse proxy) dan
  22 (SSH admin) yang terbuka ke publik. Postgres, Redis, gRPC 50051 hanya di
  network internal Compose; **hapus** pemetaan port `50051`, `5432`, `6379` ke host
  pada file Compose non-lokal.
- K-4: **TLS bertahap**: (a) reverse proxy (Caddy/Traefik) menerbitkan HTTPS/WSS
  dengan sertifikat otomatis; (b) gRPC gateway→engine memakai token internal
  bersama via metadata (`x-internal-token`, diputar manual) sebagai langkah 1,
  mTLS sebagai langkah 2 sebelum beta publik.
- K-5: **Postgres**: hapus `trust`; password wajib ≥ 20 karakter dari secret;
  user aplikasi bukan superuser; backup harian + uji restore mingguan (RPO 24 jam
  untuk pilot — cukup, dan eksplisit).
- K-6: **Satu Compose untuk lokal, satu override untuk pilot**:
  `docker-compose.yml` (lokal) + `docker-compose.pilot.yml` (override: tanpa port
  internal, env via secret, restart policy). Duplikasi `infra/docker-compose.yml`
  disatukan atau dihapus — tidak boleh ada dua sumber.
- K-7: **Mobile per-environment**: `api_endpoints.dart` membaca base URL dari
  build config (`--dart-define API_BASE_URL, WS_BASE_URL`); default debug tetap
  localhost, rilis pilot memakai `https://`/`wss://`. Tidak ada URL hardcoded
  di kode rilis.

## Non-goal

- Migrasi ke GKE/Kubernetes, Cloud SQL/pgvector terkelola, Memorystore, CDN/WAF.
- Secret manager cloud (cukup file secret + env di host pilot yang aksesnya dibatasi).
- Multi-region, auto-scaling, atau topologi multi-gateway (Redis Pub/Sub adapter).

## Acceptance Criteria

- [ ] AC-1: `APP_ENV=pilot` + `JWT_SECRET` kosong/default → proses keluar dengan pesan error, tidak serving.
- [ ] AC-2: Compose pilot tidak memetakan port 5432/6379/50051 ke host (cek: `docker compose config`).
- [ ] AC-3: Dari luar VM, hanya 443/22 yang reachable (cek: `nmap`/uji koneksi).
- [ ] AC-4: gRPC tanpa `x-internal-token` yang benar → ditolak (UNAUTHENTICATED).
- [ ] AC-5: Mobile rilis pilot memakai `https://`/`wss://` (cek: tidak ada `http://` di artifact rilis).
- [ ] AC-6: Hanya ada 2 file Compose (basis + override pilot); tidak ada duplikat menyimpang.
- [ ] AC-7: Backup Postgres otomatis berjalan + 1 uji restore tercatat.

## File target implementasi

- `apps/api-gateway/pkg/config/config.go` — pakai `mustEnv` + tolak default.
- `docker-compose.yml`, `docker-compose.pilot.yml` (baru), `infra/docker-compose.yml` (satukan/hapus).
- `apps/debate-engine/main.py` + `pkg/grpcclient/client.go` — auth metadata internal langkah 1.
- Reverse proxy baru (mis. `infra/Caddyfile`) — HTTPS/WSS otomatis.
- `apps/mobile/lib/core/constants/api_endpoints.dart` — base URL dari build config.
- `.env.example` tiap service — sinkron dengan variabel wajib baru.

## Verifikasi

1. `APP_ENV=pilot docker compose -f docker-compose.yml -f docker-compose.pilot.yml config` → periksa port & env.
2. Start dengan secret kosong → amati exit code + pesan error.
3. `grpcurl` tanpa token ke engine dari luar network → ditolak.
4. Build mobile pilot → grep artifact untuk `http://localhost` → tidak ada.
5. Simulasi restore backup ke DB segar → migrasi + seed jalan.

## PR lanjutan

- Keputusan beta publik: cloud/region, managed DB/Redis, secret manager, mTLS penuh (pemilik: spek infra-beta).
- Estimasi biaya per sesi (lawan AI + 3 juri + audiens + embedding) sebagai input kuota Pro (pemilik: spek 05 + monetisasi).
- Topologi multi-gateway bila pilot jenuh (pemilik: spek skala).
