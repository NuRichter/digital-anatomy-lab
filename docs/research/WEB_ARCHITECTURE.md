# Arsitektur Web: Digital Anatomy Laboratory

Agen 7 (Three.js & Performance Architect). Tanggal: 2026-10-14
Stack: Vite 8.3.4 + React 19.3.0 + TypeScript ~6.0.3 + three 0.186.1 (plain, tanpa R3F) + three-mesh-bvh 0.9.16 + meshoptimizer 1.3.0 (decoder). Situs statis di Vercel Hobby.

---

## 1. Prinsip
1. **React untuk UI, three untuk scene.** Scene dikelola oleh kelas imperatif `SceneController`. React tidak me-render objek 3D per struktur.
2. **Satu `BatchedMesh` per chunk.** Ribuan struktur jadi puluhan draw call. Identitas struktur = `instanceId` yang dipetakan ke `fma`.
3. **Render on-demand.** Frame hanya digambar saat kamera bergerak, terjadi perubahan state, atau animasi transisi berjalan. Saat diam, GPU idle (penting untuk baterai mobile).
4. **Progressive loading.** Siluet/rangka dulu, sistem lain saat diminta.
5. **Fallback eksplisit** untuk perangkat tanpa WebGL2, perangkat low-end, dan preferensi reduced-motion.

---

## 2. Pohon komponen

```
<App>
├─ <CapabilityGate>                 // cek WebGL2 + tier perangkat sebelum memuat chunk three
│   ├─ <FallbackStatic/>            // tanpa WebGL2: gambar render Blender + daftar struktur (tetap bisa dicari)
│   └─ <Lab>                        // React.lazy(() => import('./lab/Lab'))  -> three dipisah dari bundle awal
│       ├─ <TopBar>  (judul, <SearchBox/>, tombol bantuan, toggle kualitas)
│       ├─ <SystemPanel>            // daftar sistem: toggle visibilitas, warna, progres unduh per chunk
│       ├─ <LayerSlider/>           // kedalaman 0..5 ("kupas" dari kulit ke tulang)
│       ├─ <Viewport/>              // <canvas>; membuat & menghancurkan SceneController (useEffect)
│       │    └─ <HoverLabel/>       // overlay DOM (bukan teks 3D) di posisi layar hasil pick
│       ├─ <InfoPanel/>             // struktur terpilih: nama EN/ID/(JA), FMA ID, sistem, region, breadcrumb parents
│       ├─ <ViewControls/>          // reset kamera, preset (anterior/posterior/lateral), isolate, ghost, screenshot
│       ├─ <LoadingOverlay/>        // tahap muat + persen byte
│       └─ <Credits/>               // atribusi BodyParts3D CC BY 4.0 (WAJIB tampil)
└─ <ErrorBoundary>                  // webglcontextlost, gagal fetch -> pesan + tombol coba lagi
```

Code-splitting: `three`, `three-mesh-bvh`, dan decoder meshopt hanya ada di chunk `Lab`. Shell awal (React + UI + manifest) < 120 KB gzip.

---

## 3. State

Store kecil tanpa dependensi: `useSyncExternalStore` + objek store custom (sekitar 60 baris). Zustand juga boleh, tetapi tidak wajib.

```ts
type Tier = 'hi' | 'lo';
interface LabState {
  tier: Tier;                                   // dari deteksi perangkat, bisa diubah user
  systems: Record<SystemId, { visible: boolean; status: 'idle'|'loading'|'ready'|'error'; progress: number }>;
  layerMin: number;                             // 0..5: tampilkan struktur dengan layer >= layerMin (lihat sec. 7.4)
  selected: number | null;                      // FMA ID
  hovered: number | null;
  isolated: Set<number> | null;                 // null = tidak ada isolasi
  ghostOthers: boolean;                         // struktur lain transparan saat ada seleksi
  hidden: Set<number>;                          // disembunyikan manual
  search: { query: string; results: number[] };
  reducedMotion: boolean;
}
```

