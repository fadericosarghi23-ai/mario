# -*- coding: utf-8 -*-
"""
Genera il PDF di consegna di Impresa Edile Mario: palette, errori corretti, miglioramenti, stato deploy.
Quattro pagine A4, una per parte, con le pastiglie di colore vere accanto ai token.

    py -3 scripts/pdf-report.py

Font: Georgia e Segoe UI di Windows, i più vicini a Newsreader e Inter del sito.
Scrive docs/palette-e-interventi.pdf e una copia sul Desktop (Impresa-Edile-Mario-Report.pdf).
"""
import copy
import os
import shutil

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, KeepTogether, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

FONTS = "C:/Windows/Fonts/"
pdfmetrics.registerFont(TTFont("Geo", FONTS + "georgia.ttf"))
pdfmetrics.registerFont(TTFont("GeoIt", FONTS + "georgiai.ttf"))
pdfmetrics.registerFont(TTFont("Seg", FONTS + "segoeui.ttf"))
pdfmetrics.registerFont(TTFont("SegB", FONTS + "segoeuib.ttf"))
pdfmetrics.registerFontFamily("Seg", normal="Seg", bold="SegB", italic="Seg", boldItalic="SegB")
pdfmetrics.registerFontFamily("Geo", normal="Geo", bold="Geo", italic="GeoIt", boldItalic="GeoIt")

# palette del sito (src/styles/global.css)
NERO = colors.HexColor("#000000")
INK = colors.HexColor("#1a1a1a")
TESTO = colors.HexColor("#222222")
GRIGIO = colors.HexColor("#575757")
SABBIA = colors.HexColor("#f5f5f5")
LINEA = colors.HexColor("#d9d9d9")
ARANCIO = colors.HexColor("#e67e25")
ARANCIO_TESTO = colors.HexColor("#a55613")  # solo per il testo arancio su bianco del PDF (5.3:1)

QUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(QUI)
OUT = os.path.join(ROOT, "docs", "palette-e-interventi.pdf")
DESKTOP = os.path.join(os.path.dirname(os.path.dirname(ROOT)), "Impresa-Edile-Mario-Report.pdf")
TOTALE = [0]

H1 = ParagraphStyle("H1", fontName="Geo", fontSize=24, leading=28, textColor=INK, spaceAfter=3)
SOT = ParagraphStyle("SOT", fontName="Seg", fontSize=9.2, leading=13.4, textColor=GRIGIO, spaceAfter=6)
H2 = ParagraphStyle("H2", fontName="Geo", fontSize=17, leading=21, textColor=INK, spaceBefore=8, spaceAfter=4,
                    keepWithNext=1)
P = ParagraphStyle("P", fontName="Seg", fontSize=8.9, leading=12.6, textColor=TESTO, spaceAfter=4)
PM = ParagraphStyle("PM", parent=P, textColor=GRIGIO, fontSize=8.6, leading=12.2)
CELL = ParagraphStyle("CELL", parent=P, fontSize=8.2, leading=11, spaceAfter=0)
CELLB = ParagraphStyle("CELLB", parent=CELL, fontName="SegB")
NUM = ParagraphStyle("NUM", parent=CELL, fontName="Geo", fontSize=12, leading=12, textColor=ARANCIO_TESTO)


