# Asset Processing Pipeline: BodyParts3D OBJ ke GLB per sistem (meshopt)

Agen 4 (3D Toolchain & Asset Engineer). Tanggal: 2026-10-14
Versi: Blender 5.2.2 LTS, @gltf-transform/cli 4.5.1, Node 24.20.0, Python 3.10. Lihat `3D_TOOLCHAIN.md`.

---

## 0. Prinsip

1. **Satu mesh glTF = satu struktur anatomi = satu ID FMA.** Nama mesh dan node: `FMA<angka>` (contoh `FMA7088`). Nama ini kunci untuk picking, pencarian, dan manifest. Tidak boleh ada `join`/`flatten` yang menghapus nama.
2. **Chunk per sistem (dan per region untuk sistem besar).** Pengguna hanya mengunduh sistem yang dinyalakan.
3. **Reproducible.** Semua langkah berupa skrip (Python/Blender/Node) yang dijalankan satu perintah: `npm run assets`. OBJ mentah tidak di-commit.
4. **Dua tier kualitas:** `hi` (desktop) dan `lo` (mobile/low-end). Manifest yang sama, file berbeda.
5. **Gagal keras:** validator menghentikan build jika ada nama duplikat, struktur hilang, atau chunk melewati anggaran.

---

## 1. Struktur direktori

```
anatomy-lab/
  tools/
    fetch_bp3d.py            # unduh + verifikasi sha256 ke .cache/bp3d/
    build_catalog.py         # parse TSV -> build/catalog.json (FMA, nama, pohon, sistem, region, layer)
    plan_chunks.py           # catalog -> build/chunks/<chunk>.txt (daftar OBJ per chunk)
    blender/ingest_chunk.py  # Blender headless: OBJ -> build/raw/<chunk>.glb
    build-assets.mjs         # orkestrasi: blender -> gltf-transform -> gzip -> manifest -> validate
    validate_assets.mjs
    systems.config.json      # mapping akar FMA -> sistem, aturan layer/region (dikurasi manual)
  .cache/bp3d/               # (gitignored) zip + OBJ hasil ekstrak
  build/                     # (gitignored) intermediate
  public/models/v1/          # DI-COMMIT: <chunk>.<tier>.<hash8>.glb(.gz)
  public/data/v1/manifest.json
  public/data/v1/search-index.json
```

`.gitignore`: `.cache/`, `build/`, `*.obj`, `*.zip`.

---

## 2. Tahap pipeline

### Tahap 1: Fetch
`python tools/fetch_bp3d.py` mengunduh dari `https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/`:
- `isa_BP3D_4.0_obj_99.zip` (136 MB) sebagai sumber mesh utama (pohon IS-A lebih lengkap)
- `isa_parts_list_e.txt`, `isa_inclusion_relation_list.txt`, `isa_element_parts.txt`
- `partof_parts_list_e.txt`, `partof_inclusion_relation_list.txt`, `partof_element_parts.txt` (untuk region/part-of)

Simpan `sha256` di `tools/bp3d.lock.json`. Ekstrak ke `.cache/bp3d/obj/`. Ingat aturan file tak tepercaya: skrip berada di `tools/`, data di `.cache/`, dan Python dijalankan dengan `-I`.

### Tahap 2: Katalog
`python -I tools/build_catalog.py` menghasilkan `build/catalog.json`:
- Parse `*_parts_list_e.txt` (TSV: `concept id`, `representation id`, `en name`).
- Parse `*_element_parts.txt` (`concept id`, `name`, `element file id`) untuk memetakan **element file id (nama OBJ) ke FMA ID**. Satu file OBJ ELEMENT = satu struktur. Jika satu file dipakai oleh beberapa konsep, pilih konsep paling spesifik (daun pohon IS-A) sebagai `fma` utama, dan simpan sisanya di `aliases`.
- Bangun graf `isa_inclusion_relation_list.txt` (parent ke child) untuk menentukan **sistem** (traversal ke atas sampai bertemu akar yang terdaftar di `systems.config.json`).
- **Pemeriksaan satuan/sumbu:** baca 20 OBJ acak dan hitung bbox global. Tinggi tubuh sekitar 1.600 sampai 1.800 pada satu sumbu berarti satuan **mm** dan sumbu itu adalah "up". Catat ke `catalog.meta`.

