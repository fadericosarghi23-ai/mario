/**
 * LAVORI. 3 categorie e 12 lavori. Ogni lavoro genera /progetti/<slug>/, entra nella pagina
 * della sua categoria e nella mappa del sito.
 *
 * [[DA VALIDARE: lavori d'esempio scritti sulle specializzazioni dichiarate dall'impresa (scheda Edilnet),
 *   con foto d'esempio da Unsplash. Vanno sostituiti con i lavori veri: titolo, zona, descrizione e foto.]]
 *
 * Immagini: src/data/immagini.json (scripts/foto-unsplash.mjs), varianti in public/img/lavori/<slug>/.
 */
import { ph, type Img } from '../lib/media';
import immagini from './immagini.json';

export type CategoriaId = 'cat-1' | 'cat-2' | 'cat-3';

export type Categoria = {
  id: CategoriaId;
  /** slug della pagina /progetti/<slug>/ */
  slug: string;
  /** nome completo (filtri, breadcrumb, eyebrow) */
  nome: string;
  /** etichetta corta sul badge della card */
  etichetta: string;
  /** testo introduttivo della pagina categoria */
  intro: string;
  title: string;
  description: string;
};

export const categorie: Categoria[] = [
  {
    id: 'cat-1',
    slug: 'ristrutturazioni-interne',
    nome: 'Ristrutturazioni interne',
    etichetta: 'Esempio · Interni',
    intro: 'Appartamenti, bagni, cucine e controsoffitti: ristrutturazioni chiavi in mano per case, negozi e uffici a Savona e provincia.',
    title: 'Ristrutturazioni interne a Savona | Impresa Edile Mario',
    description: 'Ristrutturazioni di appartamenti, bagni e cucine, controsoffitti e pareti in cartongesso a Savona e provincia. Preventivo gratuito.',
  },
  {
    id: 'cat-2',
    slug: 'facciate-ed-esterni',
    nome: 'Facciate ed esterni',
    etichetta: 'Esempio · Esterni',
    intro: 'Tinteggiatura e manutenzione di facciate, terrazzi e pavimentazioni esterne, demolizioni e nuove costruzioni.',
    title: 'Facciate, esterni e nuove costruzioni | Impresa Edile Mario',
    description: 'Tinteggiatura e manutenzione di facciate, pavimentazioni esterne, demolizioni e nuove costruzioni a Savona e provincia.',
  },
  {
    id: 'cat-3',
    slug: 'pietra-e-finiture',
    nome: 'Pietra e finiture',
    etichetta: 'Esempio · Finiture',
    intro: 'Pareti in pietra viva, marmi e mosaici, stucco veneziano e pitture tecniche: le lavorazioni che danno carattere agli ambienti.',
    title: 'Pietra viva, marmi e finiture decorative | Impresa Edile Mario',
    description: 'Pareti in pietra viva, marmi e mosaici, stucco veneziano, spatolato e pitture antimuffa e termo-isolanti a Savona.',
  },
];

export const categoria = (id: CategoriaId) => categorie.find((c) => c.id === id)!;

export type Progetto = {
  slug: string;
  titolo: string;
  luogo: string;
  /** categoria principale (badge) */
  categoria: CategoriaId;
  /** tutte le categorie in cui compare (filtri) */
  categorie: CategoriaId[];
  intervento: string;
  progettisti?: string[];
  importo?: string;
  temi: string[];
  /** id del membro del team referente (src/data/team.ts); vuoto = riga nascosta */
  referente: string;
  paragrafi: string[];
  immagini: Img[];
};

/** Voce di src/data/immagini.json: solo misure finché è un segnaposto; con src + widths è la foto vera */
type Foto = { width: number; height: number; drawing: boolean; src?: string; widths?: number[] };
const foto = immagini.progetti as Record<string, Foto[]>;

const imgs = (slug: string, titolo: string, luogo: string): Img[] =>
  (foto[slug] ?? []).map((f, k) => {
    const nn = String(k + 1).padStart(2, '0');
    if (f.src) {
      return { src: f.src, width: f.width, height: f.height, widths: f.widths, responsive: true, drawing: f.drawing || undefined, alt: `${titolo} — foto d’esempio ${k + 1}, non di un lavoro reale` };
    }
    return ph(`${slug}-${nn}`, f.width, f.height, `${titolo.toUpperCase()} · FOTO ${nn}`, { alt: `foto ${nn} del lavoro ${titolo}` });
  });

type Riga = [
  slug: string,
  cat: CategoriaId,
  titolo: string,
  luogo: string,
  settore: string,
  contesto: string,
  tipologia: string,
  paragrafo: string,
  con?: string[],
];

