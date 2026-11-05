# Shot List Visual 3D (Blender 5.2)

Dasar teknis: `3D_DISSECTION_METHODS.md`. Nomor slide: `3D_PPT_STORYBOARD.md`.

## 0. Standar global

**Resolusi dan format**
- Still: 3840×2160 px, PNG 16-bit RGBA (latar transparan) + komposit dengan latar deck. Cycles, 512–1024 sampel, OptiX denoise.
- MP4: 1920×1080, 30 fps, H.264 High, yuv420p, CRF 18, GOP 30, `+faststart`, tanpa audio. EEVEE (Next) 64–128 sampel atau Cycles 128 + denoise (uji flicker). Poster frame PNG 3840×2160.
- Color management: AgX, look "Medium High Contrast", exposure 0, gamma 1 — terkunci untuk seluruh proyek.

**Rig lampu "STUDIO-A" (default, diparent ke kamera)**
Key area 2×2 m azimut -40° elevasi 35° (1,0; 5600 K) · Fill area 3×3 m azimut +50° elevasi 10° (0,35; 6500 K) · Rim strip ×2 belakang kiri/kanan elevasi 20° (0,8; 7000 K) · World #202226 strength 0,2.
**Varian**: "STUDIO-R" = rim ×1,5 untuk shot vaskular/saraf (struktur tipis); "STUDIO-S" = key lebih frontal (azimut -15°) untuk potongan/cap agar permukaan potong rata terang; "STUDIO-T" = rig tetap di dunia, model berputar (turntable volumetrik).

**Lensa**: ORTHO untuk tampak kardinal; PERSP 85 mm (skema/pipeline, bidang), 100 mm (tubuh utuh oblik, turntable), 135 mm (kepala, jantung, close-up).

### Palet material (hex sRGB; Principled BSDF)
| Kode | Struktur | Base color | Roughness | Catatan |
|---|---|---|---|---|
| BONE | Tulang | `#E6DCC3` | 0,55 | Ivory hangat; subsurface 0,02 opsional di Cycles |
| BONE-SEC | Tulang sekunder (variasi region columna) | `#D8CBAE` | 0,55 | Hanya variasi nilai |
| CART | Kartilago, discus | `#AFC6CC` | 0,35 | Biru-abu pucat seperti kartilago hialin |
| TOOTH | Gigi | `#F3EFE4` | 0,3 | |
| MUS-S | Otot superfisial | `#A63D2E` | 0,6 | Merah-cokelat atlas |
| MUS-D | Otot profunda | `#8A3125` | 0,6 | Lebih gelap untuk membedakan lapis |
| TEND | Tendon, aponeurosis, fasia | `#D9D2C4` | 0,4 | Putih keperakan; specular sedikit tinggi |
| ART | Arteri | `#C8102E` | 0,4 | Merah konvensi |
| VEIN | Vena | `#2F5DB8` | 0,45 | Biru konvensi |
| PORT | Vena porta dan cabang | `#6A4BA8` | 0,45 | Ungu (pembeda sistem porta) |
| NERV | Saraf perifer, kranial | `#F2C230` | 0,5 | Kuning; emisi 0,05 untuk keterbacaan |
| CNS | Otak, medula spinalis | `#E3C2B4` | 0,6 | Merah muda keabu-abuan |
| LYMPH | Limfe, nodus | `#4FA35A` | 0,5 | Hijau konvensi (data terbatas) |
| HEART | Miokardium | `#9C2F2A` | 0,5 | Lebih gelap dari otot rangka |
| LUNG | Paru | `#E8A9A0` | 0,65 | Merah muda; opsi ghost 60% untuk melihat bronkus |
| AIRW | Trakea, bronkus, laring | `#D7C6A8` | 0,45 | Kartilago-ivory kekuningan |
| LIVER | Hati | `#7E2F25` | 0,5 | Cokelat-merah gelap |
| GALL | Kandung empedu, duktus | `#5E8F3E` | 0,4 | Hijau empedu |
| SPLEEN | Limpa | `#6B2C3E` | 0,5 | Ungu-merah |
| GI | Esofagus, lambung, usus halus | `#E0A28A` | 0,55 | Merah muda-salem |
| COLON | Usus besar, rektum | `#C98A6E` | 0,55 | Sedikit lebih gelap dari GI |
| PANC | Pankreas | `#E2B66C` | 0,6 | Kuning-krem lobulated |
| KIDNEY | Ginjal | `#8E3B2F` | 0,5 | |
| URIN | Ureter, kandung kemih, uretra | `#D9B98C` | 0,5 | Kuning pucat |
| ENDO | Tiroid, adrenal, hipofisis | `#B5476A` | 0,5 | Magenta-merah; adrenal boleh `#D79A3A` |
| REPRO | Organ reproduksi | `#C7857C` | 0,5 | Merah muda gelap |
| EYE | Bola mata (sklera) | `#F0EEEA` | 0,25 | |
| SKIN | Kulit / ghost hull | `#D9B59C` | 0,5 | Hanya ghost 20–30% (netral, bukan potret etnis tertentu) |
| GHOST | Konteks transparan | `#9AA3AD` | 0,5 | Alpha 0,10–0,25; facing-ratio rim |
| CAP | Permukaan potong | warna struktur +15% kecerahan | 0,8 | Garis tepi `#1A1A1A` 1 px |
| PLANE | Bidang anatomis/potong | `#5FB7D9` | — | Alpha 0,18, tepi 0,8 |
| HILITE | Outline fokus | `#FFD166` | — | Hanya untuk penekanan, jarang |
| PRINT | Model 3D print (PLA) | `#F4F4F0` | 0,7 | Slide 36 |

