# Pembaruan Sumber Model Anatomi 3D (riset 2026-10-14)

Konteks: proyek saat ini memakai BodyParts3D v4.0 (DBCLS, CC BY 4.0, satu pria dewasa, data sekitar 2009). Riset ini mencari sumber model 3D anatomi manusia **terbaru (2022–2026)** dengan lisensi terbuka yang boleh dipakai di situs web publik dan slide, dengan atribusi.

Semua klaim di bawah berasal dari URL yang benar-benar dibuka atau diuji (HTTP HEAD/GET) pada 2026-10-14. Hal yang tidak bisa dipastikan ditandai **tidak diketahui**.

---

## 1. HRA 3D Reference Object Library (HuBMAP / Human Reference Atlas)

### Rilis dan tanggal
- Rilis HRA terbaru di katalog digital-object adalah **HRA v2.5**, dengan `dateCreated` **2026-08-10** dan lisensi `https://creativecommons.org/licenses/by/4.0/`. Sumber: https://cdn.humanatlas.io/digital-objects/collection/hra/v2.5/
- Daftar versi koleksi `hra/` adalah v1.0–v1.4 dan v2.0–v2.5. Sumber: https://cdn.humanatlas.io/digital-objects/catalog.json (JSON 15,5 MB)
- Repo GitHub lama `hubmapconsortium/ccf-releases` berdeskripsi "HRA Releases (up to and including v2.0)" dan terakhir di-push 2024-06-24. Rilis sesudah v2.0 tidak ada di sana, tetapi di CDN. Sumber: https://api.github.com/repos/hubmapconsortium/ccf-releases
- Repo sumber `hubmapconsortium/ccf-3d-reference-object-library` berlisensi CC-BY-4.0 (berkas LICENSE berbunyi "Attribution 4.0 International") dan terakhir di-push 2023-07-18. Repo ini tidak lagi menjadi kanal rilis utama. Sumber: https://github.com/hubmapconsortium/ccf-3d-reference-object-library dan https://raw.githubusercontent.com/hubmapconsortium/ccf-3d-reference-object-library/main/LICENSE
- Metadata per organ menyatakan `license: https://creativecommons.org/licenses/by/4.0/`, `publisher: HuBMAP`, dan pembuat utama Kristen Browne (ORCID 0000-0003-4066-7531). United-male juga menyebut Heidi Schlehlein. Sumber: https://cdn.humanatlas.io/digital-objects/ref-organ/heart-male/v1.3/metadata.json dan https://cdn.humanatlas.io/digital-objects/ref-organ/united-male/v1.10/graph.json

### Daftar organ (API `reference-organs`, 81 entri)
Sumber: https://apps.humanatlas.io/api/v1/reference-organs. Semua entri berformat `model/gltf-binary` (GLB) dan berunit milimeter.

| Organ | Jenis kelamin | Versi | Prefiks file (sumber data) |
|---|---|---|---|
| adipose (subkutan abdomen) | F, M | v1.0 (2025-12) | 3d-vh-* |
| blood vasculature | F, M | v1.3 | 3d-vh-* |
| brain | F, M | v1.4 | **3d-allen-*** (Allen, bukan VH) |
| epiploic appendage colon transversum | F, M | v1.0 (2026-06) | 3d-vh-* |
| eye L/R | F, M | v1.3 | 3d-vh-* |
| fallopian tube L/R | F | v1.2 | 3d-vh-f |
| heart | F, M | v1.3 | 3d-vh-* |
| intervertebral disk | F, M | v1.0 (2025-12) | 3d-vh-* |
| kidney L/R | F, M | v1.3 | 3d-vh-* |
| knee L/R | F v1.3, M v1.2 | | 3d-vh-* |
| large intestine | F, M | v1.3 | **3d-sbu-*** (bukan VH) |
| larynx, main bronchus, trachea | F, M | v1.1 | 3d-vh-* |
| liver | F, M | v1.2 | 3d-vh-* |
| lung | F, M | v1.4 | 3d-vh-* |
| lymph node | F, M | v1.4 | **3d-nih-*** (satu kelenjar contoh, bukan sistem limfe seluruh tubuh) |
| mammary gland L/R | F | v1.1 | 3d-vh-f |
| manubrium, sternum | F | v1.0 | 3d-vh-f |
| mouth | F, M | v1.0 (2025-06) | 3d-vh-* |
| omentum | F, M | v1.0 (2026-06) | 3d-vh-* |
| ovary L/R | F | v1.3 | 3d-vh-f |
| palatine tonsil L/R | F, M | v1.2 | 3d-vh-* |
| pancreas | F, M | v1.3 | 3d-vh-* |
| pelvis (tulang) | F, M | v1.3 | 3d-vh-* |
| placenta full-term | F | v1.1 | 3d-vh-f |
| prostate | M | v1.2 | 3d-vh-m |
| renal pelvis L/R | F, M | v1.0 | 3d-vh-* |
| skin | F v1.5, M v1.4 | | 3d-vh-* |
| small intestine | F, M | v1.2 | 3d-vh-* |
| spinal cord | F, M | v1.1 | 3d-vh-* |
| spleen, thymus | F, M | v1.3 | 3d-vh-* |
| ureter L/R | F, M | v1.2 | 3d-vh-* |
| urinary bladder | F, M | v1.2 | 3d-vh-* |
| uterus | F | v1.2 | 3d-vh-f |

