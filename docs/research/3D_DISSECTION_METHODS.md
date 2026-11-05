# Metode Diseksi dan Rendering Anatomi 3D

Dokumen riset untuk deck visual "3D Teknik Anatomi Digital.pptx" dan situs interaktif pendampingnya.
Peran: Agent 3 (3D Anatomy & Dissection Specialist) dan Agent 11 (3D PowerPoint Art Director).
Kaitan buku: Bab 3 (Rekonstruksi 3D: segmentasi, mesh, rendering), Bab 4 (kadaver digital, meja diseksi virtual), Bab 5 (virtual anatomy, persiapan model, 3D printing).

---

## 1. Sumber data dan batasannya

| Aspek | BodyParts3D (DBCLS) | Catatan verifikasi |
|---|---|---|
| Format | Satu file OBJ per konsep FMA. Sejak rilis 4.0 nama file berupa ID `FJxxxx` dan dipetakan ke ID/nama FMA lewat tabel (`partof_element_parts.txt`, `isa_element_parts.txt`, `parts_list`) | Selalu petakan file -> nama FMA lewat tabel, jangan dari nama file |
| Cakupan kuat | Rangka (lengkap, kiri/kanan terpisah), otot rangka, organ toraks dan abdomen, paru dan hati tersegmentasi beserta pembuluhnya, arteri dan vena sistemik, arteri otak, bola mata, faring dan laring | Rilis 4.0 (2013) menambahkan arteri/vena sistemik, segmen paru/hati, struktur bola mata |
| Cakupan lemah / belum pasti | Saraf perifer (parsial), sistem limfe (sangat terbatas), kulit/permukaan tubuh, wajah realistis, jaringan lemak subkutan, fasia | **Wajib dicek di daftar parts sebelum produksi.** Slide yang bergantung pada data ini memiliki rencana cadangan (lihat storyboard) |
| Jenis kelamin | Satu model pria dewasa (referensi) | Organ reproduksi wanita kemungkinan **tidak ada**; gunakan sumber lain (mis. Z-Anatomy) atau tampilkan sistem pria saja |
| Akurasi | Catatan rilis menyatakan data "may still contain many ERRORS to be used as CANONICAL MODEL"; relasi is-a/part-of dibuat semi-otomatis | Validasi visual oleh ahli anatomi (sejalan dengan prinsip Bab 1: galat menjalar) |
| Lisensi | CC BY-SA 2.1 JP (versi lama arsip DBCLS); sebagian salinan turunan menyebut CC BY 4.0 | Pastikan versi lisensi dari halaman arsip saat unduh dan catat tanggalnya. Jika BY-SA: render dan GLB turunan dilisensikan ulang CC BY-SA dengan atribusi |

**Sumber pelengkap untuk celah data (opsional, cek lisensi):**
- Z-Anatomy (turunan BodyParts3D, CC BY-SA 4.0, file .blend dengan koleksi per sistem, nama Terminologia Anatomica). Berguna untuk saraf tambahan, kulit, dan sistem reproduksi wanita bila tersedia.
- Untuk bab H (citra -> volume): dataset CT terbuka berlisensi permisif (mis. dataset TotalSegmentator, CC BY 4.0) atau data phantom dari buku (Gambar 3.2, 3.8). BodyParts3D bukan citra sehingga tidak bisa menunjukkan langkah akuisisi secara jujur.
- Kulit/siluet: bila tidak ada mesh kulit, gunakan **siluet hantu** (ghost hull) yang dibangun dari shrinkwrap/remesh gabungan otot superfisial (lihat 6.3), diberi label "siluet ilustratif, bukan data".

---

## 2. Praktik baik rendering gaya atlas (rangkuman riset)