Alur data:
- UI memanggil `actions.*` untuk mengubah store.
- `SceneController` subscribe ke store, menerapkan diff (setVisibleAt/setColorAt), lalu `requestRender()`.
- Event pointer dari canvas masuk ke `SceneController.pick()`, yang memanggil `actions.hover/select`. InfoPanel ikut ter-update.
- `selected` disinkronkan ke URL (`?s=FMA7088&sys=skeletal,muscular&layer=3`) sehingga bisa dibagikan dan dipakai untuk deep-link dari slide PPT (QR code).

---

## 4. SceneController (inti three)

```ts
class SceneController {
  renderer: WebGLRenderer;  scene: Scene;  camera: PerspectiveCamera;  controls: OrbitControls;
  chunks = new Map<string, ChunkRuntime>();          // chunkId -> runtime
  index = new Map<number, { chunk: string; instanceId: number }>();   // FMA -> lokasi
  constructor(canvas, store, manifest) {}
  async loadChunk(chunkId: string, tier: Tier, signal: AbortSignal): Promise<void> {}
  unloadChunk(chunkId: string): void {}             // dispose penuh (sec. 10)
  pick(ndcX: number, ndcY: number): number | null {}
  focus(fma: number): void {}                       // tween kamera ke bbox (instan jika reducedMotion)
  requestRender(): void {}                          // jadwalkan satu frame (rAF dedupe)
  dispose(): void {}
}

interface ChunkRuntime {
  batch: BatchedMesh;
  instanceToFma: Int32Array;                        // instanceId -> FMA
  baseColor: Color;                                 // warna sistem
}
```

Renderer: `new WebGLRenderer({ canvas, antialias: tier==='hi', powerPreference: 'high-performance', alpha: false })`, `setPixelRatio(Math.min(devicePixelRatio, tier==='hi' ? 2 : 1.5))`, `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping`.
Material: satu `MeshStandardMaterial` per chunk (roughness 0,6, metalness 0), pencahayaan murah: `HemisphereLight` + 1 `DirectionalLight` tanpa shadow. Opsional: environment `RoomEnvironment` via PMREM (sekali, sekitar 1 ms di desktop).

---

## 5. Tahap pemuatan (loading stages)

| Tahap | Isi | Pemicu | Target (lihat PERFORMANCE_BUDGET) |
|---|---|---|---|
| S0 Shell | HTML + CSS + JS React + UI | navigasi | ≤ 120 KB gzip, FCP < 1,5 s |
| S1 Capability | WebGL2? GPU tier? `prefers-reduced-motion`? `navigator.connection.saveData`? | otomatis | < 50 ms |
| S2 Manifest | `manifest.json` (systems + chunks) | otomatis | ≤ 30 KB gzip |
| S3 Lab bundle | three + bvh + decoder (lazy) | otomatis setelah S1 lolos | ≤ 220 KB gzip |
| S4 Konteks awal | `integumentary` (siluet, transparan) + `skeletal.*` | otomatis | ≤ 3 MB (hi) / ≤ 1,5 MB (lo) |
| S5 On-demand | sistem lain saat di-toggle, atau saat hasil pencarian/URL merujuk struktur di chunk itu | interaksi | per chunk ≤ 2,5 MB hi |
| S6 Idle prefetch | chunk prioritas berikutnya (`muscular`, `cardiovascular`) via `requestIdleCallback` | hanya desktop, bukan `saveData` | n/a |

