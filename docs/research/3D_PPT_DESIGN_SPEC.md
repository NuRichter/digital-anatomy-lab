# Spesifikasi Desain Deck "3D Teknik Anatomi Digital.pptx"

Deck visual: satu visual 3D dominan per slide, teks minimal. Ukuran 16:9 (13,333 × 7,5 in; 33,867 × 19,05 cm). Semua render masuk sebagai PNG 3840×2160 atau MP4 1920×1080.

---

## 1. Latar: gelap netral (direkomendasikan)

**Keputusan: latar gelap netral, bukan hitam murni.** Warna `#16181C` dengan vignette radial halus ke `#0E0F12` di tepi.

Alasan:
1. **Kontras figur–latar**: tulang ivory, kartilago, saraf kuning, dan organ merah muda adalah struktur terang; di latar gelap mereka menjadi titik fokus, seperti Complete Anatomy dan Primal Pictures.
2. **Proyektor**: area putih luas pada proyektor ruang kuliah menimbulkan silau dan "halation" serta membuat warna render tampak pucat. Latar gelap juga menyamarkan batas frame video MP4 (tidak ada kotak putih di sekitar video).
3. **Konsistensi dengan render**: latar render (komposit) persis sama dengan latar slide, sehingga visual 3D menyatu tanpa tepi persegi.
4. **Bukan hitam murni**: di ruangan terang, hitam proyektor tampil abu-abu; `#16181C` memberi transisi lebih halus, dan hitam murni membuat struktur gelap (otot profunda `#8A3125`, vena `#2F5DB8`, hati `#7E2F25`) hilang. Karena itu semua shot memakai rim light (STUDIO-A/R).

Risiko dan mitigasi:
- Ruang sangat terang -> kontras turun. Mitigasi: uji di ruang kelas sebenarnya; sediakan varian latar terang `#F2F0EC` (untuk handout cetak/PDF) dengan render komposit ulang dari PNG transparan.
- Struktur gelap pada latar gelap: wajib rim light; bila perlu naikkan exposure +0,3 khusus shot vaskular.

## 2. Grid tata letak

- 12 kolom; margin luar 0,5 in (1,27 cm) kiri-kanan, 0,4 in atas-bawah; gutter 0,2 in.
- Zona:
  - **Judul**: kiri atas, y = 0,4–1,0 in, lebar maks 8 kolom.
  - **Visual**: area 3D minimal 70% lebar dan 80% tinggi slide; boleh full-bleed (render dengan latar identik).
  - **Label**: kolom kiri dan/atau kanan visual (lebar 2–3 kolom), rata kiri di sisi kanan, rata kanan di sisi kiri.
  - **Footer atribusi**: strip bawah tinggi 0,3 in, y = 7,1–7,4 in.
  - **Penanda bab**: kanan atas (huruf bab + nomor slide), kecil.
- Tata letak baku:
  - **L1 Full-bleed** (hero, MP4 turntable, penutup): visual memenuhi slide, judul di atas visual.
  - **L2 Visual + label dua sisi** (atlas plate): visual tengah 6–7 kolom, label kiri dan kanan.
  - **L3 Visual kiri + label kanan** (struktur vertikal: columna, ekstremitas).
  - **L4 Triptych** (slide 3, 13, 35): tiga panel sama lebar, baseline dan skala sama, keterangan panel di bawah.
- Video MP4: ditempatkan full-bleed (13,333 × 7,5 in) atau di area visual dengan rasio 16:9; set "Play: Automatically", "Loop until stopped" untuk turntable, "Rewind after playing" off untuk sekuens naratif. Poster frame diset dari PNG poster.

## 3. Tipografi (font bawaan Windows)

| Elemen | Font | Ukuran | Warna | Catatan |
|---|---|---|---|---|
| Judul slide | Segoe UI Semibold | 30 pt | `#F2F2F2` | Maks 6 kata, sentence case |
| Subjudul / penanda bab | Segoe UI | 14 pt | `#9AA3AD` | Mis. "C · Sistem Rangka" |
| Label struktur | Segoe UI | 16 pt | `#EDEDED` | Nama FMA (Inggris) |
| Label baris kedua (Latin TA, opsional) | Segoe UI Italic | 12 pt | `#B8BEC6` | Mis. *Os frontale* |
| Overlay orientasi | Segoe UI Semibold | 13 pt, kapital | `#5FB7D9` | Superior, Dextra, dll. |
| Footer atribusi | Segoe UI | 9 pt | `#8A9099` | |
| Judul pembuka/penutup | Georgia | 44 pt | `#F2F2F2` | Opsional, hanya slide 1 dan 40 |

