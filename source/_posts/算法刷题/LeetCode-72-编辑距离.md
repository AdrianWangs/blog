---
title: 'LeetCode 72 - 编辑距离 (Edit Distance)'
date: 2025-05-21 17:21:40
categories:
  - 算法刷题
  - LeetCode
	- Hot100
tags:
  - 动态规划
  - 字符串
  - Medium
  - LeetCode
description: '详解 LeetCode 72 题编辑距离的动态规划解法，包括状态定义、状态转移方程和代码实现。'
---

## 问题描述

给定两个单词 `word1` 和 `word2`，计算将 `word1` 转换成 `word2` 所使用的最少操作数。

你可以对一个单词进行如下三种操作：

1.  插入一个字符
2.  删除一个字符
3.  替换一个字符

**示例 1：**

```
输入：word1 = "horse", word2 = "ros"
输出：3
解释：
horse -> rorse (将 'h' 替换为 'r')
rorse -> rose (删除 'r')
rose -> ros (删除 'e')
```

**示例 2：**

```
输入：word1 = "intention", word2 = "execution"
输出：5
解释：
intention -> inention (删除 't')
inention -> enention (将 'i' 替换为 'e')
enention -> exention (将 'n' 替换为 'x')
exention -> exection (将 'n' 替换为 'c')
exection -> execution (插入 'u')
```

**约束条件：**

- `0 <= word1.length, word2.length <= 500`
- `word1` 和 `word2` 由小写英文字母组成

## 解题思路

这道题是经典的动态规划问题。我们可以定义 `dp[i][j]` 表示将 `word1` 的前 `i` 个字符转换成 `word2` 的前 `j` 个字符所需要的最少操作数。

### 状态定义

`dp[i][j]`：`word1` 的子串 `word1[0...i-1]` (长度为 `i`) 转换成 `word2` 的子串 `word2[0...j-1]` (长度为 `j`) 所需的最小操作数。

### 初始化

1.  `dp[0][0] = 0`：空字符串转换为空字符串，操作数为 0。
2.  `dp[i][0] = i` (当 `j=0` 时)：`word1` 的前 `i` 个字符转换为空字符串，需要 `i` 次删除操作。
    例如，将 "abc" 转换为空字符串，需要删除 'a', 'b', 'c'，共 3 次操作。
3.  `dp[0][j] = j` (当 `i=0` 时)：空字符串转换成 `word2` 的前 `j` 个字符，需要 `j` 次插入操作。
    例如，将空字符串转换成 "xyz"，需要插入 'x', 'y', 'z'，共 3 次操作。

### 状态转移方程

考虑 `dp[i][j]` 的计算，即如何将 `word1[0...i-1]` 转换成 `word2[0...j-1]`。我们可以从以下三种情况进行转移：

1.  **替换操作 (Modify)**:
    如果 `word1[i-1] == word2[j-1]`，说明 `word1` 的第 `i` 个字符与 `word2` 的第 `j` 个字符相同。这种情况下，我们不需要对这两个字符进行任何操作，问题就转化为将 `word1[0...i-2]` 转换成 `word2[0...j-2]` 的最小操作数。
    所以，`dp[i][j] = dp[i-1][j-1]`。

    如果 `word1[i-1] != word2[j-1]`，说明 `word1` 的第 `i` 个字符与 `word2` 的第 `j` 个字符不同。我们可以将 `word1[i-1]` 替换为 `word2[j-1]`，这样这两个字符就匹配了。此时，操作数加 1，问题转化为将 `word1[0...i-2]` 转换成 `word2[0...j-2]` 的最小操作数。
    所以，`dp[i][j] = dp[i-1][j-1] + 1`。

2.  **删除操作 (Delete)**:
    我们可以删除 `word1[i-1]` 这个字符，然后问题就转化为将 `word1[0...i-2]` (长度为 `i-1`) 转换成 `word2[0...j-1]` (长度为 `j`) 的最小操作数。
    所以，`dp[i][j] = dp[i-1][j] + 1`。

3.  **插入操作 (Insert)**:
    我们可以在 `word1[0...i-1]` 的末尾插入一个字符 `word2[j-1]`，使得 `word1` 的新子串与 `word2[0...j-1]` 的末尾字符匹配。然后问题就转化为将 `word1[0...i-1]` (长度为 `i`) 转换成 `word2[0...j-2]` (长度为 `j-1`) 的最小操作数。
    所以，`dp[i][j] = dp[i][j-1] + 1`。

