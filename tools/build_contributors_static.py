#!/usr/bin/env python3
"""Genera contribuidores/contribuidores -en.html y contribuidores-Pr_Br.html (estáticas) con el nuevo shell.
La versión ES (contribuidores.html) es dinámica (API de Codeberg) y se trata con restyle_contributors.py."""
import pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from shell import head, clip_defs, nav, footer_block, cursor_and_bg, CDN  # noqa: E402
from i18n import STRINGS  # noqa: E402
B = "../"

DATA = {
  "en": dict(file="contribuidores -en.html", title="Contributors — OpenTune", chip="Open Source", h1="Contributors",
             sub="The people who make OpenTune possible", gh="GitHub", contact="Contact", web="Website",
             cta_t="Want to contribute?", cta_p="Fork the repository and submit a pull request. All contributions are welcome!", cta_b="Fork Repository",
             people=[("Arturo Cervantes","Lead Developer","engineering","Lead Dev","87346871","Arturo254",("chat","Contact","https://wa.me/5576847925")),
                     ("Fabiano Júnior","Portuguese (BR) Translator","translate","Translation BR","138934847","Fabito02",("chat","Contact","https://wa.me/3388139377")),
                     ("Imgbot","Image Optimization","image","Bot","31427850","ImgBotApp",("open_in_new","Website","https://imgbot.net"))]),
  "pt": dict(file="contribuidores-Pr_Br.html", title="Colaboradores — OpenTune", chip="Código aberto", h1="Colaboradores",
             sub="As pessoas que tornam o OpenTune possível", gh="GitHub", contact="Contato", web="Site",
             cta_t="Quer contribuir?", cta_p="Faça um fork do repositório e envie seu pull request. Toda ajuda é bem-vinda!", cta_b="Fazer Fork",
             people=[("Arturo Cervantes","Desenvolvedor Principal","engineering","Dev Principal","87346871","Arturo254",("chat","Contato","https://wa.me/5576847925")),
                     ("Fabiano Júnior","Tradutor para o Português (BR)","translate","Tradução BR","138934847","Fabito02",("chat","Contato","https://wa.me/3388139377")),
                     ("Imgbot","Otimização de Imagens","image","Bot","31427850","ImgBotApp",("open_in_new","Site","https://imgbot.net")),
                     ("รiłѵα'.ぁ™","Tradução e correções para o Português (BR)","edit","Correções BR","111314382","avlis84",("send","Telegram","https://t.me/twappletalk"))]),
}
SHAPES = ["cookie", "clover", "sunny", "pebble"]

for lang, d in DATA.items():
    t = dict(STRINGS[lang]); t["title"] = d["title"]
    cards = "".join(f"""
                <article class="ot-card s4 {['t-primary','','t-secondary','t-tertiary'][i%4]}" data-reveal-item data-spotlight style="min-height:0;gap:28px">
                    <div style="display:flex;align-items:center;gap:16px">
                        <span class="ot-avatar-ring sh-{SHAPES[i%4]}"><img src="https://avatars.githubusercontent.com/u/{uid}?v=4" alt="{name}" width="72" height="72" loading="lazy"></span>
                        <div><h3 style="margin:0">{name}</h3><p style="margin-top:4px">{role}</p></div>
                    </div>
                    <div>
                        <span class="ot-chip" style="color:inherit;border-color:currentColor;opacity:.85"><span class="material-symbols-outlined">{icon}</span>{chip}</span>
                        <div class="ot-hero-cta" style="margin-top:16px">
                            <a href="https://github.com/{gh}" class="ot-btn ot-btn--sm ot-btn--invert" target="_blank" rel="noopener"><span class="material-symbols-outlined">code</span>{d['gh']}</a>
                            <a href="{url}" class="ot-btn ot-btn--sm ot-btn--tonal" target="_blank" rel="noopener"><span class="material-symbols-outlined">{ic2}</span>{lab2}</a>
                        </div>
                    </div>
                </article>""" for i, (name, role, icon, chip, uid, gh, (ic2, lab2, url)) in enumerate(d["people"]))
    html = f"""<!DOCTYPE html>
<html lang="{t['html_lang']}">
{head(t, 'x', base=B, with_marked=False)}
<body class="ot-body">
{cursor_and_bg(t)}
{clip_defs()}
{nav(t, home=False, base=B, with_lang=False)}
    <main class="ot-page">
        <div class="ot-container">
            <header class="ot-page-hero">
                <span class="ot-eyebrow"><span class="material-symbols-outlined">groups</span>{d['chip']}</span>
                <h1 class="ot-display" data-motion-text="words">{d['h1']}</h1>
                <p class="ot-lead">{d['sub']}</p>
            </header>
            <div class="ot-bento" data-reveal-group>{cards}
            </div>
            <div class="ot-support" data-reveal="scale" style="margin-top:14px">
                <div class="ot-shape-ico sh-cookie"><span class="material-symbols-outlined">fork_right</span></div>
                <h2 class="ot-h2">{d['cta_t']}</h2>
                <p class="ot-lead">{d['cta_p']}</p>
                <a href="https://codeberg.org/Arturo254/OpenTune/fork" class="ot-btn ot-btn--invert" target="_blank" rel="noopener"><span class="material-symbols-outlined">add</span>{d['cta_b']}</a>
            </div>
        </div>
    </main>
{footer_block(t, base=B)}
    <script src="{CDN['gsap']}"></script>
    <script src="{CDN['st']}"></script>
    <script src="{CDN['lenis_js']}"></script>
    <script src="{B}js/theme.js"></script>
    <script src="{B}js/motion.js"></script>
</body>
</html>
"""
    (ROOT / "contribuidores" / d["file"]).write_text(html, encoding="utf8")
    print("✓", d["file"])
