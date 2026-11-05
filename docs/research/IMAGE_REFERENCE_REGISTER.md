# Register gambar

## Gambar dari deck sumber (dipertahankan di V2)
| Slide V2 | Gambar | Kredit dan lisensi (sesuai keterangan deck sumber) |
|---|---|---|
| 3 | Vesalius, *De humani corporis fabrica* (1543) | Wellcome Collection, Public Domain Mark |
| 9 | Volume rendering CT toraks | M. Häggström, CC0 1.0, via Wikimedia Commons |
| 26, 28 | Potongan toraks dan abdomen Visible Human pria | Courtesy of the U.S. National Library of Medicine |
| 35 | Model tengkorak hasil cetak 3D | Foto Nevit Dilmen, CC BY-SA 3.0 (dipotong) |
| 42 | Cinematic rendering CT seluruh tubuh | Fellner FA (2016), CC BY 4.0 (dipotong) |
| 11–24, 39 | Diagram, grafik, citra phantom sintetis | Digambar ulang/dihasilkan dari Buku Ajar Bab 1–5 |
| 1 | Foto dosen dan presenter | Milik pemilik deck |

Dihapus: grafik wireframe pada sampul dan penutup (tidak memiliki kredit), diganti render BodyParts3D.
Kredit di atas belum diverifikasi ulang ke halaman sumber masing-masing dalam sesi ini; lihat `CONTENT_AUDIT.md` (F24).

## Render baru (dibuat untuk proyek ini)
Semua render berasal dari **BodyParts3D, © The Database Center for Life Science, CC BY 4.0**, dirender dengan Blender 5.2.2 (Cycles, GPU) melalui skrip `C:\Users\NuRichter\anat\scripts\shots.py`, `recon.py`, `anim.py`.

| Berkas | Isi | Dipakai di |
|---|---|---|
| A_skin_front/right/back, A_skin_oblique, A_all_oblique | tubuh utuh | V2 15; 3D 1–2 |
| B_L1…L6_front, B_L2/L3_back | enam lapisan diseksi | V2 8; 3D 5–7, 42 |
| C_* (skeleton, skull, spine, cage, pelvis, limbs, hand) | rangka | 3D 8–14 |
| D_* (muscle front/back/oblique, limbs, head-neck) | otot | 3D 15–19 |
| E_* (organs, heart, lungs, bronchial tree, abdomen, urinary, reproductive, endocrine) | organ | V2 30; 3D 20–26 |
| F_* (brain, brain deep, arteries, veins, brain arteries, orbit, vessels in skin) | saraf dan pembuluh | V2 30; 3D 27–31 |
| G_* (head-neck, thorax, abdomen, limbs, back) | regional | 3D 32–36 |
| H_vert_voxel/smooth/wire/decimated | vertebra lumbal III, empat representasi (voxel = simulasi remesh) | V2 23; 3D 37–38 |
| I_transparent, I_transparent_oblique | transparansi kulit | V2 1; 3D 4, 41 |
| Video turntable, layers, heart, skull, clip | animasi MP4 H.264 | 3D 3, 5, 22, 39, 40 |
