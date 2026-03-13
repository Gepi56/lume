LUME - RELEASE 002
==================

Questa release aggiunge una gestione migliore dei file BAT:

1) applica_e_verifica_modifiche.bat
   - copia i file dentro il progetto
   - verifica file per file con hash SHA256
   - crea il report: report_release_002.txt

2) solo_verifica_modifiche.bat
   - NON copia nulla
   - verifica solo se i file del progetto corrispondono a quelli della release
   - crea il report: report_verifica_release_002.txt

COME USARLI
-----------

A) Per applicare e verificare:
   - estrai lo ZIP
   - esegui: applica_e_verifica_modifiche.bat
   - quando richiesto, indica la cartella ROOT di Lume

B) Per controllare dopo:
   - esegui: solo_verifica_modifiche.bat
   - indica la cartella ROOT di Lume

ROOT GIUSTA DEL PROGETTO
------------------------
La cartella corretta è quella che contiene, ad esempio:
- app
- components
- lib
- package.json

NOTE
----
- Il controllo usa hash SHA256: se dice [OK], il file è identico a quello della release.
- Se una cartella come components\creators non esiste, il BAT la crea durante la copia.
- Se il report finale è KO, significa che almeno un file non è stato copiato bene oppure è diverso.
