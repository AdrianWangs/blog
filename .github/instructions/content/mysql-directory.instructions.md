---
description: MySQL 相关文章的目录结构和组织方法
globs: 
alwaysApply: false
---

# MySQL 知识目录管理指南

## MySQL 目录结构

MySQL 相关的八股文知识点按照以下结构组织：

```
source/_posts/八股文/MYSQL/
  ├── 基础知识/    # MySQL 基础概念和原理
  ├── 索引/        # 索引相关知识点
  ├── 事务/        # 事务相关内容
  ├── 锁/          # 锁机制相关
  ├── 存储引擎/    # InnoDB、MyISAM 等存储引擎
  └── 优化/        # 性能优化相关
```

## MySQL 目录页面

MySQL 专题有一个专门的目录页面，用于组织和索引所有 MySQL 相关文章：[MySQL 知识体系](mdc:source/mysql/index.md)

## 更新 MySQL 目录

创建新的 MySQL 文章后，必须同时更新 MySQL 目录页面：

1. 根据文章类型找到适当的分类（如基础知识、索引、事务等）
2. 如果需要，为新的知识点类型创建一个新的分类
3. 添加到您新文章的链接：
```markdown
- [文章标题](/path/to/post) - 简短描述
```

4. 保持时间顺序（最新的文章放在每个分类的顶部）

## 更新菜单配置

MySQL 专题已经在主题配置中添加了导航菜单。如果需要修改，编辑 [_config.vivia.yml](mdc:_config.vivia.yml) 文件的 `menu` 部分：

```yaml
menu:
  # 其他菜单项...
  MySQL: /mysql/
```

## 文章命名与分类

创建 MySQL 相关文章时，请遵循以下规范：

1. 文件路径：`source/_posts/八股文/MYSQL/具体分类/文章名.md`
2. 前置信息：
```yaml
---
title: "MySQL 文章标题"
date: YYYY-MM-DD HH:MM:SS
categories:
  - 八股文
  - MySQL
  - 具体分类名
tags:
  - MySQL
  - 相关标签
---
```

3. 每篇文章创建后，记得更新 MySQL 知识体系目录页面

MySQL 目录可通过以下网址访问：https://adrianwangs.github.io/mysql/
