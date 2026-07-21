Add-Type -AssemblyName System.Drawing
$ROOT = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO'
$portrait = Join-Path $ROOT 'backup\pre-revox-2026-07-20\public\zachary-hutton-portrait.png'
$cutout = Join-Path $ROOT 'backup\pre-revox-2026-07-20\public\zachary-hutton-cutout.png'
$outDir = Join-Path $ROOT 'public\revox-mirror\revox.baseecom.com\wp-content\uploads\zach'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Fit-Crop([string]$srcPath, [string]$destPath, [int]$tw, [int]$th) {
  if (-not (Test-Path $srcPath)) { Write-Host "MISSING $srcPath"; return }
  $src = [System.Drawing.Image]::FromFile($srcPath)
  $bmp = New-Object System.Drawing.Bitmap $tw, $th
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $scale = [Math]::Max($tw / $src.Width, $th / $src.Height)
  $nw = [int]($src.Width * $scale)
  $nh = [int]($src.Height * $scale)
  $dx = [int](($tw - $nw) / 2)
  $dy = [int](($th - $nh) / 2 - ($nh * 0.06))
  $g.DrawImage($src, $dx, $dy, $nw, $nh)
  $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose()
  Write-Host "Wrote $destPath ($tw x $th)"
}

# Demo hero slot was 636x846; also produce a fuller width variant commonly used for video bg
Fit-Crop $portrait (Join-Path $outDir 'hero-zach.png') 636 846
Fit-Crop $portrait (Join-Path $outDir 'hero-zach-full.png') 1200 1600
Fit-Crop $portrait (Join-Path $outDir 'about-zach.png') 660 696
if (Test-Path $cutout) {
  Fit-Crop $cutout (Join-Path $outDir 'hero-zach-cutout.png') 636 846
}
# Domus cover: if HTML wants png, copy/adapt from svg isn't useful — make a simple PNG from portrait letterbox for now if missing
$domusPng = Join-Path $outDir 'domus-cover.png'
if (-not (Test-Path $domusPng)) {
  Fit-Crop $portrait $domusPng 1200 800
}
Write-Host 'DONE'
Get-ChildItem $outDir -Filter 'hero*' | ForEach-Object { Write-Host $_.Name $_.Length }
