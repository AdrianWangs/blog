(function () {
  'use strict';

  const STORAGE_KEY = 'wide-mode';
  const HTML_CLASS = 'wide-page';
  const BTN_ID = 'wide-mode-btn';

  function isDesktop() {
    return window.matchMedia && window.matchMedia('(min-width: 900px)').matches;
  }

  function isPostPage() {
    return !!document.querySelector('#post, article#article-container, .layout_post, .post-content');
  }

  function getSaved() {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setSaved(v) {
    try {
      localStorage.setItem(STORAGE_KEY, v ? '1' : '0');
    } catch (e) {}
  }

  function applyState(enabled) {
    const html = document.documentElement;
    html.classList.toggle(HTML_CLASS, !!enabled);
    setSaved(!!enabled);
    syncButtonUI(!!enabled);
  }

  function syncButtonUI(enabled) {
    const btn = document.getElementById(BTN_ID);
    if (!btn) return;
    btn.classList.toggle('is-active', !!enabled);
    const icon = btn.querySelector('i');
    if (!icon) return;
    icon.className = enabled
      ? 'fas fa-down-left-and-up-right-to-center'
      : 'fas fa-up-right-and-down-left-from-center';
    btn.title = enabled ? '退出全宽' : '全宽展示';
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
      btn.title = '全宽展示';
      btn.innerHTML = '<i class="fas fa-up-right-and-down-left-from-center"></i>';
      const goUp = document.getElementById('go-up');
      if (goUp && goUp.parentElement === rightside) {
        rightside.insertBefore(btn, goUp);
      } else {
        rightside.appendChild(btn);
      }

      btn.addEventListener('click', () => {
        applyState(!document.documentElement.classList.contains(HTML_CLASS));
      });
    }

    syncButtonUI(document.documentElement.classList.contains(HTML_CLASS));
  }

  function init() {
    const html = document.documentElement;
    if (!isDesktop() || !isPostPage()) {
      html.classList.remove(HTML_CLASS);
      const btn = document.getElementById(BTN_ID);
      if (btn) btn.remove();
      return;
    }

    applyState(getSaved());
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

