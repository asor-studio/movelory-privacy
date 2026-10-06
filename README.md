# Movelory — sito privacy

Progetto statico indipendente dall’app Flutter, per un repository GitHub dedicato chiamato `movelory-privacy`. HTML e CSS senza build, JavaScript, analytics o font remoti. Il font Geist è servito localmente.

## Prima della pubblicazione

Il testo deriva dalla bozza `docs/privacy-policy-it.md` dell’app, copiata il 6 ottobre 2026. La segnalazione di bozza è mantenuta anche nella pagina: non presentare questa versione come informativa definitiva sullo store.

Confermare identità completa e indirizzo del titolare (attualmente `robrosc`), email, basi giuridiche, conservazione per assistenza e acquisti, garanzie per trasferimenti fuori dallo SEE e data di efficacia. Non sono stati inventati dati o impegni legali mancanti. Dopo la verifica aggiornare `index.html` e `privacy-policy-it.md`, togliendo la nota di bozza. I due file si aggiornano manualmente.

## Pubblicazione su GitHub Pages

1. Creare un repository pubblico `movelory-privacy` sull’account desiderato.
2. Caricare tutti i file di questo progetto nella radice del branch `main`, inclusi `.nojekyll` e `assets`.
3. In **Settings → Pages → Build and deployment**, scegliere **Deploy from a branch**, branch **main**, cartella **/ (root)** e salvare.
4. Attendere il completamento del deploy e usare l’URL HTTPS mostrato da GitHub Pages.

Se il repository viene creato sotto `asor-studio`, l’URL previsto è `https://asor-studio.github.io/movelory-privacy/`. Questo è un URL previsto, non ancora pubblicato o verificato. Non inserire il link al repository o al file Markdown nel Play Store: inserire quello della pagina HTML.

## Verifica e collegamento all’app

Aprire `index.html` localmente oppure eseguire `python -m http.server 8080` da questa cartella e visitare `http://localhost:8080`. Verificare indice, link email e lettura su telefono.

Dopo il deploy verificare che l’URL risponda senza login, poi inserirlo nel campo privacy della Play Console e nella schermata “Privacy e dati” di Movelory (attualmente contiene un segnaposto). Allineare anche la dichiarazione Sicurezza dei dati della Play Console ai dati effettivamente trattati e ai servizi terzi utilizzati.

La pagina è già l’informativa all’URL principale, senza reindirizzamenti o consenso cookie. Il sito non imposta cookie applicativi; il provider GitHub tratta i dati tecnici necessari all’hosting secondo la propria informativa.

## Font

Geist, SIL Open Font License 1.1: vedere `assets/OFL.txt`.

## Fonti

- Requisiti Google Play: https://support.google.com/googleplay/android-developer/answer/10144311
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Italiano e inglese

`index.html` è la versione italiana; `en.html` è la traduzione completa in inglese. Il selettore in alto funziona senza JavaScript, cookie o reindirizzamenti automatici. Entrambe le pagine includono metadati di lingua e link alternate hreflang. Aggiornare entrambe le versioni quando cambia l’informativa; la nota di bozza è presente in entrambe.

URL previsti: `https://asor-studio.github.io/movelory-privacy/` e `https://asor-studio.github.io/movelory-privacy/en.html`.
