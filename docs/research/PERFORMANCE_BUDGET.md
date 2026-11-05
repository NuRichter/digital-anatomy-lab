# Performance Budget: Digital Anatomy Laboratory

Agen 7 (Three.js & Performance Architect). Tanggal: 2026-10-14
Berlaku untuk: three 0.186.1, BatchedMesh per chunk, aset meshopt (lihat ASSET_PROCESSING_PIPELINE.md). Anggaran bersifat **gerbang**: build/PR gagal jika dilanggar (kecuali yang ditandai "pantau").

---

## 1. Kelas perangkat acuan

| Kelas | Contoh | Tier aset | DPR maks |
|---|---|---|---|
| D-high | Desktop RTX 5060 Ti (mesin dev) | hi | 2 |
| D-low (acuan desktop) | Laptop Intel Iris Xe / Radeon 680M, 8 GB RAM | hi | 1,5 |
| M-mid (acuan mobile) | Android Snapdragon 7-series (Adreno 6xx/7xx), 6 GB; iPhone 12 | lo | 1,5 |
| M-low | Android Mali-G52 / Helio G-series, 3 sampai 4 GB | lo, maks 3 sistem | 1,0 |

Anggaran di bawah diukur pada **D-low** dan **M-mid**. D-high hanya sanity check (bukan acuan).

---

## 2. Anggaran unduhan (byte di kabel)

| Item | Desktop (hi) | Mobile (lo) | Catatan |
|---|---|---|---|
| S0 shell (HTML+CSS+JS React/UI) | ≤ 120 KB gzip | ≤ 120 KB | gerbang |
| S2 manifest.json | ≤ 30 KB gzip | ≤ 30 KB | gerbang |
| S3 bundle lab (three + bvh + decoder WASM) | ≤ 220 KB gzip | ≤ 220 KB | three r186 tree-shaken sekitar 150 sampai 180 KB gzip (pantau) |
| S4 konteks awal (siluet + rangka) | ≤ 3,0 MB | ≤ 1,5 MB | gerbang |
| **Total muat awal (S0 sampai S4)** | **≤ 3,5 MB** | **≤ 2,0 MB** | gerbang |
| Per chunk | ≤ 2,5 MB (target 0,8 sampai 2 MB) | ≤ 1,0 MB | gerbang; chunk < 100 KB digabung dengan tetangga |
| Seluruh tubuh, semua sistem | ≤ 25 MB | ≤ 10 MB | gerbang |
| search-index.json | ≤ 80 KB gzip | ≤ 80 KB | dimuat setelah S3 |
| structures.<system>.json | ≤ 60 KB gzip per sistem | sama | n/a |
| Fallback statis (WebP) | ≤ 400 KB per halaman | ≤ 250 KB | n/a |

**Ukuran repo/deploy:** seluruh `public/models` (hi + lo, `.glb` + `.glb.gz`) ≤ **80 MB**. Tidak ada file > 25 MB (GitHub memperingatkan > 50 MiB dan memblokir > 100 MiB).

### Hitungan kuota Vercel Hobby (100 GB Fast Data Transfer / bulan)
| Skenario sesi | Byte/sesi | Sesi/bulan dalam kuota |
|---|---|---|
| Ringan (rangka + 1 sistem, mobile) | ~3 MB | ~33.000 |
| Tipikal (desktop, 3 sampai 4 sistem) | ~8 MB | ~12.500 |
| Berat (seluruh tubuh hi) | ~25 MB | ~4.000 |
| Kunjungan ulang (cache immutable) | ~0,2 MB | sangat banyak |

CDN Requests 1.000.000/bulan: sesi tipikal sekitar 20 sampai 30 request (≈ 35.000 sampai 50.000 sesi). Bukan batas yang mengikat. Melebihi kuota Hobby berarti fitur dijeda sampai 30 hari, jadi pasang pemantauan di dashboard Usage. Hobby hanya untuk penggunaan non-komersial.

---

## 3. Anggaran geometri & GPU

