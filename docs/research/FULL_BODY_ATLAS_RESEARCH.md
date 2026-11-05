# Riset Sumber Atlas Anatomi 3D Seluruh Tubuh

Tanggal verifikasi: 2026-10-14 (Agent 10). Semua URL di bawah dicek dengan `curl -I` (HEAD) pada tanggal ini. File besar tidak diunduh. Isi ZIP diperiksa dengan membaca central directory melalui HTTP Range. File metadata kecil BodyParts3D diunduh ke scratchpad untuk dianalisis.

Lihat juga:
- `research/ANATOMY_ASSET_COMPARISON.csv`: tabel perbandingan sumber
- `research/ANATOMY_COVERAGE_MATRIX.csv`: cakupan per sistem
- `research/ANATOMY_LICENSE_AUDIT.md`: audit lisensi dan string atribusi

---

## 1. Ringkasan dan rekomendasi

| Peran | Sumber | Alasan |
|---|---|---|
| **Primer (seluruh tubuh, modular)** | **BodyParts3D v4.0 (DBCLS)**, set IS-A + tabel metadata | Satu-satunya dataset terbuka seluruh tubuh dengan **satu mesh per struktur** (2234 OBJ) dan **pemetaan FMA ID ke nama**. Sejak 2025-02 berlisensi **CC BY 4.0** tanpa share-alike, sehingga aman diredistribusikan di repo GitHub publik dan Vercel. |
| Sekunder (kulit/permukaan tubuh, organ wanita, limfatik, detail otak) | **HRA 3D Reference Organs (HuBMAP)**, GLB CC BY 4.0 | Sudah berformat GLB yang native untuk web. Menyediakan skin male/female, uterus, ovarium, kelenjar getah bening, dan otak 141 struktur (Allen). Lisensinya CC BY 4.0 sehingga kompatibel dengan BP3D. |
| Tersier (detail regional) | OpenAnatomy SPL (otak >300 struktur, telinga dalam, lutut, abdomen) | Lisensi 3D Slicer Part B bersifat permisif tetapi mewajibkan teks lisensi ikut dibundel. Gunakan hanya bila HRA tidak cukup. |
| Referensi/QA saja | Z-Anatomy (CC BY-SA 4.0 dengan sub-aset NC) | Kurasi bagus, tetapi share-alike dan komponen NC berisiko. **Jangan** dijadikan sumber aset web utama. Boleh dipakai sebagai referensi penamaan (TA2) dan pengecekan visual. |
| Opsional pipeline | TotalSegmentator (dataset CC BY 4.0, model `total` Apache-2.0) | Bisa menghasilkan mesh tiroid dan lainnya dari CT, tetapi hasilnya per-pasien, bukan atlas kanonik. |

---

## 2. BodyParts3D / Anatomography (DBCLS): sumber primer

### 2.1 Status
- Halaman unduhan: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html (HTTP 200)
- Direktori data: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/ (HTTP 200; arsip lama tersedia di folder `20080812`, `20090209`, `20100816`, `20110915`, dan `20130619`)
- Rilis: **4.0** (data 2013-05-16; README/lisensi diperbarui 2025-02-27)
- Situs viewer Anatomography: https://lifesciencedb.jp/bp3d/ (HTTP 200)
- Publikasi: Mitsuhashi N. et al., *BodyParts3D: 3D structure database for anatomical concepts*, Nucleic Acids Res. 2008/2009, PMID 18835852.

### 2.2 URL unduhan langsung (semua HTTP 200 per 2026-10-14)

| File | URL | Ukuran (byte) |
|---|---|---|
| README (EN) | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html | 19.263 |
| Release note 4.0 | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/release_4.0_e.html | ~6.3 KB |
| Sistem koordinat | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/coordinate_system.png | ~28 KB |
| **Mesh IS-A (superset, 2234 OBJ)** | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip | 142.903.898 (136 MB; sekitar 480 MB setelah diekstrak) |
| Mesh PART-OF (1258 OBJ) | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_BP3D_4.0_obj_99.zip | 64.888.505 (62 MB; sekitar 218 MB setelah diekstrak) |
| Daftar part IS-A (FMA, BP, nama) | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_parts_list_e.txt | 128.086 |
| Daftar part PART-OF | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_parts_list_e.txt | 59.351 |
| **Element parts IS-A (FMA, nama, FJ file)** | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_element_parts.txt | 1.142.159 |
| **Element parts PART-OF** | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_element_parts.txt | 651.179 |
| Relasi inklusi IS-A (parent, child) | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_inclusion_relation_list.txt | 207.664 |
| Relasi inklusi PART-OF | https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/partof_inclusion_relation_list.txt | 91.241 |

