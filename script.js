/**
 * OpenTune App - Main JavaScript
 * Versión: 1.0.0 
 * Descripción: Script principal para la aplicación web OpenTune
 */

// Configuración de constantes de la aplicación
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
    api: {
      github: 'https://api.github.com/repos/'
    },
    demo: 'https://appetize.io/app/b_yb62tcjuqzqjvctnswv3krpnmm'
  },
  elements: {
    theme: {
      selector: 'themeSelector',
      icon: 'themeIcon'
    },
    language: {
      selector: 'languageSelector',
      dialog: 'languageDialog',
      text: 'languageText'
    },
    warning: {
      button: 'triggerDialogButton',
      dialog: 'warningDialog',
      overlay: 'dialogOverlay',
      dismiss: 'dismissButton',
      proceed: 'proceedButton'
    },
    logo: 'logo'
  },
  checkInterval: 60 * 60 * 1000 // 1 hora
};

/**
 * Clase principal para manejar la aplicación
 */
class OpenTuneApp {
  constructor(config) {
    this.config = config;
    this.themeManager = new ThemeManager(config.elements.theme);
    this.languageManager = new LanguageManager(config.elements.language);
    this.dialogManager = new DialogManager(config.elements.warning, config.urls.demo);
    this.logoManager = new LogoManager(config.elements.logo);
    this.versionManager = new VersionManager(config.repositories);
    this.carouselManager = null; // Inicializar si es necesario
  }

  /**
   * Inicializa toda la aplicación
   */
  init() {
    // Inicializar todos los componentes
    this.themeManager.init();
    this.languageManager.init();
    this.dialogManager.init();
    this.logoManager.init();
    this.versionManager.init();

    // Configurar marked.js para renderizar correctamente Markdown
    this.configureMarkdown();
    
    console.log('OpenTune App inicializada correctamente');
  }

  /**
   * Configura las opciones de marked.js
   */
  configureMarkdown() {
    if (typeof marked !== 'undefined') {
      marked.setOptions({
        breaks: true,      // Permitir saltos de línea simples
        gfm: true,         // GitHub Flavored Markdown
        headerIds: false,  // Desactivar IDs automáticos en encabezados
        sanitize: false    // No sanitizar para permitir HTML
      });
    }
  }
}

/**
 * Administrador del tema (claro/oscuro)
 */
class ThemeManager {
  constructor(elements) {
    this.selector = document.getElementById(elements.selector);
    this.icon = document.getElementById(elements.icon);
  }

  /**
   * Inicializa el administrador de temas
   */
  init() {
    if (!this.selector || !this.icon) return;

    // Cargar tema guardado o detectar preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.applyTheme(savedTheme);
    } else {
      this.detectThemePreference();
    }

    // Agregar escucha para cambio de tema
    this.selector.addEventListener('click', () => this.toggleTheme());
  }

  /**
   * Detecta la preferencia de tema del sistema
   */
  detectThemePreference() {
    const themePreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.applyTheme(themePreference);
  }

  /**
   * Aplica un tema específico
   * @param {string} theme - El tema a aplicar ('dark' o 'light')
   */
  applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
    this.updateThemeIcon(theme);
  }

  /**
   * Actualiza el icono según el tema
   * @param {string} theme - El tema actual ('dark' o 'light')
   */
  updateThemeIcon(theme) {
    this.icon.textContent = theme === 'dark' ? 'light_mode' : 'brightness_6';
  }

  /**
   * Alterna entre los temas claro y oscuro
   */
  toggleTheme() {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }
}

/**
 * Administrador del selector de idioma
 */
class LanguageManager {
  constructor(elements) {
    this.selector = document.getElementById(elements.selector);
    this.dialog = document.getElementById(elements.dialog);
    this.text = document.getElementById(elements.text);
  }

  /**
   * Inicializa el administrador de idiomas
   */
  init() {
    if (!this.selector || !this.dialog) return;

    // Configurar el evento para abrir el diálogo
    this.selector.addEventListener('click', () => {
      this.dialog.showModal();
    });

    // Configurar funciones globales para la gestión de idiomas
    window.closeDialog = () => {
      this.dialog.close();
    };

    window.setLanguage = (language, url) => {
      if (this.text) {
        this.text.textContent = language;
      }
      window.closeDialog();
      window.location.href = url;
    };
  }
}

/**
 * Administrador de diálogos
 */
