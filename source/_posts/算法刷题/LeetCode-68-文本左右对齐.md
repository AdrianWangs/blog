---
title: "LeetCode 68 - 文本左右对齐（Text Justification）"
date: 2025-05-30 12:34:29
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 字符串
  - 数组
  - 模拟
  - Medium
  - 面试经典150
  - LeetCode
description: "详解文本左右对齐算法，通过模拟方法实现单词在指定宽度内的均匀分布，掌握字符串处理和空格分配的核心技巧"
---

## 问题描述

给你一个单词数组 `words` 和一个长度 `maxWidth`，重新排版单词，使其成为每行恰好有 `maxWidth` 个字符，且左右两端对齐的文本。

你应该使用"贪心算法"来放置给定的单词；也就是说，尽可能多地往每行中放置单词。必要时可用空格 `' '` 填充，使得每行恰好有 `maxWidth` 个字符。

要求单词之间的空格应该尽可能平均分配。如果某一行单词间的空格不能平均分配，则左侧放置的空格数要多于右侧的空格数。

**文本的最后一行应为左对齐，且单词之间不插入额外的空格。**

### 示例

**示例 1：**
```
输入：words = ["This", "is", "an", "example", "of", "text", "justification."], maxWidth = 16
输出：
[
   "This    is    an",
   "example  of text",
   "justification.  "
]
```

**示例 2：**
```
输入：words = ["What","must","be","acknowledgment","shall","be"], maxWidth = 16
输出：
[
  "What   must   be",
  "acknowledgment  ",
  "shall be        "
]
```

### 约束条件

- `1 <= words.length <= 300`
- `1 <= words[i].length <= 20`
- `words[i]` 由小写英文字母和符号组成
- `1 <= maxWidth <= 100`
- `words[i].length <= maxWidth`

## 解题思路

这道题的核心是**模拟**文本编辑器的左右对齐功能。我们需要：

1. **贪心策略**：每行尽可能多地放置单词
2. **空格分配**：将剩余空格均匀分布在单词间
3. **特殊处理**：最后一行采用左对齐

### 算法步骤

#### 步骤 1：贪心填充单词

对于每一行，我们使用贪心算法尽可能多地放置单词：

```
当前行长度 = 单词总长度 + 单词间隔数（单词数 - 1）
```

如果添加下一个单词会超过 `maxWidth`，就开始处理当前行。

#### 步骤 2：计算空格分配

对于非最后一行，需要计算如何分配空格：

- **总空格数** = `maxWidth` - 单词字符总数
- **间隔数** = 单词数 - 1
- **每个间隔的基础空格** = 总空格数 ÷ 间隔数
- **额外空格数** = 总空格数 % 间隔数

**关键策略**：额外空格从左到右依次分配，确保左侧空格不少于右侧。

#### 步骤 3：处理特殊情况

1. **单个单词的行**：单词后填充空格到 `maxWidth`
2. **最后一行**：左对齐，单词间只用一个空格分隔，末尾填充空格

## 实现细节

### 核心算法可视化

以 `["This", "is", "an"]` 为例，`maxWidth = 16`：

```
步骤 1：计算空格分配
单词: "This" "is" "an"  (长度: 4 + 2 + 2 = 8)
总空格: 16 - 8 = 8
间隔数: 3 - 1 = 2
基础空格: 8 ÷ 2 = 4
额外空格: 8 % 2 = 0

步骤 2：构建结果
"This" + 4空格 + "is" + 4空格 + "an"
结果: "This    is    an"
```

### 空格分配策略

当空格无法平均分配时：

```
例如：["What", "must", "be"], maxWidth = 16
单词长度: 4 + 4 + 2 = 10
总空格: 16 - 10 = 6
间隔数: 2
基础空格: 6 ÷ 2 = 3
额外空格: 6 % 2 = 0

但如果是 ["What", "must", "be"], maxWidth = 17:
总空格: 17 - 10 = 7
基础空格: 7 ÷ 2 = 3
额外空格: 7 % 2 = 1 (给第一个间隔)

结果: "What    must   be"
      ↑4空格    ↑3空格
```

## 代码实现

