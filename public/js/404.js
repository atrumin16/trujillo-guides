(function () {
  'use strict';
  var pathEl = document.getElementById('nf-path');
  if (pathEl) pathEl.textContent = window.location.pathname || '/';
})();
