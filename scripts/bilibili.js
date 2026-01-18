'use strict';

hexo.extend.tag.register('bilibili', function(args) {
  const bvid = args[0];
  if (!bvid) {
    return '';
  }

  const page = args[1] || 1;
  const width = args[2] || '100%';
  const ratio = args[3] || '16/9';

  return `<div class="video-container" style="position:relative;width:${width};aspect-ratio:${ratio};">
<iframe src="https://player.bilibili.com/player.html?bvid=${bvid}&page=${page}&autoplay=0&high_quality=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="position:absolute;width:100%;height:100%;left:0;top:0;">
</iframe>
</div>`;
});