```go
func fullJustify(words []string, maxWidth int) []string {
    result := []string{}
    line := []string{}
    length := 0
    
    for _, word := range words {
        // 检查是否需要换行
        if length + len(word) + len(line) > maxWidth {
            result = append(result, justify(line, maxWidth))
            line = []string{word}
            length = len(word)
        } else {
            line = append(line, word)
            length += len(word)
        }
    }
    
    // 处理最后一行（左对齐）
    if len(line) > 0 {
        lastLine := strings.Join(line, " ")
        lastLine += strings.Repeat(" ", maxWidth-len(lastLine))
        result = append(result, lastLine)
    }
    
    return result
}

func justify(words []string, maxWidth int) string {
    if len(words) == 1 {
        return words[0] + strings.Repeat(" ", maxWidth-len(words[0]))
    }
    
    // 计算需要分配的空格数
    wordChars := 0
    for _, word := range words {
        wordChars += len(word)
    }
    totalSpaces := maxWidth - wordChars
    gaps := len(words) - 1
    
    // 分配空格
    spacePerGap := totalSpaces / gaps
    extraSpaces := totalSpaces % gaps
    
    var result strings.Builder
    result.Grow(maxWidth)
    
    for i, word := range words {
        result.WriteString(word)
        if i < len(words)-1 { // 不是最后一个单词
            spaces := spacePerGap
            if i < extraSpaces {
                spaces++
            }
            result.WriteString(strings.Repeat(" ", spaces))
        }
    }
    
    return result.String()
}
```

### 执行过程分析

以示例 1 为例：

```
输入: ["This", "is", "an", "example", "of", "text", "justification."]
maxWidth = 16

第一行处理:
- "This" (4) + "is" (2) + "an" (2) = 8 + 2间隔 = 10 ≤ 16 ✓
- 尝试加入 "example" (7): 10 + 1 + 7 = 18 > 16 ✗
- 处理 ["This", "is", "an"]: 空格分配 8个，平均分配到2个间隔
- 结果: "This    is    an"

第二行处理:
- "example" (7) + "of" (2) + "text" (4) = 13 + 2间隔 = 15 ≤ 16 ✓
- 尝试加入 "justification.": 超出限制
- 处理 ["example", "of", "text"]: 剩余3个空格，分配到2个间隔
- 结果: "example  of text"

最后一行:
- ["justification."] 左对齐，后补空格
- 结果: "justification.  "
```

## 复杂度分析

### 时间复杂度

$$T(n) = O(n)$$

其中 $n$ 是单词总数。每个单词只被处理一次，字符串构建操作虽然涉及空格计算，但总的字符数是固定的（$\text{maxWidth} \times \text{行数}$）。

### 空间复杂度

$$S(n) = O(k)$$

其中 $k$ 是结果的总字符数。除了存储结果外，只使用了常数额外空间来存储当前行的单词。

## 算法特点分析

| 方面 | 评价 | 说明 |
|------|------|------|
| 时间复杂度 | $O(n)$ | 每个单词只处理一次，字符串构建时间与总输出长度成正比 |
| 空间复杂度 | $O(k)$ | 主要用于存储结果，$k$ 为输出字符总数 |
| 代码简洁度 | ★★★★☆ | 逻辑清晰，使用 Go 标准库简化实现 |
| 易理解性 | ★★★★☆ | 算法思路直观，分步骤处理易于理解 |
| 实现难度 | ★★★☆☆ | 需要正确处理多种边界情况 |

## 关键收获

### 核心算法思想

1. **贪心策略**：每行尽可能多地放置单词，这是最优策略
2. **数学分配**：使用除法和取模运算实现空格的均匀分配
3. **边界处理**：区分普通行、单词行和最后一行的不同处理逻辑

### 常见陷阱与避免方法

1. **空格分配错误**：
   - ❌ 错误：平均分配空格后忽略余数
   - ✅ 正确：余数空格从左到右依次分配

2. **最后一行处理**：
   - ❌ 错误：最后一行也进行左右对齐
   - ✅ 正确：最后一行只需左对齐

3. **单词行处理**：
   - ❌ 错误：单个单词也尝试进行空格分配
   - ✅ 正确：单个单词直接右侧填充空格

### 扩展应用

这个算法的思想可以应用到：
- 文档排版系统
- 代码格式化工具
- 表格对齐算法
- UI 布局分配算法

**参考链接**：[LeetCode 68. 文本左右对齐](https://leetcode.cn/problems/text-justification/description/) 