class DialogManager {
  constructor(elements, demoUrl) {
    this.button = document.getElementById(elements.button);
    this.dialog = document.getElementById(elements.dialog);
    this.overlay = document.getElementById(elements.overlay);
    this.dismissButton = document.getElementById(elements.dismiss);
    this.proceedButton = document.getElementById(elements.proceed);
    this.demoUrl = demoUrl;
  }

  /**
   * Inicializa el administrador de diálogos
   */
  init() {
    if (!this.button || !this.dialog || !this.overlay) return;

    // Configurar evento para mostrar el diálogo
    this.button.addEventListener('click', () => {
      this.dialog.showModal();
      this.overlay.style.display = 'block';
    });

    // Configurar evento para cerrar el diálogo
    if (this.dismissButton) {
      this.dismissButton.addEventListener('click', () => {
        this.dialog.close();
        this.overlay.style.display = 'none';
      });
    }

    // Configurar evento para proceder con la redirección
    if (this.proceedButton) {
      this.proceedButton.addEventListener('click', () => {
        window.location.href = this.demoUrl;
      });
    }
  }
}

/**
 * Administrador de efectos del logo
 */
class LogoManager {
  constructor(element) {
    this.logo = document.getElementById(element);
  }

  /**
   * Inicializa el administrador del logo
   */
  init() {
    if (!this.logo) return;

    // Aplicar efectos al logo después de que se cargue
    this.logo.addEventListener('load', () => {
      this.applyLogoEffects();
    });
  }

  /**
   * Aplica efectos visuales al logo
   */
  applyLogoEffects() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Para evitar errores CORS
      img.src = this.logo.src;

      img.onload = () => {
        // Establecer dimensiones del canvas
        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar imagen en el canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        try {
          // Obtener datos de los píxeles
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;

          // Variables para acumular colores
          let r = 0, g = 0, b = 0, total = 0;

          // Calcular color promedio
          for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
            total++;
          }

          r = Math.floor(r / total);
          g = Math.floor(g / total);
          b = Math.floor(b / total);

          // Aplicar color de resplandor
          const glowColor = `rgb(${r}, ${g}, ${b})`;
          this.logo.style.setProperty('--logo-glow-color', glowColor);
        } catch (e) {
          console.error('Error al procesar la imagen del logo:', e);
          // Aplicar un color de resplandor predeterminado
          this.logo.style.setProperty('--logo-glow-color', 'rgba(255, 255, 255, 0.5)');
        }
      };

      img.onerror = () => {
        console.error('No se pudo cargar la imagen del logo');
        // Aplicar un color de resplandor predeterminado
        this.logo.style.setProperty('--logo-glow-color', 'rgba(255, 255, 255, 0.5)');
      };
    } catch (e) {
      console.error('Error al inicializar efectos del logo:', e);
    }
  }
}

/**
 * Administrador de versiones para diferentes plataformas
 */
class VersionManager {
  constructor(repositories) {
    this.repositories = repositories;
    this.platformHandlers = {};
  }

  /**
   * Inicializa el administrador de versiones para todas las plataformas
   */
  init() {
    // Inicializar manejadores para cada plataforma
    Object.keys(this.repositories).forEach(platform => {
      const config = this.repositories[platform];
      
      // Crear manejador según la plataforma
      if (platform === 'android') {
        this.platformHandlers[platform] = new AndroidVersionHandler(config);
      } else if (platform === 'windows') {
        this.platformHandlers[platform] = new WindowsVersionHandler(config);
      }
      
      // Inicializar el manejador
      if (this.platformHandlers[platform]) {
        this.platformHandlers[platform].init();
      }
    });
  }
}

/**
 * Clase base para manejadores de versión
 */
class BaseVersionHandler {
  constructor(config) {
    this.repo = config.repo;
    this.currentVersion = config.currentVersion;
    this.latestVersion = config.currentVersion;
    this.downloadFormat = config.downloadFormat;
    this.elements = config.elements;
    
    // Obtener referencias a elementos del DOM
    this.versionElement = document.getElementById(this.elements.version);
    this.downloadBtn = document.getElementById(this.elements.download);
    this.downloadText = document.getElementById(this.elements.text);
  }
  
  /**
   * Inicializa el manejador de versiones
   */
  async init() {
    if (!this.versionElement && !this.downloadBtn) return;
    
    // Verificar versión al iniciar
    await this.checkNewVersion();
    
    // Configurar verificación periódica
    setInterval(() => this.checkNewVersion(), APP_CONFIG.checkInterval);
  }
  
