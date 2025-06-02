---
title: "LeetCode 30 - 串联所有单词的子串（Substring with Concatenation of All Words）"
date: 2025-06-02 22:19:56
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 滑动窗口
  - 哈希表
  - 字符串
  - Hard
  - 面试经典150
  - LeetCode
description: "深入分析LeetCode 30题的滑动窗口优化解法，对比暴力解法和滑动窗口的时间复杂度差异，解答为什么滑动窗口能显著提升性能"
---

## 问题描述

给你一个字符串 `s` 和一个字符串数组 `words`。`words` 中所有字符串**长度相同**。

`s` 中的**串联子串**是指一个包含 `words` 中所有字符串以任意顺序排列连接起来的子串。

返回所有串联子串在 `s` 中的开始索引。你可以以**任意顺序**返回答案。

**示例 1：**
```
输入：s = "barfoothefoobar", words = ["foo","bar"]
输出：[0,9]
解释：
从索引 0 和 9 开始的子串分别是 "barfoo" 和 "foobar" 。
输出的顺序不重要, [9,0] 也是有效答案。
```

**示例 2：**
```
输入：s = "wordgoodgoodgoodword", words = ["word","good","best"]
输出：[]
```

**示例 3：**
```
输入：s = "barfoobar", words = ["foo","bar"]
输出：[0,3]
```

**约束条件：**
- `1 <= s.length <= 10^4`
- `1 <= words.length <= 5000`
- `1 <= words[i].length <= 30`
- `words[i]` 和 `s` 由小写英文字母组成

## 解题思路

这道题的核心挑战在于**高效地找到所有可能的串联子串**。关键洞察是：**所有单词长度相同**，这为我们提供了优化的机会。

### 朴素解法分析

最直观的想法是：
1. 遍历字符串 `s` 的每个可能起始位置
2. 从该位置开始，按单词长度切分，检查是否恰好包含所有 `words`
3. 使用哈希表统计单词频次

**朴素解法的问题：**
- 时间复杂度：**O(n × m × k)**，其中 n 是字符串长度，m 是单词个数，k 是单词长度
- 大量重复计算和重复创建哈希表

### 滑动窗口优化思路

**核心洞察**：由于每个单词长度都是固定的 `wordLen`，我们可以将问题分解为 `wordLen` 个独立的子问题：

```
示例：s = "barfoothefoobar", words = ["foo", "bar"], wordLen = 3

子问题1: 起始位置 0, 3, 6, 9, 12... → bar|foo|the|foo|bar
子问题2: 起始位置 1, 4, 7, 10, 13... → arf|oot|hef|oob|ar
子问题3: 起始位置 2, 5, 8, 11, 14... → rfo|oth|efo|oba|r
```

对于每个子问题，我们使用**滑动窗口**：
1. 维护一个固定大小的窗口（包含 `len(words)` 个单词）
2. 当窗口右移时，移除左边的单词，添加右边的单词
3. 检查当前窗口是否匹配所有 `words`

## 实现细节

### 滑动窗口的三种情况

1. **遇到有效单词且不超过限制**：正常扩展窗口
2. **遇到有效单词但超过限制**：收缩左边界直到满足限制
3. **遇到无效单词**：重置整个窗口

### 关键数据结构

- `wordMap`：记录目标单词的频次
- `currentMap`：记录当前窗口中单词的频次  
- `count`：当前窗口中有效单词的总数

## 代码实现

### 优化后的滑动窗口解法

```go
func findSubstring(s string, words []string) []int {
    if len(s) == 0 || len(words) == 0 {
        return []int{}
    }
    
    wordLen := len(words[0])
    wordCount := len(words)
    totalLen := wordLen * wordCount
    result := []int{}
    
    if len(s) < totalLen {
        return result
    }
    
    // 构建单词频次map
    wordMap := make(map[string]int)
    for _, word := range words {
        wordMap[word]++
    }
    
    // 对于每个可能的起始余数位置 (0 到 wordLen-1)
    for i := 0; i < wordLen; i++ {
        left := i
        right := i
        currentMap := make(map[string]int)
        count := 0 // 当前窗口中匹配的单词数
        
        for right+wordLen <= len(s) {
            // 右边界扩展，取出新单词
            rightWord := s[right : right+wordLen]
            right += wordLen
            
            if _, exists := wordMap[rightWord]; exists {
                currentMap[rightWord]++
                count++
                
                // 如果某个单词出现次数超过需要的次数，缩小左边界
                for currentMap[rightWord] > wordMap[rightWord] {
                    leftWord := s[left : left+wordLen]
                    left += wordLen
                    currentMap[leftWord]--
                    count--
                }
                
                // 检查是否找到完整匹配
                if count == wordCount {
                    result = append(result, left)
                }
            } else {
                // 遇到不在words中的单词，重置窗口
                currentMap = make(map[string]int)
                count = 0
                left = right
            }
        }
    }
    
    return result
}
```

