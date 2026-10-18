/**
 * SERVIZI (6), dalle specializzazioni dichiarate. Usati in: home (griglia 3x2), /servizi/ (una sezione
 * per servizio, alternate), footer, mappa del sito, select del form contatti, JSON-LD.
 * id = ancora in /servizi/#<id>. foto = lavoro la cui copertina illustra il servizio.
 * correlati = 3 lavori elencati sotto, categoria = pagina dei lavori collegata.
 */
import type { Icona } from './icone';
import type { CategoriaId } from './progetti';

export type Servizio = {
  id: string;
  nome: string;
  breve: string;
  icona: Icona;
  paragrafi: [string, string];
  punti: string[];
  foto: string;
  correlati: string[];
  categoria: CategoriaId;
};

export const servizi: Servizio[] = [
  {
    id: 'ristrutturazioni',
    nome: 'Ristrutturazioni complete',
    breve: 'Ristrutturazioni chiavi in mano di case, negozi e uffici: cucine, bagni, pavimenti e finiture.',
    icona: 'casco',
    paragrafi: [
      'Dal piccolo intervento alla ristrutturazione totale, per immobili residenziali, commerciali e industriali.',
      'Rifacimento di cucine e bagni, posa di pavimenti e rivestimenti, sempre nel rispetto del budget concordato.',
    ],
    punti: [
      'Ristrutturazione totale',
      'Rifacimento bagni',
      'Rifacimento cucine',
      'Posa di pavimenti e rivestimenti',
      'Ristrutturazioni interne ed esterne',
      'Piccoli interventi e manutenzioni',
    ],
    foto: 'ristrutturazione-appartamento',
    correlati: ['ristrutturazione-appartamento', 'rifacimento-bagno', 'rinnovo-cucina'],
    categoria: 'cat-1',
  },
  {
    id: 'tinteggiature',
    nome: 'Tinteggiature',
    breve: 'Pitture interne ed esterne: idropitture traspiranti e antimuffa, pitture termo-isolanti e lavabili.',
    icona: 'treppiede',
    paragrafi: [
      'Ogni tinteggiatura parte da una preparazione accurata delle superfici, per un risultato estetico duraturo.',
      'All’esterno, facciate di case e condomini con pitture traspiranti e protettive.',
    ],
    punti: [
      'Idropitture traspiranti',
      'Pitture antimuffa',
      'Pitture termo-isolanti',
      'Pitture lavabili',
      'Tinteggiatura di facciate',
      'Preparazione delle superfici',
    ],
    foto: 'tinteggiatura-facciata',
    correlati: ['tinteggiatura-facciata', 'pittura-antimuffa', 'manutenzione-facciata'],
    categoria: 'cat-2',
  },
  {
    id: 'pietra-marmi-mosaici',
    nome: 'Pietra viva, marmi e mosaici',
    breve: 'Murature storiche riportate alla luce, nuove pareti in pietra, rivestimenti in marmo e mosaico.',
    icona: 'telaio',
    paragrafi: [
      'Le pareti in pietra viva danno carattere agli ambienti: recuperiamo le murature storiche o ne creiamo di nuove.',
      'Marmi e mosaici per bagni, pavimenti e rivestimenti, tagliati e posati su misura.',
    ],
    punti: [
      'Recupero di murature in pietra',
      'Nuove pareti in pietra a vista',
      'Rivestimenti in marmo',
      'Pavimenti a mosaico',
      'Pulizia e stilatura dei giunti',
    ],
    foto: 'pietra-viva',
    correlati: ['pietra-viva', 'marmi-e-mosaici', 'stucco-veneziano'],
    categoria: 'cat-3',
  },
  {
    id: 'finiture-decorative',
    nome: 'Finiture decorative',
    breve: 'Stucco veneziano, spatolato, spugnato e finiture marmoree per pareti dal carattere unico.',
    icona: 'pianta',
    paragrafi: [
      'Tecniche decorative della tradizione, eseguite a mano su superfici preparate con cura.',
      'Finiture eleganti e resistenti per soggiorni, ingressi, negozi e ambienti di rappresentanza.',
    ],
    punti: [
      'Stucco veneziano',
      'Spatolato',
      'Spugnato',
      'Finiture marmoree',
      'Velature e decorazioni',
    ],
    foto: 'stucco-veneziano',
    correlati: ['stucco-veneziano', 'pietra-viva', 'pittura-antimuffa'],
    categoria: 'cat-3',
  },
  {
    id: 'cartongesso',
    nome: 'Cartongesso e controsoffitti',
    breve: 'Controsoffitti, pareti divisorie e contropareti in cartongesso, anche con isolamento termico.',
    icona: 'divano',
    paragrafi: [
      'Il cartongesso permette di ridisegnare gli spazi in tempi rapidi, in casa come in negozi e uffici.',
      'Controsoffitti con illuminazione integrata, pareti divisorie, nicchie e contropareti isolanti.',
    ],
    punti: [
      'Controsoffitti',
      'Pareti divisorie',
      'Contropareti isolanti',
      'Nicchie e velette',
      'Predisposizione per l’illuminazione',
    ],
    foto: 'controsoffitti-cartongesso',
    correlati: ['controsoffitti-cartongesso', 'ristrutturazione-appartamento', 'rinnovo-cucina'],
    categoria: 'cat-1',
  },
  {
    id: 'esterni-nuove-costruzioni',
    nome: 'Esterni e nuove costruzioni',
    breve: 'Pavimentazioni esterne, manutenzione di facciate, demolizioni e nuove costruzioni.',
    icona: 'ponte',
    paragrafi: [
      'Demolizioni edili e nuove costruzioni, con attrezzature moderne e nel rispetto delle norme di sicurezza.',
      'Pavimentazioni di terrazzi e cortili, manutenzione di facciate ed esterni.',
    ],
    punti: [
      'Nuove costruzioni',
      'Demolizioni edili',
      'Pavimentazioni esterne',
      'Manutenzione di facciate',
      'Terrazzi e cortili',
    ],
    foto: 'nuova-costruzione',
    correlati: ['nuova-costruzione', 'pavimentazione-terrazzo', 'manutenzione-facciata'],
    categoria: 'cat-2',
  },
];