Versi Jepang juga tersedia: `isa_parts_list.txt` (296 KB) dan `partof_parts_list.txt` (139 KB).

### 2.3 Struktur data (hasil verifikasi)
- Isi ZIP: `isa_BP3D_4.0_obj_99/FJxxxx.obj` (2234 entri) dan `partof_BP3D_4.0_obj_99/FJxxxx.obj` (1258 entri). Nama file **hanya berupa ID FJ**, jadi nama harus diambil dari tabel.
- Semua FJ di set PART-OF juga ada di set IS-A. Gabungan keduanya = 2234 file, sehingga **cukup unduh zip IS-A** untuk mesh dan kedua tabel untuk hierarki.
- `*_parts_list_e.txt`: kolom `concept id` (FMA), `representation id` (BPxxxx), dan `en`.
- `*_element_parts.txt`: kolom `concept id`, `name`, dan `element file id` (FJ). Satu konsep compound (misalnya "aorta") terdiri atas banyak FJ. Pada IS-A ada 2905 konsep dan pada PART-OF ada 1368 konsep.
- Nama leaf: **1411 file FJ** memiliki konsep yang terdiri atas satu FJ saja, sehingga namanya spesifik (contoh: "left gluteus maximus", "eighth thoracic vertebra", "left lower first secondary molar tooth"). FJ lainnya diberi nama dari konsep compound terkecil yang memuatnya.
- `*_inclusion_relation_list.txt`: kolom `parent id`, `parent name`, `child id`, dan `child name`. Kolom ini dipakai untuk pohon sistem dan region di UI.
- Satuan mm, satu sistem koordinat bersama (model pria dewasa). Lihat `coordinate_system.png`.
- Polygon sudah direduksi 99% dari model asli. Ukuran rata-rata sekitar 200 KB OBJ per struktur, cocok untuk dikonversi ke GLB + Draco/meshopt.

### 2.4 Cakupan (dari analisis tabel)
- **Ada:** skeleton lengkap (vertebra C1 sampai L5, simfisis intervertebralis, rusuk, kartilago kosta, gigi permanen), otot skeletal per head dan sisi (sekitar 217 konsep terkait otot di IS-A), arteri (684 konsep IS-A) dan vena (318), jantung (83 elemen), paru per lobus, hati tersegmentasi, saluran cerna, ginjal/ureter/kandung kemih/uretra, prostat/testis/penis, adrenal, pankreas, limpa, timus, hipofisis, otak (hemisfer, talamus, hipokampus, serebelum), mata + otot ekstraokuler, laring/faring, fasia, dan 1 mesh kulit.
- **Tidak ada (sudah dicek dengan grep):** tiroid/paratiroid, kelenjar/pembuluh getah bening, saraf perifer utama (pleksus brakialis, n. ischiadicus, n. vagus), telinga dalam/koklea, meniskus/ligamen sendi besar, skrotum, organ reproduksi wanita, dan payudara.
- Peringatan resmi release note: *"The data may still contain many ERRORS to be used as CANONICAL MODEL"*. Perlu QA visual saat build.

### 2.5 Lisensi
README LATEST bagian 3 "License" (diperbarui 2025/02/25) menyatakan **Creative Commons Attribution 4.0 International** dengan string atribusi wajib:
> "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International"

Arsip lama (`20110915/README_e.html`) masih menyebut CC BY-SA 2.1 Japan. Banyak proyek turunan (Z-Anatomy, Sketchfab) juga masih mengutip lisensi lama itu. Lisensi yang berlaku sekarang adalah CC BY 4.0 dari licensor. Detail ada di audit lisensi.

---

## 3. HRA / HuBMAP 3D Reference Organs: sumber sekunder
- Katalog: https://lod.humanatlas.io/ref-organ/ dan https://humanatlas.io/3d-reference-library. Koleksi di NIH 3D: https://3d.nih.gov/collections/hra
- Lisensi setiap organ (metadata JSON-LD): `https://creativecommons.org/licenses/by/4.0/`
- Sumber data: Visible Human Male/Female (NLM). Otak berasal dari Allen Human Brain Reference Atlas (Ding et al. 2016) dan berlisensi CC BY 4.0 sejak v1.3.
- URL GLB terverifikasi (HTTP 200):

