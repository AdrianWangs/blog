---
description:
globs:
alwaysApply: false
---
# 系统设计文章模板

本文档提供了系统设计相关文章的通用模板，包括内容结构和格式要求。

## 基本结构

每篇系统设计相关文章应遵循以下基本结构：

```markdown
---
title: "系统设计 - [文章标题]"
date: YYYY-MM-DD HH:MM:SS
categories:
  - 八股文
  - 系统设计
  - [具体分类，如：基础概念、分布式系统、微服务架构等]
tags:
  - 系统设计
  - [相关技术标签，如：分布式、微服务、高可用等]
description: [文章简短描述，会显示在文章列表中]
---

## 概述

简要介绍本文讨论的系统设计概念或原则，包括:
- 背景和起源
- 在系统设计中的重要性
- 适用场景

## 核心概念

详细解释相关的核心概念和原理:
- 关键术语定义
- 理论基础
- 核心特性

## 实现机制

分析该系统设计概念或模式的实现机制:
- 实现原理
- 常见实现方式
- 关键算法或设计模式

## 实际应用

提供实际应用案例和代码示例:

```java
// Java 代码示例
@Idempotent
public Result processPayment(String orderId) {
    // 实现代码
}
```

## 优势与局限性

讨论该设计概念或模式的:
- 主要优势和适用场景
- 潜在局限性和挑战
- 与其他设计概念的对比

## 最佳实践

总结使用该设计概念或模式的最佳实践:
- 设计建议
- 避免的常见错误
- 实施策略

## 案例分析

通过一个或多个实际案例深入分析:
- 问题背景
- 解决方案设计
- 实施结果和经验教训

## 面试考点

总结该主题在技术面试中的常见问题和答题要点:
- 概念性面试题
- 设计题思路
- 代码实现关键点

## 参考资料

- [相关技术文档](https://example.com/)
- [学术论文或书籍](https://example.com/)
- [行业最佳实践指南](https://example.com/)
```

## 幂等性文章专用结构

对于幂等性相关文章，建议特别包含以下内容部分：

### 幂等性定义与范围
- 清晰定义什么是幂等性
- 幂等与非幂等操作的区别
- 在不同上下文中的含义（HTTP API、数据库操作、消息队列等）

### 幂等性的重要性
- 为什么在分布式系统中特别重要
- 不保证幂等性可能导致的问题
- 典型的错误案例分析

### 实现幂等性的常用策略
- 唯一标识符/Token策略
- 去重表/幂等表
- 状态机设计
- 分布式锁机制

### 不同场景下的幂等性设计
- HTTP/REST API的幂等性设计
- 消息队列中的幂等消费
- 支付系统的幂等性保证
- 分布式事务中的幂等性

### 幂等性测试与验证
- 如何测试系统的幂等性
- 常见的幂等性测试方法
- 自动化测试策略

## 内容要求

1. **准确性**：内容必须准确，参考权威技术文档和最佳实践
2. **深度**：深入分析原理，不仅介绍"是什么"，还要解释"为什么"和"如何实现"
3. **实用性**：提供实际可用的代码示例和最佳实践
4. **结构清晰**：使用合理的标题层级，保持文章结构清晰

## 图片要求

1. 图片应存放在与文章同名的目录中
2. 图片命名规则：使用时间戳作为文件名，例如 `1745568387988.png`
3. 在文章中引用图片时使用相对路径

## 代码示例

代码示例应包含注释，并指明语言类型：

```java
// 幂等性API示例
@PostMapping("/payment")
public Response processPayment(@RequestBody PaymentRequest request) {
    // 使用请求中的idempotencyKey确保幂等性
    String idempotencyKey = request.getIdempotencyKey();
    
    // 检查该idempotencyKey是否已处理过
    if (idempotencyRepository.exists(idempotencyKey)) {
        // 返回之前的处理结果
        return idempotencyRepository.getResult(idempotencyKey);
    }
    
    // 处理新的支付请求
    Response result = paymentService.process(request);
    
    // 保存结果与idempotencyKey的关联
    idempotencyRepository.save(idempotencyKey, result);
    
    return result;
}
```