- Segoe UI: jelas di proyektor, tersedia di semua Windows. Fallback (Mac/LibreOffice): Calibri -> Arial. Georgia tersedia di Windows dan macOS.
- Hindari Cambria untuk label kecil di latar gelap (serif tipis kurang terbaca di proyektor); Cambria boleh untuk kutipan bila diperlukan.
- Ukuran minimum di layar: 16 pt untuk konten yang harus dibaca dari belakang kelas.

## 4. Gaya label

- **Leader line**: 1 pt, `#D0D4DA` 85% opasitas; lurus atau satu tekukan (siku/45°); tidak boleh saling menyilang; tidak menutupi struktur fokus lebih dari perlu.
- **Ujung penunjuk**: titik bulat 5 px `#FFFFFF` dengan cincin 1 px `#16181C` (tetap terbaca di atas struktur terang maupun gelap).
- **Penjajaran**: label tersusun dalam kolom vertikal di kiri/kanan visual dengan jarak antar baris seragam (≥ 0,35 in); urutan label mengikuti urutan anatomis dari superior ke inferior.
- **Jumlah**: ≤ 6 per slide.
- **Pembeda sistem**: penanda kecil (kotak 8×8 px) warna sistem sebelum nama label, mis. kotak `#C8102E` untuk arteri. Warna tidak menjadi satu-satunya pembeda (nama sudah menyebut jenis).
- **Label untuk MP4**: ditempatkan sebagai objek PowerPoint di atas video (bukan dibakar ke video), dengan animasi Appear sinkron; untuk turntable, tidak ada label struktur (posisi berubah).
- Struktur [V]/ilustratif ditandai label italic dengan akhiran "(ilustratif)".

## 5. Footer atribusi (setiap slide)

Teks (9 pt, kiri bawah):
`Model 3D: BodyParts3D © Database Center for Life Science (DBCLS), CC BY-SA 2.1 JP — dimodifikasi; render Blender. Teknik Anatomi Digital`
- Bila memakai sumber tambahan (Z-Anatomy, dataset CT), tambahkan nama dan lisensinya pada slide terkait.
- Konsekuensi ShareAlike: render dan model turunan didistribusikan dengan lisensi CC BY-SA yang sama; cantumkan pernyataan ini di slide penutup.
- Kanan bawah: nomor slide (`#8A9099`, 9 pt).

## 6. Palet warna deck

### UI / tata letak
| Peran | Hex |
|---|---|
| Latar utama | `#16181C` |
| Vignette tepi | `#0E0F12` |
| Panel/strip (jarang) | `#202328` |
| Teks utama | `#F2F2F2` |
| Teks label | `#EDEDED` |
| Teks sekunder | `#B8BEC6` |
| Teks redup / footer | `#8A9099` |
| Leader line | `#D0D4DA` |
| Aksen orientasi/bidang | `#5FB7D9` |
| Aksen highlight (jarang) | `#FFD166` |
| Varian latar terang (handout) | `#F2F0EC`, teks `#1E2126` |

### Material anatomi (ringkas; lengkap di 3D_VISUAL_SHOTLIST.md)
Tulang `#E6DCC3` · Kartilago `#AFC6CC` · Otot superfisial `#A63D2E` · Otot profunda `#8A3125` · Tendon `#D9D2C4` · Arteri `#C8102E` · Vena `#2F5DB8` · Porta `#6A4BA8` · Saraf `#F2C230` · SSP `#E3C2B4` · Limfe `#4FA35A` · Jantung `#9C2F2A` · Paru `#E8A9A0` · Hati `#7E2F25` · Empedu `#5E8F3E` · Limpa `#6B2C3E` · Saluran cerna `#E0A28A` · Kolon `#C98A6E` · Pankreas `#E2B66C` · Ginjal `#8E3B2F` · Urinaria `#D9B98C` · Endokrin `#B5476A` · Reproduksi `#C7857C` · Ghost `#9AA3AD`.

Kontras teks: `#EDEDED` pada `#16181C` ≈ 15:1; `#8A9099` pada `#16181C` ≈ 5,4:1 (lolos WCAG AA).

## 7. Penanda bab
Slide pembuka tiap bab tidak dibuat terpisah (menghemat jumlah slide); huruf bab muncul di penanda kanan atas, mis. "B · Lapis demi Lapis  06". Bila diperlukan pembatas bab, gunakan frame poster MP4 bab tersebut dengan overlay judul bab (Georgia 40 pt).

## 8. Uji akhir
- [ ] Putar di laptop presentasi + proyektor kelas; cek MP4 tertanam (bukan tautan), ukuran total deck (target < 500 MB).
- [ ] Ekspor PDF (poster frame menggantikan video) untuk distribusi.
- [ ] Cek keterbacaan label dari baris belakang.
- [ ] Atribusi di semua slide; label [V] sudah terverifikasi atau diganti.
