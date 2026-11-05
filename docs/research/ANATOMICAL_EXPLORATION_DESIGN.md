# Desain Eksplorasi Anatomi Interaktif (Website)

Pendamping deck "3D Teknik Anatomi Digital". Deck = narasi linear terkurasi; website = eksplorasi bebas atas data yang sama (BodyParts3D, FMA). Kedua media memakai palet, nama struktur, dan urutan lapis yang identik.

---

## 1. Model data

Setiap mesh membawa metadata (diekspor dari custom property Blender ke `extras` glTF):

```json
{
  "fma_id": "FMA7088",
  "name_en": "Heart",
  "name_la": "Cor",
  "name_id": "Jantung",
  "system": "cardiovascular",
  "subsystem": "heart",
  "region": ["thorax"],
  "layer": "L6",
  "side": "M",
  "source": "BodyParts3D",
  "verified": true
}
```

- `name_en` mengikuti FMA/BodyParts3D (kunci pencarian dan label utama).
- `name_la` (Terminologia Anatomica) dan `name_id` ditambahkan manual; boleh kosong.
- `verified=false` untuk struktur ilustratif (ghost hull) atau sumber non-BodyParts3D.
- Catatan: ID FMA pada contoh di atas hanya ilustrasi format — isi dari tabel BodyParts3D.

## 2. Hierarki navigasi

Dua pohon paralel atas objek yang sama; pengguna bisa beralih tab.

### 2.1 Pohon sistem (default)
```
Tubuh
├── Rangka (Skeletal)
│   ├── Rangka aksial: Cranium · Columna vertebralis · Cavea thoracis (costae, sternum)
│   ├── Rangka apendikular atas: cingulum pectorale · humerus · antebrachium · manus
│   ├── Rangka apendikular bawah: pelvis · femur · crus · pes
│   └── Kartilago dan sendi (bila tersedia)
├── Otot (Muscular)
│   ├── Kepala-leher · Batang tubuh (anterior/posterior) · Ekstremitas atas · Ekstremitas bawah
│   └── Dalam tiap kelompok: Superfisial (L3) · Profunda (L4)
├── Kardiovaskular: Jantung · Arteri · Vena · Sistem porta
├── Saraf (Nervous): Otak · Medula spinalis · Saraf kranial · Saraf spinal/perifer [parsial]
├── Respirasi: Laring · Trakea · Bronkus · Paru (lobus/segmen)
├── Pencernaan: Faring · Esofagus · Lambung · Usus halus · Usus besar · Hati (segmen) · Kandung empedu · Pankreas
├── Urinaria: Ginjal · Ureter · Kandung kemih · Uretra
├── Reproduksi (model pria) [verifikasi]
├── Endokrin: Tiroid · Paratiroid · Adrenal · Pankreas (endokrin) · Hipofisis [verifikasi]
├── Limfatik [sangat terbatas, verifikasi]
└── Indra: Bola mata dan struktur internal · Telinga (bila ada)
```

### 2.2 Pohon regional
`Kepala-leher · Toraks · Abdomen · Pelvis-perineum · Punggung · Ekstremitas atas (bahu, lengan atas, lengan bawah, tangan) · Ekstremitas bawah (gluteal, paha, tungkai, kaki)`.
Struktur yang melintasi region (mis. aorta, n. ischiadicus) muncul di semua region terkait (`region` berupa array).

### 2.3 Urutan lapis (slider kedalaman)
| Posisi slider | Lapis yang terlihat | Keterangan |
|---|---|---|
| 0 | L0 kulit / ghost hull | Ghost hull ditandai "ilustratif" |
| 1 | + L1 vena dan saraf superfisial | |
| 2 | L3 otot superfisial | L0 hilang |
| 3 | L4 otot profunda | L3 menjadi ghost 15% |
| 4 | L5 neurovaskular | otot ghost |
| 5 | L6 organ | |
| 6 | L7 rangka saja | |
Slider berjalan diskret (snap) dengan transisi fade 300 ms; lapis di atas lapis aktif menjadi ghost, bukan hilang total (opsi "sembunyikan penuh" tersedia).

## 3. Pola interaksi

