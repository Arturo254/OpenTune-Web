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
      downloadFormat: '{version}/app-universal-release.apk',
      elements: {
        version: 'android-version-badge',
        download: 'android-download-btn',
        text: 'android-download-text',
        changelog: 'changelog-dialog',
        versions: 'versions-dialog',
        changelogContent: 'changelog-content',
        versionsList: 'versions-list'
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
    language: { selector: 'language-btn', dialog: 'languageDialog', text: 'languageText' },
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

    // Detectar tema actual basado en las clases del root
    const isLightMode = document.documentElement.classList.contains('light-mode');
    this.updateIcon(isLightMode ? 'light' : 'dark');

    selector.addEventListener('click', () => this.toggleTheme());
  }

  applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }

    this.updateIcon(theme);

    // Disparar evento para que otros componentes se actualicen si es necesario
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  updateIcon(theme) {
    if (this.icon) {
      this.icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
  }

  toggleTheme() {
    const isLightMode = document.documentElement.classList.contains('light-mode');
    this.applyTheme(isLightMode ? 'dark' : 'light');
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

    // Abrir diálogo al hacer clic en el botón
    selector.addEventListener('click', () => {
      dialog.showModal();
    });

    // Cerrar diálogo con el botón X o el botón Cancelar
    const closeButtons = dialog.querySelectorAll('[data-close]');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        dialog.close();
      });
    });

    // Cerrar al hacer clic fuera del diálogo
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });

    // Configurar funciones globales para cambio de idioma (si existen)
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
          logo.style.setProperty('--logo-glow-color', `rgb(${Math.floor(r / total)},${Math.floor(g / total)},${Math.floor(b / total)})`);
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


// Mostrar versión en el badge OSS
(async function updateOssVersion() {
  const badge = document.getElementById('oss-version-badge');
  if (!badge) return;

  try {
    const response = await fetch('https://api.github.com/repos/Arturo254/OpenTune/releases/latest');
    const data = await response.json();
    badge.textContent = data.tag_name || 'Error';
  } catch (error) {
    console.error('Error al cargar versión:', error);
    badge.textContent = 'Error';
  }
})();


// ============================================
// CONFIGURACIÓN DE DIÁLOGOS ANDROID
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  // Elementos de la tarjeta Android
  const changelogTrigger = document.getElementById('changelog-trigger');
  const versionsTrigger = document.getElementById('versions-trigger');
  const changelogDialog = document.getElementById('changelog-dialog');
  const versionsDialog = document.getElementById('versions-dialog');
  const closeChangelogBtn = document.getElementById('close-changelog-btn');
  const closeVersionsBtn = document.getElementById('close-versions-btn');

  // Función para abrir changelog
  if (changelogTrigger && changelogDialog) {
    changelogTrigger.addEventListener('click', function () {
      changelogDialog.showModal();
      // Cargar el changelog automáticamente
      loadChangelogContent();
    });
  }

  // Función para abrir versiones
  if (versionsTrigger && versionsDialog) {
    versionsTrigger.addEventListener('click', function () {
      versionsDialog.showModal();
      // Cargar las versiones automáticamente
      loadVersionsList();
    });
  }

  // Cerrar diálogos con los botones X
  if (closeChangelogBtn && changelogDialog) {
    closeChangelogBtn.addEventListener('click', function () {
      changelogDialog.close();
    });
  }

  if (closeVersionsBtn && versionsDialog) {
    closeVersionsBtn.addEventListener('click', function () {
      versionsDialog.close();
    });
  }

  // Cerrar diálogo haciendo clic fuera (opcional)
  if (changelogDialog) {
    changelogDialog.addEventListener('click', function (e) {
      if (e.target === changelogDialog) {
        changelogDialog.close();
      }
    });
  }

  if (versionsDialog) {
    versionsDialog.addEventListener('click', function (e) {
      if (e.target === versionsDialog) {
        versionsDialog.close();
      }
    });
  }
});