Katalog juga memuat set gabungan **united-female v1.10** dan **united-male v1.10**, yaitu satu GLB berisi semua organ, ditambah varian lymph-node L/R.

**Organ yang tidak ada** di katalog v2.5: thyroid, parathyroid, saraf perifer, dan otot rangka sebagai organ. Pencarian string "thyroid" dan "nerve" di catalog.json tidak menemukan ref-organ.

### Sumber data
- Makalah *Nature Methods* 2025 (22(4):845–860, DOI 10.1038/s41592-024-02563-5) menyatakan: "Most 3D reference organs were modeled using the male and female datasets from the Visible Human Project", dengan kredit "the Visible Human Project provided by the National Library of Medicine". Makalah yang sama menyebut 65 objek referensi dan 1.192 struktur 3D (HRA v2.0). Sumber: https://pmc.ncbi.nlm.nih.gov/articles/PMC11978508/
- Pengecualian terlihat dari prefiks nama file: brain (Allen), large intestine (SBU), dan lymph node (NIH, dengan nama node "Yao_*").

### Sistem koordinat bersama
- Setiap organ punya `placement` lokal dan global terhadap `hra-ccf-body`. Contohnya, heart-male v1.3 memakai rotasi x −90°, translasi (43.4, −423.4, 15.0) mm, dan skala 1. Artinya organ VH-Male bisa ditempatkan konsisten dalam satu tubuh referensi. Sumber: https://cdn.humanatlas.io/digital-objects/ref-organ/heart-male/v1.3/graph.json
- Makalah menyebut "united file" sebagai "a GLB 3D object that contains all the modeled organs in the HRA" (PMC11978508).

### URL unduhan langsung (diuji dengan `curl -sI`, semua HTTP 200, tanpa login)
| File | Ukuran |
|---|---|
| https://cdn.humanatlas.io/digital-objects/ref-organ/united-male/v1.10/assets/3d-vh-m-united.glb | 241,6 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/3d-vh-f-united.glb | 374,5 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/heart-male/v1.3/assets/3d-vh-m-heart.glb | 4,07 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/brain-male/v1.4/assets/3d-allen-m-brain.glb | 11,98 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/skin-male/v1.4/assets/3d-vh-m-skin.glb | 19,9 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/lymph-node-female/v1.4/assets/3d-nih-f-lymph-node.glb | 4,54 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/pelvis-female/v1.3/assets/3d-vh-f-pelvis.glb | 1,59 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/uterus-female/v1.2/assets/3d-vh-f-uterus.glb | 0,98 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/knee-male-left/v1.2/assets/3d-vh-m-knee-l.glb | 0,44 MB |
| https://cdn.humanatlas.io/digital-objects/ref-organ/spinal-cord-male/v1.1/assets/3d-vh-m-spinal-cord.glb | 0,49 MB |

Pola URL lainnya: `https://cdn.humanatlas.io/digital-objects/ref-organ/<nama>/<versi>/assets/<file>.glb`. Nama file per organ ada di respons API di atas.