综合以上三种情况，当 `word1[i-1] != word2[j-1]` 时，`dp[i][j]` 应该取这三种操作中操作数最小的一个：
`dp[i][j] = min(dp[i-1][j-1] + 1, dp[i-1][j] + 1, dp[i][j-1] + 1)`

我们可以将替换操作的两种情况合并。
如果 `word1[i-1] == word2[j-1]`，则 `cost = 0`，否则 `cost = 1`。
那么，`dp[i][j]` 的状态转移方程可以统一为：
`dp[i][j] = min(dp[i-1][j-1] + cost, dp[i-1][j] + 1, dp[i][j-1] + 1)`

更简洁的写法是：

- 如果 `word1[i-1] == word2[j-1]`：
  `dp[i][j] = dp[i-1][j-1]` (此时不需要操作，等价于从 `dp[i-1][j-1]` 转移过来，操作数为 0)
- 如果 `word1[i-1] != word2[j-1]`：
  `dp[i][j] = min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1`
  这里 `dp[i-1][j-1]` 对应替换操作，`dp[i-1][j]` 对应删除 `word1[i-1]`，`dp[i][j-1]` 对应在 `word1` 末尾插入 `word2[j-1]`。

最终结果是 `dp[n][m]`，其中 `n` 是 `word1` 的长度，`m` 是 `word2` 的长度。

## 代码实现

```go
// filepath: /Users/adrianwang/.leetcode/72.编辑距离.go
package main

import "math"

/*
 * @lc app=leetcode.cn id=72 lang=golang
 *
 * [72] 编辑距离
 */

// @lc code=start
func minDistance(word1 string, word2 string) int {
	n, m := len(word1), len(word2)

	// dp[i][j] 表示 word1 的前 i 个字符转换成 word2 的前 j 个字符所需的最少操作数
	dp := make([][]int, n+1)
	for i := range dp {
		dp[i] = make([]int, m+1)
	}

	// 初始化：理论上可以将所有 dp[i][j] 初始化为 math.MaxInt32
	// 但由于递推关系，这里的初始化可以更精简

	// 初始化第一行和第一列
	// dp[i][0]：word1 的前 i 个字符转换为空字符串，需要 i 次删除
	for i := 0; i <= n; i++ {
		dp[i][0] = i
	}
	// dp[0][j]：空字符串转换成 word2 的前 j 个字符，需要 j 次插入
	for j := 0; j <= m; j++ {
		dp[0][j] = j
	}

	// 状态转移
	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			if word1[i-1] == word2[j-1] {
				// 如果 word1[i-1] == word2[j-1]，则当前字符匹配，不需要操作
				// 操作数等于 dp[i-1][j-1]
				dp[i][j] = dp[i-1][j-1]
			} else {
				// 如果 word1[i-1] != word2[j-1]，则需要进行操作
				// dp[i-1][j-1] + 1: 替换 word1[i-1] 为 word2[j-1]
				// dp[i-1][j] + 1:   删除 word1[i-1]
				// dp[i][j-1] + 1:   在 word1 末尾插入 word2[j-1]
				dp[i][j] = Min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1
			}
		}
	}

	return dp[n][m]
}

// Min 返回一组整数中的最小值
func Min(nums ...int) int {
	if len(nums) == 0 {
		// 或者返回一个错误，或者根据业务场景返回一个特定的值
		return math.MaxInt32 // 示例：如果没有数字，则返回最大整数
	}
	minVal := nums[0]
	for _, num := range nums {
		if num < minVal {
			minVal = num
		}
	}
	return minVal
}

// @lc code=end
```

### 复杂度分析

- **时间复杂度**: O(n*m)，其中 n 是 `word1` 的长度，m 是 `word2` 的长度。因为我们需要填充一个 n*m 大小的 DP 表。
- **空间复杂度**: O(n\*m)，用于存储 DP 表。

## 关键收获

- **动态规划状态定义**：清晰地定义 `dp[i][j]` 的含义是解决问题的关键。
- **边界条件处理**：正确初始化 `dp` 表的第一行和第一列。
- **状态转移逻辑**：理解三种基本操作（插入、删除、替换）如何影响状态转移。
- **字符索引与 DP 索引**：注意字符串索引 `word1[i-1]` 对应的是 `dp` 表中的第 `i` 个元素。

这个题目是字符串动态规划中的一个基础且重要的问题，掌握其解法对于理解更复杂的字符串 DP 问题非常有帮助。
