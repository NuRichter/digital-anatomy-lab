# CONTENT MAP — Buku Bab 1–5 → Deck V2 Premium + Deck Visual 3D

Prinsip: struktur waktu deck sumber dipertahankan (15/35/20/25/20/5 = 120 menit). V2 menambah konten yang hilang (lihat CONTENT_AUDIT §4) tanpa menambah waktu: detail matematis dipindah ke backup dan konsep spasial dipindah ke deck visual 3D yang terpisah. "Src" = nomor slide deck sumber.

## A. Peta V2 (usulan 46 slide utama + backup)

### Pembuka (16.00)
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 01 | Teknik Anatomi Digital (judul) | — | 1 | Hero 3D; pertanyaan pembuka (sayatan vs layar CT). |
| 02 | Peta sesi 120 menit | 1.10, L.1.1 (Tabel L.1) | 2 | Waktu tetap. |

### Bagian 1 — Mengapa anatomi digital (16.00–16.15, 15')
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 03 | Pembatas B1 (Vesalius) | 1.1 | 3 | |
| 04 | Tiga tekanan + konteks Indonesia | 1.1, 1.4, 1.9 | 4 | Tambah UU PDP 27/2022 sebagai batasan; kekosongan data populasi Indonesia. |
| 05 | Definisi & empat domain | 1.2 | — (baru) | Akuisisi · rekonstruksi · visualisasi · analisis; beda virtual anatomy / computational anatomy. |
| 06 | Diseksi vs digital | 1.4, Tabel 1.1 | — (baru) | Kekuatan diseksi (taktil, afektif) diakui. |
| 07 | Bukti: pelengkap, bukan pengganti | 1.5 | 5 | Yammine & Violato 2015; Wainman 2018/2020. |
| 08 | Lima abad, satu prinsip (linimasa) | 1.3, Gbr 1.1 | 6 | |
| 09 | Alur kerja 6 tahap + "galat terbawa" | 1.7, 1.8, Gbr 1.2 | 7 | Ekosistem perangkat (Tabel 1.2) sebagai lapisan label per tahap; penanda AI kecil. |

### Bagian 2 — Dari citra medis ke model 3D (16.15–16.50, 35')
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 10 | Pembatas B2 | — | 8 | |
| 11 | Citra = matriks angka (voxel, volume, bit depth) | 2.1, Pers. 2.1 | 9 | + 12 bit vs 8 bit. |
| 12 | CT vs MRI vs USG vs radiografi | 2.2, Tabel 2.1–2.2 | — (baru) | MRI tidak absolut → segmentasi lebih sulit. |
| 13 | DICOM: hierarki, metadata, anonimisasi | 2.3, Gbr 2.4, Tabel 2.3–2.4 | — (baru) | Satu seri saja; burned-in; defacing; NIfTI/NRRD vs JPEG. |
| 14 | Hounsfield unit | 2.4, Pers. 2.4–2.5, Tabel 2.5 | 10 | Rumus umum SV·slope+intercept; faktor kVp/kontras. |
| 15 | Windowing | 2.5, Tabel 2.6, Gbr 2.7 | 11 | |
| 16 | MPR & konvensi radiologis | 2.6.1–2.6.2 | 12 | + CPR/oblik. |
| 17 | Potongan tipis & LPS vs RAS | 2.6.1, 2.6.3, Tabel 2.7 | 12 (notes) | Diangkat dari speaker notes. |
| 18 | Artefak yang ikut tersegmentasi | 2.7, Tabel 2.8 | — (baru) | Partial volume, beam hardening, logam, gerak, noise, stair-step; kernel. |
| 19 | Tiga jalur rekonstruksi | 3.1, Gbr 3.1 | 13 | Peta Bagian 2b. |
| 20 | Thresholding | 3.2.1, Gbr 3.2 | 14 | |
| 21 | Region growing (kebocoran) | 3.2.2, Gbr 3.3 | 15 | |
| 22 | Pembersihan mask + manual/semi-otomatis | 3.2.3–3.2.5, Tabel 3.1–3.2, Gbr 3.4 | 15 | DSC 1 kalimat. |
| 23 | Marching cubes: ambang menggeser permukaan | 3.3.2, Pers. 3.6 | 16 | Pesan 0,67 mm; detail 256/15 → backup. |
| 24 | Mesh: smoothing, decimation, perbaikan, format | 3.3.1, 3.3.3, Tabel 3.3–3.4 | 17 | Laplacian menyusut/Taubin; STL tanpa satuan. |
| 25 | Rendering tanpa segmentasi | 3.4, Tabel 3.5 | 18 | + cinematic rendering. |
| 26 | Fotogrametri & 3D scanning | 3.5, Tabel 3.6, Pers. 3.12 | 19 | Protokol + skala + etika spesimen. |
| 27 | Daftar periksa sebelum memakai data | 2.8, 3.6 (dokumentasi) | — (baru) | Ringkasan Bagian 2. |

