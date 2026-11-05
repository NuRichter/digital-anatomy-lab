# 3D Toolchain: Digital Anatomy Laboratory

Agen 4 (3D Toolchain & Asset Engineer) dan Agen 7 (Three.js & Performance Architect)
Tanggal riset: 2026-10-14. Versi npm diambil langsung dari `registry.npmjs.org`. Opsi CLI diambil dari `--help` (gltf-transform 4.5.1) dan dari introspeksi RNA operator di Blender 5.2.2 LTS yang ada di mesin ini.

---

## 1. Ringkasan versi yang direkomendasikan (pin persis)

| Paket / Tool | Versi pin | Rilis | Lisensi | Peran |
|---|---|---|---|---|
| `three` | **0.186.1** (r186) | 2026-09-24 | MIT | Renderer WebGL2, GLTFLoader, BatchedMesh |
| `@types/three` | 0.186.0 | 2026-09-11 | MIT | Tipe TS (versi mayor/minor sama dengan three) |
| `three-mesh-bvh` | **0.9.16** | 2026-10-08 | MIT | BVH untuk raycast cepat (termasuk BatchedMesh) |
| `meshoptimizer` | **1.3.0** | 2026-09-25 | MIT | `meshoptimizer/decoder` (MeshoptDecoder WASM) di runtime |
| `vite` | **8.3.4** | 2026-10-08 | MIT | Dev server dan bundler (Rolldown) |
| `@vitejs/plugin-react` | **6.1.2** | 2026-10-05 | MIT | Plugin React untuk Vite 8 (peer `vite ^8.0.0`) |
| `create-vite` | 9.2.1 | n/a | MIT | Scaffolding `react-ts` |
| `react` / `react-dom` | **19.3.0** | 2026-09-09 | MIT | UI |
| `typescript` | **~6.0.3** (lihat catatan) | n/a | Apache-2.0 | Type-check (`tsc -b`) |
| `@gltf-transform/cli` | **4.5.1** | 2026-09-28 | MIT | Pipeline weld/simplify/dedup/meshopt (membundel meshoptimizer ~1.2.0 sebagai encoder) |
| `@playwright/test` | 1.64.0 | 2026-10-07 | Apache-2.0 | Uji E2E dan pengukuran FPS |
| `lighthouse` | 13.5.0 | 2026-09-18 | Apache-2.0 | Audit performa |
| Blender | **5.2.2 LTS** (portable) | n/a | GPL-3.0-or-later (aset keluaran milik pengguna) | Impor OBJ, pembersihan, ekspor GLB, render PPT |
| Node.js | 24.20.0 (portable) | n/a | MIT | Runtime tooling (Vite 8 butuh `^20.19.0 \|\| >=22.12.0`) |
| Python | 3.10 | n/a | PSF | Skrip manifest dan ingest |
| ImageMagick / ffmpeg | terpasang (IM 7.1.2, ffmpeg 9.0.2) | n/a | ImageMagick License / LGPL-GPL | Pascaproses render PPT (montage, turntable mp4) |
| `@react-three/fiber` | 9.8.1 (TIDAK dipakai, lihat sec. 5) | 2026-09-24 | MIT | n/a |

**Catatan TypeScript.** `npm latest` untuk `typescript` sudah **7.0.2** (port native/Go). Template resmi `create-vite` `template-react-ts` (cabang `main`) masih mem-pin `"typescript": "~6.0.2"`. Rekomendasi: ikuti template, pakai **`~6.0.3`**. Uji TS 7 di branch terpisah setelah template resmi naik versi.

**Catatan meshoptimizer.** Decoder yang dibundel three (`three/addons/libs/meshopt_decoder.module.js`) "Built from meshoptimizer 1.1". Encoder di gltf-transform 4.5.1 adalah meshoptimizer 1.2.0. Format bitstream `EXT_meshopt_compression` kompatibel ke belakang, jadi decoder bawaan three cukup. Supaya decoder tidak tertinggal dari encoder, pakai `meshoptimizer@1.3.0` (`import { MeshoptDecoder } from 'meshoptimizer/decoder'`).

### Template `package.json` (inti)
```json
{
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "assets": "node tools/build-assets.mjs",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "three": "0.186.1",
    "three-mesh-bvh": "0.9.16",
    "meshoptimizer": "1.3.0"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@types/three": "0.186.0",
    "@vitejs/plugin-react": "6.1.2",
    "typescript": "~6.0.3",
    "vite": "8.3.4",
    "@gltf-transform/cli": "4.5.1",
    "@playwright/test": "1.64.0",
    "lighthouse": "13.5.0"
  }
}
```

