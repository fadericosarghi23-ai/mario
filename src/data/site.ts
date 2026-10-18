/**
 * IDENTITÀ DEL CLIENTE — unico punto da cui header, footer, contatti, JSON-LD,
 * meta, privacy, cookie, robots e llms.txt leggono i dati dell'impresa.
 *
 * Impresa Edile Mario (Savona): dati dalla scheda Edilnet (www.edilnet.it/pro/impresa-edile-mario-574260).
 * Una sola sede: sede2 = null (i blocchi della seconda sede non vengono resi).
 */

export const site = {
  /** BOZZA: true = sito dimostrativo. Mostra l'etichetta "Bozza" su ogni pagina, la nota sui lavori,
   *  mette noindex e blocca i motori in robots.txt. Metterlo a false quando i contenuti sono veri. */
  bozza: true,
  /** Testo dell'etichetta fissa in basso */
  bozzaTesto: 'Bozza dimostrativa · lavori, foto e contatti sono esempi, non informazioni reali',
  /** Nome breve usato ovunque (title, header, footer, JSON-LD) */
  nome: 'Impresa Edile Mario',
  /** Denominazione completa/ragione sociale (JSON-LD legalName, privacy). Vuota = si usa `nome`.
   *  [[DA COMPILARE: ragione sociale esatta (dalla visura) — la scheda dice "Impresa Edile di Shabanaj Erzen"]] */
  ragioneSociale: '',
  /** Varianti del nome (JSON-LD alternateName) */
  nomiAlternativi: ['Impresa Edile di Shabanaj Erzen'],
  /** Alt del logo: nome + attività */
  logoAlt: 'Impresa Edile Mario — impresa edile a Savona',
  /** Tipo di attività in 2-4 parole, usato in eyebrow e meta */
  attivita: 'Impresa edile',
  /** Slogan breve (JSON-LD slogan, footer) */
  slogan: 'Tradizione artigianale e tecniche moderne',
  /** Descrizione in 1 frase (meta description di default, JSON-LD, llms.txt) */
  descrizione:
    'Impresa edile a Savona: ristrutturazioni complete, tinteggiature, pietra viva, cartongesso, pavimenti e nuove costruzioni in tutta la provincia.',
  /** Frase del footer sotto il logo */
  footerClaim: 'Ristrutturazioni e opere edili a Savona e provincia, dal piccolo intervento alla ristrutturazione completa.',

  // ── Dominio e tecnici ───────────────────────────────────────────────
  /** Dominio canonico SENZA slash finale. Tenere allineato con SITE_URL in astro.config.mjs.
   *  Dominio dichiarato su Edilnet (oggi non risponde): [[DA VALIDARE: dominio definitivo]] */
  dominio: 'https://www.impresaedilemario.it',
  /** Colore della barra del browser: deve coincidere con --accent in global.css */
  themeColor: '#000000',
  /** Codice ISO regione/provincia per meta geo.region */
  geoRegion: 'IT-SV',

  // ── Contatti ────────────────────────────────────────────────────────
  /** BOZZA: email d'esempio (example.com è un dominio riservato, non riceve posta).
   *  [[DA COMPILARE: email aziendale — Edilnet dice che c'è ma non la pubblica]] */
  email: 'bozza@example.com',
  /** Telefono come si legge a schermo. Vuoto = le righe col telefono non vengono rese.
   *  [[DA COMPILARE: telefono — Edilnet dice che c'è ma non lo pubblica]] */
  telefono: '000 000 0000',
  /** Telefono per i link tel: in formato E.164 senza spazi. BOZZA: numero finto, tutto zeri. */
  telefonoE164: '+390000000000',
  /** PEC e P.IVA: vuote = non rese. */
  pec: '',
  piva: '01731350094',

  indirizzo: {
    via: 'Via Fratelli Canepa 6/10',
    cap: '17100',
    citta: 'Savona',
    provincia: 'SV',
    paese: 'IT',
  },
  /** Seconda sede: null = non resa */
  sede2: null as null | { via: string; cap: string; citta: string; paese: string; mapsUrl: string },
  /** Zona/quartiere in cui si trova la sede */
  zona: 'Oltreletimbro, Savona',
  /** Coordinate per la mappa OpenStreetMap (Nominatim, Via Fratelli Canepa 6) */
  geo: { lat: 44.3023619, lng: 8.4745892 } as null | { lat: number; lng: number },
  /** Link "Indicazioni stradali" */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via%20Fratelli%20Canepa%206%2C%2017100%20Savona',
  /** Modalità di ricevimento (pagina contatti) */
  /** BOZZA: orari d'esempio. [[DA COMPILARE: orari veri]] */
  ricevimento: 'Lun–Ven 8:00–18:00 (orari d’esempio)',

  /** Social: vuoto = blocco nascosto. icona: 'facebook' | 'instagram' | 'linkedin'
   *  [[DA COMPILARE: profili social, se esistono]] */
  social: [] as { nome: string; url: string; icona: 'facebook' | 'instagram' | 'linkedin'; handle: string }[],

  /** Aree servite (JSON-LD areaServed, llms.txt) */
  areeServite: [
    { tipo: 'City', nome: 'Savona' },
    { tipo: 'AdministrativeArea', nome: 'Provincia di Savona' },
    { tipo: 'State', nome: 'Liguria' },
  ],
  /** Competenze (JSON-LD knowsAbout): le specializzazioni dichiarate */
  competenze: [
    'Pittura interna ed esterna',
    'Demolizioni edili',
    'Lavori in cartongesso',
    'Marmi, pietre e mosaici',
    'Nuove costruzioni',
    'Pavimentazione interna ed esterna',
    'Ristrutturazione casa',
    'Ristrutturazione totale',
  ],
  /** Lingue e paesi del punto di contatto (JSON-LD ContactPoint) */
  contattoPaesi: ['IT'],
  contattoLingue: ['Italian'],

  /** Form contatti: SCOLLEGATO finché non si sceglie dove arrivano le richieste.
   *  [[DA COMPILARE: collegamento del form — netlify: true, oppure endpoint (Formspree/Resend), oppure mailto]] */
  form: {
    netlify: false,
    endpoint: '',
    mailto: '',
  },

  /** Analytics/pixel: nessuno */
  analytics: null as null | string,

  /** Anno per il copyright */
  anno: new Date().getFullYear(),
};

export const indirizzoRiga = `${site.indirizzo.via}, ${site.indirizzo.cap} ${site.indirizzo.citta}`;
export const abs = (p: string) => site.dominio + p;