### Tahap 3: Klasifikasi (sistem, region, sisi, layer)

`systems.config.json` (dikurasi; akar dicocokkan **berdasarkan nama** lalu dikunci ke FMA ID setelah diverifikasi di parts list):

| `system` (kunci) | Label ID | Catatan chunk |
|---|---|---|
| `skeletal` | Sistem rangka | dipecah per region |
| `articular` | Sendi & ligamen | 1 chunk |
| `muscular` | Sistem otot | dipecah per region |
| `nervous_central` | Saraf pusat (otak, medula spinalis) | 1 chunk |
| `nervous_peripheral` | Saraf tepi | 1 sampai 2 chunk |
| `cardiovascular` | Jantung & pembuluh | `heart` + `arteries` + `veins` |
| `respiratory` | Pernapasan | 1 chunk |
| `digestive` | Pencernaan | 1 chunk |
| `urinary` | Perkemihan | 1 chunk |
| `reproductive` | Reproduksi (model pria) | 1 chunk |
| `lymphatic` | Limfatik | 1 chunk |
| `endocrine` | Endokrin | 1 chunk |
| `sensory` | Indra (mata, telinga) | 1 chunk |
| `integumentary` | Kulit / siluet | 1 chunk (siluet tubuh, untuk konteks) |

- **Region** (`head_neck`, `thorax`, `abdomen`, `pelvis`, `back`, `upper_limb`, `lower_limb`): pertama dari pohon PART-OF, fallback berupa heuristik centroid bbox (pita Z dan |X| untuk ekstremitas).
- **Sisi** (`left`/`right`/`midline`): dari nama (`left `/`right `), fallback tanda X centroid.
- **Layer depth** (integer 0..5, 0 = paling luar):

| layer | Isi |
|---|---|
| 0 | kulit/siluet |
| 1 | otot superfisial, fasia |
| 2 | otot dalam, saraf tepi, pembuluh superfisial |
| 3 | viscera (organ dalam), pembuluh besar |
| 4 | rangka, sendi, ligamen |
| 5 | struktur intraosseus/intrakranial dalam (otak, medula spinalis) |

  Default ditentukan per sistem. Otot superfisial dan dalam dibedakan lewat daftar override (`layerOverrides` di config, kurasi anatomi oleh Agen konten).

### Tahap 4: Rencana chunk
`python -I tools/plan_chunks.py` menghasilkan `build/chunks/<chunkId>.txt` (satu path OBJ per baris) + `build/chunks/plan.json`.

- `chunkId` = `<system>[.<region>]`, contoh `skeletal.upper_limb`, `muscular.thorax`, `digestive`.
- Aturan pemecahan: jika estimasi ukuran chunk `hi` > **2,5 MB** (lihat PERFORMANCE_BUDGET), pecah per region; jika masih > 2,5 MB, pecah per sisi (`.left`/`.right`).
- Estimasi = (jumlah segitiga OBJ × rasio simplify) × ~6 byte/segitiga (meshopt + quantization, kalibrasi dari uji pertama).

### Tahap 5: Ingest Blender (per chunk, headless)

```powershell
& "C:\Users\NuRichter\tools\blender-5.2.2-windows-x64\blender.exe" -b --factory-startup `
  --python tools\blender\ingest_chunk.py -- `
  --list build\chunks\skeletal.upper_limb.txt --catalog build\catalog.json `
  --out build\raw\skeletal.upper_limb.glb --scale 0.001 --up Z --forward Y
```

Kerangka `ingest_chunk.py`:
```python
import bpy, sys, json, argparse, pathlib
argv = sys.argv[sys.argv.index("--") + 1:]
ap = argparse.ArgumentParser()
for a in ("--list", "--catalog", "--out", "--up", "--forward"): ap.add_argument(a)
ap.add_argument("--scale", type=float, default=0.001)
args = ap.parse_args(argv)

bpy.ops.wm.read_factory_settings(use_empty=True)
cat = json.load(open(args.catalog, encoding="utf-8"))["byFile"]   # FJxxxx -> {fma, name_en, ...}

