#!/usr/bin/env python3
"""Genera PdP.html, from.html, beta.html y 404.html con el shell del rediseño.

Uso: python3 tools/build_secondary.py
El texto legal de PdP.html se lee del propio archivo (primera ejecución) y se
guarda en tools/pdp_content.json para no depender del HTML antiguo.
"""
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from shell import head, clip_defs, nav, footer_block, cursor_and_bg, CDN  # noqa: E402
from i18n import STRINGS  # noqa: E402

t = dict(STRINGS["es"])
FEATHER = {"database": "database", "activity": "monitoring", "share-2": "share", "shield": "shield",
           "cookie": "cookie", "refresh-cw": "autorenew", "mail": "mail"}

def scripts(extra=""):
    return f"""    <script src="{CDN['gsap']}"></script>
    <script src="{CDN['st']}"></script>
    <script src="{CDN['lenis_js']}"></script>
    <script src="js/theme.js"></script>
    <script src="js/motion.js"></script>{extra}"""

def page(title, body, extra_head_title=None):
    t2 = dict(t); t2["title"] = title
    return f"""<!DOCTYPE html>
<html lang="es">
{head(t2, 'x', with_marked=False)}
<body class="ot-body">
{cursor_and_bg(t)}
{clip_defs()}
{nav(t, home=False, with_lang=False)}
{body}
{footer_block(t)}
{scripts()}
</body>
</html>
"""