// Función para cargar el changelog
async function loadChangelogContent() {
  const content = document.getElementById('changelog-content');
  if (!content) return;

  content.innerHTML = '<div class="loading-indicator"><div class="circular-progress"></div></div>';

  try {
    const response = await fetch('https://api.github.com/repos/Arturo254/OpenTune/releases/latest');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const date = new Date(data.published_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Verificar si marked está disponible
    const markdownContent = typeof marked !== 'undefined' ? marked.parse(data.body || 'Sin notas disponibles.') : data.body || 'Sin notas disponibles.';

    content.innerHTML = `
            <div class="changelog-meta">
                <span class="changelog-date">📅 ${date}</span>
            </div>
            <div class="markdown-body">${markdownContent}</div>
        `;
  } catch (error) {
    content.innerHTML = `<p style="color: #cf6679; padding: 16px;">Error al cargar cambios: ${error.message}</p>`;
  }
}

// Función para cargar lista de versiones
async function loadVersionsList() {
  const list = document.getElementById('versions-list');
  if (!list) return;

  list.innerHTML = '<div class="loading-indicator"><div class="circular-progress"></div></div>';

  try {
    const response = await fetch('https://api.github.com/repos/Arturo254/OpenTune/releases');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const releases = await response.json();

    if (releases.length === 0) {
      list.innerHTML = '<p class="text-on-surface-variant" style="padding: 16px;">No hay versiones disponibles.</p>';
      return;
    }

    list.innerHTML = releases.map((release, index) => {
      const date = new Date(release.published_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const downloadUrl = release.assets[0]?.browser_download_url || '#';
      const isLatest = index === 0;

      return `
                <div class="version-list-item">
                    <div class="version-list-info">
                        <div class="version-meta-row">
                            <span class="version-tag">${release.tag_name}</span>
                            ${isLatest ? '<span class="version-chip version-chip--latest">Más reciente</span>' : ''}
                        </div>
                        <span class="version-date">${date}</span>
                    </div>
                    <a href="${downloadUrl}" class="version-dl-btn" download>
                        <span class="material-symbols-outlined" style="font-size: 18px;">download</span>
                        Descargar
                    </a>
                </div>
            `;
    }).join('');

  } catch (error) {
    list.innerHTML = `<p style="color: #cf6679; padding: 16px;">Error al cargar versiones: ${error.message}</p>`;
  }
}

// Diagnóstico del LanguageManager
document.addEventListener('DOMContentLoaded', function () {
  const langBtn = document.getElementById('languageSelector');
  const langDialog = document.getElementById('language-dialog');

  console.log('Botón idioma:', langBtn);
  console.log('Diálogo idioma:', langDialog);

  if (langBtn && langDialog) {
    // Forzar el evento manualmente
    langBtn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Botón clickeado - abriendo diálogo');
      langDialog.showModal();
    });
  } else {
    console.error('No se encontraron los elementos de idioma');
  }
});

// ============================================
// ACCORDION PARA LA SECCIÓN DE SCREENSHOTS
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  const screenshotsContent = document.getElementById('screenshots-content');
  const screenshotsToggle = document.getElementById('screenshots-toggle');
  const screenshotsIcon = document.getElementById('screenshots-icon');

  if (screenshotsContent && screenshotsToggle) {

    const savedState = localStorage.getItem('screenshotsCollapsed');

    if (savedState === 'false') {
      // Si el usuario lo expandió antes, lo abrimos
      screenshotsContent.classList.remove('collapsed');
      if (screenshotsIcon) screenshotsIcon.classList.remove('rotated');
    }


    screenshotsToggle.addEventListener('click', function () {
      screenshotsContent.classList.toggle('collapsed');
      if (screenshotsIcon) screenshotsIcon.classList.toggle('rotated');

      // Guardar estado
      const isCollapsed = screenshotsContent.classList.contains('collapsed');
      localStorage.setItem('screenshotsCollapsed', isCollapsed);
    });
  }
});

// ============================================
// OBTENER DATOS REALES DE GITHUB API (VERSIÓN MEJORADA) (Contribuidores.html)
// ============================================
const REPO_OWNER = 'Arturo254';
const REPO_NAME = 'OpenTune';

async function fetchGitHubStats() {
  try {
    // Obtener datos del repositorio
    const repoResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`);
    if (!repoResponse.ok) throw new Error('Error al obtener repositorio');
    const repoData = await repoResponse.json();

    // Stars
    document.querySelector('#stats-stars .font-headline-md').textContent = formatNumber(repoData.stargazers_count);

    // Forks
    document.querySelector('#stats-forks .font-headline-md').textContent = formatNumber(repoData.forks_count);

    // Issues
    document.querySelector('#stats-issues .font-headline-md').textContent = formatNumber(repoData.open_issues_count);

    // Total Commits - usando el endpoint de commits
    await fetchTotalCommits();

  } catch (error) {
    console.error('Error:', error);
    document.querySelectorAll('.stats-number').forEach(el => el.textContent = 'Error');
  }
}

async function fetchTotalCommits() {
  try {
    // Método: obtener la página 1 con per_page=1 y leer el header Link
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=1`);
    const linkHeader = response.headers.get('Link');

    let totalCommits = 'N/A';
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) {
        totalCommits = formatNumber(parseInt(lastPageMatch[1]));
      }
    }

    document.querySelector('#stats-commits .font-headline-md').textContent = totalCommits;
  } catch (error) {
    console.error('Error al obtener commits:', error);
    document.querySelector('#stats-commits .font-headline-md').textContent = 'N/A';
  }
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

