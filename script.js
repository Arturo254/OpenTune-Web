/**
 * OpenTune App - Main JavaScript
 * Versión: 2.0.0
 * Descripción: Script principal para la aplicación web OpenTune
 */

const APP_CONFIG = {
  repositories: {
    android: {
      repo: 'Arturo254/OpenTune',
      currentVersion: '1.9.8',
      downloadFormat: '{version}/app-release.apk',
      elements: {
        version: 'currentVersion',
        download: 'downloadBtn',
        text: 'downloadText',
        changelog: 'changelog',
        versions: 'versions',
        changelogContent: 'changelogContent',
        versionsList: 'versionsList'
      }
    },
    windows: {
      repo: 'Arturo254/OpenTune-Desktop',
      currentVersion: '1.9.0',
      downloadFormat: '{version}/OpenTune-Desktop-{version}.exe',
      elements: {
        version: 'currentVersionWindows',
        download: 'downloadBtnWindows',
        text: 'downloadTextWindows',
        changelog: 'changelogWindows',
        versions: 'versionsWindows',
        changelogContent: 'changelogContentWindows',
        versionsList: 'versionsListWindows'
      }
    }
  },
  urls: {
    api: { github: 'https://api.github.com/repos/' },
    demo: 'https://appetize.io/app/b_yb62tcjuqzqjvctnswv3krpnmm'
  },
  elements: {
    theme: { selector: 'themeSelector', icon: 'themeIcon' },
    language: { selector: 'languageSelector', dialog: 'languageDialog', text: 'languageText' },
    warning: { button: 'triggerDialogButton', dialog: 'warningDialog', overlay: 'dialogOverlay', dismiss: 'dismissButton', proceed: 'proceedButton' },
    logo: 'logo'
  },
  checkInterval: 60 * 60 * 1000
};

class OpenTuneApp {
  constructor(config) {
    this.config = config;
    this.themeManager = new ThemeManager(config.elements.theme);
    this.languageManager = new LanguageManager(config.elements.language);
    this.dialogManager = new DialogManager(config.elements.warning, config.urls.demo);
    this.logoManager = new LogoManager(config.elements.logo);
    this.versionManager = new VersionManager(config.repositories);
    this.carouselManager = null;
  }

  init() {
    this.themeManager.init();
    this.languageManager.init();
    this.dialogManager.init();
    this.logoManager.init();
    this.versionManager.init();
    this.configureMarkdown();
    console.log('OpenTune App inicializada correctamente');
  }

  configureMarkdown() {
    if (typeof marked !== 'undefined') {
      marked.setOptions({ breaks: true, gfm: true, headerIds: false, sanitize: false });
    }
  }
}

class ThemeManager {
  constructor(elements) {
    this.selectorId = elements.selector;
    this.iconId = elements.icon;
  }

  init() {
    const selector = document.getElementById(this.selectorId);
    const icon = document.getElementById(this.iconId);
    if (!selector || !icon) return;

    this.selector = selector;
    this.icon = icon;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark ? 'dark' : 'light');
    }

    selector.addEventListener('click', () => this.toggleTheme());
  }

  applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }

  updateIcon(theme) {
    if (this.icon) {
      this.icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }

  toggleTheme() {
    const isDark = document.body.classList.contains('dark');
    this.applyTheme(isDark ? 'light' : 'dark');
  }
}

class LanguageManager {
  constructor(elements) {
    this.selectorId = elements.selector;
    this.dialogId = elements.dialog;
    this.textId = elements.text;
  }

  init() {
    const selector = document.getElementById(this.selectorId);
    const dialog = document.getElementById(this.dialogId);
    const text = document.getElementById(this.textId);
    if (!selector || !dialog) return;

    selector.addEventListener('click', () => dialog.showModal());

    window.closeDialog = () => dialog.close();
    window.setLanguage = (language, url) => {
      if (text) text.textContent = language;
      dialog.close();
      window.location.href = url;
    };
  }
}

class DialogManager {
  constructor(elements, demoUrl) {
    this.elements = elements;
    this.demoUrl = demoUrl;
  }

  init() {
    const button = document.getElementById(this.elements.button);
    const dialog = document.getElementById(this.elements.dialog);
    const overlay = document.getElementById(this.elements.overlay);
    const dismissButton = document.getElementById(this.elements.dismiss);
    const proceedButton = document.getElementById(this.elements.proceed);
    if (!button || !dialog || !overlay) return;

    button.addEventListener('click', () => {
      dialog.showModal();
      overlay.style.display = 'block';
    });

    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        dialog.close();
        overlay.style.display = 'none';
      });
    }

    if (proceedButton) {
      proceedButton.addEventListener('click', () => {
        window.location.href = this.demoUrl;
      });
    }
  }
}