def marchio(c, x, y, h):
    """Il marchio provvisorio del sito: casa a tratto (riquadro 64) + nome, in bianco."""
    s = h / 64.0
    c.saveState()
    c.setStrokeColor(colors.white)
    c.setLineWidth(4 * s)
    c.setLineJoin(0)
    p = c.beginPath()
    for (a, b), (d, e) in [((6, 30), (32, 8)), ((32, 8), (58, 30))]:
        p.moveTo(x + a * s, y + (64 - b) * s)
        p.lineTo(x + d * s, y + (64 - e) * s)
    p.moveTo(x + 12 * s, y + (64 - 25) * s)
    for (a, b) in [(12, 58), (52, 58), (52, 25)]:
        p.lineTo(x + a * s, y + (64 - b) * s)
    p.moveTo(x + 26 * s, y + (64 - 58) * s)
    for (a, b) in [(26, 40), (38, 40), (38, 58)]:
        p.lineTo(x + a * s, y + (64 - b) * s)
    c.drawPath(p, stroke=1, fill=0)
    c.setFillColor(colors.white)
    c.setFont("Geo", 10.5)
    c.drawString(x + h + 2.2 * mm, y + h * 0.3, "Impresa Edile")
    w = pdfmetrics.stringWidth("Impresa Edile ", "Geo", 10.5)
    c.setFillColor(ARANCIO)
    c.setFont("GeoIt", 10.5)
    c.drawString(x + h + 2.2 * mm + w, y + h * 0.3, "Mario")
    c.restoreState()


def cornice(c, doc):
    c.saveState()
    c.setFillColor(NERO)
    c.rect(0, A4[1] - 15 * mm, A4[0], 15 * mm, stroke=0, fill=1)
    marchio(c, 18 * mm, A4[1] - 11.2 * mm, 7 * mm)
    c.setFont("Seg", 7.2)
    c.setFillColor(colors.HexColor("#d9d9d9"))
    c.drawRightString(A4[0] - 18 * mm, A4[1] - 9 * mm, "Palette, errori corretti e miglioramenti · BOZZA")
    c.setStrokeColor(LINEA)
    c.setLineWidth(0.5)
    c.line(18 * mm, 14 * mm, A4[0] - 18 * mm, 14 * mm)
    c.setFont("Seg", 7)
    c.setFillColor(GRIGIO)
    c.drawString(18 * mm, 10 * mm, "Sito Impresa Edile Mario · github.com/fadericosarghi23-ai/mario · dettagli in README.md")
    c.drawRightString(A4[0] - 18 * mm, 10 * mm,
                      "pagina %d di %d" % (doc.page, TOTALE[0]) if TOTALE[0] else "pagina %d" % doc.page)
    c.restoreState()


def tabella(dati, larghezze, extra=None):
    t = Table(dati, colWidths=larghezze, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 3.2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.2),
        ("LEFTPADDING", (0, 0), (-1, -1), 4.5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4.5),
        ("BACKGROUND", (0, 0), (-1, 0), SABBIA),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, LINEA),
    ] + (extra or [])))
    return t


def elenco(voci):
    righe = [[Paragraph("<b>#</b>", CELL), Paragraph("<b>che cosa · come è stato corretto</b>", CELL)]]
    for i, (tit, testo) in enumerate(voci, start=1):
        righe.append([Paragraph(str(i), NUM), Paragraph("<b>%s.</b> %s" % (tit, testo), CELL)])
    return tabella(righe, [9 * mm, 165 * mm])


story = []

# ================================================================= 1. palette
story.append(Paragraph("Palette, errori corretti e miglioramenti", H1))
story.append(Paragraph(
    "Sito nuovo dell'Impresa Edile Mario (titolare Shabanaj Erzen, via Fratelli Canepa 6/10, Savona), costruito "
    "sulla base svuotata e riempito con i soli dati della scheda Edilnet. È una <b>bozza dimostrativa</b>: lavori, "
    "foto, email, telefono e logo sono esempi, e il sito lo dice su ogni pagina. Quattro parti: da dove viene ogni "
    "colore, che cosa è stato sbagliato e corretto, che cosa offre in più della scheda Edilnet, e lo stato per il "
    "deploy su Netlify.", SOT))

story.append(Paragraph("1. La palette", H2))
story.append(Paragraph(
    "Tutti i colori stanno nel blocco <b>:root</b> di <b>src/styles/global.css</b>: cambiandoli lì cambia "
    "tutto il sito. L'impresa <b>non ha colori di marca pubblicati</b> (né sito né logo raggiungibili), quindi resta "
    "la palette di default della base: fondo bianco, testo e bottoni neri, grigi chiari, e un arancio usato solo come "
    "evidenza sui fondi scuri. I contrasti sono calcolati con la formula WCAG.", P))

