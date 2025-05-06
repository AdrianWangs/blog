---
description: 技术面试文章模板（八股文），用于创建技术知识点详解
globs: 
alwaysApply: false
---
# Technical Interview Article (八股文) Template

## Article Structure for Technical Interview Content

When creating a new technical interview article (八股文):

1. Create a new Markdown file manually in the `source/_posts/` directory:
```bash
# File should be named in this format:
YYYY-MM-DD-技术八股-Topic-Title.md
```

2. Add the front matter to include appropriate metadata:
```yaml
---
title: "技术八股: Topic Title"
date: YYYY-MM-DD HH:MM:SS  # 使用time-mcp工具获取当前时间
categories:
  - 技术八股
tags:
  - 相关技术 (e.g., Java, Python, React, etc.)
  - 八股文
  - 面试题
  - 相关领域 (e.g., 后端, 前端, 数据库, etc.)
description: "技术知识点的简要描述，包括核心概念和面试要点（150-200字符）"
---
```

> **重要提示**: 
> 1. 务必填写 `description` 字段，简要描述技术知识点的核心概念和面试要点，这对于SEO和文章列表展示很重要。
> 2. 使用 time-mcp 工具获取当前时间，确保时间戳准确。参见 [Time Tools Usage](mdc:hexo-blog/.cursor/rules/blog/time-tools-usage.mdc) 规则。
> 3. 对于包含数学公式的内容，请参照 [数学公式展示指南](mdc:hexo-blog/.cursor/rules/content/math-formula-guide.mdc) 进行格式化。

3. Structure your post with these sections:

   ### Topic Overview
   - Provide a clear definition of the concept
   - Explain why this topic is important in interviews
   - Include a brief history or context if relevant
   - 对于涉及数学概念的主题，使用内联公式表示关键概念：
     ```markdown
     哈希函数需要满足均匀分布的特性，理想情况下每个桶的元素数量应约为 $\frac{n}{m}$，其中 $n$ 是元素总数，$m$ 是桶的数量。
     ```

   ### Core Concepts
   - Break down the fundamental principles
   - Use bold text for key terms: **important term**
   - Include diagrams or flowcharts when helpful
   - Structure concepts in a logical progression
   - 对于需要数学表达的核心概念，使用规范的公式格式：
     ```markdown
     B+树的平衡因子计算公式：$\text{balance factor} = \text{height}(\text{left}) - \text{height}(\text{right})$
     ```

   ### Key Points to Remember
   - List interview-ready points in bullet format
   - Focus on frequently asked aspects
   - Include code snippets where appropriate
   - Emphasize common misconceptions and correct answers
   - 对于包含数学公式的要点，使用清晰的公式表示：
     ```markdown
     - 红黑树的黑色高度定义：从任一节点到其任意叶子节点的路径上的黑色节点数量 $bh(x)$
     - 时间复杂度分析：平衡二叉树的查找时间复杂度为 $O(\log n)$
     ```

   ### Comparison of Approaches/Implementations
   - Use tables to compare different methods or technologies:
     ```
     | 方面 | 技术一 | 技术二 |
     | ---- | ---- | ----- |
     | 优点 | 内容 | 内容 |
     | 缺点 | 内容 | 内容 |
     | 适用场景 | 内容 | 内容 |
     | 复杂度 | $O(n)$ | $O(n \log n)$ |
     ```

   ### Common Interview Questions & Answers
   - Format as Q&A pairs
   - Include both basic and advanced questions
   - Provide concise but comprehensive answers
   - Add follow-up points interviewers might ask
   - 对于涉及数学推导的问题，使用块级公式展示详细过程：
     ```markdown
     Q: 解释B+树和B树在查询效率上的区别？
     
     A: B+树的所有数据都存储在叶子节点，非叶子节点只存储键值，这使得B+树的查询效率更稳定。
     对于一个高度为h的B+树，查询任何数据的时间复杂度都是 $O(h)$，其中：
     
     $$
     h \approx \log_d(n)
     $$
     
     其中 $d$ 是树的分支因子，$n$ 是数据量。
     ```

   ### Best Practices & Optimizations
   - List industry-standard practices
   - Explain performance considerations
   - Mention scalability aspects
   - Include real-world application examples
   - 使用数学公式解释性能考量：
     ```markdown
     数据库索引选择性计算公式：$\text{selectivity} = \frac{\text{unique values}}{\text{total records}}$，
     理想的索引应具有较高的选择性（接近1）。
     ```

   ### Example Implementation
   - Provide clean, well-commented code examples
   - Include step-by-step explanations
   - Show alternative implementations if applicable
   - Point out potential pitfalls in implementation
   - 对于涉及算法的实现，添加复杂度分析：
     ```markdown
     ```java
     // 实现代码
     ```
     
     算法时间复杂度分析：$O(n^2)$，因为：
     
     $$
     \sum_{i=1}^{n} i = \frac{n(n+1)}{2} \approx \frac{1}{2}n^2 = O(n^2)
     $$
     ```

   ### Related Topics
   - Link to related concepts
   - Mention how this topic connects to broader themes
   - Suggest follow-up study areas

4. Enhancement tips:
   - Use consistent formatting throughout
   - Include diagrams where concepts are visual
   - Add memory aids or mnemonics where helpful
   - Provide references to authoritative sources
   - Consider including interview experiences related to this topic
   - 对于所有数学公式，遵循[数学公式展示指南](mdc:hexo-blog/.cursor/rules/content/math-formula-guide.mdc)中的规范，确保公式既美观又易于理解

## 使用time-mcp工具获取当前时间

在设置文章的日期时，使用以下工具获取准确的网络时间：

```
<function_calls>
<invoke name="mcp_time-mcp_current_time">
<parameter name="format">YYYY-MM-DD HH:mm:ss