for line in open(args.list, encoding="utf-8"):
    p = pathlib.Path(line.strip())
    before = set(bpy.data.objects)
    bpy.ops.wm.obj_import(filepath=str(p), global_scale=args.scale,
                          up_axis=args.up, forward_axis=args.forward,
                          use_split_objects=False, validate_meshes=True)
    new = [o for o in bpy.data.objects if o not in before and o.type == "MESH"]
    if len(new) > 1:                       # pastikan 1 objek per struktur
        with bpy.context.temp_override(active_object=new[0], selected_editable_objects=new):
            bpy.ops.object.join()
    o = new[0]
    rec = cat[p.stem]
    name = f"FMA{rec['fma']}"
    o.name = name; o.data.name = name      # nama node DAN mesh
    o["fma_id"] = rec["fma"]; o["src_file"] = p.stem   # -> glTF extras
    for poly in o.data.polygons: poly.use_smooth = True  # WAJIB: agar simplify bisa bekerja
    o.data.materials.clear()

# Jangan ubah origin/transform: semua chunk berbagi ruang koordinat yang sama.
bpy.ops.export_scene.gltf(filepath=args.out, export_format="GLB", export_yup=True,
    export_apply=True, export_normals=True, export_texcoords=False,
    export_materials="NONE", export_extras=True, export_animations=False,
    export_cameras=False, export_lights=False)
```

Catatan:
- **Smooth shading wajib.** Uji 2026-10-14: mesh flat-shaded tidak tersimplifikasi sama sekali karena normal terpisah per face. Setelah smooth + `weld`, rasio 0,25 tercapai.
- Jangan recenter per objek. Koordinat dunia dipertahankan agar semua chunk menyatu.
- Sebelum ekspor, lakukan pembersihan opsional dengan `bpy.ops.mesh.remove_doubles` (merge by distance, ambang 1e-6 m) untuk OBJ yang bocor.

### Tahap 6: Optimasi glTF Transform (per chunk, per tier)

Rantai **eksplisit** (direkomendasikan, mudah di-debug):
```powershell
$G = "npx gltf-transform"
# tier hi (desktop)
npx gltf-transform weld     build\raw\$c.glb   build\t\$c.1.glb
npx gltf-transform simplify build\t\$c.1.glb   build\t\$c.2.glb --ratio 0.5  --error 0.0005
npx gltf-transform dedup    build\t\$c.2.glb   build\t\$c.3.glb
npx gltf-transform prune    build\t\$c.3.glb   build\t\$c.4.glb --keep-leaves false --keep-attributes false
npx gltf-transform reorder  build\t\$c.4.glb   build\t\$c.5.glb --target size
npx gltf-transform meshopt  build\t\$c.5.glb   build\out\$c.hi.glb --level high --quantization-volume scene --quantize-position 14 --quantize-normal 8
# tier lo (mobile): simplify lebih agresif
npx gltf-transform simplify build\t\$c.1.glb   build\t\$c.lo2.glb --ratio 0.2 --error 0.002
#   ... dedup -> prune -> reorder -> meshopt (sama) -> build\out\$c.lo.glb
```

Setara satu perintah (sudah diuji dan **mempertahankan nama mesh**):
```powershell
npx gltf-transform optimize build\raw\$c.glb build\out\$c.hi.glb `
  --compress meshopt --meshopt-level high `
  --flatten false --join false --instance false --palette false `
  --simplify true --simplify-ratio 0.5 --simplify-error 0.0005 `
  --texture-compress false