PALETTE = [
    ("--accent", "#000000", "Bottoni, sopratitoli, fascia preventivo", "21:1 su bianco"),
    ("--accent-dark", "#333333", "Hover dei bottoni", "derivato dal nero"),
    ("--ink", "#1a1a1a", "Titoli, footer, sezione scura, intro", "17.4:1 col bianco"),
    ("--ink-2", "#262626", "Superfici scure secondarie", "derivato"),
    ("--text", "#222222", "Testo corrente", "15.9:1 su bianco"),
    ("--grey", "#575757", "Testo secondario, didascalie", "7.2:1 su bianco"),
    ("--sand", "#f5f5f5", "Sezioni chiare alternate", "fondo neutro"),
    ("--grey-light", "#ebebeb", "Fondo delle foto in caricamento", "derivato"),
    ("--accent-soft", "#ebebeb", "Anello di focus nei campi", "derivato"),
    ("--accent-on-dark", "#e67e25", "Evidenza sui fondi neri, «Mario» nel logo", "6.1:1 su --ink, 7.4:1 sul nero"),
    ("--line", "#0000001a", "Righe divisorie", "nero al 10%"),
    ("--white", "#ffffff", "Fondo pagina", "bianco"),
]
dati = [[Paragraph("<b>token</b>", CELL), "", Paragraph("<b>colore</b>", CELL),
         Paragraph("<b>ruolo</b>", CELL), Paragraph("<b>contrasto</b>", CELL)]]
stile = []
for i, (tok, hexv, ruolo, fonte) in enumerate(PALETTE, start=1):
    dati.append([Paragraph(tok, CELLB), "", Paragraph(hexv, CELL), Paragraph(ruolo, CELL), Paragraph(fonte, CELL)])
    sw = hexv[:7] if hexv != "#0000001a" else "#e6e6e6"
    stile += [("BACKGROUND", (1, i), (1, i), colors.HexColor(sw)), ("BOX", (1, i), (1, i), 0.4, LINEA)]
story.append(tabella(dati, [27 * mm, 10 * mm, 19 * mm, 60 * mm, 58 * mm], stile))
story.append(Spacer(1, 5))
story.append(Paragraph(
    "<b>Il giallo della bozza.</b> L'etichetta fissa \"Bozza dimostrativa\" e le note sui lavori usano un giallo "
    "avviso (#fff3cd, testo #5c4400, 8.3:1) che non fa parte della palette: sparisce con <b>bozza: false</b>. "
    "<b>Sull'arancio.</b> Su fondo bianco farebbe 2.8:1, non leggibile per il testo piccolo: per questo resta "
    "solo sui fondi scuri (corsivo dell'hero, «Mario» nel logo chiaro e nell'intro, link del footer).", PM))
story.append(Paragraph(
    "<b>Tipografia.</b> Quella della base: <b>Newsreader</b> per i titoli e <b>Inter</b> per il testo, ospitati "
    "sul sito. <b>Logo e icone provvisori.</b> L'impresa non ha un logo pubblicato: il marchio è una casa a tratto "
    "con il nome in serif, nei riquadri della base (882×182); favicon, icone e segno della fascia preventivo usano "
    "la stessa casa. Da sostituire col logo vero, se esiste. <b>Da validare</b> col cliente anche i colori.", PM))

# ================================================================= 2. errori
story.append(PageBreak())
story.append(Paragraph("2. Errori corretti", H2))
story.append(Paragraph(
    "Errori trovati durante il lavoro (nel riempimento, nella base o nei dati di partenza) e come sono stati "
    "sistemati.", PM))
