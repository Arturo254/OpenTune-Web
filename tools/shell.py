"""Piezas compartidas: <head>, formas M3E, nav, footer y scripts."""
import math

GA = """    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6JTGMLLK8S"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-6JTGMLLK8S');
    </script>"""

# Tema + flag de movimiento ANTES del primer pintado (evita flash y contenido oculto si falla el CDN)
BOOT = """    <script>
        (function () {
            var d = document.documentElement;
            try { if (localStorage.getItem('theme') === 'light') d.classList.add('light-mode'); } catch (e) {}
            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                d.classList.add('has-motion');
                setTimeout(function () { if (!window.__otMotion) d.classList.remove('has-motion'); }, 4500);
            }
        })();
    </script>"""

CDN = {
    "gsap": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
    "st": "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
    "lenis_js": "https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js",
    "lenis_css": "https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.css",
}


def head(t, page, base="", extra_title=None, with_marked=True):
    title = extra_title or t["title"]
    return f"""<head>
{GA}

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{t['desc']}">
    <meta name="theme-color" content="#141218">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{t['desc']}">
    <meta property="og:type" content="website">
    <title>{title}</title>

{BOOT}

    <!-- Tailwind CDN (tokens M3 en js/tailwind-config.js) -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script src="{base}js/tailwind-config.js"></script>

    <!-- Roboto Flex (ejes wdth/wght/opsz) + Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">

    <link rel="icon" href="{base}icon/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="{base}icon/icon-512.png">

    <link rel="stylesheet" href="{CDN['lenis_css']}">
    <link rel="stylesheet" href="{base}css/styles.css">
    <link rel="stylesheet" href="{base}css/redesign.css">
{'    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>' if with_marked else ''}
</head>"""


def _polar_path(fn, n=360):
    """Path normalizado (0..1) para clipPathUnits=objectBoundingBox."""
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        r = fn(a)
        pts.append((r * math.cos(a), r * math.sin(a)))
    m = max(max(abs(x), abs(y)) for x, y in pts)
    pts = [(0.5 + 0.5 * x / m, 0.5 + 0.5 * y / m) for x, y in pts]
    return "M" + " L".join(f"{x:.4f},{y:.4f}" for x, y in pts) + "Z"


def clip_defs():
    """Formas de M3 Expressive (cookie, clover, sunny) como clip-paths reutilizables."""
    cookie = _polar_path(lambda a: 1 + 0.055 * math.cos(9 * a))
    clover = _polar_path(lambda a: 1 + 0.2 * math.cos(4 * a))
    sunny = _polar_path(lambda a: 1 + 0.085 * math.copysign(abs(math.cos(4 * a)) ** 0.55, math.cos(4 * a)))
    return f"""    <!-- Formas M3 Expressive (clip-paths) -->
    <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
        <defs>
            <clipPath id="ot-cookie9" clipPathUnits="objectBoundingBox"><path d="{cookie}"/></clipPath>
            <clipPath id="ot-clover4" clipPathUnits="objectBoundingBox"><path d="{clover}"/></clipPath>
            <clipPath id="ot-sunny" clipPathUnits="objectBoundingBox"><path d="{sunny}"/></clipPath>
        </defs>
    </svg>"""


def cursor_and_bg(t):
    return f"""
    <a href="#features" class="sr-only" style="position:absolute;left:-9999px">{t['skip']}</a>
    <div class="ot-progress" aria-hidden="true"><span></span></div>
    <div data-cursor aria-hidden="true"><span data-cursor-label></span></div>
    <div class="ot-aurora" aria-hidden="true">
        <i class="ot-blob ot-blob--1"></i><i class="ot-blob ot-blob--2"></i><i class="ot-blob ot-blob--3"></i>
    </div>"""


