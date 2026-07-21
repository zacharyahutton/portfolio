# Kill listeners on 3000
$conns = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
foreach ($c in $conns) {
  if ($c.OwningProcess) {
    Write-Host ("Killing PID {0}" -f $c.OwningProcess)
    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
  }
}
Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object {
  $cmd = (Get-CimInstance Win32_Process -Filter ("ProcessId={0}" -f $_.Id) -ErrorAction SilentlyContinue).CommandLine
  if ($cmd -and ($cmd -match 'next')) {
    Write-Host ("Killing next node PID {0}" -f $_.Id)
    Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  }
}
$nextDir = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\.next'
if (Test-Path $nextDir) {
  Remove-Item $nextDir -Recurse -Force
  Write-Host 'Cleared .next'
}
Write-Host 'Ready'
