// year
document.getElementById('y').textContent = new Date().getFullYear();

// last updated (UTC+8)
(function () {
  const t = document.getElementById('updated');
  const lm = new Date(document.lastModified || Date.now());
  const fmt = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' });
  t.textContent = fmt.format(lm) + ' (UTC+8)';
  t.setAttribute('datetime', lm.toISOString());
})();

// Theme toggle: show current effective theme (Light/Dark); click toggles to the opposite.
(function () {
  const STORAGE_KEY = 'theme'; // 'light' | 'dark' | null (auto)
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved; // user-set
    return mq.matches ? 'dark' : 'light'; // auto (follow system)
  }

  function setMetaTheme(theme) {
    document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
      m.setAttribute('content', theme === 'dark' ? '#0b0c0f' : '#ffffff');
    });
  }

  function applyTheme(theme, persist) {
    // When user explicitly chooses, set data-theme; otherwise (auto) remove it.
    if (theme === 'light' || theme === 'dark') {
      root.setAttribute('data-theme', theme);
      if (persist) localStorage.setItem(STORAGE_KEY, theme);
    } else {
      root.removeAttribute('data-theme');
      if (persist) localStorage.removeItem(STORAGE_KEY);
    }
    btn.textContent = (theme === 'dark' ? 'Dark' : 'Light');
    setMetaTheme(theme);
  }

  // Init
  const init = effectiveTheme();
  // If user has a saved theme, ensure data-theme is set; else follow system (no attribute)
  if (localStorage.getItem(STORAGE_KEY)) {
    root.setAttribute('data-theme', init);
  } else {
    root.removeAttribute('data-theme'); // follow CSS media query
  }
  btn.textContent = (init === 'dark' ? 'Dark' : 'Light');
  setMetaTheme(init);

  // If following system (no saved theme), update on system changes
  mq.addEventListener?.('change', () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const cur = mq.matches ? 'dark' : 'light';
      applyTheme(cur, false);
    }
  });

  // Click: toggle to the opposite of current effective theme; persist user choice
  btn.addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  });
})();