ERRORI = [
    ("Due sedi nella base, una sola impresa",
     "La base mostra sempre una seconda sede (footer, menu, contatti, home, Chi siamo, dati strutturati): con una "
     "sola sede la build si sarebbe rotta. sede2 ora è vuota e i blocchi sono stati tolti dai template."),
    ("Immagini che non esistevano più",
     "Testate di Chi siamo, Servizi e Metodo puntavano a foto della base (es. la sesta foto di un progetto) che i "
     "lavori nuovi non hanno: errore in build. Ripuntate su foto esistenti."),
    ("Card Instagram senza profilo",
     "La pagina contatti leggeva il primo social: l'impresa non ne ha. Sostituita con la card Telefono / Dati "
     "aziendali, che si adatta ai dati presenti."),
    ("Logo tagliato",
     "Nella prima versione \"Mario\" usciva dal riquadro 882×182 e in header si leggeva \"Impresa Edile Ma\". "
     "Corpo del testo ridotto: il nome intero sta nel riquadro."),
    ("Varianti foto incomplete",
     "Lo script delle foto non scaricava la misura 2000 px in WebP e AVIF. Corretto: 32 foto × 5 misure × 3 "
     "formati, srcset completo."),
    ("Microcopy in inglese",
     "La base era in inglese: etichette accessibili, form, lightbox, filtri, avvisi e llms.txt. Tutto tradotto; "
     "lang=\"it\", og:locale it_IT, dati strutturati in italiano."),
    ("Segnaposto visibile nell'alt",
     "Il ritratto mancante aveva come testo alternativo \"DA COMPILARE: ...\", letto dagli screen reader. Ora: "
     "\"Foto di Shabanaj Erzen in arrivo\"."),
    ("\"0 € · Preventivo\" poco chiaro",
     "Il numero in home non diceva che il preventivo è gratuito. Ora: \"0 € · Costo del preventivo\"."),
    ("Mappa segnaposto",
     "La base mostrava un riquadro grigio. Coordinate di via Fratelli Canepa 6 da OpenStreetMap: mappa vera, "
     "caricata solo quando la sezione è visibile."),
    ("Dati finti non dichiarati",
     "Email e telefono di prova potevano sembrare veri. Ora sono evidentemente finti (bozza@example.com, "
     "000 000 0000), con l'etichetta Bozza su ogni pagina e il badge \"Esempio\" sui lavori."),
    ("Node 20 fuori supporto",
     "netlify.toml chiedeva Node 20, fuori supporto da aprile 2026. Portato a Node 22."),
    ("File locali nel repository",
     "La cartella .claude (percorsi del PC) e il riferimento alla cartella della base nel README sarebbero finiti "
     "su GitHub: esclusi."),
    ("Bottone verso la categoria sbagliata",
     "In Metodo il bottone sotto le 9 finiture portava ai lavori di facciata, ereditato dalla base. Ora porta a "
     "\"Pietra e finiture\", la categoria che mostra quelle lavorazioni."),
    ("Rete di collaboratori inventabile",
     "La base ha in Chi siamo un elenco di 12 collaboratori: l'impresa non ne pubblica. Al loro posto le 8 "
     "specializzazioni dichiarate, così nessun nome è inventato."),
    ("Lavori senza date né committenti",
     "La base prevede anno e committente per ogni lavoro: per esempi non reali sarebbero dati falsi. Le schede "
     "mostrano solo settore e tipo di intervento, e una nota dice che sono illustrative."),
]
story.append(elenco(ERRORI))

