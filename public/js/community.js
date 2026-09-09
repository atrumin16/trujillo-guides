(function () {
  var btn = document.getElementById('copy-link');
  if (btn) {
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(location.href).then(function () {
        btn.textContent = 'Copiado';
        setTimeout(function () { btn.textContent = 'Copiar enlace'; }, 1600);
      }).catch(function () {});
    });
  }
  if (document.querySelector('pre.mermaid')) {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    s.onload = function () {
      if (window.mermaid) window.mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'strict' });
    };
    document.head.appendChild(s);
  }
})();
