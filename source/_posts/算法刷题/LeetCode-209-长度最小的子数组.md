---
title: "LeetCode 209 - 长度最小的子数组（Minimum Size Subarray Sum）"
date: 2025-06-01 13:13:01
categories:
  - 算法刷题
  - LeetCode
  - 数组与哈希
tags:
  - 数组
  - 双指针
  - 滑动窗口
  - 前缀和
  - Medium
  - 面试经典150
  - LeetCode
description: "深入分析前缀和双指针与滑动窗口两种解法，比较时空复杂度差异，提供优雅的代码实现与详细的算法思路分析"
---

## 问题描述

给定一个含有 n 个正整数的数组和一个正整数 target ，找出该数组中满足其和 ≥ target 的长度最小的 **连续子数组** `[numsl, numsl+1, ..., numsr-1, numsr]` ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

### 示例输入输出

**示例 1：**
```
输入：target = 7, nums = [2,3,1,2,4,3]
输出：2
解释：子数组 [4,3] 是该条件下的长度最小的子数组。
```

**示例 2：**
```
输入：target = 4, nums = [1,4,4]
输出：1
```

**示例 3：**
```
输入：target = 11, nums = [1,1,1,1,1,1,1,1]
输出：0
```

### 约束条件

- 1 ≤ target ≤ $10^9$
- 1 ≤ nums.length ≤ $10^5$
- 1 ≤ nums[i] ≤ $10^4$

## 解题思路

这道题的核心是找到**和大于等于目标值的最短连续子数组**。我们可以通过两种主要方法来解决：

### **方法一：前缀和 + 双指针**

**核心思想**：预先计算前缀和数组，然后使用双指针技术寻找满足条件的最短子数组。

通过前缀和，我们可以在 $O(1)$ 时间内计算任意区间 `[left, right)` 的和：
$$\text{sum}(left, right) = \text{prefix}[right] - \text{prefix}[left]$$

### **方法二：滑动窗口（更优解法）**

**核心思想**：使用双指针维护一个滑动窗口，动态调整窗口大小来寻找最短的满足条件的子数组。

这种方法避免了额外空间的使用，只需要维护当前窗口的和。

## 实现细节

### 方法一：前缀和双指针实现

```go
func minSubArrayLen(target int, nums []int) int {
    n := len(nums)
    
    // 构建前缀和数组：prefix[i] 表示 nums[0...i-1] 的和
    prefix := make([]int, n+1)
    for i := 0; i < n; i++ {
        prefix[i+1] = prefix[i] + nums[i]
    }
    
    minLength := math.MaxInt32
    left := 0
    
    // 使用双指针寻找最小长度的子数组
    for right := 1; right <= n; right++ {
        // 当前窗口 [left, right) 的和
        currentSum := prefix[right] - prefix[left]
        
        // 如果当前和满足条件，尝试收缩左边界
        for currentSum >= target {
            minLength = min(minLength, right-left)
            left++
            if left < right {
                currentSum = prefix[right] - prefix[left]
            }
        }
    }
    
    // 如果没有找到满足条件的子数组，返回 0
    if minLength == math.MaxInt32 {
        return 0
    }
    return minLength
}
```

### 方法二：滑动窗口实现（推荐）

```go
func minSubArrayLen(target int, nums []int) int {
    n := len(nums)
    left, right := 0, 0
    windowSum := 0
    minLength := math.MaxInt32
    
    // 使用滑动窗口技术
    for right < n {
        // 扩展右边界，增加窗口内的和
        windowSum += nums[right]
        
        // 当窗口内的和满足条件时，尝试收缩左边界
        for windowSum >= target {
            // 更新最小长度
            minLength = min(minLength, right-left+1)
            
            // 收缩左边界
            windowSum -= nums[left]
            left++
        }
        
        // 移动右边界
        right++
    }
    
    // 如果没有找到满足条件的子数组，返回 0
    if minLength == math.MaxInt32 {
        return 0
    }
    return minLength
}

// 辅助函数：获取两个整数的最小值
func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

## 方法比较

| 方面       | 前缀和双指针        | 滑动窗口           |
|----------|-----------------|------------------|
| 时间复杂度  | $O(n)$          | $O(n)$           |
| 空间复杂度  | $O(n)$          | $O(1)$           |
| 预处理     | 需要构建前缀和数组     | 无需预处理          |
| 代码复杂度  | 相对复杂          | 简洁直观           |
| 内存使用   | 需要额外 $O(n)$ 空间 | 只需常数空间         |
| 推荐度     | ★★★☆☆           | ★★★★★            |

## 复杂度分析

### 前缀和双指针方法

**时间复杂度**：$O(n)$
- 构建前缀和数组：$O(n)$
- 双指针遍历：$O(n)$（每个元素最多被访问两次）

**空间复杂度**：$O(n)$
- 前缀和数组需要 $O(n)$ 额外空间

### 滑动窗口方法

**时间复杂度**：$O(n)$
- 虽然有嵌套循环，但每个元素最多被 `left` 和 `right` 指针各访问一次

**空间复杂度**：$O(1)$
- 只使用了几个变量，不依赖于输入数组的大小

## 算法执行示例

以 `target = 7, nums = [2,3,1,2,4,3]` 为例，展示滑动窗口的执行过程：

```
初始状态：left = 0, right = 0, windowSum = 0, minLength = ∞

Step 1: right = 0, windowSum = 2
        [2] 3 1 2 4 3
         ↑
       left,right

Step 2: right = 1, windowSum = 5
        [2,3] 1 2 4 3
         ↑   ↑
       left right

Step 3: right = 2, windowSum = 6
        [2,3,1] 2 4 3
         ↑     ↑
       left   right

Step 4: right = 3, windowSum = 8 >= 7 ✓
        [2,3,1,2] 4 3
         ↑       ↑
       left     right
        更新 minLength = 4

Step 5: 收缩 left，windowSum = 6
        2 [3,1,2] 4 3
           ↑     ↑
         left   right

Step 6: right = 4, windowSum = 10 >= 7 ✓
        2 [3,1,2,4] 3
           ↑       ↑
         left     right
        更新 minLength = 4

Step 7: 收缩 left，windowSum = 7 >= 7 ✓
        2 3 [1,2,4] 3
             ↑     ↑
           left   right
        更新 minLength = 3

Step 8: 收缩 left，windowSum = 6
        2 3 1 [2,4] 3
               ↑   ↑
             left right

Step 9: right = 5, windowSum = 9 >= 7 ✓
        2 3 1 [2,4,3]
               ↑     ↑
             left   right
        更新 minLength = 3

Step 10: 收缩 left，windowSum = 7 >= 7 ✓
         2 3 1 2 [4,3]
                  ↑   ↑
                left right
         更新 minLength = 2

最终结果：minLength = 2
```

## 关键收获

1. **滑动窗口是处理连续子数组问题的经典技法**：通过动态调整窗口边界，可以高效地找到满足条件的子数组。

2. **空间换时间的权衡**：前缀和方法用额外空间换取了更直观的实现，但滑动窗口在不增加空间复杂度的情况下同样高效。

3. **双指针的移动策略**：
   - 当窗口和小于目标值时，扩展右边界增加和
   - 当窗口和大于等于目标值时，收缩左边界寻找更短的解

4. **常见陷阱**：
   - 注意边界条件的处理（空数组、无解情况）
   - 确保指针移动的正确性，避免越界
   - 初始化 `minLength` 为一个足够大的值

5. **相关应用**：此类滑动窗口技法可以应用于其他类似问题，如最长无重复字符子串、最小覆盖子串等。 