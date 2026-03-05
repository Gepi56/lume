param(
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"
Set-Location "C:\Dev\lume"

# 1) Controllo: repo git?
if (-not (Test-Path ".git")) {
  Write-Host "ERRORE: Questa cartella non e' un repo git (manca .git)." -ForegroundColor Red
  exit 1
}

# 2) Messaggio commit
if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "backup: lavoro del " + (Get-Date -Format "yyyy-MM-dd HH:mm")
}

# 3) Add + Commit (solo se ci sono modifiche)
git add .

$changed = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changed)) {
  Write-Host "Nessuna modifica da salvare. OK." -ForegroundColor Yellow
  exit 0
}

git commit -m $Message
git push

Write-Host "Backup completato: $Message" -ForegroundColor Green