class LogoManager {
  constructor(element) {
    this.elementId = element;
  }

  init() {
    const logo = document.getElementById(this.elementId);
    if (!logo) return;
    logo.addEventListener('load', () => this.applyLogoEffects(logo));
  }

  applyLogoEffects(logo) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = logo.src;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        try {
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let r = 0, g = 0, b = 0, total = 0;
          for (let i = 0; i < pixels.length; i += 4) { r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2]; total++; }
          logo.style.setProperty('--logo-glow-color', `rgb(${Math.floor(r/total)},${Math.floor(g/total)},${Math.floor(b/total)})`);
        } catch (e) {
          logo.style.setProperty('--logo-glow-color', 'rgba(255,255,255,0.5)');
        }
      };
    } catch (e) {
      console.error('Error al inicializar efectos del logo:', e);
    }
  }
}

class VersionManager {
  constructor(repositories) {
    this.repositories = repositories;
    this.handlers = {};
  }

  init() {
    Object.entries(this.repositories).forEach(([platform, config]) => {
      if (platform === 'android') this.handlers[platform] = new AndroidVersionHandler(config);
      else if (platform === 'windows') this.handlers[platform] = new WindowsVersionHandler(config);
      if (this.handlers[platform]) this.handlers[platform].init();
    });
  }
}

class BaseVersionHandler {
  constructor(config) {
    this.repo = config.repo;
    this.currentVersion = config.currentVersion;
    this.latestVersion = config.currentVersion;
    this.downloadFormat = config.downloadFormat;
    this.elements = config.elements;
  }

  async init() {
    const versionEl = document.getElementById(this.elements.version);
    const downloadBtn = document.getElementById(this.elements.download);
    if (!versionEl && !downloadBtn) return;
    await this.checkNewVersion();
    setInterval(() => this.checkNewVersion(), APP_CONFIG.checkInterval);
  }

  async checkNewVersion() {
    const versionEl = document.getElementById(this.elements.version);
    const downloadText = document.getElementById(this.elements.text);
    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases/latest`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.latestVersion = data.tag_name;
      if (versionEl) versionEl.textContent = data.tag_name;
      this.updateDownloadButton();
      return data.tag_name;
    } catch (error) {
      console.error('Error al verificar versión:', error);
      if (versionEl) versionEl.textContent = this.currentVersion;
      return null;
    }
  }

  updateDownloadButton() {
    const downloadBtn = document.getElementById(this.elements.download);
    const downloadText = document.getElementById(this.elements.text);
    if (!downloadBtn) return;
    const version = this.latestVersion || this.currentVersion;
    const url = `https://github.com/${this.repo}/releases/download/${this.downloadFormat.replace(/\{version\}/g, version)}`;
    downloadBtn.href = url;
    if (downloadText && this.latestVersion && this.latestVersion !== this.currentVersion) {
      downloadText.textContent = `Nueva versión (${this.latestVersion})`;
    }
  }
}

class AndroidVersionHandler extends BaseVersionHandler {
  constructor(config) {
    super(config);
    this.initDialogs();
  }

  initDialogs() {
    const changelogDialog = document.getElementById(this.elements.changelog);
    const versionsDialog = document.getElementById(this.elements.versions);

    if (changelogDialog) {
      window.changelog = {
        show: () => { changelogDialog.showModal(); this.loadChangelog(); },
        close: () => changelogDialog.close()
      };
    }

    if (versionsDialog) {
      window.versions = {
        show: () => { versionsDialog.showModal(); this.loadVersions(); },
        close: () => versionsDialog.close()
      };
    }
  }