### Detail mesh (diukur lokal dari GLB yang diunduh)
- heart-male: 14 mesh, ±164 ribu segitiga, dengan node seperti katup mitral/trikuspid/aorta/pulmonal dan otot papilaris.
- pelvis-female: 14 mesh, ±87 ribu segitiga (sacrum, coccyx, pubis kompakta/spongiosa, ilium, dan lain-lain).
- lymph-node-female: 7 mesh, ±255 ribu segitiga (kapsul, folikel, medula, parakorteks, pembuluh limfe aferen/eferen). Ini model skematik satu kelenjar.
- Ketiganya tanpa kompresi Draco, generator "babylon.js glTF exporter for Autodesk MAYA 2023.2".

### Atribusi
- Halaman NIH 3D untuk "Body, Male" (3DPX-021022) berlisensi CC-BY dan menyatakan model "was created using data from the Visible Human Male, provided by the National Library of Medicine". Sumber: https://3d.nih.gov/entries/21022
- Teks atribusi resmi dalam satu kalimat **tidak ditemukan**. Usulan yang memenuhi CC BY 4.0: "3D Reference Organs, Human Reference Atlas v2.5 (HuBMAP; K. Browne et al.), CC BY 4.0, https://humanatlas.io. Data dari Visible Human Project®, U.S. National Library of Medicine. Börner et al., Nat Methods 22:845–860 (2025)."

### Risiko
- Versi pria dan wanita berasal dari dua individu VH berbeda. VH-Male bukan individu yang sama dengan donor BodyParts3D. Jangan digabung ke model BodyParts3D seolah satu kadaver.
- Brain, usus besar, dan lymph node berasal dari sumber lain.
- File united terlalu besar untuk web (242–375 MB). Gunakan GLB per organ.

---

## 2. Z-Anatomy: status lisensi (dikonfirmasi)
- Dokumen lisensi resmi yang ditautkan dari LICENSE repo menyatakan: "All the code and content shared by 'Z-Anatomy' is under CC-BY-SA 4.0 license … ShareAlike: Derivative works must be shared under CC-BY-SA 4.0." Model referensi yang dikutip di dalamnya mencakup "Anatomy of the Inner Ear – University of Dundee – **CC-BY-NC-SA 4.0**" dan "Kidney – Lissie Cowley – **CC-BY-NC 4.0**". Sumber: https://docs.google.com/document/d/1peWW_7IiVgTTAwcI_auv38YSJ6qGWRuTMxzzhkRpXIk/ (export txt) dan https://raw.githubusercontent.com/LluisV/Z-Anatomy/PC-Version/LICENSE
- Repo `LluisV/Z-Anatomy` terakhir di-push 2024-12-25, dengan SPDX "NOASSERTION". Sumber: https://api.github.com/repos/LluisV/Z-Anatomy
- Kesimpulan: tetap CC BY-SA 4.0 dengan sebagian referensi NC. Keputusan menolaknya sebelumnya masih valid.

## 3. TotalSegmentator dataset (Zenodo)
- **Versi terbaru: 3.0.0, terbit 2026-09-10**, CC BY 4.0, berisi 1.939 CT dan 117 struktur. Rilis ini menambah 291 CT pediatrik dan memperbaiki label (tulang/femur lebih presisi, kesalahan label vertebra diperbaiki). Sumber: https://zenodo.org/records/22688904 (via API https://zenodo.org/api/records/22688904)
- File `Totalsegmentator_dataset_v300.zip` berukuran **37,4 GB**. HEAD https://zenodo.org/api/records/22688904/files/Totalsegmentator_dataset_v300.zip/content mengembalikan 200 dengan content-length 37.415.622.057, tanpa login.
- Versi sebelumnya v2.0.1 (2023-10-27) berukuran 23,6 GB, CC BY 4.0. Sumber: https://zenodo.org/records/10047292
- Subset kecil v2.0.1 (102 subjek), `Totalsegmentator_dataset_small_v201.zip`, berukuran **3,24 GB**, CC BY 4.0. Sumber: https://zenodo.org/api/records/10047263
- Kelayakan: data berupa NIfTI (CT dan mask). Mesh perlu dibuat sendiri (marching cubes dan smoothing, misalnya dengan 3D Slicer atau Python). Resolusi CT klinis lebih kasar daripada model artistik, dan pasien bisa memiliki patologi. Satu subjek memberi satu individu nyata yang konsisten, tetapi butuh waktu pemrosesan dan QC berjam-jam. **Tidak realistis untuk hari ini.**

