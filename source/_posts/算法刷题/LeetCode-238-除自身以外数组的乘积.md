---
title: "LeetCode 238 - 除自身以外数组的乘积（Product of Array Except Self）"
date: 2025-05-25 20:35:22
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 数组
  - 前缀和
  - Medium
  - 面试经典150
  - LeetCode
description: "无需使用除法运算计算数组中除自身以外所有元素的乘积，介绍暴力解法、前缀后缀乘积、空间优化等多种方法，详细分析时空复杂度差异。"
---

## 问题描述

给你一个整数数组 `nums`，返回数组 `answer` ，其中 `answer[i]` 等于 `nums` 中除 `nums[i]` 之外其余各元素的乘积。

题目数据 **保证** 数组 `nums` 之中任意元素的全部前缀元素和后缀元素的乘积都在 32 位整数范围内。

请 **不要使用除法**，且在 `O(n)` 时间复杂度内完成此题。

### 示例

**示例 1：**
```
输入: nums = [1,2,3,4]
输出: [24,12,8,6]
```

**示例 2：**
```
输入: nums = [-1,1,0,-3,3]
输出: [0,0,9,0,0]
```

### 约束条件

- `2 ≤ nums.length ≤ 10⁵`
- `-30 ≤ nums[i] ≤ 30`
- **保证** 数组 `nums` 之中任意元素的全部前缀元素和后缀元素的乘积都在 32 位整数范围内

## 解题思路

对于位置 `i` 的结果，我们需要计算所有除了 `nums[i]` 以外的元素乘积。可以将这个乘积分解为两部分：

**核心思想**：对于位置 `i`，结果等于 **左侧所有元素的乘积** × **右侧所有元素的乘积**

```
数组: [1, 2, 3, 4]
位置:  0  1  2  3

对于位置 i=1 (值为2):
左侧乘积: nums[0] = 1
右侧乘积: nums[2] × nums[3] = 3 × 4 = 12
结果: 1 × 12 = 12
```

根据这个思路，我们可以有多种实现方法。

## 方法一：暴力解法

### 实现思路

对于每个位置 `i`，遍历整个数组计算除了 `nums[i]` 以外所有元素的乘积。

### 代码实现

```go
func productExceptSelfBruteForce(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    
    for i := 0; i < n; i++ {
        product := 1
        // 计算除nums[i]以外所有元素的乘积
        for j := 0; j < n; j++ {
            if i != j {
                product *= nums[j]
            }
        }
        result[i] = product
    }
    
    return result
}
```

### 复杂度分析
- **时间复杂度**：$O(n^2)$ - 对于每个位置都要遍历整个数组
- **空间复杂度**：$O(1)$ - 除了结果数组外，只使用常量额外空间

## 方法二：前缀和后缀乘积数组

### 实现思路

1. **左乘积数组**：`left[i]` 表示 `nums[i]` 左侧所有元素的乘积
2. **右乘积数组**：`right[i]` 表示 `nums[i]` 右侧所有元素的乘积
3. **结果**：`result[i] = left[i] × right[i]`

### 详细步骤

以 `nums = [1, 2, 3, 4]` 为例：

```
原数组:     [1, 2, 3, 4]
左乘积:     [1, 1, 2, 6]    // left[i] = nums[0] * ... * nums[i-1]
右乘积:     [24, 12, 4, 1]  // right[i] = nums[i+1] * ... * nums[n-1]
结果:       [24, 12, 8, 6]  // result[i] = left[i] * right[i]
```

### 代码实现

```go
func productExceptSelfTwoArrays(nums []int) []int {
    n := len(nums)
    left := make([]int, n)
    right := make([]int, n)
    result := make([]int, n)
    
    // 构建左乘积数组
    left[0] = 1
    for i := 1; i < n; i++ {
        left[i] = left[i-1] * nums[i-1]
    }
    
    // 构建右乘积数组
    right[n-1] = 1
    for i := n - 2; i >= 0; i-- {
        right[i] = right[i+1] * nums[i+1]
    }
    
    // 计算结果
    for i := 0; i < n; i++ {
        result[i] = left[i] * right[i]
    }
    
    return result
}
```

### 复杂度分析
- **时间复杂度**：$O(n)$ - 三次遍历数组
- **空间复杂度**：$O(n)$ - 需要额外的 left 和 right 数组

## 方法三：空间优化解法（推荐）

### 实现思路

优化方法二，使用结果数组来存储左乘积，然后用一个变量来维护右乘积，从右向左更新结果。

### 详细步骤

1. **第一遍**：结果数组存储每个位置的左乘积
2. **第二遍**：从右往左遍历，用变量 `right` 维护右乘积，同时更新结果

