# QA_PLAN — Teknik Anatomi Digital (3 Produk)

Penanggung jawab: Agent 9 (Kualitas, Aksesibilitas, Keamanan & Deployment)
Tanggal: 2026-10-14
Status gerbang: **produk tidak boleh dirilis/di-deploy sebelum semua item bertanda [WAJIB] lulus.**

Produk yang diuji:

| # | Produk | Lokasi |
|---|--------|--------|
| P1 | Deck akademik premium | `deliverables/PPT Teknik Anatomi Digital V2.pptx` |
| P2 | Deck visual 3D (dengan MP4 tertanam) | `deliverables/3D Teknik Anatomi Digital.pptx` |
| P3 | Website statis (Vite + React + TS + Three.js, aset BodyParts3D) | `website/` → GitHub `NuRichter/digital-anatomy-lab` → Vercel Hobby |

Folder keluaran QA (tidak masuk repo): `qa/` di root workspace
(`qa/p1-png/`, `qa/p2-png/`, `qa/pdf/`, `qa/reports/`).

---

## 0. Konvensi lingkungan

```powershell
# PowerShell 5.1 — tambahkan tool portabel ke PATH sesi ini
$env:Path = "C:\Users\NuRichter\tools\node-v24.20.0-win-x64;C:\Users\NuRichter\tools\gh\bin;" + $env:Path
node -v; npm -v
```

Catatan PowerShell 5.1: tidak ada `&&`; jalankan perintah per baris atau `A; if ($?) { B }`.

---

## 1. Checklist lintas produk

### 1.1 Akurasi ilmiah [WAJIB]
- [ ] Setiap istilah anatomi dicocokkan dengan Terminologia Anatomica (TA2) + padanan Bahasa Indonesia yang konsisten (satu istilah = satu ejaan di ketiga produk; buat `qa/reports/glosarium_cek.csv`: istilah_ID, istilah_Latin/TA2, FMA ID BodyParts3D, lokasi pemakaian).
- [ ] Lateralitas benar (kiri/kanan anatomis, bukan kiri/kanan penonton) pada label 3D, gambar, dan narasi.
- [ ] Orientasi bidang & arah (anterior/posterior, superior/inferior, sagital/koronal/transversal) sesuai gambar.
- [ ] Label pada render 3D menunjuk struktur yang benar (cocokkan nama file/ID FMA BodyParts3D dengan label UI/slide).
- [ ] Klaim kuantitatif (jumlah tulang, persentase, akurasi AI, tahun teknologi) punya sitasi; tidak ada klaim kinerja AI tanpa sumber.
- [ ] Daftar pustaka: format konsisten (mis. APA 7/Vancouver — pilih satu), semua sitasi di slide ada di daftar pustaka dan sebaliknya.
- [ ] Penafian: model BodyParts3D adalah model referensi/pendidikan, bukan alat diagnosis.
- [ ] Review oleh satu orang berlatar anatomi/kedokteran (catat nama + tanggal di laporan).

### 1.2 Lisensi & atribusi [WAJIB]
- [ ] Atribusi BodyParts3D tercantum di: slide kredit P1, slide kredit P2, halaman/panel "Tentang/Kredit" P3, `README.md` dan `ATTRIBUTION.md` repo.
  Teks minimal: *"BodyParts3D, © The Database Center for Life Science (DBCLS), dilisensikan di bawah CC BY-SA 2.1 Japan — https://creativecommons.org/licenses/by-sa/2.1/jp/"* + tautan sumber + pernyataan bila model dimodifikasi (konversi OBJ→GLB, decimation, pewarnaan).
- [ ] ShareAlike: aset turunan (GLB hasil konversi) dirilis dengan CC BY-SA 2.1 JP (atau kompatibel). Simpan `website/public/models/LICENSE` / `LICENSE-ASSETS.md`. Lisensi kode (mis. MIT) dipisah dengan jelas dari lisensi aset.
- [ ] Frame video MP4 di P2 yang berasal dari render BodyParts3D → atribusi di slide yang sama atau slide kredit.
- [ ] Gambar/ikon/font pihak ketiga: catat sumber + lisensi di `qa/reports/aset_lisensi.csv`. Tidak ada gambar tanpa lisensi jelas.
- [ ] Font: hanya font berlisensi yang boleh di-embed/di-host (mis. Google Fonts OFL di-self-host di web).