### 2.1 Pembanding produk
| Produk | Ciri visual yang layak ditiru | Yang dihindari untuk deck ini |
|---|---|---|
| Primal Pictures (Anatomy.tv) | Model berbasis data cryosection/MRI; latar gelap, pencahayaan studio lembut, lapisan diseksi berurutan, label berpin | Tekstur fotorealistis yang tidak tersedia di BodyParts3D |
| Visible Body | Warna konvensi tegas, tombol hide/fade/isolate, "explode" | Gloss berlebihan |
| Complete Anatomy (3D4Medical/Elsevier) | Material semi-realistis (otot serat, tulang berpori), ghosting, potongan (cross-section) dengan cap berwarna, latar gradien gelap | Subsurface scattering berat untuk aset low-poly |
| Z-Anatomy | Basis BodyParts3D, koleksi per sistem dan per lapisan, label Terminologia Anatomica | Tampilan default yang flat |
| Netter / Gray's / Sobotta / Prometheus | Konvensi warna (arteri merah, vena biru, saraf kuning, limfe hijau), tulang gading, otot merah-cokelat dengan tendon putih keperakan; satu sudut pandang standar per plat; label di kolom rapi dengan garis penunjuk lurus | Arsiran dan ilustrasi tangan (bukan target) |

### 2.2 Prinsip turunan
1. **Satu struktur fokus per gambar.** Struktur lain diredupkan (ghost 10–25% opasitas atau desaturasi), bukan disembunyikan total, agar konteks spasial tetap terbaca.
2. **Warna konvensional, saturasi terkendali.** Warna sistem harus langsung dikenali; variasi dalam satu sistem dilakukan lewat nilai (terang-gelap), bukan hue baru.
3. **Orientasi standar.** Posisi anatomis (berdiri tegak, wajah dan telapak tangan menghadap ke depan, kaki sejajar). Tampak anterior selalu menempatkan sisi **kanan pasien di kiri layar**.
4. **Pencahayaan konsisten** antarslide, sehingga perbedaan yang terlihat adalah perbedaan anatomi, bukan perbedaan lampu.
5. **Kedalaman terbaca tanpa perspektif berlebih**: rim light + ambient occlusion + sedikit depth-of-field hanya pada shot hero.

---

## 3. Konvensi orientasi dan kamera

### 3.1 Sumbu dan tampak standar
| Tampak | Arah kamera (Blender, model Z-up, wajah ke -Y) | Pemakaian |
|---|---|---|
| Anterior | kamera di -Y menghadap +Y | Default atlas, orientasi |
| Posterior | kamera di +Y | Punggung, otot dorsal, columna vertebralis |
| Lateral kanan / kiri | kamera di +X / -X | Kepala-leher, columna, pelvis |
| Superior / inferior | kamera di +Z / -Z | Basis cranii, pelvis inlet, potongan transversal |
| Anterolateral oblik 30–45° | rotasi Z 30–45°, elevasi 10–15° | Shot hero dan volume organ |

Catatan koordinat: BodyParts3D memakai satuan milimeter. Impor dengan skala 0,001 agar 1 unit Blender = 1 m, lalu cek orientasi (LPS vs RAS, lihat Bab 2–3 buku) dengan memastikan jantung berada di kiri pasien.

### 3.2 Ortografis vs perspektif
| Kriteria | Ortografis | Perspektif |
|---|---|---|
| Akurasi proporsi, perbandingan kiri-kanan | Ya, tanpa distorsi | Distorsi bergantung jarak |
| Kesan "plat atlas" | Kuat | Lemah |
| Kesan volume, kedalaman | Lemah (perlu AO + rim) | Kuat |
| Rekomendasi | Tampak kardinal (A/P/L/S), triptych, potongan sectional, pipeline H | Shot oblik/hero: lensa 85–135 mm (tele, distorsi kecil); turntable: 100 mm; close-up organ: 135 mm |

Hindari lensa < 50 mm untuk anatomi: memperbesar bagian terdekat (misal hidung, lutut) dan membuat proporsi menyesatkan.