| Metrik | Desktop (D-low) | Mobile (M-mid) | M-low |
|---|---|---|---|
| Segitiga **dimuat** (semua chunk aktif) | ≤ 4.000.000 | ≤ 1.000.000 | ≤ 500.000 |
| Segitiga **digambar** per frame (setelah culling & visibilitas) | ≤ 3.000.000 | ≤ 700.000 | ≤ 350.000 |
| Segitiga per chunk | ≤ 400.000 (hi) | ≤ 120.000 (lo) | n/a |
| Draw calls per frame | ≤ 40 | ≤ 20 | ≤ 12 |
| Memori GPU (buffer geometri + tekstur instance) | ≤ 300 MB | ≤ 120 MB | ≤ 80 MB |
| Heap JS (termasuk BVH) | ≤ 400 MB | ≤ 200 MB | ≤ 150 MB |
| Material/shader program unik | ≤ 4 | ≤ 4 | ≤ 4 |
| Lampu | Hemisphere + 1 Directional, tanpa shadow map | sama | sama |
| Post-processing | tidak ada (MSAA bawaan) | tidak ada, tanpa MSAA | tidak ada |

Estimasi memori: posisi int16 (8 B padded) + normal int8 (4 B) ≈ 12 B/vertex, sekitar 0,5 vertex/segitiga, ditambah index Uint32 12 B/segitiga, kira-kira **18 B/segitiga di GPU**. 3 juta segitiga ≈ 54 MB. BVH (three-mesh-bvh) di heap JS kira-kira 10 sampai 20 B/segitiga.

Draw calls: satu `BatchedMesh` per chunk = 1 draw call bila ekstensi `WEBGL_multi_draw` tersedia (Chrome/Edge/Firefox/Safari modern). Tanpa ekstensi, three menggambar per instance (fallback lebih lambat), dan ini dipantau di tes kompatibilitas.

---

## 4. Anggaran waktu & FPS

| Metrik | Desktop (D-low) | Mobile (M-mid) | Metode |
|---|---|---|---|
| FPS saat orbit (semua sistem default aktif) | **60** (p95 frame ≤ 20 ms) | **≥ 30** (p95 ≤ 40 ms) | rAF delta, sec. 6.2 |
| Frame saat diam | 0 (render on-demand) | 0 | hitung `renderer.info.render.frame` selama 5 s idle |
| GPU time per frame | ≤ 10 ms | n/a | `EXT_disjoint_timer_query_webgl2` (desktop Chrome) |
| Pick (hover/klik) | ≤ 1 ms | ≤ 4 ms | `performance.measure` di sekitar `pick()` |
| `applyVisibility()` (slider layer, isolasi) | ≤ 2 ms | ≤ 6 ms | `performance.measure` |
| Decode + buildBatch per MB chunk | ≤ 150 ms | ≤ 400 ms | `performance.measure` per tahap |
| Long task saat muat chunk | tidak ada > 50 ms selain decode tunggal ≤ 120 ms | ≤ 200 ms | PerformanceObserver `longtask` |
| Time-to-first-3D (siluet+rangka tampil) | ≤ 3 s (kabel/Wi-Fi 50 Mbps) | ≤ 6 s (4G "Fast 4G" Lighthouse) | mark `lab:first-render` |
| LCP | ≤ 2,5 s | ≤ 2,5 s | Lighthouse (LCP = elemen shell/judul, bukan canvas) |
| INP | ≤ 200 ms | ≤ 200 ms | Playwright + web-vitals / CrUX nanti |
| CLS | ≤ 0,1 | ≤ 0,1 | Lighthouse |
| TBT | ≤ 200 ms | ≤ 300 ms | Lighthouse |
| Lighthouse Performance score | ≥ 90 | ≥ 80 | Lighthouse 13.5.0 |

Kebijakan adaptif (runtime): jika median frame > 25 ms selama 2 s saat interaksi, DPR turun 0,25 bertahap (min 1,0). Jika masih > 25 ms, tampilkan saran beralih ke tier `lo` atau menonaktifkan sistem.

---

## 5. Gerbang statis (tanpa browser): `validate_assets.mjs`
Dijalankan setiap `npm run assets` dan di CI (GitHub Actions gratis untuk repo publik):
- ukuran per chunk/tier, total per tier, total `public/models`
- segitiga per chunk dan total (dibaca dari GLB via `@gltf-transform/core`)
- tidak ada file > 25 MB
- ekstensi yang dibutuhkan hanya `EXT_meshopt_compression`, `KHR_mesh_quantization`
Output: `build/asset-report.json` + tabel ringkas di log. Exit code ≠ 0 jika ada pelanggaran.

