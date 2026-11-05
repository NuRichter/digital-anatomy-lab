# CONTENT AUDIT — Teknik Anatomi Digital (deck sumber vs Buku Gede Bab 1–5)

Sumber: `PPT Teknik Anatomi Digital.pptx` (35 slide), `Buku Gede.docx` (Bab 1–5 inti; Bab 6–11 konteks AI), `Anatomi Berbasis Artificial Intelligence.pptx` (sesi 21 Okt 2026). Semua klaim di bawah dikutip dari sumber; tidak ada fakta baru yang ditambahkan.

## 1. Kekuatan deck sumber
1. **Selaras penuh dengan buku.** Hampir setiap slide teknis mencantumkan sumber (Bab, Gambar, Persamaan). Angka pada slide yang dicek cocok dengan buku (lihat Bagian 3).
2. **Benang merah jelas:** "pelengkap, bukan pengganti" (slide 5) → alur kerja 6 tahap & "galat terbawa" (slide 7) → tiga jalur rekonstruksi (slide 13) → pemilihan media berdasarkan tujuan (slide 31) → lima pesan kunci (slide 34).
3. **Pesan klinis yang konkret dan dapat diingat:** minta seri ≤1 mm; windowing bukan data; ambang menggeser permukaan 0,67 mm; region growing bocor; skala ×0,001 untuk glTF; anggaran frame 11,1 ms.
4. **Visual buatan penulis berbasis phantom sintetis** (bebas masalah privasi/hak cipta) dan konsisten gaya.
5. **Waktu realistis:** 120 menit terbagi 15/35/20/25/20/5; demo memakai Sample Data bawaan 3D Slicer (tanpa isu etik), dengan rencana cadangan rekaman layar.
6. **AI sudah dibatasi** pada rujukan singkat dan jembatan ke sesi 21 Oktober.

## 2. Kelemahan deck sumber
1. **Kepadatan teks & matematika di Bagian 2** (12 slide dalam 35 menit, ~3 menit/slide): marching cubes 256/15 kasus, karakteristik Euler, CIELAB ΔE — terlalu teknis untuk audiens klinisi tanpa visual 3D yang menjelaskan.
2. **Beberapa slide memuat dua konsep berbeda:** 12 (MPR + LPS/RAS di notes), 15 (region growing + morfologi), 27 (kontinum + meta-analisis), 30 (cetak teknis + bukti pendidikan + QC).
3. **Konsep penting hanya ada di speaker notes:** LPS vs RAS (slide 12), alur SfM (19), Moro 2017 (27), Lim 2016 (30), kontroversi persetujuan VHP (25).
4. **Slide tanpa baris sumber:** 4, 5, 24, 25, 33.
5. **Ilustrasi demo (slide 33) bersifat skematis**, bukan tangkapan layar Slicer asli.
6. **Pembatas bagian bagus, tetapi slide isi didominasi diagram datar 2D**; belum ada visual 3D padahal topiknya 3D.
7. **Nuansa bukti hilang:** IK 95% Zhao 2020 tidak dicantumkan; "lebih dari 86%" menjadi "86%"; SMD Ye 2020 hanya neuroanatomi (buku: 1,27/0,37/2,01); persepsi vs hasil belajar terukur (Baratz vs Sinha) tidak ditegaskan.
8. **Inkonsistensi kecil:** slide 35 menyebut Tabel L.3 seolah bagian Praktikum 2 (di buku Tabel L.3 = lembar HU Praktikum 1); kolom "Catatan" VHP pria di slide 21 ("disertai CT dan MRI") kurang spesifik dibanding Tabel 4.1 ("CT 1 mm, MRI 4 mm"); teks sumber slide 16 merujuk "catatan pembicara" alih-alih Subbab 3.3.2.
9. **Rumus HU** ditampilkan sebagai "HU = SV − 1.024" — hanya kasus umum; rumus umum (Pers. 2.5: HU = SV·m + b) tidak tampil.

