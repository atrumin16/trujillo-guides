const SUPPORTED_LANGUAGES = [
  { id: 'es', code: 'es', name: 'Español', flag: '🇪🇸' },
  { id: 'en', code: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'ca', code: 'ca', name: 'Català', flag: '🇦🇩' },
  { id: 'fr', code: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'de', code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'it', code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { id: 'pt', code: 'pt', name: 'Português', flag: '🇵🇹' },
  { id: 'nl', code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { id: 'pl', code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { id: 'sv', code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { id: 'ru', code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { id: 'zh', code: 'zh', name: '中文', flag: '🇨🇳' },
  { id: 'ja', code: 'ja', name: '日本語', flag: '🇯🇵' },
  { id: 'ko', code: 'ko', name: '한국어', flag: '🇰🇷' },
  { id: 'ar', code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { id: 'hi', code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
];

window.ATM_LANGS = SUPPORTED_LANGUAGES;
window.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;

window.ATM_UI = {
  es: {
    studio: 'Studio', profile: 'Perfil', index: 'Índice', home: 'Inicio',
    kicker: 'Documentación técnica',
    'hero-title': 'Guías de ingeniería y runbooks',
    'hero-sub': 'Arquitecturas reales. En portada, las que sus autores fijan como mejores.',
    search: 'Buscar guías…', featured: 'Destacadas', voted: 'Más votadas', all: 'Todas',
    results: 'Resultados', empty: 'Nada coincide.',
    emptyHome: 'Aún no hay guías fijadas. Ábrela y pulsa Fijar.',
    pinned: 'Fijada', pin: 'Fijar', copy: 'Copiar enlace', copied: 'Copiado',
    like: 'Me gusta', dislike: 'No me gusta', share: 'Compartir', save: 'Guardar', saved: 'Guardada',
    follow: 'Seguir', following: 'Siguiendo', theme: 'Tema', footer: '© 2026 ATM Software Labs',
    docLabel: 'Documento',
    filterAuthor: 'Autor', filterSort: 'Orden', sortLikes: 'Más votadas',
    sortRecent: 'Más recientes', sortTitle: 'Título', onlyPinned: 'Solo fijadas',
    comments: 'Comentarios', files: 'Archivos', addFile: 'Añadir archivo',
    writeComment: 'Escribe un comentario…', publishComment: 'Publicar',
    edited: 'editado', confirmDeleteComment: '¿Borrar este comentario?',
    yourName: 'Tu nombre', reply: 'Responder', noComments: 'Sé el primero en comentar.',
    noFiles: 'Nadie ha subido archivos todavía.', needLogin: 'Pon tu nombre para continuar.',
    fileTooBig: 'Máximo 350 KB.', fileError: 'No se pudo subir.',
    onlySaved: 'Guardadas', onlyFollowing: 'Siguiendo',
    login: 'Entrar', guestContinue: 'Continuar como invitado',
    guestHint: 'Solo el nombre. Sin correo ni contraseña.',
    enterName: 'Trujillo Guides', studioLogin: 'Tengo cuenta en Studio',
    changeName: 'Cambiar nombre', preview: 'Ver', download: 'Descargar',
    previewFail: 'Este tipo no se puede previsualizar. Descárgalo si lo necesitas.',
    logout: 'Salir',
    newGuide: 'Publicar', editGuide: 'Editar publicación', edit: 'Editar', delete: 'Borrar',
    publishKicker: 'Studio → Guides', writeKind: 'Tipo',
    writeSummary: 'Resumen', dropHint: 'Suelta archivos aquí: texto al cuerpo, el resto se adjunta.',
    'kind-guide': 'Guía', 'kind-post': 'Post', 'kind-opinion': 'Opinión', 'kind-analysis': 'Análisis',
    'kind-brief': 'Brief', 'kind-note': 'Nota', 'kind-research': 'Research', 'kind-changelog': 'Changelog',
    nfTitle: 'Esta pieza no existe',
    nfLede: 'La URL no está publicada, se ha movido o el identificador es incorrecto.',
    nfHome: 'Volver al índice', nfSuggest: 'Sugerencias',
    publish: 'Publicar', published: 'Publicada', publishing: 'Publicando…',
    writeHint: 'Guías, posts, opiniones, análisis, briefs y notas. Markdown, HTML, código, datos o un archivo.',
    writeTitle: 'Título', writeBody: 'Contenido', writeFormat: 'Formato',
    importFile: 'Importar archivo', attachFiles: 'Imágenes y adjuntos',
    openAi: 'Abrir Trujillo AI', confirmDelete: '¿Borrar esta guía del índice?',
    needStudio: 'Entra con Studio para publicar.', cancel: 'Cancelar', confirm: 'Confirmar'
  },
  en: {
    studio: 'Studio', profile: 'Profile', index: 'Index', home: 'Home',
    kicker: 'Technical documentation',
    'hero-title': 'Engineering guides and runbooks',
    'hero-sub': 'Real architectures. The homepage shows the ones authors pin as best.',
    search: 'Search guides…', featured: 'Featured', voted: 'Most liked', all: 'All',
    results: 'Results', empty: 'Nothing matches.',
    emptyHome: 'No pinned guides yet. Open one and tap Pin.',
    pinned: 'Pinned', pin: 'Pin', copy: 'Copy link', copied: 'Copied',
    like: 'Like', dislike: 'Dislike', share: 'Share', save: 'Save', saved: 'Saved',
    follow: 'Follow', following: 'Following', theme: 'Theme', footer: '© 2026 ATM Software Labs',
    docLabel: 'Document',
    filterAuthor: 'Author', filterSort: 'Sort', sortLikes: 'Most liked',
    sortRecent: 'Newest', sortTitle: 'Title', onlyPinned: 'Pinned only',
    comments: 'Comments', files: 'Files', addFile: 'Add file',
    writeComment: 'Write a comment…', publishComment: 'Post',
    edited: 'edited', confirmDeleteComment: 'Delete this comment?',
    yourName: 'Your name', reply: 'Reply', noComments: 'Be the first to comment.',
    noFiles: 'No files yet.', needLogin: 'Enter your name to continue.',
    fileTooBig: 'Max 350 KB.', fileError: 'Upload failed.',
    onlySaved: 'Saved', onlyFollowing: 'Following',
    login: 'Sign in', guestContinue: 'Continue as guest',
    guestHint: 'Just a name. No email or password.',
    enterName: 'What should we call you?', studioLogin: 'I have a Studio account',
    changeName: 'Change name', preview: 'View', download: 'Download',
    previewFail: 'This type cannot be previewed. Download it if you need it.',
    logout: 'Log out',
    newGuide: 'Publish', editGuide: 'Edit post', edit: 'Edit', delete: 'Delete',
    publishKicker: 'Studio → Guides', writeKind: 'Type',
    writeSummary: 'Summary', dropHint: 'Drop files here: text becomes the body, the rest is attached.',
    'kind-guide': 'Guide', 'kind-post': 'Post', 'kind-opinion': 'Opinion', 'kind-analysis': 'Analysis',
    'kind-brief': 'Brief', 'kind-note': 'Note', 'kind-research': 'Research', 'kind-changelog': 'Changelog',
    nfTitle: 'This piece does not exist',
    nfLede: 'The URL is unpublished, moved, or the identifier is wrong.',
    nfHome: 'Back to index', nfSuggest: 'Suggestions',
    publish: 'Publish', published: 'Published', publishing: 'Publishing…',
    writeHint: 'Guides, posts, opinions, analysis, briefs and notes. Markdown, HTML, code, data or a file.',
    writeTitle: 'Title', writeBody: 'Content', writeFormat: 'Format',
    importFile: 'Import file', attachFiles: 'Images and attachments',
    openAi: 'Open Trujillo AI', confirmDelete: 'Remove this guide from the index?',
    needStudio: 'Sign in with Studio to publish.', cancel: 'Cancel', confirm: 'Confirm'
  },
  ca: {
    studio: 'Studio', profile: 'Perfil', index: 'Índex',
    kicker: 'Documentació tècnica',
    'hero-title': 'Guies d’enginyeria i runbooks',
    'hero-sub': 'Arquitectures reals. A la portada, les que els autors marquen com a millors.',
    search: 'Cercar guies…', featured: 'Destacades', voted: 'Més votades',
    results: 'Resultats', empty: 'Res no coincideix.',
    emptyHome: 'Encara no hi ha guies fixades. Obre’n una i prem Fijar.',
    pinned: 'Fixada', pin: 'Fixa', copy: 'Copia l’enllaç', copied: 'Copiat',
    like: 'M’agrada', theme: 'Tema', footer: '© 2026 ATM Software Labs'
  },
  fr: {
    studio: 'Studio', profile: 'Profil', index: 'Index',
    kicker: 'Documentation technique',
    'hero-title': 'Guides d’ingénierie et runbooks',
    'hero-sub': 'Architectures réelles. La une montre celles que les auteurs épinglent.',
    search: 'Rechercher…', featured: 'À la une', voted: 'Les plus aimés',
    results: 'Résultats', empty: 'Aucun résultat.',
    emptyHome: 'Pas encore de guides épinglés.',
    pinned: 'Épinglé', pin: 'Épingler', copy: 'Copier le lien', copied: 'Copié',
    like: 'J’aime', theme: 'Thème', footer: '© 2026 ATM Software Labs'
  },
  de: {
    studio: 'Studio', profile: 'Profil', index: 'Index',
    kicker: 'Technische Dokumentation',
    'hero-title': 'Engineering-Guides und Runbooks',
    'hero-sub': 'Echte Architekturen. Die Startseite zeigt die angepinnten Besten.',
    search: 'Suchen…', featured: 'Hervorgehoben', voted: 'Beliebteste',
    results: 'Ergebnisse', empty: 'Nichts gefunden.',
    emptyHome: 'Noch keine angepinnten Guides.',
    pinned: 'Angeheftet', pin: 'Anheften', copy: 'Link kopieren', copied: 'Kopiert',
    like: 'Gefällt mir', theme: 'Thema', footer: '© 2026 ATM Software Labs'
  },
  it: {
    studio: 'Studio', profile: 'Profilo', index: 'Indice',
    kicker: 'Documentazione tecnica',
    'hero-title': 'Guide di ingegneria e runbook',
    'hero-sub': 'Architetture reali. In home, quelle che gli autori fissano.',
    search: 'Cerca…', featured: 'In evidenza', voted: 'Più votate',
    results: 'Risultati', empty: 'Nessun risultato.',
    emptyHome: 'Nessuna guida fissata.',
    pinned: 'Fissata', pin: 'Fissa', copy: 'Copia link', copied: 'Copiato',
    like: 'Mi piace', theme: 'Tema', footer: '© 2026 ATM Software Labs'
  },
  pt: {
    studio: 'Studio', profile: 'Perfil', index: 'Índice',
    kicker: 'Documentação técnica',
    'hero-title': 'Guias de engenharia e runbooks',
    'hero-sub': 'Arquiteturas reais. A capa mostra as que os autores fixam.',
    search: 'Pesquisar…', featured: 'Destaques', voted: 'Mais votadas',
    results: 'Resultados', empty: 'Nada encontrado.',
    emptyHome: 'Ainda não há guias fixadas.',
    pinned: 'Fixada', pin: 'Fixar', copy: 'Copiar link', copied: 'Copiado',
    like: 'Gosto', theme: 'Tema', footer: '© 2026 ATM Software Labs'
  },
  zh: {
    studio: 'Studio', profile: '主页', index: '目录',
    kicker: '技术文档',
    'hero-title': '工程指南与运行手册',
    'hero-sub': '真实架构。首页只展示作者置顶的精品。',
    search: '搜索指南…', featured: '精选', voted: '最受欢迎',
    results: '结果', empty: '没有匹配。',
    emptyHome: '还没有置顶指南。',
    pinned: '已置顶', pin: '置顶', copy: '复制链接', copied: '已复制',
    like: '喜欢', theme: '主题', footer: '© 2026 ATM Software Labs'
  },
  ja: {
    studio: 'Studio', profile: 'プロフィール', index: '目次',
    kicker: '技術ドキュメント',
    'hero-title': 'エンジニアリングガイド',
    'hero-sub': '本番のアーキテクチャ。ピン留めされたものがトップに出ます。',
    search: '検索…', featured: '注目', voted: '人気',
    results: '結果', empty: '一致なし。',
    emptyHome: 'まだピン留めがありません。',
    pinned: 'ピン留め', pin: 'ピン', copy: 'リンクをコピー', copied: 'コピーしました',
    like: 'いいね', theme: 'テーマ', footer: '© 2026 ATM Software Labs'
  },
  ar: {
    studio: 'Studio', profile: 'الملف', index: 'الفهرس',
    kicker: 'توثيق تقني',
    'hero-title': 'أدلة هندسية وكتيبات تشغيل',
    'hero-sub': 'بنى حقيقية. الصفحة الرئيسية تعرض ما يثبّته المؤلفون.',
    search: 'بحث…', featured: 'مميزة', voted: 'الأكثر إعجاباً',
    results: 'نتائج', empty: 'لا نتائج.',
    emptyHome: 'لا أدلة مثبتة بعد.',
    pinned: 'مثبّتة', pin: 'تثبيت', copy: 'نسخ الرابط', copied: 'تم النسخ',
    like: 'إعجاب', theme: 'السمة', footer: '© 2026 ATM Software Labs'
  },
  nl: {
    studio: 'Studio', profile: 'Profiel', index: 'Index', home: 'Home',
    kicker: 'Technische documentatie',
    'hero-title': 'Engineeringgidsen en runbooks',
    'hero-sub': 'Echte architecturen. Op de voorpagina staan de beste vastgemaakte gidsen.',
    search: 'Zoek gidsen…', featured: 'Uitgelicht', voted: 'Meest gestemd', all: 'Alle',
    results: 'Resultaten', empty: 'Niets gevonden.',
    emptyHome: 'Nog geen vastgemaakte gidsen.',
    pinned: 'Vastgemaakt', pin: 'Vastmaken', copy: 'Link kopiëren', copied: 'Gekopieerd',
    like: 'Vind ik leuk', theme: 'Thema', footer: '© 2026 ATM Software Labs'
  },
  pl: {
    studio: 'Studio', profile: 'Profil', index: 'Indeks', home: 'Start',
    kicker: 'Dokumentacja techniczna',
    'hero-title': 'Przewodniki inżynieryjne i runbooki',
    'hero-sub': 'Prawdziwe architektury. Na stronie głównej te przypięte przez autorów.',
    search: 'Szukaj przewodników…', featured: 'Wyróżnione', voted: 'Najwyżej oceniane', all: 'Wszystkie',
    results: 'Wyniki', empty: 'Brak wyników.',
    emptyHome: 'Brak przypiętych przewodników.',
    pinned: 'Przypięty', pin: 'Przypnij', copy: 'Kopiuj link', copied: 'Skopiowano',
    like: 'Polub', theme: 'Motyw', footer: '© 2026 ATM Software Labs'
  },
  sv: {
    studio: 'Studio', profile: 'Profil', index: 'Index', home: 'Hem',
    kicker: 'Teknisk dokumentation',
    'hero-title': 'Ingenjörsguider och runbooks',
    'hero-sub': 'Verkliga arkitekturer. På startsidan visas de guider författarna nålar fast.',
    search: 'Sök guider…', featured: 'Utvalda', voted: 'Mest röstade', all: 'Alla',
    results: 'Resultat', empty: 'Inget matchar.',
    emptyHome: 'Inga nålade guider ännu.',
    pinned: 'Nålad', pin: 'Nåla', copy: 'Kopiera länk', copied: 'Kopierad',
    like: 'Gilla', theme: 'Tema', footer: '© 2026 ATM Software Labs'
  },
  ru: {
    studio: 'Studio', profile: 'Профиль', index: 'Индекс', home: 'Главная',
    kicker: 'Техническая документация',
    'hero-title': 'Инженерные руководства и ранбуки',
    'hero-sub': 'Реальные архитектуры. На главной — лучшее, закрепленное авторами.',
    search: 'Поиск руководств…', featured: 'Избранное', voted: 'Популярное', all: 'Все',
    results: 'Результаты', empty: 'Ничего не найдено.',
    emptyHome: 'Пока нет закрепленных руководств.',
    pinned: 'Закреплено', pin: 'Закрепить', copy: 'Копировать ссылку', copied: 'Скопировано',
    like: 'Нравится', theme: 'Тема', footer: '© 2026 ATM Software Labs'
  },
  ko: {
    studio: 'Studio', profile: '프로필', index: '색인', home: '홈',
    kicker: '기술 문서',
    'hero-title': '엔지니어링 가이드 및 런북',
    'hero-sub': '실제 아키텍처. 홈에는 작성자가 고정한 최고의 가이드가 표시됩니다.',
    search: '가이드 검색…', featured: '추천', voted: '인기순', all: '전체',
    results: '결과', empty: '일치하는 항목이 없습니다.',
    emptyHome: '아직 고정된 가이드가 없습니다.',
    pinned: '고정됨', pin: '고정', copy: '링크 복사', copied: '복사됨',
    like: '좋아요', theme: '테마', footer: '© 2026 ATM Software Labs'
  },
  hi: {
    studio: 'Studio', profile: 'प्रोफ़ाइल', index: 'सूची', home: 'होम',
    kicker: 'तकनीकी दस्तावेज़',
    'hero-title': 'इंजीनियरिंग गाइड और रनबुक्स',
    'hero-sub': 'वास्तविक आर्किटेक्चर। होमपेज पर लेखकों द्वारा पिन की गई बेहतरीन गाइड।',
    search: 'गाइड खोजें…', featured: 'विशेष', voted: 'सर्वाधिक पसंद', all: 'सभी',
    results: 'परिणाम', empty: 'कोई परिणाम नहीं मिला।',
    emptyHome: 'अभी कोई पिन की गई गाइड नहीं है।',
    pinned: 'पिन किया गया', pin: 'पिन करें', copy: 'लिंक कॉपी करें', copied: 'कॉपी हो गया',
    like: 'पसंद करें', theme: 'थीम', footer: '© 2026 ATM Software Labs'
  }
};

(function () {
  function known(id) {
    id = String(id || '').toLowerCase().slice(0, 2);
    return window.ATM_LANGS.some(function (l) { return l.id === id || l.code === id; }) ? id : '';
  }

  window.atmLang = function () {
    try {
      var saved = known(localStorage.getItem('atm_lang'));
      if (saved) return saved;
    } catch (e) {}
    var nav = (navigator.language || 'es').toLowerCase();
    if (nav.indexOf('ca') === 0) return 'ca';
    if (nav.indexOf('zh') === 0) return 'zh';
    if (nav.indexOf('ja') === 0) return 'ja';
    if (nav.indexOf('ar') === 0) return 'ar';
    return known(nav.slice(0, 2)) || 'es';
  };

  window.atmT = function (key) {
    var lang = window.atmLang();
    var pack = window.ATM_UI[lang] || window.ATM_UI.es;
    return pack[key] || (window.ATM_UI.es[key] || key);
  };

  window.atmApplyUi = function (lang) {
    lang = known(lang) || window.atmLang();
    try { localStorage.setItem('atm_lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    var pack = window.ATM_UI[lang] || window.ATM_UI.es;
    pack = Object.assign({}, window.ATM_UI.es || {}, pack);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (pack[key]) el.textContent = pack[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (pack[key]) el.setAttribute('placeholder', pack[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      if (pack[key]) {
        el.setAttribute('title', pack[key]);
        el.setAttribute('aria-label', pack[key]);
      }
    });
    var btn = document.getElementById('lang-flag-btn');
    var meta = window.ATM_LANGS.filter(function (l) { return l.id === lang || l.code === lang; })[0];
    if (btn && meta) {
      btn.querySelector('.flag').textContent = meta.flag;
      btn.querySelector('.lang-code').textContent = (meta.code || meta.id).toUpperCase();
      btn.setAttribute('title', meta.name);
    }
    document.querySelectorAll('.lang-option').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    if (typeof window.setLanguage === 'function' && (lang === 'es' || lang === 'en')) {
      window.setLanguage(lang);
    }
    document.dispatchEvent(new CustomEvent('atm:lang', { detail: { lang: lang } }));
  };
})();