### 3.3 Komposisi
- Tubuh utuh: tinggi tubuh 80–85% tinggi frame (ruang untuk judul atas dan footer bawah).
- Region/organ: struktur fokus berada pada sepertiga horizontal, sisi lainnya untuk kolom label.
- Turntable: rotasi 360° searah jarum jam dilihat dari atas, mulai dan berakhir di tampak anterior, easing linear (loop mulus).

---

## 4. Urutan diseksi lapis demi lapis

Urutan klasik ruang diseksi (dari luar ke dalam), dipetakan ke ketersediaan data:

| Lapis | Isi anatomis | Ketersediaan BodyParts3D | Perlakuan render |
|---|---|---|---|
| L0 | Kulit (cutis) | Belum pasti | Bila ada: material kulit netral, opasitas 100% -> 30% saat transisi. Bila tidak: ghost hull ilustratif |
| L1 | Jaringan subkutan, vena dan saraf kutan | Lemak tidak ada; vena superfisial sebagian (mis. great saphenous vein, cephalic vein — verifikasi) | Tampilkan vena superfisial di atas otot |
| L2 | Fasia profunda | Tidak ada | Dilewati (sebutkan secara lisan) |
| L3 | Otot superfisial (mis. pectoralis major, deltoid, latissimus dorsi, external oblique, gluteus maximus, sartorius) | Ada | Hapus/fade per kelompok |
| L4 | Otot profunda (pectoralis minor, internal oblique, transversus abdominis, erector spinae, gluteus medius/minimus) | Ada | Hapus/fade per kelompok |
| L5 | Berkas neurovaskular (arteri, vena, saraf) | Arteri/vena ada; saraf parsial | Warna konvensi; saraf diberi sedikit emisi agar terbaca |
| L6 | Organ dalam (per rongga: toraks -> abdomen -> pelvis; dari anterior ke posterior: jantung/paru -> hati/lambung/usus -> ginjal/pembuluh besar retroperitoneal) | Ada | Buka rongga dengan menyembunyikan dinding (costae anterior, sternum, otot dinding abdomen) |
| L7 | Rangka dan sendi (tulang, kartilago, ligamen bila ada) | Tulang dan kartilago ada; ligamen terbatas | Lapis terdalam, tetap tampil pada semua shot sebagai kerangka konteks |

Aturan transisi animasi lapis (MP4): setiap lapis 2–3 detik; pola = **fade opasitas 100% -> 0% dalam 0,8 dtk + tahan 1,5 dtk**, tidak memakai efek "terbang" (membingungkan posisi). Kamera diam (ortho anterior) agar perubahan hanya pada lapisan.

---

## 5. Teknik tampilan lanjutan

### 5.1 Exploded view
- Arah ledakan: radial dari pusat massa kelompok (cranium: dari pusat sella turcica; columna: sepanjang sumbu kurva tulang belakang; jantung: tidak disarankan karena bukan rakitan diskrit).
- Jarak: 15–40% ukuran objek; pertahankan urutan dan arah agar hubungan topografis masih terbaca.
- Animasi: rakit -> urai -> tahan -> rakit kembali; ease-in-out; 8–10 detik.
- Implementasi Blender: driver/keyframe lokasi per objek = `pusat_objek + faktor * (pusat_objek - pusat_kelompok)`; satu custom property `explode` (0–1) mengendalikan semua.
- Cocok untuk: cranium (ossa cranii et faciei), columna vertebralis, tulang tangan/kaki, segmen hati/paru (BodyParts3D memiliki segmen).

### 5.2 Clipping / sectional view
- Bidang: transversal (axial), sagital, koronal; korespondensi langsung dengan MPR (Bab 2) dan potongan cryosection (Bab 4).
- Blender: modifier Boolean (Difference dengan kubus) per objek atau shader clipping berbasis koordinat objek; **cap/penutup potongan** wajib (permukaan potong diberi warna struktur yang lebih terang ~15% + garis tepi tipis) agar potongan tidak tampak berongga. Mesh BodyParts3D tidak selalu manifold; untuk cap gunakan Boolean "Exact" + `Fill Holes`, atau tampilkan sisi dalam dengan warna backface yang sama.
- Animasi sweep: bidang bergerak kraniokaudal 8–12 detik; tampilkan miniatur posisi bidang (inset) di pojok.
- Tata letak: potongan transversal dilihat **dari inferior (kaudal)** sesuai konvensi radiologi (kanan pasien di kiri layar), sehingga konsisten dengan CT pada bab H.

