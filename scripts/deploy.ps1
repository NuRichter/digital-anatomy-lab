<#
  Deploy otomatis Laboratorium Anatomi Digital ke GitHub + Vercel.

  Pemakaian (PowerShell, dari folder mana pun):
    powershell -ExecutionPolicy Bypass -File website\scripts\deploy.ps1
    powershell -ExecutionPolicy Bypass -File website\scripts\deploy.ps1 -SkipTests

  Skrip ini idempoten:
    - Jalankan pertama kali: membuat repo GitHub, menautkan proyek Vercel,
      menghubungkan Git (auto-deploy), lalu push -> Vercel membangun produksi.
    - Jalankan berikutnya: QA lokal, push ke main, tunggu deployment, verifikasi.
  Tidak ada token yang dibuat, dibaca, atau disimpan. Login dilakukan sendiri
  oleh pengguna (gh auth login / vercel login).
#>
param(
  [switch]$SkipTests,
  [string]$Repo = 'digital-anatomy-lab',
  [int]$TimeoutSec = 600
)

$Tools = 'C:\Users\NuRichter\tools'
$env:Path = "$Tools\node-v24.20.0-win-x64;$Tools\gh\bin;" + $env:Path
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

function Step($msg) { Write-Host "`n== $msg" -ForegroundColor Cyan }
function Fail($msg) { Write-Host "GAGAL: $msg" -ForegroundColor Red; exit 1 }
function Vc { & npx.cmd --yes vercel@latest @args }
# Jalankan perintah native dan kembalikan stdout+stderr sebagai teks (aman di PS 5.1)
function Run([string]$cmd) { cmd /c "$cmd 2>&1" | Out-String }

# ---------------------------------------------------------------- 1. Login
Step 'Cek autentikasi'
gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Fail "GitHub belum login. Jalankan sendiri:`n  $Tools\gh\bin\gh.exe auth login --hostname github.com --git-protocol https --web"
}
$Owner = (gh api user --jq .login).Trim()
gh auth setup-git | Out-Null
$vcUser = (Run 'npx.cmd --yes vercel@latest whoami')
if ($vcUser -match 'Logged out|Error|not logged') {
  Fail "Vercel belum login. Jalankan sendiri:`n  $Tools\node-v24.20.0-win-x64\npx.cmd vercel@latest login"
}
Write-Host "GitHub: $Owner | Vercel: $(($vcUser -split "`n" | Where-Object { $_ -match '\S' } | Select-Object -Last 1).Trim())"

# ---------------------------------------------------------------- 2. QA lokal
Step 'QA lokal: typecheck + build'
if (-not (Test-Path node_modules)) { npm ci; if ($LASTEXITCODE) { Fail 'npm ci' } }
npm run build
if ($LASTEXITCODE) { Fail 'build gagal; tidak ada yang dipublikasikan' }
if (-not $SkipTests) {
  Step 'QA lokal: Playwright'
  npx.cmd playwright test --reporter=line
  if ($LASTEXITCODE) { Fail 'uji Playwright gagal; tidak ada yang dipublikasikan' }
}

# ---------------------------------------------------------------- 3. Penjaga isi repo
Step 'Cek berkas yang akan di-push'
$dirty = git status --porcelain
if ($dirty) {
  Write-Host $dirty
  Fail 'ada perubahan belum di-commit. Commit dulu (git add -A; git commit -m "...") lalu ulangi.'
}
$bad = git ls-files | Select-String -Pattern '\.(pptx|docx|pdf|blend)$|(^|/)\.env|node_modules/|^dist/|^\.vercel/'
if ($bad) { Write-Host $bad; Fail 'berkas terlarang ada di repo' }
$big = git ls-files | ForEach-Object { Get-Item -LiteralPath $_ } | Where-Object Length -gt 50MB
if ($big) { Write-Host ($big | Out-String); Fail 'berkas > 50 MB' }

# ---------------------------------------------------------------- 4. Repo GitHub
Step 'Repo GitHub'
$hasOrigin = (git remote) -contains 'origin'
if (-not $hasOrigin) {
  gh repo view "$Owner/$Repo" *> $null
  if ($LASTEXITCODE -eq 0) {
    Fail "repo $Owner/$Repo sudah ada dan bukan remote proyek ini. Tidak ditimpa. Hapus/ganti nama atau jalankan dengan -Repo <nama-lain>."
  }
  # Repo dibuat tanpa push: Git disambungkan ke Vercel dulu agar push pertama memicu auto-deploy.
  gh repo create $Repo --public --source=. --remote=origin `
    --description 'Laboratorium anatomi 3D interaktif berbasis web (BodyParts3D, CC BY 4.0)'
  if ($LASTEXITCODE) { Fail 'gh repo create' }
  gh repo edit "$Owner/$Repo" --add-topic anatomy,threejs,react,vite,education,bodyparts3d | Out-Null
} else {
  Write-Host "remote origin: $(git remote get-url origin)"
}