### 1.3 Keamanan & kebersihan data [WAJIB]
- [ ] Tidak ada data pribadi/pasien di slide, catatan pembicara, metadata file (Author/Company di `docProps/core.xml` & `app.xml` diperiksa).
- [ ] Catatan pembicara (speaker notes) ditinjau—tidak ada catatan internal/draf yang tidak pantas.

---

## 2. P1 & P2 — Deck PowerPoint

### 2.1 Integritas file PPTX [WAJIB]

**a) Uji ZIP & XML** (Python, jalankan dengan `-I`; skrip disimpan di luar folder deliverables):

```python
# qa_pptx_integrity.py  —  python -I qa_pptx_integrity.py "<path.pptx>"
import sys, zipfile, re
from lxml import etree
p = sys.argv[1]
z = zipfile.ZipFile(p)
bad = z.testzip()
print("ZIP CRC:", "OK" if bad is None else f"RUSAK: {bad}")
errs, ext_media, media_rels = [], [], []
for n in z.namelist():
    if n.endswith((".xml", ".rels")):
        try: etree.fromstring(z.read(n))
        except Exception as e: errs.append((n, str(e)))
    if n.endswith(".rels"):
        x = etree.fromstring(z.read(n))
        for r in x:
            t, mode, tgt = r.get("Type",""), r.get("TargetMode",""), r.get("Target","")
            if re.search(r"/(video|audio|media|image|oleObject)$", t):
                media_rels.append((n, t.rsplit('/',1)[-1], tgt, mode))
                if mode == "External": ext_media.append((n, tgt))
print("XML parse error:", errs or "tidak ada")
print("Media/gambar EXTERNAL (harus kosong):", ext_media or "tidak ada")
print("File di ppt/media:", [n for n in z.namelist() if n.startswith("ppt/media/")])
print("Ukuran total (MB):", round(sum(i.file_size for i in z.infolist())/1e6, 1))
```

Kriteria lulus:
- [ ] `testzip()` = None (tidak ada CRC error).
- [ ] Semua part XML/rels ter-parse.
- [ ] **Tidak ada** relasi `video`/`audio`/`media`/`image`/`oleObject` dengan `TargetMode="External"` (hyperlink eksternal ke referensi boleh).
- [ ] P2: file `.mp4` ada di `ppt/media/` dan direferensikan oleh relasi `.../video` **dan** `http://schemas.microsoft.com/office/2007/relationships/media` dari slide yang sama.
- [ ] `[Content_Types].xml` memuat `Extension="mp4"` → `video/mp4`.
- [ ] Ukuran file wajar (target P1 < 50 MB, P2 < 200 MB; MP4 H.264/AAC, ≤ 1080p).

**b) Buka/simpan via COM PowerPoint** (bukti file terbuka tanpa mode perbaikan):

