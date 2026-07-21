$ErrorActionPreference = 'Stop'
$base = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO'
Set-Location $base

# --- A. Backup ---
$backup = Join-Path $base 'backup\pre-revox-2026-07-20'
if (Test-Path $backup) { Remove-Item $backup -Recurse -Force }
New-Item -ItemType Directory -Force -Path $backup | Out-Null

$dirs = @('app','components','content','public','lib','brand','scripts')
foreach ($d in $dirs) {
  $src = Join-Path $base $d
  if (Test-Path $src) {
    Write-Host "Backing up $d ..."
    robocopy $src (Join-Path $backup $d) /E /XD node_modules .next /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
  }
}
$files = @('package.json','package-lock.json','next.config.ts','tsconfig.json','postcss.config.mjs','eslint.config.mjs','vercel.json','README.md','OPEN_SOURCE.md','next-env.d.ts')
foreach ($f in $files) {
  $src = Join-Path $base $f
  if (Test-Path $src) { Copy-Item $src (Join-Path $backup $f) -Force }
}
Write-Host 'BACKUP DONE:'
Get-ChildItem $backup -Name
$stats = Get-ChildItem $backup -Recurse -File | Measure-Object Length -Sum
Write-Host ("Backup files={0} sizeMB={1}" -f $stats.Count, [math]::Round($stats.Sum/1MB,2))

# --- B. Nested unzip ---
$themeRoot = Join-Path $base '.tmp-themes\revox\main-files\revox-modern-personal-portfolio-wordress-theme'
$extractTo = Join-Path $base '.tmp-themes\revox\extracted'
if (Test-Path $extractTo) { Remove-Item $extractTo -Recurse -Force }
New-Item -ItemType Directory -Force -Path $extractTo | Out-Null

Expand-Archive -Path (Join-Path $themeRoot 'revox.zip') -DestinationPath (Join-Path $extractTo 'revox') -Force
Expand-Archive -Path (Join-Path $themeRoot 'revox-child.zip') -DestinationPath (Join-Path $extractTo 'revox-child') -Force
Expand-Archive -Path (Join-Path $themeRoot 'plugin\revox-toolkit.zip') -DestinationPath (Join-Path $extractTo 'revox-toolkit') -Force

Write-Host 'EXTRACTED TOP:'
Get-ChildItem $extractTo -Name
Write-Host 'REVOX THEME TOP:'
Get-ChildItem (Join-Path $extractTo 'revox') -Name
Write-Host 'Looking for HTML:'
Get-ChildItem $extractTo -Recurse -Filter '*.html' -ErrorAction SilentlyContinue | Select-Object -First 20 -ExpandProperty FullName
Write-Host 'CSS count:'
(Get-ChildItem $extractTo -Recurse -Filter '*.css' -ErrorAction SilentlyContinue).Count
Write-Host 'JS count:'
(Get-ChildItem $extractTo -Recurse -Filter '*.js' -ErrorAction SilentlyContinue).Count
