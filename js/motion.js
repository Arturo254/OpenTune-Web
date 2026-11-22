/**
 * OpenTune — Sistema de movimiento cinemático
 * GSAP + ScrollTrigger + Lenis (sin dependencias de React)
 *
 * API por data-attributes (reutilizable en cualquier página):
 *   data-motion-text="words|chars|lines"   texto con máscara y stagger
 *   data-reveal="fade-up|blur-in|scale|slide-left|slide-right"   (+ data-reveal-delay)
 *   data-reveal-group > data-reveal-item   grupo con stagger
 *   data-image-reveal                      imagen con clip-path
 *   data-parallax-layer[data-parallax-speed]  parallax por scroll
 *   data-mouse-parallax > data-mouse-depth    capas que siguen al puntero
 *   data-magnetic="0.25"                   hover magnético
 *   data-cursor-label="Texto"              etiqueta del cursor personalizado
 *   data-count-to="8" data-count-decimals="1"  contador animado
 *   data-marquee                           cinta infinita (acelera con el scroll)
 *   data-spotlight                         luz que sigue al puntero (.ot-card)
 *
 * Eases: power3/power4/expo (sin bounce en scroll). Reveals 0.75–1.1s.
 * Respeta prefers-reduced-motion: sin Lenis, sin ocultar contenido.
 */