| Organ | URL | Ukuran (byte) |
|---|---|---|
| United male v1.10 (semua organ) | https://cdn.humanatlas.io/digital-objects/ref-organ/united-male/v1.10/assets/3d-vh-m-united.glb | 241.633.636 |
| United female v1.10 | https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/3d-vh-f-united.glb | 374.505.632 |
| Skin male v1.4 | https://cdn.humanatlas.io/digital-objects/ref-organ/skin-male/v1.4/assets/3d-vh-m-skin.glb | 19.901.928 |
| Skin female v1.5 | https://cdn.humanatlas.io/digital-objects/ref-organ/skin-female/v1.5/assets/3d-vh-f-skin.glb | 16.003.176 |
| Brain male v1.4 (141 struktur) | https://cdn.humanatlas.io/digital-objects/ref-organ/brain-male/v1.4/assets/3d-allen-m-brain.glb | 11.982.812 |

- Pola URL organ lain: `https://lod.humanatlas.io/ref-organ/<organ>/latest/` (halaman metadata dengan `contentUrl` .glb). Organ yang tersedia: adipose, blood-vasculature, brain, eye L/R, fallopian-tube, heart, intervertebral-disk, kidney L/R, knee L/R, large/small-intestine, larynx, liver, lung, lymph-node, main-bronchus, mammary-gland, manubrium, mouth, omentum, ovary, palatine-tonsil, pancreas, pelvis, placenta, prostate, renal-pelvis, skin, spinal-cord, spleen, sternum, thymus, trachea, ureter, urinary-bladder, uterus, dan united-male/female.
- Kekurangan: tidak ada otot skeletal dan skeleton lengkap. Tubuh VHP berbeda dengan tubuh BP3D, sehingga **perlu registrasi (scale/translate) manual** di Blender jika digabung dalam satu scene. Rekomendasi: kulit HRA ditampilkan sebagai lapisan "permukaan tubuh" dalam mode terpisah, atau disejajarkan dengan landmark (puncak kepala, simfisis pubis, dan bahu).

## 4. Z-Anatomy
- Repo aktif: https://github.com/Z-Anatomy/Models-of-human-anatomy (pushed 2026-10-12). Repo `Z-Anatomy/The-blend` sudah dialihkan (redirect) ke repo yang sama.
- File: `Z-Anatomy.zip` 86.734.957 B (berisi `Startup.blend` 306.838.281 B tak terkompresi, `Anatomy-shortcuts.py`, dan `__init__.py`) di https://raw.githubusercontent.com/Z-Anatomy/Models-of-human-anatomy/master/Z-Anatomy.zip (HTTP 200). Repo yang sama juga berisi `Z-Biomechanics.7z` 21.6 MB dan `TA2.csv` 1.5 MB (daftar Terminologia Anatomica 2).
- App Unity: https://github.com/LluisV/Z-Anatomy (rilis Beta 2022, exe/msi sekitar 172 MB).
- Lisensi: CC BY-SA 4.0. Namun file `License.txt` menyebut sub-aset **"Anatomy of the Inner Ear - University of Dundee - CC-BY-NC-SA 4.0"** dan **"Kidney - by Lissie Cowley - CC-BY-NC 4.0"**. Komponen NC ini tidak kompatibel untuk penggunaan bebas. Definisi diambil dari Wikipedia (CC BY-SA 3.0).
- Kesimpulan: bagus untuk Blender (koleksi per sistem dan label), tetapi share-alike akan "menular" ke aset turunan yang diredistribusi. Komponen NC juga harus dikeluarkan. **Tidak direkomendasikan sebagai sumber aset web.** Untuk PPT, aset ini boleh dipakai dengan atribusi CC BY-SA (render gambar dari model BY-SA tetap dianggap adaptasi; lihat audit), tetapi lebih aman langsung memakai BP3D CC BY 4.0.

## 5. TotalSegmentator
- Repo: https://github.com/wasserth/TotalSegmentator. Kode dan bobot task `total` (117 kelas) berlisensi Apache-2.0. Task `appendicular_bones`, `tissue_types`, `brain_structures`, `heartchambers_highres`, dan lainnya memerlukan lisensi (gratis untuk non-komersial). `brain_aneurysm` berlisensi CC BY-NC 4.0.
- Dataset CT: https://zenodo.org/doi/10.5281/zenodo.6802613 (CC BY 4.0). v2.0.1 berukuran 23.581.218.285 B (https://zenodo.org/records/10047292/files/Totalsegmentator_dataset_v201.zip, HTTP 200). v3.0.0 (2026-09-10) berukuran 37.4 GB. Dataset MR: https://zenodo.org/doi/10.5281/zenodo.11367004
- Output berupa mask NIfTI, jadi mesh harus dibuat sendiri (marching cubes di 3D Slicer atau skimage, lalu smoothing dan decimation). Hasilnya per pasien dan FOV-nya terbatas.
- Kegunaan: mengisi gap **kelenjar tiroid** (label `thyroid_gland`) jika diperlukan. Sumbernya cukup **satu subjek** dari dataset (CC BY 4.0), bukan inferensi pada data pasien sendiri.