Bundle JS: `vite build`, lalu skrip memeriksa ukuran gzip setiap file di `dist/assets/*.js` terhadap anggaran S0/S3 (Vite 8 menampilkan ukuran gzip di log build; skrip membaca ulang dengan `zlib.gzipSync`).

---

## 6. Pengukuran runtime

### 6.1 Instrumentasi di aplikasi (aktif dengan `?perf=1`)
- `performance.mark/measure`: `lab:shell`, `chunk:<id>:fetch`, `:decode`, `:batch`, `:bvh`, `lab:first-render`, `pick`, `visibility`.
- Rekaman frame: ring buffer 600 delta rAF selama interaksi.
- `renderer.info` (calls, triangles, geometries, textures) dan `performance.memory` (Chromium).
- Semua diekspos di `window.__anatomyPerf` agar Playwright bisa membacanya.

### 6.2 Playwright 1.64.0 (FPS & memori di GPU nyata)
Headless Chromium default memakai renderer perangkat lunak (SwiftShader), sehingga **tidak valid untuk FPS**. Jalankan perf test **headed** di mesin dev/laptop acuan:

```ts
// playwright.perf.config.ts
use: {
  headless: false,
  launchOptions: { args: ['--ignore-gpu-blocklist', '--use-angle=d3d11', '--enable-gpu-rasterization'] },
  viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5,
}
```
Skenario `perf/orbit.spec.ts`:
1. Buka `/?perf=1&sys=integumentary,skeletal,muscular,cardiovascular`, tunggu `lab:all-ready`.
2. Orbit terprogram: `page.mouse` drag 360° dalam 6 s, lalu zoom in/out.
3. Baca `__anatomyPerf.frames`: hitung median, p95, p99. Assert terhadap sec. 4.
4. Idle 5 s, lalu assert jumlah frame yang dirender = 0.
5. Pick 50 titik acak, lalu assert p95 `pick` ≤ anggaran.
6. Toggle off semua sistem: `renderer.info.memory.geometries` kembali ke baseline (deteksi kebocoran dispose).
7. Simulasi mobile (proksi kasar, bukan pengganti perangkat nyata): CDP `Emulation.setCPUThrottlingRate({rate: 4})` + `Network.emulateNetworkConditions` (Fast 4G), tier dipaksa `lo`.
8. Catat total byte via `page.on('response')`, lalu assert terhadap sec. 2 (muat awal & per sistem).

Uji fungsional (pick, isolasi, layer, pencarian, fallback no-WebGL via `--disable-webgl`, reduced-motion via `page.emulateMedia({ reducedMotion: 'reduce' })`) berjalan headless di CI untuk Chromium, Firefox, dan WebKit.

### 6.3 Lighthouse 13.5.0 (web vitals & bundle)
```powershell
npx lighthouse https://<preview>.vercel.app/ --only-categories=performance --output=json --output=html --output-path=build/lh-mobile --throttling-method=simulate
npx lighthouse https://<preview>.vercel.app/ --preset=desktop --only-categories=performance --output=json --output=html --output-path=build/lh-desktop
```
- Jalankan 3 kali, pakai median. Uji pada **URL preview Vercel** (CDN dan kompresi nyata), bukan `vite preview`.
- Lighthouse menilai shell/LCP/TBT. Performa 3D diukur oleh Playwright (6.2).

### 6.4 Perangkat nyata
- Android: Chrome remote debugging (`chrome://inspect`), Performance panel + `?perf=1` overlay.
- iOS: Safari Web Inspector. Catat FPS overlay dan memori (Web Inspector, tab Timelines/Memory).
- Matriks minimum sebelum rilis: 1 laptop iGPU, 1 Android mid, 1 iPhone, 1 Android low.

---

## 7. Pelaporan
- `build/asset-report.json` (statis), `build/perf/<tanggal>-<perangkat>.json` (Playwright), `build/lh-*.json` (Lighthouse).
- Ringkasan ditulis ke `research/perf_results.md` setiap milestone, dengan tabel anggaran vs hasil dan status lulus/gagal.
- Regresi > 10% pada metrik apa pun memblokir merge ke `main`.
