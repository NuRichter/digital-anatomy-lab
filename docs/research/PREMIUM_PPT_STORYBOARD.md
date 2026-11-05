# Storyboard PPT Teknik Anatomi Digital V2 (versi final)

Dihasilkan dari berkas final `PPT Teknik Anatomi Digital V2.pptx` (47 slide) pada 14 Oktober 2026.

| No | Judul | Visual utama | Media | Catatan pembicara (ringkas) |
|---|---|---|---|---|
| 1 | Teknik Anatomi Digital | 3 gambar | - | Awali sesi dengan pertanyaan kepada kelas: kapan terakhir kali Anda melihat anatomi melalui sayatan, dan kapan melalui layar CT? Jawaban atas pertanyaan itu men… |
| 2 | Peta sesi 120 menit | 0 gambar | - | Sesi ini terbagi atas lima bagian, ditambah diskusi. Materi lengkap tersedia di Bab 1 sampai Bab 5 buku serta Lampiran Praktikum. Bagian 2 paling panjang karena… |
| 3 | Mengapa anatomi perlu didigitalkan | 1 gambar | - | Alokasi waktu bagian ini sekitar 15 menit. Gambar Vesalius mengingatkan bahwa anatomi selalu dibangun dari pengamatan langsung. |
| 4 | Tiga tekanan yang melahirkan anatomi digital | 0 gambar | - | Tekankan bahwa anatomi digital lahir dari kebutuhan, bukan dari tren teknologi. Formaldehida diklasifikasikan IARC sebagai karsinogen Grup 1. Kewajiban rekam me… |
| 5 | Bukti: pelengkap, bukan pengganti | 0 gambar | - | Bukti ini menjadi dasar seluruh sesi. Koreksi dari versi sebelumnya: Yammine dan Violato (2015) membandingkan visualisasi 3D dengan berbagai metode pengajaran l… |
| 6 | Lima abad, satu prinsip: belajar dari pengamatan | 0 gambar | - | Alat pengamatannya berubah, tetapi prinsipnya tetap sama sejak Vesalius. Seluruh tahun pada linimasa telah diverifikasi terhadap sumber primer (lihat research/C… |
| 7 | Alur kerja anatomi digital | 0 gambar | - | Enam tahap ini menjadi kerangka seluruh sesi. Segmentasi merupakan tahap yang paling banyak dipercepat oleh AI; topik ini dibahas pada sesi berikutnya. Slide be… |
| 8 | Hasil akhir alur kerja: tubuh digital berlapis | 6 gambar | - | Tunjukkan ke mana enam tahap alur kerja bermuara: model anatomi yang tersusun atas struktur bernama. Urutan lapisan di sini mengikuti logika diseksi (kulit, oto… |
| 9 | Dari citra medis ke model 3D | 1 gambar | - | Alokasi waktu bagian ini sekitar 35 menit. Bagian ini paling panjang karena menjadi dasar teknis bagi bagian selanjutnya. |
| 10 | DICOM: citra, metadata, dan identitas | 0 gambar | - | DICOM bukan sekadar format file: standar ini mengatur penyimpanan, pengiriman, dan metadata citra (ACR-NEMA 1985, DICOM 3.0 1993). Hierarki pasien–studi–seri–in… |
| 11 | Citra medis adalah matriks angka | 2 gambar | - | Voxel disebut isotropik bila ukurannya sama pada ketiga sumbu. Dengan piksel 0,7 mm, potongan 5 mm membuat voxel sekitar tujuh kali lebih panjang pada arah z. C… |
| 12 | Hounsfield unit: skala yang terkalibrasi | 1 gambar | - | Ingatkan bahwa kVp dan media kontras memengaruhi nilai HU. SV adalah stored value, yaitu nilai piksel yang tersimpan; rumus umumnya HU = SV × Rescale Slope + Re… |
| 13 | Windowing: satu data, tiga cara melihat | 3 gambar | - | Batas window: HU min = WL − WW/2 dan HU maks = WL + WW/2. Contoh: brain window dengan WW 80 dan WL 40 menampilkan rentang 0 sampai 80 HU. Catatan untuk demo: pr… |
| 14 | MPR dan pentingnya potongan tipis | 3 gambar | - | MPR membentuk bidang koronal, sagital, dan oblik dari satu volume. Potongan tebal memunculkan artefak stair-step. Orientasi LPS dan RAS kini dibahas pada slide … |
| 15 | Orientasi: sisi pasien dan sistem koordinat | 2 gambar | - | Gunakan model di kiri untuk menyebut arah: kanan pasien (R) tampak di kiri layar ketika model dilihat dari depan. DICOM memakai LPS (x ke kiri, y ke posterior, … |
| 16 | Artefak dan daftar periksa sebelum rekonstruksi | 0 gambar | - | Artefak berbahaya bagi rekonstruksi 3D karena ikut tersegmentasi seolah-olah struktur anatomis. Partial volume tidak dapat dihindari sepenuhnya; dampaknya terbe… |
| 17 | Tiga jalur rekonstruksi 3D | 0 gambar | - | Pemilihan jalur ditentukan oleh tujuan, bukan oleh kecanggihan alat. Jalur A menghasilkan mesh, jalur B tidak memerlukan segmentasi, jalur C mempertahankan warn… |
| 18 | Thresholding melihat nilai, bukan bentuk | 1 gambar | - | Inilah alasan segmentasi berbasis AI dikembangkan: thresholding tidak memahami anatomi. Nilai Otsu −460 HU berasal dari phantom sintetis buku, bukan nilai klini… |
| 19 | Region growing dan operasi morfologi | 2 gambar | - | Korteks vertebra, dengan nilai sekitar 1.000 HU pada phantom, berfungsi sebagai dinding selama nilainya berada di luar interval. Jumlah 115 pulau berasal dari p… |
| 20 | Segmentasi manual dan semi-otomatis | 0 gambar | - | Struktur yang nilai HU-nya mirip dengan jaringan sekitarnya tidak dapat dipisahkan dengan aturan sederhana. Teknik semi-otomatis seperti Grow from seeds (berbas… |
| 21 | Ambang menggeser permukaan model | 2 gambar | - | Contoh: voxel bernilai 100 HU pada posisi 10 mm dan 700 HU pada posisi 11 mm. Ambang 300 HU menempatkan permukaan pada 10,33 mm, sedangkan ambang 500 HU pada 10… |
| 22 | Pascapemrosesan mesh | 1 gambar | - | Rumus: V − E + F = 2 − 2g, dengan g adalah genus (jumlah lubang). Mesh harus watertight dan manifold sebelum dicetak. Bila memungkinkan, perbaiki kesalahan pada… |
| 23 | Satu vertebra, empat representasi | 4 gambar | - | Empat panel ini menunjukkan objek yang sama dalam empat representasi. Panel pertama mensimulasikan mask voxel: inilah bentuk asli hasil segmentasi, lengkap deng… |
| 24 | Melihat tanpa segmentasi | 1 gambar | - | Transfer function yang berbasis nilai tidak dapat memisahkan struktur dengan nilai HU yang sama, persis seperti thresholding. Surface rendering memerlukan mesh … |
| 25 | Fotogrametri: spesimen berwarna asli | 1 gambar | - | Alur structure from motion: deteksi fitur, estimasi posisi kamera, bundle adjustment, rekonstruksi padat, lalu pembentukan mesh dan tekstur. COLMAP dan Meshroom… |
| 26 | Anatomi kadaver digital | 1 gambar | - | Alokasi waktu bagian ini sekitar 20 menit. |
| 27 | Tiga dataset kadaver digital utama | 0 gambar | - | VHP tersedia secara bebas dari NLM; sejak 2019 tidak memerlukan perjanjian lisensi, cukup atribusi. Data ini dapat dipakai untuk praktik di kelas. Catatan CVH: … |
| 28 | Cryosection: resolusi tinggi, tetapi destruktif | 2 gambar | - | Jenazah habis terpakai selama proses sehingga setiap kesalahan akuisisi bersifat permanen. Potongan VHP diperlihatkan dengan izin atribusi NLM. |
| 29 | Mengolah data kadaver digital | 2 gambar | - | Pergeseran antarpotongan diestimasi dengan phase correlation. Jarak warna dalam ruang RGB tidak sesuai dengan persepsi manusia; karena itu dipakai CIELAB. Amban… |
| 30 | Dari pelabelan ke atlas 3D berlabel | 3 gambar | - | Butir ketiga pada slide sebelumnya, pelabelan berbasis ontologi FMA, terlihat nyata di sini. BodyParts3D memetakan setiap mesh ke konsep FMA sehingga mesin dapa… |
| 31 | Pilihan sumber kadaver digital | 0 gambar | - | Rekomendasikan pengembangan kadaver digital institusi melalui CT pascakematian sebagai langkah paling realistis bagi fakultas kedokteran di Indonesia. Sinha dkk… |
| 32 | Lima langkah kadaver digital institusi | 0 gambar | - | Langkah-langkah ini menjawab rekomendasi di slide sebelumnya. Langkah 1 dan 5 (oranye) adalah langkah tata kelola dan etika; tiga langkah lainnya teknis. Akar p… |
| 33 | Etika: penghormatan tidak berhenti di ruang diseksi | 0 gambar | - | Kaitkan dengan kontroversi persetujuan donor Visible Human Project. Pernyataan bahwa digitalisasi belum diatur eksplisit adalah sepanjang penelusuran penulis bu… |
| 34 | Kerangka etika kadaver digital | 0 gambar | - | Kadaver digital mewarisi seluruh kewajiban etika kadaver fisik dan menambahkan kewajiban baru: data bertahan tanpa batas waktu, dapat disalin, dan diakses dari … |
| 35 | Virtual anatomy dan 3D printing | 1 gambar | - | Alokasi waktu bagian ini sekitar 25 menit. |
| 36 | Kontinum realitas dan bukti VR | 0 gambar | - | Zhao dkk. (2020): 15 RCT, 816 peserta, SMD 0,53 (IK 95% 0,09–0,97), I² 87,8%; hanya 2 studi yang membandingkan dengan diseksi. Moro dkk. (2017): VR, AR, dan tab… |
| 37 | Menyiapkan model untuk VR | 0 gambar | - | Rumus: t_frame = 1.000/f, dengan f laju penyegaran (Hz). HMD adalah head-mounted display. Sesi VR sebaiknya singkat, dan mahasiswa dilatih menggunakan perangkat… |
| 38 | Dari citra ke model cetak | 0 gambar | - | FDM (material extrusion) murah untuk model tulang, resin (vat photopolymerization) untuk detail halus seperti telinga tengah, dan material jetting untuk model m… |
| 39 | Tebal lapisan, kehalusan, dan bukti | 2 gambar | - | Ye dkk. (2020): SMD 1,27 (IK 95% 0,37–2,01) untuk nilai tes neuroanatomi. Lim dkk. (2016): kelompok model cetak jantung memperoleh nilai lebih tinggi daripada k… |
| 40 | Akurasi dan kendali mutu model cetak | 0 gambar | - | Model cetak adalah ujung rantai panjang; setiap mata rantai menambah galat. Untuk pengenalan topografi di kelas, galat beberapa persen umumnya dapat diterima; u… |
| 41 | Pilih media dari tujuan, bukan dari teknologi | 0 gambar | - | Contoh sesi efektif: eksplorasi mandiri dengan atlas 3D (misalnya website Digital Anatomy Laboratory), diskusi kelompok dengan model cetak, lalu konfirmasi pada… |
| 42 | Demo 3D Slicer | 1 gambar | - | Alokasi waktu bagian ini sekitar 20 menit. Semua data berasal dari Sample Data bawaan 3D Slicer. |
| 43 | Demo: dari CT ke model tulang | 1 gambar | - | Ikuti Praktikum 1, 3, dan 4 pada Lampiran. Siapkan rekaman layar cadangan bila perangkat bermasalah. Sebelum kuliah, periksa nama dataset, preset, dan menu pada… |
| 44 | Lima pesan kunci | 0 gambar | - | Tutup dengan lima pesan ini sebelum diskusi. Jembatan ke sesi berikutnya: pesan 2 menjadi alasan segmentasi otomatis berbasis AI dikembangkan dan dievaluasi sec… |
| 45 | Diskusi dan tugas | 1 gambar | - | Buka sesi tanya jawab. Ingatkan mahasiswa untuk memasang TotalSegmentator dan PyTorch sebelum sesi berikutnya (21 Oktober 2026). Koreksi: Tabel L.3 merupakan ba… |
| 46 | Daftar pustaka utama | 0 gambar | - | Slide rujukan; tidak perlu dibacakan. Catatan koreksi: rujukan Zhang dkk. (2006) dalam daftar pustaka buku tercantum di Anat Rec B 289B(1); penelusuran menemuka… |
| 47 | Kredit visual dan lisensi | 0 gambar | - | Atribusi aset eksternal. Render 3D dibuat khusus untuk kuliah ini dari data BodyParts3D; versi interaktifnya tersedia pada website Digital Anatomy Laboratory. |

## Catatan penyusunan
- Basis: salinan `PPT Teknik Anatomi Digital.pptx` (35 slide). Desain, diagram, dan gambar sumber yang sudah kuat dipertahankan; 12 slide baru disisipkan.
- Slide baru: 8 (tubuh digital berlapis, render 3D), 10 (DICOM dan anonimisasi), 15 (orientasi LPS/RAS dengan render 3D), 16 (artefak + daftar periksa), 20 (segmentasi manual/semi-otomatis), 23 (satu vertebra, empat representasi), 30 (atlas 3D berlabel FMA), 32 (lima langkah kadaver digital institusi), 34 (kerangka etika), 40 (akurasi dan kendali mutu model cetak), 46 (daftar pustaka), 47 (kredit visual dan lisensi).
- Koreksi isi: slide 5 (Yammine & Violato), 31 (Sinha ">86%"), 36 (IK 95% Zhao), 45 (Tabel L.3 = Praktikum 1); catatan slide 14/15 (LPS↔RAS menukar kiri–kanan dan depan–belakang), 21 (14 pola marching cubes), 27 (CVH), 13/43 (preset 3D Slicer berbeda).
- Gambar sampul dan penutup: grafik wireframe tanpa kredit diganti render BodyParts3D (CC BY 4.0).
- Manajemen waktu: Bagian 2 kini 17 slide isi untuk 35 menit. Bila waktu sempit, slide 10, 16, dan 20 dapat dibahas singkat atau dijadikan bacaan; kontennya tetap tersedia di Bab 2–3.
