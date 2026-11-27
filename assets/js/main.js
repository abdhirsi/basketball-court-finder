const themeButton = document.getElementById('theme');
const root = document.documentElement;
try { const saved = localStorage.getItem('hoops-theme'); if (saved === 'dark' || saved === 'light') root.dataset.theme = saved; } catch (_) {}
if (themeButton) themeButton.addEventListener('click', () => {
  const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('hoops-theme', root.dataset.theme); } catch (_) {}
});
