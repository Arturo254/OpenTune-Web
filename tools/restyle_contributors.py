#!/usr/bin/env python3
"""Aplica el shell del rediseño a las 3 páginas de contribuidores (idempotente).

Conserva su contenido y los IDs que usa script.js (#stats-*, #contributors-grid…),
arregla rutas rotas (`\\script.js`, `\\css\\styles.css`) y añade nav, fondo, footer y motion.
"""
import pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from shell import nav, footer_block, cursor_and_bg, clip_defs, BOOT, CDN  # noqa: E402
from i18n import STRINGS  # noqa: E402

FILES = {"contribuidores.html": "es"}  # EN/PT: ver build_contributors_static.py
B = "../"

for fname, lang in FILES.items():
    p = ROOT / "contribuidores" / fname
    s = p.read_text(encoding="utf8")
    if "ot-body" in s:
        print("= ya aplicado:", fname); continue
    t = STRINGS[lang]

    # ── head ──
    s = s.replace('<script src="\\script.js"></script>', "")
    s = s.replace('<link rel="stylesheet" href="\\css\\styles.css">',
        f'<link rel="stylesheet" href="{CDN["lenis_css"]}">\n  <link rel="stylesheet" href="{B}css/styles.css">\n  <link rel="stylesheet" href="{B}css/redesign.css">\n'
        '  <link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap" rel="stylesheet">')
    s = s.replace("<head>", "<head>\n" + BOOT, 1)

    # ── body ──
    s = re.sub(r'<body class="[^"]*"', '<body class="ot-body"', s, count=1)
    hdr = re.search(r"<header.*?</header>", s, re.S)
    shell_top = cursor_and_bg(t) + "\n" + clip_defs() + "\n" + nav(t, home=False, base=B, with_lang=False)
    s = s[:hdr.start()] + shell_top + s[hdr.end():]

    # espacio para la nav flotante + animación de secciones
    s = re.sub(r'<main class="([^"]*)"', lambda m: f'<main class="{m.group(1)} ot-page" style="padding-top:clamp(120px,16vh,160px);padding-bottom:120px"', s, count=1)
    s = re.sub(r'<h1 class="', '<h1 data-motion-text="words" class="ot-display ', s, count=1)
    main_start = s.index("<main")
    head_part, main_part = s[:main_start], s[main_start:]
    main_part = re.sub(r"<section(?![^>]*data-reveal)", '<section data-reveal="fade-up"', main_part)
    s = head_part + main_part

    # ── cola ──
    tail = (f"\n{footer_block(t, base=B)}\n"
            f'  <script src="{CDN["gsap"]}"></script>\n  <script src="{CDN["st"]}"></script>\n  <script src="{CDN["lenis_js"]}"></script>\n'
            f'  <script src="{B}script.js"></script>\n  <script src="{B}js/motion.js"></script>\n')
    s = s.replace("</body>", tail + "</body>")
    p.write_text(s, encoding="utf8")
    print("✓", fname)