```powershell
# qa_ppt_com.ps1 -Pptx "<path>" -OutDir "<qa\p1-png>"
param([string]$Pptx, [string]$OutDir)
$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Force $OutDir | Out-Null
$app = New-Object -ComObject PowerPoint.Application
try {
  # Open(FileName, ReadOnly, Untitled, WithWindow)
  $pres = $app.Presentations.Open((Resolve-Path $Pptx).Path, -1, 0, 0)
  "Slide: $($pres.Slides.Count)  Ukuran: $($pres.PageSetup.SlideWidth)x$($pres.PageSetup.SlideHeight) pt"
  # 1) Ekspor semua slide ke PNG 1920x1080
  $pres.Export($OutDir, "PNG", 1920, 1080)
  # 2) Ekspor PDF (ppSaveAsPDF = 32)
  $pdf = Join-Path $OutDir ("{0}.pdf" -f [IO.Path]::GetFileNameWithoutExtension($Pptx))
  $pres.SaveCopyAs($pdf, 32)
  # 3) Inventaris media (msoMedia = 16; ppMediaTypeMovie = 3)
  foreach ($s in $pres.Slides) { foreach ($sh in $s.Shapes) {
    if ($sh.Type -eq 16) {
      $mf = $sh.MediaFormat
      "Slide {0}: '{1}' MediaType={2} Embedded={3} Linked={4} Durasi={5}ms" -f `
        $s.SlideIndex, $sh.Name, $sh.MediaType, $mf.IsEmbedded, $mf.IsLinked, $mf.Length
    }
    # Alt text kosong pada gambar/media
    if (($sh.Type -in 13,16) -and [string]::IsNullOrWhiteSpace($sh.AlternativeText)) {
      "PERINGATAN alt text kosong: slide $($s.SlideIndex) '$($sh.Name)'"
    }
  } }
  # 4) Simpan salinan (uji round-trip)
  $pres.SaveCopyAs((Join-Path $OutDir "roundtrip.pptx"))
  $pres.Close()
} finally { $app.Quit(); [Runtime.InteropServices.Marshal]::ReleaseComObject($app) | Out-Null }
```

Kriteria lulus:
- [ ] Terbuka tanpa dialog "PowerPoint found a problem with content / Repair" (jika COM melempar exception saat Open → GAGAL).
- [ ] Jumlah PNG = jumlah slide.
- [ ] PDF terbentuk.
- [ ] P2: setiap shape media `IsEmbedded=True`, `IsLinked=False`, `Length > 0`.
- [ ] Round-trip `SaveCopyAs` sukses.
- [ ] Uji manual satu kali di Slide Show: video P2 diputar (autoplay/klik sesuai desain), ada poster frame, tidak hitam; uji juga setelah file disalin ke folder/PC lain (membuktikan tidak tertaut).

### 2.2 Inspeksi visual SEMUA slide [WAJIB]
Dari PNG di `qa/p1-png/` dan `qa/p2-png/`, setiap slide dicek dan dicatat di `qa/reports/visual_p1.md` / `visual_p2.md` (tabel: no slide, lulus/gagal, temuan):
- [ ] Tidak ada teks terpotong/overflow keluar kotak atau keluar kanvas.
- [ ] Tidak ada objek saling tumpang-tindih tak disengaja; margin aman ≥ 0,4 in dari tepi.
- [ ] Tidak ada placeholder kosong ("Click to add title"), sisa teks template, atau lorem ipsum.
- [ ] Gambar tidak pecah/terdistorsi (rasio aspek terjaga), resolusi cukup pada 1920×1080.
- [ ] Font tersubstitusi tidak terjadi (bandingkan render dengan font yang dimaksud; jika memakai font non-standar → embed font atau ganti).
- [ ] Konsistensi: judul di posisi sama, nomor slide, palet warna, gaya label 3D.
- [ ] Kontras teks–latar ≥ 4.5:1 (teks normal) / ≥ 3:1 (teks ≥ 24 pt atau ≥ 18,66 pt tebal), termasuk teks di atas render 3D/gambar.
- [ ] P2: poster frame video bukan frame hitam.

### 2.3 Keterbacaan (ukuran font minimum) [WAJIB]
Ambang: judul ≥ 28 pt; isi ≥ 18 pt; label diagram/anotasi ≥ 14 pt; sitasi/footer ≥ 10 pt (pengecualian dicatat).

```python
# qa_fonts.py — python -I qa_fonts.py "<path.pptx>"
import sys
from pptx import Presentation
from pptx.util import Pt
prs = Presentation(sys.argv[1])
def walk(shapes):
    for sh in shapes:
        if sh.shape_type == 6: yield from walk(sh.shapes)   # group
        else: yield sh