# ================================================================= 3. miglioramenti
story.append(PageBreak())
story.append(Paragraph("3. Miglioramenti rispetto alla scheda Edilnet", H2))
MIGLIORIE = [
    ("Un sito proprio",
     "Oggi l'impresa esiste online solo come scheda su un portale, accanto ad altre imprese, e il sito dichiarato "
     "(impresaedilemario.it) non risponde. Qui ha un sito suo, con preventivo diretto."),
    ("Servizi spiegati",
     "Le 8 specializzazioni della scheda diventano 6 servizi con descrizione, voci e lavori collegati, e le 9 "
     "pitture e finiture citate nella descrizione hanno una pagina."),
    ("Lavori per categoria",
     "Interni, esterni, pietra e finiture: card con filtri, scheda per ogni lavoro, galleria con lightbox "
     "(frecce, tastiera, swipe). Pronti a ricevere i lavori veri."),
    ("Sede e mappa",
     "Indirizzo completo, indicazioni stradali, mappa OpenStreetMap senza cookie di profilazione."),
    ("Foto veloci",
     "AVIF e WebP alle dimensioni giuste per ogni schermo, caricate solo quando servono."),
    ("Intro col logo",
     "All'apertura la casa del logo si disegna e il pannello sale sul sito; solo alla prima pagina, saltata con "
     "\"riduci animazioni\"."),
    ("SEO pronta",
     "Titoli e descrizioni per pagina, dati strutturati (impresa, sede, titolare, servizi, lavori), sitemap, "
     "llms.txt, Open Graph: si attivano togliendo la bozza."),
    ("Bozza con un interruttore",
     "bozza: true mette etichetta, note, noindex e robots bloccato; bozza: false li toglie tutti insieme."),
]
righe = [[Paragraph("<b>cosa</b>", CELL), Paragraph("<b>perché conta</b>", CELL)]]
for tit, testo in MIGLIORIE:
    righe.append([Paragraph("<b>%s</b>" % tit, CELL), Paragraph(testo, CELL)])
story.append(tabella(righe, [36 * mm, 138 * mm]))

story.append(Paragraph("Le pagine del sito", H2))
story.append(Paragraph("26 pagine in tutto. Testi in italiano, scritti solo sui dati della scheda; i lavori sono esempi.", PM))
PAGINE = [
    ("/", "Home", "carosello di 5 lavori, l'impresa con 4 numeri, 6 servizi, come lavoriamo, 6 lavori, per chi "
     "lavoriamo, il titolare, sede con mappa, fascia preventivo"),
    ("/studio/", "Chi siamo", "presentazione, 4 numeri, approccio in 3 punti, il titolare, le 8 specializzazioni, la sede"),
    ("/servizi/", "Servizi", "6 servizi a sezioni alternate, ognuno con foto, voci e 3 lavori collegati"),
    ("/metodo/", "Metodo", "come lavoriamo in 4 passi e le 9 pitture e finiture"),
    ("/progetti/", "Lavori", "12 lavori d'esempio con filtri; 3 pagine categoria; 12 schede con galleria"),
    ("/contatti/", "Contatti", "sede, zona di lavoro, email, telefono, mappa e modulo di richiesta preventivo"),
    ("legali", "Privacy, cookie", "informativa GDPR con i dati dell'impresa; nessun cookie di profilazione"),
    ("altre", "Mappa, grazie, 404", "mappa del sito, pagina di conferma del modulo, pagina non trovata"),
]
righe = [[Paragraph("<b>indirizzo</b>", CELL), Paragraph("<b>pagina</b>", CELL), Paragraph("<b>cosa contiene</b>", CELL)]]
for url, nome, cosa in PAGINE:
    righe.append([Paragraph(url, CELL), Paragraph("<b>%s</b>" % nome, CELL), Paragraph(cosa, CELL)])
story.append(tabella(righe, [24 * mm, 30 * mm, 120 * mm]))

# ================================================================= 4. stato
STATO = [
    ("Build", "verde: 26 pagine, anche da clone pulito con installazione da zero (come Netlify)", "ok"),
    ("Link e immagini", "3006 riferimenti interni e 123 import controllati con maiuscole esatte (Linux), 0 rotti", "ok"),
    ("Layout", "nessun elemento fuori schermo su 27 pagine a 375, 768 e 1280 px; animazioni verificate", "ok"),
    ("Netlify", "netlify.toml: build npm run build, cartella dist, Node 22, installazione senza lockfile", "ok"),
    ("GitHub", "push su fadericosarghi23-ai/mario, branch main", "ok"),
    ("Bozza", "etichetta su ogni pagina, noindex, robots.txt Disallow: / finché bozza è true", "per scelta"),
    ("Email e telefono", "esempi finti: servono i contatti veri (Edilnet non li pubblica)", "manca"),
    ("Form contatti", "scollegato: all'invio avvisa che il sito è in bozza, non parte nulla", "manca"),
    ("Lavori e foto", "12 lavori e 32 foto d'esempio (Unsplash): servono lavori e foto veri", "manca"),
    ("Titolare e logo", "ritratto in arrivo; logo provvisorio; ragione sociale esatta da visura", "manca"),
    ("Dominio", "impresaedilemario.it non risponde: canonical e sitemap puntano già lì", "manca"),
]
righe = [[Paragraph("<b>voce</b>", CELL), Paragraph("<b>stato</b>", CELL), Paragraph("<b>esito</b>", CELL)]]
for voce, stato, esito in STATO:
    col = "#2f6b3a" if esito == "ok" else ("#575757" if esito == "per scelta" else "#9b2c2c")
    righe.append([Paragraph("<b>%s</b>" % voce, CELL), Paragraph(stato, CELL),
                  Paragraph('<font color="%s"><b>%s</b></font>' % (col, esito), CELL)])
