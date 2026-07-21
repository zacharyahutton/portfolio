$js = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\public\revox-mirror\revox.baseecom.com\wp-content\themes\revox\assets\js'
Write-Host "Exists: $(Test-Path $js)"
Get-ChildItem $js | Where-Object { $_.Name -like 'main*' -or $_.Name -like '*cursor*' } | ForEach-Object { Write-Host $_.Name $_.Length }
Write-Host '--- cursor in homepage ---'
Select-String -Path 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\public\revox-mirror\revox.baseecom.com\index.html' -Pattern 'cursor-inner|cursor-outer' | ForEach-Object { $_.Line.Trim().Substring(0, [Math]::Min(120, $_.Line.Trim().Length)) }
Write-Host '--- main file with cursor ---'
Get-ChildItem $js -Filter 'main*' | ForEach-Object {
  $has = Select-String -Path $_.FullName -Pattern 'cursor-inner' -Quiet
  Write-Host ("{0} cursor={1}" -f $_.Name, $has)
}
