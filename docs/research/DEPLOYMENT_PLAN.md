# DEPLOYMENT_PLAN — Website "Digital Anatomy Lab"

Target: repo publik baru **github.com/NuRichter/digital-anatomy-lab** → Vercel (paket Hobby) dengan auto-deploy dari Git.
Sumber kode: `C:\Users\NuRichter\Documents\Proyek 3D\website` (Vite + React + TS + Three.js).
Tanggal: 2026-10-14. Rujukan dokumen: lihat bagian 10.

> Prinsip: **tidak ada token di chat atau di file.** Login GitHub & Vercel dilakukan sendiri oleh pengguna lewat alur perangkat/browser. Repo diinisialisasi **di dalam `website/`**, bukan di root workspace (root berisi `.docx`/`.pptx` sumber yang tidak boleh ter-push).

---

## 0. Prasyarat sesi (PowerShell 5.1)

```powershell
$env:Path = "C:\Users\NuRichter\tools\node-v24.20.0-win-x64;C:\Users\NuRichter\tools\gh\bin;" + $env:Path
Set-Location "C:\Users\NuRichter\Documents\Proyek 3D\website"
node -v
npm -v
git --version
gh --version
npx --yes vercel@latest --version
```
PowerShell 5.1 tidak mendukung `&&` — jalankan baris per baris.

## 1. Cek autentikasi (berhenti jika belum login)

```powershell
gh auth status
npx vercel@latest whoami
```

**Jika `gh auth status` gagal** — minta pengguna menjalankan sendiri di prompt Claude Code (awalan `!` menjalankan perintah di sesi ini, kode perangkat tampil di layar, tidak ada token yang ditempel di chat):
```
! C:\Users\NuRichter\tools\gh\bin\gh.exe auth login --hostname github.com --git-protocol https --web
```
Ikuti kode satu kali di https://github.com/login/device. Lalu:
```
! C:\Users\NuRichter\tools\gh\bin\gh.exe auth setup-git
```
Verifikasi: `gh auth status` → "Logged in to github.com account NuRichter", scope minimal `repo`.

**Jika `vercel whoami` gagal** — pengguna menjalankan:
```
! npx vercel@latest login
```
(pilih "Continue with GitHub" agar akun Vercel terkait GitHub; alur browser/perangkat). Verifikasi: `npx vercel@latest whoami` → nama akun.

Agen **tidak** boleh membuat/menyimpan token (`--token`, `GH_TOKEN`, `VERCEL_TOKEN`) atas inisiatif sendiri.

## 2. Gerbang QA lokal (wajib lulus — lihat `research/QA_PLAN.md`)

```powershell
npm ci
npx tsc --noEmit
npm run build
npm audit --omit=dev
npx playwright test
```
Pastikan `package.json` memiliki `"engines": { "node": "24.x" }` (atau versi Node yang didukung Vercel saat deploy; cek di Project Settings → Build → Node.js Version) dan skrip `"build": "tsc -b && vite build"`.

File wajib di `website/`: `.gitignore` (lihat QA_PLAN §3.6), `README.md`, `LICENSE` (kode), `ATTRIBUTION.md`/`LICENSE-ASSETS.md` (BodyParts3D CC BY-SA 2.1 JP), `vercel.json` (header keamanan + cache).

## 3. Inisialisasi Git lokal

```powershell
Set-Location "C:\Users\NuRichter\Documents\Proyek 3D\website"
git init -b main
git config user.name                 # jika kosong: git config user.name "NuRichter"
git config user.email                # jika kosong: gunakan email noreply GitHub (Settings → Emails) agar email pribadi tidak publik
git add -A
git status --short
# Penjaga: harus TIDAK ada output
git ls-files | Select-String -Pattern '\.(pptx|docx|pdf|env)$|node_modules/|^dist/|^\.vercel/'
# File besar (> 50 MB) — harus kosong
git ls-files | ForEach-Object { Get-Item $_ } | Where-Object Length -gt 50MB | Select-Object FullName, Length
git commit -m "Initial commit: Digital Anatomy Lab (Vite + React + Three.js, BodyParts3D CC BY-SA 2.1 JP)"
```

## 4. Buat repo publik & push

```powershell
gh repo view NuRichter/digital-anatomy-lab     # harus "Could not resolve" (repo belum ada). Jika sudah ada → STOP, konfirmasi ke pengguna.
gh repo create digital-anatomy-lab --public --source=. --remote=origin --push --description "Laboratorium anatomi 3D interaktif berbasis web (BodyParts3D, CC BY-SA 2.1 JP)"
```
Verifikasi:
```powershell
git remote -v
git ls-remote origin main
gh repo view NuRichter/digital-anatomy-lab --json name,visibility,defaultBranchRef,url
```
Harapan: `visibility: PUBLIC`, `defaultBranchRef.name: main`.