Detail implementasi `loadChunk`:
1. `fetch(file.gz ?? file.glb, { signal, priority })`. Jika `.gz`: `res.body.pipeThrough(new DecompressionStream('gzip'))`. Progres dihitung dari `Content-Length` + reader.
2. `GLTFLoader.parseAsync(arrayBuffer, '')` dengan `setMeshoptDecoder(MeshoptDecoder)` (decoder WASM SIMD, sudah `await MeshoptDecoder.ready`).
3. **Bangun BatchedMesh** (sec. 6), lalu buang scene glTF (geometri asli di-`dispose()` setelah disalin).
4. `batch.computeBoundsTree(geometryId)` (three-mesh-bvh `computeBatchedBoundsTree`; tanpa argumen/`-1` = semua geometri) dijadwalkan per geometri dalam irisan waktu (`scheduler.yield()`/`setTimeout(0)` per N geometri) agar main thread tidak beku > 50 ms.
5. Terapkan state saat ini (visibilitas, layer, isolasi), lalu `requestRender()`.
6. Antrian muat maksimum **2 fetch paralel**. Chunk yang di-toggle off sebelum selesai dibatalkan via `AbortController`.

Cache: file berhash di-serve dengan `Cache-Control: public, max-age=31536000, immutable` (vercel.json `headers`). Kunjungan ulang tidak mengunduh ulang. Opsional: Service Worker (Workbox tidak perlu, cukup cache-first sederhana) untuk offline di kelas.

---

## 6. Penggabungan geometri tetap bisa dipilih (BatchedMesh)

```ts
function buildBatch(gltf: GLTF, material: Material) {
  const meshes: Mesh[] = [];
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse(o => { if ((o as Mesh).isMesh) meshes.push(o as Mesh); });
  let v = 0, i = 0;
  for (const m of meshes) { v += m.geometry.attributes.position.count; i += m.geometry.index!.count; }
  const batch = new BatchedMesh(meshes.length, v, i, material);
  const instanceToFma = new Int32Array(meshes.length);
  for (const m of meshes) {
    const gid = batch.addGeometry(m.geometry);
    const iid = batch.addInstance(gid);
    batch.setMatrixAt(iid, m.matrixWorld);           // memuat transform dekuantisasi (KHR_mesh_quantization)
    instanceToFma[iid] = Number(m.name.slice(3));    // "FMA7088" -> 7088
    m.geometry.dispose();
  }
  return { batch, instanceToFma };
}
```
Catatan teknis:
- Semua geometri dalam satu BatchedMesh harus punya **set atribut dan tipe yang sama**. Pipeline menjamin ini: `POSITION` int16-norm + `NORMAL` int8-norm + index, `--quantization-volume scene`, tanpa UV/warna vertex. Validator memeriksa. Jika kombinasi tipe bermasalah di perangkat tertentu, fallback ke dekuantisasi ke Float32 saat build batch (memori GPU 2× lebih besar, masih dalam anggaran).
- `perObjectFrustumCulled = true` (default) mengurangi segitiga yang digambar saat zoom.
- Chunk > 65.535 vertex: BatchedMesh otomatis memilih index `Uint32Array` (jika `maxVertexCount > 65535`), selain itu `Uint16Array`.
- Alternatif yang **ditolak**: (a) ribuan `Mesh` terpisah, karena ribuan draw call dan CPU-bound di mobile; (b) `join` di pipeline + atribut ID per vertex, karena kehilangan bbox/visibilitas per struktur dan butuh shader custom.

---

## 7. Interaksi

### 7.1 Picking (raycast + BVH)
- `Raycaster.firstHitOnly = true` (three-mesh-bvh) dan `BatchedMesh.prototype.raycast = acceleratedRaycast`.
- Hit menghasilkan `intersection.batchId` (instanceId), lalu `instanceToFma[batchId]`.
- Instance tersembunyi tidak ikut dipilih: `BatchedMesh.raycast` (r186) dan `acceleratedRaycast` (three-mesh-bvh 0.9.16) sama-sama melewati instance dengan `visible=false` (sudah diverifikasi di source); tetap dicakup uji E2E.
- **Hover** di-throttle ke 1 raycast per frame (rAF), hanya pada `pointermove` tanpa tombol ditekan. Pada perangkat sentuh, hover dinonaktifkan dan seleksi terjadi saat `pointerup` dengan pergeseran < 6 px (bedakan dari orbit).
- Biaya target: < 1 ms per pick di desktop, < 4 ms di mobile mid-range dengan BVH.
- Fallback (jika BVH belum selesai dibangun untuk chunk itu): raycast bawaan three hanya pada bbox instance, lalu raycast segitiga pada kandidat.