  /**
   * Verifica si hay una nueva versión disponible
   */
  async checkNewVersion() {
    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases/latest`);
      if (!response.ok) {
        throw new Error(`Error al verificar la versión: ${response.status}`);
      }

      const data = await response.json();
      this.latestVersion = data.tag_name;

      // Actualizar elemento de versión si existe
      if (this.versionElement) {
        this.versionElement.textContent = data.tag_name;
      }

      // Actualizar botón de descarga si existe
      this.updateDownloadButton();

      return data.tag_name;
    } catch (error) {
      console.error(`Error al verificar versión:`, error);
      if (this.versionElement) {
        this.versionElement.textContent = 'Error al obtener versión';
      }
      return null;
    }
  }
  
  /**
   * Actualiza el botón de descarga con la URL correcta
   */
  updateDownloadButton() {
    if (!this.downloadBtn) return;

    const version = this.latestVersion || this.currentVersion;
    const downloadUrl = `https://github.com/${this.repo}/releases/download/${this.downloadFormat.replace(/\{version\}/g, version)}`;

    this.downloadBtn.href = downloadUrl;

    if (this.downloadText && this.latestVersion !== this.currentVersion) {
      this.downloadText.textContent = 'Nueva versión disponible!';
    }
  }
}

/**
 * Manejador de versiones para Android
 */
class AndroidVersionHandler extends BaseVersionHandler {
  constructor(config) {
    super(config);
    
    // Preparar diálogos específicos para Android
    this.initDialogs();
  }
  
  /**
   * Inicializa los diálogos específicos para Android
   */
  initDialogs() {
    const changelogDialog = document.getElementById(this.elements.changelog);
    const versionsDialog = document.getElementById(this.elements.versions);
    
    if (changelogDialog) {
      // Configurar objeto para gestionar el diálogo de changelog
      window.changelog = {
        element: changelogDialog,
        show: () => {
          if (!changelogDialog) return;
          changelogDialog.showModal();
          this.loadChangelog();
        },
        close: () => {
          if (!changelogDialog) return;
          changelogDialog.close();
        }
      };
    }
    
    if (versionsDialog) {
      // Configurar objeto para gestionar el diálogo de versiones
      window.versions = {
        element: versionsDialog,
        show: () => {
          if (!versionsDialog) return;
          versionsDialog.showModal();
          this.loadVersions();
        },
        close: () => {
          if (!versionsDialog) return;
          versionsDialog.close();
        }
      };
    }
  }
  
  /**
   * Carga las notas de cambios en el diálogo correspondiente
   */
  async loadChangelog() {
    const content = document.getElementById(this.elements.changelogContent);
    if (!content) return;

    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases/latest`);
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      if (!data.body) {
        throw new Error('No se encontraron notas disponibles');
      }

      content.innerHTML = `
        <div class="card">
          <div class="header">
            <div class="title">Versión ${data.tag_name}</div>
            <div class="subtitle">${new Date(data.published_at).toLocaleDateString()}</div>
          </div>
          <div class="content markdown">
            ${marked.parse(data.body)}
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error al cargar el changelog:', error);
      content.innerHTML = `<div class="error-text">Error cargando los cambios: ${error.message}</div>`;
    }
  }
  
  /**
   * Carga la lista de versiones en el diálogo correspondiente
   */
  async loadVersions() {
    const list = document.getElementById(this.elements.versionsList);
    if (!list) return;

    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases`);
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const releases = await response.json();

      list.innerHTML = releases.map(release => `
        <div class="card m-bottom-2">
          <div class="header">
            <div class="title">${release.tag_name}</div>
            <div class="subtitle">${new Date(release.published_at).toLocaleDateString()}</div>
          </div>
          <div class="action-bar">
            <a href="${release.assets[0]?.browser_download_url || '#'}" class="button">
              <i class="material-icons">download</i> Descargar
            </a>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error al cargar las versiones:', error);
      list.innerHTML = `<div class="error-text">Error cargando las versiones: ${error.message}</div>`;
    }
  }
}

/**
 * Manejador de versiones para Windows
 */
class WindowsVersionHandler extends BaseVersionHandler {
  constructor(config) {
    super(config);
    
    // Configurar funciones globales para diálogos de Windows
    this.initDialogs();
  }
  
  /**
   * Inicializa los diálogos específicos para Windows
   */
  initDialogs() {
    const changelogDialog = document.getElementById(this.elements.changelog);
    const versionsDialog = document.getElementById(this.elements.versions);
    
    // Configurar funciones globales para Windows
    if (changelogDialog) {
      window.showChangelogWindows = () => {
        changelogDialog.showModal();
        this.loadChangelog();
      };
      
      window.closeChangelogWindows = () => {
        changelogDialog.close();
      };
    }
    
    if (versionsDialog) {
      window.showVersionsWindows = () => {
        versionsDialog.showModal();
        this.loadVersions();
      };
      
      window.closeVersionsWindows = () => {
        versionsDialog.close();
      };
    }
  }
  
