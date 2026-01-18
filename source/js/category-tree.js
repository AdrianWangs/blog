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

  const CPT_STORAGE_KEY = 'category-page-tree-expanded';

  function getCptExpandedState() {
    try {
      return JSON.parse(localStorage.getItem(CPT_STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveCptExpandedState(state) {
    try {
      localStorage.setItem(CPT_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getCptCategoryId(header) {
    const link = header.querySelector('.cpt-category-link');
    return link ? link.getAttribute('href') : null;
  }

  function initCategoryPageTree() {
    const pageTree = document.querySelector('.category-page-tree');
    if (!pageTree) return;

    const expandedState = getCptExpandedState();
    const headers = pageTree.querySelectorAll('.cpt-category-header');

    headers.forEach(header => {
      const catId = getCptCategoryId(header);
      const toggle = header.querySelector('.cpt-toggle');
      
      if (catId && expandedState[catId] === false) {
        header.setAttribute('data-expanded', 'false');
      }

      header.addEventListener('click', (e) => {
        if (e.target.closest('.cpt-category-link')) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const isExpanded = header.getAttribute('data-expanded') !== 'false';
        header.setAttribute('data-expanded', isExpanded ? 'false' : 'true');
        
        if (catId) {
          const state = getCptExpandedState();
          if (isExpanded) {
            state[catId] = false;
          } else {
            delete state[catId];
          }
          saveCptExpandedState(state);
        }
      });

      if (toggle) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const isExpanded = header.getAttribute('data-expanded') !== 'false';
          header.setAttribute('data-expanded', isExpanded ? 'false' : 'true');
          
          if (catId) {
            const state = getCptExpandedState();
            if (isExpanded) {
              state[catId] = false;
            } else {
              delete state[catId];
            }
            saveCptExpandedState(state);
          }
        });
      }
    });

    const expandAllBtn = pageTree.querySelector('.cpt-expand-all');
    const collapseAllBtn = pageTree.querySelector('.cpt-collapse-all');

    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', () => {
        headers.forEach(header => {
          header.setAttribute('data-expanded', 'true');
        });
        saveCptExpandedState({});
      });
    }

    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', () => {
        const state = {};
        headers.forEach(header => {
          header.setAttribute('data-expanded', 'false');
          const catId = getCptCategoryId(header);
          if (catId) state[catId] = false;
        });
        saveCptExpandedState(state);
      });
    }

    initPostPreview(pageTree);
  }

  function initPostPreview(container) {
    const tooltip = document.getElementById('cpt-preview-tooltip');
    if (!tooltip) return;

    const postItems = container.querySelectorAll('.cpt-post-item');
    let hideTimeout = null;
    let currentItem = null;

    const showTooltip = (item, e) => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }

      currentItem = item;

      const title = item.dataset.title || '';
      const date = item.dataset.date || '';
      const description = item.dataset.description || '';
      const tags = item.dataset.tags || '';
      const cover = item.dataset.cover || '';

      let coverHtml = '';
      if (cover && cover !== 'false') {
        coverHtml = `<img class="cpt-preview-cover" src="${cover}" alt="${title}" onerror="this.parentElement.innerHTML='<div class=\\'cpt-preview-no-cover\\'><i class=\\'fas fa-file-alt\\'></i></div>'">`;
      } else {
        coverHtml = `<div class="cpt-preview-no-cover"><i class="fas fa-file-alt"></i></div>`;
      }

      let tagsHtml = '';
      if (tags) {
        const tagList = tags.split(',').filter(t => t.trim());
        if (tagList.length > 0) {
          tagsHtml = `<div class="cpt-preview-tags">${tagList.slice(0, 5).map(t => `<span class="cpt-preview-tag">${t.trim()}</span>`).join('')}</div>`;
        }
      }

      let descriptionHtml = '';
      if (description) {
        descriptionHtml = `<div class="cpt-preview-description">${description}</div>`;
      }

      tooltip.innerHTML = `
        ${coverHtml}
        <div class="cpt-preview-content">
          <div class="cpt-preview-title">${title}</div>
          <div class="cpt-preview-meta">
            <span><i class="far fa-calendar-alt"></i>${date}</span>
          </div>
          ${descriptionHtml}
          ${tagsHtml}
        </div>
        <div class="cpt-preview-footer">
          <i class="fas fa-mouse-pointer"></i>
          <span>点击查看详情</span>
        </div>
      `;

      positionTooltip(item, e);
      tooltip.classList.add('visible');
    };

    const hideTooltip = () => {
      hideTimeout = setTimeout(() => {
        tooltip.classList.remove('visible');
        currentItem = null;
      }, 150);
    };

    const positionTooltip = (item, e) => {
      const rect = item.getBoundingClientRect();
      const tooltipWidth = 320;
      const tooltipHeight = tooltip.offsetHeight || 300;
      const padding = 15;

      let left = rect.right + padding;
      let top = rect.top;

      if (left + tooltipWidth > window.innerWidth - padding) {
        left = rect.left - tooltipWidth - padding;
      }

      if (left < padding) {
        left = rect.left;
        top = rect.bottom + padding;
      }

      if (top + tooltipHeight > window.innerHeight - padding) {
        top = window.innerHeight - tooltipHeight - padding;
      }

      if (top < padding) {
        top = padding;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    postItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        showTooltip(item, e);
      });

      item.addEventListener('mouseleave', () => {
        hideTooltip();
      });

      item.addEventListener('mousemove', (e) => {
        if (currentItem === item && tooltip.classList.contains('visible')) {
          positionTooltip(item, e);
        }
      });
    });

    tooltip.addEventListener('mouseenter', () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
    });

    tooltip.addEventListener('mouseleave', () => {
      hideTooltip();
    });
  }

  function initAll() {
    initCategoryTree();
    initCategoryPageTree();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('pjax:complete', initAll);
})();
