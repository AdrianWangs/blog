(function() {
  'use strict';

  const STORAGE_KEY = 'category-tree-expanded';

  function getExpandedState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveExpandedState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getCategoryId(item) {
    const link = item.querySelector('.ct-link');
    return link ? link.getAttribute('href') : null;
  }

  function initCategoryTree() {
    const widgets = document.querySelectorAll('.category-tree-widget');
    if (!widgets.length) return;

    const expandedState = getExpandedState();

    widgets.forEach(widget => {
      const items = widget.querySelectorAll('.ct-item.has-children');
      
      items.forEach(item => {
        const catId = getCategoryId(item);
        const toggle = item.querySelector(':scope > .ct-item-inner > .ct-toggle');
        const children = item.querySelector(':scope > .ct-children');
        
        if (!toggle || !children) return;

        if (catId && expandedState[catId]) {
          item.classList.add('expanded');
        }

        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          item.classList.toggle('expanded');
          
          if (catId) {
            const state = getExpandedState();
            if (item.classList.contains('expanded')) {
              state[catId] = true;
            } else {
              delete state[catId];
            }
            saveExpandedState(state);
          }
        });
      });

      const expandAllBtn = widget.querySelector('.ct-expand-all');
      const collapseAllBtn = widget.querySelector('.ct-collapse-all');
      const fullwidthBtn = widget.querySelector('.ct-fullwidth');

      if (expandAllBtn) {
        expandAllBtn.addEventListener('click', () => {
          const allItems = widget.querySelectorAll('.ct-item.has-children');
          const state = {};
          allItems.forEach(item => {
            item.classList.add('expanded');
            const catId = getCategoryId(item);
            if (catId) state[catId] = true;
          });
          saveExpandedState(state);
        });
      }

      if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', () => {
          const allItems = widget.querySelectorAll('.ct-item.has-children');
          allItems.forEach(item => {
            item.classList.remove('expanded');
          });
          saveExpandedState({});
        });
      }

      if (fullwidthBtn) {
        fullwidthBtn.addEventListener('click', () => {
          toggleFullwidth(widget);
        });
      }
    });
  }

  function toggleFullwidth(widget) {
    let overlay = document.querySelector('.ct-fullwidth-overlay');
    
    const closeFullwidth = () => {
      widget.classList.remove('fullwidth-mode');
      document.body.classList.remove('ct-modal-open'); // 移除 body 类
      const existingOverlay = document.querySelector('.ct-fullwidth-overlay');
      if (existingOverlay) existingOverlay.remove();
      document.body.style.overflow = '';
      const closeBtn = widget.querySelector('.ct-close-fullwidth');
      if (closeBtn) closeBtn.remove();

      if (widget.__ctEscHandler) {
        document.removeEventListener('keydown', widget.__ctEscHandler);
        widget.__ctEscHandler = null;
      }

      if (widget.__ctPortal && widget.__ctPortal.placeholder && widget.__ctPortal.parent) {
        widget.__ctPortal.parent.insertBefore(widget, widget.__ctPortal.placeholder);
        widget.__ctPortal.placeholder.remove();
        widget.__ctPortal = null;
      }
    };
    
    if (widget.classList.contains('fullwidth-mode')) {
      closeFullwidth();
      return;
    }

    if (overlay) overlay.remove();
    
    overlay = document.createElement('div');
    overlay.className = 'ct-fullwidth-overlay';
    overlay.addEventListener('click', closeFullwidth);
    document.body.appendChild(overlay);

    if (!widget.__ctPortal) {
      const placeholder = document.createElement('div');
      placeholder.style.display = 'none';
      const parent = widget.parentNode;
      if (parent) {
        parent.insertBefore(placeholder, widget.nextSibling);
        widget.__ctPortal = { parent, placeholder };
        document.body.appendChild(widget);
      }
    } else {
      document.body.appendChild(widget);
    }

    widget.classList.add('fullwidth-mode');
    document.body.classList.add('ct-modal-open'); // 添加 body 类
    document.body.style.overflow = 'hidden';

    const existingCloseBtn = widget.querySelector('.ct-close-fullwidth');
    if (existingCloseBtn) existingCloseBtn.remove();
    
    const btn = document.createElement('button');
    btn.className = 'ct-close-fullwidth';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.title = '关闭';
    btn.addEventListener('click', closeFullwidth);
    widget.querySelector('.ct-actions').appendChild(btn);
    
    widget.__ctEscHandler = function escHandler(e) {
      if (e.key === 'Escape') {
        closeFullwidth();
      }
    };
    document.addEventListener('keydown', widget.__ctEscHandler);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryTree);
  } else {
    initCategoryTree();
  }

  document.addEventListener('pjax:complete', initCategoryTree);
})();
