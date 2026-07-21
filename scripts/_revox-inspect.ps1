$ErrorActionPreference = 'Stop'
$root = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\.tmp-themes\revox'
Write-Host '=== EXTRACTED FILES ==='
Get-ChildItem $root -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($root.Length + 1)
  Write-Host ("{0} | {1:N0} bytes" -f $rel, $_.Length)
}
Write-Host ''
Write-Host '=== ORIGINAL ZIP ENTRIES ==='
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = 'c:\Users\EverybodyHatesA1one\Downloads\revox-personal-portfolio-wordpress-theme-2026-06-02-13-46-22-utc.zip'
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
Write-Host ("TOTAL ENTRIES: {0}" -f $zip.Entries.Count)
$zip.Entries | Sort-Object FullName | ForEach-Object {
  Write-Host ("{0} | {1:N0}" -f $_.FullName, $_.Length)
}
$zip.Dispose()