## 6. OpenAnatomy / SPL atlases
- Situs: https://openanatomy.org/. Lisensi: **3D Slicer License Part B** (https://www.slicer.org/LICENSE).
- ZIP (HTTP 200): brain-2017-01.zip 197.913.214 B; abdomen-2016-09.zip 34.861.066 B; liver-2014-02-20.zip 39.035.218 B; inner-ear-2018-02.zip 190.136.365 B; knee-2016-09.zip 80.934.412 B. Semua berada di `https://www.openanatomy.org/atlases/nac/`. Mauritania thorax (`/atlases/macbioidi/mauritania/thorax-2020-11-15.zip`) mengembalikan **404**.
- GitHub mirror otak: https://github.com/mhalle/spl-brain-atlas
- Atlas ini berguna untuk telinga dalam (gap BP3D) dan otak detail. Koordinatnya tidak sejajar dengan BP3D.

## 7. NIH 3D
- https://3d.nih.gov/terms: lisensi ditetapkan **per entri** oleh pengunggah (PD, CC BY, CC BY-NC-SA, CC BY-NC-ND). NIH tidak menegakkan lisensi. Dilarang mempublikasikan data wajah yang dapat diidentifikasi, dan dilarang mengimplikasikan endorsement NIH.
- Koleksi HRA di NIH 3D identik dengan sumber HRA di atas. Entri lain harus diaudit satu per satu, jadi tidak cocok sebagai sumber whole-body.

## 8. NLM Visible Human Project
- Sejak Juli 2019 lisensi diganti dengan **NLM Terms and Conditions**. Tidak perlu registrasi atau lisensi. Data tersedia di https://data.lhncbc.nlm.nih.gov/public/Visible-Human/ (Male-Images, Female-Images, Sample-Data; HTTP 200).
- Atribusi: "Courtesy of the U.S. National Library of Medicine". Dilarang mengimplikasikan endorsement.
- Data hanya berupa citra (cryosection/CT/MRI) tanpa mesh. Data ini relevan sebagai basis HRA.

## 9. 3D Slicer Sample Data
- Volume CT/MR contoh (https://github.com/Slicer/SlicerTestingData/releases). Bukan atlas mesh dan lisensinya per dataset. Hanya untuk uji pipeline, tidak untuk dirilis.

## 10. Sketchfab (institusi)
- Model University of Dundee (CAHID/School of Medicine) umumnya berlisensi **CC BY-NC-SA 4.0** dan/atau bertag **NoAI**. Beberapa merupakan turunan BP3D. Hanya "Cranial Nerves and Foramina" yang disebut CC BY 4.0 (lewat atribusi Z-Anatomy), dan itu perlu dicek di halaman model.
- Kesimpulan: tidak dipakai, kecuali satu-dua model CC BY yang lisensinya sudah diverifikasi langsung di halaman model.

## 11. Lainnya
- Visible Korean Human (KISTI/Ajou): akses lewat permohonan dan lisensi tidak terbuka secara terverifikasi. **Jangan dipakai.**
- Anatomography (lifesciencedb.jp/bp3d) adalah viewer di atas BP3D. Gambar dari layanan ini tunduk pada lisensi BP3D.

---

## 12. Rencana teknis yang disarankan (untuk agen build)
1. Unduh `isa_BP3D_4.0_obj_99.zip` beserta keempat tabel (`isa_/partof_` parts_list_e, element_parts, inclusion_relation_list) ke folder `assets_raw/bp3d/` yang terpisah (data tidak tepercaya; jangan jalankan skrip dari dalam folder itu).
2. Bangun index: FJ, lalu nama leaf (konsep compound terkecil), FMA ID, dan sistem (dipetakan dari pohon inclusion ke akar seperti "skeletal system", "muscular system", "cardiovascular system", dan seterusnya), lalu region.
3. Impor OBJ ke Blender (satu objek per FJ, nama = FJ, custom props = FMA/nama/sistem). Lakukan decimation adaptif dan ekspor GLB per sistem atau per region (Draco/meshopt), plus `manifest.json` untuk pencarian.
4. Tambahkan kulit HRA (skin-male v1.4) sebagai lapisan permukaan opsional yang sudah diregistrasi ke BP3D. Untuk otak detail, gunakan HRA brain-male (opsional).
5. Gap (tiroid, limfatik, organ wanita, telinga dalam, saraf perifer) ditandai di UI sebagai "tidak tersedia di dataset". Bisa juga diisi bertahap: HRA lymph-node/uterus/ovary dan SPL inner ear.
6. Halaman `/credits` dan file `ATTRIBUTION.md` dibuat sesuai `ANATOMY_LICENSE_AUDIT.md`.