Scaffold:
```powershell
$env:PATH = "C:\Users\NuRichter\tools\node-v24.20.0-win-x64;$env:PATH"
npm create vite@9.2.1 anatomy-lab -- --template react-ts
cd anatomy-lab
npm i three@0.186.1 three-mesh-bvh@0.9.16 meshoptimizer@1.3.0
npm i -D @types/three@0.186.0 @gltf-transform/cli@4.5.1 @playwright/test@1.64.0 lighthouse@13.5.0
```

---

## 2. Data sumber: BodyParts3D (DBCLS)

| Item | Nilai |
|---|---|
| Rilis | BodyParts3D 4.0 (data 3D terakhir diperbarui 2013-06-19; README dan lisensi diperbarui 2025-02-25/27) |
| **Lisensi saat ini** | **CC BY 4.0** (rilis 2009–2013 dulu CC BY-SA 2.1 JP; halaman lisensi DBCLS per 2025-02-27 menyatakan CC BY 4.0) |
| Atribusi wajib (persis) | `BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International` |
| Sitasi ilmiah | Mitsuhashi N, et al. *BodyParts3D: 3D structure database for anatomical concepts.* Nucleic Acids Res. 2008. PMID 18835852 |
| Unduhan | `isa_BP3D_4.0_obj_99.zip` (136 MB), `partof_BP3D_4.0_obj_99.zip` (62 MB), `*_parts_list_e.txt`, `*_inclusion_relation_list.txt`, `*_element_parts.txt` (semua TSV) |
| Struktur | Hanya organ ELEMENT yang punya mesh (1 OBJ per *element file id*, mis. `FJxxxx.obj`). Organ COMPOUND = gabungan ELEMENT (lihat `*_element_parts.txt`). |
| Kolom parts list | `concept id (FMA ID)`, `representation id`, `en name` |

Sumber: https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html , https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html

> Wajib diverifikasi saat ingest (README tidak menyebutnya): satuan koordinat (diperkirakan milimeter), sumbu atas (diperkirakan +Z), dan pola nama file. Skrip ingest harus mencetak bbox global sebelum memilih `up_axis`/`forward_axis`.

CC BY 4.0 kompatibel dengan repo publik dan hosting Vercel. Kewajibannya: tampilkan atribusi di footer situs, halaman "Tentang/Credits", README repo, dan slide PPT, serta sebut bahwa mesh sudah dimodifikasi (didesimasi, dikompresi).

---

## 3. Blender 5.2.2 LTS (CLI/Python)

Lokasi: `C:\Users\NuRichter\tools\blender-5.2.2-windows-x64\blender.exe`

### 3.1 `bpy.ops.wm.obj_import`: parameter terverifikasi (introspeksi RNA)
| Parameter | Default | Pakai untuk BodyParts3D |
|---|---|---|
| `filepath` | n/a | path OBJ |
| `global_scale` | 1.0 | **0.001** (mm ke m, setelah satuan diverifikasi) |
| `clamp_size` | 0.0 | 0 |
| `forward_axis` | `'NEGATIVE_Z'` | `'Y'` jika sumber Z-up |
| `up_axis` | `'Y'` | `'Z'` jika sumber Z-up |
| `use_split_objects` | True | True |
| `use_split_groups` | False | False |
| `import_vertex_groups` | False | False |
| `validate_meshes` | True | True |
| `close_spline_loops` | True | n/a |
| `collection_separator` | `''` | n/a |
| `mtl_name_collision_mode` | `'MAKE_UNIQUE'` | n/a |

### 3.2 `bpy.ops.export_scene.gltf`: parameter relevan (terverifikasi)
| Parameter | Default | Nilai pipeline |
|---|---|---|
| `export_format` | n/a | `'GLB'` |
| `export_yup` | True | True (konvensi glTF) |
| `export_apply` | False | True (terapkan modifier) |
| `export_normals` | True | True |
| `export_texcoords` | True | **False** (BodyParts3D tanpa UV/tekstur) |
| `export_materials` | `'EXPORT'` | `'NONE'` (warna diatur runtime per sistem) |
| `export_extras` | False | **True** (custom property `fma_id` ikut ke `extras`) |
| `export_meshopt_compression_enable` | False | False (kompresi dilakukan gltf-transform supaya terkontrol) |
| `export_draco_mesh_compression_enable` | False | False |
| `use_selection` / `use_active_collection` / `collection` | False / False / `''` | dipakai untuk ekspor per chunk |
| `export_cameras` / `export_lights` / `export_animations` | False / False / True | False / False / **False** |

Mulai Blender 5.x exporter glTF punya opsi meshopt dan gltfpack. Opsi ini sengaja tidak dipakai: semua optimasi dilakukan di satu tempat (gltf-transform) agar reproducible.