| Pola | Kontrol | Detail |
|---|---|---|
| Orbit / pan / zoom | Drag kiri / kanan / scroll; pinch di sentuh | Orbit mengunci sumbu vertikal (turntable-style) agar tubuh tidak terbalik; batas zoom |
| Preset tampak | Tombol A · P · Ka · Ki · S · I · Oblik | Transisi kamera 600 ms; preset A/P/L memakai kamera ortografis (toggle ortho/persp) |
| Pilih struktur | Klik / tap | Struktur di-highlight (outline), panel info: nama EN/LA/ID, sistem, region, FMA ID |
| Hide / Ghost / Isolate | Menu konteks atau tombol panel (H / G / I) | Isolate = hanya struktur terpilih + rangka ghost |
| Toggle sistem | Checkbox pohon dengan status tiga keadaan (tampil/ghost/sembunyi) | |
| Slider lapis | Lihat 2.3 | |
| Slider transparansi global | 0–100% untuk sistem non-fokus | |
| Bidang potong | Toggle axial/sagital/koronal + slider posisi | Cap berwarna; inset menampilkan potongan 2D (opsional: pasangan citra CT bab H) |
| Exploded | Slider 0–1 per kelompok yang mendukung (cranium, columna, tangan, kaki, segmen hati/paru) | |
| Pencarian | Kotak cari (EN/LA/ID, toleran salah ketik) | Kamera terbang ke struktur dan isolate |
| Label pin | Toggle "tampilkan label"; maks ±8 label otomatis untuk struktur terdekat ke kamera | Label pin 2D dengan leader line, menghindari tabrakan |
| Tur terpandu | Urutan langkah yang meniru slide deck (A–J) | Menghubungkan kuliah dan eksplorasi mandiri |
| Mode kuis | Struktur di-highlight acak, pengguna memilih nama | Umpan balik langsung |
| Reset | Tombol + tombol Esc | |
| Bagikan tampilan | URL menyimpan state (kamera, visibilitas, potongan) | Dosen bisa mengirim tautan ke tampilan spesifik |

## 4. Teknologi yang disarankan
- **three.js** (atau Babylon.js) dengan glTF 2.0 (.glb), kompresi **Meshopt** atau **Draco**; tekstur tidak diperlukan (warna material per sistem).
- Satu .glb per sistem (lazy-load): rangka dimuat pertama (≈ ringan), sistem lain saat diaktifkan.
- Decimation per struktur (target total < 1,5–2 juta segitiga untuk desktop, < 600 ribu untuk mobile), dengan versi LOD.
- Material: `MeshStandardMaterial` dengan warna palet yang sama (hex identik dengan deck), roughness 0,55–0,7; ghost = transparan + `depthWrite:false` + urutan render per sistem.
- Ambient occlusion: SSAO/GTAO ringan, atau AO yang di-bake ke warna vertex dari Blender.
- Picking: raycast dengan BVH (three-mesh-bvh).
- Clipping: `material.clippingPlanes` + teknik stencil untuk cap.
- Pencahayaan: rig 3 lampu yang meniru rig Blender (key/fill/rim) + environment netral redup; latar #16181C (sama dengan deck).
- Aksesibilitas: semua tombol bisa diakses keyboard; nama struktur dalam teks (bukan hanya visual); jangan hanya mengandalkan warna merah/biru untuk arteri/vena (panel info menyebut jenis); kontras teks ≥ 4.5:1.
- Atribusi: footer tetap "Model 3D: BodyParts3D © DBCLS (CC BY-SA 2.1 JP), dimodifikasi" + tautan lisensi; model turunan .glb dibagikan dengan lisensi yang sama.

## 5. Pembagian peran deck vs web
| Kebutuhan | Deck PPT | Web |
|---|---|---|
| Narasi kuliah, urutan terkurasi | Ya | Tur terpandu |
| Kualitas render maksimal (path tracing) | Ya | Tidak |
| Eksplorasi bebas, pencarian | Tidak | Ya |
| Bekerja offline di ruang kelas | Ya (MP4 tertanam) | Perlu build offline/PWA |
| Evaluasi mahasiswa | Tidak | Kuis |

Setiap slide deck dapat menampilkan kode QR kecil ke state web yang setara (opsional, pojok kanan bawah di atas footer) agar mahasiswa bisa membuka tampilan yang sama.