### Bagian 3 — Anatomi kadaver digital (16.50–17.10, 20')
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 28 | Pembatas B3 (VHP) | — | 20 | |
| 29 | Konsep & alur kadaver digital | 4.1, Gbr 4.1 | — (baru) | |
| 30 | Cryosection serial | 4.2, Gbr 4.2, 4.4.1, Tabel 4.2 | 22 | |
| 31 | VHP, CVH, VKH | 4.3, Tabel 4.1, 4.4.2 | 21 | Visual interval potongan; ukuran data. |
| 32 | Mengolah data kadaver digital | 4.5 | 23 | Registrasi, warna CIELAB, FMA; produk turunan. ΔE → backup. |
| 33 | Tiga sumber kadaver digital | 4.6, 4.7, Tabel 4.3 | 24 | Persepsi ≠ hasil terukur; 5 langkah institusi. |
| 34 | Etika & regulasi | 4.8, Tabel 4.4 | 25 | UU 17/2023, Permenkes 38/2022, PP 18/1981, IFAA; 6 prinsip. |

### Bagian 4 — Virtual anatomy & 3D printing (17.10–17.35, 25')
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 35 | Pembatas B4 | — | 26 | |
| 36 | Kontinum realitas–virtualitas & media | 5.1–5.2, Tabel 5.1 | 27 | |
| 37 | Bukti VR & faktor manusia | 5.3 | 27 | Zhao 2020 (+IK 95%), Moro 2017; beban kognitif, cybersickness. |
| 38 | Menyiapkan model untuk VR/AR | 5.4, Pers. 5.1, Tabel 5.2 | 28 | Frame budget, LOD, warna, glTF ×0,001, WebXR. |
| 39 | Dari citra ke model cetak + teknologi | 5.5, 5.6.1, Tabel 5.3 | 29 | |
| 40 | Tebal lapisan & orientasi | 5.6.2, Pers. 5.2, Gbr 5.4 | 30 | |
| 41 | Akurasi, kendali mutu, keselamatan | 5.7, Pers. 5.3, Tabel 5.4, 5.8 (keselamatan) | 30 | Contoh 1,43%. |
| 42 | Bukti model cetak & pilih media | 5.8, 5.9, Tabel 5.5 | 30, 31 | Ye 2020 (1,27/0,37/2,01), Lim 2016; tabel tujuan→media lengkap. |

### Bagian 5 — Demo 3D Slicer (17.35–17.55, 20')
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 43 | Pembatas B5 (cinematic rendering) | 3.4.2 | 32 | |
| 44 | Demo: dari CT ke model tulang | 3.6, L.2, L.4, L.5 | 33 | Tangkapan layar asli; tambah ekspor STL & catat parameter. |

### Penutup (17.55–18.00, 5')
| V2 | Judul usulan | Bagian buku | Src | Catatan |
|---|---|---|---|---|
| 45 | Lima pesan kunci | Rangkuman Bab 1–5 | 34 | |
| 46 | Diskusi, tugas, jembatan ke sesi AI | Latihan Bab 1–5, L.3, L.1.3, 1.8 | 35 | Tugas: Praktikum 2 + Tabel L.3 (Praktikum 1); pasang TotalSegmentator/PyTorch. |

