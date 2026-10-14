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

## Kode
Kode sumber aplikasi berlisensi MIT (lihat `LICENSE`).

## Font
Source Serif 4 dan IBM Plex Sans, SIL Open Font License 1.1, melalui paket @fontsource-variable.
