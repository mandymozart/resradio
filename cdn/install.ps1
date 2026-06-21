#Requires -RunAsAdministrator

$InstallDir = "$env:ProgramFiles\resradio-cdn-watcher"
$ScriptDir  = $PSScriptRoot
$WinSW      = "$InstallDir\winsw.exe"
$WinSWXml   = "$InstallDir\winsw.xml"

if (-not (Test-Path "$ScriptDir\winsw.exe")) {
    Write-Host "ERROR: winsw.exe not found next to install.ps1" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$ScriptDir\.env")) {
    Write-Host "ERROR: .env not found." -ForegroundColor Red
    exit 1
}

if ((Get-Content "$ScriptDir\.env" -Raw) -notmatch "WATCH_FOLDER\s*=\s*\S+") {
    Write-Host "ERROR: WATCH_FOLDER is not set in .env" -ForegroundColor Red
    exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found - installing via winget..."
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Could not install Node.js. Install manually from https://nodejs.org" -ForegroundColor Red
        exit 1
    }
    $machinePath  = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")
    $userPath     = [System.Environment]::GetEnvironmentVariable("PATH", "User")
    $env:PATH     = $machinePath + ";" + $userPath
}

Write-Host "Node.js: $((Get-Command node).Source)"

if (Test-Path $WinSW) {
    Write-Host "Removing existing service..."
    & $WinSW stop      $WinSWXml
    & $WinSW uninstall $WinSWXml
}

Write-Host "Installing to $InstallDir..."
if (Test-Path $InstallDir) { Remove-Item $InstallDir -Recurse -Force }
New-Item -ItemType Directory -Force $InstallDir | Out-Null
Copy-Item "$ScriptDir\*" $InstallDir -Recurse -Exclude @("install.ps1", "uninstall.ps1")

Write-Host "Registering service..."
& $WinSW install $WinSWXml
& $WinSW start   $WinSWXml

Write-Host ""
Write-Host "Done. Service is running." -ForegroundColor Green
Write-Host "  Logs     : $InstallDir\winsw.out.log"
Write-Host "  Stop     : $WinSW stop"
Write-Host "  Start    : $WinSW start"
Write-Host "  Uninstall: Run uninstall.ps1 as Administrator"
