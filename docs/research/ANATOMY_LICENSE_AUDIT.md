# Audit Lisensi Aset Anatomi 3D

Tanggal audit: 2026-10-14. Dokumen ini bukan nasihat hukum. Isinya merangkum teks lisensi resmi yang dibaca langsung dari sumbernya.

## 1. BodyParts3D (DBCLS): SUMBER PRIMER

**Referensi teks lisensi resmi**
- https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html, bagian "3. License" ("Last updated: 2025/02/25"; riwayat: "2025/02/27 'License' is updated").
- https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html (teksnya sama).
- Teks hukum: https://creativecommons.org/licenses/by/4.0/legalcode

**Kutipan inti:**
> "The license for this database is specified in the Creative Commons Attribution 4.0 International. If you use data from this database, please be sure attribute this database as follows: "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International"."
> "...freely redistribute part or whole of the data from this database; and freely create and distribute database and other derivative works..."

**Catatan sejarah:** README arsip `20110915` menyatakan "Creative Commons Attribution-Share Alike 2.1 Japan". Lisensi itu sudah diganti oleh licensor. Turunan lama (Z-Anatomy, model Sketchfab) masih mengutip BY-SA 2.1 JP. Hal ini tidak memengaruhi kita **selama kita mengunduh langsung dari DBCLS** (LATEST) dan bukan dari turunan.

**String atribusi yang dipakai** (wajib persis):
```
BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International
https://dbarchive.biosciencedbc.jp/en/bodyparts3d/ — Modified: converted from OBJ to glTF, decimated, renamed and grouped by system.
```
Sitasi ilmiah (opsional, dianjurkan): Mitsuhashi N, Fujieda K, Tamura T, Kawamoto S, Takagi T, Okubo K. BodyParts3D: 3D structure database for anatomical concepts. Nucleic Acids Res. 2009;37:D782-5. PMID 18835852.

**Implikasi:**
- Repo GitHub publik dan Vercel: boleh meredistribusikan GLB turunan. Wajib mencantumkan atribusi, tautan lisensi, dan pernyataan modifikasi (CC BY 4.0 bagian 3(a)). **Tidak ada share-alike**, jadi kode situs boleh memakai lisensi apa pun (misalnya MIT). Aset sebaiknya tetap dilabeli CC BY 4.0 di `assets/LICENSE-ASSETS.md`.
- PPT: render Blender dari BP3D boleh dipakai. Cantumkan atribusi di slide kredit (atau footer slide), misalnya "Model 3D: BodyParts3D © DBCLS, CC BY 4.0".
- Dilarang mengklaim endorsement DBCLS. Model ini juga tidak boleh disebut "akurat secara klinis" (release note sendiri menyebut kemungkinan error).

## 2. HRA 3D Reference Organs (HuBMAP): SUMBER SEKUNDER

**Referensi:** metadata JSON-LD setiap organ di `https://lod.humanatlas.io/ref-organ/<organ>/latest/` memuat field `"license": "https://creativecommons.org/licenses/by/4.0/"`. Untuk otak: "In version v1.3, an update in licensing occurred; this brain model is now licensed under CC BY 4.0".

**String atribusi** (pakai sitasi resmi dari metadata, sesuaikan dengan organ yang dipakai):
```
Browne, Kristen. 2024. 3D Reference Organ for Skin, Male v1.4. Human Reference Atlas (HuBMAP). https://doi.org/10.48539/HBM953.DCMN.563 — CC BY 4.0. Modified (registered, decimated).
Based on the Visible Human Project — Courtesy of the U.S. National Library of Medicine.
```
Untuk set lengkap: "Browne, Kristen, and Heidi Schlehlein. 2026. 3D Reference Organ Set for Male, v1.10. https://doi.org/10.48539/HBM833.WZWN.425 — CC BY 4.0". Versi female: https://doi.org/10.48539/HBM637.DWBM.744. Untuk otak, tambahkan "Allen Human Brain Reference Atlas (Ding et al. 2016)".