Pola eksekusi headless:
```powershell
& "C:\Users\NuRichter\tools\blender-5.2.2-windows-x64\blender.exe" -b --factory-startup --python tools\blender\ingest_chunk.py -- --chunk skeletal.upper_limb --list build\chunks\skeletal.upper_limb.txt --out build\raw\skeletal.upper_limb.glb
```

**Temuan uji (2026-10-14, mesin ini):** mesh dengan *flat shading* (normal terpisah per-face) **tidak bisa disimplifikasi** oleh `simplify` (vertex count tetap). Wajib `shade_smooth()` (atau Smooth by Angle) sebelum ekspor, lalu `weld`. Setelah itu `simplify --ratio 0.25` bekerja (8.064 ke ~1.530 vertex pada uji bola).

---

## 4. glTF Transform CLI 4.5.1: perintah terverifikasi

Instal lokal di proyek (`devDependency`), jalankan via `npx gltf-transform`.

| Perintah | Opsi penting (default) | Fungsi |
|---|---|---|
| `inspect in.glb` | n/a | Tabel scene/mesh/vertex/size/extension |
| `weld in out` | n/a | Gabung vertex identik bitwise (prasyarat simplify) |
| `simplify in out` | `--ratio` (0), `--error` (0.0001), `--lock-border` | Desimasi meshoptimizer |
| `dedup in out` | `--accessors --materials --meshes --skins --textures` (semua true) | Hapus duplikat |
| `prune in out` | `--keep-attributes --keep-indices --keep-leaves` | Hapus properti tak terpakai (`--keep-attributes false` membuang atribut tak terpakai) |
| `reorder in out` | `--target size\|performance` (size) | Urutan vertex untuk kompresi |
| `quantize in out` | `--quantize-position 14 --quantize-normal 10 --quantization-volume mesh\|scene` | KHR_mesh_quantization |
| `meshopt in out` | `--level medium\|high` (high), `--quantization-volume mesh\|scene` (mesh), `--quantize-position` (14), `--quantize-normal` (10) | EXT_meshopt_compression + quantization |
| `optimize in out` | `--compress draco\|meshopt\|quantize\|false` (meshopt), `--flatten` (true), `--join` (true), `--join-named` (true), `--instance` (true), `--palette` (true), `--simplify` (true), `--simplify-ratio` (0), `--simplify-error` (0.0001), `--texture-compress` | Semua sekaligus |
| `join in out` | `--keepMeshes`, `--keepNamed` | Gabung primitive. **JANGAN dipakai**: nama FMA per mesh akan hilang |
| `flatten in out` | n/a | Ratakan scene graph |
| `merge a b out` | n/a | Gabung file |
| `partition in out` | n/a | Pisah buffer ke .bin |

**Temuan uji:** `optimize ... --join false --flatten false --instance false --palette false` **mempertahankan nama mesh/node** (`FMA7088`, `FMA7101` tetap ada). Default `optimize` (join=true) akan menggabung mesh dan menghapus identitas struktur. Hasil uji: 436 KB ke 122 KB (meshopt saja), 144 KB ke 27,5 KB (smooth + simplify 0,25 + meshopt).

---

## 5. Keputusan arsitektur runtime: plain three.js di dalam React (bukan R3F)

| Kriteria | Plain three + React | @react-three/fiber 9.8.1 |
|---|---|---|
| Ribuan struktur sebagai instance BatchedMesh (imperatif) | Natural | Harus `<primitive>` / ref imperatif; nilai tambah deklaratif hilang |
| Overhead reconciler | Nol | Ada (setiap objek = fiber node jika deklaratif) |
| Kontrol `dispose()`, loop render on-demand | Penuh | Ada (`frameloop="demand"`), tapi lewat abstraksi |
| Kompatibilitas | three 0.186.1 + React 19.3 | peer `react >=19 <19.4`, `three >=0.156`: aman sekarang, tapi terikat siklus rilis R3F |
| Ukuran bundle | three saja | + fiber (+ drei biasanya) |

**Rekomendasi: plain three.js.** Satu komponen `<Viewport>` memegang `SceneController` (kelas TS imperatif). React hanya mengurus UI (panel, pencarian, slider) dan berkomunikasi lewat store (lihat WEB_ARCHITECTURE.md).

---

## 6. Runtime loader three r186 (terverifikasi di source)

