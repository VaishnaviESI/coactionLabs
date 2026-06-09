# Builds the frontend and server, then packages a deployable zip for the
# CO/ACTION AI Hub server (D:\LabsHub).
#
# Usage:
#   .\package-for-server.ps1
#
# Output: labs-deploy.zip in the repo root.

[CmdletBinding()]
param(
    [string]$OutFile = "labs-deploy.zip"
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

Write-Host "==> Building frontend (npm run build)"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Frontend build failed" }

Write-Host "==> Installing server production dependencies"
Push-Location server
npm ci --omit=dev
if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Server dependency install failed" }
Pop-Location

Write-Host "==> Building server bundle (esbuild -> server/dist/server.mjs)"
Push-Location server
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Server build failed" }
Pop-Location

# Assemble the staging set.
$staging = Join-Path $RepoRoot ".pkg-staging"
if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

Write-Host "==> Staging deploy contents"
Copy-Item "$RepoRoot\dist" "$staging\dist" -Recurse -Force

New-Item -ItemType Directory -Path "$staging\server\dist" -Force | Out-Null
Copy-Item "$RepoRoot\server\dist\server.mjs" "$staging\server\dist\server.mjs" -Force
if (Test-Path "$RepoRoot\server\dist\server.mjs.map") {
    Copy-Item "$RepoRoot\server\dist\server.mjs.map" "$staging\server\dist\server.mjs.map" -Force
}
# Migration runner bundle + SQL (for running migrations on the server).
if (Test-Path "$RepoRoot\server\dist\migrate.js") {
    Copy-Item "$RepoRoot\server\dist\migrate.js" "$staging\server\dist\migrate.js" -Force
    if (Test-Path "$RepoRoot\server\dist\migrate.js.map") {
        Copy-Item "$RepoRoot\server\dist\migrate.js.map" "$staging\server\dist\migrate.js.map" -Force
    }
}
Copy-Item "$RepoRoot\server\migrations" "$staging\server\migrations" -Recurse -Force
Copy-Item "$RepoRoot\server\node_modules" "$staging\server\node_modules" -Recurse -Force
Copy-Item "$RepoRoot\server\package.json" "$staging\server\package.json" -Force
Copy-Item "$RepoRoot\ecosystem.config.cjs" "$staging\ecosystem.config.cjs" -Force

# AWS RDS root CA bundle — required for Aurora TLS (NODE_EXTRA_CA_CERTS).
if (Test-Path "$RepoRoot\server\certs\rds-global-bundle.pem") {
    New-Item -ItemType Directory -Path "$staging\certs" -Force | Out-Null
    Copy-Item "$RepoRoot\server\certs\rds-global-bundle.pem" "$staging\certs\rds-global-bundle.pem" -Force
} else {
    Write-Warning "server\certs\rds-global-bundle.pem not found; Aurora TLS will fail on the server until it is present at D:\LabsHub\certs\."
}

if (Test-Path "$RepoRoot\.env") {
    Copy-Item "$RepoRoot\.env" "$staging\.env" -Force
} else {
    Write-Warning ".env not found in repo root; zip will not contain runtime env vars."
}

# Produce the zip.
$zipPath = Join-Path $RepoRoot $OutFile
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Write-Host "==> Creating $OutFile"
Compress-Archive -Path "$staging\*" -DestinationPath $zipPath -Force

Remove-Item $staging -Recurse -Force
Write-Host "==> Done: $zipPath"
