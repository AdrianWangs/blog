---
title: "LeetCode 76 - 最小覆盖子串（Minimum Window Substring）"
date: 2025-06-03 15:59:55
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 滑动窗口
  - 双指针
  - 哈希表
  - Hard
  - 面试经典150
  - LeetCode
description: "深入分析最小覆盖子串问题的滑动窗口解法，通过错误分析帮助理解双指针技巧的正确使用方式"
---

## 问题描述

给你一个字符串 `s` 、一个字符串 `t` 。返回 `s` 中涵盖 `t` 所有字符的最小子串。如果 `s` 中不存在涵盖 `t` 所有字符的子串，则返回空字符串 `""` 。

**注意：**
- 对于 `t` 中重复字符，我们寻找的子字符串中该字符数量必须不少于 `t` 中该字符数量。
- 如果 `s` 中存在这样的子串，我们保证它是唯一的答案。

### 示例

**示例 1：**
```
输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"
解释：最小覆盖子串 "BANC" 包含来自字符串 t 的 'A'、'B' 和 'C'。
```

**示例 2：**
```
输入：s = "a", t = "a"
输出："a"
解释：整个字符串 s 是最小覆盖子串。
```

**示例 3：**
```
输入：s = "a", t = "aa"
输出：""
解释：t 中两个字符 'a' 均应包含在 s 的子串中，
因此没有符合条件的子串，返回空字符串。
```

### 约束条件
- `m == s.length`
- `n == t.length`
- `1 <= m, n <= 10^5`
- `s` 和 `t` 由英文字母组成

## 错误分析

在初始实现中，存在几个关键的逻辑错误，让我们先看看**错误的代码**：

```go
// 错误版本的关键部分
for right < len(s) {
    rightAlpha := s[right]
    right++
    windowMap[rightAlpha]++
    if windowMap[rightAlpha] <= alphaCnt[rightAlpha] {
        alphaNumCnt++
    }
    
    // ❌ 错误的收缩逻辑
    for windowMap[rightAlpha] > alphaCnt[rightAlpha] {
        leftAlpha := s[left]
        if windowMap[leftAlpha] <= alphaCnt[leftAlpha] {
            alphaNumCnt--
        }
        windowMap[leftAlpha]--
        left++
    }
    
    // ❌ 错误的有效窗口检查位置
    if alphaNumCnt == len(t) {
        if right-left < minLength {
            minLength = right - left
            minStart = left
        }
    }
}
```

### 主要错误点

1. **错误的收缩时机**：原代码在刚添加字符后立即尝试收缩窗口，这会导致过早地移除必要的字符
2. **错误的收缩条件**：`windowMap[rightAlpha] > alphaCnt[rightAlpha]` 只考虑刚添加的字符，而不是整个窗口状态
3. **错误的有效性检查**：在收缩后检查窗口有效性，此时窗口可能已经被破坏

### 为什么会出错？

让我们通过示例 `s = "ADOBECODEBANC"`, `t = "ABC"` 来分析：

```
当处理到第一个 'A' 时：
- 右指针：0 → 1，窗口：'A'
- alphaNumCnt = 1
- windowMap['A'] = 1, alphaCnt['A'] = 1
- 条件 windowMap['A'] > alphaCnt['A'] 为 false，不收缩 ✓

当处理到 'D', 'O', 'B' 时：
- 右指针：1 → 4，窗口：'ADOB'
- alphaNumCnt = 2 (A, B)
- 这里都是正常的 ✓

当处理到 'E' 时：
- 右指针：4 → 5，窗口：'ADOBE'
- 'E' 不在 t 中，alphaCnt['E'] = 0
- ❌ 原逻辑：windowMap['E'] > alphaCnt['E'] 为 true (1 > 0)
- ❌ 开始收缩，可能移除 'A' 或 'B'，破坏窗口有效性
```

## 解题思路

这是一个典型的**滑动窗口**问题。核心思路是：
1. **扩张窗口**：不断向右移动右指针，直到窗口包含 `t` 的所有字符
2. **收缩窗口**：当窗口有效时，尝试向右移动左指针来最小化窗口
3. **记录答案**：在收缩过程中更新最小窗口

### 算法流程

```
初始化：left = 0, right = 0
记录 t 中每个字符的需求数量
记录当前窗口中每个字符的数量
记录已满足的字符数量

while right < len(s):
    1. 将 s[right] 加入窗口
    2. 如果加入的字符有助于满足 t 的需求，更新满足计数
    3. 当窗口包含 t 的所有字符时：
       a. 尝试更新最小窗口记录
       b. 收缩窗口（移除 s[left]）
       c. 如果移除的字符破坏了窗口有效性，停止收缩
    4. right++
```

