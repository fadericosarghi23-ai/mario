// Scarica le foto dei lavori da Unsplash (licenza Unsplash: uso libero, anche commerciale) nel formato
// immagini della base: public/img/lavori/<slug>/<slug>-NN-<w>.<avif|webp|jpg>, larghezze 480/800/1200/1600/2000.
// Scrive src/data/immagini.json (misure reali, src = variante jpg da 1200).
// Uso: node scripts/foto-unsplash.mjs   (idempotente: salta i file già scaricati)
//
// Sono foto d'esempio: vanno sostituite con le foto dei lavori veri dell'impresa.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = [480, 800, 1200, 1600, 2000];

// slug del lavoro -> id foto Unsplash (la prima è la copertina)
export const FOTO = {
  'ristrutturazione-appartamento': ['1656122381069-9ec666d95cf1', '1560185127-6ed189bf02f4', '1768321901750-f7b96d774456'],
  'rifacimento-bagno': ['1584622650111-993a426fbf0a', '1782805153046-88e60379e231'],
  'rinnovo-cucina': ['1565183928294-7063f23ce0f8', '1618832515490-e181c4794a45', '1600684388091-627109f3cd60'],
  'controsoffitti-cartongesso': ['1582203423341-64b918240e25', '1768321903410-54961e343b71', '1768321902000-a014139dc9be'],
  'tinteggiatura-facciata': ['1732552119020-c4fa9919ae41', '1742900280864-bcc27353ceba', '1786339281681-fd3361b23c13'],
  'pavimentazione-terrazzo': ['1697421472608-84e71a8a24b1', '1711098256574-7b497260cdc9'],
  'nuova-costruzione': ['1787672357958-e2c0e4126066', '1787672358060-37f5e39e2f61', '1704742950992-9815a104820c'],
  'manutenzione-facciata': ['1653587193489-f1867b3ffd60', '1646608220368-c604d8e8130f', '1542350880924-09225f70e026'],
  'pietra-viva': ['1727819584099-772894afd8e9', '1784528780206-6a0545dec6fd'],
  'stucco-veneziano': ['1708894462826-ba3fa93b41b7', '1639430257115-f63af9eab97d', '1555181937-efe4e074a301'],
  'marmi-e-mosaici': ['1736770525501-60f6a4b70e9d', '1654463928352-5b50eb452d70'],
  'pittura-antimuffa': ['1745665777586-09381ba528d6', '1717281234297-3def5ae3eee1', '1742900280861-32bed068938b'],
};

/** misure di un JPEG leggendo il marcatore SOF */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  throw new Error('SOF non trovato');
}

async function scarica(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return fs.readFileSync(file);
  for (let t = 0; t < 3; t++) {
    const r = await fetch(url);
    if (r.ok) { const b = Buffer.from(await r.arrayBuffer()); fs.writeFileSync(file, b); return b; }
    await new Promise((s) => setTimeout(s, 1000));
  }
  throw new Error('download fallito: ' + url);
}

const progetti = {};
for (const [slug, ids] of Object.entries(FOTO)) {
  const dir = path.join(ROOT, 'public/img/lavori', slug);
  fs.mkdirSync(dir, { recursive: true });
  progetti[slug] = [];
  for (const [k, id] of ids.entries()) {
    const stem = `${slug}-${String(k + 1).padStart(2, '0')}`;
    const base = `https://images.unsplash.com/photo-${id}?auto=format&fit=max&q=78`;
    // la variante più grande dà le misure (proporzioni originali)
    const big = await scarica(`${base}&w=2000&fm=jpg`, path.join(dir, `${stem}-2000.jpg`));
    const { width, height } = jpegSize(big);
    const widths = W.filter((w) => w < width).concat([Math.min(width, 2000)]);
    if (width < 2000) fs.renameSync(path.join(dir, `${stem}-2000.jpg`), path.join(dir, `${stem}-${width}.jpg`));
    await Promise.all(widths.flatMap((w) => ['jpg', 'webp', 'avif'].map((fm) => scarica(`${base}&w=${w}&fm=${fm}`, path.join(dir, `${stem}-${w}.${fm}`)))));
    const src1200 = widths.includes(1200) ? 1200 : widths.filter((w) => w < 1200).pop();
    progetti[slug].push({ src: `/img/lavori/${slug}/${stem}-${src1200}.jpg`, width, height, widths, drawing: false, unsplash: id });
    console.log(slug, k + 1, `${width}x${height}`);
  }
}

const f = path.join(ROOT, 'src/data/immagini.json');
const old = JSON.parse(fs.readFileSync(f, 'utf8'));
fs.writeFileSync(f, JSON.stringify({ _nota: 'Foto d\'esempio da Unsplash (scripts/foto-unsplash.mjs): sostituire con le foto dei lavori veri.', progetti, team: old.team }, null, 1) + '\n');
console.log('scritto src/data/immagini.json');
