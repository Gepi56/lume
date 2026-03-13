@echo off
setlocal

set "SRC=%~dp0files"
set "TARGET=%~1"

if "%TARGET%"=="" set "TARGET=."

if not exist "%SRC%" (
  echo ERRORE: cartella sorgente non trovata: %SRC%
  exit /b 1
)

if not exist "%TARGET%" (
  echo ERRORE: cartella progetto non trovata: %TARGET%
  echo Uso: applica_modifiche.bat "C:\percorso\del\progetto"
  exit /b 1
)

echo.
echo ==========================================
echo   LUME - APPLICAZIONE MODIFICHE RELEASE 001
echo ==========================================
echo Sorgente: %SRC%
echo Destinazione: %TARGET%
echo.

robocopy "%SRC%" "%TARGET%" /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP
set "RC=%ERRORLEVEL%"

if %RC% GEQ 8 (
  echo.
  echo ERRORE: copia non riuscita. Codice robocopy: %RC%
  exit /b %RC%
)

echo.
echo Modifiche applicate correttamente.
echo Ora puoi avviare il progetto con:
echo npm run dev -- -p 3001
exit /b 0