**Implikasi:** sama dengan BP3D (CC BY tanpa SA). Kedua sumber kompatibel untuk digabung.

## 3. Z-Anatomy: TIDAK dipakai sebagai aset redistribusi

**Referensi:** https://raw.githubusercontent.com/Z-Anatomy/Models-of-human-anatomy/master/License.txt
> "All the code and content shared by 'Z-Anatomy' is under Creative Commons Attribution-ShareAlike 4.0 International License... You must distribute any derivative work ... under the same license."

Sub-aset yang disebut dalam file yang sama:
- "Anatomy of the Inner Ear - by University of Dundee School of Medicine - **CC-BY-NC-SA 4.0**"
- "Kidney - by Lissie Cowley - **CC-BY-NC 4.0**"
- "Cranial Nerves and Foramina - by University of Dundee, CAHID - CC-BY 4.0"
- Definisi: "Wikipedia - CC-BY-SA 3.0"

**Implikasi share-alike:**
- Mesh apa pun yang diambil atau dimodifikasi dari `Startup.blend` lalu dipublikasikan di repo atau situs wajib dirilis dengan **CC BY-SA 4.0**. Ini termasuk semua GLB turunan, dan kombinasinya dalam satu "adapted material" bisa ikut terkena. Kode situs (JS) yang terpisah tidak otomatis menjadi SA, tetapi bundel aset akan menjadi SA.
- Untuk PPT: render gambar dari model BY-SA adalah adaptasi, sehingga gambar/slide tersebut harus dilisensikan BY-SA bila dipublikasikan.
- Komponen NC (telinga dalam Dundee dan ginjal Lissie Cowley) **tidak boleh** dipakai dalam konteks yang bisa dianggap komersial. Lisensi NC-SA dan BY-SA 4.0 tidak kompatibel satu arah, jadi hindari sama sekali.
- **Keputusan:** jangan ambil mesh dari Z-Anatomy. Gunakan BP3D asli dari DBCLS, yang mesh dasarnya identik. Z-Anatomy hanya dipakai sebagai referensi visual atau penamaan. Fakta (nama TA) tidak dilindungi hak cipta, tetapi jangan menyalin file `TA2.csv` atau definisi Wikipedia secara utuh tanpa atribusi BY-SA.

## 4. OpenAnatomy / SPL atlases (opsional)

**Referensi:** https://www.slicer.org/LICENSE Part B (dirujuk dari setiap halaman atlas di openanatomy.org, misalnya https://openanatomy.org/atlas-pages/atlas-spl-nac-brain.html).

**Kewajiban:**
- Sertakan teks lengkap lisensi Slicer beserta notice bahwa materi "obtained under license from The Brigham and Women's Hospital" (B.1(b)).
- Pertahankan copyright notice (B.1(c)). Tandai modifikasi dan jangan menyebutnya sebagai materi asli (B.1(d)).
- Sertakan disclaimer "not for clinical use" (B.4).
- Jangan memakai nama atau logo Brigham untuk endorsement (B.6).

**Atribusi yang disarankan:** "SPL/NAC Brain Atlas (Halle M, Talos F, Jakab M, Makris N, Meier D, Wald L, Fischl B, Kikinis R), Surgical Planning Laboratory, Brigham and Women's Hospital — 3D Slicer License Part B. Modified."

## 5. TotalSegmentator (opsional, pengisi gap)

- Dataset (Zenodo 10.5281/zenodo.6802613): **CC BY 4.0**. Mesh yang diturunkan dari label boleh diredistribusikan dengan atribusi: "Derived from TotalSegmentator dataset (Wasserthal J. et al., Radiology: Artificial Intelligence 2023), CC BY 4.0".
- Model task `total`: Apache-2.0. Task berlisensi khusus (`appendicular_bones`, `tissue_types`, `brain_structures`, `heartchambers_highres`, dan lainnya) serta `brain_aneurysm` (CC BY-NC) **jangan dipakai**.

## 6. NLM Visible Human Project

