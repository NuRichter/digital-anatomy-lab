# Storyboard Deck "3D Teknik Anatomi Digital.pptx"

Format 16:9, deck visual (teks minimal), satu visual 3D dominan per slide. 40 slide dalam bab A–J.
Kode shot (S##) merujuk ke `3D_VISUAL_SHOTLIST.md`. Desain tata letak di `3D_PPT_DESIGN_SPEC.md`.

**Aturan umum**
- Judul ≤ 6 kata, Bahasa Indonesia dengan istilah Latin/Inggris.
- Label maks. ~6 per slide, memakai **nama FMA/BodyParts3D (Inggris)**; nama Latin TA boleh sebagai baris kedua kecil (opsional). Semua label harus dicek ke tabel parts BodyParts3D sebelum final.
- Penanda **[V]** = cakupan data perlu diverifikasi; rencana cadangan disebutkan.
- Kamera: ORTHO = ortografis; PERSP xx mm = perspektif dengan focal length.
- MP4 selalu punya poster frame (frame pertama) sebagai fallback.

---

## A. Tubuh Utuh dan Orientasi (slide 1–4)

**1. Tubuh Manusia Digital** — S01
- Visual: shot hero; tubuh utuh berdiri, separuh kanan pasien menampilkan otot superfisial, separuh kiri menampilkan rangka + organ (split sagital). Turntable pelan.
- Kelompok: semua tulang, otot superfisial (sisi kanan), organ toraks-abdomen (sisi kiri), arteri utama.
- Kamera: PERSP 100 mm, oblik anterolateral 30°, elevasi 8°.
- Media: MP4 12 dtk loop (turntable 360°); poster = anterior.
- Label: tidak ada (slide judul).

**2. Posisi Anatomis Standar** — S02
- Visual: rangka + otot superfisial ghost 20%, tampak anterior; panah orientasi overlay (Superior/Inferior, Dextra/Sinistra pasien, Medial/Lateral).
- Kelompok: semua tulang; otot superfisial ghost.
- Kamera: ORTHO anterior.
- Media: still.
- Label (overlay orientasi, bukan struktur): Superior, Inferior, Dextra, Sinistra, Medialis, Lateralis.

**3. Anterior, Lateral, Posterior** — S03a/b/c
- Visual: triptych tiga tampak kardinal tubuh utuh berdampingan, skala identik (ortho), satu baris dasar.
- Kelompok: semua tulang + otot superfisial.
- Kamera: ORTHO anterior / lateral kanan / posterior.
- Media: still (komposit tiga render).
- Label: Anterior, Lateral, Posterior (judul kolom saja).

**4. Bidang dan Sumbu Tubuh** — S04
- Visual: rangka utuh dengan tiga bidang semitransparan (sagital biru-abu, koronal, transversal) yang menyapu bergantian.
- Kelompok: semua tulang; bidang potong.
- Kamera: PERSP 85 mm, oblik anterolateral 40°, elevasi 15°.
- Media: MP4 10 dtk (tiap bidang ~3 dtk); poster = ketiga bidang tampil.
- Label: Planum sagittale, Planum frontale (coronal), Planum transversale.

## B. Lapis demi Lapis (slide 5–8)

**5. Lapis 1: Permukaan Tubuh** — S05 [V]
- Visual: tubuh utuh dengan kulit (jika tersedia di BodyParts3D/Z-Anatomy) atau ghost hull ilustratif 25% yang memperlihatkan bayangan otot di dalamnya.
- Kelompok: kulit/ghost hull; vena superfisial bila tersedia.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Skin [V], Cephalic vein [V], Great saphenous vein [V]. Cadangan: tanpa label struktur, catatan "siluet ilustratif".

**6. Lapis 2: Otot Superfisial** — S06
- Visual: otot superfisial penuh, rangka hanya terlihat di wajah/sendi.
- Kelompok: otot superfisial anterior, semua tulang.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Pectoralis major, Deltoid, External oblique, Rectus abdominis (sheath bila ada), Sartorius, Quadriceps femoris (Rectus femoris).

**7. Lapis 3: Otot Profunda** — S07
- Visual: otot superfisial dihapus; otot profunda opak; arteri dan vena besar mulai tampak.
- Kelompok: otot profunda anterior, semua tulang, arteri/vena utama.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Pectoralis minor, Internal oblique, Transversus abdominis, Serratus anterior, Iliopsoas, Adductor longus.

**8. Diseksi Virtual Berurutan** — S08
- Visual: animasi peel L0 -> L7 (permukaan -> otot superfisial -> profunda -> neurovaskular -> organ -> rangka), kamera diam.
- Kelompok: semua.
- Kamera: ORTHO anterior.
- Media: MP4 20 dtk; poster = lapis organ in situ.
- Label: indikator lapis di pinggir (L0–L7) sebagai overlay; tanpa label struktur.

## C. Sistem Rangka (slide 9–13)

**9. Cranium** — S09
- Visual: tengkorak anterolateral, tulang ivory, sutura tampak; mandibula sedikit diturunkan.
- Kelompok: ossa cranii, ossa faciei, mandibula, gigi bila ada.
- Kamera: PERSP 135 mm, oblik anterolateral kiri 35°, elevasi 5°.
- Media: still.
- Label: Frontal bone, Parietal bone, Temporal bone, Sphenoid bone, Maxilla, Mandible.

**10. Columna Vertebralis** — S10
- Visual: tulang belakang tampak lateral memperlihatkan kurva; region diberi variasi nilai ivory (bukan hue) halus per region.
- Kelompok: vertebrae cervicales, thoracicae, lumbales, sacrum, coccyx, discus intervertebralis bila ada.
- Kamera: ORTHO lateral kanan.
- Media: still.
- Label: Atlas, Axis, Seventh cervical vertebra, Twelfth thoracic vertebra, Fifth lumbar vertebra, Sacrum.

**11. Cavea Thoracis** — S11
- Visual: rangka toraks anterior-oblik dengan kartilago kosta biru-abu.
- Kelompok: costae, sternum, kartilago kosta, vertebrae thoracicae, clavicula, scapula ghost.
- Kamera: PERSP 100 mm, oblik anterior 20°, elevasi 10°.
- Media: still.
- Label: Manubrium of sternum, Body of sternum, Xiphoid process, First rib, Costal cartilage, Clavicle.

**12. Pelvis** — S12
- Visual: pelvis tampak anterosuperior (melihat pintu atas panggul).
- Kelompok: hip bone (ilium, ischium, pubis), sacrum, coccyx, femur proksimal ghost.
- Kamera: PERSP 100 mm, anterior dengan elevasi 35° (dari atas-depan).
- Media: still.
- Label: Hip bone, Ilium, Pubis, Ischium, Sacrum, Coccyx.

**13. Rangka Ekstremitas** — S13
- Visual: rangka ekstremitas atas dan bawah kanan berdampingan, ortho anterior, skala sama.
- Kelompok: clavicula, scapula, humerus, radius, ulna, ossa manus; femur, patella, tibia, fibula, ossa pedis.
- Kamera: ORTHO anterior (komposit 2 render).
- Media: still.
- Label: Humerus, Radius, Ulna, Femur, Tibia, Fibula.

## D. Sistem Otot (slide 14–16)

**14. Dinding Abdomen Berlapis** — S14
- Visual: animasi tiga lapis otot dinding abdomen menghilang satu per satu (obliquus externus -> internus -> transversus), memperlihatkan arah serat berbeda.
- Kelompok: otot dinding anterior abdomen, rectus abdominis, costae dan pelvis.
- Kamera: ORTHO anterior, crop toraks bawah–pelvis.
- Media: MP4 10 dtk; poster = ketiga lapis tampak dengan potongan berundak (stepped window).
- Label: External oblique, Internal oblique, Transversus abdominis, Rectus abdominis.

**15. Otot Ekstremitas Atas** — S15
- Visual: lengan kanan anterior, otot superfisial; tendon putih keperakan di pergelangan.
- Kelompok: otot bahu, lengan atas, lengan bawah, tangan; tulang ekstremitas atas.
- Kamera: ORTHO anterior (lengan supinasi).
- Media: still.
- Label: Deltoid, Biceps brachii, Brachialis, Brachioradialis, Flexor carpi radialis, Palmaris longus [V].

**16. Otot Ekstremitas Bawah** — S16
- Visual: tungkai kanan tampak posterior: gluteal, hamstring, betis.
- Kelompok: otot gluteal, paha posterior, crus posterior; tulang ekstremitas bawah.
- Kamera: ORTHO posterior.
- Media: still.
- Label: Gluteus maximus, Biceps femoris, Semitendinosus, Semimembranosus, Gastrocnemius, Soleus.

## E. Organ Dalam (slide 17–22)

**17. Organ Rongga Toraks** — S17
- Visual: paru dan jantung in situ; costae dan sternum ghost 15%.
- Kelompok: paru kanan-kiri, jantung, trakea-bronkus, pembuluh besar, rangka toraks ghost.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Right lung, Left lung, Heart, Trachea, Aortic arch, Superior vena cava.

**18. Jantung dan Pembuluh Besar** — S18
- Visual: jantung turntable dengan aorta, truncus pulmonalis, vena cava; arteri koroner bila ada.
- Kelompok: jantung, pembuluh besar, arteri koroner [V].
- Kamera: PERSP 135 mm, mengorbit.
- Media: MP4 12 dtk loop; poster = anterior.
- Label: Right ventricle, Left ventricle, Right atrium, Ascending aorta, Pulmonary trunk, Right coronary artery [V].

**19. Organ Rongga Abdomen** — S19
- Visual: viscera abdomen in situ setelah dinding abdomen dihapus.
- Kelompok: hati, kandung empedu, lambung, limpa, usus halus, usus besar; rangka ghost.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Liver, Stomach, Spleen, Transverse colon, Jejunum, Gallbladder.

**20. Sistem Urinaria** — S20
- Visual: ginjal, ureter, kandung kemih dengan aorta abdominalis dan VCI; viscera lain disembunyikan; columna dan pelvis ghost.
- Kelompok: ginjal, ureter, kandung kemih, adrenal, aorta abdominalis, vena cava inferior, rangka ghost.
- Kamera: PERSP 100 mm, anterior-oblik 15°.
- Media: still.
- Label: Right kidney, Left kidney, Ureter, Urinary bladder, Abdominal aorta, Inferior vena cava.

**21. Pelvis dan Reproduksi** — S21 [V]
- Visual: potongan sagital median pelvis pria (model BodyParts3D pria) memperlihatkan kandung kemih, prostat, rektum.
- Kelompok: organ pelvis, organ reproduksi pria, pelvis tulang terpotong (cap).
- Kamera: ORTHO lateral kiri (melihat permukaan potong).
- Media: still.
- Label: Urinary bladder, Prostate [V], Rectum, Seminal vesicle [V], Pubic symphysis [V], Sacrum. Cadangan: bila organ reproduksi tidak tersedia, slide menjadi "Organ Pelvis" tanpa label reproduksi; organ wanita hanya bila sumber tambahan terverifikasi.

**22. Kelenjar Endokrin** — S22
- Visual: tubuh ghost 12% dengan kelenjar endokrin opak beremisi lemah (efek "peta").
- Kelompok: tiroid, paratiroid [V], adrenal, pankreas, hipofisis [V], testis [V]; ghost hull/rangka.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Thyroid gland, Suprarenal gland, Pancreas, Pituitary gland [V], Testis [V].

## F. Saraf dan Pembuluh (slide 23–26)

**23. Otak dan Medula Spinalis** — S23
- Visual: otak dan medula spinalis in situ; cranium dan columna dibuka (potongan sagital kiri) sehingga SSP tampak.
- Kelompok: cerebrum, cerebellum, batang otak, medula spinalis [V], cranium + columna terpotong.
- Kamera: PERSP 100 mm, oblik posterolateral 40°.
- Media: still.
- Label: Cerebral hemisphere, Cerebellum, Brainstem (Pons, Medulla oblongata), Spinal cord [V].

**24. Saraf Perifer** — S24 [V]
- Visual: saraf perifer kuning di atas rangka ghost; fokus pleksus brakialis dan n. ischiadicus.
- Kelompok: saraf yang tersedia (perlu inventaris), rangka ghost 20%.
- Kamera: ORTHO anterior (atau posterior untuk ischiadicus).
- Media: still.
- Label: Sciatic nerve [V], Femoral nerve [V], Median nerve [V], Ulnar nerve [V], Radial nerve [V].
- Cadangan: bila saraf perifer minim, ganti dengan "Saraf Kranial dan Otak" atau gunakan Z-Anatomy dengan atribusi tambahan.

**25. Sistem Arteri** — S25
- Visual: pohon arteri sistemik merah di dalam rangka ghost; turntable.
- Kelompok: semua arteri, jantung, rangka ghost 15%.
- Kamera: PERSP 100 mm, turntable.
- Media: MP4 12 dtk loop; poster = anterior.
- Label: Aorta, Common carotid artery, Subclavian artery, Abdominal aorta, Common iliac artery, Femoral artery.

**26. Sistem Vena dan Porta** — S26
- Visual: vena sistemik biru + sistem porta ungu; hati ghost.
- Kelompok: semua vena, vena porta dan cabang, hati ghost, rangka ghost.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Superior vena cava, Inferior vena cava, Internal jugular vein, Hepatic portal vein, Femoral vein, Great saphenous vein [V].

## G. Anatomi Regional (slide 27–32)

**27. Regio Kepala dan Leher** — S27
- Visual: kepala-leher lateral: otot superfisial wajah/leher sebagian dibuka memperlihatkan a. carotis, v. jugularis, tiroid, laring.
- Kelompok: cranium, otot kepala-leher, arteri/vena leher, laring, tiroid, faring.
- Kamera: ORTHO lateral kanan.
- Media: still.
- Label: Sternocleidomastoid, Masseter, Common carotid artery, Internal jugular vein, Thyroid cartilage, Thyroid gland.

**28. Regio Toraks: Mediastinum** — S28
- Visual: paru disembunyikan, mediastinum tampak: jantung, aorta, esofagus, trakea.
- Kelompok: jantung, pembuluh besar, esofagus, trakea, rangka toraks ghost.
- Kamera: PERSP 100 mm, anterior-oblik kiri 25°.
- Media: still.
- Label: Heart, Aortic arch, Esophagus, Trachea, Thoracic aorta, Azygos vein [V].

**29. Regio Abdomen: Retroperitoneum** — S29
- Visual: viscera intraperitoneal disembunyikan; aorta dengan truncus coeliacus, a. mesenterica, ginjal, pankreas.
- Kelompok: pankreas, duodenum, ginjal, adrenal, aorta + cabang, VCI, columna lumbal.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Celiac trunk, Superior mesenteric artery, Pancreas, Duodenum, Renal artery, Inferior vena cava.

**30. Regio Ekstremitas Atas** — S30
- Visual: topografi lengan: otot ghost 35%, arteri, vena, saraf (bila ada), tulang.
- Kelompok: semua sistem pada ekstremitas atas kanan.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Axillary artery, Brachial artery, Radial artery, Ulnar artery, Median nerve [V], Biceps brachii.

**31. Regio Ekstremitas Bawah** — S31
- Visual: trigonum femorale dan tungkai: arteri/vena/nervus femoralis di antara otot.
- Kelompok: semua sistem pada ekstremitas bawah kanan, otot ghost.
- Kamera: ORTHO anterior.
- Media: still.
- Label: Femoral artery, Femoral vein, Femoral nerve [V], Sartorius, Popliteal artery, Anterior tibial artery.

**32. Regio Punggung** — S32
- Visual: punggung posterior dibelah: sisi kiri otot superfisial (trapezius, latissimus), sisi kanan otot profunda (erector spinae).
- Kelompok: otot punggung superfisial + profunda, scapula, columna, costae.
- Kamera: ORTHO posterior.
- Media: still.
- Label: Trapezius, Latissimus dorsi, Rhomboid major, Erector spinae (Iliocostalis/Longissimus), Scapula, Thoracolumbar fascia [V].

## H. Rekonstruksi Digital (slide 33–36) — kaitan Bab 2–3, 5

Catatan: langkah citra memerlukan data CT/MRI (bukan BodyParts3D). Gunakan data phantom buku atau dataset CT terbuka berlisensi permisif; segmentasi ditampilkan sebagai mask berwarna sesuai palet deck.

**33. Citra Menjadi Volume** — S33
- Visual: tumpukan irisan CT aksial yang berjajar membentuk balok volume (voxel), satu irisan disorot.
- Kelompok: data CT (bidang bertekstur); tanpa mesh anatomi.
- Kamera: PERSP 85 mm, oblik 35°, elevasi 20°.
- Media: still.
- Label: Slice (irisan), Voxel, Volume, Δz.

**34. Segmentasi: Label per Struktur** — S34
- Visual: irisan aksial dengan mask berwarna (tulang ivory, aorta merah, hati, ginjal) di atas grayscale; inset ambang HU.
- Kelompok: data CT + mask.
- Kamera: ORTHO tegak lurus irisan (tampak dari kaudal).
- Media: still.
- Label: Bone, Aorta, Liver, Kidney, Threshold (HU).

**35. Mask Menjadi Mesh** — S35
- Visual: sebelah kiri voxel "berundak" (staircase), tengah wireframe hasil marching cubes, kanan mesh dihaluskan; satu struktur (vertebra lumbal atau femur proksimal).
- Kelompok: satu tulang (mesh BodyParts3D + versi voxelized di Blender untuk ilustrasi).
- Kamera: ORTHO, tiga panel.
- Media: still.
- Label: Voxel mask, Marching cubes, Smoothing, Decimation.

**36. Dari Citra ke Visualisasi** — S36
- Visual: animasi pipeline kontinu: irisan CT -> mask menumpuk -> mesh muncul -> material atlas + lampu studio -> 3D print (material PLA putih) di sebelah model digital.
- Kelompok: data CT, mask, mesh tulang/organ.
- Kamera: PERSP 85 mm, gerakan dolly perlahan.
- Media: MP4 20 dtk; poster = frame akhir (digital + cetak).
- Label (bertahap/overlay): Akuisisi, Segmentasi, Mesh, Rendering, 3D Printing.

## I. Tampilan Lanjutan (slide 37–39)

**37. Exploded View Cranium** — S37
- Visual: tulang tengkorak terurai radial lalu merakit kembali.
- Kelompok: semua tulang cranium dan wajah, mandibula.
- Kamera: PERSP 135 mm, anterolateral 35°.
- Media: MP4 10 dtk loop; poster = puncak urai.
- Label: Frontal bone, Parietal bone, Occipital bone, Temporal bone, Sphenoid bone, Zygomatic bone.

**38. Clipping: Potongan Transversal** — S38
- Visual: bidang potong menyapu kraniokaudal melalui toraks-abdomen; permukaan potong ber-cap warna; inset posisi bidang.
- Kelompok: semua sistem toraks-abdomen.
- Kamera: PERSP 85 mm oblik dengan inset ORTHO kaudal (konvensi radiologi).
- Media: MP4 12 dtk; poster = potongan setinggi vertebra T8 (jantung).
- Label: Heart, Thoracic aorta, Esophagus, Right lung, Left lung, Thoracic vertebra.

**39. Transparansi dan Ghosting** — S39
- Visual: otot superfisial sebagai kaca ghost 15% dengan rangka dan organ opak di dalamnya; transisi opasitas 100% -> 15%.
- Kelompok: otot superfisial (ghost), rangka, organ toraks-abdomen.
- Kamera: PERSP 100 mm, oblik 30°.
- Media: MP4 8 dtk; poster = kondisi ghost.
- Label: tidak ada (fokus teknik); judul cukup.

## J. Penutup (slide 40)

**40. Tubuh Digital, Lapis Kembali** — S40
- Visual: sekuens penutup: rangka -> organ -> pembuluh/saraf -> otot -> siluet; kamera mundur pelan dan berputar 180°, berakhir tampak anterior siluet dengan atribusi.
- Kelompok: semua.
- Kamera: PERSP 100 mm, dolly-out + orbit.
- Media: MP4 18 dtk; poster = tubuh utuh berlapis (seperti slide 1).
- Label: tidak ada; footer atribusi diperbesar (BodyParts3D, DBCLS, lisensi, Blender).

---

## Ringkasan media
| Jenis | Jumlah | Slide |
|---|---|---|
| Still | 29 | 2, 3, 5, 6, 7, 9–13, 15–17, 19–24, 26–35 |
| MP4 | 11 | 1, 4, 8, 14, 18, 25, 36, 37, 38, 39, 40 |

Total: 29 still + 11 MP4 = 40 slide. Total durasi MP4 ≈ 144 dtk.

## Slide yang bergantung pada verifikasi data [V]
5 (kulit/vena superfisial), 21 (organ reproduksi), 22 (hipofisis, paratiroid, testis), 23 (medula spinalis), 24 (saraf perifer), 30–31 (saraf), 18 (arteri koroner), 26/32 (vena saphena, fascia thoracolumbalis). Langkah pertama produksi: skrip inventaris yang mencocokkan semua label di dokumen ini dengan tabel parts BodyParts3D dan menghasilkan daftar hilang.


---

## Realisasi final 3D Teknik Anatomi Digital

Dihasilkan dari berkas final `3D Teknik Anatomi Digital.pptx` (43 slide) pada 14 Oktober 2026.

| No | Judul | Visual utama | Media | Catatan pembicara (ringkas) |
|---|---|---|---|---|
| 1 | 3D Teknik Anatomi Digital | 1 gambar | - | Deck ini dipakai berdampingan dengan "PPT Teknik Anatomi Digital V2". Pindah ke sini setiap kali bentuk, lapisan, atau hubungan ruang lebih mudah ditunjukkan da… |
| 2 | Tiga pandangan baku | 3 gambar | - | Posisi anatomis: tegak, wajah dan telapak tangan menghadap ke depan. Tiga pandangan memakai proyeksi ortografik dan skala yang sama sehingga proporsi dapat diba… |
| 3 | Satu model, 360° | 0 gambar | MP4 | Video berputar otomatis dan berulang. Hentikan pada sudut tertentu untuk menunjuk struktur; klik video untuk jeda. |
| 4 | Permukaan dan isi | 1 gambar | - | Transparansi membantu membaca proyeksi organ ke permukaan tubuh, misalnya posisi hati terhadap arkus kosta kanan. |
| 5 | Diseksi berlapis | 0 gambar | MP4 | Kamera tidak bergerak; hanya lapisan yang berganti. Urutan mengikuti logika diseksi dari superfisial ke profunda. |
| 6 | Enam lapisan, satu kamera | 6 gambar | - | Bandingkan lapisan berdampingan. Lapisan 2 dan 3 dipisahkan berdasarkan daftar otot superfisial yang ditetapkan untuk visualisasi ini; pemisahan superfisial–pro… |
| 7 | Punggung: superfisial ke dalam | 2 gambar | - | Pandangan posterior dengan kamera yang sama. Pada lapisan dalam, otot superfisial seperti m. trapezius dan m. deltoideus disembunyikan. |
| 8 | Rangka utuh | 1 gambar | - | Label hanya diberikan pada struktur yang tersedia sebagai konsep bernama di BodyParts3D. Sisi kanan pasien berada di kiri layar. |
| 9 | Cranium | 2 gambar | - | Tampak anterolateral cranium dengan vertebra servikal atas. Sutura tampak sebagai batas antartulang karena setiap tulang adalah mesh terpisah. |
| 10 | Columna vertebralis | 1 gambar | - | Diskus intervertebralis ditampilkan sebagai mesh terpisah di antara korpus vertebra. |
| 11 | Cavea thoracis | 1 gambar | - | Sternum, kosta, kartilago kostalis, dan vertebra torakal. Perhatikan kartilago kostalis yang menghubungkan kosta ke sternum. |
| 12 | Pelvis | 1 gambar | - | Pelvis pria dewasa. Model ini tidak dapat dipakai untuk membandingkan dimorfisme seksual karena tidak tersedia model wanita. |
| 13 | Rangka ekstremitas | 2 gambar | - | Ekstremitas kanan, tampak anterior dalam posisi anatomis. |
| 14 | Tulang tangan | 1 gambar | - | Ossa carpi, metacarpi, dan phalanges tangan kanan. Ini contoh granularitas tinggi: setiap tulang kecil adalah struktur bernama. |
| 15 | Otot superfisial, anterior | 1 gambar | - | BodyParts3D memodelkan sebagian otot per bagian (misalnya pars clavicularis, acromialis, dan spinalis m. deltoideus). Beberapa otot, seperti m. rectus abdominis… |
| 16 | Otot superfisial, posterior | 1 gambar | - | Pandangan posterior. Bandingkan dengan slide lapisan dalam punggung. |
| 17 | Otot dalam perspektif | 1 gambar | - | Perspektif anterolateral memperlihatkan kedalaman dan kontur otot yang tidak terlihat pada proyeksi ortografik. |
| 18 | Otot ekstremitas | 2 gambar | - | Ekstremitas kanan. Tungkai ditampilkan dari lateral untuk memperlihatkan m. vastus lateralis dan kompartemen anterior tungkai bawah. |
| 19 | Kepala dan leher | 1 gambar | - | Otot kepala dan leher di atas rangka. Otot pengunyah besar seperti m. masseter dan m. temporalis tidak tersedia sebagai struktur bernama dalam dataset ini. |
| 20 | Organ pada posisi anatomis | 1 gambar | - | Organ toraks, abdomen, dan pelvis dengan rangka transparan sebagai konteks. Gunakan untuk proyeksi organ ke dinding tubuh. |
| 21 | Cor dan pembuluh besar | 1 gambar | - | Jantung dengan pangkal pembuluh besar, tampak anterolateral. |
| 22 | Cor, 360° | 0 gambar | MP4 | Rotasi jantung. Hentikan video pada pandangan posterior untuk menunjukkan atrium sinistrum dan vena pulmonalis. |
| 23 | Paru dan percabangan bronkus | 2 gambar | - | Panel kanan menyembunyikan parenkim paru sehingga percabangan bronkus segmental terlihat. |
| 24 | Organ abdomen | 1 gambar | - | Saluran cerna dan organ padat abdomen, tampak anterior. |
| 25 | Sistem urinaria dan reproduksi pria | 2 gambar | - | Dataset hanya mencakup organ reproduksi pria. Organ reproduksi wanita tidak tersedia dalam BodyParts3D. |
| 26 | Kelenjar endokrin yang tersedia | 1 gambar | - | Hipofisis, korpus pineale, timus, dan kelenjar suprarenal ditampilkan di dalam siluet tubuh. Ketiadaan tiroid adalah keterbatasan dataset, bukan pilihan visual. |
| 27 | Otak | 2 gambar | - | BodyParts3D memodelkan girus, nuklei basal, talamus, hipokampus, dan ventrikel. Saraf perifer utama tidak tersedia. |
| 28 | Arteri dan vena sistemik | 2 gambar | - | Warna mengikuti konvensi atlas: arteri merah, vena biru. Jantung ditampilkan pada kedua panel sebagai orientasi. |
| 29 | Arteri otak | 1 gambar | - | Arteri otak dengan otak transparan. Gunakan untuk menunjukkan asal a. cerebri media dari a. carotis interna. |
| 30 | Orbita dan bola mata | 1 gambar | - | Bola mata kanan dengan otot ekstraokular dan saraf orbita. |
| 31 | Pembuluh dalam siluet tubuh | 1 gambar | - | Kulit transparan sebagai konteks untuk jalur pembuluh utama ke ekstremitas. |
| 32 | Kepala dan leher | 1 gambar | - | Rangka, otot, dan pembuluh leher, tampak lateral kanan. |
| 33 | Toraks | 1 gambar | - | Organ dan pembuluh mediastinum dengan dinding toraks transparan. |
| 34 | Abdomen | 1 gambar | - | Organ abdomen dan pembuluh besar retroperitoneal dengan rangka transparan. |
| 35 | Ekstremitas: otot transparan | 2 gambar | - | Otot dibuat transparan sehingga tulang dan pembuluh utama terlihat dalam satu pandangan. |
| 36 | Punggung, lapisan dalam | 1 gambar | - | Otot dalam punggung dan leher setelah otot superfisial disembunyikan. |
| 37 | Dari citra ke model | 4 gambar | - | Rangkaian visual untuk Bagian 2: citra → volume → segmentasi → mesh → visualisasi. Jujur kepada mahasiswa bahwa panel pertama dan panel berikutnya berasal dari … |
| 38 | Decimation: 3.272 → 391 segitiga | 2 gambar | - | Jumlah segitiga diukur langsung dari mesh di Blender. Bentuk umum bertahan, tetapi detail tepi dan foramen mulai kasar; ini kompromi untuk VR dan web. |
| 39 | Cranium, diurai | 0 gambar | MP4 | Exploded view memperlihatkan batas antartulang yang pada model utuh hanya tampak sebagai garis sutura. Jarak pergeseran bersifat ilustratif. |
| 40 | Sapuan koronal | 0 gambar | MP4 | Ini bukan potongan geometris sesungguhnya: setiap struktur dihilangkan utuh ketika bidang melewati titik pusatnya. Teknik ini menjaga pencahayaan rongga tubuh t… |
| 41 | Transparansi untuk hubungan ruang | 2 gambar | - | Transparansi dipakai secara fungsional: satu lapisan menjadi konteks, lapisan lain menjadi fokus. |
| 42 | Dari permukaan ke struktur | 4 gambar | - | Tutup dengan mengajak mahasiswa menjelajahi model yang sama secara interaktif pada website Digital Anatomy Laboratory. |
| 43 | Sumber model dan keterbatasan | 0 gambar | - | Slide atribusi dan keterbatasan, wajib dipertahankan bila deck dibagikan. |

Perbedaan dari rencana: slide 4 (bidang dan sumbu) diganti "Permukaan dan isi" karena orientasi dibahas di deck V2 slide 15; slide saraf perifer [V] dihapus karena BodyParts3D tidak memuat saraf perifer utama; Chapter H memakai phantom sintetis buku + vertebra BodyParts3D (bukan CT nyata); sapuan koronal menyembunyikan struktur utuh (bukan potongan geometris) agar rongga tubuh tetap terang; ditambah slide sumber dan keterbatasan.


## Pembaruan 14 Oktober 2026 (pukul 10.00): bab J dan K, total 56 slide
| Slide | Bab | Judul | Visual |
|---|---|---|---|
| 42 | J Organ detail | Organ dari atlas referensi terkini | render jantung HRA v2.5 |
| 43 | J | Cor: katup dan otot papilaris | jantung, dinding transparan |
| 44 | J | Ren, hepar, lien | 3 render HRA |
| 45 | J | Pulmones dan larynx | 2 render HRA |
| 46 | J | Organa genitalia feminina interna | render HRA (Visible Human Female) |
| 47 | J | Bulbus oculi, articulatio genus, encephalon | 3 render HRA |
| 48 | K Demo 3D Slicer | Dari CT ke model tulang | peta 6 langkah + model tulang hasil Slicer |
| 49 | K | 1–2 Four-Up dan crosshair | tangkapan layar Slicer 5.12.4 |
| 50 | K | 3 Preset jendela | CT-Bone dan CT-Lung + 6 nilai HU terukur |
| 51 | K | 4–5 Threshold menjadi model | irisan dengan segmen hijau → model |
| 52 | K | 6 Segment Statistics | 874,8 cm³ (labelmap), 826,7 cm³ (permukaan) |
| 53 | K | 6 Volume Rendering | CTACardio, CT-Cardiac3, ROI |
| 54 | K | Tayangan cadangan | video 40 s (tangkapan layar asli, embedded) |
| 55–56 | L Penutup | Dari permukaan ke struktur; Sumber model dan keterbatasan | sumber A–I, J, K, H |

Bab penutup berganti huruf dari J menjadi L. Organ HRA ditampilkan terpisah (orang berbeda dengan BodyParts3D) dan tidak diberi label garis karena tidak ada titik jangkar terverifikasi; nama bagian dicantumkan di catatan pembicara dari daftar mesh berkas HRA.
