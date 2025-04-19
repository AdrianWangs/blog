const fs = require('fs');
const path = require('path');
const moment = require('moment');
const yaml = require('js-yaml');

// Get the full path to the source directory
const sourceDir = path.join(__dirname, '..', 'source');
const postsDir = path.join(sourceDir, '_posts');
const algorithmIndexPath = path.join(sourceDir, 'algorithms', 'index.md');

// Function to parse front matter from a post
function parsePost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontMatterRegex);

    if (match && match[1]) {
      const frontMatter = yaml.load(match[1]);
      const permalink = filePath.replace(postsDir, '')
        .replace(/\.md$/, '/')
        .replace(/^\/?/, '/');

      return {
        title: frontMatter.title,
        date: frontMatter.date,
        categories: frontMatter.categories,
        tags: frontMatter.tags,
        filePath: filePath,
        permalink: `/20${permalink.substring(1, 3)}/${permalink.substring(4, 6)}/${permalink.substring(7, 9)}${permalink.substring(9)}`,
        content: content
      };
    }
  } catch (err) {
    console.error(`Error parsing post ${filePath}:`, err);
  }
  return null;
}

// Function to get algorithm type from post tags
function getAlgorithmType(post) {
  if (!post.tags || !Array.isArray(post.tags)) return 'Other';

  // Common algorithm types to check for
  const algorithmTypes = [
    '数组', '字符串', '链表', '栈', '队列', '树', '图', '堆', '哈希表',
    '排序', '二分查找', '双指针', '滑动窗口', 'DFS', 'BFS', '深度优先搜索',
    '广度优先搜索', '动态规划', 'DP', '贪心', '回溯', '位运算'
  ];

  for (const tag of post.tags) {
    for (const type of algorithmTypes) {
      if (tag.toLowerCase().includes(type.toLowerCase())) {
        return tag;
      }
    }
  }

  // Return the first tag if no algorithm type is found
  return post.tags[0] || 'Other';
}

// Function to update algorithm directory
function updateAlgorithmDirectory() {
  console.log('Updating algorithm directory...');

  // Read all posts
  const files = fs.readdirSync(postsDir);
  const algorithmPosts = [];

  // Parse all algorithm-related posts
  for (const file of files) {
    if (file.endsWith('.md')) {
      const post = parsePost(path.join(postsDir, file));
      if (post && post.categories) {
        const categories = Array.isArray(post.categories) ? post.categories : [post.categories];
        if (categories.some(cat => cat === '算法刷题' || cat.includes('algorithm') || cat.includes('leetcode'))) {
          algorithmPosts.push(post);
        }
      }
    }
  }

  // Sort posts by date (newest first)
  algorithmPosts.sort((a, b) => moment(b.date).unix() - moment(a.date).unix());

  // Group posts by algorithm type
  const postsByType = {};
  for (const post of algorithmPosts) {
    const type = getAlgorithmType(post);
    if (!postsByType[type]) postsByType[type] = [];
    postsByType[type].push(post);
  }

  // Read the current algorithm index content
  let indexContent = '';
  try {
    indexContent = fs.readFileSync(algorithmIndexPath, 'utf8');
  } catch (err) {
    console.error('Error reading algorithm index file:', err);
    return;
  }

  // Find the position where the posts list should start
  const headingPosition = indexContent.indexOf('## 刷题记录');
  if (headingPosition === -1) {
    console.error('Could not find the "刷题记录" section in the algorithm index file.');
    return;
  }

  // Keep the front matter and content up to the scribble record section
  const headerContent = indexContent.substring(0, headingPosition + 8);

  // Generate new content for the scribble record section
  let newContent = headerContent + '\n\n以下是按题目类型组织的刷题记录：\n\n';

  // Add posts by type
  for (const type in postsByType) {
    newContent += `### ${type}\n`;
    for (const post of postsByType[type]) {
      // Extract brief description from post content if possible
      let description = '';
      const descriptionMatch = post.content.match(/Problem Description[:\s]+(.*?)(?:\n\n|\n##)/s);
      if (descriptionMatch && descriptionMatch[1]) {
        description = descriptionMatch[1].trim().split('\n')[0].substring(0, 50);
        if (description.length === 50) description += '...';
      }

      newContent += `- [${post.title}](${post.permalink}) - ${description}\n`;
    }
    newContent += '\n';
  }

  // Write the updated content back to the file
  fs.writeFileSync(algorithmIndexPath, newContent, 'utf8');
  console.log('Algorithm directory updated successfully!');
}

// Execute the update function when the script is run directly
if (require.main === module) {
  updateAlgorithmDirectory();
}

// Export the function for use in Hexo events
module.exports = {
  updateAlgorithmDirectory
}; 