### 关键洞察

- **何时收缩**：只有当窗口**已经有效**时才收缩
- **如何判断有效**：当 `alphaNumCnt == len(t)` 时窗口有效
- **收缩策略**：贪心地收缩，直到窗口不再有效

## 实现细节

```go
func minWindow(s string, t string) string {
    // 1. 统计 t 中每个字符的需求数量
    alphaCnt := make([]int, 256)
    for _, c := range t {
        alphaCnt[c]++
    }

    // 2. 初始化变量
    minLength := len(s) + 1  // 设为不可能的值，便于判断是否找到答案
    minStart := 0
    left, right := 0, 0
    windowMap := make([]int, 256)  // 窗口中每个字符的数量
    alphaNumCnt := 0  // 已满足的 t 中字符的数量

    // 3. 滑动窗口主循环
    for right < len(s) {
        // 扩张窗口：加入 s[right]
        rightAlpha := s[right]
        right++
        windowMap[rightAlpha]++
        
        // 如果新加入的字符有助于满足 t 的需求
        if windowMap[rightAlpha] <= alphaCnt[rightAlpha] {
            alphaNumCnt++
        }

        // 当窗口有效时，尝试收缩
        for alphaNumCnt == len(t) {
            // 更新最小窗口记录
            if right-left < minLength {
                minLength = right - left
                minStart = left
            }

            // 收缩窗口：移除 s[left]
            leftAlpha := s[left]
            if windowMap[leftAlpha] <= alphaCnt[leftAlpha] {
                alphaNumCnt--  // 移除关键字符，窗口将变为无效
            }
            windowMap[leftAlpha]--
            left++
        }
    }

    // 4. 返回结果
    if minLength > len(s) {
        return ""  // 没有找到有效窗口
    }
    return s[minStart : minStart+minLength]
}
```

### 代码解析

1. **字符计数**：使用数组 `alphaCnt` 记录 `t` 中每个字符的需求数量
2. **窗口状态**：`windowMap` 记录当前窗口中每个字符的数量
3. **有效性判断**：`alphaNumCnt` 记录已满足需求的字符总数
4. **边界处理**：`minLength` 初始化为 `len(s) + 1`，便于判断是否找到解

### 执行过程示例

以 `s = "ADOBECODEBANC"`, `t = "ABC"` 为例：

```
step 1: right=1, window="A", alphaNumCnt=1, 窗口无效
step 2: right=2, window="AD", alphaNumCnt=1, 窗口无效  
step 3: right=3, window="ADO", alphaNumCnt=1, 窗口无效
step 4: right=4, window="ADOB", alphaNumCnt=2, 窗口无效
step 5: right=5, window="ADOBE", alphaNumCnt=2, 窗口无效
step 6: right=6, window="ADOBEC", alphaNumCnt=3, 窗口有效！
        开始收缩：left=0→1→2→3，窗口="DOBEC"→"OBEC"→"BEC"→"EC"
        当 left=3 时，移除 'B'，alphaNumCnt=2，窗口无效，停止收缩
        记录答案：minLength=6, minStart=0
...继续处理后续字符...
step 13: right=13, window="BANC", alphaNumCnt=3, 窗口有效！
         收缩后得到更短的窗口 "BANC"，更新答案
```

## 复杂度分析

### 时间复杂度：$O(|s| + |t|)$

- 右指针 `right` 遍历字符串 `s` 一次：$O(|s|)$
- 左指针 `left` 最多也遍历字符串 `s` 一次：$O(|s|)$
- 统计字符串 `t`：$O(|t|)$
- 总计：$O(|s| + |t|)$

### 空间复杂度：$O(1)$

- 使用固定大小的数组 `alphaCnt` 和 `windowMap`：$O(256) = O(1)$
- 其他变量都是常数空间

## 关键收获

1. **滑动窗口的标准模板**：
   - 扩张窗口收集元素
   - 当窗口满足条件时收缩窗口
   - 在收缩过程中更新答案

2. **常见陷阱**：
   - ❌ 不要在窗口无效时尝试收缩
   - ❌ 不要过早地移除窗口中的字符
   - ❌ 注意处理字符不在目标字符串中的情况

3. **优化技巧**：
   - 使用数组代替哈希表提高效率
   - 合理设置边界值便于判断

4. **相关问题**：
   - LeetCode 3: 无重复字符的最长子串
   - LeetCode 438: 找到字符串中所有字母异位词
   - LeetCode 567: 字符串的排列

这道题是滑动窗口技巧的经典应用，掌握了这个模板后，很多类似的字符串/数组问题都能迎刃而解！ 