Opsional (metadata repo):
```powershell
gh repo edit NuRichter/digital-anatomy-lab --add-topic anatomy,threejs,react,vite,education,bodyparts3d
```

## 5. Tautkan ke Vercel

```powershell
npx vercel@latest link --yes --project digital-anatomy-lab
```
- Membuat/menautkan proyek dan folder `.vercel/` (berisi `project.json` dengan orgId/projectId) — **sudah di-.gitignore, jangan di-commit.**
- Set pengaturan build eksplisit (Vite biasanya terdeteksi otomatis, tetap dikunci):
```powershell
npx vercel@latest project update digital-anatomy-lab --framework vite --build-command "npm run build" --output-directory dist --install-command "npm ci"
npx vercel@latest project inspect digital-anatomy-lab
```

## 6. Hubungkan Git untuk auto-deploy

```powershell
npx vercel@latest git connect --yes
```
CLI membaca remote `origin` dari `.git/config` dan menghubungkannya ke proyek tertaut.
- Jika gagal karena izin: Vercel GitHub App belum punya akses ke repo. Minta pengguna membuka https://github.com/apps/vercel → *Configure* → beri akses ke `digital-anatomy-lab` (atau dashboard Vercel → Project → Settings → Git → Connect Git Repository), lalu ulangi perintah di atas.
- Perilaku setelah terhubung: push ke `main` → deployment **Production**; push ke cabang lain/PR → deployment **Preview** (+ komentar/status di GitHub).

## 7. Deploy

**Penting (dokumentasi Vercel):** *deployment pertama dari proyek baru selalu Production*, walaupun tanpa `--prod`. Karena itu gerbang QA lokal (langkah 2) harus lulus sebelum deploy pertama.

Opsi A — via Git (disarankan, sekaligus menguji auto-deploy): deployment produksi pertama dipicu dengan push ke `main` (lihat langkah 8). Jika push awal di langkah 4 terjadi sebelum Git terhubung, picu ulang:
```powershell
git commit --allow-empty -m "chore: trigger first Vercel deployment"
git push origin main
```

Opsi B — via CLI:
```powershell
$prodUrl = npx vercel@latest deploy --prod --yes      # stdout = URL deployment
$prodUrl
```

Preview berikutnya (setelah deployment pertama ada):
```powershell
$previewUrl = npx vercel@latest deploy --yes
npx vercel@latest inspect $previewUrl
npx vercel@latest inspect $previewUrl --logs           # log build bila gagal
```
Promosikan preview yang sudah di-QA ke produksi (tanpa build ulang):
```powershell
npx vercel@latest promote $previewUrl
```
atau build ulang ke produksi: `npx vercel@latest deploy --prod --yes`.

Catatan: pada Hobby, preview deployment secara default dilindungi *Vercel Authentication* (hanya pemilik yang login bisa membuka). Untuk Playwright terhadap preview, gunakan `npx vercel@latest curl / --deployment $previewUrl -I` untuk cek cepat (CLI ≥ 48.8.0; otomatis menambah header bypass proteksi — perhatikan perintah ini dapat membuat *automation bypass secret* di pengaturan proyek, jangan pernah menyalin nilainya ke chat/file), atau jalankan suite penuh terhadap URL produksi. Produksi (`digital-anatomy-lab.vercel.app`) publik.

## 8. Verifikasi integrasi auto-deploy Git

```powershell
git switch -c chore/verify-autodeploy
git commit --allow-empty -m "chore: verify Vercel Git auto-deploy"
git push -u origin chore/verify-autodeploy
$sha = git rev-parse HEAD
```
Tunggu ±1–2 menit, lalu:
```powershell
# 1) Daftar deployment Vercel — harus ada Preview baru dari cabang tsb (status Ready)
npx vercel@latest ls digital-anatomy-lab
# 2) Status commit yang diposting Vercel ke GitHub (context "Vercel", state success, target_url = URL preview)
gh api repos/NuRichter/digital-anatomy-lab/commits/$sha/status --jq '.statuses[] | {context, state, target_url}'
# 3) GitHub Deployments API (environment "Preview")
gh api repos/NuRichter/digital-anatomy-lab/deployments --jq '.[0:3][] | {environment, ref, sha, created_at}'
```
Lulus jika ketiganya menunjukkan deployment untuk `$sha`. Bersihkan:
```powershell
git switch main
git push origin --delete chore/verify-autodeploy
git branch -D chore/verify-autodeploy
```
Verifikasi jalur produksi: perubahan kecil di `main` → `git push` → `npx vercel@latest ls digital-anatomy-lab` menunjukkan deployment *Production* baru, dan `gh api repos/NuRichter/digital-anatomy-lab/deployments --jq '.[0].environment'` = `Production`.

