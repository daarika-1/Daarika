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