for i, s in enumerate(prs.slides, 1):
    for sh in walk(s.shapes):
        if not sh.has_text_frame: continue
        for p in sh.text_frame.paragraphs:
            for r in p.runs:
                sz = r.font.size.pt if r.font.size else None
                if r.text.strip() and sz is not None and sz < 14:
                    print(f"slide {i} | {sh.name} | {sz} pt | {r.text[:50]!r}")
                if r.text.strip() and sz is None:
                    pass  # ukuran diwarisi layout/master — verifikasi via PNG
```
- [ ] Laporan font < 14 pt hanya berisi sitasi/footer yang disetujui.
- [ ] Teks maksimal ±6 baris/40 kata per slide isi (P1); P2 dominan visual.
- [ ] Bahasa Indonesia baku (EYD V), istilah asing dimiringkan konsisten.

### 2.4 Aksesibilitas deck
- [ ] Setiap gambar/video punya alt text (laporan COM di atas kosong untuk peringatan) atau ditandai dekoratif.
- [ ] Setiap slide punya judul unik (boleh disembunyikan di luar kanvas) — memudahkan navigasi pembaca layar.
- [ ] Urutan baca (Selection Pane) logis untuk slide kompleks.
- [ ] Jalankan PowerPoint *Review → Check Accessibility*; nol "Errors".
- [ ] Video tanpa audio narasi, atau jika ada narasi → sediakan teks/caption.

---

## 3. P3 — Website (Vite + React + TS + Three.js)

### 3.1 Build & kebersihan kode [WAJIB]
```powershell
cd "C:\Users\NuRichter\Documents\Proyek 3D\website"
npm ci
npx tsc --noEmit
npm run lint            # jika ada skrip lint
npm run build           # harus 0 error, 0 warning TS
npm audit --omit=dev    # tidak ada high/critical
```
- [ ] `dist/` terbentuk; laporan ukuran bundle Vite dicatat (JS utama target ≤ 300 KB gzip; Three.js di-chunk terpisah/lazy).
- [ ] Tidak ada import path absolut Windows (`C:\...`) atau huruf besar/kecil berbeda (Vercel = Linux, case-sensitive). Cek: `git ls-files | Select-String "[A-Z]"` dibandingkan dengan import.
- [ ] `npm run preview` menyajikan situs di `http://localhost:4173` tanpa error.

### 3.2 Konsol bersih [WAJIB]
- [ ] Nol `console.error`, nol `pageerror` (exception tak tertangkap), nol request 4xx/5xx pada pemuatan normal (dicek otomatis di Playwright — lihat 3.3).
- [ ] Warning Three.js (mis. tekstur non-power-of-two, `THREE.WebGLRenderer: Context Lost`) ditinjau.

### 3.3 Skenario Playwright (`@playwright/test`) [WAJIB]

Persiapan:
```powershell
npm i -D @playwright/test @axe-core/playwright
npx playwright install chromium
npx playwright test                     # semua
npx playwright test --project=mobile    # hanya mobile
npx playwright show-report
```

`playwright.config.ts` (inti):
```ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: process.env.BASE_URL ?? 'http://localhost:4173', trace: 'retain-on-failure' },
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npm run build && npm run preview -- --port 4173', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 180_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile',  use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 } },
    { name: 'no-webgl', use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--disable-webgl', '--disable-3d-apis'] } } },
  ],
});
```

Kontrak dengan tim web (Agent pembuat website): sediakan `data-testid` stabil — `viewer-canvas`, `structure-list`, `structure-item-<id>`, `search-input`, `btn-isolate`, `btn-hide`, `btn-show-all`, `btn-reset-view`, `info-panel`, `webgl-fallback`, `model-error`, dan sinyal `window.__APP_READY__ = true` + `performance.mark('first-model-visible')` saat model pertama tampil.

Fixture penjaga konsol (dipakai semua tes):
```ts
test.beforeEach(async ({ page }, ti) => {
  const errs: string[] = [];
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', e => errs.push(e.message));
  page.on('response', r => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
  (ti as any)._errs = errs;
});
test.afterEach(async ({}, ti) => {
  if (!ti.title.includes('[expect-errors]')) expect((ti as any)._errs).toEqual([]);
});
```

