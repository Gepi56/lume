param(
  [string]$Message = ""
)

Set-Location "C:\Dev\lume"

if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "backup automatico " + (Get-Date -Format "yyyy-MM-dd HH:mm")
}

git add .

$changes = git status --porcelain

if ($changes) {
  git commit -m $Message
  git push
  Write-Host "Backup completato:" $Message
} else {
  Write-Host "Nessuna modifica da salvare."
}