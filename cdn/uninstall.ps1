#Requires -RunAsAdministrator

$InstallDir = "$env:ProgramFiles\resradio-cdn-watcher"
$WinSW      = "$InstallDir\winsw.exe"
$WinSWXml   = "$InstallDir\winsw.xml"

if (-not (Test-Path $WinSW)) {
    Write-Host "ERROR: Service does not appear to be installed ($InstallDir not found)" -ForegroundColor Red
    exit 1
}

Write-Host "Stopping and removing service..."
& $WinSW stop      $WinSWXml
& $WinSW uninstall $WinSWXml

Remove-Item $InstallDir -Recurse -Force
Write-Host "Uninstall complete." -ForegroundColor Green