### Backup (tidak dipresentasikan kecuali ditanya)
| B | Isi | Bagian buku |
|---|---|---|
| B1 | Beer-Lambert & rekonstruksi CT | 2.2.1, Pers. 2.2–2.3, Gbr 2.2 |
| B2 | Rumus pemetaan window G | 2.5.2, Pers. 2.6–2.8, Gbr 2.6 |
| B3 | Posisi piksel dari Image Position/Orientation | 2.6.1, Pers. 2.9 |
| B4 | Otsu (variansi antarkelas) | 3.2.1, Pers. 3.1 |
| B5 | Marching cubes 256 konfigurasi/15 kasus; karakteristik Euler | 3.3.1–3.3.2, Pers. 3.5 |
| B6 | Volume rendering compositing | 3.4.2, Pers. 3.8 |
| B7 | Kamera pinhole & bundle adjustment | 3.5.1–3.5.2, Pers. 3.10–3.11 |
| B8 | Registrasi rigid & CIELAB ΔE | 4.5, Pers. 4.2–4.4 |
| B9 | Soal latihan pilihan Bab 1–5 (untuk diskusi) | Latihan dan Diskusi Bab 1–5 |
| B10 | Screenshot cadangan tiap langkah demo | L.2, L.4, L.5 |

Cakupan: setiap subbab Bab 1–5 terpetakan ke setidaknya satu slide V2 atau backup, kecuali 1.10 (peta isi buku → cukup di slide 02) dan 2.5.4 bagian clipping nnU-Net (sengaja diserahkan ke sesi AI).

## B. Konsep yang paling baik ditampilkan sebagai visual 3D (deck visual-only terpisah)
Urutan mengikuti alur kuliah; tiap item = satu "adegan" 3D tanpa teks panjang (label singkat saja).