## 4. Sumber lain

### Open3DModel (AnatomyTOOL, NL/BE), 2025–2026
- Model pria berbasis "BodyParts and Z-Anatomy", berlisensi "Creative Commons Attribution ShareAlike (CC BY SA)". Milestone: skeleton, upper limb, dan lower limb (Juli 2025); pelvis dan perineum (Des 2025); otot thorax, abdomen, dan punggung (Mar 2026); spinal cord (Sep 2026). Sumber: https://anatomytool.org/open3dmodel
- Unduhan (badge CC BY-SA 4.0; viewer GPL3) tersedia dalam format .blend, .obj, dan .glb. Sumber: https://anatomytool.org/open3dmodel-create. HEAD 200, tanpa login:
  - https://caskanatomy.info/open3dmodelfiles/overview-skeleton/overview-skeleton-glb.zip (3,1 MB)
  - https://caskanatomy.info/open3dmodelfiles/upper-limb/upper-limb-glb.zip (6,2 MB)
  - https://caskanatomy.info/open3dmodelfiles/lower-limb/lower-limb-glb.zip (6,0 MB, diubah 2026-09-02)
  - https://caskanatomy.info/open3dmodelfiles/overview-colored-skull/overview-colored-skull-glb.zip (1,0 MB)
- Isi upper-limb.glb (diperiksa lokal): 532 mesh, ±1,37 juta segitiga, **kompresi Draco** (perlu DRACOLoader di Three.js). Model ini **berisi saraf perifer**: median, ulnar, radial beserta cabang, musculocutaneous, axillary, long thoracic, suprascapular, dan lain-lain.
- Risiko: lisensi **ShareAlike**, sehingga turunannya wajib CC BY-SA. Tekstur otot dikreditkan dari karya CC BY-NC-SA 4.0. Geometrinya sebagian turunan BodyParts3D/Z-Anatomy, jadi bukan data "baru" dari kadaver lain.

### MedShapeNet
- Halaman proyek: 106.101 shape, unduh lewat indeks + `wget`, tanpa login. Halaman ini **tidak menyatakan lisensi**. Sumber: https://mml.ikim.nrw/ait/projects/medshapenet/
- Tabel sumber di makalah (arXiv v5, 12 Des 2023) bercampur: banyak CC BY 4.0 dan CC0, tetapi ada juga EMIDEC (CC BY-NC-SA), LNDb dan 3DTeethSeg (CC BY-NC-ND), LUMIERE (CC BY-NC), ToothFairy (CC BY-SA), GLISRT (TCIA Restricted), HCP (Data Use Terms), dan beberapa "not listed". Sumber: https://arxiv.org/html/2308.16139v5
- Risiko: lisensi harus dicek per shape. Sebagian besar berupa organ terisolasi dari pasien berbeda. Tidak cocok sebagai sumber cepat.

### Open Anatomy Project (SPL)
- Ada enam atlas (SPL/NAC Brain, Liver, Inner Ear, Knee, Abdomen, dan Mauritanian Thoracic). Halaman utama tidak menyebut lisensi, tanggal, atau unduhan mesh. Halaman atlas brain mengembalikan 404. Sumber: https://www.openanatomy.org/. Lisensi dan unduhan: **tidak diketahui** (tidak terverifikasi).

### Visible Korean
- Model permukaan (642 struktur, STL dalam PDF) dari kadaver pria. Sumber: https://pmc.ncbi.nlm.nih.gov/articles/PMC3410230. Record KISTI memakai Korea Open Government License. Sumber: https://repository.kisti.re.kr/handle/10580/13787?mode=full
- Lisensi file 3D-nya sendiri **tidak diketahui**, dan datanya lama (sekitar 2009–2012), bukan rilis 2022–2026.