// Ejecutar
document.addEventListener('DOMContentLoaded', fetchGitHubStats);

// ============================================
// OBTENER DATOS REALES DE GITHUB API
// ============================================

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

async function fetchGitHubStats() {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`);
    if (!response.ok) throw new Error('Error al obtener repositorio');
    const data = await response.json();

    document.querySelector('#stats-stars .font-headline-md').textContent = formatNumber(data.stargazers_count);
    document.querySelector('#stats-forks .font-headline-md').textContent = formatNumber(data.forks_count);
    document.querySelector('#stats-issues .font-headline-md').textContent = formatNumber(data.open_issues_count);

    // Total Commits
    const commitsResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=1`);
    const linkHeader = commitsResponse.headers.get('Link');
    let totalCommits = 'N/A';
    if (linkHeader) {
      const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (lastPageMatch) totalCommits = formatNumber(parseInt(lastPageMatch[1]));
    }
    document.querySelector('#stats-commits .font-headline-md').textContent = totalCommits;

  } catch (error) {
    console.error('Error:', error);
  }
}

function getContributorRole(contributions, login) {
  if (login === 'Arturo254') return 'Lead Developer';
  if (contributions > 100) return 'Core Contributor';
  if (contributions > 30) return 'Major Contributor';
  if (contributions > 10) return 'Contributor';
  return 'Supporter';
}

async function fetchContributors() {
  const contributorsGrid = document.getElementById('contributors-grid');
  if (!contributorsGrid) return;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`);
    if (!response.ok) throw new Error('Error al obtener contribuidores');
    const contributors = await response.json();

    if (contributors.length === 0) return;

    contributorsGrid.innerHTML = contributors.map(contributor => {
      const role = getContributorRole(contributor.contributions, contributor.login);
      return `
            <div class="group bg-surface-container-low p-4 rounded-lg flex items-center gap-4 border border-white/5 hover:bg-surface-container-high transition-all hover:scale-[1.02] duration-200">
              <img alt="${contributor.login}"
                class="w-16 h-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all ring-2 ring-transparent group-hover:ring-primary/50"
                src="${contributor.avatar_url}&s=64" />
              <div class="flex-1">
                <div class="flex items-center justify-between flex-wrap gap-2">
                  <h3 class="font-title-md text-title-md text-primary group-hover:text-primary-fixed-dim transition-colors">${contributor.login}</h3>
                  <span class="text-on-surface-variant font-label-sm text-label-sm bg-surface-container-high px-2 py-1 rounded-full">${contributor.contributions} commits</span>
                </div>
                <div class="mt-2 flex gap-1 flex-wrap">
                  <span class="bg-primary/10 text-primary-fixed-dim px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">${role}</span>
                </div>
              </div>
              <a href="${contributor.html_url}" target="_blank" class="opacity-0 group-hover:opacity-100 transition-all">
                <span class="material-symbols-outlined text-on-surface-variant hover:text-primary text-[18px]">open_in_new</span>
              </a>
            </div>
          `;
    }).join('');

  } catch (error) {
    console.error('Error al cargar contribuidores:', error);
  }
}

async function fetchLatestActivity() {
  const activityContainer = document.getElementById('latest-activity');
  if (!activityContainer) return;

  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=4`);
    if (!response.ok) throw new Error('Error al obtener actividad');
    const commits = await response.json();

    activityContainer.innerHTML = commits.map(commit => `
          <div class="flex gap-4">
            <div class="mt-1">
              <div class="bg-primary/20 p-2 rounded-full">
                <span class="material-symbols-outlined text-primary text-[20px]">commit</span>
              </div>
            </div>
            <div>
              <p class="font-title-md text-title-md text-on-surface">${commit.commit.message.split('\n')[0].substring(0, 60)}</p>
              <p class="font-label-sm text-label-sm text-on-surface-variant">by <span class="text-primary-fixed-dim">${commit.author?.login || commit.commit.author.name}</span> • ${new Date(commit.commit.author.date).toLocaleDateString()}</p>
            </div>
          </div>
        `).join('');

  } catch (error) {
    console.error('Error al cargar actividad:', error);
    activityContainer.innerHTML = '<p class="text-on-surface-variant text-center">Error loading activity</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubStats();
  fetchContributors();
  fetchLatestActivity();
});