## 3. Klaim yang perlu verifikasi
Status "cocok buku" = sudah dicocokkan dengan teks buku; verifikasi yang diminta adalah terhadap sumber primer/eksternal.

### 3a. Klaim faktual/regulasi/bibliografis (prioritas tinggi — verifikasi eksternal)
| # | Slide | Klaim | Bagian buku | Catatan |
|---|---|---|---|---|
| F1 | 4 | Formaldehida = karsinogen Grup 1 IARC | 1.4 (IARC, 2006) | Cocok buku. |
| F2 | 4 | RME wajib di seluruh fasyankes sejak akhir 2023 (Permenkes 24/2022) | 1.9 (batas 31 Des 2023) | Cocok buku; cek apakah ada kebijakan perpanjangan/transisi. |
| F3 | 25 | UU 17/2023 dan Permenkes 38/2022 mengatur pemanfaatan jenazah untuk pendidikan | 4.8 | Buku menyebut Permenkes 38/2022 "tentang Pelayanan Kedokteran untuk Kepentingan Umum" — **cek judul resmi & pasal** yang relevan; cek pasal bedah mayat anatomis di UU 17/2023. |
| F4 | 25 | Digitalisasi jenazah belum diatur eksplisit | 4.8 ("sepanjang penelusuran penulis") | Klaim negatif; tampilkan dengan kualifikasi "sepanjang penelusuran". |
| F5 | 5 | Yammine & Violato (2015): 3D > 2D (pengetahuan faktual & spasial) | 1.5 | Cocok buku. |
| F6 | 5 | Wainman dkk. (2018, 2020): model fisik > layar/VR/MR; stereopsis | 1.5 | Cocok buku. |
| F7 | 6 | 1543 Vesalius; 1895 Röntgen; 1971 CT klinis pertama; 1973 Lauterbur; 1994/1995 VHP; 2015 U-Net; 2020 COVID | 1.3, Gbr 1.1 | Cocok buku. |
| F8 | 21 | VHP pria 1994, 1 mm, 1.871 potongan, piksel 0,33 mm, ~15 GB | 4.3.1, Tabel 4.1 | Cocok buku; cek laman NLM. |
| F9 | 21 | VHP wanita 1995, 0,33 mm, 5.189 potongan, ~40 GB, isotropik | 4.3.1 | Cocok buku. |
| F10 | 21 | CVH 2002 & 2003; 0,5 mm (wanita); lima dataset hingga 2006 | 4.3.2 (Zhang 2006; Park 2005) | Cocok buku. |
| F11 | 21 | VKH pria 2005, 0,2 mm/0,2 mm, tanpa perfusi, CT & MRI 1 mm | 4.3.3 (Park 2005) | Cocok buku. |
| F12 | 21 (notes) | VHP bebas dari NLM, dapat dipakai di kelas | 4.3.1 ("berdomain publik") | Cek ketentuan akses/lisensi NLM terkini. |
| F13 | 24 | Baratz dkk. (2019): mahasiswa lebih antusias dengan meja diseksi virtual | 4.6 | Cocok buku. |
| F14 | 24 | Sinha dkk. (2025): 86% pengguna merasa pemahaman spasial membaik; 92% kelompok kadaver menekankan menyentuh jaringan | 4.6 | Buku: "**lebih dari** 86%". Rujukan 2025 — cek detail bibliografis. |
| F15 | 27 | Zhao dkk. (2020): 15 RCT, 816 peserta, SMD 0,53, I² 87,8%, 2 studi vs diseksi | 5.3.1 | Cocok buku; IK 95% 0,09–0,97 belum dicantumkan. |
| F16 | 27 (notes) | Moro dkk. (2017): VR/AR/tablet tidak berbeda bermakna; VR lebih banyak keluhan | 5.3.1 | Cocok buku. |
| F17 | 30 | Ye dkk. (2020): SMD 1,27 neuroanatomi | 5.8 | Cocok buku (juga 0,37 jantung, 2,01 abdomen). |
| F18 | 30 (notes) | Lim dkk. (2016): model cetak jantung > spesimen kadaver | 5.8 | Cocok buku. |
| F19 | 29 | ISO/ASTM 52900: lima kategori relevan (dari tujuh) | 5.6.1 (ISO 2021) | Cocok buku. |
| F20 | 28 | glTF memakai satuan meter → skala ×0,001 dari mm | 5.4 (Khronos) | Cocok buku. |
| F21 | 12 (notes) | DICOM = LPS; NIfTI & 3D Slicer = RAS | 2.6.1 | Cocok buku. Catatan: 3D Slicer versi baru menyimpan file dalam LPS meski koordinat internal RAS — cek sebelum menyatakan. |
| F22 | 33 | Nama Sample Data (CTChest, CTACardio), preset Volumes (CT-Bone, CT-Lung), Shift-crosshair, Data Probe, Segment Statistics | Lampiran L.2, L.4, L.5 | Cek langsung pada versi 3D Slicer yang dipakai sebelum kuliah. |
| F23 | 19 (notes) | COLMAP & Meshroom open source | 3.5.2 | Cocok buku. |
| F24 | 26/8/32/3/20/22 | Kredit & lisensi gambar (lihat Bagian 5) | — | Cek halaman sumber masing-masing. |