| ID | Skenario | Langkah | Kriteria lulus |
|----|----------|---------|----------------|
| E1 | Load | Buka `/` | Judul halaman berbahasa Indonesia, `<html lang="id">`; canvas tampil; `first-model-visible` tercapai ≤ 8 s (lokal) ; tidak ada error konsol |
| E2 | Select | Klik item di daftar struktur **dan** klik mesh di canvas (koordinat tengah) | Panel info menampilkan nama ID + Latin; item terpilih punya `aria-selected="true"`/`aria-pressed`; highlight terlihat (screenshot banding) |
| E3 | Isolate | Pilih struktur → `btn-isolate` | Hanya struktur terpilih terlihat (cek via `window.__viewer.visibleCount()` atau atribut daftar); tombol kembali tersedia |
| E4 | Hide | Pilih → `btn-hide` → `btn-show-all` | Struktur hilang lalu muncul kembali; status tercermin di daftar |
| E5 | Search | Ketik "femur" dan istilah ID ("tulang paha"), lalu string tak ada | Daftar terfilter benar; hasil kosong menampilkan pesan "Tidak ditemukan" yang diumumkan `aria-live` |
| E6 | Reset | Putar/zoom (drag + wheel) → `btn-reset-view` | Kamera kembali ke pose awal (screenshot banding toleransi kecil) dan semua struktur tampil |
| E7 | Mobile 390×844 | Proyek `mobile` | Tidak ada scroll horizontal (`scrollWidth <= 390`); panel tidak menutupi canvas sepenuhnya; target sentuh ≥ 24×24 CSS px; tap memilih struktur |
| E8 | WebGL-off fallback | Proyek `no-webgl` `[expect-errors]` | `webgl-fallback` tampil dengan pesan jelas + tautan/teks alternatif (daftar struktur & info tetap bisa dipakai); tidak ada layar putih |
| E9 | Model gagal dimuat | `page.route('**/*.glb', r => r.abort())` `[expect-errors]` | `model-error` tampil dengan tombol "Coba lagi"; UI lain tetap responsif; tidak ada spinner tanpa akhir (timeout ≤ 15 s) |
| E10 | Model lambat | `page.route('**/*.glb', async r => { await new Promise(f=>setTimeout(f,4000)); r.continue(); })` | Indikator memuat + progres tampil dan diumumkan; selesai normal |
| E11 | Keyboard saja | Tab melintasi seluruh kontrol, Enter/Space memilih, Esc membatalkan seleksi | Semua fungsi E2–E6 dapat dicapai tanpa mouse; fokus selalu terlihat; tidak terjebak di canvas |
| E12 | Axe | `new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()` di desktop & mobile | 0 pelanggaran `serious`/`critical` |
| E13 | Atribusi | Buka panel Kredit/Tentang | Teks atribusi BodyParts3D + tautan lisensi CC BY-SA 2.1 JP ada |
| E14 | Deep link / refresh | Muat ulang di rute non-root (jika ada router) | Tidak 404 (rewrite SPA bekerja) — dijalankan juga terhadap URL Vercel |

Contoh E8/E9:
```ts
test('E9 model gagal [expect-errors]', async ({ page }) => {
  await page.route('**/*.glb', r => r.abort());
  await page.goto('/');
  await expect(page.getByTestId('model-error')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: /coba lagi/i })).toBeEnabled();
});
```

### 3.4 Performa [WAJIB ukur, target = sasaran]
Diukur pada `npm run preview` dan pada URL produksi Vercel; dicatat di `qa/reports/perf.md`.

