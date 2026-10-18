/**
 * Marchio PROVVISORIO di Impresa Edile Mario (l'impresa non ha un logo pubblicato):
 * casa a tratto + nome, nei riquadri della base. [[DA VALIDARE: sostituire con il logo vero, se esiste]]
 *
 *   node scripts/marchio.mjs
 *
 * Scrive: public/img/logo/logo.svg e logo-light.svg (882×182), favicon.svg, favicon.ico (32),
 * apple-touch-icon.png (180), icon-192.png, icon-512.png, img/og/og-default.jpg (1200×630, foto Unsplash).
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = (rel, data) => {
  const f = path.join(PUB, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, data);
  console.log('scritto', rel);
};

// Casa a tratto nel riquadro 64×64 (stessa del segno della fascia CTA)
const CASA = 'M6 30 32 8l26 22M12 25v33h40V25M26 58V40h12v18';

const logo = (fg, accent) => `<svg xmlns="http://www.w3.org/2000/svg" width="882" height="182" viewBox="0 0 882 182">
<g transform="translate(8 27) scale(2)" fill="none" stroke="${fg}" stroke-width="4" stroke-linejoin="miter"><path d="${CASA}"/></g>
<g font-family="Georgia, 'Times New Roman', serif" fill="${fg}">
<text x="168" y="108" font-size="66" letter-spacing="0">Impresa Edile <tspan fill="${accent}" font-style="italic">Mario</tspan></text>
</g>
<text x="171" y="152" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="6" fill="${fg}" opacity=".7">SAVONA · RISTRUTTURAZIONI</text>
</svg>
`;
out('img/logo/logo.svg', logo('#1a1a1a', '#1a1a1a'));
out('img/logo/logo-light.svg', logo('#ffffff', '#e67e25'));
out('favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#000"/><path d="${CASA}" fill="none" stroke="#fff" stroke-width="5" transform="translate(4 2) scale(.875)"/></svg>
`);

// ── PNG: casa bianca su nero, disegnata a segmenti ──
const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (buf) => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
const SEG = [[6, 30, 32, 8], [32, 8, 58, 30], [12, 25, 12, 58], [12, 58, 52, 58], [52, 58, 52, 25], [26, 58, 26, 40], [26, 40, 38, 40], [38, 40, 38, 58]];
function dist(px, py, [x1, y1, x2, y2]) {
  const dx = x2 - x1, dy = y2 - y1; const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}
function png(s) {
  const raw = Buffer.alloc((s * 3 + 1) * s);
  const k = 64 / s, pad = 0.12, sc = (1 - 2 * pad);
  for (let y = 0; y < s; y++) {
    raw[y * (s * 3 + 1)] = 0;
    for (let x = 0; x < s; x++) {
      // coordinate nel riquadro 64 con margine
      const u = ((x + 0.5) * k - 64 * pad) / sc, v = ((y + 0.5) * k - 64 * pad) / sc;
      const d = Math.min(...SEG.map((sg) => dist(u, v, sg)));
      const a = Math.max(0, Math.min(1, 3.2 - d)); // tratto ~5 unità con bordo morbido
      const c = Math.round(255 * a);
      const o = y * (s * 3 + 1) + 1 + x * 3; raw[o] = c; raw[o + 1] = c; raw[o + 2] = c;
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(s, 0); ihdr.writeUInt32BE(s, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
function ico(p, s) {
  const h = Buffer.alloc(22); h.writeUInt16LE(0, 0); h.writeUInt16LE(1, 2); h.writeUInt16LE(1, 4); h[6] = s; h[7] = s;
  h.writeUInt16LE(1, 10); h.writeUInt16LE(32, 12); h.writeUInt32LE(p.length, 14); h.writeUInt32LE(22, 18);
  return Buffer.concat([h, p]);
}
out('favicon.ico', ico(png(32), 32));
out('apple-touch-icon.png', png(180));
out('icon-192.png', png(192));
out('icon-512.png', png(512));

// Immagine di condivisione: copertina del lavoro "appartamento ristrutturato", 1200×630
const r = await fetch('https://images.unsplash.com/photo-1656122381069-9ec666d95cf1?w=1200&h=630&fit=crop&crop=entropy&fm=jpg&q=80');
if (!r.ok) throw new Error('OG non scaricata');
out('img/og/og-default.jpg', Buffer.from(await r.arrayBuffer()));
