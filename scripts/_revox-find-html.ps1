$downloads = 'c:\Users\EverybodyHatesA1one\Downloads'
Get-ChildItem $downloads -Filter '*revox*' | Select-Object Name, Length, LastWriteTime
Get-ChildItem $downloads -Filter '*portfolio*html*' -ErrorAction SilentlyContinue | Select-Object Name, Length
Write-Host '---'
# List widget PHP files for homepage sections
$widgets = 'C:\Users\EverybodyHatesA1one\Documents\PORTFOLIO\.tmp-themes\revox\extracted\revox-toolkit\revox-toolkit\inc\widgets'
Get-ChildItem $widgets -Recurse -Filter '*.php' | ForEach-Object { $_.FullName.Substring($widgets.Length+1) }
