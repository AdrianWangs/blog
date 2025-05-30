---
title: "LeetCode 28 - 找出字符串中第一个匹配项的下标（Find the Index of the First Occurrence in a String）"
date: 2025-05-28 22:27:44
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 字符串
  - KMP算法
  - 模式匹配
  - Medium
  - 面试经典150
  - LeetCode
description: "使用KMP算法解决字符串模式匹配问题，详细讲解next数组构建过程和算法优化，通过具体例子演示完整匹配流程。"
---

## 问题描述

给你两个字符串 `haystack` 和 `needle` ，请你在 `haystack` 字符串中找出 `needle` 字符串的第一个匹配项的下标（下标从 0 开始）。如果 `needle` 不是 `haystack` 的一部分，则返回 `-1`。

### 示例

**示例 1：**
```
输入：haystack = "sadbutsad", needle = "sad"
输出：0
解释："sad" 在下标 0 和 6 处匹配。第一个匹配项的下标是 0。
```

**示例 2：**
```
输入：haystack = "leetcode", needle = "leeto"
输出：-1
解释："leeto" 没有在 "leetcode" 中出现，所以返回 -1。
```

### 约束条件

- `1 <= haystack.length, needle.length <= 10^4`
- `haystack` 和 `needle` 仅由小写英文字符组成

## 解题思路

这道题是经典的字符串匹配问题，最优解是使用 **KMP（Knuth-Morris-Pratt）算法**。KMP算法的核心思想是：**当匹配失败时，利用已匹配的前缀信息，避免从头开始重新匹配**。

### KMP算法核心概念

1. **next数组（部分匹配表）**：记录模式串中每个位置的最长相等前后缀长度
2. **失配跳转**：当字符不匹配时，根据next数组跳转到合适位置，而不是从头开始

### 算法步骤详解

#### 视频讲解

<video src="./KMPAnimation.mp4" controls></video>

#### 步骤1：构建next数组

next数组的定义：`next[i]` 表示模式串 `needle[0...i]` 的最长相等前后缀的长度。

**构建过程示例**（以 `needle = "ababaca"` 为例）：

```
模式串：  a  b  a  b  a  c  a
索引：    0  1  2  3  4  5  6
next：   [0  0  1  2  3  0  1]
```

详细构建过程：
- `i=0`: `next[0] = 0`（规定为0）
- `i=1`: `"ab"` 无相等前后缀，`next[1] = 0`
- `i=2`: `"aba"` 最长相等前后缀是 `"a"`，长度为1，`next[2] = 1`
- `i=3`: `"abab"` 最长相等前后缀是 `"ab"`，长度为2，`next[3] = 2`
- `i=4`: `"ababa"` 最长相等前后缀是 `"aba"`，长度为3，`next[4] = 3`
- `i=5`: `"ababac"` 无相等前后缀，`next[5] = 0`
- `i=6`: `"ababaca"` 最长相等前后缀是 `"a"`，长度为1，`next[6] = 1`

#### 步骤2：模式匹配

使用构建好的next数组进行字符串匹配。

## 实现细节

### KMP算法的两个关键函数

1. **构建next数组**：
```go
func buildNext(str string) []int {
	length := len(str)
	next := make([]int, length)
	next[0] = 0

	for i, j := 1, 0; i < length; i++ {
		// 当前字符不匹配时，回退j
		for j > 0 && str[i] != str[j] {
			j = next[j-1]
		}
		// 字符匹配，j前进
		if str[i] == str[j] {
			j++
		}
		next[i] = j
	}

	return next
}
```

2. **执行匹配**：
```go
func strStr(haystack string, needle string) int {
	n, m := len(haystack), len(needle)
	next := buildNext(needle)

	for i, j := 0, 0; i < n; i++ {
		// 当前字符不匹配时，根据next数组跳转
		for j > 0 && haystack[i] != needle[j] {
			j = next[j-1]
		}
		// 字符匹配，j前进
		if haystack[i] == needle[j] {
			j++
		}
		// 完全匹配
		if j == m {
			return i - m + 1
		}
	}
	return -1
}
```

### 具体例子演示

让我们用 `haystack = "ababcababa"` 和 `needle = "ababa"` 来演示整个过程：

#### 1. 构建next数组

```
needle = "ababa"
索引：    0  1  2  3  4
next：   [0  0  1  2  3]
```

构建过程：
- `i=1, j=0`: `'b' != 'a'`，`next[1] = 0`
- `i=2, j=0`: `'a' == 'a'`，`j++`，`next[2] = 1`
- `i=3, j=1`: `'b' == 'b'`，`j++`，`next[3] = 2`
- `i=4, j=2`: `'a' == 'a'`，`j++`，`next[4] = 3`

#### 2. 执行匹配过程

```
haystack: a b a b c a b a b a
索引:     0 1 2 3 4 5 6 7 8 9
needle:   a b a b a
          ↑           (i=0, j=0)
```

**匹配步骤**：

