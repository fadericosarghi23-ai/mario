/**
 * Contenuti ripetuti o in lista (home, chi siamo, metodo). I testi singoli delle pagine
 * sono scritti direttamente nei file .astro.
 *
 * La pagina /metodo/ ha 4 card con foto (`tappe`: come lavoriamo) e 9 voci (`fasi`: le finiture e
 * pitture elencate nella descrizione dell'impresa).
 */
import { progetto } from './progetti';

/** Carosello hero della home: 5 slide, ognuna punta a un lavoro (titolo · zona nella didascalia). */
export const heroSlides = [
  { progetto: 'ristrutturazione-appartamento', foto: 0 },
  { progetto: 'tinteggiatura-facciata', foto: 0 },
  { progetto: 'rifacimento-bagno', foto: 0 },
  { progetto: 'pietra-viva', foto: 0 },
  { progetto: 'rinnovo-cucina', foto: 0 },
].map(({ progetto: slug, foto }) => {
  const p = progetto(slug);
  return { href: `/progetti/${p.slug}/`, titolo: p.titolo, luogo: p.luogo, img: p.immagini[foto] };
});

/** Lavori nella griglia della home (6) */
export const progettiHome = ['ristrutturazione-appartamento', 'rifacimento-bagno', 'tinteggiatura-facciata', 'pietra-viva', 'controsoffitti-cartongesso', 'marmi-e-mosaici'];

/** Numeri (home: 4 card sotto la presentazione) */
export const numeriHome = [
  { n: '8', label: 'Specializzazioni' },
  { n: '3', label: 'Settori: casa, commercio, industria' },
  { n: '0 €', label: 'Costo del preventivo' },
  { n: 'SV', label: 'Savona e provincia' },
];

/** Numeri (pagina chi siamo) */
export const numeriStudio = [
  { n: '8', label: 'Specializzazioni' },
  { n: '9', label: 'Pitture e finiture' },
  { n: '6', label: 'Servizi' },
  { n: '1', label: 'Sede a Savona' },
];

/** 4 card scure con foto (home + /metodo/): come lavoriamo */
export const tappe = [
  {
    titolo: 'Consulenza personalizzata',
    testo: 'Ascoltiamo le esigenze e valutiamo l’immobile, per proporre la soluzione più adatta e i materiali giusti.',
    img: progetto('ristrutturazione-appartamento').immagini[2],
  },
  {
    titolo: 'Preventivo gratuito',
    testo: 'Un preventivo chiaro e senza impegno, e durante i lavori il rispetto del budget concordato.',
    img: progetto('rinnovo-cucina').immagini[1],
  },
  {
    titolo: 'Preparazione accurata',
    testo: 'Ogni lavoro parte dalla preparazione delle superfici: la base di un risultato duraturo e di pregio.',
    img: progetto('pittura-antimuffa').immagini[1],
  },
  {
    titolo: 'Tempi rapidi, in sicurezza',
    testo: 'Attrezzature moderne e materiali di qualità, nel pieno rispetto delle normative e degli standard di sicurezza.',
    img: progetto('manutenzione-facciata').immagini[0],
  },
];

/** Le 9 pitture e finiture (/metodo/) */
export const fasi = [
  { titolo: 'Idropitture traspiranti', testo: 'Lasciano respirare i muri e riducono la condensa: la scelta giusta per gli ambienti di tutti i giorni.' },
  { titolo: 'Pitture antimuffa', testo: 'Proteggono bagni, cucine e pareti fredde dalla muffa, dopo il trattamento del supporto.' },
  { titolo: 'Pitture termo-isolanti', testo: 'Migliorano il comfort delle pareti e aiutano a ridurre i consumi energetici della casa.' },
  { titolo: 'Pitture lavabili', testo: 'Superfici resistenti che si puliscono con facilità: ideali per corridoi, cucine e camerette.' },
  { titolo: 'Stucco veneziano', testo: 'Finitura a spatola lucida e profonda, dall’effetto marmoreo, per pareti eleganti e durevoli.' },
  { titolo: 'Spatolato', testo: 'Velature sovrapposte stese a spatola, che danno movimento e profondità alla parete.' },
  { titolo: 'Spugnato', testo: 'Un effetto morbido e sfumato ottenuto a spugna, per dare carattere a un ambiente.' },
  { titolo: 'Finiture marmoree', testo: 'Decorazioni che riprendono le venature del marmo, per nicchie, colonne e pareti di pregio.' },
  { titolo: 'Pietra viva', testo: 'Murature storiche riportate alla luce o nuove pareti decorative dal fascino naturale.' },
];

/** Per chi lavoriamo (home, fondo scuro): 6 box */
export const aree = [
  { conteggio: 'Residenziale', nome: 'Case e appartamenti', comuni: 'Ristrutturazioni totali, bagni, cucine, pavimenti e tinteggiature' },
  { conteggio: 'Condomini', nome: 'Facciate e parti comuni', comuni: 'Tinteggiatura e manutenzione di facciate ed esterni' },
  { conteggio: 'Commerciale', nome: 'Negozi e uffici', comuni: 'Controsoffitti, pareti in cartongesso, pavimenti e finiture' },
  { conteggio: 'Industriale', nome: 'Capannoni e magazzini', comuni: 'Opere edili, demolizioni e tinteggiature di grandi superfici' },
  { conteggio: 'Nuove costruzioni', nome: 'Dalle fondazioni al tetto', comuni: 'Strutture, murature e finiture di nuovi edifici' },
  { conteggio: 'Esterni', nome: 'Terrazzi e cortili', comuni: 'Pavimentazioni esterne e pareti in pietra' },
];

/** Approccio: 3 punti (pagina chi siamo) */
export const approccio = [
  { titolo: 'Consulenza', testo: 'Ogni cliente è seguito con consulenze personalizzate, per scegliere insieme soluzioni, materiali e finiture.' },
  { titolo: 'Qualità', testo: 'Attrezzature moderne e materiali di alta qualità, per risultati rifiniti nel rispetto delle normative vigenti.' },
  { titolo: 'Risparmio', testo: 'Interventi pensati per migliorare il comfort e l’isolamento termico e ridurre i consumi energetici.' },
];

/** Elenco competenze nella sezione sede (pagina chi siamo) */
export const competenzeStudio = [
  'Ristrutturazioni totali',
  'Tinteggiature interne ed esterne',
  'Pareti in pietra viva',
  'Cartongesso e controsoffitti',
  'Pavimenti e rivestimenti',
  'Demolizioni e nuove costruzioni',
  'Preventivi gratuiti e budget rispettato',
];

/** FAQ: vuote = sezione FAQ della home e schema FAQPage non resi. */
export const faq: { d: string; r: string }[] = [];
export const FAQ_COL1 = 5;

/** CTA in fondo alle pagine */
export const cta = {
  eyebrow: 'Preventivo gratuito',
  titolo: 'Hai un lavoro in mente?',
  testo: 'Raccontaci cosa vuoi rinnovare: ti prepariamo un preventivo gratuito e senza impegno, a Savona e in tutta la provincia.',
};