### 朴素解法（对比）

```go
func findSubstringNaive(s string, words []string) []int {
    wordLen := len(words[0])
    wordMap := make(map[string]int)
    totalLength := len(words) * wordLen
    result := []int{}
    
    for _, word := range words {
        wordMap[word]++
    }
    
    for i := 0; i <= len(s)-totalLength; i++ {
        wordCnt := make(map[string]int) // 每次都重新创建
        
        for j := i; j < i+totalLength; j += wordLen {
            word := s[j : j+wordLen]
            wordCnt[word]++
            if wordCnt[word] > wordMap[word] {
                break
            }
            if j == i+totalLength-wordLen {
                result = append(result, i)
            }
        }
    }
    
    return result
}
```

## 方法比较

| 方面       | 朴素解法                | 滑动窗口解法               |
| -------- | -------------------- | --------------------- |
| 时间复杂度    | O(n × m × k)         | O(n × k)              |
| 空间复杂度    | O(m)                 | O(m)                  |
| 核心思想     | 暴力枚举每个起始位置         | 按余数分组 + 滑动窗口         |
| 重复计算     | 大量重复计算             | 充分利用之前的计算结果         |
| Map创建    | 每个起始位置都重新创建        | 每个子问题只创建一次          |
| 性能表现     | 只能超过 25% 的提交       | 能超过 80%+ 的提交         |
| 推荐度      | ★★☆☆☆                | ★★★★★                 |

## 复杂度分析

### 时间复杂度详解

**朴素解法：O(n × m × k)**
```
外层循环：O(n) - 遍历所有可能的起始位置
内层循环：O(m × k) - 检查每个起始位置的 m 个单词
总体：O(n × m × k)
```

**滑动窗口：O(n × k)**
```
外层循环：O(k) - 按 wordLen 分组
内层循环：O(n) - 每个字符最多被访问常数次
总体：O(n × k)
```

**关键差异分析：**

滑动窗口之所以更快，不仅仅是因为避免了重复创建 Map，更重要的是**算法复杂度的根本性改进**：

1. **减少了一个维度**：从 O(n × m × k) 降到 O(n × k)
2. **避免重复计算**：每个字符最多被处理常数次
3. **充分利用单词等长特性**：按余数分组，避免无效枝剪

### 空间复杂度

两种解法的空间复杂度都是 **O(m)**，主要用于存储：
- 目标单词的频次映射
- 当前窗口的单词统计

## 关键收获

### 算法优化策略

1. **利用问题特性**：单词等长这个约束条件是优化的关键
2. **滑动窗口思想**：当问题涉及连续子序列时，考虑滑动窗口
3. **分治思想**：将复杂问题分解为简单子问题

### 常见陷阱

1. **边界条件处理**：确保循环边界正确，避免数组越界
2. **Map 初始化**：注意在适当时机重置 Map 状态
3. **复杂度分析**：不要仅看表面，要分析算法的本质差异

### 性能优化要点

回答文章开头的问题：**时间复杂度确实不同！**

虽然重复创建 Map 确实有性能开销，但更根本的差异在于：
- 朴素解法：**O(n × m × k)** - 每个位置都要重新检查所有单词
- 滑动窗口：**O(n × k)** - 利用窗口滑动，避免重复计算

滑动窗口通过**减少一个时间复杂度维度**实现了质的飞跃，这就是为什么性能提升如此显著的根本原因。

### 相关问题

- [LeetCode 3: 无重复字符的最长子串](mdc:hexo-blog/2023/06/15/LeetCode-3-Longest-Substring-Without-Repeating-Characters)
- [LeetCode 76: 最小覆盖子串](mdc:hexo-blog/2023/06/20/LeetCode-76-Minimum-Window-Substring)
- [LeetCode 438: 找到字符串中所有字母异位词](mdc:hexo-blog/2023/06/25/LeetCode-438-Find-All-Anagrams-in-a-String) 