Aturan: dalam satu sistem, pembedaan memakai nilai (lebih terang/gelap), bukan hue baru. Hue di luar tabel tidak boleh dipakai.

---

## 1. Daftar shot

Kolom: ID · Slide · Struktur/kelompok · Tampak · Lensa · Proyeksi · Lampu · Material · Transparansi · Output

| ID | Sl | Struktur / kelompok | Tampak | Lensa | Proj | Lampu | Material | Transparansi | Output |
|---|---|---|---|---|---|---|---|---|---|
| S01 | 1 | Semua tulang; otot superfisial sisi kanan pasien; organ toraks-abdomen + arteri utama sisi kiri (split sagital) | Anterolateral 30°, elev 8°, turntable 360° | 100 mm | Persp | STUDIO-T | BONE, MUS-S, TEND, ART, VEIN, HEART, LUNG, LIVER, GI | Tidak ada | MP4 12 dtk (360 f) loop + poster 4K |
| S02 | 2 | Semua tulang; otot superfisial | Anterior | — | Ortho | STUDIO-A | BONE, CART, GHOST | Otot ghost 20% | Still 4K |
| S03a/b/c | 3 | Semua tulang + otot superfisial | Anterior / lateral kanan / posterior | — | Ortho (ortho scale identik) | STUDIO-A | BONE, MUS-S, TEND | — | 3 still 4K (komposit) |
| S04 | 4 | Semua tulang + 3 bidang anatomis | Anterolateral 40°, elev 15° | 85 mm | Persp | STUDIO-A | BONE, PLANE | Bidang 18% | MP4 10 dtk + poster |
| S05 | 5 | Kulit/ghost hull [V]; vena superfisial [V]; otot superfisial terlihat samar | Anterior | — | Ortho | STUDIO-A | SKIN, MUS-S, VEIN | Kulit 25–30% | Still 4K |
| S06 | 6 | Otot superfisial anterior; semua tulang | Anterior | — | Ortho | STUDIO-A | MUS-S, TEND, BONE | — | Still 4K |
| S07 | 7 | Otot profunda anterior; semua tulang; arteri/vena utama | Anterior | — | Ortho | STUDIO-A | MUS-D, TEND, BONE, ART, VEIN | — | Still 4K |
| S08 | 8 | Semua (L0 -> L7 berurutan) | Anterior | — | Ortho | STUDIO-A | Semua | Fade 100->0% per lapis | MP4 20 dtk + poster (lapis organ) |
| S09 | 9 | Cranium, ossa faciei, mandibula, gigi | Anterolateral kiri 35°, elev 5° | 135 mm | Persp | STUDIO-A | BONE, TOOTH | — | Still 4K |
| S10 | 10 | Columna vertebralis, sacrum, coccyx, discus | Lateral kanan | — | Ortho | STUDIO-A | BONE, BONE-SEC, CART | — | Still 4K (rasio vertikal, diletakkan di sisi) |
| S11 | 11 | Costae, sternum, kartilago kosta, vertebrae thoracicae, clavicula; scapula ghost | Anterior-oblik 20°, elev 10° | 100 mm | Persp | STUDIO-A | BONE, CART, GHOST | Scapula 20% | Still 4K |
| S12 | 12 | Hip bone, sacrum, coccyx; femur proksimal ghost | Anterior, elev 35° | 100 mm | Persp | STUDIO-A | BONE, GHOST | Femur 20% | Still 4K |
| S13 | 13 | Rangka ekstremitas atas + bawah kanan | Anterior | — | Ortho | STUDIO-A | BONE, CART | — | 2 still 4K (komposit) |
| S14 | 14 | Otot dinding abdomen 3 lapis, rectus abdominis, costae, pelvis | Anterior, crop T6–pubis | — | Ortho | STUDIO-A | MUS-S, MUS-D, TEND, BONE | Fade per lapis | MP4 10 dtk + poster (stepped window) |
| S15 | 15 | Otot ekstremitas atas kanan, tulang | Anterior (supinasi) | — | Ortho | STUDIO-A | MUS-S, TEND, BONE | — | Still 4K |
| S16 | 16 | Otot gluteal, paha posterior, betis kanan, tulang | Posterior | — | Ortho | STUDIO-A | MUS-S, TEND, BONE | — | Still 4K |
| S17 | 17 | Paru, jantung, trakea-bronkus, pembuluh besar; rangka toraks ghost | Anterior | — | Ortho | STUDIO-A | LUNG, HEART, AIRW, ART, VEIN, GHOST | Rangka 15% | Still 4K |
| S18 | 18 | Jantung, aorta, truncus pulmonalis, vena cava, a. coronaria [V] | Orbit 360°, elev 10° | 135 mm | Persp | STUDIO-T | HEART, ART, VEIN | — | MP4 12 dtk loop + poster |
| S19 | 19 | Hati, kandung empedu, lambung, limpa, usus halus/besar; rangka ghost | Anterior | — | Ortho | STUDIO-A | LIVER, GALL, GI, COLON, SPLEEN, GHOST | Rangka 15% | Still 4K |
| S20 | 20 | Ginjal, ureter, kandung kemih, adrenal, aorta abd., VCI; columna + pelvis ghost | Anterior-oblik 15° | 100 mm | Persp | STUDIO-R | KIDNEY, URIN, ENDO, ART, VEIN, GHOST | Rangka 20% | Still 4K |
| S21 | 21 | Organ pelvis pria [V], rektum, kandung kemih, pelvis tulang terpotong sagital | Lateral kiri (permukaan potong) | — | Ortho | STUDIO-S | URIN, REPRO, COLON, BONE, CAP | — | Still 4K |
| S22 | 22 | Tiroid, paratiroid [V], adrenal, pankreas, hipofisis [V], testis [V]; ghost hull/rangka | Anterior | — | Ortho | STUDIO-A | ENDO, PANC, REPRO, GHOST | Konteks 12% | Still 4K |
| S23 | 23 | Cerebrum, cerebellum, batang otak, medula spinalis [V]; cranium + columna terpotong | Posterolateral 40° | 100 mm | Persp | STUDIO-S | CNS, BONE, CAP | — | Still 4K |
| S24 | 24 | Saraf perifer tersedia [V]; rangka ghost | Anterior (atau posterior) | — | Ortho | STUDIO-R | NERV, GHOST | Rangka 20% | Still 4K |
| S25 | 25 | Semua arteri, jantung; rangka ghost | Turntable | 100 mm | Persp | STUDIO-R/T | ART, HEART, GHOST | Rangka 15% | MP4 12 dtk loop + poster |
| S26 | 26 | Semua vena, sistem porta; hati + rangka ghost | Anterior | — | Ortho | STUDIO-R | VEIN, PORT, GHOST | Hati 20%, rangka 15% | Still 4K |
| S27 | 27 | Cranium, otot kepala-leher (sebagian), a. carotis, v. jugularis, laring, tiroid, faring | Lateral kanan | — | Ortho | STUDIO-A | BONE, MUS-S, ART, VEIN, AIRW, ENDO, GI | Otot superfisial 40% di area jendela | Still 4K |
| S28 | 28 | Jantung, pembuluh besar, esofagus, trakea; rangka toraks ghost; paru sembunyi | Anterior-oblik kiri 25° | 100 mm | Persp | STUDIO-A | HEART, ART, VEIN, GI, AIRW, GHOST | Rangka 15% | Still 4K |
| S29 | 29 | Pankreas, duodenum, ginjal, adrenal, aorta + cabang viseral, VCI, columna lumbal | Anterior | — | Ortho | STUDIO-R | PANC, GI, KIDNEY, ENDO, ART, VEIN, BONE | — | Still 4K |
| S30 | 30 | Semua sistem ekstremitas atas kanan | Anterior | — | Ortho | STUDIO-R | BONE, MUS-S (ghost), ART, VEIN, NERV | Otot 35% | Still 4K |
| S31 | 31 | Semua sistem ekstremitas bawah kanan | Anterior | — | Ortho | STUDIO-R | BONE, MUS-S (ghost), ART, VEIN, NERV | Otot 35% | Still 4K |
| S32 | 32 | Otot punggung superfisial (kiri) + profunda (kanan), scapula, columna, costae | Posterior | — | Ortho | STUDIO-A | MUS-S, MUS-D, TEND, BONE | — | Still 4K |
| S33 | 33 | Tumpukan irisan CT (tekstur grayscale) sebagai balok volume | Oblik 35°, elev 20° | 85 mm | Persp | STUDIO-A (lemah) + emisi irisan | Emission irisan, PLANE | Irisan 85% | Still 4K |
| S34 | 34 | Irisan CT aksial + mask warna (tulang, aorta, hati, ginjal) | Tegak lurus irisan (dari kaudal) | — | Ortho | Tanpa lampu (emisi) | Mask: BONE, ART, LIVER, KIDNEY | Mask 60% | Still 4K |
| S35 | 35 | Satu tulang: voxel staircase / wireframe / mesh halus | Anterolateral identik ×3 | — | Ortho | STUDIO-A | BONE, wireframe `#E6DCC3` di latar | — | Still 4K (triptych) |
| S36 | 36 | CT -> mask -> mesh -> render -> model cetak | Dolly pelan oblik | 85 mm | Persp | STUDIO-A | Emission irisan, BONE, PRINT | Bertahap | MP4 20 dtk + poster |
| S37 | 37 | Tulang cranium dan wajah (exploded radial 25%) | Anterolateral 35° | 135 mm | Persp | STUDIO-A | BONE, TOOTH | — | MP4 10 dtk loop + poster (puncak urai) |
| S38 | 38 | Semua sistem toraks-abdomen; bidang potong menyapu + inset ortho kaudal | Oblik 30° + inset | 85 mm | Persp + Ortho | STUDIO-S | Semua + CAP, PLANE | — | MP4 12 dtk + poster (T8) |
| S39 | 39 | Otot superfisial (ghost), rangka, organ toraks-abdomen | Oblik 30° | 100 mm | Persp | STUDIO-A | MUS-S -> GHOST, BONE, organ | Otot 100% -> 15% | MP4 8 dtk + poster |
| S40 | 40 | Semua; build-up rangka -> organ -> pembuluh -> otot -> siluet | Dolly-out + orbit 180° | 100 mm | Persp | STUDIO-T | Semua | Siluet akhir 25% | MP4 18 dtk + poster |

