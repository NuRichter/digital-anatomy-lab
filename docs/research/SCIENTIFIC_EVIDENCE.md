# Bukti Ilmiah untuk Kuliah "Teknik Anatomi Digital"

Disusun oleh Agen 2 (Peneliti Bukti Ilmiah). Tanggal akses semua sumber daring: **14 Oktober 2026**.
Prinsip: hanya DOI/URL yang benar-benar ditemukan dicantumkan. Jika DOI tidak ditemukan, hal itu dinyatakan secara eksplisit.

Keterangan kolom: **Klaim yang didukung** = klaim di deck/buku yang ditopang sumber; **Batas bukti** = apa yang *tidak* boleh disimpulkan dari sumber tersebut.

---

## 1. Sejarah dan tonggak (CT, MRI, sinar-X, Vesalius)

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| U.S. National Library of Medicine. *Historical Anatomies on the Web: Andreas Vesalius*. | t.t. | https://www.nlm.nih.gov/exhibition/historicalanatomies/vesalius_bio.html | *De humani corporis fabrica* (NLM menulis judul *De corporis humani fabrica libri septem*) terbit di Basel, dicetak Johannes Oporinus, 1543. | Sumber pameran sejarah, bukan kajian primer. |
| Linda Hall Library. *Scientist of the Day: Wilhelm Röntgen*. | t.t. | https://www.lindahall.org/about/news/scientist-of-the-day/wilhelm-rontgen | Röntgen mengamati sinar-X pada 8 November 1895; laporan "Über eine neue Art von Strahlen" dikirim 28 Desember 1895. | Sumber sekunder; tanggal foto tangan istri Röntgen berbeda antarsumber. |
| AuntMinnie Europe. *50 years of CT scanning approaches*; St George's NHS. *St George's celebrates 40 years of CT scanning*. | 2021; 2011 | https://www.auntminnieeurope.com/subspecialties/musculoskeletal-radiology/body-imaging/article/15654937/50-years-of-ct-scanning-approaches ; https://www.stgeorges.nhs.uk/newsitem/st-georges-celebrates-40-years-of-ct-scanning/ | Pemindaian CT klinis pertama: 1 Oktober 1971, Atkinson Morley Hospital (Wimbledon), Hounsfield bersama neuroradiolog James Ambrose; pasien dengan tumor/kista otak. Hasil dipresentasikan April 1972. | Sumber berita/institusi; publikasi ilmiah formal Hounsfield terbit 1973 (Br J Radiol), DOI tidak diperiksa. |
| Lauterbur, P. C. Image formation by induced local interactions: Examples employing nuclear magnetic resonance. *Nature*, 242, 190–191. | 1973 | https://doi.org/10.1038/242190a0 | Prinsip pencitraan MR (gradien medan) dipublikasikan 1973. | Ini prinsip, bukan MRI klinis (MRI klinis baru akhir 1970-an/awal 1980-an). |
| Ronneberger, O., Fischer, P., & Brox, T. U-Net: Convolutional networks for biomedical image segmentation. MICCAI 2015, LNCS 9351, 234–241. | 2015 | https://doi.org/10.1007/978-3-319-24574-4_28 ; https://arxiv.org/abs/1505.04597 | U-Net diperkenalkan 2015 untuk segmentasi citra biomedis (jalur kontraksi + ekspansi simetris). | Evaluasi asli pada citra mikroskop elektron/sel 2D, bukan CT 3D; perluasan 3D = Çiçek dkk. 2016. |

