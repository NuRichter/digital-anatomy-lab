# Laporan QA (14 Oktober 2026)

Rencana QA: `QA_PLAN.md`. Laporan ini mencatat hasil pemeriksaan yang **benar-benar dijalankan**.

## 1. PPT Teknik Anatomi Digital V2.pptx
| Pemeriksaan | Hasil |
|---|---|
| Jumlah slide | 47 (35 sumber + 12 baru) |
| Render seluruh slide ke PNG (PowerPoint COM, 1600×900) | 47/47 dirender dan diinspeksi lewat lembar kontak (4 lembar) dan per slide untuk slide baru |
| Masalah yang ditemukan dan diperbaiki | urutan slide sisipan (2 slide salah posisi), simbol ">" terbungkus pada slide Sinha, label "BAGIAN TERKAIT" tertinggal, rumus tanpa subskrip, label "I" menimpa keterangan, baris sumber terlalu panjang |
| Integritas berkas (`anat/scripts/qa_pptx.py`) | zip OK; 0 galat XML; 0 relasi eksternal; 0 target internal hilang |
| Teks < 9 pt | 4 run (kredit render 8 pt di sampul dan penutup; disengaja) |
| Speaker notes | seluruh 47 slide berisi catatan; 35 catatan lama diperluas dengan transisi, batasan bukti, dan koreksi |
| Klaim ilmiah | dicek terhadap `CLAIM_VERIFICATION.md`; 4 koreksi pada slide, 4 koreksi pada catatan |
| Berkas sumber | tidak diubah (dibuka read-only; V2 dibangun dari salinan sementara) |

## 2. 3D Teknik Anatomi Digital.pptx
| Pemeriksaan | Hasil |
|---|---|
| Jumlah slide | 43 (bab A–J), 15,3 MB |
| Render seluruh slide ke PNG | 43/43 diinspeksi (4 lembar kontak, beberapa iterasi) |
| Masalah yang ditemukan dan diperbaiki | gambar terlalu kecil (kini dipotong rapat dengan pemetaan ulang koordinat label), judul tertutup gambar, label saling tumpang pada slide berpasangan, label terpotong di tepi, render orbita berisi potongan tak relevan, kerangka bawah memuat tangan, frame animasi kosong (bug parenting kamera), video menutupi footer atribusi |
| Label | 155 anchor dihitung dengan memproyeksikan konsep FMA BodyParts3D ke kamera render yang sama; setiap label terhubung ke konsep yang ada di dataset (`anat/labels.json`); 1 label dibuang (m. gluteus maximus di luar bingkai) |
| Video | 5 MP4 H.264 yuv420p (turntable 8 s, lapisan 13 s, jantung 6 s, cranium 6 s, sapuan koronal 7 s); semuanya **embedded** (IsLinked = False), putar otomatis saat slide tampil, berulang |
| Uji pemutaran | salinan deck di folder lain diekspor PowerPoint ke MP4 (`CreateVideo`); frame dari slide video berubah dari waktu ke waktu → video tertanam benar-benar diputar oleh mesin PowerPoint secara offline |
| Fallback | setiap video memiliki poster frame; bila video tidak diputar, slide tetap menampilkan gambar model |
| Integritas berkas | zip OK; 0 galat XML; 0 relasi eksternal; 0 target hilang |
| Teks < 9 pt | 86 run = footer atribusi dan nomor slide 7,5 pt (2 per slide; disengaja) |
| Belum diuji | PowerPoint versi lain (Mac, PowerPoint Online), proyektor kelas yang sebenarnya |

## 3. Website (Laboratorium Anatomi Digital)
| Pemeriksaan | Hasil |
|---|---|
| `tsc --noEmit` + `vite build` | lulus; bundel JS 243 kB gzip |
| Playwright (Chromium 1.64, GPU ANGLE d3d11) | 5/5 lulus: muat + tanpa galat konsol; cari "jantung" → heart (83 mesh) → isolasi → tampilkan semua → sembunyikan → atur ulang; pencarian struktur yang tidak tersedia ("thyroid gland") memberi pesan jelas; lapisan 6; wilayah kepala-leher; klik-pilih pada kanvas; dialog sumber; mode proyektor; model gagal dimuat → pesan + "Coba lagi"; tanpa WebGL → fallback + katalog; tata letak seluler (Pixel 7) dengan bottom sheet |
| Kinerja (server lokal, desktop 1440×900) | lapisan bawaan siap 0,4–0,43 s; transfer 7,6 MB; 797 ribu segitiga, 744 mesh terlihat, 650 draw call; ±56 fps saat orbit (headless Chromium dengan GPU) |
| Ukuran aset | 15 MB total (13 GLB meshopt), terbesar 3,9 MB; manifest 0,8 MB |
| Repositori | 37 berkas; tidak ada .docx/.pptx/.pdf/.env/node_modules/dist |
| Belum diuji | Safari/iOS, Firefox, perangkat seluler fisik, pembaca layar, waktu muat melalui jaringan nyata (CDN Vercel) |

Masalah yang ditemukan oleh pengujian dan diperbaiki: panel ganda (ID duplikat) pada desktop/seluler; header seluler meluber sehingga bottom sheet keluar layar; struktur hasil pencarian tersembunyi di balik otot (kini otomatis x-ray); kamera tidak membingkai ulang saat filter wilayah berubah; efek pembingkaian ulang membatalkan fokus pilihan.


## 4. Pembaruan 14 Oktober 2026 (10.00–10.15): Demo 3D Slicer dan Organ detail
| Pemeriksaan | Hasil |
|---|---|
| 3D Slicer | 5.12.4 (rilis stabil, SHA-512 installer cocok dengan download.slicer.org); keenam langkah slide 43 V2 dijalankan otomatis (`anat/scripts/slicer_demo.py`); nama menu, preset (CT-Bone W1000/L400, CT-Lung W1400/L−500), efek Threshold/Islands/Scissors/Smoothing, Segment Statistics, Volume Rendering CT-Cardiac3 terverifikasi ada |
| Angka demo | Segmen tulang 200–3.000 HU: 603.112 voxel, 874,8 cm³ (labelmap), 826,7 cm³ (permukaan); HU ROI: udara −991, paru −887, lemak −110, otot 43, darah 56, vertebra 184 |
| Website | mode baru "Organ detail" (#organ) dan "Demo 3D Slicer" (#demo-slicer/1–6); Playwright 7/7 lulus lokal dan terhadap produksi (commit 1488b76, auto-deploy Vercel) |
| Deck 3D | 56 slide (bab J 6 slide HRA, bab K 7 slide Slicer); zip OK, 0 galat XML, 0 relasi eksternal, 6 video embedded (baru: slicer_demo.mp4 40 s); seluruh slide dirender ulang dan slide baru diinspeksi |
| Deck V2 | tidak diubah (sedang dibuka pengguna di PowerPoint); isi slide 43 cocok dengan Slicer 5.12.4 |
| Belum diuji | pemutaran video baru lewat ekspor CreateVideo (pipeline sama dengan 5 video lama yang sudah terbukti); Slicer versi lain di komputer kelas |
