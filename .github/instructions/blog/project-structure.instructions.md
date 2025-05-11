---
description: Hexo 博客项目结构概述，包含主要配置文件和目录说明
globs: 
alwaysApply: false
---
# Hexo Blog Project Structure

This is a Hexo-based blog with the following key components:

## Configuration Files
- [_config.yml](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/_config.yml) - Main Hexo configuration
- [_config.vivia.yml](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/_config.vivia.yml) - Vivia theme configuration

## Content
- [source/_posts/](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/source/_posts) - Blog post content
- [source/about/](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/source/about) - About page
- [source/categories/](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/source/categories) - Category pages
- [source/tags/](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/source/tags) - Tag pages

## Theme
- [themes/vivia/](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/themes/vivia) - Current active theme (Vivia)

## Build & Deploy
- [package.json](mdc:hexo-blog/hexo-blog/hexo-blog/hexo-blog/package.json) - NPM dependencies and scripts

# 内容规则索引

这个文件提供了内容创建相关规则的索引。

## 通用文章创建规则

- [通用文章模板](mdc:hexo-blog/.cursor/rules/content/generic-article-template.mdc) - 用于一般博客文章的模板
- [时间工具使用指南](mdc:hexo-blog/.cursor/rules/blog/time-tools-usage.mdc) - 如何在文章中使用时间工具

## 算法文章规则

- [算法文章模板](mdc:hexo-blog/.cursor/rules/content/algorithm-post-template.mdc) - 算法题解文章模板
- [算法错误分析](mdc:hexo-blog/.cursor/rules/content/algorithm-error-analysis.mdc) - 算法错误分析指南
- [算法目录](mdc:hexo-blog/.cursor/rules/content/algorithm-directory.mdc) - 如何更新算法目录

## 技术文章规则

- [技术文章模板](mdc:hexo-blog/.cursor/rules/content/technical-article-template.mdc) - 技术面试文章模板（八股文）
- [MySQL目录](mdc:hexo-blog/.cursor/rules/content/mysql-directory.mdc) - MySQL相关文章的目录结构

## Redis文章规则

- [Redis目录](mdc:hexo-blog/.cursor/rules/content/redis-directory.mdc) - Redis文章目录结构
- [Redis文章模板](mdc:hexo-blog/.cursor/rules/content/redis-post-template.mdc) - Redis文章模板
- [Redis内容概览](mdc:hexo-blog/.cursor/rules/content/redis-content-overview.mdc) - Redis内容概览与管理