### 执行过程演示

以 `nums = [1, 2, 3, 4]` 为例：

```
初始化: nums = [1, 2, 3, 4], result = [0, 0, 0, 0]

第一遍 - 计算左乘积:
i=0: result[0] = 1              → result = [1, 0, 0, 0]
i=1: result[1] = result[0] * nums[0] = 1 * 1 = 1   → result = [1, 1, 0, 0]
i=2: result[2] = result[1] * nums[1] = 1 * 2 = 2   → result = [1, 1, 2, 0]
i=3: result[3] = result[2] * nums[2] = 2 * 3 = 6   → result = [1, 1, 2, 6]

第二遍 - 计算最终结果:
right = 1
i=3: result[3] *= right = 6 * 1 = 6, right *= nums[3] = 1 * 4 = 4   → result = [1, 1, 2, 6]
i=2: result[2] *= right = 2 * 4 = 8, right *= nums[2] = 4 * 3 = 12  → result = [1, 1, 8, 6]
i=1: result[1] *= right = 1 * 12 = 12, right *= nums[1] = 12 * 2 = 24 → result = [1, 12, 8, 6]
i=0: result[0] *= right = 1 * 24 = 24, right *= nums[0] = 24 * 1 = 24 → result = [24, 12, 8, 6]
```

### 代码实现

```go
func productExceptSelf(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    
    // 第一遍：计算左乘积
    result[0] = 1
    for i := 1; i < n; i++ {
        result[i] = result[i-1] * nums[i-1]
    }
    
    // 第二遍：从右往左计算右乘积并更新结果
    right := 1
    for i := n - 1; i >= 0; i-- {
        result[i] *= right
        right *= nums[i]
    }
    
    return result
}
```

### 复杂度分析
- **时间复杂度**：$O(n)$ - 两次遍历数组
- **空间复杂度**：$O(1)$ - 除了结果数组外，只使用常量额外空间

## 方法四：处理零值的特殊解法

### 实现思路

考虑到数组中可能包含零值，我们可以：
1. 统计零的个数
2. 计算所有非零元素的乘积
3. 根据零的个数决定结果

### 代码实现

```go
func productExceptSelfWithZeros(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    
    zeroCount := 0
    product := 1
    
    // 统计零的个数和计算非零元素乘积
    for _, num := range nums {
        if num == 0 {
            zeroCount++
        } else {
            product *= num
        }
    }
    
    for i := 0; i < n; i++ {
        if zeroCount > 1 {
            // 有多个零，所有位置结果都是0
            result[i] = 0
        } else if zeroCount == 1 {
            // 只有一个零
            if nums[i] == 0 {
                result[i] = product
            } else {
                result[i] = 0
            }
        } else {
            // 没有零，使用除法
            result[i] = product / nums[i]
        }
    }
    
    return result
}
```

**注意**：这个方法违反了题目"不要使用除法"的要求，仅作为思路扩展。

## 方法比较

| 方面         | 方法一：暴力   | 方法二：两数组  | 方法三：空间优化 | 方法四：特殊处理 |
|-------------|---------------|----------------|-----------------|-----------------|
| **时间复杂度** | $O(n^2)$      | $O(n)$         | $O(n)$          | $O(n)$          |
| **空间复杂度** | $O(1)$        | $O(n)$         | $O(1)$          | $O(1)$          |
| **可读性**     | ★★★★☆         | ★★★★★          | ★★★★☆           | ★★★☆☆           |
| **效率**       | ★☆☆☆☆         | ★★★★☆          | ★★★★★           | ★★★★☆           |
| **推荐度**     | ★☆☆☆☆         | ★★★☆☆          | ★★★★★           | ★★☆☆☆           |
| **适用场景**   | 学习理解       | 面试演示思路    | 最优解法         | 违反题目要求     |

## 关键收获

### 核心算法概念

1. **前缀积和后缀积**：将复杂问题分解为左右两部分的乘积
2. **空间优化**：通过重复利用数组空间来减少额外内存使用
3. **双指针思想**：一次从左到右，一次从右到左的遍历模式

### 常见陷阱

1. **边界处理**：注意数组首尾元素的特殊处理
2. **初始值设置**：乘积运算的初始值应该是 1，不是 0
3. **理解题意**：题目要求不使用除法，要避免 `product / nums[i]` 的思路

### 相关问题

- LeetCode 152: 乘积最大子数组
- LeetCode 628: 三个数的最大乘积
- LeetCode 724: 寻找数组的中心索引

这道题是一个经典的前缀积应用，掌握了这个思路对解决类似的数组乘积问题都很有帮助。 