## 2. CT/MRI, DICOM, dan sistem koordinat

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| 3D Slicer Documentation. *Coordinate systems*. | 2026 (versi "latest") | https://slicer.readthedocs.io/en/latest/user_guide/coordinate_systems.html | DICOM dan sebagian besar perangkat lunak medis memakai LPS; Slicer menyimpan koordinat secara internal dalam RAS, dan saat membaca/menulis berkas mengasumsikan LPS kecuali berkas menyatakan RAS (membalik tanda dua sumbu pertama). | Kesalahan konversi LPS↔RAS (membalik X dan Y) menghasilkan rotasi 180° di sekitar sumbu S (kiri–kanan **dan** depan–belakang tertukar), bukan sekadar cermin kiri–kanan. |
| 3D Slicer (GitHub). `Modules/Scripted/SampleData/SampleData.py`. | 2026 | https://github.com/Slicer/Slicer/blob/main/Modules/Scripted/SampleData/SampleData.py | Dataset bawaan "CTChest" (CT-chest.nrrd) dan "CTACardio" (CTA-cardio.nrrd) tersedia di Sample Data. | — |
| 3D Slicer Documentation. *User interface* (pintasan tetikus). | 2026 | https://slicer.readthedocs.io/en/latest/user_guide/user_interface.html | Shift + gerak tetikus memindahkan crosshair di semua view. | — |
| 3D Slicer (GitHub). `Modules/Loadable/Volumes/Resources/VolumeDisplayPresets.json`. | 2026 | https://github.com/Slicer/Slicer/blob/main/Modules/Loadable/Volumes/Resources/VolumeDisplayPresets.json | Preset Volumes: **CT-Bone W1000/L400**, **CT-Lung W1400/L−500**, CT-Abdomen W350/L40, CT-Brain W100/L50, CT-Air W1000/L−426. | Nilai preset Slicer berbeda dari preset Radiopaedia yang dipakai di slide 11 (lihat Bagian 4). |

## 3. Voxel dan Hounsfield unit

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| Radiopaedia. *Hounsfield unit*. | diakses 2026 | https://radiopaedia.org/articles/hounsfield-unit | Air = 0 HU dan udara = −1000 HU (skala dikalibrasi pada air dan udara); sebagian besar jaringan antara −100 dan +100 HU. | Sumber edukasi sekunder (peer-reviewed secara editorial). |
| ICRPaedia. *Hounsfield unit*. | diakses 2026 | https://icrpaedia.org/Houns%EF%AC%81eld_unit | HU = 1000 × (μ − μ_water)/μ_water (μ_water = koefisien atenuasi air/H₂O); sehingga 1 HU ≈ 0,1% koefisien atenuasi air. | Nilai HU bergantung kVp, filter rekonstruksi, kontras, dan kalibrasi; ambang literatur perlu diverifikasi pada data sendiri. |
| Wikipedia. *Hounsfield scale* (pendukung). | diakses 2026 | https://en.wikipedia.org/wiki/Hounsfield_scale | Perubahan 1 HU ≈ 0,1% koefisien atenuasi air. | Sumber tersier; gunakan hanya sebagai pendukung. |
| Konversi stored value → HU | — | DICOM PS3.3 (Rescale Slope 0028,1053; Rescale Intercept 0028,1052) — URL bagian standar tidak dibuka dalam sesi ini | HU = SV × slope + intercept; intercept −1024 dengan slope 1 lazim, sehingga "umumnya HU = SV − 1024". | Tidak universal; selalu baca tag dari header. |

## 4. Windowing dan MPR

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| Radiopaedia. *Windowing (CT)*. | diakses 2026 | https://radiopaedia.org/articles/windowing-ct | Paru W1500/L−600; mediastinum W350/L50; tulang (spine) W1800/L400; otak W80/L40; batas tampil = L ± W/2. Nilai "bervariasi antarinstitusi dan vendor". | Preset bukan standar baku; Slicer memakai CT-Bone W1000/L400 dan CT-Lung W1400/L−500; sumber lain memakai tulang W2000–2500/L300–500. |

Perhitungan slide 11 sudah diperiksa: paru −1350…150; mediastinum −125…225; tulang −500…1300; otak 0…80 HU — semuanya benar.