1. `i=0, j=0`: `'a' == 'a'` ✓, `j++`
2. `i=1, j=1`: `'b' == 'b'` ✓, `j++`
3. `i=2, j=2`: `'a' == 'a'` ✓, `j++`
4. `i=3, j=3`: `'b' == 'b'` ✓, `j++`
5. `i=4, j=4`: `'c' != 'a'` ✗, **失配！**

**失配处理**：
- `j = next[j-1] = next[3] = 2`
- 跳转后继续比较 `haystack[4]` 和 `needle[2]`

```
haystack: a b a b c a b a b a
          a b a b a   (已匹配部分)
              a b a b a (跳转后的对齐)
                  ↑   (i=4, j=2)
```

6. `i=4, j=2`: `'c' != 'a'` ✗, 继续失配
7. `j = next[j-1] = next[1] = 0`
8. `i=4, j=0`: `'c' != 'a'` ✗, `j`保持为0
9. `i=5, j=0`: `'a' == 'a'` ✓, `j++`
10. 继续匹配... 最终在位置5找到完整匹配

## 代码实现

```go
func strStr(haystack string, needle string) int {
	// KMP算法实现
	n, m := len(haystack), len(needle)
	next := buildNext(needle)

	for i, j := 0, 0; i < n; i++ {
		// 当前字符不匹配时，根据next数组跳转
		for j > 0 && haystack[i] != needle[j] {
			j = next[j-1]
		}
		// 字符匹配，j前进
		if haystack[i] == needle[j] {
			j++
		}

		if j == m {
			return i - m + 1
		}
	}

	return -1
}

func buildNext(str string) []int {
	length := len(str)
	next := make([]int, length)
	next[0] = 0

	for i, j := 1, 0; i < length; i++ {
		// 当前字符不匹配时，回退j
		for j > 0 && str[i] != str[j] {
			j = next[j-1]
		}
		// 字符匹配，j前进
		if str[i] == str[j] {
			j++
		}
		next[i] = j
	}

	return next
}
```

### 代码解析

**主函数 `strStr`**：
- 获取两个字符串的长度 `n` 和 `m`
- 调用 `buildNext` 函数构建next数组
- 使用双指针 `i` 和 `j` 进行KMP匹配
- 当失配时，根据next数组进行智能跳转
- 当完全匹配时，返回起始位置 `i - m + 1`

**辅助函数 `buildNext`**：
- 创建长度为 `m` 的next数组，初始化 `next[0] = 0`
- 使用双指针 `i` 和 `j` 构建next数组
- 当字符不匹配时，根据已有的next值进行回退
- 当字符匹配时，更新next数组

### 算法优势

这个实现的优点：
1. **代码结构清晰**：将next数组构建抽取为独立函数，职责分离
2. **易于理解**：主函数专注于匹配逻辑，辅助函数专注于预处理
3. **可复用性强**：`buildNext` 函数可以在其他需要next数组的场景中复用
4. **空间效率高**：只使用必要的空间存储next数组

## 方法比较

| 方面       | 暴力匹配            | KMP算法                 |
| ---- | ---- | ----- |
| 时间复杂度 | O(n×m)              | O(n+m)                  |
| 空间复杂度 | O(1)                | O(m)                    |
| 预处理     | 无                  | 需要构建next数组        |
| 失配处理   | 回退到起始位置+1    | 智能跳转，避免重复比较  |
| 适用场景   | 短模式串            | 长模式串或重复匹配      |
| 推荐度     | ★★☆☆☆               | ★★★★★                   |

## 复杂度分析

**时间复杂度**：$O(n + m)$
- 构建next数组：$O(m)$
- 模式匹配：$O(n)$
- 虽然有嵌套循环，但每个字符最多被比较常数次

**空间复杂度**：$O(m)$
- next数组需要 $O(m)$ 空间

## KMP算法优化详解

### 1. next数组的本质

next数组记录的是**最长相等前后缀长度**，这样设计的目的是：
- 当失配时，我们知道前面已经匹配的部分中哪些可以复用
- 避免不必要的回退和重复比较

### 2. 失配跳转的数学原理

假设在位置 `i` 失配，此时已匹配长度为 `j`：
- 传统方法：回退到起始位置，时间复杂度退化为 $O(n \times m)$
- KMP方法：跳转到 `next[j-1]`，利用已匹配信息，时间复杂度保持 $O(n + m)$

## 关键收获

1. **KMP的核心思想**：利用已匹配的信息，避免无效的重复比较
2. **next数组是关键**：正确理解和构建next数组是掌握KMP的重点
3. **失配处理策略**：`j = next[j-1]` 而不是 `j = 0`，这是效率提升的关键
4. **时间复杂度保证**：虽然有嵌套循环，但每个位置最多被访问常数次
5. **实际应用价值**：KMP在文本编辑器、搜索引擎等场景中有重要应用

### 常见陷阱

- **边界条件**：空字符串的处理
- **索引计算**：返回值应该是 `i - m + 1` 而不是 `i`
- **next数组理解**：要明确是"长度"而不是"索引"
- **失配逻辑**：必须是 `j > 0` 时才能跳转

这道题不仅考查字符串处理能力，更重要的是对KMP算法思想的深入理解。掌握KMP算法对于解决复杂的字符串匹配问题具有重要意义。 