```ts
test('P-metrics', async ({ page }) => {
  let bytes = 0;
  page.on('requestfinished', async req => { const s = await req.sizes(); bytes += s.responseBodySize + s.responseHeadersSize; });
  await page.goto('/');
  await page.waitForFunction(() => performance.getEntriesByName('first-model-visible').length > 0, null, { timeout: 30_000 });
  const ttfm = await page.evaluate(() => performance.getEntriesByName('first-model-visible')[0].startTime);
  const fps = await page.evaluate(() => new Promise<number>(res => {
    let n = 0; const t0 = performance.now();
    const f = () => { n++; performance.now() - t0 < 5000 ? requestAnimationFrame(f) : res(n / 5); };
    requestAnimationFrame(f);
  }));
  console.log({ transferMB: (bytes / 1e6).toFixed(2), ttfmMs: Math.round(ttfm), fps });
});
```

| Metrik | Sasaran |
|--------|---------|
| Total transfer hingga model pertama tampil | ≤ 5 MB (GLB terkompresi Draco/Meshopt; tekstur KTX2/WebP) |
| Total transfer seluruh aset model | ≤ 25 MB, dimuat bertahap/lazy per sistem organ |
| Time to first model (desktop, cache dingin) | ≤ 3 s lokal; ≤ 5 s produksi (koneksi kabel) ; ≤ 8 s throttling "Fast 4G" |
| FPS saat rotasi (desktop GPU terintegrasi) | ≥ 50 fps; mobile ≥ 30 fps |
| LCP (Lighthouse mobile) | ≤ 2,5 s untuk shell UI |
| CLS | ≤ 0,1 |
| File GLB tunggal | ≤ 10 MB (GitHub memperingatkan > 50 MB, menolak > 100 MB) |
| Cache | Aset di `/assets/*` dan `/models/*` dengan nama ber-hash → `Cache-Control: public, max-age=31536000, immutable` |

Opsional: `npx lighthouse <url> --preset=desktop --output html --output-path qa/reports/lh.html`.
Throttling di Playwright: CDP `Network.emulateNetworkConditions` (hanya Chromium).

### 3.5 Aksesibilitas — WCAG 2.2 AA esensial untuk penampil 3D [WAJIB]
| Kriteria | Penerapan pada aplikasi |
|----------|-------------------------|
| 1.1.1 Konten non-teks | `<canvas>` diberi `role="img"` + `aria-label` dinamis ("Model 3D: tulang femur kanan dipilih"); daftar struktur + panel info menjadi alternatif teks setara |
| 1.3.1 Info & relasi | Daftar struktur memakai `<ul>`/tree ARIA yang benar; heading berurutan |
| 1.4.3 / 1.4.11 Kontras | Teks ≥ 4.5:1; ikon, batas tombol, warna highlight seleksi ≥ 3:1 terhadap latar; seleksi tidak hanya ditandai warna (1.4.1) — tambah outline/teks |
| 1.4.4 / 1.4.10 Resize & Reflow | Zoom 200% dan lebar 320 CSS px tanpa scroll 2 arah |
| 1.4.13 Konten on hover | Tooltip label dapat ditutup (Esc), dapat di-hover, persisten |
| 2.1.1 / 2.1.2 Keyboard, tanpa jebakan | Semua fungsi via keyboard; tombol rotasi/zoom (panah, +/−); canvas tidak menelan Tab |
| 2.2.2 Jeda/henti | Auto-rotate > 5 s harus bisa dihentikan; hormati `prefers-reduced-motion` (matikan auto-rotate & animasi kamera) |
| 2.4.3 / 2.4.7 Urutan & fokus terlihat | Urutan fokus logis; outline fokus jelas |
| **2.4.11 Fokus tidak tertutup (baru 2.2)** | Elemen terfokus tidak tertutup panel/bottom-sheet mobile |
| **2.5.7 Gerakan menyeret (baru 2.2)** | Orbit/pan berbasis drag WAJIB punya alternatif pointer tunggal: tombol putar kiri/kanan/atas/bawah, zoom +/−, reset |
| **2.5.8 Ukuran target minimum (baru 2.2)** | Target ≥ 24×24 CSS px (sasaran 44×44 di mobile) |
| 3.1.1 Bahasa | `<html lang="id">`; istilah Latin dengan `lang="la"` bila memungkinkan |
| 3.3.2 Label | Input pencarian punya `<label>` terlihat/terbaca |
| 4.1.2 Nama, peran, nilai | Tombol toggle (`aria-pressed`), item terpilih (`aria-selected`) |
| 4.1.3 Pesan status | `aria-live="polite"` untuk "Memuat model…", "3 hasil", "Gagal memuat model" |

