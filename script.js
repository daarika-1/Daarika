(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Shared micro-interactions ---------- */

  // Cursor spotlight: expose pointer position to CSS as --mx / --my.
  function trackSpotlight(el) {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }

  // Click ripple that expands from the pointer.
  function addRipple(el, e) {
    if (reduceMotion) return;
    const r = el.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = `${(e && e.clientX ? e.clientX - r.left : r.width / 2)}px`;
    dot.style.top = `${(e && e.clientY ? e.clientY - r.top : r.height / 2)}px`;
    el.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove(), { once: true });
  }

  // Move a glider element to sit exactly behind `target` within `container`.
  function moveGlider(glider, target, { horizontal = false, sweep = true } = {}) {
    if (!glider || !target) return;
    glider.style.setProperty('--g-top', `${target.offsetTop}px`);
    glider.style.setProperty('--g-h', `${target.offsetHeight}px`);
    if (horizontal) {
      glider.style.setProperty('--g-left', `${target.offsetLeft}px`);
      glider.style.setProperty('--g-w', `${target.offsetWidth}px`);
    }
    if (!sweep) return;
    // Restart the light sweep.
    glider.classList.remove('is-sweeping');
    void glider.offsetWidth;
    glider.classList.add('is-sweeping');
  }

  /* ---------- Section switcher ---------- */

  const nav = document.querySelector('.nav');
  const navGlider = nav ? nav.querySelector('.nav-glider') : null;
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  function setActive(targetId, pushHash = true) {
    navLinks.forEach(b => b.classList.toggle('is-active', b.dataset.target === targetId));
    panels.forEach(p => p.classList.toggle('is-active', p.id === targetId));

    const activeBtn = navLinks.find(b => b.dataset.target === targetId);
    moveGlider(navGlider, activeBtn);

    const panel = document.getElementById(targetId);
    if (panel) {
      const main = document.getElementById('main');
      if (main) main.focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }

    if (pushHash) history.replaceState(null, '', `#${targetId}`);
    // The newly shown panel may contain a tab strip that was unmeasurable while hidden.
    requestAnimationFrame(layoutGliders);
  }

  navLinks.forEach(btn => {
    trackSpotlight(btn);
    btn.addEventListener('click', (e) => {
      addRipple(btn, e);
      setActive(btn.dataset.target);
    });
  });

  /* ---------- Blog tabs ---------- */

  const tabList = document.querySelector('.blog-tabs');
  const tabGlider = tabList ? tabList.querySelector('.tab-glider') : null;
  const blogTabs = Array.from(document.querySelectorAll('.blog-tab'));
  const blogPosts = Array.from(document.querySelectorAll('#blog .post'));

  function setActivePost(postId, focusTab = false) {
    blogTabs.forEach(tab => {
      const isActive = tab.dataset.post === postId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && focusTab) tab.focus();
    });

    blogPosts.forEach(post => {
      const isActive = post.id === postId;
      post.classList.toggle('is-active', isActive);
      post.toggleAttribute('hidden', !isActive);
    });

    moveGlider(tabGlider, blogTabs.find(t => t.dataset.post === postId), { horizontal: true });
  }

  blogTabs.forEach((tab, i) => {
    trackSpotlight(tab);
    tab.addEventListener('click', (e) => {
      addRipple(tab, e);
      setActivePost(tab.dataset.post);
    });
    // Roving focus with arrow keys, per the WAI-ARIA tabs pattern.
    tab.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = blogTabs[(i + 1) % blogTabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = blogTabs[(i - 1 + blogTabs.length) % blogTabs.length];
      if (e.key === 'Home') next = blogTabs[0];
      if (e.key === 'End') next = blogTabs[blogTabs.length - 1];
      if (next) { e.preventDefault(); setActivePost(next.dataset.post, true); }
    });
  });

  /* ---------- Initial state ---------- */

  const initial = (location.hash || '').replace('#', '').trim();
  const startId = (initial && document.getElementById(initial)) ? initial : (navLinks[0] ? navLinks[0].dataset.target : null);

  function layoutGliders() {
    const activeNav = navLinks.find(b => b.classList.contains('is-active'));
    const activeTab = blogTabs.find(t => t.classList.contains('is-active'));
    if (activeNav) moveGlider(navGlider, activeNav, { sweep: false });
    if (activeTab) moveGlider(tabGlider, activeTab, { horizontal: true, sweep: false });
  }

  if (blogTabs.length && blogPosts.length) {
    const activeTab = blogTabs.find(tab => tab.classList.contains('is-active')) || blogTabs[0];
    setActivePost(activeTab.dataset.post);
  }

  if (startId) {
    // Position the gliders before they fade in so there's no jump on first paint.
    navLinks.forEach(b => b.classList.toggle('is-active', b.dataset.target === startId));
    panels.forEach(p => p.classList.toggle('is-active', p.id === startId));
    layoutGliders();
    requestAnimationFrame(() => {
      if (navGlider) navGlider.classList.add('is-ready');
      if (tabGlider) tabGlider.classList.add('is-ready');
    });
  }

  // Keep gliders aligned when the layout changes (resize, font load, sidebar collapse on mobile).
  window.addEventListener('resize', layoutGliders);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutGliders);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(layoutGliders);
    if (nav) ro.observe(nav);
    if (tabList) ro.observe(tabList);
  }

  /* ---------- Footer year + last updated ---------- */

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const lastUpdated = document.getElementById('lastUpdated');
  if (lastUpdated) {
    lastUpdated.textContent = new Date(document.lastModified).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit'
    });
  }

  const printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());
})();
