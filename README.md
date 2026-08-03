# OpenTune Web 🌐

<div align="center">
  <img src="./icon/icon-512-maskable.png" alt="OpenTune Logo" width="120"/>
  
  **Sitio Web Oficial de OpenTune**
  
  Cliente de YouTube Music con Material Design 3 para Android
  
  [![HTML5](https://img.shields.io/badge/HTML-5-E34C26.svg)](https://html5.org/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
  [![Material Design 3](https://img.shields.io/badge/Material%20Design-3%20Expressive-blue.svg)](https://m3.material.io/)
  [![License](https://img.shields.io/badge/License-GPL%203.0-yellow.svg)](./LICENSE)
  
  [🌐 Visitar](https://opentune.netlify.app/) • [📱 Descargar](https://github.com/Arturo254/OpenTune/releases) • [🐛 Soporte](https://opentune.netlify.app/from.html)
</div>

---

## 📖 ¿Qué es OpenTune Web?

**OpenTune Web** es el sitio web oficial de [OpenTune](https://github.com/Arturo254/OpenTune), una aplicación Android para reproducir YouTube Music con interfaz moderna basada en Material Design 3.

Este repositorio contiene:
- 🌐 **Sitio Web Completo**: HTML5, JavaScript y Material 3 Expressive
- 📱 **Responsive**: Optimizado para móviles, tablets y desktop
- ⚡ **Ligero**: Solo lo esencial, sin frameworks
- 🎨 **Material Design 3**: Interfaz moderna con colores expresivos

---

## ✨ Características del Sitio

- 🎯 **Información del Proyecto**: Características y funcionalidades de OpenTune
- 📥 **Descargas**: Enlaces directos a versiones estables
- 🖼️ **Galería de Capturas**: Carrusel interactivo de screenshots
- 💬 **Formulario de Contacto**: Sistema de soporte integrado
- 🌍 **Multilingüe**: Español, English, Português
- 🎨 **Material Design 3 Expressive**: Colores y componentes expresivos
- ⚙️ **GitHub API Integration**: Versiones y changelog en tiempo real

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura semántica |
| **JavaScript (ES6+)** | Interactividad y lógica |
| **Material Design 3** | Sistema de diseño expresivo |
| **CSS Personalizado** | Estilos y animaciones |
| **GitHub API** | Datos en tiempo real |
| **Tailwind CSS** | Utility classes (via CDN) |

---

## 📁 Estructura del Proyecto

```
OpenTune-Web/
├── index.html          # Página principal (Español)
├── en.html             # Página en English
├── pt_BR.html          # Página en Português
├── from.html           # Formulario de contacto
├── beta.html           # Página de beta
├── PdP.html            # Política de privacidad
├── 404.html            # Página 404
├── script.js           # Lógica principal (ES6+)
├── css/
│   ├── styles.css      # Estilos principales
│   ├── dialogs.css     # Diálogos Material 3
│   ├── carousel.css    # Carrusel de screenshots
│   └── ...
├── icon/               # Logo e iconos
├── img/                # Imágenes y assets
└── contribuidores/     # Página de colaboradores
```

---

## 🚀 Instalación y Uso

### Requisitos
- Servidor web local o Netlify
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/Arturo254/OpenTune-Web.git
cd OpenTune-Web
```

2. **Servir localmente**

**Opción 1: Python**
```bash
python -m http.server 8000
```

**Opción 2: Node.js (http-server)**
```bash
npx http-server
```

**Opción 3: Live Server (VS Code)**
- Instalar extensión "Live Server"
- Click derecho → "Open with Live Server"

3. **Acceder**
```
http://localhost:8000
```

---

## 📝 Páginas Principales

### `index.html`
- Hero section con información principal
- Características del proyecto
- Galería de screenshots (carrusel)
- Sección de descargas
- Estadísticas en tiempo real desde GitHub

### `script.js`
- **Gestión de temas**: Claro/Oscuro
- **Gestión de idiomas**: Cambio de página
- **Gestión de diálogos**: Modal del warning
- **Gestor de versiones**: Integración con GitHub API
- **Carrusel de screenshots**: Navegación táctil y con botones
- **Formulario de contacto**: Integración con Formspree

### `css/styles.css`
- Variables CSS para Material Design 3
- Componentes: botones, tarjetas, diálogos
- Animaciones y transiciones
- Responsive design

---

## 🔌 Integración con APIs

### GitHub API
- Obtiene versiones y changelog en tiempo real
- Obtiene estadísticas del repositorio
- Obtiene lista de contribuidores

```javascript
// Ejemplo de uso
const response = await fetch(`https://api.github.com/repos/Arturo254/OpenTune/releases/latest`);
```

### Formspree
- Maneja el envío de formularios de contacto

```javascript
// Endpoint
https://formspree.io/f/xgvallrq
```

---

## 🎨 Componentes Material Design 3

El sitio utiliza componentes expresivos de Material Design 3:

- ✅ **Botones**: Primary, Secondary, Filled
- ✅ **Tarjetas**: Glass-morphism con efectos
- ✅ **Diálogos**: Modales semitransparentes
- ✅ **Carrusel**: Con indicadores y navegación
- ✅ **Chips**: Etiquetas decorativas
- ✅ **Iconos**: Material Symbols Outlined

---

## 🌍 Internacionalización

El sitio soporta 3 idiomas:

- **Español** (`index.html`)
- **English** (`en.html`)
- **Português** (`pt_BR.html`)

Cambio de idioma mediante diálogo con selector de banderas.

---

## 📱 Responsive Design

- ✅ Móviles: 320px+
- ✅ Tablets: 768px+
- ✅ Desktop: 1024px+
- ✅ Pantallas grandes: 1280px+

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. **Fork** el repositorio
2. **Crea una rama** (`git checkout -b feature/mi-feature`)
3. **Commit tus cambios** (`git commit -am 'Agregar feature'`)
4. **Push** (`git push origin feature/mi-feature`)
5. **Abre un Pull Request**

### Áreas de Mejora
- 🎨 Mejoras de diseño
- 🐛 Fixes de bugs
- 🌍 Nuevas traducciones
- ⚡ Optimización de performance
- 📝 Mejoras de documentación

---

## 🐛 Reportar Problemas

Si encuentras un bug:

1. Verifica que no esté [reportado](https://github.com/Arturo254/OpenTune-Web/issues)
2. [Abre un nuevo issue](https://github.com/Arturo254/OpenTune-Web/issues/new)
3. O usa el [formulario de contacto](https://opentune.netlify.app/from.html)

---

## 📊 Hospedaje

El sitio está alojado en **Netlify** con deploy automático desde GitHub.

- **URL**: https://opentune.netlify.app/
- **Deploy**: Automático en cada push a `main`
- **Performance**: Optimizado y rápido

---

## 📱 Aplicación Android

¿Buscas la aplicación? Visita el repositorio principal:

👉 **[Arturo254/OpenTune](https://github.com/Arturo254/OpenTune)**

---

## 📄 Licencia

Este proyecto está bajo licencia **GPL 3.0**. Consulta [LICENSE](./LICENSE).

---

## 🙏 Créditos

- **Desarrollador**: [Arturo254](https://github.com/Arturo254)
- **Diseño**: Material Design 3 (Google)
- **Hosting**: Netlify
- **Contribuidores**: [Ver página de colaboradores](./contribuidores/contribuidores.html)

---

<div align="center">

**¿Te gusta OpenTune? ¡Dale una ⭐!**

© 2024 [Arturo.inc™](https://github.com/Arturo254). Todos los derechos reservados.

</div>
