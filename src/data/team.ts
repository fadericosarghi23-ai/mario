/**
 * Team. L'id è l'ancora in /studio/#<id> e il riferimento "referente" nei lavori.
 * Il titolare indicato nella scheda Edilnet. Il ritratto resta un segnaposto: non si inventa una persona.
 * [[DA COMPILARE: ritratto del titolare (foto vera) e conferma di nome e ruolo]]
 */
import { ph, type Img } from '../lib/media';
import immagini from './immagini.json';

/** bio: resa sotto il ruolo in /studio/ */
export type Membro = { id: string; nome: string; ruolo: string; foto: Img; bio?: string };

type Foto = { width: number; height: number; src?: string; widths?: number[] };
const ritratti = immagini.team as Record<string, Foto>;

const ritratto = (chiave: string, nome: string): Img => {
  const f = ritratti[chiave];
  if (f.src) return { src: f.src, width: f.width, height: f.height, widths: f.widths, responsive: true, alt: `${nome}, titolare dell'Impresa Edile Mario` };
  // BOZZA: segnaposto grigio delle stesse misure finché non arriva la foto vera
  return { ...ph(`team-${chiave}`, f.width, f.height, 'FOTO DEL TITOLARE · IN ARRIVO'), alt: `Foto di ${nome} in arrivo (segnaposto della bozza)` };
};

export const team: Membro[] = [
  {
    id: 'shabanaj-erzen',
    nome: 'Shabanaj Erzen',
    ruolo: 'Titolare',
    foto: ritratto('membro-1', 'Shabanaj Erzen'),
    bio: 'Titolare dell’impresa edile con sede a Savona, in via Fratelli Canepa. Con il suo staff di professionisti qualificati segue ristrutturazioni e opere edili in tutta la provincia, con consulenze personalizzate e preventivi gratuiti.',
  },
];

export const membro = (id: string) => team.find((m) => m.id === id);