### 5.3 Transparansi / ghosting (X-ray)
- Struktur konteks: opasitas 10–25%, warna desaturasi, Fresnel/facing-ratio sehingga tepi lebih tampak daripada permukaan (ghost "kaca").
- Struktur fokus: opak penuh, warna konvensi.
- Cycles: Principled BSDF + mix Transparent dengan faktor alpha; naikkan `Transparent bounces` ≥ 32 untuk tumpukan banyak lapis. EEVEE: blend mode/`Render Method: Blended`, aktifkan "Show Backface" off untuk ghost agar tidak keruh.
- Hindari lebih dari 3 lapis transparan bertumpuk: jadi abu-abu keruh.

### 5.4 Isolasi dan highlight
- Isolate: hanya struktur fokus + rangka ghost.
- Highlight: struktur fokus diberi outline (Freestyle atau post-process) atau emisi lemah 0,1–0,2.

---

## 6. Pipeline produksi Blender 5.2

### 6.1 Impor dan organisasi
1. Unduh BodyParts3D (versi terbaru di arsip DBCLS) + tabel parts list.
2. Skrip Python: impor setiap OBJ, ganti nama objek menjadi `FMA<id>_<nama_inggris>`, simpan custom property `fma_id`, `system`, `region`, `layer` (L0–L7), `side` (L/R/M).
3. Collection hierarchy: `Sistem > Subsistem` (mis. `Skeletal > Axial > Skull`), plus View Layers/Collection Instances untuk tiap shot.
4. Material ditetapkan per `system` (lihat palet di 3D_VISUAL_SHOTLIST.md), bukan per objek, agar konsisten dan mudah diganti.
5. Normalisasi mesh: `Merge by distance`, `Shade Auto Smooth` (30–40°), cek normal terbalik. Jangan smoothing kuat (pesan Bab 3: smoothing mengubah geometri).

### 6.2 Render
| Pengaturan | Still (Cycles) | MP4 (EEVEE Next atau Cycles) |
|---|---|---|
| Resolusi | 3840×2160 | 1920×1080, 30 fps |
| Sampel | 512–1024 + OptiX denoiser | EEVEE: 64–128 sampel; Cycles: 128 + OptiX denoise (cek flicker) |
| Color management | AgX, look "Medium High Contrast" atau "Base Contrast"; exposure terkunci per proyek | sama |
| Output | PNG 16-bit, latar transparan (film transparent) + versi komposit dengan latar #16181C | PNG sequence -> FFmpeg H.264 |
| Pass tambahan | Cryptomatte (object) untuk koreksi per struktur, AO, Mist | — |

Encoding MP4 untuk PowerPoint: H.264 High profile, `yuv420p`, CRF 18 (≈10–16 Mbps), keyframe tiap 1 dtk, tanpa audio, `+faststart`. Contoh:
`ffmpeg -framerate 30 -i f_%04d.png -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 18 -g 30 -movflags +faststart -an out.mp4`
Poster frame = frame pertama (tampak anterior) diekspor juga sebagai PNG 3840×2160 untuk fallback PDF/cetak.

### 6.3 Ghost hull (pengganti kulit bila tidak tersedia)
Gabungkan duplikat semua otot superfisial + tulang yang subkutan (cranium, patella, tibia anterior) -> Remesh voxel 8–10 mm -> Smooth -> Shrinkwrap offset +3 mm. Hasilnya siluet halus tanpa wajah. Selalu ditampilkan sebagai ghost (opasitas ≤ 25%), tidak pernah opak, dan tidak dilabeli sebagai struktur anatomi.