### 3b. Klaim numerik/perhitungan (dicek ulang aritmetika — semuanya konsisten)
| # | Slide | Klaim | Bagian buku | Hasil cek |
|---|---|---|---|---|
| N1 | 9 | 2.000.000 voxel × 0,7×0,7×1,0 mm = 980 mL | 2.1, Pers. 2.1 | Benar (0,49 mm³ × 2·10⁶ = 980.000 mm³). |
| N2 | 9 | Piksel 0,7 mm, potongan 5 mm → voxel ~7× lebih panjang | 2.1 | Benar (5/0,7 ≈ 7,1). |
| N3 | 10 | Air 0, udara −1.000 HU; 1 HU ≈ 0,1% atenuasi air | 2.4.1 | Cocok buku. |
| N4 | 10 | Jaringan lunak 0 sampai +80 HU | 2.4.1 | Cocok buku (perkiraan). |
| N5 | 10 | HU = SV − 1.024 (umumnya) | 2.4.2, Pers. 2.5 | Cocok buku untuk slope 1, intercept −1024. |
| N6 | 11 | Paru 1500/−600 → −1350..150; mediastinum 350/50 → −125..225; tulang 1800/400 → −500..1300 | 2.5.3, Tabel 2.6 | Aritmetika benar; preset bukan baku (Radiopaedia). |
| N7 | 11 (notes) | Brain window 80/40 → 0..80 HU | 2.5.2 | Benar. |
| N8 | 12 | Seri ≤1 mm untuk rekonstruksi 3D | 2.6.3 | Cocok buku (rekomendasi). |
| N9 | 14 | Otsu ≈ −460 HU; 200 HU memilih tulang + aorta | 3.2.1 (phantom sintetis) | Cocok buku; angka berlaku untuk phantom, bukan data klinis. |
| N10 | 15 | 150–400 vs 150–3.000 HU; korteks ~1.000 HU; 115 pulau | 3.2.2–3.2.3 (sintetis) | Cocok buku. |
| N11 | 16 | 256 konfigurasi, 15 kasus dasar; 10,33 vs 10,67 mm; 0,67 mm penipisan | 3.3.2, Pers. 3.6 | Benar (Lorensen & Cline 1987; interpolasi linear). |
| N12 | 17 | 10.440 → 626 segitiga (6%); V−E+F = 0 (5.220 − 15.660 + 10.440) | 3.3.1, 3.3.3 | Benar. |
| N13 | 19 | Tumpang tindih 60–80%; 3 cincin × 12–24 posisi | 3.5.3 | Cocok buku; buku tidak mencantumkan rujukan khusus untuk angka protokol ini — anggap sebagai rekomendasi praktis. |
| N14 | 21 | 2.048 × 1.216 × 3 byte ≈ 7,5 MB | 4.4.2, Pers. 4.1 | Benar (7.471.104 byte ≈ 7,47 MB desimal). |
| N15 | 23 | ΔE*ab < 20 memisahkan otot | 4.5.2 (sintetis) | Cocok buku; khusus data sintetis. |
| N16 | 28 | 90 Hz → 11,1 ms; 72 Hz → 13,9 ms | 5.3.2, Pers. 5.1 | Benar. |
| N17 | 30 | h = t·cos θ; 0,2 mm & 60° → 0,1 mm | 5.6.2, Pers. 5.2 | Benar. |
| N18 | 30 | Tengkorak 150 mm: 750 lapisan @0,2 mm; 1.500 @0,1 mm | 5.6.2 | Benar. |
| N19 | 33 | Threshold tulang 200–3.000 HU | L.4 (Praktikum 3), 3.6 | Cocok buku. |

