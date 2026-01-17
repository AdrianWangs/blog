'use strict';

hexo.extend.filter.register('before_post_render', function(data) {
  if (data.cover) return data;
  
  const imgRegex = /!\[.*?\]\((.*?)\)|<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  
  while ((match = imgRegex.exec(data.content)) !== null) {
    const imgUrl = match[1] || match[2];
    
    if (!imgUrl) continue;
    if (imgUrl.includes('badge') || imgUrl.includes('shield')) continue;
    if (imgUrl.endsWith('.svg')) continue;
    if (imgUrl.startsWith('data:')) continue;
    
    if (imgUrl.startsWith('http')) {
      data.cover = imgUrl;
      break;
    }
    
    if (imgUrl.startsWith('/')) {
      data.cover = imgUrl;
      break;
    }
    
    if (imgUrl.endsWith('.png') || imgUrl.endsWith('.jpg') || imgUrl.endsWith('.jpeg') || imgUrl.endsWith('.gif') || imgUrl.endsWith('.webp')) {
      let postPath = data.path || '';
      postPath = postPath.replace(/index\.html$/, '').replace(/\.html$/, '/');
      if (!postPath.endsWith('/')) postPath += '/';
      
      const imgFileName = imgUrl.split('/').pop();
      data.cover = '/' + postPath + imgFileName;
      break;
    }
  }
  
  return data;
});
