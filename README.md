# 小王的博客 (Adrian Wang's Blog)

这是一个基于 Hexo 构建的个人技术博客，专注于算法刷题、数据库（MySQL）和前沿技术（如 AI 工程）的知识分享。

## 📚 博客特点

- 算法题解：包含 LeetCode 等平台的算法题目解析
- 技术八股文：MySQL 等数据库相关的技术知识总结
- 前沿技术：AI 工程等领域的技术探索
- 支持数学公式、代码高亮和 Mermaid 图表

## 🔧 技术栈

- **框架**：[Hexo](https://hexo.io/) - 快速、简洁且高效的博客框架
- **主题**：Vivia - 一个简洁美观的 Hexo 主题
- **部署**：GitHub Pages + GitHub Actions 自动化部署
- **依赖**：详见 [package.json](package.json)

## 🗂️ 项目结构

```
hexo-blog/
├── .github/workflows/   # GitHub Actions 工作流配置
├── public/              # 生成的静态文件
├── scaffolds/           # 模板文件
├── scripts/             # 自定义脚本
├── source/              # 源文件
│   ├── _posts/          # 博客文章
│   │   ├── 八股文/       # 技术知识点文章
│   │   ├── 前沿技术/     # 前沿技术文章
│   │   └── 算法刷题/     # 算法解题文章
│   └── [其他页面]/       # 其他自定义页面
├── themes/              # 主题文件
│   └── vivia/           # Vivia 主题
├── .leetcode/           # LeetCode 算法解题代码
├── _config.yml          # 主配置文件
└── _config.vivia.yml    # Vivia 主题配置文件
```

## 🚀 本地开发

### 环境准备

```bash
# 克隆仓库
git clone https://github.com/YourUsername/hexo-blog.git
cd hexo-blog

# 安装依赖
npm install

# 启动本地服务器
npm run server
```

### 常用命令

```bash
# 创建新文章
hexo new post "文章标题"

# 创建新算法题解（自动更新目录）
npm run new-algo "LeetCode-xxx-题目名称"

# 更新算法目录
npm run update-algo-dir

# 生成静态文件
npm run build

# 清理缓存
npm run clean

# 本地预览
npm run server

# 部署到 GitHub Pages
npm run deploy

# 提交并推送
npm run git-commit "commit message" && npm run git-push
```

## 📝 创建新文章

博客文章使用 Markdown 格式，并在文件开头使用 YAML front matter 设置元数据。

### 文章元数据格式

```yaml
---
title: 文章标题
date: YYYY-MM-DD HH:MM:SS
categories:
  - 分类1
  - 分类2
tags:
  - 标签1
  - 标签2
---

文章内容...
```

## 📦 自动部署

本博客使用 GitHub Actions 进行自动部署。当代码推送到 GitHub 仓库后，会自动触发构建和部署流程：

1. 安装依赖
2. 生成静态文件
3. 部署到 GitHub Pages

详细配置见 [.github/workflows/pages.yml](.github/workflows/pages.yml)


---

© 2025 Adrian Wang
