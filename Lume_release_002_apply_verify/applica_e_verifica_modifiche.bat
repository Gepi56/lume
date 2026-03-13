@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0A

echo ==============================================
echo LUME - APPLICA E VERIFICA MODIFICHE
cmd /c chcp 65001 >nul
echo ==============================================
echo.

echo Trascina qui la cartella ROOT del progetto Lume,
echo poi premi INVIO.
set /p TARGET=Percorso progetto: 

if "%TARGET%"=="" (
  echo.
  echo ERRORE: nessun percorso inserito.
  pause
  exit /b 1
)

set "TARGET=%TARGET:\=\%"
if not exist "%TARGET%\package.json" (
  echo.
  echo ATTENZIONE: nella cartella indicata non trovo package.json
  echo Verifica di aver indicato la ROOT del progetto Lume.
  echo.
  pause
)

set "SRC=%~dp0files"
set "LOG=%~dp0report_release_002.txt"

if exist "%LOG%" del "%LOG%"

echo RELEASE 002 - REPORT > "%LOG%"
echo Data: %date% Ora: %time%>> "%LOG%"
echo Target: %TARGET%>> "%LOG%"
echo.>> "%LOG%"

echo.
echo [1/3] Copia file in corso...
robocopy "%SRC%" "%TARGET%" /E /R:1 /W:1 /NFL /NDL /NJH /NJS /NP >nul
set "RC=%ERRORLEVEL%"
if %RC% GEQ 8 (
  echo ERRORE durante la copia. Codice robocopy: %RC%
  echo ERRORE COPIA - Robocopy code %RC%>> "%LOG%"
  pause
  exit /b %RC%
)

echo OK: copia completata.>> "%LOG%"
echo.
echo [2/3] Verifica file attesi...

call :check "app\creator\[slug]\page.tsx"
call :check "app\creators\page.tsx"
call :check "app\profile\[id]\page.tsx"
call :check "app\page.tsx"
call :check "app\ranking\page.tsx"
call :check "components\creators\CreatorCard.tsx"
call :check "components\creators\CreatorProfileView.tsx"
call :check "components\explore\ProfilesGrid.tsx"
call :check "lib\creators\public.ts"
call :check "lib\server\creators-public.ts"
call :check "lib\server\lume-ranking.ts"

echo.
echo [3/3] Risultato finale...
if "%VERIFY_FAILED%"=="1" (
  echo.
  echo ATTENZIONE: una o piu verifiche NON sono andate a buon fine.
  echo Controlla il file report_release_002.txt dentro lo ZIP estratto.
  echo VERIFICA FINALE: KO>> "%LOG%"
) else (
  echo.
  echo TUTTO OK: modifiche copiate e verificate correttamente.
  echo VERIFICA FINALE: OK>> "%LOG%"
)

echo.>> "%LOG%"
echo Fine report.>> "%LOG%"

echo.
echo Report salvato in:
echo %LOG%
pause
exit /b 0

:check
set "REL=%~1"
set "SFILE=%SRC%\%REL%"
set "DFILE=%TARGET%\%REL%"

if not exist "%SFILE%" (
  echo [ERRORE] File sorgente mancante: %REL%
  echo [ERRORE] File sorgente mancante: %REL%>> "%LOG%"
  set VERIFY_FAILED=1
  goto :eof
)

if not exist "%DFILE%" (
  echo [KO] File destinazione mancante: %REL%
  echo [KO] File destinazione mancante: %REL%>> "%LOG%"
  set VERIFY_FAILED=1
  goto :eof
)

call :hash "%SFILE%" SHASH
call :hash "%DFILE%" DHASH

if not defined SHASH (
  echo [KO] Hash sorgente non leggibile: %REL%
  echo [KO] Hash sorgente non leggibile: %REL%>> "%LOG%"
  set VERIFY_FAILED=1
  goto :eof
)

if not defined DHASH (
  echo [KO] Hash destinazione non leggibile: %REL%
  echo [KO] Hash destinazione non leggibile: %REL%>> "%LOG%"
  set VERIFY_FAILED=1
  goto :eof
)

if /I "%SHASH%"=="%DHASH%" (
  echo [OK] %REL%
  echo [OK] %REL%>> "%LOG%"
) else (
  echo [KO] %REL% ^(hash diverso^)
  echo [KO] %REL% (hash diverso)>> "%LOG%"
  echo      SRC: %SHASH%>> "%LOG%"
  echo      DST: %DHASH%>> "%LOG%"
  set VERIFY_FAILED=1
)
goto :eof

:hash
set "%~2="
for /f "skip=1 delims=" %%H in ('certutil -hashfile "%~1" SHA256 ^| findstr /R /V /C:"hash of file" /C:"CertUtil" /C:"^$"') do (
  set "LINE=%%H"
  set "LINE=!LINE: =!"
  set "%~2=!LINE!"
  goto :eof
)
goto :eof