## 4. Celah terhadap Bab 1–5 (konten penting buku yang tidak ada di deck)
**Bab 1**
- 1.2 Definisi kerja anatomi digital & **empat domain** (akuisisi, rekonstruksi, visualisasi, analisis komputasional); beda anatomi digital vs virtual anatomy vs computational anatomy.
- 1.4 / Tabel 1.1 **kekuatan diseksi** (taktil, afektif, profesionalisme, penghormatan donor) dan keterbatasannya (destruktif, satu individu, jam kurikulum berkurang).
- 1.6 / Tabel 1.2 **ekosistem perangkat** (3D Slicer, ITK-SNAP, Horos; Complete Anatomy, BioDigital, Anatomage; FDM/SLA/material jetting) dan prinsip "tujuan, bukan kecanggihan; open source cukup untuk sebagian besar tujuan".
- 1.9 **UU PDP 27/2022** (data kesehatan = data pribadi spesifik) dan **kekosongan data populasi Indonesia** sebagai peluang riset.

**Bab 2**
- 2.1 Bit depth (12 bit = 4.096 tingkat vs layar 8 bit = 256) sebagai alasan windowing; resolusi spasial vs kontras (trade-off noise).
- 2.2 Prinsip CT (Beer-Lambert, Gbr 2.2); **MRI T1/T2 (Tabel 2.1)** dan intensitas MRI tidak absolut/bias field; perbandingan modalitas (Tabel 2.2: CT, MRI, USG, radiografi).
- 2.3 **DICOM**: hierarki pasien–studi–seri–instance (Gbr 2.4), atribut penting (Tabel 2.3), jangan campur seri; **anonimisasi** (PS3.15 Annex E, burned-in annotation, defacing — Schwarz 2019); format DICOM/NIfTI/NRRD/JPEG (Tabel 2.4). Saat ini hanya muncul sebagai tugas Praktikum 2.
- 2.4.3 Faktor yang memengaruhi HU (kVp, kontras, artefak) — hanya di notes.
- 2.6 LPS vs RAS (hanya di notes), MPR oblik & **curved planar reformation**.
- 2.7 **Artefak (Tabel 2.8)**: partial volume, beam hardening, logam, gerak, noise, stair-step, bias field; kernel rekonstruksi lunak vs tajam — **celah terbesar Bab 2**.
- 2.8 **Daftar periksa 7 butir** sebelum data dipakai (kandidat slide ringkasan Bagian 2).

