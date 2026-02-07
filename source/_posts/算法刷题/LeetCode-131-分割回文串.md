---
title: LeetCode 131 - 分割回文串（Palindrome Partitioning）
date: 2025-05-06 08:30:00
categories:
- 算法刷题
- LeetCode
- 动态规划
tags:
- 回溯
- 动态规划
- 深度优先搜索
- Medium
- LeetCode
- ❌错题集
- Hot100
description: 本文详细介绍了LeetCode 131分割回文串问题的两种解法：预处理DP+回溯和记忆化搜索+回溯，对比分析两种方法的优缺点并提供了时间复杂度和空间复杂度分析。
---
## 问题描述

给你一个字符串 `s`，请你将 `s` 分割成一些子串，使每个子串都是**回文串**。返回 `s` 所有可能的分割方案。

**回文串**是正着读和反着读都一样的字符串。

### 示例 1：

```
输入：s = "aab"
输出：[["a","a","b"],["aa","b"]]
```

### 示例 2：

```
输入：s = "a"
输出：[["a"]]
```

### 约束条件：
- 1 <= s.length <= 16
- s 仅由小写英文字母组成

## 解题思路

这道题的核心思路是使用**回溯算法**来枚举所有可能的分割方案，同时我们需要判断每个子串是否为回文串。为了高效判断子串是否为回文，我们可以使用两种优化方法：

1. **预处理法**：提前计算出所有子串是否为回文，使用动态规划自底向上填表
2. **记忆化搜索法**：使用自顶向下的记忆化搜索，按需计算子串是否为回文

两种方法都结合回溯算法来枚举所有可能的分割方案。下面分别详细介绍这两种解法。

## 方法一：动态规划预处理 + 回溯

### 实现细节

这个方法分为两个主要步骤：

1. **预处理回文判断**：使用动态规划预先计算出字符串 `s` 的所有子串是否为回文
   - 定义 `isPalindrome[i][j]` 表示 `s[i:j+1]` 是否为回文串
   - 单个字符一定是回文：`isPalindrome[i][i] = true`
   - 对于长度大于1的子串 `s[i:j+1]`，当且仅当 `s[i] == s[j]` 且 `s[i+1:j]` 为回文串时，该子串才是回文

2. **使用回溯生成所有分割方案**：
   - 从字符串起始位置开始，尝试不同的分割点
   - 当找到一个回文子串时，将其加入当前路径，然后继续处理剩余部分
   - 当处理到字符串末尾时，将当前路径加入结果集
   - 回溯时移除最后添加的子串，尝试其他可能的分割点

### 代码实现

```go
func partition(s string) [][]string {
    n := len(s)
    // isPalindrome[i][j] 表示 s[i:j+1] 是否为回文串
    isPalindrome := make([][]bool, n)
    for i := range isPalindrome {
        isPalindrome[i] = make([]bool, n)
        // 单个字符一定是回文
        isPalindrome[i][i] = true
    }
    
    // 预处理所有子串是否为回文
    // 从下往上、从左往右填充，确保计算 isPalindrome[i][j] 时，isPalindrome[i+1][j-1] 已经计算好
    for i := n - 1; i >= 0; i-- {
        for j := i + 1; j < n; j++ {
            // 当前子串是回文的条件：两端字符相同且中间部分是回文（或长度为2）
            isPalindrome[i][j] = (s[i] == s[j]) && (j - i <= 2 || isPalindrome[i+1][j-1])
        }
    }
    
    var result [][]string
    var path []string // 当前路径
    
    // DFS回溯搜索所有可能的分割方案
    var backtrack func(start int)
    backtrack = func(start int) {
        // 到达字符串末尾，找到一个有效方案
        if start == n {
            // 拷贝当前路径并加入结果集
            pathCopy := make([]string, len(path))
            copy(pathCopy, path)
            result = append(result, pathCopy)
            return
        }
        
        // 尝试从start开始的每个可能的回文子串
        for end := start; end < n; end++ {
            // 只有当前子串是回文时，才继续递归
            if isPalindrome[start][end] {
                // 将当前回文子串加入路径
                path = append(path, s[start:end+1])
                // 递归处理剩余子串
                backtrack(end + 1)
                // 回溯，移除最后加入的子串
                path = path[:len(path)-1]
            }
        }
    }
    
    backtrack(0)
    return result
}
```

## 方法二：记忆化搜索 + 回溯

### 实现细节

这个方法同样分为两个主要步骤，但使用自顶向下的记忆化搜索来判断回文：

1. **记忆化搜索判断回文**：
   - 使用 `memo[i][j]` 记录 `s[i:j+1]` 是否为回文的结果
   - 0 表示未计算，1 表示是回文，-1 表示不是回文
   - 自顶向下地判断子串是否为回文，并将结果缓存起来避免重复计算

2. **回溯生成所有分割方案**：
   - 回溯部分与方法一相同，只是回文判断使用记忆化搜索的方式

