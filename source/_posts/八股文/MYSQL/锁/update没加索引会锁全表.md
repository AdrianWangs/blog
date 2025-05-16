---
title: 'MySQL中update不带索引的危险：全表锁定详解'
date: 2025-05-16 10:00:00
categories:
  - 八股文
  - MySQL
  - 索引
tags:
  - MySQL
  - 索引
  - 锁
  - 性能优化
  - 事故分析
description: '深入剖析MySQL中update语句不带索引的危险性，解释为什么会导致全表锁定，以及如何通过正确使用索引和安全更新模式来避免此类生产事故。'
---