Uji manual tambahan: NVDA + Chrome satu alur (cari → pilih → isolasi → reset); zoom browser 200%.

### 3.6 Keamanan & isi repo [WAJIB]
- [ ] Repo git diinisialisasi **di `website/`**, bukan di root workspace (root berisi `Buku Gede.docx` dan PPTX sumber).
- [ ] `.gitignore` minimal:
  ```
  node_modules/
  dist/
  .vercel/
  .env
  .env.*
  !.env.example
  playwright-report/
  test-results/
  blob-report/
  *.log
  *.pptx
  *.docx
  *.pdf
  ~$*
  .DS_Store
  Thumbs.db
  ```
- [ ] Verifikasi sebelum commit pertama: `git status --porcelain` dan `git ls-files | Select-String -Pattern '\.(pptx|docx|pdf|env)$'` → harus kosong.
- [ ] Pindai rahasia: `git ls-files | ForEach-Object { Select-String -Path $_ -Pattern '(api[_-]?key|secret|token|password|BEGIN (RSA|OPENSSH) PRIVATE|ghp_[A-Za-z0-9]{20,}|vercel_[A-Za-z0-9]{20,})' -List }` → kosong (atau `npx gitleaks`/`trufflehog` bila tersedia). Situs statis tidak butuh variabel `VITE_*` rahasia — apa pun yang berawalan `VITE_` ikut ter-bundle publik.
- [ ] Tidak ada file > 50 MB di repo: `git ls-files | % { Get-Item $_ } | ? Length -gt 50MB`.
- [ ] `vercel.json` header keamanan:
  ```json
  {
    "headers": [
      { "source": "/(.*)", "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' blob: data:; worker-src 'self' blob:; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" }
      ]},
      { "source": "/models/(.*)", "headers": [ { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] }
    ]
  }
  ```
  (`'wasm-unsafe-eval'` + `blob:` diperlukan bila memakai decoder Draco/Meshopt/KTX2 berbasis WASM/worker; uji CSP di produksi tidak memunculkan pelanggaran di konsol.) Tambahkan `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]` hanya jika ada client-side router.
- [ ] Tidak ada skrip/CDN pihak ketiga tak perlu; tidak ada analitik pelacak tanpa pemberitahuan.
- [ ] Tautan eksternal `target="_blank"` memakai `rel="noopener noreferrer"`.
- [ ] Hobby = non-komersial: tidak ada iklan, tidak ada pembayaran, tidak ada promosi jasa berbayar.

---

## 4. Gerbang rilis & pelaporan
1. Jalankan semua bagian; hasil di `qa/reports/QA_RESULT_<tanggal>.md` (lulus/gagal per item + tautan bukti PNG/laporan Playwright).
2. Temuan diklasifikasi: **Blocker** (gagal [WAJIB]) / **Major** / **Minor**. Rilis hanya jika Blocker = 0.
3. Setelah deploy produksi: ulangi E1, E8, E9, E12, E14 dan metrik 3.4 dengan `BASE_URL=https://<produksi>.vercel.app`.

## 5. Sumber rujukan (diakses 2026-10-14)
- Vercel Hobby plan: https://vercel.com/docs/plans/hobby
- Vercel Limits: https://vercel.com/docs/limits ; Fair use: https://vercel.com/docs/limits/fair-use-guidelines
- Playwright CLI: https://playwright.dev/docs/test-cli
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- BodyParts3D: https://lifesciencedb.jp/bp3d/ ; Lisensi: https://creativecommons.org/licenses/by-sa/2.1/jp/
- PowerPoint VBA object model (Presentation.Export, SaveCopyAs, MediaFormat.IsEmbedded/IsLinked): https://learn.microsoft.com/office/vba/api/overview/powerpoint