```

Parameter dan alasannya:

| Parameter | Nilai | Alasan |
|---|---|---|
| `--join false`, `--flatten false` | wajib | identitas FMA per mesh untuk picking |
| `--instance false` | wajib | struktur anatomi unik; instancing tidak berguna |
| `--quantization-volume scene` | direkomendasikan | grid kuantisasi seragam per chunk. 14 bit pada tubuh sekitar 1,8 m memberi presisi sekitar 0,11 mm, jauh di bawah resolusi data. Atribut posisi semua geometri satu chunk punya tipe sama (penting untuk BatchedMesh) |
| `--quantize-normal 8` | 8 bit | normal pada mesh organik halus cukup 8 bit; hemat ukuran |
| `simplify --ratio/--error` | hi 0,5/0,0005; lo 0,2/0,002 | Data sumber sudah "99% reduction". Simplify kedua harus konservatif; nilai final dikalibrasi visual (lihat sec. 6) |
| Override per sistem | `nervous_peripheral`, pembuluh kecil: `--lock-border true`, error lebih rendah | struktur tipis/tubular rusak jika didesimasi agresif |

Rasio dan error disimpan di `systems.config.json` (`simplify: {hi:{ratio,error}, lo:{ratio,error}}` per sistem), bukan di-hardcode.

### Tahap 7: Pra-kompresi gzip (karena Vercel TIDAK mengompres `.glb`)

Allowlist kompresi otomatis Vercel CDN tidak memuat `model/gltf-binary` (https://vercel.com/docs/compression). Data meshopt dirancang untuk diikuti kompresi lossless (gzip/brotli) dan umumnya masih menyusut berarti.

- Hasilkan `<chunk>.<tier>.<hash8>.glb.gz` (gzip level 9; Node `zlib.gzipSync(buf, {level: 9})`).
- Content-Type `.gz` = `application/gzip`, tidak di-encode ulang oleh CDN.
- Klien: `fetch(url)` ke `res.body.pipeThrough(new DecompressionStream('gzip'))` ke `new Response(stream).arrayBuffer()` ke `GLTFLoader.parse(buffer, '', onLoad, onError)`.
- Fallback: jika `typeof DecompressionStream === 'undefined'`, ambil `.glb` non-gz (keduanya di-deploy).
- **Ukur dulu:** jika rata-rata penghematan gzip < 10%, hapus tahap ini dan sajikan `.glb` saja.

### Tahap 8: Hash, manifest, indeks pencarian
- Nama file final: `public/models/v1/<chunkId>.<tier>.<sha256[0:8]>.glb[.gz]` (cache-busting, aman untuk `immutable`).
- `manifest.json` (skema di sec. 4) dan `search-index.json` (sec. 5).
- Statistik per chunk dibaca langsung dari GLB final via `@gltf-transform/core` (`NodeIO` + `EXTMeshoptCompression`) agar angka akurat: segitiga, vertex, bbox per mesh.

### Tahap 9: Validasi (gagal = build gagal)
`node tools/validate_assets.mjs`:
1. Setiap `structures[].mesh` ada di GLB chunk yang dirujuk; tidak ada nama mesh duplikat lintas chunk.
2. Setiap mesh di GLB punya entri manifest (tidak ada struktur yatim).
3. `extensionsRequired` hanya `EXT_meshopt_compression` + `KHR_mesh_quantization`.
4. Anggaran: ukuran chunk ≤ batas (PERFORMANCE_BUDGET), total ≤ batas, tidak ada file > 25 MB (jauh di bawah 50 MiB peringatan GitHub).
5. bbox seluruh struktur berada di dalam bbox tubuh (deteksi kesalahan skala/sumbu).
6. `node tools/validate_assets.mjs --render` (opsional) mengambil screenshot Playwright per chunk untuk diff visual.

---

## 3. Konvensi penamaan

| Objek | Format | Contoh |
|---|---|---|
| Mesh & node glTF | `FMA<id>` | `FMA7088` |
| `extras` node | `{ "fma_id": 7088, "src_file": "FJ1234" }` | n/a |
| Chunk ID | `<system>[.<region>][.<side>]` (huruf kecil, `_`) | `muscular.lower_limb.left` |
| File | `<chunkId>.<tier>.<hash8>.glb[.gz]` | `skeletal.thorax.hi.3f9a2c1d.glb.gz` |
| Folder versi | `v<N>` naik saat skema manifest berubah | `public/models/v1/` |

---

## 4. Skema `manifest.json` (JSON Schema 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://<domain>/data/v1/manifest.schema.json",
  "type": "object",
  "required": ["schemaVersion", "generatedAt", "source", "coordinateSystem", "tiers", "systems", "chunks", "structures"],
  "properties": {
    "schemaVersion": { "const": 1 },
    "generatedAt": { "type": "string", "format": "date-time" },
    "source": {
      "type": "object",
      "required": ["name", "release", "license", "attribution", "url"],
      "properties": {
        "name": { "const": "BodyParts3D" },
        "release": { "type": "string", "examples": ["4.0"] },
        "license": { "const": "CC-BY-4.0" },
        "attribution": { "type": "string" },
        "url": { "type": "string", "format": "uri" },
        "modified": { "type": "string", "examples": ["decimated (meshoptimizer), quantized, EXT_meshopt_compression"] }
      }
    },
    "coordinateSystem": {
      "type": "object",
      "properties": {
        "units": { "const": "meter" },
        "up": { "const": "+Y" },
        "bodyBBox": { "$ref": "#/$defs/bbox" }
      }
    },
    "tiers": { "type": "array", "items": { "enum": ["hi", "lo"] } },
    "systems": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "label", "color", "defaultVisible", "chunks"],
        "properties": {
          "id": { "type": "string" },
          "label": { "type": "object", "properties": { "id": { "type": "string" }, "en": { "type": "string" } } },
          "color": { "type": "string", "pattern": "^#[0-9a-fA-F]{6}$" },
          "defaultVisible": { "type": "boolean" },
          "defaultLayer": { "type": "integer", "minimum": 0, "maximum": 5 },
          "chunks": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "chunks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "system", "files", "structureCount", "bbox"],
        "properties": {
          "id": { "type": "string", "examples": ["skeletal.upper_limb"] },
          "system": { "type": "string" },
          "region": { "type": ["string", "null"] },
          "priority": { "type": "integer", "description": "urutan muat; 0 = paling awal" },
          "structureCount": { "type": "integer" },
          "bbox": { "$ref": "#/$defs/bbox" },
          "files": {
            "type": "object",
            "description": "per tier",
            "additionalProperties": {
              "type": "object",
              "required": ["glb", "bytes", "triangles", "vertices", "sha256"],
              "properties": {
                "glb": { "type": "string", "examples": ["models/v1/skeletal.upper_limb.hi.3f9a2c1d.glb"] },
                "gz": { "type": ["string", "null"] },
                "bytes": { "type": "integer" },
                "bytesGz": { "type": ["integer", "null"] },
                "triangles": { "type": "integer" },
                "vertices": { "type": "integer" },
                "sha256": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "structures": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["fma", "mesh", "name_en", "system", "layer", "chunk", "bbox"],
        "properties": {
          "fma": { "type": "integer", "description": "FMA ID utama (angka)" },
          "mesh": { "type": "string", "pattern": "^FMA[0-9]+$" },
          "aliases": { "type": "array", "items": { "type": "integer" } },
          "srcFiles": { "type": "array", "items": { "type": "string" }, "examples": [["FJ1234"]] },
          "name_en": { "type": "string" },
          "name_ja": { "type": ["string", "null"], "description": "opsional; parts list rilis 4.0 hanya bahasa Inggris" },
          "name_id": { "type": ["string", "null"], "description": "Bahasa Indonesia, kurasi manual" },
          "system": { "type": "string" },
          "region": { "type": ["string", "null"], "enum": ["head_neck", "thorax", "abdomen", "pelvis", "back", "upper_limb", "lower_limb", null] },
          "side": { "enum": ["left", "right", "midline"] },
          "layer": { "type": "integer", "minimum": 0, "maximum": 5 },
          "chunk": { "type": "string" },
          "file": { "type": "string", "description": "file GLB tier hi (redundan, untuk kemudahan)" },
          "bbox": { "$ref": "#/$defs/bbox" },
          "centroid": { "type": "array", "items": { "type": "number" }, "minItems": 3, "maxItems": 3 },
          "triangles": { "type": "object", "properties": { "hi": { "type": "integer" }, "lo": { "type": "integer" } } },
          "parents": { "type": "array", "items": { "type": "integer" }, "description": "FMA ID leluhur (IS-A), untuk breadcrumb & seleksi grup" }
        }
      }
    }
  },
  "$defs": {
    "bbox": {
      "type": "object",
      "required": ["min", "max"],
      "properties": {
        "min": { "type": "array", "items": { "type": "number" }, "minItems": 3, "maxItems": 3 },
        "max": { "type": "array", "items": { "type": "number" }, "minItems": 3, "maxItems": 3 }
      }
    }
  }
}
```