### 7.2 Seleksi & highlight
- `setColorAt(iid, highlightColor)` untuk struktur terpilih, kembalikan ke `baseColor` saat deseleksi.
- Outline opsional (desktop saja): render ulang instance terpilih ke stencil. Ditunda (tidak masuk MVP).

### 7.3 Isolasi
- `isolate(fmaSet)`: untuk setiap chunk, `setVisibleAt(iid, fmaSet.has(fma))`, lalu kamera `focus()` ke union bbox (dari manifest, tanpa membaca GPU).
- Mode **ghost**: material chunk diubah ke `transparent = true, depthWrite = false`, struktur lain `setColorAt(iid, new Vector4(r,g,b,0.12))`, struktur terisolasi alpha 1. `sortObjects = true` (default BatchedMesh) mengurutkan per instance. Keluar ghost mengembalikan material opaque.

### 7.4 Layer visibility (kupas lapisan)
- Slider `layerMin` 0..5: struktur tampil jika `layer >= layerMin` (0 = semua, 4 = hanya rangka & dalam).
- Implementasi = loop `setVisibleAt` atas `Int8Array layerOf[iid]` per chunk. Ribuan instance memakan < 1 ms.
- Kombinasi akhir: `visible = systemOn && layer >= layerMin && !hidden.has(fma) && (isolated == null || isolated.has(fma))`. Fungsi tunggal `applyVisibility()`.

### 7.5 Pencarian
- `search-index.json` dimuat setelah S3 (≤ 80 KB gzip). Pencarian di Web Worker, debounce 120 ms, maksimum 20 hasil.
- Memilih hasil: jika chunk belum dimuat, `loadChunk()` lalu `select` + `focus`. Indikator "memuat sistem X" ditampilkan.
- Field: `name_en`, `name_id`, (`name_ja` jika ada), sinonim kurasi, dan FMA ID (`fma:7088` atau angka langsung).

### 7.6 Kamera
- `OrbitControls` (`enableDamping` hanya jika tidak reducedMotion), batas zoom dari bbox tubuh, `target` di pusat tubuh.
- `focus()` memakai tween 400 ms (easeInOut). Jika `prefers-reduced-motion: reduce`, kamera melompat langsung (tanpa tween, tanpa damping, tanpa auto-rotate).

---

## 8. Aksesibilitas
- `matchMedia('(prefers-reduced-motion: reduce)')` disimpan di store dan didengarkan perubahannya.
- Semua fungsi tersedia tanpa 3D: daftar struktur hierarkis (tree view ARIA) di SystemPanel. Memilih dari daftar = memilih di 3D.
- Keyboard: Tab ke canvas; panah = orbit; +/- = zoom; Enter pada hasil pencarian = pilih; Esc = keluar isolasi/seleksi.
- Kontras warna sistem diuji (label DOM, bukan teks di canvas). `aria-live="polite"` untuk nama struktur terpilih.
- Bahasa UI: Bahasa Indonesia default, nama Latin/Inggris ditampilkan berdampingan.

---

## 9. Deteksi kemampuan & fallback

```ts
import WebGL from 'three/addons/capabilities/WebGL.js';
const webgl2 = WebGL.isWebGL2Available();
```
| Kondisi | Perilaku |
|---|---|
| Tidak ada WebGL2 | `<FallbackStatic>`: galeri render Blender (WebP, 4 sudut per sistem) + daftar/pencarian struktur + pesan `WebGL.getWebGL2ErrorMessage()` |
| `webglcontextlost` | hentikan loop, overlay "Grafis direset", pada `webglcontextrestored` muat ulang chunk aktif dari cache HTTP |
| Mobile / RAM ≤ 4 GB (`navigator.deviceMemory`) / `saveData` / GPU lemah | tier `lo`, DPR ≤ 1,5, tanpa antialias MSAA, tanpa prefetch, maksimum 4 sistem aktif bersamaan (yang terlama di-unload) |
| FPS adaptif | jika median frame time > 25 ms selama 2 s saat interaksi, turunkan DPR bertahap (min 1,0); jika masih lambat, tawarkan tier `lo` |
| WebGPU | tidak dipakai di MVP (WebGLRenderer lebih stabil lintas perangkat). Evaluasi `WebGPURenderer` di fase berikutnya |

