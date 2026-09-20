(() => {
  const NAV = [
    { view: 'home', label: 'Home', icon: '⌂' },
    { view: 'learn', label: 'Learn', icon: '◫' },
    { view: 'tools', label: 'AI', icon: '✦', prominent: true },
    { view: 'labs', label: 'Labs', icon: '⌁' },
    { view: 'more', label: 'More', icon: '•••' }
  ];
  const secondary = [
    { view: 'projects', label: 'Projects', icon: '◇' },
    { view: 'progress', label: 'Progress', icon: '◔' }
  ];
  function inject() {
    if (document.getElementById('liquidBottomNav')) return;
    const dock = document.createElement('nav');
    dock.id = 'liquidBottomNav';
    dock.className = 'liquid-bottom-nav';
    dock.setAttribute('aria-label', 'Primary navigation');
    dock.innerHTML = NAV.map((item) => [
      '<button class="liquid-tab ', item.prominent ? 'liquid-tab-prominent' : '', '" data-liquid-view="', item.view, '" aria-label="', item.label, '">',
      '<span class="liquid-tab-icon">', item.icon, '</span>',
      '<span class="liquid-tab-label">', item.label, '</span>',
      '</button>'
    ].join('')).join('');
    const moreSheet = document.createElement('section');
    moreSheet.id = 'liquidMoreSheet';
    moreSheet.className = 'liquid-more-sheet';
    moreSheet.setAttribute('aria-hidden', 'true');
    moreSheet.innerHTML = [
      '<div class="liquid-more-backdrop" data-more-close></div>',
      '<div class="liquid-more-panel" role="dialog" aria-modal="true" aria-label="More navigation">',
      '<div class="liquid-more-handle"></div>',
      '<div class="liquid-more-head"><div><span class="kicker">STUDIO</span><h2>More</h2></div><button class="icon-btn" type="button" data-more-close aria-label="Close">×</button></div>',
      '<div class="liquid-more-grid">',
      secondary.map((item) => [
        '<button class="liquid-more-item" data-more-view="', item.view, '">',
        '<span class="liquid-more-icon">', item.icon, '</span>',
        '<span><strong>', item.label, '</strong><small>Open ', item.label.toLowerCase(), '</small></span>',
        '<span class="liquid-more-arrow">›</span></button>'
      ].join('')).join(''),
      '</div></div>'
    ].join('');
    document.body.append(dock, moreSheet);
    document.body.classList.add('liquid-nav-ready');
    dock.querySelectorAll('[data-liquid-view]').forEach((button) => {
      button.addEventListener('click', () => {
        const view = button.dataset.liquidView;
        if (view === 'more') { openMore(); return; }
        if (typeof window.route === 'function') window.route(view);
        setActive(view);
      });
    });
    moreSheet.querySelectorAll('[data-more-view]').forEach((button) => {
      button.addEventListener('click', () => {
        const view = button.dataset.moreView;
        closeMore();
        if (typeof window.route === 'function') window.route(view);
        setActive(view);
      });
    });
    moreSheet.querySelectorAll('[data-more-close]').forEach((button) => button.addEventListener('click', closeMore));
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMore(); });
    installRouteBridge();
    setActive('home');
    installScrollBehavior();
  }
  let bridged = false;
  function installRouteBridge() {
    if (bridged || typeof window.route !== 'function') return;
    const originalRoute = window.route;
    window.route = function liquidRouteBridge(view) {
      const result = originalRoute.apply(this, arguments);
      setActive(view);
      return result;
    };
    bridged = true;
  }
  function setActive(view) {
    document.querySelectorAll('[data-liquid-view]').forEach((button) => {
      const active = button.dataset.liquidView === view;
      button.classList.toggle('active', active);
      if (active) {
        const dock = document.getElementById('liquidBottomNav');
        if (dock) {
          dock.style.setProperty('--liquid-x', button.offsetLeft + 'px');
          dock.style.setProperty('--liquid-w', button.offsetWidth + 'px');
          dock.style.setProperty('--liquid-h', button.offsetHeight + 'px');
        }
      }
    });
    document.querySelectorAll('.nav-item').forEach((button) => button.classList.toggle('active', button.dataset.view === view));
  }
  function openMore() {
    const sheet = document.getElementById('liquidMoreSheet');
    if (!sheet) return;
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    document.body.classList.add('liquid-more-open');
  }
  function closeMore() {
    const sheet = document.getElementById('liquidMoreSheet');
    if (!sheet) return;
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('liquid-more-open');
  }
  function installScrollBehavior() {
    let lastY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dock = document.getElementById('liquidBottomNav');
        if (dock && Math.abs(y - lastY) > 8) {
          dock.classList.toggle('minimized', y > lastY && y > 90);
          if (y < 60) dock.classList.remove('minimized');
          lastY = y;
        }
        ticking = false;
      });
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject, { once: true });
  else inject();
})();