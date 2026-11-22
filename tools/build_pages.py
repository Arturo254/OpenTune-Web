#!/usr/bin/env python3
"""
Genera index.html (ES), en.html (EN) y pt_BR.html (PT) desde una sola plantilla.

Uso:   python3 tools/build_pages.py
Salida: ../index.html ../en.html ../pt_BR.html

Por qué un generador: las tres landings compartían ~90 % del HTML y se habían
desincronizado (EN/PT aún tenían la tarjeta de Windows deshabilitada y sin los
componentes M3E). Editar aquí garantiza que las tres evolucionen juntas.
Todos los IDs que usa script.js se conservan tal cual.
"""
import math
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from shell import head, clip_defs, nav, footer_block, tail_scripts, cursor_and_bg, GA  # noqa: E402
from i18n import STRINGS  # noqa: E402


def esc(s: str) -> str:
    return s


def feature_cards(t: dict) -> str:
    layout = [
        ("music_note", "cookie", "primary", 7),
        ("palette", "clover", "", 5),
        ("settings", "sunny", "secondary", 4),
        ("search", "pebble", "", 4),
        ("volume_up", "cookie", "tertiary", 4),
        ("playlist_add", "gem", "", 5),
        ("sync", "cookie", "primary", 7),
        ("build", "clover", "tertiary", 4),
        ("folder", "sunny", "", 4),
        ("translate", "pebble", "secondary", 4),
        ("update", "cookie", "", 6),
        ("headphones", "clover", "secondary", 6),
    ]
    out = []
    for i, ((icon, shape, tone, span), (title, desc)) in enumerate(zip(layout, t["features"]), 1):
        tone_cls = f" t-{tone}" if tone else ""
        out.append(f"""
                <article class="ot-card s{span}{tone_cls}" data-reveal-item data-spotlight>
                    <span class="ot-card-num" aria-hidden="true">{i:02d}</span>
                    <div class="ot-shape-ico sh-{shape}"><span class="material-symbols-outlined">{icon}</span></div>
                    <div>
                        <h3>{title}</h3>
                        <p>{desc}</p>
                    </div>
                </article>""")
    return "".join(out)


def marquee(t: dict) -> str:
    group = "".join(
        f'<span class="ot-marquee-item"><i class="ot-dot"></i>{w}</span>' for w in t["marquee"]
    )
    # dos grupos idénticos → loop sin saltos con xPercent: -50
    return f"""
        <div class="ot-marquee" data-marquee aria-hidden="true">
            <div class="ot-marquee-track">
                <div class="ot-marquee-group">{group}</div>
                <div class="ot-marquee-group">{group}</div>
            </div>
        </div>"""


def stats(t: dict) -> str:
    items = []
    for kind, value, label in t["stats"]:
        if kind == "count":
            to, dec, suf = value
            items.append(
                f'<div class="ot-stat" data-reveal-item><b data-count-to="{to}" data-count-decimals="{dec}" '
                f'data-count-suffix="{suf}">{float(to):.{dec}f}{suf}</b><span>{label}</span></div>'
            )
    return "\n            ".join(items)