(() => {
  'use strict';

  const html = document.documentElement;

  // Si el CDN falló, el contenido debe seguir visible.
  if (!window.gsap || !window.ScrollTrigger) {
    html.classList.remove('has-motion');
    return;
  }
  window.__otMotion = true;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out', duration: 0.85 });

  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqCoarse = window.matchMedia('(pointer: coarse)');
  const reduceMotion = mqReduce.matches;
  const isTouch = mqCoarse.matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ───────────────────────── Lenis ───────────────────────── */
  let lenis = null;

  function initLenis() {
    if (reduceMotion || typeof window.Lenis === 'undefined') return;

    lenis = new window.Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Anclas internas con offset para la nav flotante
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      if (!hash || hash === '#') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.4 });
        return;
      }
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -84, duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    });

    // Los <dialog> modales y sus listas deben hacer scroll nativo
    $$('dialog').forEach((d) => {
      d.setAttribute('data-lenis-prevent', '');
      new MutationObserver(() => (d.open ? lenis.stop() : lenis.start()))
        .observe(d, { attributes: true, attributeFilter: ['open'] });
    });
  }

  /* ───────────────────── Split de texto ───────────────────── */
  function makeMask(cls) {
    const m = document.createElement('span');
    m.className = cls;
    m.setAttribute('aria-hidden', 'true');
    return m;
  }

  /** Recorre nodos preservando elementos inline (<span class="ot-accent">, <br>). */
  function splitNode(node, mode) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }

          const wordMask = makeMask('motion-word-mask');
          if (mode === 'chars') {
            wordMask.style.whiteSpace = 'nowrap';
            Array.from(part).forEach((ch) => {
              const c = document.createElement('span');
              c.className = 'motion-word motion-char';
              c.textContent = ch;
              wordMask.appendChild(c);
            });
          } else {
            const w = document.createElement('span');
            w.className = 'motion-word';
            w.textContent = part;
            wordMask.appendChild(w);
          }
          frag.appendChild(wordMask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        splitNode(child, mode);
      }
    });
  }

  function prepareText(el) {
    const mode = el.dataset.motionText || 'words';
    if (el.dataset.motionSplit === 'true') return $$(mode === 'lines' ? '.motion-line' : '.motion-word', el);

    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    if (mode !== 'lines') splitNode(el, mode);
    el.dataset.motionSplit = 'true';
    return $$(mode === 'lines' ? '.motion-line' : '.motion-word', el);
  }

  function initTextReveals() {
    gsap.utils.toArray('[data-motion-text]').forEach((el) => {
      if (el.hasAttribute('data-hero-title')) return; // lo anima la secuencia del hero
      const mode = el.dataset.motionText || 'words';
      const targets = prepareText(el);
      if (!targets.length) { gsap.set(el, { autoAlpha: 1 }); return; }

      const isLines = mode === 'lines';
      const isChars = mode === 'chars';
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(
        targets,
        { yPercent: isLines ? 100 : 110, autoAlpha: 0, filter: isChars ? 'none' : 'blur(8px)' },
        {
          yPercent: 0, autoAlpha: 1, filter: 'blur(0px)',
          duration: isChars ? 1 : 0.95,
          ease: 'power4.out',
          stagger: isChars ? 0.04 : isLines ? 0.11 : 0.055,
          scrollTrigger: { trigger: el, start: 'top 84%', once: true },
        }
      );
    });
  }

  /* ───────────────────── Reveals ───────────────────── */
  const presets = {
    'fade-up':     { from: { y: 32, autoAlpha: 0 },                       to: { y: 0, autoAlpha: 1 } },
    'blur-in':     { from: { y: 18, autoAlpha: 0, filter: 'blur(10px)' }, to: { y: 0, autoAlpha: 1, filter: 'blur(0px)' } },
    'scale':       { from: { scale: 0.96, y: 24, autoAlpha: 0 },          to: { scale: 1, y: 0, autoAlpha: 1 } },
    'slide-left':  { from: { x: 48, autoAlpha: 0 },                       to: { x: 0, autoAlpha: 1 } },
    'slide-right': { from: { x: -48, autoAlpha: 0 },                      to: { x: 0, autoAlpha: 1 } },
  };

  function initScrollReveals() {
    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      const items = $$('[data-reveal-item]', group);
      if (!items.length) return;
      gsap.set(group, { autoAlpha: 1 });
      gsap.fromTo(
        items,
        { y: 40, autoAlpha: 0, scale: 0.97 },
        {
          y: 0, autoAlpha: 1, scale: 1,
          duration: 0.95, ease: 'power4.out',
          stagger: { each: 0.075, from: 'start' },
          clearProps: 'transform,scale',
          scrollTrigger: { trigger: group, start: 'top 82%', once: true },
        }
      );
    });

    gsap.utils.toArray('[data-reveal]:not([data-reveal-item])').forEach((el) => {
      const p = presets[el.dataset.reveal] || presets['fade-up'];
      gsap.set(el, { autoAlpha: 1 });
      gsap.fromTo(el, p.from, {
        ...p.to,
        duration: 0.95, ease: 'power4.out',
        delay: Number(el.dataset.revealDelay || 0),
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
    });

    gsap.utils.toArray('[data-image-reveal]').forEach((fig) => {
      const img = $('img', fig);
      gsap.set(fig, { autoAlpha: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 84%', once: true } });
      tl.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.1, ease: 'power4.out' });
      if (img) tl.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
    });
  }

  /* ───────────────────── Parallax por scroll ───────────────────── */
  function initParallax() {
    gsap.utils.toArray('[data-parallax-layer]').forEach((layer) => {
      const speed = Number(layer.dataset.parallaxSpeed || 0.12);
      const section = layer.closest('[data-parallax-section]') || layer.parentElement;
      gsap.to(layer, {
        y: () => window.innerHeight * speed * -1,
        ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top bottom', end: 'bottom top',
          scrub: 1.2, invalidateOnRefresh: true,
        },
      });
    });
  }

  /* ───────────────────── Hero (secuencia cinemática) ───────────────────── */
  function initHero() {
    const hero = $('[data-hero-root]');
    if (!hero) { return Promise.resolve(); }

    const title = $('[data-hero-title]', hero) || $('h1', hero);
    const chars = title ? prepareText(title) : [];

    return new Promise((resolve) => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, onComplete: resolve });

      // 1 · fondo / escenario primero
      tl.fromTo('[data-hero-shape]', { autoAlpha: 0, scale: 0.55, rotate: -24 },
                { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.7, ease: 'expo.out', stagger: 0.12 }, 0);
      tl.fromTo('[data-hero-img]', { autoAlpha: 0, y: 80, scale: 0.94 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 1.5, ease: 'expo.out' }, 0.25);

      // 2 · titular por letras
      if (title) {
        gsap.set(title, { autoAlpha: 1 });
        tl.fromTo(chars, { yPercent: 115, autoAlpha: 0 },
                  { yPercent: 0, autoAlpha: 1, duration: 1.15, stagger: 0.045 }, 0.35);
      }

      // 3 · copy de apoyo, luego CTA y por último chips / flotantes
      tl.fromTo('[data-hero-copy]', { y: 28, autoAlpha: 0, filter: 'blur(8px)' },
                { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.95, stagger: 0.1 }, 0.75);
      tl.fromTo('[data-hero-cta]', { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 1.05);
      tl.fromTo('[data-hero-float]', { y: 30, autoAlpha: 0, scale: 0.9 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 1, stagger: 0.14 }, 1.25);
    });
  }

  /** Mientras el hero sale de pantalla: el titular se condensa (eje wdth de Roboto Flex). */
  function initHeroScrub() {
    const hero = $('[data-hero-root]');
    if (!hero) return;
    const h1 = $('h1', hero);
    const stage = $('.ot-stage', hero);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.1 },
    });
    if (h1) tl.to(h1, { '--ot-wdth': 55, '--ot-wght': 520, yPercent: -8, ease: 'none' }, 0);
    if (stage) tl.to(stage, { scale: 0.92, rotate: 3, ease: 'none' }, 0);
  }

  /* ───────────────────── Mouse parallax ───────────────────── */
  function initMouseParallax() {
    if (reduceMotion || isTouch) return;
    gsap.utils.toArray('[data-mouse-parallax]').forEach((section) => {
      const setters = $$('[data-mouse-depth]', section).map((layer) => ({
        depth: Number(layer.dataset.mouseDepth || 0.04),
        xTo: gsap.quickTo(layer, 'x', { duration: 0.8, ease: 'power3.out' }),
        yTo: gsap.quickTo(layer, 'y', { duration: 0.8, ease: 'power3.out' }),
      }));

      section.addEventListener('pointermove', (e) => {
        const r = section.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        setters.forEach(({ depth, xTo, yTo }) => { xTo(x * depth); yTo(y * depth); });
      });
      section.addEventListener('pointerleave', () => setters.forEach(({ xTo, yTo }) => { xTo(0); yTo(0); }));
    });
  }

  /* ───────────────────── Magnético ───────────────────── */
  function initMagnetic() {
    if (reduceMotion || isTouch) return;
    gsap.utils.toArray('[data-magnetic]').forEach((el) => {
      const strength = Number(el.dataset.magnetic || 0.2);
      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * strength);
        yTo((e.clientY - r.top - r.height / 2) * strength);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ───────────────────── Cursor ───────────────────── */
  function initCursor() {
    if (reduceMotion || isTouch) return;
    const cursor = $('[data-cursor]');
    if (!cursor) return;

    const label = $('[data-cursor-label]', cursor);
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

    document.addEventListener('pointermove', (e) => {
      cursor.classList.add('is-on');
      xTo(e.clientX); yTo(e.clientY);
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('is-on'));

    $$('[data-cursor-label]').filter((t) => !cursor.contains(t)).forEach((t) => {
      t.addEventListener('pointerenter', () => {
        if (label) label.textContent = t.dataset.cursorLabel || '';
        gsap.to(cursor, { width: 72, height: 72, duration: 0.4, ease: 'power3.out' });
      });
      t.addEventListener('pointerleave', () => {
        if (label) label.textContent = '';
        gsap.to(cursor, { width: 14, height: 14, duration: 0.4, ease: 'power3.out' });
      });
    });
  }

  /* ───────────────────── Spotlight (cards) ───────────────────── */
  function initSpotlight() {
    if (isTouch) return;
    $$('[data-spotlight]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ───────────────────── Contadores ───────────────────── */
  function initCounters() {
    gsap.utils.toArray('[data-count-to]').forEach((el) => {
      const end = parseFloat(el.dataset.countTo);
      const dec = Number(el.dataset.countDecimals || 0);
      const suffix = el.dataset.countSuffix || '';
      const obj = { v: 0 };
      el.textContent = (0).toFixed(dec) + suffix;
      gsap.to(obj, {
        v: end, duration: 1.8, ease: 'power3.out',
        onUpdate: () => { el.textContent = obj.v.toFixed(dec) + suffix; },
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      });
    });
  }

  /* ───────────────────── Marquee ───────────────────── */
  function initMarquee() {
    if (reduceMotion) return;
    gsap.utils.toArray('[data-marquee]').forEach((root) => {
      const track = $('.ot-marquee-track', root);
      if (!track) return;
      const tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });

      // Acelera con la velocidad del scroll y vuelve a 1 con suavidad
      let boost = 1;
      if (lenis) lenis.on('scroll', ({ velocity }) => { boost = Math.min(7, 1 + Math.abs(velocity) * 0.35); });
      gsap.ticker.add(() => {
        boost += (1 - boost) * 0.06;
        tween.timeScale(boost);
      });
    });
  }

  /* ───────────────────── Nav ───────────────────── */
  function initNav() {
    const wrap = $('.ot-nav-wrap');
    if (!wrap) return;

    ScrollTrigger.create({
      start: 40, end: 'max',
      onToggle: (self) => wrap.classList.toggle('is-scrolled', self.isActive),
    });

    // progreso de lectura
    const bar = $('.ot-progress > span');
    if (bar) {
      gsap.to(bar, { scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
    }

    // pastilla deslizante bajo los links
    const linksBox = $('.ot-links', wrap);
    const pill = $('.ot-link-pill', wrap);
    const links = $$('.ot-link[href^="#"]', wrap);
    if (!linksBox || !pill || !links.length) return;

    let active = null;
    const moveTo = (link, instant = false) => {
      if (!link) { gsap.to(pill, { opacity: 0, duration: 0.3 }); return; }
      gsap.to(pill, {
        x: link.offsetLeft, width: link.offsetWidth, opacity: 1,
        duration: instant ? 0 : 0.6, ease: 'expo.out', overwrite: 'auto',
      });
    };

    links.forEach((l) => {
      l.addEventListener('pointerenter', () => moveTo(l));
      const id = l.getAttribute('href');
      const sec = document.querySelector(id);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) {
            active = l;
            links.forEach((x) => x.classList.toggle('is-active', x === l));
            moveTo(l);
          } else if (active === l) {
            active = null; l.classList.remove('is-active'); moveTo(null);
          }
        },
      });
    });
    linksBox.addEventListener('pointerleave', () => moveTo(active));
    window.addEventListener('resize', () => moveTo(active, true));
  }

  /* ───────────────────── Screenshots: refresco tras colapsar ───────────────────── */
  function initAccordionRefresh() {
    const t = $('#screenshots-toggle');
    if (!t) return;
    t.addEventListener('click', () => {
      [450, 900].forEach((ms) => setTimeout(() => ScrollTrigger.refresh(), ms));
    });
  }

  /* ───────────────────── Init ───────────────────── */
  function boot() {
    if (reduceMotion) {
      html.classList.remove('has-motion');
      initSpotlight();
      return;
    }

    initLenis();
    initNav();
    initTextReveals();
    initScrollReveals();
    initParallax();
    initCounters();
    initMarquee();
    initMagnetic();
    initCursor();
    initSpotlight();
    initAccordionRefresh();
    initHeroScrub();

    initHero().then(() => initMouseParallax());
    // si no hay hero, igualmente habilita parallax del puntero
    if (!$('[data-hero-root]')) initMouseParallax();

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  // El usuario puede activar "reducir movimiento" en caliente
  mqReduce.addEventListener?.('change', (e) => { if (e.matches) location.reload(); });
})();