**Bab 3**
- 3.2 Label map vs binary mask; opening/closing; **segmentasi manual & semi-otomatis** (Fill between slices, Grow from seeds/GrowCut, ITK-SNAP; Tabel 3.1, 3.2).
- 3.2.5 Dice similarity coefficient sebagai pembanding segmentasi (cukup satu kalimat; pendalaman di sesi AI/Bab 9).
- 3.3.1 **Format mesh** (STL tanpa satuan/warna, OBJ, PLY, 3MF; Tabel 3.3).
- 3.3.3 Laplacian menyusutkan model → Taubin; **Tabel 3.4 masalah mesh**; dokumentasi parameter & bandingkan dengan mesh mentah.
- 3.4.2 Cinematic rendering (gambar tersedia di slide 32 tapi konsep tidak dijelaskan); average IP, slab MIP.
- 3.5.3–3.5.4 Koreksi skala fotogrametri (Pers. 3.12); **fotogrametri vs structured light vs CT/micro-CT (Tabel 3.6)**; etika digitalisasi spesimen donor.
- 3.6 Alur kerja praktis 3D Slicer termasuk **ekspor & dokumentasi** (demo saat ini berhenti di Show 3D/statistik).

**Bab 4**
- 4.1 Definisi kadaver digital & alur (Gbr 4.1: dua jalur akuisisi → registrasi/segmentasi/label → produk).
- 4.2 Tahapan cryosection lengkap (seleksi donor, pencitraan sebelum pemotongan, penanaman, milling).
- 4.4 Tabel 4.2 cryosection vs CT vs MRI; konsekuensi ukuran data (downsampling, crop region).
- 4.5 Registrasi rigid vs deformable, antarmodalitas; produk turunan (VOXEL-MAN, BodyParts3D).
- 4.6 Persepsi belajar ≠ hasil belajar terukur.
- 4.7 **Kadaver digital institusi**: virtopsy (Thali 2003), catatan teknis pascakematian, **5 langkah memulai**.
- 4.8 PP 18/1981 (perawatan mayat sesuai agama), **IFAA 2012**, **Tabel 4.4 kerangka 6 prinsip etika** (persetujuan, privasi, penghormatan, akses, komersialisasi, nilai budaya/agama).

**Bab 5**
- 5.2 / Tabel 5.1 perbandingan atlas 3D, VR, AR tablet, MR kacamata.
- 5.3.2 **Beban kognitif (Sweller)** & cybersickness (SSQ); praktik: latih perangkat, sesi pendek.
- 5.4 Konvensi warna atlas, LOD, **Tabel 5.2 format (glTF/GLB, OBJ, FBX, USDZ)**, WebXR.
- 5.5 Desain model: penebalan struktur tipis, konektor/magnet, label timbul — modifikasi dicatat sebagai penyimpangan.
- 5.6 Tabel 5.3 prinsip/kelebihan/keterbatasan tiap teknologi; orientasi cetak.
- 5.7 **Akurasi & kendali mutu**: galat relatif (Pers. 5.3, contoh 42,0 → 42,6 mm = 1,43%), Tabel 5.4, George 2017.
- 5.8 Ye 2020 lengkap; McMenamin 2014 (biaya terjangkau); **keselamatan** (partikel ultrahalus & VOC FDM — Azimi 2016; sensitisasi resin).
- 5.9 Baris "keterampilan prosedural" pada Tabel 5.5.

**Placeholder gambar buku yang belum terisi (peluang visual baru, perlu dibuat/diperoleh):** Gbr 2.3 (MRI T1 vs T2), 2.8 (bidang anatomi + sumbu LPS), 3.5 (Segment Editor), 3.10 (tahapan fotogrametri spesimen nyata), 4.3 (VHP: cryosection vs CT vs MRI), 4.6 (meja diseksi virtual), 5.2 (VR/AR), 5.5 (model cetak), L.2–L.4 (tangkapan layar Slicer).