## 5. Segmentasi dan marching cubes

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| Lorensen, W. E., & Cline, H. E. Marching cubes: A high resolution 3D surface construction algorithm. *Computer Graphics (SIGGRAPH '87)*, 21(4), 163–169. | 1987 | https://doi.org/10.1145/37402.37422 ; salinan PDF: https://courses.cs.duke.edu/cps124/fall01/resources/p163-lorensen.pdf | 8 sudut → 2⁸ = 256 konfigurasi; direduksi dengan simetri komplementer dan rotasi. Teks asli: "reduce the problem from 256 cases to **14 patterns**", dengan pola bernomor 0–14 (pola 0 = tanpa permukaan) sehingga Gambar 3 memuat 15 kubus. Interpolasi linear posisi permukaan sepanjang tepi kubus. | "15 kasus dasar" benar jika pola kosong (0) dihitung; tabel asli memiliki kasus ambigu yang dapat menimbulkan lubang (diperbaiki varian MC selanjutnya). |
| Ronneberger dkk. (2015) | lihat Bagian 1 | | Fondasi segmentasi deep learning. | — |
| Wasserthal dkk. TotalSegmentator. *Radiology: Artificial Intelligence*, 5(5), e230024. | 2023 | (dari daftar pustaka buku; DOI tidak diperiksa dalam sesi ini) | Segmentasi otomatis 104 struktur CT. | Belum diverifikasi daring pada sesi ini. |

Perhitungan slide 16 diperiksa: 100 HU di 10 mm dan 700 HU di 11 mm → ambang 300 HU di 10,333 mm, ambang 500 HU di 10,667 mm; selisih 0,33 mm per permukaan, 0,67 mm untuk korteks dua sisi. Benar.
Slide 17: 626/10.440 = 6,0%; karakteristik Euler 0 ⇒ genus 1 (satu lubang) untuk permukaan tertutup terorientasi. Benar.

## 6. Volume rendering, MIP, MinIP

Klaim pada slide 18 bersifat konseptual (transfer function memetakan nilai ke warna/opasitas; MIP kehilangan informasi kedalaman; MinIP menonjolkan saluran napas). Konsisten dengan literatur standar; tidak ada angka yang perlu diverifikasi. Sumber primer khusus tidak dicari dalam sesi ini (Levoy 1988, *IEEE CG&A* — DOI tidak diperiksa).

## 7. Kadaver digital (Visible Human, CVH, VKH) dan cryosection

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| U.S. National Library of Medicine. *The Visible Human Project®*. | diakses 2026 | https://www.nlm.nih.gov/research/visible/visible_human.html | Pria (rilis **1994**): CT aksial 1 mm (512×512, 12 bit), MRI 4 mm (256×256); potongan anatomi 2048×1216 piksel, 0,33 mm/piksel, 24 bit, ≈7,5 MB per citra, interval 1 mm, **1.871** potongan; total ≈**15 GB**. Wanita (rilis **1995**): interval 0,33 mm (= ukuran piksel → voxel kubik), **5.189** citra, total ≈**40 GB**. | Data satu individu; kondisi pascakematian. |
| Spitzer, V., Ackerman, M. J., Scherzinger, A. L., & Whitlock, D. The Visible Human Male: A technical report. *JAMIA*, 3(2), 118–130. | 1996 | https://doi.org/10.1136/jamia.1996.96236280 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC116294 | Metodologi cryosection dan dataset ≈15 GB. | — |
| Park, J. S., Chung, M. S., Hwang, S. B., Lee, Y. S., Har, D.-H., & Park, H. S. Visible Korean Human: Improved serially sectioned images of the entire body. *IEEE Trans Med Imaging*, 24(3), 352–360. | 2005 | https://doi.org/10.1109/TMI.2004.842454 | Kadaver pria Korea tanpa perfusi; CT dan MRI interval 1,0 mm; potongan 0,2 mm, ukuran piksel 0,2 mm. | Jumlah potongan tidak diverifikasi. |
| Zhang, S. X., Heng, P. A., & Liu, Z. J. Chinese visible human project. *Clinical Anatomy*, 19(3), 204–215. | 2006 | https://doi.org/10.1002/ca.20273 | CVH pria dibuat Oktober 2002, wanita Februari 2003; "hingga kini lima dataset CVH". | Abstrak tidak menyebut interval potongan. |
| Zhang, S. X., dkk. The Chinese Visible Human (CVH) datasets incorporate technical and imaging advances on earlier digital humans. *J Anat*, 204(3), 165–173. | 2004 | https://doi.org/10.1111/j.0021-8782.2004.00274.x | Citra 3072×2048 piksel (resolusi ≈0,17 mm); data pria 90,65 GB, wanita 131,04 GB; milling pada −25 °C. | — |
| Zhang, S. X., dkk. Creation of the Chinese visible human data set. *Anat Rec B New Anat*, 275(1), 190–195. | 2003 | https://doi.org/10.1002/ar.b.10035 | Tanggal pembuatan dataset pria/wanita. | — |
| (Pendukung) CvhSlicer 2.0, arXiv:2503.15507. | 2025 | https://arxiv.org/pdf/2503.15507 | Dataset CVH wanita: 3.640 potongan, 0,25 mm di kepala–leher dan 0,5 mm di bagian tubuh lain. | Sumber sekunder (preprint); konfirmasi ke Zhang dkk. 2004. |
| American Association for Anatomy. *Visible Human Project* (bahan etika). | t.t. | https://www.anatomy.org/common/Uploaded%20files/Education%20Resources/Ethics/Visible%20Human%20Project%20FINAL.pdf | Kontroversi persetujuan donor VHP pria (terpidana mati yang dieksekusi 1993). | Sumber edukasi etika; rincian biografis bervariasi antarsumber. |

Catatan perhitungan slide 21: 2048 × 1216 × 3 byte = 7.471.104 byte ≈ 7,5 MB (≈7,1 MiB). Benar.

## 8. Meja diseksi virtual

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| Baratz, G., dkk. Evaluating the Anatomage Table compared to cadaveric dissection as a learning modality for gross anatomy. *Medical Science Educator*, 29(2), 499–506. | 2019 | https://doi.org/10.1007/s40670-019-00719-z ; https://pmc.ncbi.nlm.nih.gov/articles/PMC8368845 | Desain crossover (pelvis/perineum dan muskuloskeletal); kelompok Anatomage lebih antusias (3,25 vs 2,31) dan merasa belajar lebih banyak (3,68 vs 2,99); nilai ujian secara umum setara. | Hanya **16 mahasiswa** sukarelawan; efek kebaruan. |
| Sinha, U., Ratnesh, R., Patel, A. K., Sontakke, V., Kumar, S., & Kumar, M. Bridging technology and tradition: Student outcomes with virtual dissection table versus cadaveric dissection in neuroanatomy learning. *J Pharm Bioallied Sci*, 17(Suppl 3), S2760–S2763. | 2025 | https://doi.org/10.4103/jpbs.jpbs_1028_25 ; PMCID PMC12563280 | 2 × 50 mahasiswa; kedua kelompok meningkat bermakna (P < 0,001); post-test kelompok meja virtual sedikit lebih tinggi (74,5 vs 71,3; P = 0,021). Abstrak: "lebih dari 86%" pengguna meja virtual merasa pemahaman spasial membaik (di bagian hasil: 86% vs 62% kelompok kadaver); "92%" kelompok kadaver menekankan pentingnya menyentuh jaringan (angka ini **hanya ada di abstrak**). | Jurnal suplemen, desain non-acak yang dilaporkan singkat; angka 92% tidak dapat ditelusuri di badan artikel. |

## 9. Virtual reality / augmented reality

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| Zhao, J., Xu, X., Jiang, H., & Ding, Y. The effectiveness of virtual reality-based technology on anatomy teaching: A meta-analysis of randomized controlled studies. *BMC Medical Education*, 20, 127. | 2020 | https://doi.org/10.1186/s12909-020-1994-z ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7183109 | 15 RCT, 816 peserta; SMD 0,53 (IK 95% 0,09–0,97); I² = 87,8%. Dua studi (Anthony 2011; Hampton 2010) memakai pembanding "diseksi dan buku teks". Subkelompok: vs metode tradisional SMD 0,81 (0,15–1,47); vs metode digital lain SMD 0,35 (−0,25–0,95, tidak bermakna). | Heterogenitas sangat tinggi; Hampton 2010 sebenarnya intervensi "model 3D interaktif" bukan VR imersif; tidak ada studi yang membandingkan VR dengan diseksi saja. |
| Moro, C., Štromberga, Z., Raikos, A., & Stirling, A. The effectiveness of virtual and augmented reality in health sciences and medical anatomy. *Anatomical Sciences Education*, 10(6), 549–559. | 2017 | https://research.bond.edu.au/en/publications/the-effectiveness-of-virtual-and-augmented-reality-in-health-scie/ (DOI tidak terkonfirmasi dalam sesi ini) | RCT n = 59 (anatomi tengkorak): VR, AR, dan tablet tidak berbeda bermakna; VR lebih sering menimbulkan sakit kepala (25%), pusing (40%), penglihatan kabur (35%). | Satu topik, sampel kecil. |
| Wainman, B., Pukas, G., Wolak, L., Mohanraj, S., Lamb, J., & Norman, G. R. The critical role of stereopsis in virtual and mixed reality learning environments. *Anatomical Sciences Education*, 13(3), 401–412. | 2020 (online 2019) | https://doi.org/10.1002/ase.1928 | Dibanding key views di monitor: model fisik +70%, VR +25%, MR +2,5% (tidak bermakna). Menutup satu mata menurunkan skor 15% (fisik), 60% (VR), 2,5% (MR). Model fisik > VR dan MR; stereopsis kritis. | Mahasiswa sarjana, materi pelvis, perangkat 2017–2019. |
| García-Robles, P., dkk. Immersive virtual reality and augmented reality in anatomy education: A systematic review and meta-analysis. *Anatomical Sciences Education*, 17(3), 514–528. | 2024 | https://doi.org/10.1002/ase.2397 | 27 studi, 2.199 mahasiswa; XR > metode tradisional (SMD 0,40; IK 95% 0,22–0,60); sebagai suplemen SMD 0,52 (0,40–0,63). | Efek moderat; heterogenitas desain. |
| Meta for Developers. *OS missed frames*. | diakses 2026 | https://developers.meta.com/horizon/documentation/unity/os-missed-frames/ | Anggaran per frame: 13,9 ms (72 Hz), 11,1 ms (90 Hz), 8,3 ms (120 Hz); frame terlewat membuat aplikasi efektif turun ke setengah laju; minimum 72 FPS untuk aplikasi Quest. | Hubungan kuantitatif frame drop ↔ cybersickness tidak dinyatakan di dokumen ini. |
| Khronos Group. *glTF 2.0 Specification*. | diakses 2026 | https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html | "The units for all linear distances are meters" → faktor skala ×0,001 dari mm; sistem koordinat tangan kanan, +Y ke atas. | — |

## 10. 3D printing

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| ISO/ASTM 52900:2021. *Additive manufacturing — General principles — Fundamentals and vocabulary*. | 2021 (edisi 1: 2015) | Pratinjau: https://webstore.ansi.org/preview-pages/ISO/preview_ISO+ASTM+52900-2021.pdf ; ringkasan: https://lboro.ac.uk/research/amrg/about/the7categoriesofadditivemanufacturing/ | Tujuh kategori proses: binder jetting, directed energy deposition, material extrusion, material jetting, powder bed fusion, sheet lamination, vat photopolymerization. Lima di slide 29 merupakan subset yang benar. | Teks standar berbayar; tidak dibaca utuh. |
| Ye, Z., Dun, A., Jiang, H., Nie, C., Zhao, S., Wang, T., & Zhai, J. The role of 3D printed models in the teaching of human anatomy: A systematic review and meta-analysis. *BMC Medical Education*, 20, 335. | 2020 | https://doi.org/10.1186/s12909-020-02242-x ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7523371 | SMD vs konvensional: neuroanatomi 1,27; jantung 0,37; abdomen 2,01; vs kadaver 0,69; vs 2D 1,05; waktu menjawab SMD −0,61. | Studi kecil, banyak dari Tiongkok; heterogenitas. |
| Lim, K. H. A., Loo, Z. Y., Goldie, S. J., Adams, J. W., & McMenamin, P. G. Use of 3D printed models in medical education: A randomized control trial comparing 3D prints versus cadaveric materials for learning external cardiac anatomy. *Anatomical Sciences Education*, 9(3), 213–221. | 2016 | https://doi.org/10.1002/ase.1573 | RCT n = 52: post-test kelompok cetak 3D 60,83% vs kadaver 44,81% vs kombinasi 44,62% (P = 0,010). | Hanya anatomi eksternal jantung; sampel kecil; anehnya kelompok kombinasi tidak lebih baik. |
| Ye, Z., dkk. Meta-analyzing the efficacy of 3D printed models in anatomy education. *Frontiers in Bioengineering and Biotechnology*, 11, 1117555. | 2023 | https://doi.org/10.3389/fbioe.2023.1117555 | Pembaruan meta-analisis model cetak 3D; tidak ada perbedaan bermakna vs pencitraan 3D visual dan pada subkelompok residen. | Abstrak tidak menyediakan SMD gabungan. |
| George, E., Liacouras, P., Rybicki, F. J., & Mitsouras, D. Measuring and establishing the accuracy and reproducibility of 3D printed medical models. *RadioGraphics*, 37(5), 1424–1450. | 2017 | https://doi.org/10.1148/rg.2017160165 | Galat model cetak berasal dari tahap pencitraan, segmentasi, pascapemrosesan, dan pencetakan; perlu standar acuan dan validasi (mendukung "ukur galat terhadap CT acuan" dan "galat terbawa antar-tahap"). | Ulasan naratif. |
| Msallem, B., dkk. Evaluation of the dimensional accuracy of 3D-printed anatomical mandibular models using FFF, SLA, SLS, MJ, and BJ printing technology. *Journal of Clinical Medicine*, 9(3), 817. | 2020 | https://pmc.ncbi.nlm.nih.gov/articles/PMC7141211/ (DOI tidak diverifikasi) | Trueness RMS: SLS 0,11 mm, BJ 0,14 mm, FFF 0,16 mm; semua teknologi dapat diterima secara klinis. | Satu jenis model (mandibula). |
| Msallem, B., dkk. Dimensional accuracy in 3D printed medical models: A follow-up study on SLA and SLS technology. *Journal of Clinical Medicine*, 13(19), 5848. | 2024 | https://doi.org/10.3390/jcm13195848 | Trueness median SLA 0,148 mm vs SLS 0,144 mm (tidak berbeda); presisi SLS lebih baik. | — |
| Livesu, M., dkk. From 3D models to 3D prints: An overview of the processing pipeline. *Computer Graphics Forum* (EG STAR 2017). | 2017 | https://arxiv.org/abs/1705.03811 (DOI terkait 10.1111/cgf.13147) | Kerangka "cusp height" (Dolenc & Mäkelä, 1994) untuk efek anak tangga; h = t·cos θ (θ = sudut antara normal permukaan dan arah build). | Rumus tidak dikutip langsung dari sumber primer dalam sesi ini; DOI Dolenc & Mäkelä tidak diperiksa. |

Perhitungan slide 30: 0,2 × cos 60° = 0,1 mm; 150/0,2 = 750 lapisan; 150/0,1 = 1.500 lapisan. Benar.

## 11. Efektivitas pendidikan anatomi 3D/digital (ringkasan)

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| Yammine, K., & Violato, C. A meta-analysis of the educational effectiveness of three-dimensional visualization technologies in teaching anatomy. *Anatomical Sciences Education*, 8(6), 525–538. | 2015 (online 2014) | https://doi.org/10.1002/ase.1510 | 36 studi (28 acak), 2.226 peserta. 3DVT dibanding **semua metode pengajaran lain**: pengetahuan faktual d = 0,30 (IK 0,02–0,62), spasial d = 0,50 (0,20–0,80), kepuasan d = 0,28. | Pembanding bukan khusus "media 2D"; efek faktual kecil dengan batas bawah IK mendekati nol. |
| Wainman, B., Wolak, L., Pukas, G., Zheng, E., & Norman, G. R. The superiority of three-dimensional physical models to two-dimensional computer presentations in anatomy learning. *Medical Education*, 52(11), 1138–1146. | 2018 | https://doi.org/10.1111/medu.13683 | Model fisik 67–69% vs presentasi komputer 41% (P < 0,0001); keunggulan 28% hampir hilang (5%) bila satu mata ditutup → stereopsis berperan utama. | Mahasiswa sarjana; satu topik. |
| Wainman dkk. (2020) | lihat Bagian 9 | | | |
| Wang, J., Li, W., Dun, A., Zhong, N., & Ye, Z. 3D visualization technology for learning human anatomy among medical students and residents: A meta- and regression analysis. *BMC Medical Education*, 24, 461. | 2024 | https://doi.org/10.1186/s12909-024-05403-4 | 39 RCT, 2.959 peserta: visualisasi 3D meningkatkan skor tes secara moderat, juga kepuasan; waktu tes tidak berkurang bermakna. | Heterogenitas > 50%. |
| García-Robles dkk. (2024) | lihat Bagian 9 | | XR efektif terutama sebagai suplemen. | |
| Ye dkk. (2020, 2023) | lihat Bagian 10 | | | |

**Sintesis:** bukti konsisten bahwa media 3D (layar, VR, cetak) lebih baik daripada pengajaran 2D/tradisional dengan efek kecil–sedang, heterogenitas tinggi, dan bukti terhadap diseksi kadaver masih tipis. Model fisik dan stereopsis tampak penting. Kesimpulan deck "pelengkap, bukan pengganti" didukung.

## 12. Regulasi dan keselamatan

| Sumber | Tahun | URL / DOI | Klaim yang didukung | Batas bukti |
|---|---|---|---|---|
| IARC. *Formaldehyde, 2-Butoxyethanol and 1-tert-Butoxypropan-2-ol*. IARC Monographs Vol. 88. | 2006 | https://publications.iarc.fr/106 ; ringkasan rapat: https://pmc.ncbi.nlm.nih.gov/articles/PMC1280402 | Formaldehida = karsinogen bagi manusia (**Grup 1**), bukti cukup untuk kanker nasofaring. | Dikonfirmasi ulang di Vol. 100F (2012; rapat 2009), yang menambahkan leukemia — pertimbangkan mengutip keduanya. |
| Permenkes RI No. 24 Tahun 2022 tentang Rekam Medis. | 2022 | https://peraturan.bpk.go.id/Details/245544 | Pasal 45: "Seluruh Fasilitas Pelayanan Kesehatan harus menyelenggarakan Rekam Medis Elektronik ... paling lambat pada tanggal 31 Desember 2023." Berlaku 31 Agustus 2022; mencabut Permenmenkes 269/2008. | Tenggat transisi, bukan bukti kepatuhan; implementasi di lapangan belum merata. |
| UU RI No. 17 Tahun 2023 tentang Kesehatan, Pasal 157 ayat (5) dan Pasal 158. | 2023 | https://pasal.id/peraturan/uu/uu-no-17-tahun-2023/pasal-157 ; https://www.hukumonline.com/klinik/a/regulasi-penggunaan-kadaver-untuk-pendidikan-lt658ba32d64498/ | Upaya penentuan sebab kematian dapat dipadukan dengan penelitian, pendidikan, dan pelatihan, termasuk bedah mayat anatomis; Pasal 158: sesuai norma agama, sosial budaya, kesusilaan, dan etika profesi. Pasal 120 UU 36/2009 dicabut. | Rujukan sekunder (pasal.id, Hukumonline); naskah resmi di JDIH. |
| Permenkes RI No. 38 Tahun 2022 tentang Pelayanan Kedokteran untuk Kepentingan Umum (menurut BPK). | 2022 | https://peraturan.bpk.go.id/Details/245558 | Pasal 26: bedah mayat anatomis hanya pada mayat tak dikenal/tak diurus keluarga atau dengan persetujuan tertulis semasa hidup/keluarga; di RS pendidikan atau institusi pendidikan kedokteran; mayat dimakamkan setelah selesai. | Hukumonline menyebut judul "untuk Kepentingan Hukum"; BPK menyebut "Kepentingan Umum". Digitalisasi/pencitraan jenazah tidak diatur eksplisit (mendukung slide 25 "celah"). |

## 13. Hal yang tidak dapat diverifikasi dari sumber primer

- Tumpang tindih foto fotogrametri 60–80% dan protokol 3 cincin × 12–24 posisi (slide 19): praktik umum, tetapi tidak ditemukan sumber anatomi primer yang menyebut angka tersebut.
- Nilai ambang khusus phantom sintetis (Otsu ≈ −460 HU, 115 pulau, ΔE*ab < 20, 10.440 → 626 segitiga): hasil data sintetis buku, bukan klaim literatur.
- Rujukan buku "Zhang, Heng, & Liu (2006), *Anat Rec B*, 289B(1), 8–9" tidak ditemukan di Europe PMC; rujukan terverifikasi adalah *Clin Anat* 19(3), 204–215 (DOI 10.1002/ca.20273).
