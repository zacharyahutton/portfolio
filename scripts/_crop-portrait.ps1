
Add-Type -AssemblyName System.Drawing
function Fit-Crop($srcPath, $destPath, $tw, $th) {
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
  # Bias crop slightly toward upper body / face (demo portrait framing)
  $dx = [int](($tw - $nw) / 2)
  $dy = [int](($th - $nh) / 2 - ($nh * 0.06))
  $g.DrawImage($src, $dx, $dy, $nw, $nh)
  $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose(); $src.Dispose()
  Write-Host ("Wrote {0} ({1}x{2})" -f $destPath, $tw, $th)
}
$hero = [System.Drawing.Image]::FromFile('C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\2026\\01\\hero-image.png')
$hw = $hero.Width; $hh = $hero.Height
$hero.Dispose()
Write-Host ("Demo hero size: {0}x{1}" -f $hw, $hh)
Fit-Crop 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\zach\\zachary-hutton-portrait.png' 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\zach\\hero-zach.png' $hw $hh
# Also overwrite the live hero-image.png slot so existing src keeps working if needed
Fit-Crop 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\zach\\zachary-hutton-portrait.png' 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\2026\\01\\hero-image.png' $hw $hh
# About / choose-us images if present
$choose = 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\2026\\01\\choose-us.png'
if (Test-Path $choose) {
  $c = [System.Drawing.Image]::FromFile($choose)
  $cw=$c.Width; $ch=$c.Height; $c.Dispose()
  Fit-Crop 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\zach\\zachary-hutton-portrait.png' 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\zach\\about-zach.png' $cw $ch
  Fit-Crop 'C:\\Users\\EverybodyHatesA1one\\Documents\\PORTFOLIO\\public\\revox-mirror\\revox.baseecom.com\\wp-content\\uploads\\zach\\zachary-hutton-portrait.png' $choose $cw $ch
}
