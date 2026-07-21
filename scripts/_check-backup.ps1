$backup = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\backup\pre-revox-2026-07-20'
if (Test-Path $backup) {
  $s = Get-ChildItem $backup -Recurse -File | Measure-Object Length -Sum
  Write-Host ("BACKUP OK files={0} MB={1}" -f $s.Count, [math]::Round($s.Sum/1MB,2))
  Get-ChildItem $backup -Name
} else {
  Write-Host 'BACKUP MISSING'
}