Contoh entri struktur:
```json
{ "fma": 7088, "mesh": "FMA7088", "srcFiles": ["FJ....."], "name_en": "heart", "name_ja": null, "name_id": "jantung",
  "system": "cardiovascular", "region": "thorax", "side": "midline", "layer": 3,
  "chunk": "cardiovascular.heart", "file": "models/v1/cardiovascular.heart.hi.ab12cd34.glb",
  "bbox": { "min": [-0.07, 1.20, -0.05], "max": [0.08, 1.34, 0.07] }, "centroid": [0.0, 1.27, 0.01],
  "triangles": { "hi": 18000, "lo": 7000 }, "parents": [] }
```
(Angka contoh ilustratif. FMA ID dan nama file diisi otomatis dari parts list.)

Ukuran manifest: ribuan struktur × ~350 B, kira-kira 1 MB JSON mentah, dan sekitar 150 sampai 200 KB terkompresi (JSON termasuk allowlist kompresi Vercel). Agar muat awal ringan, `manifest.json` hanya memuat `systems` + `chunks`. `structures` dipecah ke `structures.<system>.json` dan dimuat bersama chunk-nya.

---

## 5. `search-index.json`

Array ringkas (dikompresi otomatis oleh Vercel karena `application/json`):
```json
{ "v": 1, "fields": ["fma", "en", "id", "ja", "system", "chunk"],
  "rows": [[7088, "heart", "jantung", null, "cardiovascular", "cardiovascular.heart"]] }
```
Pencarian di klien: normalisasi (huruf kecil, buang diakritik) + prefix/substring + skor sederhana (exact > prefix > substring), berjalan di Web Worker. Tidak perlu library. Opsi: MiniSearch jika butuh fuzzy (evaluasi terpisah).