  /**
   * Carga las notas de cambios en el diálogo correspondiente
   */
  async loadChangelog() {
    const content = document.getElementById(this.elements.changelogContent);
    if (!content) return;

    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases/latest`);
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();

      content.innerHTML = `
        <div class="card">
          <div class="header">
            <div class="title">Versión ${data.tag_name}</div>
            <div class="subtitle">${new Date(data.published_at).toLocaleDateString()}</div>
          </div>
          <div class="content markdown">
            ${marked.parse(data.body || 'No hay notas disponibles')}
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error al cargar el changelog de Windows:', error);
      content.innerHTML = `<div class="error-text">Error cargando los cambios: ${error.message}</div>`;
    }
  }
  
  /**
   * Carga la lista de versiones en el diálogo correspondiente
   */
  async loadVersions() {
    const list = document.getElementById(this.elements.versionsList);
    if (!list) return;

    try {
      const response = await fetch(`${APP_CONFIG.urls.api.github}${this.repo}/releases`);
      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const releases = await response.json();

      list.innerHTML = releases.map(release => `
        <div class="card m-bottom-2">
          <div class="header">
            <div class="title">${release.tag_name}</div>
            <div class="subtitle">${new Date(release.published_at).toLocaleDateString()}</div>
          </div>
          <div class="action-bar">
            <a href="${release.assets[0]?.browser_download_url || '#'}" class="button">
              <i class="material-icons">download</i> Descargar
            </a>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error al cargar las versiones de Windows:', error);
      list.innerHTML = `<div class="error-text">Error cargando las versiones: ${error.message}</div>`;
    }
  }
}

/**
 * Administrador del carrusel de imágenes
 */
class CarouselManager {
  constructor() {
    this.images = document.querySelectorAll('.carousel-image');
    this.popupOverlay = document.getElementById('popupOverlay');
    this.popupImage = document.getElementById('popupImage');
    this.closePopup = document.getElementById('closePopup');
    this.startX = 0;
  }

  /**
   * Inicializa el administrador del carrusel
   */
  init() {
    if (!this.images.length || !this.popupOverlay) return;

    // Configurar eventos para abrir el popup
    this.images.forEach((image) => {
      image.addEventListener('click', (e) => {
        this.popupImage.src = e.target.src;
        this.popupOverlay.style.display = 'flex';
      });
    });

    // Cerrar popup al hacer clic fuera de la imagen
    this.popupOverlay.addEventListener('click', (e) => {
      if (e.target === this.popupOverlay) {
        this.popupOverlay.style.display = 'none';
      }
    });

    // Cerrar popup con el botón de cierre
    if (this.closePopup) {
      this.closePopup.addEventListener('click', () => {
        this.popupOverlay.style.display = 'none';
      });
    }

    // Configurar eventos para deslizar
    this.popupOverlay.addEventListener('touchstart', (e) => {
      this.startX = e.touches[0].clientX;
    });

    this.popupOverlay.addEventListener('touchend', (e) => {
      let endX = e.changedTouches[0].clientX;
      if (this.startX - endX > 50) {
        // Deslizar a la izquierda, mostrar siguiente imagen
        this.nextImage();
      } else if (endX - this.startX > 50) {
        // Deslizar a la derecha, mostrar imagen anterior
        this.prevImage();
      }
    });
  }

  /**
   * Muestra la siguiente imagen en el carrusel
   */
  nextImage() {
    let currentIndex = Array.from(this.images).findIndex((img) => img.src === this.popupImage.src);
    let nextIndex = (currentIndex + 1) % this.images.length;
    this.popupImage.src = this.images[nextIndex].src;
  }

  /**
   * Muestra la imagen anterior en el carrusel
   */
  prevImage() {
    let currentIndex = Array.from(this.images).findIndex((img) => img.src === this.popupImage.src);
    let prevIndex = (currentIndex - 1 + this.images.length) % this.images.length;
    this.popupImage.src = this.images[prevIndex].src;
  }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  const app = new OpenTuneApp(APP_CONFIG);
  app.init();
  
  // Inicializar el carrusel si existe
  const carouselImages = document.querySelectorAll('.carousel-image');
  const popupOverlay = document.getElementById('popupOverlay');
  
  if (carouselImages.length && popupOverlay) {
    app.carouselManager = new CarouselManager();
    app.carouselManager.init();
  }
});