def build(lang_key: str) -> str:
    t = STRINGS[lang_key]
    page = t["file"]

    return f"""<!DOCTYPE html>
<html id="app-root" lang="{t['html_lang']}">

{head(t, page)}

<body class="ot-body" style="font-optical-sizing:auto">
{cursor_and_bg(t)}
{clip_defs()}

    <!-- ═══════════════════════ DIALOGS ═══════════════════════ -->

    <dialog id="language-dialog" class="glass-dialog">
        <div class="dialog-header">
            <h2 class="font-title-lg text-on-surface">{t['dlg_lang_title']}</h2>
            <button class="dialog-icon-btn" onclick="document.getElementById('language-dialog').close()" aria-label="{t['close']}">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="dialog-content">
            <div class="flex flex-col gap-1">
                <a href="index.html" class="dialog-list-item">
                    <img src="https://flagicons.lipis.dev/flags/4x3/es.svg" alt="ES" class="flag-icon">
                    <span class="font-body-lg">Español</span>
                </a>
                <a href="en.html" class="dialog-list-item">
                    <img src="https://flagicons.lipis.dev/flags/4x3/us.svg" alt="EN" class="flag-icon">
                    <span class="font-body-lg">English</span>
                </a>
                <a href="pt_BR.html" class="dialog-list-item">
                    <img src="https://flagicons.lipis.dev/flags/4x3/br.svg" alt="PT" class="flag-icon">
                    <span class="font-body-lg">Português</span>
                </a>
            </div>
        </div>
    </dialog>

    <dialog id="warning-dialog" class="glass-dialog">
        <div class="dialog-header">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-secondary" style="font-size:20px">warning</span>
                </div>
                <h2 class="font-title-lg">{t['dlg_warn_title']}</h2>
            </div>
        </div>
        <div class="dialog-content">
            <p class="font-body-lg" style="color:var(--ot-on-var)">{t['dlg_warn_body']}</p>
        </div>
        <div class="dialog-actions">
            <button id="dismissBtn" class="dialog-text-btn">{t['cancel']}</button>
            <button id="proceedBtn" class="dialog-filled-btn">{t['continue']}</button>
        </div>
    </dialog>

{nav(t, home=True)}

    <!-- ═══════════════════════ MAIN ═══════════════════════ -->
    <main>

        <!-- ─── HERO ─── -->
        <section class="ot-hero" data-hero-root data-mouse-parallax>
            <div class="ot-container ot-hero-grid">
                <div>
                    <span class="ot-eyebrow" data-hero-copy><span class="material-symbols-outlined">code</span>Dev By Arthur Dev Studio</span>

                    <h1 class="ot-display" data-motion-text="chars" data-hero-title><span class="ot-line">Open</span><span class="ot-line ot-accent">Tune</span></h1>

                    <p class="ot-lead" data-hero-copy>{t['hero_tagline']}</p>

                    <div class="ot-hero-cta">
                        <span class="ot-mag" data-magnetic="0.2" data-hero-cta data-cursor-label="{t['cur_get']}">
                            <a id="hero-download-btn" href="#downloads" class="ot-btn ot-btn--glow">
                                <span class="material-symbols-outlined">download</span>{t['hero_dl']}
                            </a>
                        </span>
                        <span class="ot-mag" data-magnetic="0.2" data-hero-cta>
                            <button id="hero-demo-btn" type="button" class="ot-btn ot-btn--tonal"
                                onclick="document.getElementById('warning-dialog').showModal()">
                                <span class="material-symbols-outlined">play_circle</span>{t['hero_demo']}
                            </button>
                        </span>
                    </div>

                    <div class="ot-hero-meta" data-hero-copy>
                        <span class="ot-chip"><span class="material-symbols-outlined">android</span>Android 8.0+</span>
                        <span class="ot-chip"><span class="material-symbols-outlined">lock_open</span>GPL-3.0</span>
                        <span class="ot-chip"><span class="material-symbols-outlined">translate</span>ES · EN · PT</span>
                    </div>
                </div>

                <div class="ot-stage" data-parallax-layer data-parallax-speed="0.06">
                    <div class="ot-stage-ring" data-hero-shape data-mouse-depth="0.02"></div>
                    <div class="ot-stage-shape" data-hero-shape data-mouse-depth="0.035"></div>
                    <div class="ot-stage-shape-2" data-hero-shape data-mouse-depth="0.08"></div>
                    <div class="ot-stage-shape-3" data-hero-shape data-mouse-depth="0.1"></div>
                    <div class="ot-stage-imgwrap" data-mouse-depth="0.025">
                        <img data-hero-img class="ot-stage-img" src="./img/mock.webp" width="1920" height="1440" alt="{t['hero_img_alt']}" fetchpriority="high">
                    </div>
                    <div class="ot-float ot-float--np" data-hero-float data-mouse-depth="0.06">
                        <div class="ot-float-in">
                            <span class="ot-float-ico"><span class="ot-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></span>
                            <span>{t['np_label']}<small>Fighting For Us · Hillsong Worship</small></span>
                        </div>
                    </div>
                    <div class="ot-float ot-float--ver" data-hero-float data-mouse-depth="0.09">
                        <div class="ot-float-in">
                            <span class="ot-float-ico" style="background:var(--ot-tertiary);color:var(--ot-tc)"><span class="material-symbols-outlined">palette</span></span>
                            <span>Material 3 Expressive<small>{t['float_ver']}</small></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ot-scroll-hint" aria-hidden="true"><span>{t['scroll']}</span><i></i></div>
        </section>
{marquee(t)}

        <!-- ─── STATS ─── -->
        <section class="ot-section" style="padding-block:clamp(56px,8vw,104px) 0">
            <div class="ot-container">
                <div class="ot-stats" data-reveal-group>
            {stats(t)}
                </div>
            </div>
        </section>

        <!-- ─── FEATURES ─── -->
        <section id="features" class="ot-section">
            <div class="ot-container">
                <div class="ot-sec-head">
                    <h2 class="ot-h2" data-motion-text="words">{t['feat_title']}</h2>
                    <p class="ot-lead" data-reveal="fade-up">{t['feat_sub']}</p>
                </div>
                <div class="ot-bento" data-reveal-group>{feature_cards(t)}
                </div>
            </div>
        </section>

        <!-- ─── OPEN SOURCE ─── -->
        <section class="ot-section" style="padding-top:0">
            <div class="ot-container">
                <div class="ot-oss" data-reveal="scale">
                    <i class="ot-oss-bg" data-parallax-layer data-parallax-speed="0.1" aria-hidden="true"></i>
                    <div>
                        <span class="ot-eyebrow">{t['oss_chip']}</span>
                        <h2 class="ot-h2" data-motion-text="words">{t['oss_title']}</h2>
                        <p class="ot-lead">{t['oss_body']}</p>
                        <div class="ot-hero-cta">
                            <a href="https://codeberg.org/Arturo254/OpenTune" target="_blank" rel="noopener noreferrer" class="ot-btn ot-btn--invert" data-cursor-label="{t['cur_star']}">
                                <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1,'wght' 500">star</span>{t['oss_star']}
                            </a>
                            <span class="ot-chip">GPL-3.0</span>
                        </div>
                    </div>
                    <div class="ot-people">
                        <div class="ot-person">
                            <img src="https://avatars.githubusercontent.com/u/87346871?v=4" alt="" width="52" height="52" loading="lazy">
                            <div>
                                <b><span class="material-symbols-outlined" style="color:var(--ot-primary)">verified</span>Arturo254</b>
                                <small>{t['oss_lead']}</small>
                            </div>
                        </div>
                        <div class="ot-person">
                            <span class="ot-avatar"><span class="material-symbols-outlined">new_releases</span></span>
                            <div>
                                <b>{t['oss_latest']}</b>
                                <small id="oss-version-badge">{t['loading']}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─── SCREENSHOTS ─── -->
        <section id="screenshots" class="ot-section" style="padding-top:0">
            <div class="ot-container">
                <div class="ot-shots-head" id="screenshots-header">
                    <div>
                        <h2 class="ot-h2" data-motion-text="words">{t['shots_title']}</h2>
                        <p class="ot-lead" style="margin-top:16px" data-reveal="fade-up">{t['shots_sub']}</p>
                    </div>
                    <button id="screenshots-toggle" type="button" aria-label="{t['shots_toggle']}">
                        <span id="screenshots-icon" class="material-symbols-outlined rotated">expand_more</span>
                    </button>
                </div>

                <div id="screenshots-content" class="transition-all duration-300 ease-in-out overflow-hidden max-h-[2400px]">
                    <div class="screenshots-shell rounded-xl p-5 md:p-8 lg:p-10" data-reveal="scale">
                        <div class="screenshots-carousel-layout">
                            <div class="screenshots-hero-panel">
                                <div class="flex flex-wrap items-start justify-between gap-4 mb-8">
                                    <div class="max-w-2xl">
                                        <span class="screenshots-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                                            <span class="material-symbols-outlined text-[18px]">photo_library</span>Material 3 Expressive
                                        </span>
                                        <h3 id="screenshots-title" class="font-headline-md text-headline-md mt-5">{t['slides'][0][0]}</h3>
                                        <p id="screenshots-description" class="font-body-lg mt-3 max-w-xl" style="color:var(--ot-on-var)">{t['slides'][0][1]}</p>
                                    </div>
                                    <div class="screenshots-counter">
                                        <span class="text-sm">{t['shots_active']}</span>
                                        <p id="screenshots-current-index" class="font-headline-md text-headline-md mt-1">01</p>
                                    </div>
                                </div>

                                <div class="screenshots-stage">
                                    <button id="screenshots-prev" type="button" class="screenshots-nav-button" aria-label="{t['shots_prev']}">
                                        <span class="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <div class="screenshots-viewport">
                                        <div id="screenshots-track" class="screenshots-track">
                                            {slide(t, 0, "reproductor", "Player Screen")}
                                            {slide(t, 1, "biblioteca", "Library Screen")}
                                            {slide(t, 2, "ajustes", "Settings Screen")}
                                        </div>
                                    </div>
                                    <button id="screenshots-next" type="button" class="screenshots-nav-button" aria-label="{t['shots_next']}">
                                        <span class="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>

                                <div class="screenshots-footer">
                                    <div id="screenshots-indicators" class="screenshots-indicators" aria-label="{t['shots_pick']}"></div>
                                    <p class="text-sm" style="color:var(--ot-on-var)">{t['shots_hint']}</p>
                                </div>
                            </div>

                            <aside class="screenshots-preview-rail" aria-label="{t['shots_rail']}">
                                {rail(t, 0, "reproductor")}
                                {rail(t, 1, "biblioteca")}
                                {rail(t, 2, "ajustes")}
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─── SUPPORT ─── -->
        <section class="ot-section" style="padding-top:0">
            <div class="ot-container">
                <div class="ot-support" data-reveal="scale">
                    <div class="ot-shape-ico sh-cookie"><span class="material-symbols-outlined">support_agent</span></div>
                    <h2 class="ot-h2" data-motion-text="words">{t['sup_title']}</h2>
                    <p class="ot-lead">{t['sup_body']}</p>
                    <span class="ot-mag" data-magnetic="0.2" style="display:inline-block">
                        <a href="./from.html" class="ot-btn ot-btn--invert"><span class="material-symbols-outlined">send</span>{t['sup_btn']}</a>
                    </span>
                </div>
            </div>
        </section>

        <!-- ─── DOWNLOADS ─── -->
        <section id="downloads" class="ot-section" style="padding-top:0">
            <div class="ot-container">
                <div class="ot-sec-head">
                    <h2 class="ot-h2" data-motion-text="words">{t['dl_title']}</h2>
                    <p class="ot-lead" data-reveal="fade-up">{t['dl_sub']}</p>
                </div>

                <div class="ot-dl-grid" data-reveal-group>

                    <!-- Android -->
                    <div class="ot-dl" data-reveal-item>
                        <div class="ot-dl-head">
                            <div class="ot-shape-ico sh-cookie"><span class="material-symbols-outlined">android</span></div>
                            <div>
                                <h3>Android</h3>
                                <p class="ot-dl-sub">{t['dl_android']}</p>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <div class="m3e-button-group" role="tablist" aria-label="{t['dl_channel']}">
                                <button type="button" role="tab" class="m3e-button-group__item is-selected" data-channel="stable" aria-selected="true">{t['dl_stable']}</button>
                                <button type="button" role="tab" class="m3e-button-group__item" data-channel="beta" aria-selected="false" onclick="window.location.href='./beta.html'">Beta</button>
                                <button type="button" role="tab" class="m3e-button-group__item" data-channel="alpha" aria-selected="false" disabled>Alpha</button>
                            </div>
                            <span id="android-version-badge" class="version-chip version-chip--latest">{t['loading']}</span>
                        </div>

                        <div class="ot-dl-actions">
                            <button id="changelog-trigger" class="ot-link-btn"><span class="material-symbols-outlined">list_alt</span>{t['dl_changes']}</button>
                            <button id="versions-trigger" class="ot-link-btn"><span class="material-symbols-outlined">history</span>{t['dl_prev']}</button>
                        </div>

                        <div class="ot-dl-foot">
                            <div class="m3e-split-button" id="android-split-button">
                                <a id="android-download-btn" href="" class="m3e-split-button__primary no-underline">
                                    <span class="material-symbols-outlined">download</span>
                                    <span id="android-download-text">{t['dl_apk']}</span>
                                </a>
                                <span class="m3e-split-button__divider" aria-hidden="true"></span>
                                <button id="android-split-toggle" type="button" class="m3e-split-button__toggle" aria-haspopup="menu" aria-expanded="false" aria-controls="android-version-menu" aria-label="{t['dl_more']}">
                                    <span class="material-symbols-outlined">expand_more</span>
                                </button>
                                <ul id="android-version-menu" class="m3e-split-button__menu" role="menu" aria-label="{t['dl_versions']}" hidden>
                                    <li role="none">
                                        <a role="menuitem" href="#" data-version-channel="stable" class="m3e-split-button__menu-item">
                                            <span class="material-symbols-outlined">verified</span><span>{t['dl_latest_stable']}</span>
                                        </a>
                                    </li>
                                    <li role="none">
                                        <a role="menuitem" href="./beta.html" data-version-channel="beta" class="m3e-split-button__menu-item">
                                            <span class="material-symbols-outlined">science</span><span>Beta</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <p class="font-label-sm">{t['dl_req']}</p>
                        </div>
                    </div>

                    <!-- Windows -->
                    <div class="ot-dl" data-reveal-item>
                        <div class="ot-dl-head">
                            <div class="ot-shape-ico sh-clover" style="background:var(--ot-secondary);color:var(--ot-bg)"><span class="material-symbols-outlined">laptop_windows</span></div>
                            <div>
                                <h3>Windows</h3>
                                <p class="ot-dl-sub">{t['dl_win']}</p>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <div class="m3e-button-group" role="tablist" aria-label="{t['dl_channel']}">
                                <button type="button" role="tab" class="m3e-button-group__item is-selected" data-channel="stable" aria-selected="true">{t['dl_stable']}</button>
                                <button type="button" role="tab" class="m3e-button-group__item" data-channel="beta" aria-selected="false" disabled>Beta</button>
                            </div>
                            <span id="currentVersionWindows" class="version-chip version-chip--latest">{t['loading']}</span>
                        </div>

                        <div class="ot-dl-actions">
                            <button id="changelogWindowsBtn" class="ot-link-btn"><span class="material-symbols-outlined">list_alt</span>{t['dl_changes']}</button>
                            <button id="versionsWindowsBtn" class="ot-link-btn"><span class="material-symbols-outlined">history</span>{t['dl_prev']}</button>
                        </div>

                        <div class="ot-dl-foot">
                            <a id="downloadBtnWindows" href="https://www.mediafire.com/file/vv4w9ujz40dh47n/OpenTune.exe/file" target="_blank" rel="noopener noreferrer" class="ot-btn">
                                <span class="material-symbols-outlined">download</span><span id="downloadTextWindows">{t['dl_exe']}</span>
                            </a>
                            <p class="font-label-sm" style="color:var(--ot-on-var)">Windows 10+</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

{footer_block(t)}

    <!-- Changelog -->
    <dialog id="changelog-dialog" class="glass-dialog glass-dialog--large">
        <div class="dialog-header">
            <h3 class="font-title-md">{t['dlg_changelog']}</h3>
            <button id="close-changelog-btn" class="dialog-icon-btn" aria-label="{t['close']}"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="changelog-content" class="dialog-content dialog-content--scroll">
            {LOADER}
        </div>
    </dialog>

    <!-- Versiones anteriores -->
    <dialog id="versions-dialog" class="glass-dialog glass-dialog--large">
        <div class="dialog-header">
            <h3 class="font-title-md">{t['dlg_versions']}</h3>
            <button id="close-versions-btn" class="dialog-icon-btn" aria-label="{t['close']}"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="versions-list" class="dialog-content dialog-content--scroll">
            {LOADER}
        </div>
    </dialog>

    <!-- M3E FAB menu -->
    <div class="m3e-fab" id="m3e-fab" data-open="false">
        <div class="m3e-fab__items" role="menu" aria-label="{t['fab_aria']}">
            <a href="#downloads" class="m3e-fab__item" role="menuitem" data-fab-label="{t['fab_dl']}">
                <span class="m3e-fab__item-label">{t['fab_dl']}</span>
                <span class="m3e-fab__item-icon"><span class="material-symbols-outlined">download</span></span>
            </a>
            <a href="https://codeberg.org/Arturo254/OpenTune" target="_blank" rel="noopener" class="m3e-fab__item" role="menuitem" data-fab-label="GitHub">
                <span class="m3e-fab__item-label">GitHub</span>
                <span class="m3e-fab__item-icon"><span class="material-symbols-outlined">code</span></span>
            </a>
            <a href="./from.html" class="m3e-fab__item" role="menuitem" data-fab-label="{t['fab_support']}">
                <span class="m3e-fab__item-label">{t['fab_support']}</span>
                <span class="m3e-fab__item-icon"><span class="material-symbols-outlined">support_agent</span></span>
            </a>
        </div>
        <button type="button" class="m3e-fab__primary" id="m3e-fab-toggle" aria-label="{t['fab_open']}" aria-haspopup="menu" aria-expanded="false">
            <span class="material-symbols-outlined m3e-fab__icon-add">add</span>
            <span class="material-symbols-outlined m3e-fab__icon-close">close</span>
        </button>
    </div>

{tail_scripts()}
</body>

</html>
"""


