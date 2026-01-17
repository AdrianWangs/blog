'use strict';

let categoryTreeCache = null;

function buildCategoryTree(hexo) {
  if (categoryTreeCache) return categoryTreeCache;
  
  const categories = hexo.locals.get('categories');
  if (!categories || !categories.length) return '';

  const categoryMap = new Map();
  const rootCategories = [];

  categories.forEach(cat => {
    if (cat.length) {
      const catData = {
        _id: cat._id,
        name: cat.name,
        path: cat.path,
        count: cat.length,
        parent: cat.parent || null,
        children: []
      };
      categoryMap.set(cat._id, catData);
    }
  });

  categoryMap.forEach(cat => {
    if (cat.parent && categoryMap.has(cat.parent)) {
      categoryMap.get(cat.parent).children.push(cat);
    } else {
      rootCategories.push(cat);
    }
  });

  const sortRecursive = (cats) => {
    cats.sort((a, b) => a.name.localeCompare(b.name));
    cats.forEach(cat => {
      if (cat.children.length > 0) {
        sortRecursive(cat.children);
      }
    });
  };

  sortRecursive(rootCategories);

  const renderTree = (cats, level = 0) => {
    let html = '';
    
    cats.forEach(cat => {
      const hasChildren = cat.children.length > 0;
      const itemClass = hasChildren ? 'has-children' : '';
      const paddingLeft = level * 20;
      
      html += `<li class="ct-item ${itemClass}" data-level="${level}">`;
      html += `<div class="ct-item-inner" style="padding-left: ${paddingLeft}px;">`;
      
      if (hasChildren) {
        html += `<span class="ct-toggle"><i class="fas fa-chevron-right"></i></span>`;
      } else {
        html += `<span class="ct-toggle ct-leaf"><i class="fas fa-file-alt"></i></span>`;
      }
      
      html += `<a class="ct-link" href="/${cat.path}">`;
      html += `<span class="ct-name">${cat.name}</span>`;
      html += `<span class="ct-count">${cat.count}</span>`;
      html += `</a>`;
      html += `</div>`;
      
      if (hasChildren) {
        html += `<ul class="ct-children">`;
        html += renderTree(cat.children, level + 1);
        html += `</ul>`;
      }
      
      html += `</li>`;
    });
    
    return html;
  };

  const treeHtml = renderTree(rootCategories);

  categoryTreeCache = `
    <div class="category-tree-widget">
      <div class="ct-header">
        <div class="ct-title">
          <i class="fas fa-folder-open"></i>
          <span>Categories</span>
        </div>
        <div class="ct-actions">
          <button class="ct-expand-all" title="全部展开">
            <i class="fas fa-expand-alt"></i>
          </button>
          <button class="ct-collapse-all" title="全部收起">
            <i class="fas fa-compress-alt"></i>
          </button>
          <button class="ct-fullwidth" title="全宽展示">
            <i class="fas fa-expand"></i>
          </button>
        </div>
      </div>
      <ul class="ct-root">
        ${treeHtml}
      </ul>
    </div>
  `;

  return categoryTreeCache;
}

hexo.extend.filter.register('after_render:html', function(str, data) {
  if (!str.includes('card-categories')) return str;
  
  const categoryTreeHtml = buildCategoryTree(this);
  
  const oldWidgetRegex = /<div class="card-widget card-categories">[\s\S]*?<\/div>\s*(?=<div class="card-widget|<\/div>\s*<\/aside>)/;
  
  if (oldWidgetRegex.test(str)) {
    str = str.replace(oldWidgetRegex, `<div class="card-widget">${categoryTreeHtml}</div>`);
  }
  
  return str;
});

hexo.extend.filter.register('before_generate', function() {
  categoryTreeCache = null;
});
