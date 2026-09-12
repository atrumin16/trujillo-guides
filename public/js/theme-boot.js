(function () {
  try {
    var theme = localStorage.getItem('trujillo_theme') || localStorage.getItem('atm_theme') || 'dark';
    if (theme !== 'light' && theme !== 'dark') theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#080c14');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
