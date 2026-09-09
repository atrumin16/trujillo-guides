(function () {
  'use strict';
  var pathEl = document.getElementById('nf-path');
  var hostEl = document.getElementById('nf-host');
  if (pathEl) pathEl.textContent = window.location.pathname || '/';
  if (hostEl) hostEl.textContent = window.location.hostname || 'guides.trujillomingorance.com';
})();
