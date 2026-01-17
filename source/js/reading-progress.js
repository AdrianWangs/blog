(function () {
  'use strict';

  const ID = 'reading-progress';

  function ensureBar() {
    let el = document.getElementById(ID);
    if (el) return el;
    el = document.createElement('div');
    el.id = ID;
    el.className = 'reading-progress';
    el.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(el);
    return el;
  }

  function getScrollContainer() {
    return document.scrollingElement || document.documentElement;
  }

  function getProgress() {
    const sc = getScrollContainer();
    const scrollTop = sc.scrollTop || 0;
    const scrollHeight = sc.scrollHeight || 0;
    const clientHeight = sc.clientHeight || 0;
    const denom = Math.max(1, scrollHeight - clientHeight);
    return Math.max(0, Math.min(1, scrollTop / denom));
  }

  function shouldShow() {
    const post = document.querySelector('#post, .post-content, .layout_post, .post');
    if (!post) return false;
    const sc = getScrollContainer();
    return (sc.scrollHeight - sc.clientHeight) > 200;
  }

  function update() {
    const wrapper = ensureBar();
    const bar = wrapper.querySelector('.reading-progress-bar');
    if (!bar) return;

    if (!shouldShow()) {
      wrapper.classList.remove('is-visible');
      bar.style.width = '0%';
      return;
    }

    wrapper.classList.add('is-visible');
    bar.style.width = (getProgress() * 100).toFixed(2) + '%';
  }

  function bind() {
    update();
    window.removeEventListener('scroll', update, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    window.removeEventListener('resize', update);
    window.addEventListener('resize', update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  document.addEventListener('pjax:complete', bind);
})();

