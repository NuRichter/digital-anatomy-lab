# Spesifikasi desain PPT Teknik Anatomi Digital V2

Keputusan utama: **mempertahankan sistem desain deck sumber** (sudah konsisten, terbaca, dan akademik), lalu memperkuat isi, visual 3D, dan akurasi. Nilai di bawah dibaca langsung dari XML deck sumber dan dipakai oleh skrip pembangun (`C:\Users\NuRichter\anat\scripts\build_v2.py`, `pptlib.py`).

## Kanvas dan grid
- Slide 960 × 540 pt (16:9; 10 × 5,625 in).
- Margin kiri/kanan 47 pt; area konten 866 pt. Kicker y = 30, judul y = 49, area isi y = 112–470, baris sumber y = 478, footer y = 504.
- Indikator bagian (lima kotak 9 pt) di kanan atas; nomor "NN / 47" di kanan bawah, dinomori ulang otomatis.

## Tipografi (font bawaan Windows/Office)
| Peran | Font | Ukuran |
|---|---|---|
| Judul slide | Georgia | 28 pt |
| Judul pembatas bagian | Georgia | 40 pt (angka 120 pt) |
| Kicker bagian | Segoe UI Semibold, kapital | 10 pt |
| Isi | Segoe UI | 12,5–17 pt |
| Tabel | Segoe UI / Semibold | 10,5–12 pt |
| Sumber dan footer | Segoe UI | 9–10 pt |

Kanvas 10 in: 13 pt setara ±17 pt pada kanvas 13,33 in. Ukuran di bawah 12 pt hanya untuk tabel rujukan, sumber, dan daftar pustaka.

## Warna
| Token | Hex | Pemakaian |
|---|---|---|
| navy | #14283F | latar pembatas bagian dan sampul |
| ink | #17212B | teks utama, header tabel |
| slate | #526170 | teks sekunder, sumber |
| blue | #2D6FA3 | aksen utama, langkah proses |
| orange | #CB6827 | penekanan, demo, peringatan |
| teal | #218C83 | diskusi, kategori ketiga |
| light | #F7F8FA | panel latar |
| rule | #DCE3E9 | garis tipis |
| stage | #15191E | panel render 3D (baru; selaras dengan deck 3D) |

## Arketipe layout
1. Pembatas bagian: navy kiri, foto berkredit kanan, linimasa waktu.
2. Proses/diagram: kotak bernomor dengan panah.
3. Gambar + teks: visual kiri, poin kanan.
4. Data sorotan: angka besar + keterangan.
5. Tabel: header ink, baris zebra, kolom pertama semibold.
6. **Panel 3D (baru)**: panel stage gelap berisi render BodyParts3D dengan keterangan terang (slide 8, 15, 23, 30; sampul dan penutup).

## Aturan sumber dan atribusi
- Setiap slide isi memiliki baris "Sumber:".
- Render 3D selalu mencantumkan "BodyParts3D (DBCLS), CC BY 4.0"; daftar lengkap di slide 47.
- Simulasi (mask voxel) dan phantom sintetis dinyatakan eksplisit pada slide.