## 9. Verifikasi pasca-deploy produksi

```powershell
$prod = "https://digital-anatomy-lab.vercel.app"     # sesuaikan dengan domain dari `vercel inspect`
curl.exe -sI $prod                                   # 200, header keamanan (CSP, X-Content-Type-Options, Referrer-Policy)
curl.exe -sI "$prod/models/<nama>.glb"               # 200, Content-Type model/gltf-binary, Cache-Control immutable
curl.exe -s -o NUL -w "%{http_code} %{size_download}B %{time_total}s`n" $prod
$env:BASE_URL = $prod; npx playwright test; Remove-Item Env:BASE_URL
gh repo edit NuRichter/digital-anatomy-lab --homepage $prod
```
Checklist: E1, E8, E9, E12, E14 + metrik performa (QA_PLAN §3.4) lulus di produksi; atribusi BodyParts3D tampil; konsol tanpa pelanggaran CSP.

**Rollback** bila produksi rusak:
```powershell
npx vercel@latest rollback            # Hobby: HANYA ke deployment produksi tepat sebelumnya
npx vercel@latest rollback status
# Setelah rollback, penetapan domain produksi otomatis dinonaktifkan; setelah perbaikan di-push,
# pulihkan dengan: npx vercel@latest promote <url-deployment-perbaikan>
```

## 10. Batas Vercel Hobby yang relevan (dicek 2026-10-14)

| Batas | Nilai Hobby | Dampak ke proyek |
|-------|-------------|------------------|
| Penggunaan | **Hanya non-komersial/pribadi** — tanpa iklan, pembayaran, jasa berbayar (donasi boleh) | Proyek pendidikan ini memenuhi syarat selama tidak dimonetisasi |
| Fast Data Transfer | 100 GB/bulan | Model 3D ±20 MB/kunjungan penuh → ±5.000 kunjungan penuh/bulan; kompres GLB & cache immutable |
| Fast Origin Transfer | 10 GB/bulan | Cache CDN lama (immutable) menekan origin transfer |
| CDN Requests | 1.000.000/bulan | Cukup |
| Deployment per hari | 100 | Hindari push beruntun tak perlu |
| Waktu build per deployment | 45 menit | Build Vite < 2 menit |
| Upload sumber via CLI | 100 MB (Hobby), maks 15.000 file | Jika `deploy` via CLI, model besar bisa melampaui — utamakan deploy via Git; jaga `public/models` kecil |
| Mesin build | 2 vCPU, 8 GB RAM | Cukup |
| Proyek | 200 | — |
| Runtime logs | 1 jam | Situs statis, tidak relevan |
| Pelampauan | Fitur dijeda hingga 30 hari | Pantau Usage di dashboard |

Batas GitHub: file > 50 MB memicu peringatan, > 100 MB ditolak (Git LFS tidak disarankan untuk deploy Vercel tanpa mengaktifkan LFS di proyek).

## 11. Pemecahan masalah singkat
- `gh repo create` → "Name already exists": jangan timpa; konfirmasi ke pengguna (pakai repo yang ada atau nama lain).
- Build Vercel gagal "Cannot find module" padahal lokal OK → masalah huruf besar/kecil path (Linux case-sensitive).
- Halaman putih di produksi + error CSP di konsol → longgarkan direktif yang tepat di `vercel.json` (mis. `worker-src blob:`), jangan hapus CSP.
- `vercel git connect` → "Failed to connect": pasang/beri akses Vercel GitHub App (langkah 6).
- 404 saat refresh rute → tambahkan `rewrites` SPA di `vercel.json`.

## 12. Rujukan
- vercel deploy: https://vercel.com/docs/cli/deploy
- vercel link: https://vercel.com/docs/cli/link
- vercel git: https://vercel.com/docs/cli/git
- vercel project: https://vercel.com/docs/cli/project
- Hobby plan: https://vercel.com/docs/plans/hobby
- Limits: https://vercel.com/docs/limits
- Fair use: https://vercel.com/docs/limits/fair-use-guidelines
- gh repo create: https://cli.github.com/manual/gh_repo_create
- gh auth login: https://cli.github.com/manual/gh_auth_login
