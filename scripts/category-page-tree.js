'use strict';

hexo.extend.filter.register('after_render:html', function(str, data) {
  if (!data.path || !data.path.startsWith('categories/')) return str;
  if (data.path === 'categories/index.html') return str;
  
  const pathParts = data.path.replace('categories/', '').replace('/index.html', '').split('/');
  if (pathParts.length === 0 || !pathParts[0]) return str;
  
  const currentCategoryName = decodeURIComponent(pathParts[pathParts.length - 1]);
  
  const categories = this.locals.get('categories');
  const posts = this.locals.get('posts');
  
  if (!categories || !posts) return str;
  
  let currentCategory = null;
  categories.forEach(cat => {
    if (cat.name === currentCategoryName) {
      currentCategory = cat;
    }
  });
  
  if (!currentCategory) return str;
  
  const childCategories = [];
  categories.forEach(cat => {
    if (cat.parent === currentCategory._id) {
      childCategories.push(cat);
    }
  });
  
  if (childCategories.length === 0) return str;
  
  const getAllDescendantPosts = (category) => {
    const result = [];
    const categoryIds = new Set();
    
    const collectCategoryIds = (cat) => {
      categoryIds.add(cat._id);
      categories.forEach(c => {
        if (c.parent === cat._id) {
          collectCategoryIds(c);
        }
      });
    };
    collectCategoryIds(category);
    
    posts.forEach(post => {
      if (post.categories && post.categories.length) {
        post.categories.forEach(postCat => {
          if (categoryIds.has(postCat._id)) {
            result.push(post);
          }
        });
      }
    });
    
    const uniquePosts = [];
    const seenIds = new Set();
    result.forEach(post => {
      if (!seenIds.has(post._id)) {
        seenIds.add(post._id);
        uniquePosts.push(post);
      }
    });
    
    return uniquePosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  const getDirectPosts = (category) => {
    const result = [];
    posts.forEach(post => {
      if (post.categories && post.categories.length) {
        const lastCategory = post.categories.data[post.categories.data.length - 1];
        if (lastCategory && lastCategory._id === category._id) {
          result.push(post);
        }
      }
    });
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const getSubCategories = (parentCat) => {
    const subs = [];
    categories.forEach(cat => {
      if (cat.parent === parentCat._id) {
        subs.push(cat);
      }
    });
    return subs.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  };
  
  const renderCategorySection = (cat, level = 0) => {
    const catPosts = getDirectPosts(cat);
    const subCats = getSubCategories(cat);
    const totalPosts = getAllDescendantPosts(cat).length;
    const indent = level * 20;
    
    let html = `
      <div class="cpt-category-section" data-level="${level}" style="margin-left: ${indent}px;">
        <div class="cpt-category-header ${catPosts.length > 0 || subCats.length > 0 ? 'has-content' : ''}" data-expanded="true">
          <span class="cpt-toggle">
            <i class="fas fa-chevron-down"></i>
          </span>
          <a class="cpt-category-link" href="/${cat.path}">
            <i class="fas fa-folder-open"></i>
            <span class="cpt-category-name">${cat.name}</span>
          </a>
          <span class="cpt-category-count">${totalPosts}</span>
        </div>
        <div class="cpt-category-content">
    `;
    
    if (catPosts.length > 0) {
      html += `<div class="cpt-posts-list">`;
      catPosts.forEach(post => {
        const title = post.title || '无标题';
        const dateStr = formatDate(post.date);
        html += `
          <a class="cpt-post-item" href="/${post.path}" title="${title}">
            <span class="cpt-post-date">
              <i class="far fa-calendar-alt"></i>
              ${dateStr}
            </span>
            <span class="cpt-post-title">${title}</span>
          </a>
        `;
      });
      html += `</div>`;
    }
    
    if (subCats.length > 0) {
      html += `<div class="cpt-subcategories">`;
      subCats.forEach(subCat => {
        html += renderCategorySection(subCat, level + 1);
      });
      html += `</div>`;
    }
    
    html += `
        </div>
      </div>
    `;
    
    return html;
  };
  
  let treeHtml = `
    <div class="category-page-tree">
      <div class="cpt-header">
        <div class="cpt-actions">
          <button class="cpt-expand-all" title="全部展开">
            <i class="fas fa-expand-alt"></i>
            <span>展开全部</span>
          </button>
          <button class="cpt-collapse-all" title="全部收起">
            <i class="fas fa-compress-alt"></i>
            <span>收起全部</span>
          </button>
        </div>
      </div>
      <div class="cpt-tree-content">
  `;
  
  const directPosts = getDirectPosts(currentCategory);
  if (directPosts.length > 0) {
    treeHtml += `
      <div class="cpt-direct-posts">
        <div class="cpt-direct-posts-header">
          <i class="fas fa-file-alt"></i>
          <span>本分类文章</span>
          <span class="cpt-category-count">${directPosts.length}</span>
        </div>
        <div class="cpt-posts-list">
    `;
    directPosts.forEach(post => {
      const title = post.title || '无标题';
      const dateStr = formatDate(post.date);
      treeHtml += `
        <a class="cpt-post-item" href="/${post.path}" title="${title}">
          <span class="cpt-post-date">
            <i class="far fa-calendar-alt"></i>
            ${dateStr}
          </span>
          <span class="cpt-post-title">${title}</span>
        </a>
      `;
    });
    treeHtml += `
        </div>
      </div>
    `;
  }
  
  childCategories.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  childCategories.forEach(childCat => {
    treeHtml += renderCategorySection(childCat, 0);
  });
  
  treeHtml += `
      </div>
    </div>
  `;
  
  const categoryPageRegex = /<div[^>]*id=["']category["'][^>]*>[\s\S]*?<div[^>]*class=["'][^"']*article-sort-title[^"']*["'][^>]*>[^<]*<\/div>\s*(<div[^>]*class=["'][^"']*article-sort["'][^>]*>[\s\S]*?<\/div>)/;
  
  if (categoryPageRegex.test(str)) {
    str = str.replace(categoryPageRegex, (match, articleSort) => {
      return match.replace(articleSort, treeHtml + articleSort.replace(/<div/, '<div style="display:none;" '));
    });
  } else {
    const simpleRegex = /<div[^>]*class=["'][^"']*article-sort["'][^>]*>/;
    if (simpleRegex.test(str)) {
      str = str.replace(simpleRegex, treeHtml + '<div class="article-sort" style="display:none;">');
    }
  }
  
  return str;
});
