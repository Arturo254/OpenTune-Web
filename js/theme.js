/* Alternador de tema para páginas que no cargan script.js (soporte, beta, privacidad, 404). */
(() => {
  const btn = document.getElementById('themeSelector');
  const icon = document.getElementById('themeIcon');
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => { if (icon) icon.textContent = root.classList.contains('light-mode') ? 'dark_mode' : 'light_mode'; };
  sync();
  btn.addEventListener('click', () => {
    const light = root.classList.toggle('light-mode');
    try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
    sync();
  });
})();