### 代码实现

```go
func partition(s string) [][]string {
    n := len(s)
    // memo[i][j] 表示 s[i:j+1] 是否为回文串的记忆化
    // 0:未计算 1:是回文 -1:不是回文
    memo := make([][]int8, n)
    for i := range memo {
        memo[i] = make([]int8, n)
    }
    
    // 判断子串 s[i:j+1] 是否为回文
    var isPalindrome func(i, j int) int8
    isPalindrome = func(i, j int) int8 {
        // 单个字符或空串是回文
        if i >= j {
            return 1
        }
        
        // 如果已经计算过，直接返回结果
        if memo[i][j] != 0 {
            return memo[i][j]
        }
        
        // 默认不是回文
        memo[i][j] = -1
        // 如果两端字符相同，且中间部分是回文，则整体是回文
        if s[i] == s[j] && isPalindrome(i+1, j-1) > 0 {
            memo[i][j] = 1
        }
        return memo[i][j]
    }
    
    var result [][]string
    var path []string
    
    // DFS回溯搜索所有可能的分割方案
    var backtrack func(start int)
    backtrack = func(start int) {
        // 到达字符串末尾，找到一个有效方案
        if start == n {
            // 拷贝当前路径并加入结果集
            pathCopy := make([]string, len(path))
            copy(pathCopy, path)
            result = append(result, pathCopy)
            return
        }
        
        // 尝试从start开始的每个可能的回文子串
        for end := start; end < n; end++ {
            // 只有当前子串是回文时，才继续递归
            if isPalindrome(start, end) > 0 {
                // 将当前回文子串加入路径
                path = append(path, s[start:end+1])
                // 递归处理剩余子串
                backtrack(end + 1)
                // 回溯，移除最后加入的子串
                path = path[:len(path)-1]
            }
        }
    }
    
    backtrack(0)
    return result
}
```

## 方法比较

| 方面 | 方法一：预处理DP+回溯 | 方法二：记忆化搜索+回溯 |
| ---- | ---- | ----- |
| 时间复杂度 | O(n²) + O(n·2^n) | O(n²) + O(n·2^n) |
| 空间复杂度 | O(n²) | O(n²) |
| 优点 | 预处理所有子串，判断回文更快 | 按需计算，可能不需要判断所有子串 |
| 缺点 | 需要预先计算所有子串 | 递归调用有额外开销 |
| 适用场景 | 字符串长度较短，需要判断大量子串 | 字符串长度较长，回文子串较少 |
| 推荐度 | ★★★★★ | ★★★★☆ |

## 复杂度分析

两种方法的时间复杂度和空间复杂度如下：

### 方法一：预处理DP+回溯
- **时间复杂度**：$O(n^2 + n \cdot 2^n)$
  - 预处理判断所有子串是否为回文需要 $O(n^2)$ 的时间
  - 回溯生成所有分割方案的时间复杂度为 $O(n \cdot 2^n)$，因为对于长度为 n 的字符串，共有 $2^{n-1}$ 种可能的分割方案，每种方案需要 $O(n)$ 的时间来构建结果
  
- **空间复杂度**：$O(n^2)$
  - 存储所有子串的回文性质需要 $O(n^2)$ 的空间
  - 递归调用栈深度和当前路径最多需要 $O(n)$ 的空间

### 方法二：记忆化搜索+回溯
- **时间复杂度**：$O(n^2 + n \cdot 2^n)$
  - 记忆化搜索最多需要判断 $O(n^2)$ 个子串
  - 回溯部分的时间复杂度与方法一相同，为 $O(n \cdot 2^n)$
  
- **空间复杂度**：$O(n^2)$
  - 存储记忆化搜索结果需要 $O(n^2)$ 的空间
  - 递归调用栈深度和当前路径最多需要 $O(n)$ 的空间

## 关键收获

1. **回文串判断的优化**：通过动态规划或记忆化搜索，我们可以高效判断子串是否为回文，避免重复计算。

2. **回溯算法的应用**：通过回溯算法，我们可以系统地枚举所有可能的分割方案，这是一个经典的组合问题。

3. **两种策略比较**：
   - 动态规划（自底向上）：预先计算所有结果，适用于需要大量查询的场景
   - 记忆化搜索（自顶向下）：按需计算，适用于只需计算部分结果的场景

4. **递归与迭代的选择**：
   - 在字符串长度较短（如本题限制为 16）的情况下，两种方法的性能差异不大
   - 对于更大规模的问题，预处理方法可能更有效，因为避免了递归调用的开销

5. **Go语言技巧**：
   - 使用闭包实现局部递归函数
   - 通过切片操作实现回溯过程中的路径管理
   - 深拷贝结果避免引用同一个切片

相关问题：
- LeetCode 132: 分割回文串 II
- LeetCode 647: 回文子串
- LeetCode 5: 最长回文子串 