## 2. Catatan produksi per kelompok
- **Turntable (S01, S18, S25)**: 360 frame / 12 dtk, rotasi linear, frame 1 = frame 361 (dibuang) agar loop mulus.
- **Peel/fade (S08, S14, S39)**: animasikan alpha material per lapis, bukan visibilitas, agar fade halus; kamera diam.
- **Exploded (S37)**: custom property `explode` 0 -> 1 (0–3 dtk), tahan (3–6 dtk), 1 -> 0 (6–9 dtk), tahan 1 dtk.
- **Clipping (S38)**: Boolean Exact per objek dengan driver posisi bidang; render cap dengan material CAP; cek mesh non-manifold.
- **Split sagital (S01, S23, S32)**: gunakan atribut `side` (L/R/M) dari metadata; struktur garis tengah (M) dipotong Boolean di x = 0.
- **Komposit triptych (S03, S13, S35)**: render terpisah dengan ortho scale identik; susun di PowerPoint dengan baseline sama.
- **Penamaan file**: `S##_<slug>_v###.png` / `.mp4`, poster `S##_<slug>_poster.png`.
- **Estimasi waktu render (RTX kelas menengah-atas)**: still 4K Cycles 3–10 menit; MP4 EEVEE 1080p ±1–3 dtk/frame; total MP4 ≈ 4.300 frame.