// ============================================
// FORMULARIO DE CONTACTO - ENVÍO A FORMSPREE
// ============================================

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {

  // Seleccionar el formulario
  const contactForm = document.querySelector('form');
  const submitButton = contactForm?.querySelector('button[type="submit"]');

  // Crear elemento para mensaje de éxito
  const successMessage = document.createElement('div');
  successMessage.id = 'successMessage';
  successMessage.style.cssText = `
            display: none;
            text-align: center;
            padding: 40px 20px;
            background: rgba(208, 188, 255, 0.1);
            border-radius: 24px;
            border: 1px solid rgba(208, 188, 255, 0.3);
            margin-top: 20px;
        `;
  successMessage.innerHTML = `
            <span class="material-symbols-outlined" style="font-size: 48px; color: #d0bcff; margin-bottom: 16px;">check_circle</span>
            <h3 style="color: #e9ddff; font-family: Epilogue; font-size: 24px; margin-bottom: 8px;">¡Mensaje enviado!</h3>
            <p style="color: #cac4d0; margin-bottom: 24px;">Gracias por contactarnos. Te responderemos pronto.</p>
            <button onclick="location.reload()" style="background: #d0bcff; color: #37265e; border: none; padding: 12px 24px; border-radius: 9999px; font-weight: 600; cursor: pointer;">Enviar otro mensaje</button>
        `;

  // Insertar mensaje de éxito después del formulario
  if (contactForm) {
    contactForm.parentNode.appendChild(successMessage);
  }

  // Función para mostrar loading
  function setLoading(isLoading) {
    if (!submitButton) return;
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.style.opacity = '0.7';
      submitButton.style.cursor = 'not-allowed';
      const originalText = submitButton.innerHTML;
      submitButton.setAttribute('data-original-text', originalText);
      submitButton.innerHTML = '<span></span><span>Enviando...</span><span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">hourglass_empty</span>';

      // Agregar animación spin si no existe
      if (!document.querySelector('#spin-style')) {
        const style = document.createElement('style');
        style.id = 'spin-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }
    } else {
      submitButton.disabled = false;
      submitButton.style.opacity = '1';
      submitButton.style.cursor = 'pointer';
      const originalText = submitButton.getAttribute('data-original-text');
      if (originalText) {
        submitButton.innerHTML = originalText;
      }
    }
  }

  // Manejar envío del formulario
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Obtener valores
      const nombreInput = document.querySelector('input[placeholder="Escribe tu nombre aquí"]');
      const emailInput = document.querySelector('input[type="email"]');
      const descripcionTextarea = document.querySelector('textarea');
      const tipoMensajeSelected = document.querySelector('input[name="message_type"]:checked');

      const nombre = nombreInput?.value || '';
      const email = emailInput?.value || '';
      const descripcion = descripcionTextarea?.value || '';
      const tipo_mensaje = tipoMensajeSelected?.closest('label')?.querySelector('.font-title-md')?.innerText || 'Comentario';

      // Validar
      if (!nombre || !email || !descripcion) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      if (!email.includes('@')) {
        alert('Por favor, ingresa un email válido.');
        return;
      }

      // Mostrar loading
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('email', email);
        formData.append('tipo_mensaje', tipo_mensaje);
        formData.append('descripcion', descripcion);

        const response = await fetch('https://formspree.io/f/xgvallrq', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Ocultar formulario, mostrar éxito
          contactForm.style.display = 'none';
          successMessage.style.display = 'block';
        } else {
          throw new Error('Error en el envío');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    });
  }
});


// ============================================
// DEMO - DIÁLOGO DE ADVERTENCIA
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const demoBtn = document.getElementById('hero-demo-btn');
    const warningDialog = document.getElementById('warning-dialog');
    const proceedBtn = document.getElementById('proceedBtn');
    const dismissBtn = document.getElementById('dismissBtn');
    
    // Abrir diálogo al hacer clic en "Probar Demo"
    if (demoBtn && warningDialog) {
        demoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            warningDialog.showModal();
        });
    }
    
    // Ir a la demo al hacer clic en "Continuar"
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            window.location.href = 'https://appetize.io/app/b_yb62tcjuqzqjvctnswv3krpnmm';
        });
    }
    
    // Cerrar diálogo al hacer clic en "Cancelar"
    if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
            warningDialog.close();
        });
    }
    
    // Cerrar diálogo al hacer clic fuera de él
    if (warningDialog) {
        warningDialog.addEventListener('click', function(e) {
            if (e.target === warningDialog) {
                warningDialog.close();
            }
        });
    }
    
    // Cerrar con la tecla ESC (por defecto funciona, pero lo aseguramos)
    if (warningDialog) {
        warningDialog.addEventListener('cancel', function(e) {
            warningDialog.close();
        });
    }
});