Deteksi GPU (opsional): `WEBGL_debug_renderer_info` untuk heuristik (mis. "Mali-G52", "Adreno 6xx" dianggap tier `lo`). Pakai hanya sebagai petunjuk; default ditentukan oleh UA mobile + deviceMemory.

---

## 10. Manajemen memori GPU & dispose
- `unloadChunk`: `scene.remove(batch)`, `batch.disposeBoundsTree()`, `batch.dispose()` (melepas geometri gabungan + tekstur matriks/warna/indirect), `material.dispose()`, hapus entri `index`.
- Geometri dari glTF di-`dispose()` segera setelah disalin ke batch. Objek `gltf` tidak disimpan.
- `SceneController.dispose()` (unmount React/HMR): hentikan rAF, lepas listener, dispose semua chunk, `renderer.dispose()`, `renderer.forceContextLoss()` hanya saat meninggalkan halaman lab.
- Pantau `renderer.info.memory.geometries/textures` dan `renderer.info.render.calls/triangles` di panel debug (`?debug=1`). Uji E2E memastikan jumlah geometri kembali ke baseline setelah unload.
- React StrictMode men-mount efek dua kali di dev. `useEffect` harus idempoten (buat lalu dispose controller dengan benar).

---

## 11. Struktur kode

```
src/
  main.tsx, App.tsx
  state/store.ts, state/actions.ts, state/url.ts
  capability/detect.ts            // webgl2, tier, reducedMotion, saveData
  lab/Lab.tsx                     // lazy
  lab/Viewport.tsx
  lab/scene/SceneController.ts
  lab/scene/chunkLoader.ts        // fetch + gzip stream + GLTFLoader + buildBatch
  lab/scene/picking.ts            // raycaster + bvh
  lab/scene/visibility.ts         // applyVisibility()
  lab/scene/cameraRig.ts
  lab/search/search.worker.ts
  ui/*                            // panel, slider, info, credits
  fallback/FallbackStatic.tsx
public/
  models/v1/*.glb(.gz)
  data/v1/manifest.json, structures.<system>.json, search-index.json
  fallback/*.webp
vercel.json                       // headers cache immutable untuk /models/** dan /data/v1/**
```

`vercel.json`:
```json
{
  "headers": [
    { "source": "/models/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
    { "source": "/data/v1/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=3600, stale-while-revalidate=86400" } ] }
  ]
}
```
(`manifest.json` tidak berhash, jadi cache pendek. File model berhash, jadi immutable.)

---

## 12. Keputusan & risiko

| Risiko | Mitigasi |
|---|---|
| BatchedMesh + atribut terkuantisasi bermasalah di driver tertentu | flag `forceFloat` (dekuantisasi di klien), diuji di Playwright Chromium/Firefox/WebKit |
| Kuota Fast Data Transfer 100 GB/bulan | muat on-demand, cache immutable, tier lo, gzip; hitung di PERFORMANCE_BUDGET |
| Build BVH memblok main thread | irisan waktu; opsi `GenerateMeshBVHWorker` (three-mesh-bvh) untuk chunk besar |
| Struktur tipis (saraf) sulit diklik | pick radius: jika miss, raycast ulang dengan `Raycaster.params` + 4 sinar offset ±3 px |
| Atribusi lisensi terlupa | `<Credits>` selalu ada di DOM + uji E2E memeriksa teks atribusi |
