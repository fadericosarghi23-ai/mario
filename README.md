# Impresa Edile Mario — sito

Sito dell'Impresa Edile Mario (Savona), riempito dalla base riutilizzabile (base svuotata, con segnaposto) con i soli dati della
scheda Edilnet (https://www.edilnet.it/pro/impresa-edile-mario-574260). In italiano.

```bash
npm install
npm run dev            # http://localhost:4720
npm run build          # dist/ statico
npm run slots          # [[DA COMPILARE]] e [[DA VALIDARE]] ancora aperti
```

## Dati usati (scheda Edilnet)

Nome, titolare (Shabanaj Erzen), sede (Via Fratelli Canepa 6/10, 17100 Savona), P.IVA 01731350094,
descrizione dell'attività, 8 specializzazioni, dominio dichiarato `impresaedilemario.it` (oggi non risponde).

## Bozza dimostrativa

Il sito è una **bozza**: `bozza: true` in `src/data/site.ts`. Finché resta così:
etichetta gialla fissa su ogni pagina, nota "Lavoro d'esempio" nelle schede, badge "Esempio" sulle card,
`noindex` su tutte le pagine e `robots.txt` che blocca i motori. Mettendo `bozza: false` spariscono
etichetta, note, noindex e blocco (i badge "Esempio" stanno nei nomi delle categorie in `progetti.ts`).

## Da compilare prima di togliere la bozza

- **Email e telefono**: oggi sono esempi finti (`bozza@example.com`, `000 000 0000`). Orari d'esempio.
- **Form**: scollegato, non invia nulla. Va collegato in `site.form` (Netlify Forms, Formspree/Resend o mailto).
- **Ritratto del titolare**: riquadro grigio "in arrivo".
- **Ragione sociale esatta**, social.
- **I 12 lavori sono esempi**, scritti sulle specializzazioni dichiarate, senza anni né committenti, con
  **foto d'esempio da Unsplash** (licenza Unsplash, uso libero anche commerciale). Vanno sostituiti con i
  lavori e le foto vere (`src/data/progetti.ts`, `scripts/foto-unsplash.mjs`).
- **Logo e icone provvisori** (`scripts/marchio.mjs`: casa a tratto + nome). Non lanciare
  `npm run placeholders`, che li riporterebbe ai segnaposto grigi.
- Palette (oggi quella di default della base) e dominio definitivo (`impresaedilemario.it` oggi non risponde).

## Intro col logo

All'apertura (prima pagina della visita) la casa del logo si disegna, compare il nome e il pannello sale:
`src/components/Intro.astro` + stili in coda a `global.css`. Saltata con "riduci animazioni".

## Rispetto alla base

Una sola sede (`site.sede2 = null`): i blocchi della seconda sede sono stati tolti dai template.
Al posto della "rete di collaboratori" la pagina Chi siamo elenca le specializzazioni.
La pagina /metodo/ contiene "Come lavoriamo" e le 9 pitture e finiture.

---

# Base — studio di architettura

Base riutilizzabile per un sito di studio di architettura. Struttura, layout, design system e animazioni
sono quelli di un sito già pubblicato. Tutti i contenuti sono segnaposto `[[DA COMPILARE: …]]` che
dicono cosa va inserito e quanto deve essere lungo. Le immagini sono SVG grigi con le **stesse misure**
delle originali.

Astro 5, CSS senza framework, tutto guidato dai dati in `src/data/`. Il sito di partenza era in
**inglese**: `lang="en"`, `og:locale` e la microcopy che resta (aria-label tecnici, testi del form in JS)
vanno adattati se il cliente nuovo è in un'altra lingua.

```bash
npm install
npm run dev            # http://localhost:4720
npm run build          # dist/ statico
npm run slots          # conta i [[DA COMPILARE]] ancora aperti, file per file
npm run placeholders   # rigenera logo, favicon, icone e immagine OG segnaposto
npm run check-residui -- ../termini-cliente-vecchio.txt   # residui di un cliente precedente (file fuori dal progetto)
```

## Segnaposto

- **Testo**: `[[DA COMPILARE: cosa va qui, lunghezza]]`. `grep -rn "DA COMPILARE" src` li elenca tutti.
- **Micro-etichette del menu**: token corti `[[MENU 1]]…[[MENU 5]]` (un marker lungo manderebbe a capo il
  menu desktop). Sono le stesse 5 parole usate in breadcrumb e intestazioni del footer: si compilano in
  `src/data/nav.ts` e con una ricerca di `[[MENU`. `npm run slots` li conta come "token corti".
- **Bottoni**: `[[DA COMPILARE: bottone]]` (marker corto: i bottoni non vanno a capo); cosa fa ciascuno si
  capisce dal link.
- **Numeri**: `00` nelle cifre grandi, con l'etichetta accanto a `[[DA COMPILARE]]`.
- **Telefono**: vuoto, come nel sito di partenza che non lo pubblicava. Compilandolo compaiono le righe
  col telefono e il bottone "chiama" nella fascia CTA.

## Come si riempie

1. **Clona** la cartella (senza `node_modules`, `dist`, `.astro`) e lancia `npm install`.
2. **Identità**: `src/data/site.ts` (nome, contatti, due sedi, social, coordinate della mappa, form, dominio)
   e `astro.config.mjs` (`SITE_URL`, uguale a `site.dominio`).
3. **Contenuti in lista**: `src/data/` → `progetti.ts` (3 categorie, 32 progetti), `servizi.ts` (6),
   `team.ts` (2 fondatori), `contenuti.ts` (hero, numeri, 4 card e 9 voci di /metodo/, aree, approccio, CTA),
   `nav.ts` (menu).
4. **Testi delle pagine**: sono inline nei file di `src/pages/` e `src/components/`, con lo stesso marker.
5. **Immagini**: vedi sotto.
6. **Palette**: solo i token in testa a `src/styles/global.css` + `site.themeColor`.
7. Alla fine `npm run slots` deve dare 0 e `npm run build` deve passare.

Righe in più o in meno nelle liste (progetti, servizi, voci) vanno bene: le pagine si adattano.
Gli slug `progetto-01…32`, `categoria-1…3`, `servizio-1…6`, `membro-1…2` sono da rinominare: cerca lo slug
in `src/` e aggiorna i riferimenti (contenuti.ts, servizi.ts, pagine).

## Pagine

| Rotta | Contenuto |
| --- | --- |
| `/` | carosello hero (5 slide da progetti), presentazione + 4 numeri, 6 servizi, 4 card metodo/premi, 6 progetti, aree (fondo scuro), team, sedi + mappa, CTA |
| `/studio/` | testata con foto, presentazione + 4 numeri, approccio (3 punti + 2 foto), fondatori con bio, rete di 12 collaboratori, sedi + competenze |
| `/servizi/` | 6 servizi a sezioni alternate, con foto, punti e progetti correlati |
| `/metodo/` | 4 card con foto e 9 voci: metodo di lavoro oppure premi e riconoscimenti |
| `/progetti/` + 3 categorie + 32 schede | portfolio filtrabile, scheda con dati, gallery e lightbox |
| `/contatti/` | due sedi, email, social, mappa, form |
| privacy, cookie, mappa del sito, grazie, 404 | testi a segnaposto, dati legali da `site.ts` |

Generati dai dati: `sitemap-index.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`, JSON-LD.

## Immagini

Il meccanismo è in `src/lib/media.ts` + `src/components/Picture.astro` (avif/webp/jpg con srcset, width e
height intrinseci) e non va toccato.

- **Contenuti** (progetti, ritratti, mappa): le misure stanno in `src/data/immagini.json`. Finché una voce
  ha solo `width/height/drawing`, in build esce un SVG grigio delle stesse misure con scritto cosa
  rappresenta (`/img/placeholder/<id>.svg`, generato da `src/pages/img/placeholder/[id].svg.ts`).
  Per la foto vera: metti in `public/img/...` le varianti `<stem>-<w>.avif/.webp/.jpg` e aggiungi alla voce
  `src` (la jpg da 1200 o la più grande sotto), `widths` e le misure reali. `drawing: true` = tavola o
  render tecnico, senza ritaglio nella gallery.
- **Statiche** (`public/`): `img/logo/logo.svg` e `logo-light.svg` (882×182, scuro e chiaro), `favicon.svg`,
  `favicon.ico`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `img/og/og-default.png` (1200×630).
- **Segno grafico della fascia CTA**: `src/components/Cta.astro`, riquadro 64×64 a tratto.
- **Mappa**: con `site.geo = null` esce un segnaposto 1200×900 e nessuna chiamata esterna; con le
  coordinate parte l'iframe OpenStreetMap.

## Animazioni

Restano tutte quelle del sito di partenza: header trasparente → pieno dopo 40px, menu mobile, reveal con
IntersectionObserver (`.reveal`), carosello dell'hero (dissolvenza + zoom lento, 6 s, pallini), lightbox
della gallery (frecce, tastiera, swipe), hover di card, foto e bottoni. Il codice è negli script in
`Layout.astro`, `index.astro` e `Lightbox.astro` e nel CSS: non serve modificarlo per riempire la base.

## Tecnici neutralizzati

- **Dominio**: `https://www.example.com` (dominio di riserva) in `site.ts` e `astro.config.mjs`.
- **Form**: scollegato. Con `site.form` tutto vuoto l'invio è bloccato e non parte nulla. Per collegarlo:
  `netlify: true` (Netlify Forms, redirect a `/grazie/`) oppure `endpoint` (Formspree, Resend…) oppure `mailto`.
- **Analytics**: nessuno (`site.analytics = null`), quindi niente banner cookie.
- **Redirect**: nessuno. In `netlify.toml` c'è il modello per i vecchi indirizzi del cliente.
- **Social, Maps**: link `#` finché non si compilano.