## 5. Gambar sumber yang dapat dipakai ulang (kredit sesuai yang tertera di deck)
| File (deck sumber) | Isi | Kredit/lisensi tertera | Catatan pemakaian ulang |
|---|---|---|---|
| image-3-1.jpg | Vesalius, *De humani corporis fabrica* (1543) | Wellcome Collection, Public Domain Mark | Aman. |
| image-8-1.jpg | Volume rendering CT toraks | M. Häggström, CC0 1.0, via Wikimedia Commons | Aman; cantumkan kredit tetap. |
| image-20-1.jpg | VHP pria, potongan toraks | Courtesy of the U.S. National Library of Medicine | Cek syarat NLM terkini (F12). |
| image-22-2.jpg | VHP pria, potongan abdomen | Courtesy of the U.S. National Library of Medicine | Idem. |
| image-26-1.jpg | Model tengkorak cetak 3D | Foto Nevit Dilmen, CC BY-SA 3.0 (dipotong) | Wajib atribusi + sebut lisensi + tanda modifikasi; adaptasi berlisensi sama. |
| image-32-1.jpg | Cinematic rendering CT seluruh tubuh | Fellner FA (2016), CC BY 4.0 (dipotong) | Wajib atribusi + tanda modifikasi. |
| image-1-2.jpg, image-1-3.jpg | Foto dosen & presenter | Internal | Pakai ulang di judul/penutup. |
| image-1-1.png, image-35-1.png | Grafis wireframe kubah + tumpukan potongan | Tidak ada kredit (diduga grafis buatan tim) | Konfirmasi asal sebelum dipakai. |
| image-9-1/9-2, 10-1, 11-1..3, 12-1..3, 14-1, 15-1/15-2, 16-1, 17-1, 18-1, 19-1, 22-1, 23-1/23-2, 30-1/30-2 | Gambar buku (phantom/potongan sintetis, diagram) | "Sumber: Bab X, Gambar Y" (diolah/simulasi penulis) | Aman; pertahankan rujukan Bab/Gambar. |
| image-16-2.png | Grafik interpolasi marching cubes | Digambar ulang dari Pers. 3.6 | Aman; perbaiki teks sumber. |
| image-33-1.png | Ilustrasi skematis Four-Up Slicer | Tidak ada kredit (buatan tim) | Sebaiknya diganti tangkapan layar asli. |

Gambar buku (folder `word/media`) yang **belum** dipakai di deck dan relevan untuk V2: Gbr 1.1 (`0a606592…png`), 1.2 (`3b1ff08a…`), 2.2 Beer-Lambert (`d01420db…`), **2.4 hierarki DICOM (`5bd84ade…`)**, 2.6 fungsi pemetaan window (`16b091c0…`), 3.1 tiga jalur (`4e2e678b…`), **4.1 alur kadaver digital (`85337089…`)**, 5.1 kontinum (`389a8029…`), 5.3 alur cetak (`08f2eacf…`), L.1 peta praktikum (`56417023…`). Semua "diolah penulis".

## 6. Batas dengan sesi AI (21 Oktober 2026) — jangan mendominasi
Milik sesi "Anatomi Berbasis AI" (Bab 6–11, Praktikum 5): big data anatomi (5V, UK Biobank, LIDC-IDRI, MSD), alur & harmonisasi data, ground truth & variabilitas antaranotator, kebocoran data, bias & anatomi normatif, dasar ML/DL & CNN, metrik (sensitivitas, PPV, paradoks akurasi), U-Net/nnU-Net/transformer/foundation model, TotalSegmentator (104 struktur), evaluasi (DSC/HD/kalibrasi), shortcut learning, aplikasi klinis, etika AI & SaMD, UU PDP secara mendalam.

Aturan untuk V2 Teknik Anatomi Digital:
- AI muncul hanya sebagai: (1) item linimasa U-Net 2015, (2) penanda "tahap yang paling dipercepat AI" pada alur kerja (Bab 1.8: segmentasi = bottleneck), (3) satu kalimat "thresholding tidak memahami anatomi → alasan AI", (4) slide jembatan di penutup + persiapan instalasi TotalSegmentator/PyTorch.
- DSC cukup disebut satu kalimat (Bab 3.2.5) tanpa metrik lain.
- UU PDP 27/2022 cukup disebut sebagai batasan pemanfaatan citra pasien (Bab 1.9, 2.3.3); detail di Bab 11/sesi AI.
- Jangan pakai clipping nnU-Net (Bab 2.5.4) sebagai materi; cukup "windowing ≠ pra-pemrosesan".
