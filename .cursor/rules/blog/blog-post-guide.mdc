---
description: 创建博客文章的基本指南，包括文章格式和元数据设置
globs: 
alwaysApply: false
---
# Hexo Blog Post Guide

## Post Format
Blog posts use Markdown with YAML front matter at the top.

### Essential Front Matter
```yaml
---
title: Your Post Title
date: YYYY-MM-DD HH:MM:SS
categories: 
  - Category1
  - Category2
tags:
  - Tag1
  - Tag2
description: "A concise summary of the post content (150-200 characters)"
---
```

### Required Fields
All posts **must** include the `description` field in the front matter. This is used for SEO purposes and for providing summaries on index pages. The description should be a concise summary of the post's content, ideally between 150-200 characters.

### Publication Date Requirement
When creating a new post, the publication date (`date` field in front matter) must be set to the current network time rather than local system time to ensure consistency across all posts.

#### Important: Using time-mcp Tools
Always use the time-mcp tools to get the current time when creating or updating posts. This ensures consistency and accuracy in post timestamps.

For example, when using Claude in Cursor, you should use:

```
<function_calls>
<invoke name="mcp_time-mcp_current_time">
<parameter name="format">YYYY-MM-DD HH:mm:ss