LOADER = (
    '<div class="loading-indicator" role="status" aria-label="Loading"><div class="m3e-loading-indicator">'
    '<span class="m3e-loading-indicator__dot"></span><span class="m3e-loading-indicator__dot"></span>'
    '<span class="m3e-loading-indicator__dot"></span></div></div>'
)


def slide(t, i, img, alt):
    title, desc = t["slides"][i]
    return f"""<article class="screenshots-slide" data-title="{title}" data-description="{desc}">
                                                <div class="screenshots-device-frame" data-cursor-label="{t['cur_drag']}">
                                                    <img alt="{alt}" class="w-full h-full object-cover" src="./img/{img}.webp" width="1224" height="2720" loading="lazy">
                                                </div>
                                            </article>"""


def rail(t, i, img):
    title, _ = t["slides"][i]
    short = t["rail"][i]
    active = " is-active" if i == 0 else ""
    return f"""<button type="button" class="screenshots-preview-card{active}" data-screenshot-index="{i}">
                                    <div class="screenshots-preview-thumb"><img alt="{title}" class="w-full h-full object-cover" src="./img/{img}.webp" width="74" height="132" loading="lazy"></div>
                                    <div>
                                        <p class="font-title-md">{title}</p>
                                        <p class="text-sm mt-1" style="color:var(--ot-on-var)">{short}</p>
                                    </div>
                                </button>"""


# build() usa LOADER, slide() y rail() — se definen después a propósito (resolución en tiempo de llamada)
if __name__ == "__main__":
    for key in ("es", "en", "pt"):
        out = ROOT / STRINGS[key]["file"]
        out.write_text(build(key), encoding="utf-8")
        print("✓", out.relative_to(ROOT))
