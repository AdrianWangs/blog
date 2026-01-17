(function () {
  'use strict';

  const STORAGE_KEY = 'font-size-level';
  const BTN_ID = 'font-size-toggle';
  const LEVELS = ['fs-sm', 'fs-md', 'fs-lg'];

  function isDesktop() {
    return window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
  }

  function isPostPage() {
    return !!document.querySelector('#post, article#article-container, .layout_post, .post-content');
  }

  function getLevel() {
    try {
      const v = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
      if (Number.isFinite(v) && v >= 0 && v < LEVELS.length) return v;
      return 0;
    } catch (e) {
      return 0;
    }
  }

  function setLevel(v) {
    try {
      localStorage.setItem(STORAGE_KEY, String(v));
    } catch (e) {}
  }

  function applyLevel(level) {
    const html = document.documentElement;
    LEVELS.forEach(cls => html.classList.remove(cls));
    html.classList.add(LEVELS[level]);
    setLevel(level);
    syncButtonUI(level);
  }

  function syncButtonUI(level) {
    const btn = document.getElementById(BTN_ID);
    if (!btn) return;
    btn.dataset.level = String(level);
    btn.title = level === 0 ? '字体：小' : level === 1 ? '字体：中' : '字体：大';
    const badge = btn.querySelector('.fs-badge');
    if (badge) badge.textContent = level === 0 ? 'S' : level === 1 ? 'M' : 'L';
  }

  function ensureButton() {
    if (!isDesktop() || !isPostPage()) return;

    const rightside = document.getElementById('rightside-config-show') || document.getElementById('rightside');
    if (!rightside) return;

    let btn = document.getElementById(BTN_ID);
    if (!btn) {
      btn = document.createElement('button');
      btn.id = BTN_ID;
      btn.type = 'button';
      btn.innerHTML = '<i class="fas fa-font"></i><span class="fs-badge">S</span>';
      const goUp = document.getElementById('go-up');
      if (goUp && goUp.parentElement === rightside) {
        rightside.insertBefore(btn, goUp);
      } else {
        rightside.appendChild(btn);
      }

      btn.addEventListener('click', () => {
        const next = (getLevel() + 1) % LEVELS.length;
        applyLevel(next);
      });
    }

    syncButtonUI(getLevel());
  }

  function init() {
    const html = document.documentElement;
    if (!isDesktop() || !isPostPage()) {
      LEVELS.forEach(cls => html.classList.remove(cls));
      const btn = document.getElementById(BTN_ID);
      if (btn) btn.remove();
      return;
    }

    applyLevel(getLevel());
    ensureButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('pjax:complete', init);
  window.addEventListener('resize', init);
})();

