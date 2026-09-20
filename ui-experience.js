(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let activeEnhancer = false;
  let originalRoute = null;

  function addOnce(parent, html, id) {
    if (id && document.getElementById(id)) return;
    parent.insertAdjacentHTML('afterbegin', html);
  }

  function enhanceHome() {
    const main = $('#main'); if (!main) return;
    main.classList.add('experience-home');
    const head = $('.section-head', main);
    if (head) head.classList.add('experience-section-head');
    const hero = $('.hero', main);
    if (!hero) return;
    hero.classList.add('command-hero');
    const kicker = $('.hero-card .kicker', hero);
    if (kicker) kicker.textContent = 'COMMAND CENTER · TODAY';
    const metric = $('.metric-card', hero);
    if (metric) metric.classList.add('command-progress');
    const modules = $$('.module-card', main);
    modules.forEach((card, i) => {
      card.classList.add('module-tile');
      card.style.setProperty('--tile-index', i);
    });
    if (!$('#homeSignals')) {
      const completed = typeof state !== 'undefined' && state.completed ? state.completed.size : 0;
      const total = typeof LESSONS !== 'undefined' && Array.isArray(LESSONS) ? LESSONS.length : 520;
      const pct = total ? Math.round(completed / total * 100) : 0;
      hero.insertAdjacentHTML('afterend', [
        '<section class="home-signal-grid" id="homeSignals">',
        '<article class="signal-card signal-primary"><span class="signal-icon">↗</span><div><span class="signal-label">NEXT ACTION</span><strong>Continue your active lesson</strong><small>Keep the learning loop moving: understand → build → verify.</small></div></article>',
        '<article class="signal-card"><span class="signal-icon">◔</span><div><span class="signal-label">MASTERY SIGNAL</span><strong>', pct, '% complete</strong><small>', completed, ' of ', total, ' learning objects recorded locally.</small></div></article>',
        '<article class="signal-card"><span class="signal-icon">⌁</span><div><span class="signal-label">LEARNING MODE</span><strong>Concept → Experiment</strong><small>Interactive work is becoming the primary evidence layer.</small></div></article>',
        '</section>'
      ].join(''));
    }
  }

  function enhanceLearn() {
    const main = $('#main'); if (!main) return;
    main.classList.add('experience-learn');
    const grid = $('.grid', main); if (!grid || $('#knowledgeMap')) return;
    const modules = typeof CURRICULUM !== 'undefined' && Array.isArray(CURRICULUM.modules) ? CURRICULUM.modules : [];
    const nodes = modules.map((m, i) => [
      '<button class="knowledge-node" data-kg-module="', m.id, '" style="--node-index:', i, '">',
      '<span class="knowledge-node-number">', String(m.number).padStart(2,'0'), '</span>',
      '<strong>', escapeText(m.title), '</strong>',
      '<small>', m.units?.length || 0, ' units · ', moduleCount(m.id), ' objects</small>',
      '</button>'
    ].join('')).join('');
    grid.insertAdjacentHTML('beforebegin', [
      '<section class="knowledge-map card" id="knowledgeMap">',
      '<div class="knowledge-map-head"><div><span class="kicker">KNOWLEDGE GRAPH</span><h2>Six domains. One connected system.</h2><p>Choose a domain, then follow its concepts through derivation, implementation, experiment and research.</p></div><span class="graph-status">LIVE CURRICULUM</span></div>',
      '<div class="knowledge-canvas"><div class="graph-orbit graph-orbit-a"></div><div class="graph-orbit graph-orbit-b"></div><div class="graph-core">AI<br><small>LEARNING</small></div><div class="knowledge-nodes">', nodes, '</div></div>',
      '</section>'
    ].join(''));
    $$('[data-kg-module]').forEach((button) => button.addEventListener('click', () => window.showModule?.(button.dataset.kgModule)));
    $$('.module-card', grid).forEach((card, i) => { card.classList.add('module-tile'); card.style.setProperty('--tile-index', i); });
  }

  function moduleCount(id) {
    return typeof LESSONS !== 'undefined' && Array.isArray(LESSONS) ? LESSONS.filter(x => x.module === id).length : 0;
  }

  function escapeText(value) {
    return String(value ?? '').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  }

  function enhanceTools() {
    const main = $('#main'); if (!main) return;
    main.classList.add('experience-tools');
    const grid = $('.grid', main); if (!grid || $('#toolWorkbench')) return;
    const cards = $$('.card', grid);
    const categories = [...new Set(cards.map(c => $('.module-num', c)?.textContent?.trim()).filter(Boolean))];
    grid.insertAdjacentHTML('beforebegin', [
      '<section class="tool-workbench card" id="toolWorkbench">',
      '<div class="tool-workbench-head"><div><span class="kicker">AI WORKBENCH</span><h2>Choose the capability, not the brand.</h2><p>Find tools by the work you need to perform, then verify the output before you trust it.</p></div><span class="graph-status">', cards.length, ' TOOLS</span></div>',
      '<div class="tool-filter-row"><div class="tool-search-wrap"><span>⌕</span><input id="toolFilter" placeholder="Search tools or missions…" autocomplete="off"></div><div class="tool-category-row" id="toolCategories"><button class="tool-chip active" data-category="all">All</button>',
      categories.map(c => '<button class="tool-chip" data-category="'+escapeText(c)+'">'+escapeText(c)+'</button>').join(''),
      '</div></div></section>'
    ].join(''));
    const input = $('#toolFilter');
    const chips = $$('#toolCategories .tool-chip');
    const apply = () => {
      const q = (input?.value || '').toLowerCase().trim();
      const category = $('#toolCategories .tool-chip.active')?.dataset.category || 'all';
      cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cat = $('.module-num', card)?.textContent?.trim() || '';
        card.hidden = (q && !text.includes(q)) || (category !== 'all' && cat !== category);
      });
    };
    input?.addEventListener('input', apply);
    chips.forEach(chip => chip.addEventListener('click', () => { chips.forEach(x => x.classList.remove('active')); chip.classList.add('active'); apply(); }));
  }

  function enhanceGeneric(view) {
    const main = $('#main'); if (!main) return;
    main.classList.add('experience-'+view);
    $$('.card', main).forEach((card, i) => { card.style.setProperty('--card-index', i); });
    const head = $('.section-head', main); if (head) head.classList.add('experience-section-head');
  }

  function enhanceLesson() {
    const main = $('#main'); if (!main) return;
    main.classList.add('experience-lesson');
    const reader = $('.reader', main); if (!reader) return;
    reader.classList.add('lesson-reader-glass');
    if (!$('#lessonProgressRail')) {
      reader.insertAdjacentHTML('afterbegin', '<div class="lesson-progress-rail" id="lessonProgressRail"><i></i></div>');
    }
    if (!$('#lessonModeBar')) {
      const kicker = $('.reader .kicker', main);
      kicker?.insertAdjacentHTML('afterend', '<div class="lesson-mode-bar"><span>DEEP WORK MODE</span><span>Read · Calculate · Build · Explain</span></div>');
    }
    const update = () => {
      const rail = $('#lessonProgressRail i'); if (!rail) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
    };
    window.removeEventListener('scroll', update); window.addEventListener('scroll', update, {passive:true}); update();
  }

  function enhance(view) {
    if (!$('#main')) return;
    ['home','learn','tools','labs','projects','progress'].forEach(v => $('#main')?.classList.remove('experience-'+v));
    if (view === 'home') enhanceHome();
    else if (view === 'learn') enhanceLearn();
    else if (view === 'tools') enhanceTools();
    else if (view === 'labs' || view === 'projects' || view === 'progress') enhanceGeneric(view);
    else enhanceLesson();
  }

  function install() {
    if (activeEnhancer) return; activeEnhancer = true;
    if (typeof window.route === 'function') {
      originalRoute = window.route;
      window.route = function experienceRoute(view) {
        const result = originalRoute.apply(this, arguments);
        requestAnimationFrame(() => enhance(view));
        return result;
      };
    }
    requestAnimationFrame(() => enhance(typeof state !== 'undefined' ? state.view : 'home'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true}); else install();
})();