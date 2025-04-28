---
description: 管理博客的 Git 工作流程和常用命令
globs: 
alwaysApply: false
---

# Git Workflow Guide

## Blog Repository Management with GitHub Actions

With GitHub Actions handling your Hexo blog deployment, your workflow is simplified to just git commands:

1. **Create or edit content** directly in your local repository
   - Create markdown files manually in the appropriate source directory
   - Edit existing files as needed

2. **Check status of changes**:
   ```bash
   git status
   ```

3. **Add all new or modified files**:
   ```bash
   git add .
   ```

4. **Commit changes with descriptive message**:
   ```bash
   git commit -m "Add new post: [post title]"
   ```

5. **Push changes to trigger deployment**:
   ```bash
   git push origin main
   ```

Once you push your changes, GitHub Actions will automatically:
- Build your Hexo site
- Deploy it to GitHub Pages
- Make it available at your site URL

## Simplified Workflow

```bash
# One-line workflow for quick updates
git add . && git commit -m "Add new post: [post title]" && git push origin main
```

## Git Configuration

Make sure your git repository is properly configured:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

**Important**: You don't need to run any npm, npx, or hexo commands locally. GitHub Actions handles all building and deployment when you push to GitHub.