const R: Riga[] = [
  ['ristrutturazione-appartamento', 'cat-1', 'Appartamento ristrutturato', 'Savona', 'Residenziale', 'Ristrutturazione totale', 'Appartamento',
    'Ristrutturazione completa di un appartamento: demolizioni, nuovi impianti, pavimenti, bagno e tinteggiatura, con un unico referente dal primo sopralluogo alla consegna delle chiavi.'],
  ['rifacimento-bagno', 'cat-1', 'Bagno rinnovato', 'Savona', 'Residenziale', 'Rifacimento bagno', 'Bagno',
    'Rifacimento di un bagno: rimozione dei vecchi rivestimenti, nuovi scarichi, doccia a filo pavimento, piastrelle decorative e sanitari sospesi.'],
  ['rinnovo-cucina', 'cat-1', 'Cucina luminosa', 'Provincia di Savona', 'Residenziale', 'Ristrutturazione cucina', 'Cucina',
    'Cucina ripensata da zero: pareti spostate, impianti adeguati, nuovo pavimento e rivestimenti, per un ambiente aperto e luminoso.'],
  ['controsoffitti-cartongesso', 'cat-1', 'Controsoffitti in cartongesso', 'Savona', 'Commerciale', 'Opere in cartongesso', 'Uffici',
    'Controsoffitti e pareti in cartongesso per uno spazio di lavoro: struttura in acciaio zincato, isolamento acustico e predisposizione per l’illuminazione.'],
  ['tinteggiatura-facciata', 'cat-2', 'Facciata di condominio', 'Savona', 'Condominio', 'Tinteggiatura esterna', 'Facciata',
    'Ripristino e tinteggiatura della facciata di un condominio: preparazione del fondo, trattamento delle crepe e pittura traspirante nei colori della tradizione ligure.'],
  ['pavimentazione-terrazzo', 'cat-2', 'Terrazzo pavimentato', 'Provincia di Savona', 'Residenziale', 'Pavimentazione esterna', 'Terrazzo',
    'Nuova pavimentazione di un terrazzo: impermeabilizzazione, massetto con le giuste pendenze e posa di piastrelle per esterni antiscivolo.'],
  ['nuova-costruzione', 'cat-2', 'Casa di nuova costruzione', 'Provincia di Savona', 'Residenziale', 'Nuova costruzione', 'Casa unifamiliare',
    'Costruzione di una casa unifamiliare dalle fondazioni alle finiture: struttura, murature, tetto, impianti e rifiniture interne ed esterne.'],
  ['manutenzione-facciata', 'cat-2', 'Facciata con ponteggio', 'Savona', 'Condominio', 'Manutenzione esterna', 'Facciata',
    'Manutenzione straordinaria di una facciata con ponteggio: rimozione delle parti ammalorate, ripristino dell’intonaco e nuova tinteggiatura protettiva.'],
  ['pietra-viva', 'cat-3', 'Parete in pietra viva', 'Savona', 'Residenziale', 'Pietra a vista', 'Soggiorno',
    'Una muratura storica riportata alla luce: rimozione dell’intonaco, pulizia e stilatura dei giunti, trattamento consolidante per una parete in pietra viva.'],
  ['stucco-veneziano', 'cat-3', 'Stucco veneziano', 'Savona', 'Residenziale', 'Finitura decorativa', 'Pareti interne',
    'Pareti in stucco veneziano e spatolato: più mani a spatola e lucidatura finale per una superficie profonda, liscia e resistente.'],
  ['marmi-e-mosaici', 'cat-3', 'Marmi e mosaici', 'Provincia di Savona', 'Residenziale', 'Rivestimenti in pietra', 'Bagno',
    'Rivestimenti in marmo e pavimento a mosaico: taglio su misura, posa accurata e stuccatura dei giunti per un bagno dal fascino classico.'],
  ['pittura-antimuffa', 'cat-3', 'Pittura antimuffa', 'Savona', 'Residenziale', 'Tinteggiatura interna', 'Abitazione',
    'Tinteggiatura interna con idropittura traspirante e antimuffa, dopo il trattamento delle pareti: ambienti più sani e finiture lavabili.'],
];

export const progetti: Progetto[] = R.map(([slug, cat, titolo, luogo, settore, contesto, tipologia, paragrafo, con]) => ({
  slug,
  titolo,
  luogo,
  categoria: cat,
  categorie: [cat],
  intervento: `${contesto} · ${tipologia}`,
  progettisti: con,
  temi: [settore, contesto],
  referente: '',
  paragrafi: [paragrafo],
  immagini: imgs(slug, titolo, luogo),
}));

export const progetto = (slug: string) => progetti.find((p) => p.slug === slug)!;
export const copertina = (p: Progetto) => p.immagini[0];
export const inCategoria = (id: CategoriaId) => progetti.filter((p) => p.categorie.includes(id));
