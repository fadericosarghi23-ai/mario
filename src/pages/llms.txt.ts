/** llms.txt generato dai dati: nessun testo da tenere allineato a mano. */
import type { APIRoute } from 'astro';
import { site, abs } from '../data/site';
import { servizi } from '../data/servizi';
import { team } from '../data/team';
import { categorie, inCategoria, progetti } from '../data/progetti';

export const GET: APIRoute = () => {
  const righe = [
    `# ${site.nome}`,
    '',
    `> ${site.descrizione}`,
    '',
    '## Dati principali',
    '',
    `- Nome: ${site.nome}`,
    `- Sito: ${abs('/')}`,
    `- Sede: ${site.indirizzo.via}, ${site.indirizzo.cap} ${site.indirizzo.citta} (${site.indirizzo.provincia}), Italia`,
    ...(site.telefono ? [`- Telefono: ${site.telefono}`] : []),
    `- Email: ${site.email}`,
    ...site.social.map((s) => `- ${s.nome}: ${s.url}`),
    `- Zona: ${site.areeServite.map((a) => a.nome).join(', ')}`,
    `- Titolare: ${team.map((m) => m.nome).join(', ')}`,
    `- P.IVA: ${site.piva}`,
    `- Lavori pubblicati: ${progetti.length}`,
    '',
    '## Pagine',
    '',
    `- [Home](${abs('/')}): l'impresa, i servizi, il metodo, i lavori e i contatti.`,
    `- [Chi siamo](${abs('/studio/')}): l'impresa, il titolare, l'approccio e le specializzazioni.`,
    `- [Servizi](${abs('/servizi/')}): ristrutturazioni, tinteggiature, pietra, finiture, cartongesso, esterni e nuove costruzioni.`,
    `- [Metodo](${abs('/metodo/')}): come lavoriamo e le 9 pitture e finiture.`,
    `- [Lavori](${abs('/progetti/')}): i lavori, divisi per categoria.`,
    `- [Contatti](${abs('/contatti/')}): sede, mappa e richiesta di preventivo.`,
    '',
    '## Servizi',
    '',
    ...servizi.map((s) => `- [${s.nome}](${abs(`/servizi/#${s.id}`)}): ${s.breve}`),
    ...categorie.flatMap((c) => ['', `## Lavori — ${c.nome}`, '', ...inCategoria(c.id).map((p) => `- [${p.titolo}](${abs(`/progetti/${p.slug}/`)}): ${p.intervento}. ${p.luogo}.${p.importo ? ` Importo: ${p.importo}.` : ''}`)]),
    '',
  ];
  return new Response(righe.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
