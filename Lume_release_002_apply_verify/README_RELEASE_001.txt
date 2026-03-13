LUME - RELEASE 001

Contenuto:
- Nuova rotta pubblica creator: /creator/[slug]
- Pagina elenco dedicata: /creators
- Redirect di compatibilita da /profile/[id] verso /creator/[slug] quando lo slug esiste
- Link pubblici riallineati verso lo slug
- CreatorProfileView riutilizzabile
- Supporto gallery con fallback: creator_images -> avatar_url -> gallery_urls

Come applicare:
1. Estrai questo ZIP in una cartella temporanea.
2. Esegui applica_modifiche.bat passando il percorso della root del progetto Lume.
   Esempio:
   applica_modifiche.bat "C:\Users\tuo_nome\Desktop\Lume"
3. Avvia il progetto con:
   npm run dev -- -p 3001

Nota:
Nel progetto ci sono gia alcuni file legacy/old con errori TypeScript preesistenti non legati a questa release.
Questa release e focalizzata solo sul ramo creator pubblico.