# ───────── PdP ─────────
pdp_json = ROOT / "tools" / "pdp_content.json"
if not pdp_json.exists():
    src = (ROOT / "PdP.html").read_text(encoding="utf8")
    secs = re.findall(r'<section id="([^"]+)".*?<i data-feather="([^"]+)".*?</i>\s*(.*?)\s*</h2>\s*(.*?)</section>', src, re.S)
    out = []
    for sid, ic, title, body in secs:
        paras = [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", p)).strip() for p in re.findall(r"<p[^>]*>(.*?)</p>", body, re.S)]
        out.append({"id": sid, "icon": FEATHER.get(ic, "info"), "title": title, "paras": paras})
    pdp_json.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf8")
secs = json.loads(pdp_json.read_text(encoding="utf8"))

toc = "".join(f'<a href="#{s["id"]}" class="ot-chip" style="text-decoration:none"><span class="material-symbols-outlined">{s["icon"]}</span>{re.sub(r"^[0-9]+\. ", "", s["title"])}</a>' for s in secs)
cards = "".join(f"""
            <section id="{s['id']}" class="ot-panel" data-reveal="fade-up" style="scroll-margin-top:110px">
                <h2 style="display:flex;align-items:center;gap:12px"><span class="ot-shape-ico sh-{['cookie','clover','sunny'][i%3]}" style="width:44px;height:44px"><span class="material-symbols-outlined" style="font-size:22px">{s['icon']}</span></span>{s['title']}</h2>
                {''.join(f'<p>{p}</p>' for p in s['paras'])}
            </section>""" for i, s in enumerate(secs))

pdp = page("Política de Privacidad — OpenTune", f"""
    <main class="ot-page">
        <div class="ot-container" style="max-width:860px">
            <header class="ot-page-hero">
                <span class="ot-eyebrow"><span class="material-symbols-outlined">shield</span>Privacidad</span>
                <h1 class="ot-display" data-motion-text="words">Política de Privacidad de OpenTune</h1>
                <div class="ot-hero-meta">{toc}</div>
            </header>
            <div style="display:grid;gap:14px">{cards}
                <div class="ot-support" data-reveal="scale" style="margin-top:14px">
                    <h2 class="ot-h2">¿Tiene alguna pregunta?</h2>
                    <p class="ot-lead">Estamos aquí para ayudar. Contáctenos si necesita más información.</p>
                    <a href="https://wa.me/5576847925" class="ot-btn ot-btn--invert"><span class="material-symbols-outlined">send</span>Contáctenos</a>
                </div>
            </div>
        </div>
    </main>""")
(ROOT / "PdP.html").write_text(pdp, encoding="utf8")

# ───────── Soporte (from) ─────────
def type_card(checked, icon, tone, title, sub, val):
    return f"""
                        <label class="ot-type">
                            <input {'checked' if checked else ''} class="sr-only peer" name="message_type" value="{val}" type="radio">
                            <span class="ot-type-card">
                                <span class="ot-shape-ico sh-{tone}" style="width:52px;height:52px"><span class="material-symbols-outlined" style="font-size:24px">{icon}</span></span>
                                <b>{title}</b><small>{sub}</small>
                            </span>
                        </label>"""

def field(icon, label, inner):
    return f"""
                    <div class="ot-field"><label>{label}</label><div class="ot-input"><span class="material-symbols-outlined">{icon}</span>{inner}</div></div>"""

from_page = page("Soporte — OpenTune", f"""
    <main class="ot-page">
        <div class="ot-container" style="max-width:880px">
            <header class="ot-page-hero">
                <span class="ot-eyebrow"><span class="material-symbols-outlined">support_agent</span>Soporte</span>
                <h1 class="ot-display" data-motion-text="words">Enviar comentario</h1>
                <p class="ot-lead">Envía tu problema o describe tu solicitud</p>
            </header>
            <div class="ot-panel" data-reveal="scale">
                <form class="ot-form" action="#" method="post">
                    {field('person', 'Tu nombre', '<input placeholder="Escribe tu nombre aquí" type="text" name="name" autocomplete="name">')}
                    <div class="ot-field"><label>¿Qué quieres decirnos?</label>
                        <div class="ot-types">{type_card(True,'comment','cookie','Comentario','Comparte tu opinión o experiencia','comment')}{type_card(False,'request_quote','clover','Solicitud','Solicita una nueva función','request')}{type_card(False,'bug_report','sunny','Reporte','Reporta un problema o error','report')}
                        </div>
                    </div>
                    <div class="ot-field"><label>Descripción</label><textarea class="ot-textarea" rows="5" name="message" placeholder="Cuéntanos más detalles..."></textarea></div>
                    {field('alternate_email', 'Tu correo (para respuesta privada)', '<input placeholder="email@ejemplo.com" type="email" name="email" autocomplete="email">')}
                    <button class="ot-btn" type="submit"><span>Enviar mensaje</span><span class="material-symbols-outlined">send</span></button>
                </form>
            </div>
            <div class="ot-bento" style="margin-top:14px" data-reveal-group>
                <article class="ot-card s6 t-secondary" data-reveal-item data-spotlight style="min-height:0"><div class="ot-shape-ico sh-cookie"><span class="material-symbols-outlined">verified_user</span></div><div><h3>Privacidad asegurada</h3><p>Tus datos están protegidos y solo se usarán para contactarte sobre tu reporte.</p></div></article>
                <article class="ot-card s6" data-reveal-item data-spotlight style="min-height:0"><div class="ot-shape-ico sh-clover"><span class="material-symbols-outlined">schedule</span></div><div><h3>Tiempo de respuesta</h3><p>Normalmente respondemos en más de 24 horas debido a la alta demanda de solicitudes.</p></div></article>
            </div>
        </div>
    </main>""")
(ROOT / "from.html").write_text(from_page, encoding="utf8")

# ───────── Beta ─────────
beta = page("Programa Beta — OpenTune", """
    <main class="ot-page ot-center" style="padding-top:120px">
        <div class="ot-container" style="max-width:720px">
            <div class="ot-oss" data-reveal="scale" style="grid-template-columns:1fr;text-align:left">
                <i class="ot-oss-bg" aria-hidden="true"></i>
                <div>
                    <span class="ot-eyebrow"><span class="material-symbols-outlined">science</span>Beta</span>
                    <h1 class="ot-h2" data-motion-text="words" style="margin:22px 0">Descarga la versión beta privada</h1>
                    <p class="ot-lead">Puedes apuntarte a la lista de espera para ser aceptado y así probar las nuevas funciones antes que nadie.</p>
                    <div class="ot-hero-cta">
                        <a href="https://forms.gle/USM2bWy6gQjFtL5m9" class="ot-btn ot-btn--invert"><span class="material-symbols-outlined">arrow_forward</span>Lista de espera</a>
                        <a href="./index.html" class="ot-btn ot-btn--outline" style="--btn-fg:var(--ot-on-tc);box-shadow:inset 0 0 0 1.5px currentColor"><span class="material-symbols-outlined">home</span>Inicio</a>
                    </div>
                </div>
            </div>
        </div>
    </main>""")
(ROOT / "beta.html").write_text(beta, encoding="utf8")

# ───────── 404 ─────────
nf = page("404 — OpenTune", """
    <main class="ot-center">
        <div data-reveal="scale">
            <h1 class="ot-display ot-404" aria-label="404">404</h1>
            <p class="ot-lead" style="margin:0 auto 32px">Ups, esa página no existe. Pero la música sigue sonando.</p>
            <a href="./index.html" class="ot-btn ot-btn--glow"><span class="material-symbols-outlined">home</span>Ir al inicio</a>
        </div>
    </main>""")
(ROOT / "404.html").write_text(nf, encoding="utf8")
print("✓ PdP.html from.html beta.html 404.html")