- https://www.nlm.nih.gov/databases/download/terms_and_conditions.html. Tidak ada lisensi sejak Juli 2019.
- Wajib mencantumkan "Courtesy of the U.S. National Library of Medicine" secara jelas. Jangan mengimplikasikan endorsement NLM.

## 7. NIH 3D dan Sketchfab

- Lisensi per entri. Hanya entri dengan **CC0, Public Domain, atau CC BY** yang boleh dipakai, dan hanya setelah halaman entri diperiksa dan disimpan bukti (URL + tanggal) di `ATTRIBUTION.md`.
- Jangan memakai entri NC, ND, atau bertag NoAI.

## 8. Yang TIDAK BOLEH diredistribusikan (daftar larangan)

1. File `Startup.blend` atau mesh apa pun dari Z-Anatomy di repo publik (kecuali seluruh paket aset dirilis CC BY-SA 4.0, dan ini tidak direkomendasikan).
2. Model telinga dalam Univ. Dundee (CC BY-NC-SA) dan ginjal Lissie Cowley (CC BY-NC), baik melalui Z-Anatomy maupun Sketchfab.
3. Model Sketchfab dan NIH 3D dengan lisensi NC, ND, atau tag NoAI.
4. Bobot model TotalSegmentator untuk task berlisensi dan task `brain_aneurysm`.
5. Data Visible Korean Human (lisensi tidak terbuka).
6. ZIP asli besar (136 MB, 241 MB, 374 MB) di dalam repo Git. Selain tidak perlu, batas file GitHub adalah 100 MB. Simpan hanya GLB hasil optimasi dan dokumentasikan URL sumber.
7. Logo atau nama DBCLS, NIH, NLM, HuBMAP, dan Brigham yang dipakai seolah-olah memberi endorsement.

## 9. Template berkas atribusi untuk repo (`ATTRIBUTION.md` dan halaman `/credits`)

```
3D anatomy models in this website are derived from:

1. BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.
   Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html (Release 4.0)
   License: https://creativecommons.org/licenses/by/4.0/
   Changes: OBJ converted to glTF/GLB, meshes decimated and compressed, files renamed by structure, grouped by system/region.

2. Human Reference Atlas 3D Reference Organs (HuBMAP), CC BY 4.0 — e.g. Browne K. 3D Reference Organ for Skin, Male v1.4,
   https://doi.org/10.48539/HBM953.DCMN.563. Based on the Visible Human Project, courtesy of the U.S. National Library of Medicine.
   Changes: registered to BodyParts3D coordinate frame, decimated.

These models are for education only, not for clinical use. No endorsement by the licensors is implied.
```
Untuk PPT: slide kredit terakhir memuat butir 1 dan 2 (ringkas), ditambah "Rendered in Blender".


## 10. Pembaruan 14 Oktober 2026: aset yang benar-benar dipakai
- **HRA v2.5 3D Reference Organs** (rilis 2026-08-10), CC BY 4.0: 10 organ (jantung, ginjal kiri, paru, organ reproduksi wanita, mata kanan, lutut kiri, laring, otak, hati, limpa) dipakai di website (`public/hra/`) dan deck 3D (bab J). Atribusi dan sitasi (Börner dkk. 2025, Nature Methods 22(4):845–860, DOI 10.1038/s41592-024-02563-5, dicek ke Crossref oleh agen) ada di `website/ATTRIBUTION.md` dan `hra.json`. Model kelenjar payudara HRA tidak dipakai (dipahat manual, bukan data Visible Human). Detail: `ANATOMY_SOURCE_UPDATE_2026.md`.
- **3D Slicer Sample Data CTChest dan CTACardio**: lisensi spesifik per dataset tidak tercantum di modul Sample Data; pengembang inti Slicer (A. Lasso) menyatakan sample data "free to use without restrictions" (discourse.slicer.org/t/license-question-about-the-use-of-the-sample-data/30258). Asal klinis tidak didokumentasikan; ini dinyatakan di website dan deck. Dataset Panoramix (larangan redistribusi) tidak dipakai.
