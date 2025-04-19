const { updateAlgorithmDirectory } = require('./update-algorithm-directory');

// Run update after generating site
hexo.on('generateAfter', () => {
  // Only run this hook if not in server mode (when building the site)
  if (!hexo.env.args.server && !hexo.env.args.s) {
    updateAlgorithmDirectory();
  }
});

// Also run when adding a new post with category '算法刷题'
hexo.on('new', (post) => {
  // This runs immediately after a new post is created
  // We'll need to set a delay to give time to edit the post
  setTimeout(() => {
    updateAlgorithmDirectory();
    hexo.log.info('Algorithm directory updated after new post creation');
  }, 1000); // 1 second delay
}); 