---

## 6. Kalibrasi kualitas (sekali, sebelum produksi)

1. Pilih 6 struktur uji: femur, skapula, jantung, otak, n. ischiadicus, a. coronaria.
2. Render Blender (Eevee, kamera tetap) untuk sumber vs `hi` vs `lo`; buat diff ImageMagick: `magick compare -metric RMSE a.png b.png diff.png`.
3. Target: `hi` tanpa artefak terlihat pada zoom 100% struktur; `lo` dapat diterima pada layar 6 inci.
4. Kunci nilai rasio/error per sistem di `systems.config.json` dan catat hasil di `research/asset_calibration.md`.

---

## 7. Render untuk PowerPoint (Blender 5.2.2)
- Gunakan GLB `hi` (atau OBJ asli untuk kualitas maksimum) dengan skrip `tools/blender/render_ppt.py`: Cycles OptiX (RTX 5060 Ti), 1920×1080, background transparan (`film_transparent=True`), warna per sistem sama dengan web (dibaca dari manifest).
- Turntable: 120 frame ke PNG, lalu `ffmpeg -framerate 30 -i f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 turntable.mp4`.
- Montage label: `magick montage`.
- Semua slide memuat atribusi CC BY 4.0 (sec. 2 di 3D_TOOLCHAIN.md).

---

## 8. Perintah satu-baris (orkestrasi)
```powershell
$env:PATH = "C:\Users\NuRichter\tools\node-v24.20.0-win-x64;$env:PATH"
python -I tools\fetch_bp3d.py
python -I tools\build_catalog.py
python -I tools\plan_chunks.py
node tools\build-assets.mjs --blender "C:\Users\NuRichter\tools\blender-5.2.2-windows-x64\blender.exe" --tiers hi,lo --jobs 4
node tools\validate_assets.mjs
```
`build-assets.mjs` menjalankan Blender per chunk (paralel `--jobs`), lalu rantai gltf-transform (sec. 2 tahap 6) via `child_process.execFile` (atau via API `@gltf-transform/functions`: `weld()`, `simplify({simplifier: MeshoptSimplifier})`, `dedup()`, `prune()`, `reorder({encoder: MeshoptEncoder})`, `meshopt({encoder: MeshoptEncoder, level: 'high'})` dalam satu proses agar lebih cepat), lalu gzip, hash, dan manifest.

**Aset dibangun lokal lalu di-commit.** Build Vercel hanya menjalankan `vite build` (tidak ada Blender di Vercel; batas build 45 menit dan 8 GB RAM).