  async loadChangelog() {
    const content = document.getElementById(this.elements.changelogContent);
    if (!content) return;
    content.innerHTML = '<div class="loading-indicator"><div class="circular-progress"></div></div>';
    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases/latest`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!data.body) throw new Error('Sin notas de versión');
      const date = new Date(data.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      content.innerHTML = `
        <div style="padding:4px 0">
          <p style="font-size:13px;opacity:.6;margin-bottom:16px">${date}</p>
          <div class="markdown-body">${marked.parse(data.body)}</div>
        </div>`;
    } catch (error) {
      content.innerHTML = `<p style="color:var(--md-sys-color-error);padding:16px">Error: ${error.message}</p>`;
    }
  }

  async loadVersions() {
    const list = document.getElementById(this.elements.versionsList);
    if (!list) return;
    list.innerHTML = '<div class="loading-indicator"><div class="circular-progress"></div></div>';
    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const releases = await response.json();
      list.innerHTML = releases.map((release, i) => {
        const type = release.prerelease ? 'beta' : (release.tag_name.toLowerCase().includes('alpha') ? 'alpha' : 'stable');
        const label = type === 'stable' ? 'Estable' : (type === 'beta' ? 'Beta' : 'Alpha');
        const date = new Date(release.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        const downloadUrl = release.assets[0]?.browser_download_url || '#';
        return `
          <div class="version-list-item">
            <div class="version-list-info">
              <span class="version-tag">${release.tag_name}</span>
              ${i === 0 ? '<span class="version-badge latest">Más reciente</span>' : ''}
              <span class="version-badge ${type}">${label}</span>
              <span class="version-date">${date}</span>
            </div>
            <a href="${downloadUrl}" class="primary-button small">
              <span class="material-symbols-rounded">download</span>
              Descargar
            </a>
          </div>`;
      }).join('');
    } catch (error) {
      list.innerHTML = `<p style="color:var(--md-sys-color-error);padding:16px">Error: ${error.message}</p>`;
    }
  }
}

class WindowsVersionHandler extends BaseVersionHandler {
  constructor(config) {
    super(config);
    this.initDialogs();
  }

  initDialogs() {
    const changelogDialog = document.getElementById(this.elements.changelog);
    const versionsDialog = document.getElementById(this.elements.versions);

    if (changelogDialog) {
      window.showChangelogWindows = () => { changelogDialog.showModal(); this.loadChangelog(); };
      window.closeChangelogWindows = () => changelogDialog.close();
    }
    if (versionsDialog) {
      window.showVersionsWindows = () => { versionsDialog.showModal(); this.loadVersions(); };
      window.closeVersionsWindows = () => versionsDialog.close();
    }
  }

  async loadChangelog() {
    const content = document.getElementById(this.elements.changelogContent);
    if (!content) return;
    content.innerHTML = '<div class="loading-indicator"><div class="circular-progress"></div></div>';
    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases/latest`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      content.innerHTML = `<div class="markdown-body">${marked.parse(data.body || 'Sin notas disponibles.')}</div>`;
    } catch (error) {
      content.innerHTML = `<p style="color:var(--md-sys-color-error);padding:16px">Error: ${error.message}</p>`;
    }
  }

  async loadVersions() {
    const list = document.getElementById(this.elements.versionsList);
    if (!list) return;
    list.innerHTML = '<div class="loading-indicator"><div class="circular-progress"></div></div>';
    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const releases = await response.json();
      list.innerHTML = releases.map(release => `
        <div class="version-list-item">
          <div class="version-list-info">
            <span class="version-tag">${release.tag_name}</span>
            <span class="version-date">${new Date(release.published_at).toLocaleDateString()}</span>
          </div>
          <a href="${release.assets[0]?.browser_download_url || '#'}" class="primary-button small">
            <span class="material-symbols-rounded">download</span>
            Descargar
          </a>
        </div>`).join('');
    } catch (error) {
      list.innerHTML = `<p style="color:var(--md-sys-color-error);padding:16px">Error: ${error.message}</p>`;
    }
  }
}

class CarouselManager {
  constructor() {
    this.images = document.querySelectorAll('.carousel-image');
    this.popupOverlay = document.getElementById('popupOverlay');
    this.popupImage = document.getElementById('popupImage');
    this.startX = 0;
  }

  init() {
    if (!this.images.length || !this.popupOverlay) return;
    this.images.forEach(img => {
      img.addEventListener('click', e => {
        this.popupImage.src = e.target.src;
        this.popupOverlay.style.display = 'flex';
      });
    });
    this.popupOverlay.addEventListener('click', e => {
      if (e.target === this.popupOverlay) this.popupOverlay.style.display = 'none';
    });
    const closeBtn = document.getElementById('closePopup');
    if (closeBtn) closeBtn.addEventListener('click', () => { this.popupOverlay.style.display = 'none'; });
    this.popupOverlay.addEventListener('touchstart', e => { this.startX = e.touches[0].clientX; });
    this.popupOverlay.addEventListener('touchend', e => {
      const diff = this.startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.nextImage() : this.prevImage();
    });
  }

  nextImage() {
    const idx = Array.from(this.images).findIndex(img => img.src === this.popupImage.src);
    this.popupImage.src = this.images[(idx + 1) % this.images.length].src;
  }

  prevImage() {
    const idx = Array.from(this.images).findIndex(img => img.src === this.popupImage.src);
    this.popupImage.src = this.images[(idx - 1 + this.images.length) % this.images.length].src;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new OpenTuneApp(APP_CONFIG);
  app.init();

  if (document.querySelectorAll('.carousel-image').length && document.getElementById('popupOverlay')) {
    app.carouselManager = new CarouselManager();
    app.carouselManager.init();
  }
});