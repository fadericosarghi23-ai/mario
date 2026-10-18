/**
 * Cerca residui di un cliente precedente in src/, public/, config e dist/. Esce con errore se ne trova.
 *
 *   npm run check-residui -- <file-termini.txt>        (dopo npm run build per controllare anche dist/)
 *
 * I termini (nome, persone, indirizzi, telefono, P.IVA, dominio, progetti...) stanno in un file di
 * testo, uno per riga, TENUTO FUORI dal progetto: così la base non contiene i dati di nessun cliente.
 * Righe vuote e righe che iniziano con # sono ignorate. Il confronto è senza maiuscole/minuscole.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const elenco = process.argv[2];
if (!elenco || !fs.existsSync(elenco)) {
  console.log('Uso: npm run check-residui -- <file con i termini del cliente precedente, uno per riga>');
  process.exit(2);
}
const TERMINI = fs
  .readFileSync(elenco, 'utf8')
  .split(/\r?\n/)
  .map((r) => r.trim())
  .filter((r) => r && !r.startsWith('#'));

const DIRS = ['src', 'public', 'dist', 'scripts', 'docs', 'astro.config.mjs', 'netlify.toml', 'package.json', 'package-lock.json', 'README.md'];
const SKIP = new Set(['check-residui.mjs']);
const EXT = /\.(astro|ts|js|mjs|json|md|css|html|txt|xml|svg|webmanifest|toml|py)$/;
const MEDIA = /\.(jpe?g|png|webp|avif|gif|pdf|mp4|webm)$/i;

const files = [];
const media = [];
for (const d of DIRS) {
  const full = path.join(ROOT, d);
  if (!fs.existsSync(full)) continue;
  if (fs.statSync(full).isFile()) { files.push(full); continue; }
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (EXT.test(e.name) && !SKIP.has(e.name)) files.push(p);
      else if (MEDIA.test(e.name)) media.push(p);
    }
  })(full);
}

let trovati = 0;
const termini = TERMINI.map((t) => [t, t.toLowerCase()]);
for (const f of [...files, ...media]) {
  const rel = path.relative(ROOT, f);
  // nomi di file e cartelle
  for (const [term, low] of termini) {
    if (rel.toLowerCase().includes(low)) { trovati++; console.log(`${rel}  (nel percorso)  «${term}»`); }
  }
  if (!files.includes(f)) continue;
  const t = fs.readFileSync(f, 'utf8');
  const tl = t.toLowerCase();
  for (const [term, low] of termini) {
    let i = tl.indexOf(low);
    while (i !== -1) {
      trovati++;
      const riga = t.slice(0, i).split('\n').length;
      console.log(`${rel}:${riga}  «${term}»  …${t.slice(Math.max(0, i - 40), i + 40).replace(/\s+/g, ' ')}…`);
      i = tl.indexOf(low, i + low.length);
    }
  }
}
console.log(
  trovati
    ? `\n✗ ${trovati} residui trovati (${TERMINI.length} termini, ${files.length} file di testo, ${media.length} file media)`
    : `✓ Nessun residuo: ${TERMINI.length} termini cercati in ${files.length} file di testo e nei percorsi di ${media.length} file media`,
);
process.exitCode = trovati ? 1 : 0;