```ts
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'meshoptimizer/decoder';          // atau 'three/addons/libs/meshopt_decoder.module.js'
import WebGL from 'three/addons/capabilities/WebGL.js';           // WebGL.isWebGL2Available(), getWebGL2ErrorMessage()
import { computeBatchedBoundsTree, disposeBatchedBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

await MeshoptDecoder.ready;
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
// DRACOLoader / KTX2Loader TIDAK diperlukan: tanpa Draco (pakai meshopt) dan tanpa tekstur.

THREE.BatchedMesh.prototype.computeBoundsTree = computeBatchedBoundsTree;
THREE.BatchedMesh.prototype.disposeBoundsTree = disposeBatchedBoundsTree;
THREE.BatchedMesh.prototype.raycast = acceleratedRaycast;
```
API `BatchedMesh` yang dipakai (r186): `new BatchedMesh(maxInstanceCount, maxVertexCount, maxIndexCount, material)`, `addGeometry`, `addInstance`, `setMatrixAt`, `setColorAt(id, Color|Vector4)` (Vector4 = dengan alpha), `setVisibleAt`, `getVisibleAt`, `getGeometryIdAt`, `getBoundingBoxAt`, `deleteInstance`, `optimize`, `perObjectFrustumCulled` (default true), `sortObjects` (default true), `raycast`.

Kenapa tidak Draco/KTX2: meshopt decode jauh lebih cepat (WASM SIMD, tanpa worker tambahan) dan juga mengompres quantization. Tekstur tidak ada di data sumber. Jika kelak ada tekstur (ikon/atlas), gunakan `KTX2Loader` + `three/addons/libs/basis/` dan `gltf-transform ... --texture-compress ktx2` (butuh `toktx` dari KTX-Software).

---

## 7. Batas hosting (ringkas; detail di PERFORMANCE_BUDGET.md)

| Batas | Nilai | Sumber |
|---|---|---|
| Vercel Hobby Fast Data Transfer | 100 GB / bulan | https://vercel.com/docs/plans/hobby |
| Vercel Hobby Fast Origin Transfer | 10 GB / bulan | https://vercel.com/docs/plans/hobby |
| Vercel Hobby CDN Requests | 1.000.000 / bulan | https://vercel.com/docs/plans/hobby |
| Deployments per hari (Hobby) | 100 | https://vercel.com/docs/limits |
| Build time per deployment | 45 menit | https://vercel.com/docs/limits |
| Build machine Hobby | 2 vCPU, 8 GB RAM, disk 32 GB | https://vercel.com/docs/plans/hobby |
| Upload source via CLI (Hobby) | 100 MB | https://vercel.com/docs/limits#static-file-uploads |
| Jumlah file source via CLI | 15.000 | https://vercel.com/docs/limits#files |
| Output file build | tidak ada batas atas (build lambat jika >100.000 file) | https://vercel.com/docs/limits#files |
| Penggunaan | Hobby = non-komersial/pribadi saja | https://vercel.com/docs/plans/hobby |
| Kompresi otomatis CDN | **Hanya MIME di allowlist**; `model/gltf-binary` **TIDAK** termasuk | https://vercel.com/docs/compression |
| GitHub: peringatan per file | > 50 MiB | https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github |
| GitHub: blok per file | > 100 MiB (butuh Git LFS) | idem |
| GitHub: upload via browser | ≤ 25 MiB | idem |
| GitHub: ukuran repo disarankan | < 1 GB ideal, < 5 GB sangat disarankan | idem |

Konsekuensi: **OBJ mentah TIDAK masuk repo** (unduh ulang lewat skrip, cache lokal di `.cache/`, masukkan ke `.gitignore`). Yang di-commit hanya GLB hasil (target total < 40 MB) + `manifest.json`. Dengan begitu repo jauh di bawah 1 GB, tidak ada file > 50 MiB, dan tidak perlu LFS. (Hindari Git LFS: kuota storage/bandwidth LFS GitHub terbatas dan Vercel butuh pengaturan tambahan untuk menarik objek LFS.)

---

## 8. Sumber resmi
- three.js releases: https://github.com/mrdoob/three.js/releases (r186, 24 Sep 2026)
- npm registry: https://registry.npmjs.org/ (versi dan tanggal di atas)
- glTF Transform CLI: https://gltf-transform.dev/cli
- meshoptimizer: https://github.com/zeux/meshoptimizer
- EXT_meshopt_compression: https://github.com/KhronosGroup/glTF/tree/main/extensions/2.0/Vendor/EXT_meshopt_compression
- three-mesh-bvh BatchedMesh: https://gkjohnson.github.io/three-mesh-bvh/batchedMesh.html
- Blender Python API: https://docs.blender.org/api/current/bpy.ops.wm.html
- Vite template react-ts: https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts
- Vercel: https://vercel.com/docs/plans/hobby , https://vercel.com/docs/limits , https://vercel.com/docs/compression
- GitHub: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- BodyParts3D: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
