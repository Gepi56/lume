@echo off
setlocal EnableExtensions EnableDelayedExpansion
color 0B
cmd /c chcp 65001 >nul

echo ==============================================
echo LUME - SOLO VERIFICA MODIFICHE RELEASE 002
echo ==============================================
echo.
echo Trascina qui la cartella ROOT del progetto Lume,
echo poi premi INVIO.
set /p TARGET=Percorso progetto: 

if "%TARGET%"=="" (
  echo Nessun percorso inserito.
  pause
  exit /b 1
)

set "TARGET=%TARGET:\=\%"
set "SRC=%~dp0files"
set "LOG=%~dp0report_verifica_release_002.txt"
if exist "%LOG%" del "%LOG%"

echo REPORT VERIFICA RELEASE 002 > "%LOG%"
echo Data: %date% Ora: %time%>> "%LOG%"
echo Target: %TARGET%>> "%LOG%"
echo.>> "%LOG%"

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

if "%VERIFY_FAILED%"=="1" (
  echo.
  echo VERIFICA: KO
  echo VERIFICA FINALE: KO>> "%LOG%"
) else (
  echo.
  echo VERIFICA: OK
  echo VERIFICA FINALE: OK>> "%LOG%"
)

echo.
echo Report salvato in:
echo %LOG%
pause
exit /b 0

:check
set "REL=%~1"
set "SFILE=%SRC%\%REL%"
set "DFILE=%TARGET%\%REL%"
if not exist "%DFILE%" (
  echo [KO] File mancante: %REL%
  echo [KO] File mancante: %REL%>> "%LOG%"
  set VERIFY_FAILED=1
  goto :eof
)
call :hash "%SFILE%" SHASH
call :hash "%DFILE%" DHASH
if /I "%SHASH%"=="%DHASH%" (
  echo [OK] %REL%
  echo [OK] %REL%>> "%LOG%"
) else (
  echo [KO] %REL% ^(hash diverso^)
  echo [KO] %REL% (hash diverso)>> "%LOG%"
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
