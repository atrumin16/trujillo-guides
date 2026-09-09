// Trujillo Engineering Guides & Research Hub - Application Script

// Global Handlers for inline HTML onclick attributes
window.toggleChecklistStep = function(step) {
  if (window._trujilloChecklistToggle) {
    window._trujilloChecklistToggle(step);
  }
};

window.testDnsProtocol = function(proto, lang) {
  if (window._trujilloDnsTest) {
    window._trujilloDnsTest(proto, lang);
  }
};

// Google Translate Initialization

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ALL DOM ELEMENT SELECTORS (Declared First)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  const progressBar = document.getElementById('progress-bar');
  const backToTop = document.getElementById('back-to-top');
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabViews = document.querySelectorAll('.tab-view');
  const langDropdownBtn = document.getElementById('lang-dropdown-btn');
  const langMenu = document.getElementById('lang-menu');
  const langMenuItems = document.querySelectorAll('.lang-menu-item');
  const enSections = document.querySelectorAll('.content-en');
  const esSections = document.querySelectorAll('.content-es');
  const tocEn = document.getElementById('toc-en');
  const tocEs = document.getElementById('toc-es');
  const currentLangLabel = document.getElementById('current-lang-label');

  // Bilingual Container Elements
  const catalogEn = document.getElementById('catalog-en');
  const catalogEs = document.getElementById('catalog-es');
  const researchEn = document.getElementById('research-en');
  const researchEs = document.getElementById('research-es');
  const ecosystemEn = document.getElementById('ecosystem-en');
  const ecosystemEs = document.getElementById('ecosystem-es');

  // Header, Sidebar & Footer Elements for 100% Translation
  const tabGuidesLabel = document.getElementById('tab-guides-label');
  const tabResearchLabel = document.getElementById('tab-research-label');
  const tabEco = document.getElementById('tab-ecosystem-label');
  const brandBadge = document.getElementById('brand-badge');
  const headerProjectsLabel = document.getElementById('header-projects-label');
  const sidebarRole = document.getElementById('sidebar-role');
  const sidebarProjectsLabel = document.getElementById('sidebar-projects-label');
  const tocTitle = document.getElementById('toc-title');
  const searchInput = document.getElementById('search-input');
  const footerText = document.getElementById('footer-text');
  const footerProjectsLink = document.getElementById('footer-projects-link');
  const footerRootLink = document.getElementById('footer-root-link');

  // Filter Chips and Cards
  const filterChips = document.querySelectorAll('.filter-chip');
  const catalogCards = document.querySelectorAll('.catalog-card');
  const researchCards = document.querySelectorAll('.research-card');
  const shareBtn = document.getElementById('share-btn');

  // ==========================================
  // 2. THEME SWITCHER (Light / Dark Mode)
  // ==========================================
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('trujillo_theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
    }
    if (themeToggleBtn) {
      const isLight = theme === 'light';
      themeToggleBtn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      themeToggleBtn.setAttribute('title', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
  }

  const initialTheme = document.documentElement.getAttribute('data-theme') || 
                       localStorage.getItem('trujillo_theme') || 
                       (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('trujillo_theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================
  // 3. READING PROGRESS BAR & BACK TO TOP
  // ==========================================
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      if (progressBar) progressBar.style.width = `${progress}%`;
    }
    
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 4. NAVIGATION TABS (Guides vs Research vs Projects)
  // ==========================================
  function switchTab(targetTabId) {
    navTabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === targetTabId);
    });

    tabViews.forEach(view => {
      view.classList.toggle('active', view.id === targetTabId);
    });

    if (targetTabId === 'tab-research') {
      history.replaceState(null, '', '#research');
    } else if (targetTabId === 'tab-ecosystem') {
      history.replaceState(null, '', '#ecosystem');
    } else {
      const currentLang = localStorage.getItem('trujillo_guide_lang') || 'en';
      history.replaceState(null, '', `#${currentLang}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // ==========================================
  // 5. TRANSLATION & MULTILANGUAGE SELECTOR
  // ==========================================
  if (langDropdownBtn && langMenu) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      langMenu.classList.remove('open');
    });
  }

  function clearGoogleTranslateCookie() {
    const hostname = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
  }

  function triggerGoogleTranslate() {}
  }

  const filterTexts = {
    es: {
      all: 'Todos los Temas',
      edge: 'Cloud & Edge Architecture',
      identity: 'Zero-Trust & Identidad',
      ai: 'IA Aplicada & LLMs',
      security: 'Ciberseguridad & IAM'
    },
    en: {
      all: 'All Topics',
      edge: 'Cloud & Edge Architecture',
      identity: 'Zero-Trust & Identity',
      ai: 'Applied AI & LLMs',
      security: 'Cybersecurity & IAM'
    }
  };

  function setLanguage(lang) {
    const btnEs = document.getElementById('lang-btn-es');
    const btnEn = document.getElementById('lang-btn-en');
    if (lang === 'es') {
      if (btnEs) btnEs.classList.add('active');
      if (btnEn) btnEn.classList.remove('active');
    } else {
      if (btnEn) btnEn.classList.add('active');
      if (btnEs) btnEs.classList.remove('active');
    }
    langMenuItems.forEach(item => {
      item.classList.toggle('active', item.dataset.lang === lang);
    });

    if (langMenu) langMenu.classList.remove('open');

    if (lang === 'es') {
      clearGoogleTranslateCookie();
      enSections.forEach(el => el.style.display = 'none');
      esSections.forEach(el => el.style.display = 'block');
      if (tocEn) tocEn.style.display = 'none';
      if (tocEs) tocEs.style.display = 'block';

      if (catalogEn) catalogEn.style.display = 'none';
      if (catalogEs) catalogEs.style.display = 'grid';
      if (researchEn) researchEn.style.display = 'none';
      if (researchEs) researchEs.style.display = 'block';
      if (ecosystemEn) ecosystemEn.style.display = 'none';
      if (ecosystemEs) ecosystemEs.style.display = 'block';

      if (tabGuidesLabel) tabGuidesLabel.innerText = 'Guías y Specs';
      if (tabResearchLabel) tabResearchLabel.innerText = 'Pilares de Investigación';
      if (tabEco) tabEco.innerText = 'Proyectos';
      if (brandBadge) brandBadge.innerText = 'RUNBOOKS & SPECS';
      if (headerProjectsLabel) headerProjectsLabel.innerText = 'Proyectos';
      if (sidebarRole) sidebarRole.innerText = 'Ingeniero de DevOps y Sistemas · Investigador';
      if (sidebarProjectsLabel) sidebarProjectsLabel.innerText = 'Proyectos';
      if (tocTitle) tocTitle.innerText = 'Capítulos de la Guía';
      if (searchInput) searchInput.setAttribute('placeholder', 'Buscar arquitectura, DNS, guías...');
      if (footerText) footerText.innerText = '© 2026 ATM Software Labs · Documentación Técnica y Runbooks';
      if (footerProjectsLink) footerProjectsLink.innerText = 'Proyectos';
      if (footerRootLink) footerRootLink.innerText = 'Dominio Principal';
      if (currentLangLabel) currentLangLabel.innerText = 'ES (Español)';
      const sbStatusTitle = document.getElementById('sidebar-status-title');
      const sbStatusMeta = document.getElementById('sidebar-status-meta');
      if (sbStatusTitle) sbStatusTitle.innerText = 'Sistemas en Línea';
      if (sbStatusMeta) sbStatusMeta.innerText = 'Runbook Verificado · 100% Producción';


      filterChips.forEach(chip => {
        const cat = chip.dataset.category;
        if (filterTexts.es[cat]) chip.innerText = filterTexts.es[cat];
      });

      document.documentElement.lang = 'es';
      localStorage.setItem('trujillo_guide_lang', 'es');
      triggerGoogleTranslate('es');
    } else if (lang === 'en') {
      clearGoogleTranslateCookie();
      enSections.forEach(el => el.style.display = 'block');
      esSections.forEach(el => el.style.display = 'none');
      if (tocEn) tocEn.style.display = 'block';
      if (tocEs) tocEs.style.display = 'none';

      if (catalogEn) catalogEn.style.display = 'grid';
      if (catalogEs) catalogEs.style.display = 'none';
      if (researchEn) researchEn.style.display = 'block';
      if (researchEs) researchEs.style.display = 'none';
      if (ecosystemEn) ecosystemEn.style.display = 'block';
      if (ecosystemEs) ecosystemEs.style.display = 'none';

      if (tabGuidesLabel) tabGuidesLabel.innerText = 'Guides & Specs';
      if (tabResearchLabel) tabResearchLabel.innerText = 'Research Pillars';
      if (tabEco) tabEco.innerText = 'Projects';
      if (brandBadge) brandBadge.innerText = 'RUNBOOKS & SPECS';
      if (headerProjectsLabel) headerProjectsLabel.innerText = 'Projects';
      if (sidebarRole) sidebarRole.innerText = 'DevOps & Systems Engineer · Researcher';
      if (sidebarProjectsLabel) sidebarProjectsLabel.innerText = 'Projects';
      if (tocTitle) tocTitle.innerText = 'Guide Chapters';
      if (searchInput) searchInput.setAttribute('placeholder', 'Search architecture, DNS records, guides...');
      if (footerText) footerText.innerText = '© 2026 ATM Software Labs · Technical Documentation & Runbooks';
      if (footerProjectsLink) footerProjectsLink.innerText = 'Projects';
      if (footerRootLink) footerRootLink.innerText = 'Root Domain';
      if (currentLangLabel) currentLangLabel.innerText = 'EN (English)';
      const sbStatusTitle = document.getElementById('sidebar-status-title');
      const sbStatusMeta = document.getElementById('sidebar-status-meta');
      if (sbStatusTitle) sbStatusTitle.innerText = 'Systems Operational';
      if (sbStatusMeta) sbStatusMeta.innerText = 'Verified Runbook · Production Ready';


      filterChips.forEach(chip => {
        const cat = chip.dataset.category;
        if (filterTexts.en[cat]) chip.innerText = filterTexts.en[cat];
      });

      document.documentElement.lang = 'en';
      localStorage.setItem('trujillo_guide_lang', 'en');
      triggerGoogleTranslate('en');
    } else {
      enSections.forEach(el => el.style.display = 'block');
      esSections.forEach(el => el.style.display = 'none');
      if (tocEn) tocEn.style.display = 'block';
      if (tocEs) tocEs.style.display = 'none';
      if (catalogEn) catalogEn.style.display = 'grid';
      if (catalogEs) catalogEs.style.display = 'none';
      if (researchEn) researchEn.style.display = 'block';
      if (researchEs) researchEs.style.display = 'none';
      if (ecosystemEn) ecosystemEn.style.display = 'block';
      if (ecosystemEs) ecosystemEs.style.display = 'none';

      const labelMap = {
        fr: 'FR (Français)',
        de: 'DE (Deutsch)',
        it: 'IT (Italiano)',
        pt: 'PT (Português)',
        ja: 'JA (日本語)'
      };
      if (currentLangLabel) currentLangLabel.innerText = labelMap[lang] || lang.toUpperCase();
      localStorage.setItem('trujillo_guide_lang', lang);
      triggerGoogleTranslate(lang);
    }

    updateActiveToc();
  }

  langMenuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      setLanguage(item.dataset.lang);
    });
  });

  // Initial Language Check
  const savedLang = localStorage.getItem('trujillo_guide_lang') || 'es';
  const initialHash = window.location.hash.toLowerCase();

  if (initialHash === '#research') {
    switchTab('tab-research');
  } else if (initialHash === '#ecosystem') {
    switchTab('tab-ecosystem');
  } else if (initialHash === '#es' || savedLang === 'es') {
    setLanguage('es');
  } else {
    setLanguage(savedLang || 'es');
  }

  // ==========================================
  // 6. CATEGORY FILTER CHIPS
  // ==========================================
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.dataset.category;

      catalogCards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        if (cat === 'all' || categories.includes(cat)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });

      researchCards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        if (cat === 'all' || categories.includes(cat)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 7. ONE-CLICK CODE & DNS COPY
  // ==========================================
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const codeBlock = btn.closest('.code-container')?.querySelector('code');
      if (!codeBlock) return;
      
      try {
        await navigator.clipboard.writeText(codeBlock.textContent.trim());
        const originalText = btn.textContent;
        btn.textContent = 'COPIED';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
      }
    });
  });

  document.querySelectorAll('.dns-quick-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const val = btn.dataset.copy || btn.closest('.dns-record-body')?.querySelector('.dns-record-value')?.innerText;
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val.trim());
        const originalText = btn.innerText;
        btn.innerText = 'COPIED!';
        btn.style.borderColor = '#22c55e';
        btn.style.color = '#22c55e';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('DNS copy failed', err);
      }
    });
  });

  // ==========================================
  // 8. TABLE OF CONTENTS SCROLLSPY
  // ==========================================
  function updateActiveToc() {
    const isEs = document.documentElement.lang === 'es';
    const activeToc = isEs ? tocEs : tocEn;
    if (!activeToc) return;

    const links = activeToc.querySelectorAll('.toc-link');
    const headings = [];
    links.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) headings.push({ link, target });
    });

    const scrollPos = window.scrollY + 140;
    let current = headings[0];

    for (let i = 0; i < headings.length; i++) {
      if (headings[i].target.offsetTop <= scrollPos) {
        current = headings[i];
      } else {
        break;
      }
    }

    links.forEach(l => l.classList.remove('active'));
    if (current) current.link.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveToc, { passive: true });

  // ==========================================
  // 9. REAL-TIME SEARCH FILTER
  // ==========================================
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const currentLang = document.documentElement.lang || 'en';
      const selector = currentLang === 'es' ? '.content-es section' : '.content-en section';
      const sections = document.querySelectorAll(selector);

      if (!term) {
        sections.forEach(s => s.style.display = 'block');
        catalogCards.forEach(c => c.style.display = 'flex');
        researchCards.forEach(r => r.style.display = 'flex');
        return;
      }

      sections.forEach(s => {
        s.style.display = s.innerText.toLowerCase().includes(term) ? 'block' : 'none';
      });

      catalogCards.forEach(c => {
        c.style.display = c.innerText.toLowerCase().includes(term) ? 'flex' : 'none';
      });

      researchCards.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(term) ? 'flex' : 'none';
      });
    });
  }

  // ==========================================
  // 10. SHARE BUTTON
  // ==========================================
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      const title = document.title;
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch (e) {}
      } else {
        await navigator.clipboard.writeText(url);
        const original = shareBtn.textContent;
        shareBtn.textContent = 'Link Copied!';
        setTimeout(() => { shareBtn.textContent = original; }, 2000);
      }
    });
  }

  // ==========================================
  // 11. INTERACTIVE STARTUP SAVINGS CALCULATOR
  // ==========================================
  function initSavingsCalculator() {
    let teamSize = 4;
    let planRateEn = 12;
    let planRateEs = 11.50;

    function updateCalc() {
      // Update EN
      const annualCostEn = teamSize * planRateEn * 12;
      const fiveYearSavingsEn = annualCostEn * 5;
      const teamDisplayEn = document.getElementById('calc-team-display-en');
      const wsAnnualEn = document.getElementById('calc-ws-annual-en');
      const netAnnualEn = document.getElementById('calc-net-annual-en');
      const fiveYearEn = document.getElementById('calc-5yr-savings-en');
      const sliderEn = document.getElementById('calc-team-slider-en');

      if (teamDisplayEn) teamDisplayEn.innerText = `${teamSize} ${teamSize === 1 ? 'member' : 'founders'}`;
      if (wsAnnualEn) wsAnnualEn.innerText = `$${annualCostEn.toLocaleString()} / yr`;
      if (netAnnualEn) netAnnualEn.innerText = `$${annualCostEn.toLocaleString()} / yr`;
      if (fiveYearEn) fiveYearEn.innerText = `5-Year Savings: $${fiveYearSavingsEn.toLocaleString()}`;
      if (sliderEn && parseInt(sliderEn.value, 10) !== teamSize) sliderEn.value = teamSize;

      // Update ES
      const annualCostEs = teamSize * planRateEs * 12;
      const fiveYearSavingsEs = annualCostEs * 5;
      const teamDisplayEs = document.getElementById('calc-team-display-es');
      const wsAnnualEs = document.getElementById('calc-ws-annual-es');
      const netAnnualEs = document.getElementById('calc-net-annual-es');
      const fiveYearEs = document.getElementById('calc-5yr-savings-es');
      const sliderEs = document.getElementById('calc-team-slider-es');

      const fmt = (num) => num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      if (teamDisplayEs) teamDisplayEs.innerText = `${teamSize} ${teamSize === 1 ? 'persona' : 'personas'}`;
      if (wsAnnualEs) wsAnnualEs.innerText = `${fmt(annualCostEs)} € / año`;
      if (netAnnualEs) netAnnualEs.innerText = `${fmt(annualCostEs)} € / año`;
      if (fiveYearEs) fiveYearEs.innerText = `Ahorro a 5 años: ${fmt(fiveYearSavingsEs)} €`;
      if (sliderEs && parseInt(sliderEs.value, 10) !== teamSize) sliderEs.value = teamSize;
    }

    const sliderEn = document.getElementById('calc-team-slider-en');
    const sliderEs = document.getElementById('calc-team-slider-es');

    if (sliderEn) {
      sliderEn.addEventListener('input', (e) => {
        teamSize = parseInt(e.target.value, 10) || 1;
        updateCalc();
      });
    }
    if (sliderEs) {
      sliderEs.addEventListener('input', (e) => {
        teamSize = parseInt(e.target.value, 10) || 1;
        updateCalc();
      });
    }

    const planBtnsEn = document.querySelectorAll('#calc-plans-en .calc-plan-btn');
    planBtnsEn.forEach(btn => {
      btn.addEventListener('click', () => {
        planBtnsEn.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        planRateEn = parseFloat(btn.dataset.rate) || 12;
        updateCalc();
      });
    });

    const planBtnsEs = document.querySelectorAll('#calc-plans-es .calc-plan-btn');
    planBtnsEs.forEach(btn => {
      btn.addEventListener('click', () => {
        planBtnsEs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        planRateEs = parseFloat(btn.dataset.rate) || 11.50;
        updateCalc();
      });
    });

    updateCalc();
  }
  initSavingsCalculator();

  // ==========================================
  // 12. INTERACTIVE DNS SECURITY SIMULATOR
  // ==========================================
  window._trujilloDnsTest = function(proto, lang) {
    const isEs = lang === 'es';
    const statusEl = document.getElementById(`sim-status-${proto}-${lang}`);
    const outEl = document.getElementById(`sim-out-${proto}-${lang}`);
    const cardEl = document.getElementById(`sim-card-${proto}-${lang}`);

    if (!statusEl || !outEl) return;

    statusEl.textContent = isEs ? 'Comprobando...' : 'Verifying...';
    statusEl.classList.add('sim-wait');
    statusEl.classList.remove('sim-ok');

    setTimeout(() => {
      statusEl.textContent = isEs ? 'Validado' : 'Verified';
      statusEl.classList.remove('sim-wait');
      statusEl.classList.add('sim-ok');

      function setPass(text, codeA, codeB) {
        while (outEl.firstChild) outEl.removeChild(outEl.firstChild);
        var pass = document.createElement('span');
        pass.className = 'pass-label';
        pass.textContent = 'PASS ';
        outEl.appendChild(pass);
        outEl.appendChild(document.createTextNode(text));
        if (codeA) {
          var c1 = document.createElement('code');
          c1.textContent = codeA;
          outEl.appendChild(c1);
        }
        if (codeB) {
          outEl.appendChild(document.createTextNode(' / '));
          var c2 = document.createElement('code');
          c2.textContent = codeB;
          outEl.appendChild(c2);
        }
      }
      if (proto === 'spf') {
        setPass(isEs ? 'Consulta DNS 1.1.1.1 resuelta. SPF contiene ' : '1.1.1.1 query resolved. SPF contains ', '_spf.mx.cloudflare.net', 'amazonses.com');
      } else if (proto === 'dkim') {
        setPass(isEs ? 'Firma RSA-SHA256 validada con selector ' : 'RSA-SHA256 signature validated with selector ', 'resend._domainkey', null);
      } else if (proto === 'dmarc') {
        setPass(isEs ? 'Registro DMARC activo con política forzada.' : 'DMARC record active with enforcement policy.', null, null);
      }
    }, 350);
  };

  // ==========================================
  // 13. INTERACTIVE DEPLOYMENT CHECKLIST
  // ==========================================
  let checkedSteps = [];
  try {
    const saved = localStorage.getItem('trujillo_checklist');
    if (saved) checkedSteps = JSON.parse(saved);
  } catch (e) {
    checkedSteps = [];
  }

  function renderChecklist() {
    const totalSteps = 5;
    const completedCount = checkedSteps.length;
    const percent = Math.round((completedCount / totalSteps) * 100);

    document.querySelectorAll('.checklist-item').forEach(item => {
      const stepNum = parseInt(item.dataset.step, 10);
      item.classList.toggle('checked', checkedSteps.includes(stepNum));
    });

    // Update EN UI
    const countEn = document.getElementById('checklist-count-en');
    const percentEn = document.getElementById('checklist-percent-en');
    const fillEn = document.getElementById('checklist-fill-en');
    const bannerEn = document.getElementById('checklist-banner-en');

    if (countEn) countEn.innerText = `${completedCount} of ${totalSteps} Completed`;
    if (percentEn) percentEn.innerText = `${percent}%`;
    if (fillEn) fillEn.style.width = `${percent}%`;
    if (bannerEn) bannerEn.style.display = completedCount === totalSteps ? 'flex' : 'none';

    // Update ES UI
    const countEs = document.getElementById('checklist-count-es');
    const percentEs = document.getElementById('checklist-percent-es');
    const fillEs = document.getElementById('checklist-fill-es');
    const bannerEs = document.getElementById('checklist-banner-es');

    if (countEs) countEs.innerText = `${completedCount} de ${totalSteps} Completados`;
    if (percentEs) percentEs.innerText = `${percent}%`;
    if (fillEs) fillEs.style.width = `${percent}%`;
    if (bannerEs) bannerEs.style.display = completedCount === totalSteps ? 'flex' : 'none';
  }

  window._trujilloChecklistToggle = function(step) {
    const stepNum = parseInt(step, 10);
    const index = checkedSteps.indexOf(stepNum);
    if (index >= 0) {
      checkedSteps.splice(index, 1);
    } else {
      checkedSteps.push(stepNum);
    }
    localStorage.setItem('trujillo_checklist', JSON.stringify(checkedSteps));
    renderChecklist();
  };

  renderChecklist();
});