| # | Adegan 3D | Konsep | Bagian buku | Pasangan slide V2 |
|---|---|---|---|---|
| 3D-01 | Tumpukan potongan aksial yang menyatu menjadi volume voxel; satu voxel di-zoom | Piksel → voxel → volume | 2.1, Gbr 2.1 | 11 |
| 3D-02 | Voxel isotropik 0,7 mm vs anisotropik 0,7×0,7×5 mm berdampingan | Anisotropi | 2.1, 2.6.3 | 11, 17 |
| 3D-03 | Skala HU sebagai kolom vertikal dengan jaringan melayang pada nilainya (udara → logam) | Hounsfield unit | 2.4, Tabel 2.5 | 14 |
| 3D-04 | Hierarki DICOM sebagai pohon bertingkat (pasien–studi–seri–instance) | DICOM | 2.3.1, Gbr 2.4 | 13 |
| 3D-05 | Tubuh/phantom dengan tiga bidang transparan (aksial biru, koronal oranye, sagital hijau) dan crosshair | MPR | 2.6.2, Gbr 2.9 (spesifikasi warna dari placeholder Gbr 2.8) | 16 |
| 3D-06 | Sumbu LPS vs RAS dari satu titik asal; model jantung yang "terbalik" saat konversi salah | Sistem koordinat | 2.6.1, Tabel 2.7 | 17 |
| 3D-07 | Struktur oblik/bola direkonstruksi dari potongan 1 mm vs 5 mm (anak tangga, bola terpancung) | Stair-step | 2.6.3, Gbr 2.10 | 17, 18 |
| 3D-08 | Tiga cabang dari satu volume CT: mesh (A), volume rendering (B), model bertekstur dari foto (C) | Tiga jalur rekonstruksi | 3.1, Gbr 3.1 | 19 |
| 3D-09 | Ambang 200 HU menyala pada tulang **dan** aorta berkontras sekaligus | Thresholding buta lokasi | 3.2.1, Gbr 3.2 | 20 |
| 3D-10 | Region growing tumbuh dari seed di aorta; interval sempit berhenti, interval lebar merembes ke vertebra | Kebocoran | 3.2.2, Gbr 3.3 | 21 |
| 3D-11 | Mask berpulau → komponen terbesar → hole filling | Operasi morfologi | 3.2.3, Gbr 3.4 | 22 |
| 3D-12 | Satu kubus marching cubes: 8 sudut, satu sudut di dalam, segitiga terbentuk; titik bergeser saat ambang 300 → 500 HU | Interpolasi & ukuran model | 3.3.2, Gbr 3.6, Pers. 3.6 | 23 |
| 3D-13 | Vertebra: mesh mentah bertingkat → smoothing → decimation (10.440 → 626 segitiga), wireframe terlihat | Pascapemrosesan mesh | 3.3.3, Gbr 3.7 | 24 |
| 3D-14 | Vertebra dengan foramen vs korpus tanpa arkus (genus 1 vs 0) | Topologi/Euler (backup) | 3.3.1, Pers. 3.5 | B5 |
| 3D-15 | Sinar menembus volume; sampel diwarnai transfer function; versi MIP mengambil nilai maksimum | Volume rendering vs MIP/MinIP | 3.4.2–3.4.3, Gbr 3.8 | 25 |
| 3D-16 | Spesimen di meja putar dengan tiga cincin kamera (0°, 30°, 60°; 12–24 posisi), point cloud → mesh bertekstur, penggaris skala | Fotogrametri/SfM | 3.5, Gbr 3.9 | 26 |
| 3D-17 | Blok beku jenazah: lapisan Δz digiling → permukaan dipotret → blok naik (siklus beranimasi) | Cryosection serial | 4.2, Gbr 4.2 | 30 |
| 3D-18 | Tiga tumpukan potongan berjarak 1 mm (VHP pria), 0,33 mm (VHP wanita), 0,2 mm (VKH) | Perbandingan dataset | 4.3, Tabel 4.1 | 31 |
| 3D-19 | Tumpukan potongan bergeser acak → terkoreksi (reformat koronal bergerigi → kontinu) | Registrasi antarpotongan | 4.5.1, Gbr 4.4 | 32 |
| 3D-20 | Alur kadaver digital: donor → CT/MRI + cryosection → model berlabel → meja diseksi/VR/cetak | Kadaver digital | 4.1, Gbr 4.1 | 29 |
| 3D-21 | Garis kontinum dengan adegan: spesimen nyata → AR label pada spesimen → augmented virtuality → VR penuh | Kontinum Milgram | 5.1, Gbr 5.1 | 36 |
| 3D-22 | Model jantung berwarna konvensi atlas (arteri merah, vena biru, saraf kuning, tulang gading) dengan LOD tinggi→rendah | Persiapan model VR | 5.4 | 38 |
| 3D-23 | Bola/kaput femur dicetak dengan lapisan 1,0 vs 0,25 mm; cusp height terlihat paling besar di permukaan hampir datar | Efek anak tangga & orientasi | 5.6.2, Gbr 5.4, Pers. 5.2 | 40 |
| 3D-24 | Lima teknologi cetak sebagai mini-mesin (ekstrusi filamen, vat resin, powder bed, jetting multibahan, binder jetting) | ISO/ASTM 52900 | 5.6.1, Tabel 5.3 | 39 |
| 3D-25 | Dua penanda pada model CT vs model cetak dengan jarak 42,0 vs 42,6 mm | Kendali mutu | 5.7, Pers. 5.3 | 41 |

Catatan produksi untuk deck 3D: gunakan geometri sintetis/phantom (konsisten dengan gambar buku) atau data bebas (Sample Data 3D Slicer, VHP dengan kredit NLM); hindari data pasien. Label dalam Bahasa Indonesia, istilah teknis bahasa Inggris dimiringkan sesuai gaya buku.