story.append(PageBreak())
story.append(KeepTogether([
    Paragraph("4. Stato per il deploy", H2),
    tabella(righe, [34 * mm, 120 * mm, 20 * mm]),
    Spacer(1, 5),
    Paragraph(
        "<b>Su Netlify.</b> Collegare il repository: build e cartella sono già in netlify.toml. L'indirizzo "
        "*.netlify.app funziona subito; finché c'è la bozza i motori non indicizzano. <b>Dominio.</b> Quando "
        "impresaedilemario.it sarà attivo, puntarlo a Netlify: canonical, sitemap e Open Graph lo usano già. "
        "<b>Form.</b> Per Netlify Forms basta form.netlify = true in src/data/site.ts. <b>Per pubblicare davvero:</b> "
        "contatti, lavori e foto veri, poi bozza: false.", PM),
]))

story.append(Paragraph("Cosa serve dall'impresa per togliere la bozza", H2))
SERVE = [
    ("Contatti", "email aziendale, telefono, orari; profili social se esistono"),
    ("Dati legali", "ragione sociale esatta dalla visura e PEC, per privacy e footer"),
    ("Lavori veri", "per ogni lavoro: titolo, zona, tipo di intervento, due righe di descrizione"),
    ("Foto", "2-5 foto per lavoro, anche da telefono purché nitide; meglio orizzontali, prima e dopo se ci sono"),
    ("Titolare", "una foto del titolare (o della squadra al lavoro) e conferma di nome e ruolo"),
    ("Marchio", "il logo, se esiste, e i colori; altrimenti approvazione del marchio provvisorio"),
    ("Modulo", "dove devono arrivare le richieste di preventivo (email o Netlify Forms)"),
    ("Dominio", "accesso al dominio impresaedilemario.it, o il dominio scelto"),
]
righe = [[Paragraph("<b>cosa</b>", CELL), Paragraph("<b>dettaglio</b>", CELL)]]
for tit, testo in SERVE:
    righe.append([Paragraph("<b>%s</b>" % tit, CELL), Paragraph(testo, CELL)])
story.append(tabella(righe, [30 * mm, 144 * mm]))


def costruisci(percorso, contenuto):
    d = BaseDocTemplate(percorso, pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                        topMargin=21 * mm, bottomMargin=18 * mm,
                        title="Impresa Edile Mario - palette, errori corretti e miglioramenti", author="BD Media")
    f = Frame(d.leftMargin, d.bottomMargin, d.width, d.height, id="corpo")
    d.addPageTemplates([PageTemplate(id="std", frames=[f], onPage=cornice)])
    d.build(copy.deepcopy(contenuto))
    return d.page


os.makedirs(os.path.dirname(OUT), exist_ok=True)
TOTALE[0] = costruisci(os.path.join(QUI, "_conteggio.pdf"), story)
costruisci(OUT, story)
os.remove(os.path.join(QUI, "_conteggio.pdf"))
shutil.copyfile(OUT, DESKTOP)
print("scritto", OUT, "e", DESKTOP, "-", TOTALE[0], "pagine")