### NIH 3D
- Menghosting salinan objek HRA (misalnya "Body, Male" 3DPX-021022, CC-BY, dipublikasikan 10/8/26). Sumber: https://3d.nih.gov/entries/21022. Satu URL hasil pencarian (3DPX-021627) mengembalikan 404 saat dibuka.
- Model NIH 3D lain memiliki lisensi per entri. Tidak diaudit di sini.

### Sketchfab dan koleksi universitas
- Tidak diaudit dalam waktu yang tersedia. Lisensi per model berbeda-beda (status: tidak diketahui).

---

## 5. Perbandingan ringkas

| Sumber | Lisensi | NC/SA? | Rilis terbaru | Cakupan relevan | Unduhan praktis |
|---|---|---|---|---|---|
| HRA 3D Ref. Organs | CC BY 4.0 | Tidak | v2.5, 2026-08-10 | Organ VH-M dan VH-F, termasuk organ reproduksi wanita, kulit, spinal cord, knee, pelvis, eye, 1 lymph node; tanpa thyroid/saraf/otot | Ya, GLB per organ 0,4–20 MB, CDN, tanpa login |
| Z-Anatomy | CC BY-SA 4.0 (+ referensi NC) | SA, sebagian NC | repo 2024-12 | Seluruh tubuh | Ya, tetapi lisensi bermasalah |
| Open3DModel | CC BY-SA 4.0 | SA (tekstur NC-SA) | 2025–2026-09 | Skeleton, ekstremitas + **saraf perifer**, otot | Ya, GLB zip 1–6 MB, Draco |
| TotalSegmentator | CC BY 4.0 | Tidak | v3.0.0, 2026-09-10 | 117 struktur CT nyata (organ, tulang, otot besar, pembuluh) | 37 GB / subset 3,2 GB; perlu meshing |
| MedShapeNet | Campuran per sumber | Sebagian NC/ND/SA | arXiv v5 2023; situs 2026 | 100 ribu+ shape terisolasi | Ya, tetapi lisensi per shape |
| Open Anatomy (SPL) | Tidak diketahui | ? | ? | Brain, liver, knee, abdomen, inner ear | Tidak terverifikasi |
| Visible Korean | Tidak diketahui untuk mesh | ? | sekitar 2009–2012 | 642 struktur | Tidak praktis |

---

## 6. Rekomendasi untuk hari ini (kuliah pukul 16:00, sisa ±6 jam)

1. **Pakai HRA 3D Reference Organs (CC BY 4.0) sebagai "panel organ detail" terpisah**, bukan dicampur ke tubuh BodyParts3D. Organ yang disarankan: heart-male (katup dan otot papilaris), kidney, lung, uterus/ovary/fallopian tube (female), pelvis-female, eye, knee, dan lymph-node (diberi label "model skematik satu kelenjar"). Unduh GLB per organ dari CDN (total sekitar <50 MB), muat dengan GLTFLoader biasa (tanpa Draco), dan render untuk slide.
2. **Label tegas** di situs dan slide, misalnya: "Model organ dari Human Reference Atlas v2.5 (Visible Human Female/Male, NLM). Individu berbeda dari model tubuh BodyParts3D." Tambahkan atribusi CC BY seperti usulan di §1.
3. Jangan memakai file united (242–375 MB) di Vercel. Gunakan file per organ saja.
4. **Celah yang tetap ada**: thyroid/parathyroid dan otot (rectus abdominis dan lain-lain) tidak tersedia di HRA. Saraf perifer hanya ada di Open3DModel (CC BY-SA, berbasis BodyParts3D/Z-Anatomy). Jika ingin dipakai hari ini, taruh di halaman/slide terpisah dengan atribusi dan pernyataan CC BY-SA, serta hindari tekstur CC BY-NC-SA. Kalau tidak, nyatakan celah ini secara jujur di kuliah.
5. **Setelah kuliah** (bukan hari ini): bangun mesh dari satu subjek TotalSegmentator v3.0.0 (CC BY 4.0) sebagai contoh "anatomi pasien nyata dari CT", lengkap dengan QC, dan tetap diberi label sebagai individu tersendiri.

---

## Implementasi 2026-10-14 (aset HRA v2.5 untuk web dan slide)