### 6.4 Studio lighting standar (satu rig untuk semua shot)
| Lampu | Tipe | Posisi relatif subjek | Intensitas relatif | Warna |
|---|---|---|---|---|
| Key | Area 2×2 m, soft | depan-kiri-atas, azimut -40°, elevasi 35° | 1,0 | 5600 K (netral sedikit hangat) |
| Fill | Area 3×3 m | depan-kanan, azimut +50°, elevasi 10° | 0,35 | 6500 K |
| Rim | Area strip 0,5×3 m (2 buah) | belakang kiri dan kanan, elevasi 20° | 0,8 | 7000 K (sedikit dingin) |
| World | HDRI studio abu netral / warna seragam #202226 | — | strength 0,15–0,25 | — |

Rasio key:fill sekitar 3:1 menghasilkan modelling lembut seperti atlas. Rim light penting di latar gelap agar siluet otot merah tua dan vena biru tidak tenggelam. Rig di-parent ke kamera (bukan ke dunia) untuk turntable sehingga cahaya tetap konsisten terhadap penonton; untuk animasi yang menekankan volume, model diputar dan rig diam.

---

## 7. Teknik untuk PPT statis vs web interaktif

| Teknik | PPT still | PPT MP4 | Web interaktif | Alasan |
|---|---|---|---|---|
| Tampak kardinal ortho | Sangat cocok | — | Tombol "view preset" | Plat atlas, ringan |
| Turntable | — | Cocok (8–12 dtk loop) | Orbit bebas | Volume; di web pengguna mengendalikan sendiri |
| Lapis demi lapis | Cocok (serial slide) | Cocok (peel) | Slider kedalaman L0–L7 | Narasi berurutan di kelas, eksplorasi bebas di web |
| Exploded view | Cocok (1 frame tahan) | Sangat cocok | Slider explode | Gerak memperjelas asal posisi |
| Clipping/potongan | Cocok | Sangat cocok (sweep) | Bidang potong yang bisa digeser + sinkron CT | Hubungan dengan MPR |
| Ghost/X-ray | Cocok | Cocok | Toggle per struktur/sistem | — |
| Path tracing, AO, DOF, subsurface | Ya (Cycles) | Terbatas | Tidak (realtime; AO baked/SSAO) | Kualitas vs kecepatan |
| Label | Statis, ≤ 6 | Muncul bertahap (opsional, di PPT sebagai overlay) | Pin interaktif + pencarian | Kepadatan informasi |
| Kuis / identifikasi | — | — | Ya | Interaktivitas |

---

## 8. Kendali mutu sebelum rilis
- [ ] Semua nama label dicocokkan ke tabel FMA BodyParts3D (ejaan Inggris FMA; Latin TA opsional sebagai teks sekunder).
- [ ] Orientasi kiri-kanan dicek (jantung di kiri pasien, hati di kanan).
- [ ] Palet hex sesuai; uji di proyektor kelas (lihat 3D_PPT_DESIGN_SPEC.md).
- [ ] Struktur dengan data cadangan/ilustratif diberi penanda.
- [ ] Atribusi BodyParts3D tampil di setiap slide.
- [ ] Review oleh ahli anatomi (minimal 1) untuk setiap slide berlabel.

## Sumber
- BodyParts3D Release Note 4.0: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/release_4.0_e.html
- BodyParts3D Release Note 3.0: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20110915/release_3.0_e.html
- BodyParts3D README: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/20110915/README_e.html
- Contoh atribusi turunan (jumlah mesh/konsep): https://raw.githubusercontent.com/ashemag/human-atlas/master/public/ATTRIBUTION.md
- Z-Anatomy: https://github.com/Z-Anatomy/Models-of-human-anatomy , https://github.com/Z-Anatomy/The-blend , https://www.blendernation.com/2022/05/25/amazing-open-source-anatomy-project-for-blender/
- Konvensi warna atlas: Netter, *Atlas of Human Anatomy*; Gray's Anatomy for Students; Prometheus (rujukan umum, bukan kutipan langsung).
