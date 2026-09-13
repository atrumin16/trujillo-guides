// Alias to /js/guides.js
(function () {
  'use strict';
  if (window.__atmGuidesLoaded) return;
  var s = document.createElement('script');
  s.src = '/js/guides.js';
  s.defer = true;
  document.head.appendChild(s);
})();
