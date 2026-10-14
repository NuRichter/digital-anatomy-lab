# Laboratorium Anatomi Digital

Penjelajah anatomi manusia 3D seluruh tubuh untuk mata kuliah **Teknik Anatomi Digital**
(Program Magister Kedokteran). Pengguna dapat memutar, memperbesar, memilih, mengisolasi,
menyembunyikan, dan mencari 2.216 struktur bernama dari model BodyParts3D, lapis demi lapis.

> Model adalah atlas satu pria dewasa (BodyParts3D, DBCLS), bukan rekonstruksi kadaver atau data pasien.
> Jangan digunakan untuk pengukuran klinis.

## Fitur
- Penampil 3D seluruh tubuh (Three.js r186) dengan kontrol orbit, zoom, geser, dan tampak baku (anterior, posterior, lateral).
- Enam **lapisan diseksi**: kulit → otot superfisial → otot dalam → rangka dan organ → organ dan pembuluh → pembuluh dan otak.
- 13 kelompok **sistem** yang dapat dinyalakan per sistem dan dimuat bertahap (lazy loading per berkas GLB).
- Filter **wilayah**: kepala-leher, toraks, abdomen, pelvis, ekstremitas atas, ekstremitas bawah.
- **Pencarian** 2.216 struktur dan 2.068 kelompok konsep FMA (mis. "heart" memilih 83 mesh), termasuk sinonim bahasa Indonesia
  (jantung, hati, ginjal, paru, otak, dll.). Hasil yang tidak tersedia dinyatakan dengan jelas.
- Panel informasi: nama FMA, FMA ID, sistem, wilayah, berkas sumber, dan relasi *part-of*.
- Isolasi, sembunyikan, x-ray, fokus, atur ulang; pintasan papan ketik (I, H, X, R, /, Esc).
- Mode proyektor (tema gelap), tata letak seluler dengan *bottom sheet*, dukungan *reduced motion*.
- Fallback bila WebGL tidak tersedia (gambar statis + katalog yang dapat dicari) dan pesan galat + "Coba lagi" bila model gagal dimuat.

## Menjalankan
```bash
npm ci
npm run dev        # pengembangan
npm run build      # tsc + vite build -> dist/
npm run preview    # server lokal untuk dist/
npx playwright install chromium && npm test
```

## Pipeline aset
Berkas OBJ mentah **tidak** disimpan di repositori. Untuk membangun ulang:
1. Unduh `isa_BP3D_4.0_obj_99.zip` dan tabel `isa_*`/`partof_*` dari DBCLS (lihat ATTRIBUTION.md).
2. `pipeline/bp3d_classify.py` dan `pipeline/bp3d_sys.py` membuat `elements.json` (konsep FMA, sistem).
3. Impor ke Blender dan jalankan `pipeline/export_web.py` (decimation + ekspor GLB per sistem + `manifest.json`).
4. `node scripts/process-assets.mjs <folder-raw>` mengompresi GLB dengan meshopt ke `public/models/`.

## Kinerja (diukur dengan Playwright, Chromium, desktop 1440×900)
Lihat `test-results/perf.json` setelah `npm test`. Pengukuran 14 Oktober 2026 (server lokal):
lapisan bawaan siap ±0,4 s, transfer ±7,6 MB, ±797 ribu segitiga terlihat, ±56 fps saat orbit.
Total aset 15 MB (13 berkas); hanya sistem yang dibutuhkan yang diunduh.

## Lisensi
Kode: MIT. Model dan manifest: CC BY 4.0, turunan dari BodyParts3D. Lihat `ATTRIBUTION.md`.
