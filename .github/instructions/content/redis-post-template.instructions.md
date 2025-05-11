---
description:
globs:
alwaysApply: false
---
# Redis 文章模板

本文档提供了 Redis 文章的通用模板，包括内容结构和格式要求。

## 基本结构

每篇 Redis 相关文章应遵循以下基本结构：

```markdown
---
title: [文章标题]
date: YYYY-MM-DD HH:MM:SS
categories:
  - 八股文
  - REDIS
  - [具体分类，如：基础知识、高级特性、集群]
tags:
  - REDIS
  - [具体特性，如：持久化、分布式锁、集群等]
description: [文章简短描述，会显示在文章列表中]
---

## 概述

简要介绍本文主题的背景、意义和应用场景。

## 核心概念

详细解释相关的核心概念和原理。

## 实现机制

分析 Redis 该特性的底层实现原理和机制。

## 使用方法

提供相关命令和代码示例，展示如何在实际项目中使用该特性。

```bash
# 命令示例
SET key value
GET key
```

```java
// Java 代码示例
Jedis jedis = new Jedis("localhost");
jedis.set("key", "value");
String value = jedis.get("key");
```

## 常见问题与解决方案

列出使用该特性时的常见问题和解决方案。

## 最佳实践

总结该特性使用的最佳实践和优化建议。

## 参考资料

- [Redis 官方文档](https://redis.io/documentation)
- 其他参考资料
```

## 内容要求

1. **准确性**：内容必须准确，参考 Redis 官方文档和权威资料
2. **深度**：深入分析原理，不仅介绍"是什么"，还要解释"为什么"和"如何实现"
3. **实用性**：提供实际可用的代码示例和最佳实践
4. **结构清晰**：使用合理的标题层级，保持文章结构清晰

## 图片要求

1. 图片应存放在与文章同名的目录中，例如 `Redis事务.md` 的图片应存放在 `Redis事务/` 目录下
2. 图片命名规则：使用时间戳作为文件名，例如 `1745568387988.png`
3. 在文章中引用图片时使用相对路径，例如：`![图片说明](Redis事务/1745568387988.png)`

## 代码示例

代码示例应包含注释，并指明语言类型：

```java
// 创建 Redis 连接
Jedis jedis = new Jedis("localhost");
// 设置键值对
jedis.set("key", "value");
```

## 面试要点

如适用，可以在文章末尾添加"面试要点"部分，总结与该主题相关的常见面试问题和答案。

## 参考范例

参考 MySQL 文章中的 [索引简介](/source/_posts/八股文/MYSQL/索引/索引简介.md) 作为编写范例。
