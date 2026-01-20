(function () {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  function setActive(targetId, pushHash = true) {
    navLinks.forEach(b => b.classList.toggle('is-active', b.dataset.target === targetId));
    panels.forEach(p => p.classList.toggle('is-active', p.id === targetId));

    const panel = document.getElementById(targetId);
    if (panel) {
      const main = document.getElementById('main');
      // For accessibility: move focus to the main region.
      if (main) main.focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (pushHash) {
      history.replaceState(null, '', `#${targetId}`);
    }
  }

  navLinks.forEach(btn => {
    btn.addEventListener('click', () => setActive(btn.dataset.target));
  });

  const blogTabs = Array.from(document.querySelectorAll('.blog-tab'));
  const blogPosts = Array.from(document.querySelectorAll('#blog .post'));

  function setActivePost(postId) {
    blogTabs.forEach(tab => {
      const isActive = tab.dataset.post === postId;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    blogPosts.forEach(post => {
      const isActive = post.id === postId;
      post.classList.toggle('is-active', isActive);
      post.toggleAttribute('hidden', !isActive);
    });
  }

  blogTabs.forEach(tab => {
    tab.addEventListener('click', () => setActivePost(tab.dataset.post));
  });

  if (blogTabs.length && blogPosts.length) {
    const activeTab = blogTabs.find(tab => tab.classList.contains('is-active')) || blogTabs[0];
    if (activeTab) setActivePost(activeTab.dataset.post);
  }

  // Restore state from URL hash.
  const initial = (location.hash || '').replace('#', '').trim();
  if (initial && document.getElementById(initial)) {
    setActive(initial, false);
  }

  // Footer year + last updated.
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  const lastUpdated = document.getElementById('lastUpdated');
  if (lastUpdated) {
    lastUpdated.textContent = new Date(document.lastModified).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit'
    });
  }

  // Print button.
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }
})();