# ---------------------------------------------------------------- 5. Proyek Vercel + Git
Step 'Proyek Vercel'
if (-not (Test-Path .vercel\project.json)) {
  Vc link --yes --project $Repo
  if ($LASTEXITCODE) { Fail 'vercel link' }
}
$gitOut = Run 'npx.cmd --yes vercel@latest git connect --yes'
Write-Host $gitOut.Trim()
$autoDeploy = ($gitOut -match 'Connected|already connected')
if (-not $autoDeploy) {
  Write-Host ("Auto-deploy belum aktif. Biasanya karena Vercel GitHub App belum diberi akses ke repo.`n" +
    "  Buka https://github.com/apps/vercel -> Configure -> izinkan '$Repo', lalu jalankan skrip ini lagi.`n" +
    "  Sementara ini deploy lewat CLI.") -ForegroundColor Yellow
}

# ---------------------------------------------------------------- 6. Push + deploy
Step 'Push ke main'
git push -u origin main
if ($LASTEXITCODE) { Fail 'git push' }
$sha = (git rev-parse HEAD).Trim()

$deployUrl = $null
if ($autoDeploy) {
  Step "Menunggu Vercel membangun commit $($sha.Substring(0,7)) (maks $TimeoutSec s)"
  # Push yang tidak membawa commit baru tidak memicu build; picu ulang dengan commit kosong bila perlu.
  $deadline = (Get-Date).AddSeconds($TimeoutSec)
  $nudged = $false
  while ((Get-Date) -lt $deadline -and -not $deployUrl) {
    Start-Sleep 10
    # Filter di PowerShell, bukan jq: PS 5.1 membuang tanda kutip ganda di argumen native.
    $dep = (gh api "repos/$Owner/$Repo/deployments?sha=$sha" | Out-String | ConvertFrom-Json) |
      Where-Object { $_.environment -match '^Production' } | Select-Object -First 1 -ExpandProperty id
    if (-not $dep) {
      if (-not $nudged -and (Get-Date) -gt $deadline.AddSeconds(-$TimeoutSec + 90)) {
        Write-Host 'Belum ada deployment untuk commit ini; memicu dengan commit kosong.'
        git commit --allow-empty -m 'chore: trigger Vercel deployment' | Out-Null
        git push origin main | Out-Null
        $sha = (git rev-parse HEAD).Trim(); $nudged = $true
      }
      continue
    }
    $s0 = (gh api "repos/$Owner/$Repo/deployments/$dep/statuses" | Out-String | ConvertFrom-Json) | Select-Object -First 1
    $st = "$($s0.state) $($s0.environment_url)"
    Write-Host "  status: $st"
    if ($st -match '^success (\S+)') { $deployUrl = $Matches[1] }
    elseif ($st -match '^(failure|error)') { Fail "build Vercel gagal. Lihat log: npx vercel@latest inspect --logs <url>" }
  }
  if (-not $deployUrl) { Fail 'tidak ada deployment produksi selesai dalam batas waktu; cek dashboard Vercel.' }
} else {
  Step 'Deploy produksi lewat CLI'
  $deployUrl = (Vc deploy --prod --yes | Select-Object -Last 1).Trim()
  if ($LASTEXITCODE -or $deployUrl -notmatch '^https://') { Fail "vercel deploy --prod ($deployUrl)" }
}

# ---------------------------------------------------------------- 7. Verifikasi produksi
Step 'Verifikasi produksi'
$inspect = Run "npx.cmd --yes vercel@latest inspect $deployUrl"
$aliases = [regex]::Matches($inspect, 'https://[\w.-]+\.vercel\.app') | ForEach-Object Value | Select-Object -Unique
$prod = $aliases | Where-Object { $_ -match "^https://$Repo(-[\w]+)?\.vercel\.app$" } | Select-Object -First 1
if (-not $prod) { $prod = $deployUrl }
Write-Host "deployment : $deployUrl"
Write-Host "produksi   : $prod"

$code = curl.exe -s -o NUL -w '%{http_code}' $prod
if ($code -ne '200') { Fail "$prod mengembalikan HTTP $code" }
$glb = curl.exe -sI "$prod/models/skeletal.glb" | Out-String
if ($glb -notmatch 'HTTP/\S+ 200' -or $glb -notmatch 'model/gltf-binary') { Write-Host $glb; Fail 'model GLB tidak tersaji benar' }
Write-Host 'HTTP 200, GLB tersaji dengan Content-Type model/gltf-binary'

if (-not $SkipTests) {
  Step 'Playwright terhadap produksi'
  $env:BASE_URL = $prod
  npx.cmd playwright test --reporter=line
  $pw = $LASTEXITCODE
  Remove-Item Env:BASE_URL
  if ($pw) { Fail "uji Playwright gagal di $prod" }
}

gh repo edit "$Owner/$Repo" --homepage $prod | Out-Null

Step 'Selesai'
Write-Host "Repo       : https://github.com/$Owner/$Repo"
Write-Host "Website    : $prod"
if ($autoDeploy) {
  Write-Host 'Auto-deploy: AKTIF (terverifikasi: push ke main menghasilkan deployment produksi di atas)' -ForegroundColor Green
} else {
  Write-Host 'Auto-deploy: BELUM AKTIF (deploy dilakukan lewat CLI; lihat petunjuk di atas)' -ForegroundColor Yellow
}
