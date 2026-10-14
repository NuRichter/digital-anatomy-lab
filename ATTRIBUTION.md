# Atribusi dan lisensi aset

## Model anatomi 3D (`public/models/*.glb`, `public/manifest.json`, `public/fallback.jpg`)

**BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.**

- Sumber: DBCLS Life Science Database Archive, BodyParts3D rilis 4.0 (2013), berkas `isa_BP3D_4.0_obj_99.zip`
  dan tabel `*_element_parts.txt`, `*_inclusion_relation_list.txt`, `*_parts_list_e.txt`
  (https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html).
- Lisensi: CC BY 4.0, https://creativecommons.org/licenses/by/4.0/ (bagian "License" README DBCLS, diperbarui 25 Februari 2025).
  Header berkas OBJ rilis 4.0 masih mencantumkan CC BY-SA 2.1 Japan; atribusi di atas memenuhi kedua lisensi,
  dan turunan di repositori ini tidak menambahkan pembatasan.
- Rujukan ilmiah: Mitsuhashi N, Fujieda K, Tamura T, Kawamoto S, Takagi T, Okubo K. (2009).
  BodyParts3D: 3D structure database for anatomical concepts. *Nucleic Acids Research*, 37(Database issue), D782–D785.

### Perubahan yang dilakukan
1. 2.234 mesh OBJ (satuan mm) diimpor ke Blender 5.2, diskalakan ke meter, dan diberi metadata FMA.
2. 18 mesh tanpa nama konsep dikeluarkan; 2.216 mesh diklasifikasikan ke sistem anatomi secara otomatis berdasarkan nama FMA
   dan relasi is-a/part-of (skrip di `pipeline/`).
3. Mesh disederhanakan (decimation 12–50% per sistem; struktur kecil dipertahankan minimal ±120 segitiga),
   diekspor per sistem ke glTF binary, lalu dikompresi dengan meshopt (gltf-transform 4.5.1).
4. Material asli tidak dipakai; warna diberikan di aplikasi mengikuti konvensi atlas.

## Organ detail (`public/hra/*.glb`, `public/hra/hra.json`)

**3D Reference Organs from the Human Reference Atlas (HRA) v2.5, HuBMAP; models by Kristen Browne and Heidi Schlehlein, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/), https://humanatlas.io/3d-reference-library. Created from Visible Human Project data provided by the U.S. National Library of Medicine; brain model based on the Allen human brain reference atlas (Ding et al. 2016). Modified: compressed (meshopt), female organs merged into one file.**

- Rujukan: Börner K, Blood PD, Silverstein JC, et al. Human BioMolecular Atlas Program (HuBMAP): 3D Human Reference Atlas construction and usage. Nature Methods 22(4):845–860 (2025). https://doi.org/10.1038/s41592-024-02563-5
- Diambil 2026-10-14 dari CDN resmi HRA (`cdn.humanatlas.io/digital-objects/ref-organ/...`); URL per organ dan DOI per komponen tercatat di `hra.json`.
- Organ-organ ini berasal dari donor/sumber yang berbeda dengan BodyParts3D dan ditampilkan sebagai model terpisah.
- Perubahan: kompresi meshopt (gltf-transform 4.5.1), lima komponen organ reproduksi wanita (uterus, ovarium kiri/kanan,
  tuba uterina kiri/kanan) digabung ke satu berkas dengan koordinat asli. Model kelenjar payudara HRA tidak dipakai karena
  dipahat manual, bukan dari data Visible Human.

## Demo 3D Slicer (`public/demo/**`)

- Data: CTChest dan CTACardio dari Sample Data bawaan 3D Slicer (https://www.slicer.org). Asal klinis kedua dataset tidak
  didokumentasikan dalam modul Sample Data; pengembang Slicer menyatakan sample data bebas dipakai
  (https://discourse.slicer.org/t/license-question-about-the-use-of-the-sample-data/30258).
- Tangkapan layar, angka, model `tulang-ctchest.glb`, dan volume `ctchest-3x.u8.gz` dihasilkan dengan menjalankan
  3D Slicer 5.12.4 secara otomatis (skrip `slicer_demo.py`) pada 14 Oktober 2026. Volume web diperkecil 3x in-plane dan
  dikodekan 8-bit (galat rata-rata 1,7 HU); model tulang disederhanakan dari 1.426.348 menjadi 150.000 segitiga.
- 3D Slicer: lisensi BSD-style (Slicer License). Rujukan: Fedorov A, dkk. (2012). Magnetic Resonance Imaging, 30(9), 1323–1341.

## Kode
Kode sumber aplikasi berlisensi MIT (lihat `LICENSE`).

## Font
Source Serif 4 dan IBM Plex Sans, SIL Open Font License 1.1, melalui paket @fontsource-variable.