def nav(t, home=True, base="", with_lang=True):
    pre = "" if home else f"{base}{t['file']}"
    link = lambda anchor, label: f'<a href="{pre}#{anchor}" class="ot-link">{label}</a>'
    lang_btn = (
        f"""
            <button id="languageSelector" type="button" class="ot-icon-btn ot-lang" aria-label="{t['nav_lang']}">
                <span class="material-symbols-outlined">language</span>
                <span id="languageText">{t['lang_code']}</span>
            </button>"""
        if with_lang else ""
    )
    return f"""
    <!-- ═══════════════════════ NAV ═══════════════════════ -->
    <div class="ot-nav-wrap">
        <nav class="ot-nav" aria-label="Principal">
            <a href="{base}{t['file']}" class="ot-brand" aria-label="OpenTune">
                <img id="logo" src="{base}icon/icon-512-maskable.png" alt="" width="34" height="34" onerror="this.style.display='none'">
                <span>OpenTune</span>
            </a>
            <div class="ot-links">
                <i class="ot-link-pill"></i>
                {link('features', t['nav_features'])}
                {link('screenshots', t['nav_shots'])}
                {link('downloads', t['nav_dl'])}
            </div>
            <button id="themeSelector" type="button" class="ot-icon-btn" aria-label="{t['nav_theme']}">
                <span id="themeIcon" class="material-symbols-outlined">light_mode</span>
            </button>{lang_btn}
            <a id="nav-download-btn" href="{pre}#downloads" class="ot-btn ot-btn--sm hidden sm:inline-flex">
                <span class="material-symbols-outlined" style="font-size:18px">download</span>{t['nav_btn']}
            </a>
        </nav>
    </div>"""


def footer_block(t, base=""):
    chips = [
        ("developer_mode", t["foot_dev"], "https://github.com/Arturo254/", True),
        ("code", t["foot_src"], "https://codeberg.org/Arturo254/OpenTune", True),
        ("description", t["foot_lic"], "https://raw.githubusercontent.com/Arturo254/OpenTune/master/LICENSE", True),
        ("phone", t["foot_contact"], "https://wa.me/5576847925", True),
        ("groups", t["foot_contrib"], t["contrib"] if not base else t["contrib"].replace("./", "../"), False),
        ("support", t["foot_support"], f"{base}from.html", False),
        ("policy", t["foot_privacy"], f"{base}PdP.html", False),
    ]
    out = "\n                    ".join(
        f'<a href="{href}"{" target=\"_blank\" rel=\"noopener noreferrer\"" if ext else ""} class="footer-chip">'
        f'<span class="material-symbols-outlined" style="font-size:16px">{icon}</span>{label}</a>'
        for icon, label, href, ext in chips
    )
    return f"""
    <!-- ═══════════════════════ FOOTER ═══════════════════════ -->
    <footer class="ot-footer">
        <div class="ot-container">
            <div class="ot-footer-top">
                <div>
                    <b style="font:800 22px/1 'Roboto Flex',sans-serif;letter-spacing:-0.03em">OpenTune</b>
                    <p style="color:var(--ot-on-var);margin-top:10px;font-size:14px">© 2024 <a href="https://github.com/Arturo254" style="color:var(--ot-primary)">Arturo.inc™</a>. {t['foot_rights']}</p>
                </div>
                <div class="flex flex-wrap gap-2 lg:justify-end">
                    {out}
                </div>
            </div>
            <div class="ot-footer-meta">
                <span>{t['foot_license']}</span>
                <span class="flex gap-5">
                    <a href="{base}{t['file']}#features">{t['nav_features']}</a>
                    <a href="{base}{t['file']}#downloads">{t['nav_dl']}</a>
                    <a href="https://codeberg.org/Arturo254/OpenTune" target="_blank" rel="noopener noreferrer">GitHub</a>
                </span>
            </div>
        </div>
        <span class="ot-wordmark" aria-hidden="true" data-parallax-layer data-parallax-speed="-0.04">OpenTune</span>
    </footer>"""


def tail_scripts(base="", app_js=True):
    app = f'    <script src="{base}script.js"></script>\n' if app_js else ""
    return f"""    <!-- Motion: GSAP + ScrollTrigger + Lenis (versiones fijadas) -->
    <script src="{CDN['gsap']}"></script>
    <script src="{CDN['st']}"></script>
    <script src="{CDN['lenis_js']}"></script>
{app}    <script src="{base}js/motion.js"></script>"""
