$root = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\public\revox-mirror'
$files = Get-ChildItem $root -Recurse -File
Write-Host ("Total files: {0}" -f $files.Count)
$files | Group-Object Extension | Sort-Object Count -Descending | Select-Object -First 20 | ForEach-Object {
  Write-Host ("{0} {1}" -f $_.Name, $_.Count)
}
Write-Host '--- sample ---'
$files | Select-Object -First 50 | ForEach-Object {
  Write-Host $_.FullName.Substring($root.Length + 1)
}