Sumber diverifikasi dari katalog https://apps.humanatlas.io/api/v1/reference-organs, `metadata.json` per organ (`was_derived_from`), dan koleksi https://cdn.humanatlas.io/digital-objects/collection/hra/v2.5/metadata.json. Semua versi organ di bawah termasuk dalam HRA v2.5. Lisensi semuanya `https://creativecommons.org/licenses/by/4.0/`.

**Diunduh** ke `C:\Users\NuRichter\anat\hra\raw\<organ>\` (GLB, `metadata.json`, `graph.json`), ukuran asli:
heart-male v1.3 (4,07 MB), kidney-male-left v1.3 (1,54 MB), lung-male v1.4 (10,94 MB), uterus-female v1.2 (0,98 MB), ovary-female-left/right v1.3 (9 KB masing-masing), fallopian-tube-female-left/right v1.2 (0,34/0,33 MB), eye-male-right v1.3 (20,70 MB), knee-male-left v1.2 (0,44 MB), larynx-male v1.1 (0,34 MB), brain-male v1.4 (11,98 MB), liver-male v1.2 (1,14 MB), spleen-male v1.3 (0,54 MB), mammary-gland-female-left v1.1 (13,73 MB).

**Dihasilkan** di `website/public/hra/`, dengan `gltf-transform meshopt --level medium --quantize-position 14 --quantize-normal 8`. Tidak ada yang perlu disederhanakan karena semua file < 6 MB. Koordinat asli dipertahankan.

| File | Byte | Segitiga | Bagian | Sumber data |
|---|---|---|---|---|
| heart-male.glb | 792.640 | 164.119 | 14 | VH Male |
| kidney-male-left.glb | 451.936 | 83.692 | 22 | VH Male |
| lung-male.glb | 2.183.456 | 224.765 | 58 | VH Male |
| female-reproductive.glb (gabungan uterus + 2 ovarium + 2 tuba) | 414.888 | 77.835 | 21 | VH ("Visible Human Dataset", sex Female) |
| eye-male-right.glb | 4.949.164 | 346.630 | 23 | VH Male |
| knee-male-left.glb | 144.712 | 22.892 | 20 | VH Male |
| larynx-male.glb | 98.816 | 13.238 | 7 | VH Male |
| brain-male.glb | 3.824.952 | 656.268 | 283 | Allen brain atlas (Ding et al. 2016), diskalakan ke VH |
| liver-male.glb | 331.224 | 60.369 | 26 | VH Male |
| spleen-male.glb | 140.180 | 16.872 | 5 | VH Male |
| mammary-gland-female-left.glb | 2.890.088 | 270.799 | 8 | **model pahatan kustom, bukan VH** |
| **Total** | **16.222.056** | | | |

- `website/public/hra/hra.json` berisi metadata per aset: komponen, DOI per organ (10.48539/HBM…), kreator, bbox_mm, dan daftar bagian (maks. 80; otak punya 283), ditambah `attribution`, `citation` (Börner et al. 2025, diverifikasi via Crossref), dan `retrieved`.
- Unit vertex di GLB adalah **meter** (konvensi glTF), bukan mm. `bbox_mm` = koordinat ×1000. Sumbu: +X kiri pasien, +Y superior, +Z anterior.
- File web memakai `EXT_meshopt_compression`, jadi loader butuh `MeshoptDecoder`.
- Render 1600×1600 (Cycles OPTIX, 128 sampel, AgX) ada di `C:\Users\NuRichter\anat\hra\renders\<slug>.png` (latar #07090C) dan `<slug>_alpha.png` (transparan), termasuk `heart-male_xray.png` (dinding semi-transparan; katup dan otot papilaris terlihat). Ginjal, mata, dan payudara dirender dengan lapisan luar semi-transparan. Lutut dibingkai pada sendi.
- Skrip: `C:\Users\NuRichter\anat\scripts\hra_inspect.py`, `hra_build.py`, `hra_manifest.py`, `hra_render.py`, `hra_render_all.py`.
- Catatan warna: warna material dibiarkan seperti di GLB. Akibatnya areola/puting payudara berwarna biru (material "Skin_mat" atlas), dan lemak payudara kuning.
