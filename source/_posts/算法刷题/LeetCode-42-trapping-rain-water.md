---
title: LeetCode 42 - 接雨水（Trapping Rain Water）
date: 2025-04-18 17:56:00
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 数组
- 双指针
- 单调栈
- 动态规划
- Hard
- Hot100
---
## 问题描述

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

**示例 1：**

```
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。
```

**示例 2：**

```
输入：height = [4,2,0,3,2,5]
输出：9
```

示意图：

```
       #
#      #
#  #   #
#  #   #
####  ##
```

**约束条件：**

- n == height.length
- 1 <= n <= 2 \* 10^4
- 0 <= height[i] <= 10^5

## 解题思路

接雨水问题的核心在于理解：**对于每个位置，它能接的雨水量等于该位置左右两侧最高柱子的较小值减去该位置的高度**。

这个问题有多种解法，我们将介绍三种主要方法：动态规划、双指针和单调栈。

### 方法一：动态规划

**核心思想**：预处理每个位置的左侧最大高度和右侧最大高度，然后计算每个位置能接的雨水量。

#### 步骤详解：

1. 创建两个数组 `leftMax` 和 `rightMax`，分别存储每个位置的左侧最大高度和右侧最大高度
2. 从左到右遍历数组，计算每个位置的左侧最大高度
3. 从右到左遍历数组，计算每个位置的右侧最大高度
4. 再次遍历数组，对于每个位置 i，计算 min(leftMax[i], rightMax[i]) - height[i]，累加得到总雨水量

这种方法直观易懂，适合初学者理解问题。

### 方法二：双指针法

**核心思想**：使用左右两个指针从两端向中间移动，同时记录左右两侧遇到的最大高度，优化空间复杂度。

#### 步骤详解：

1. 初始化左指针 `left = 0` 和右指针 `right = n-1`
2. 记录左侧和右侧的最大高度 `leftMax = 0` 和 `rightMax = 0`
3. 当左指针小于右指针时，执行以下操作：
   - 如果 height[left] < height[right]：
     - 如果 height[left] >= leftMax，更新 leftMax
     - 否则，累加 leftMax - height[left] 到结果中
     - 左指针向右移动
   - 否则：
     - 如果 height[right] >= rightMax，更新 rightMax
     - 否则，累加 rightMax - height[right] 到结果中
     - 右指针向左移动

这种方法优化了空间复杂度，只需要常数额外空间。

### 方法三：单调栈

**核心思想**：使用单调递减栈来找到"凹"形区域，计算能接的雨水量。

#### 步骤详解：

1. 维护一个单调递减栈，栈中存储柱子的下标
2. 遍历数组，对于每个柱子：
   - 当栈不为空且当前柱子高度大于栈顶柱子高度时：
     - 弹出栈顶元素 top（作为凹槽的底部）
     - 如果栈为空，无法形成凹槽，继续
     - 计算宽度：当前下标 - 新栈顶下标 - 1
     - 计算高度：min(当前柱子高度, 新栈顶柱子高度) - 底部高度
     - 累加 宽度 × 高度 到结果中
   - 将当前下标入栈

单调栈方法适合理解雨水积累的过程，特别是对于理解"凹"形区域的积水计算。

## 代码实现

### 方法一：动态规划

```go
func trap(height []int) int {
    n := len(height)
    if n <= 2 {
        return 0
    }

    // 预处理左右最大高度
    leftMax := make([]int, n)
    rightMax := make([]int, n)

    // 计算每个位置的左侧最大高度
    leftMax[0] = height[0]
    for i := 1; i < n; i++ {
        leftMax[i] = max(leftMax[i-1], height[i])
    }

    // 计算每个位置的右侧最大高度
    rightMax[n-1] = height[n-1]
    for i := n-2; i >= 0; i-- {
        rightMax[i] = max(rightMax[i+1], height[i])
    }

    // 计算总雨水量
    result := 0
    for i := 0; i < n; i++ {
        result += min(leftMax[i], rightMax[i]) - height[i]
    }

    return result
}

func max(a, b int) int {
    if a > b {
        return a
    }
    return b
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```

### 方法二：双指针法

```go
func trap(height []int) int {
    left, right := 0, len(height)-1
    leftMax, rightMax := 0, 0
    result := 0

    for left < right {
        if height[left] < height[right] {
            if height[left] >= leftMax {
                leftMax = height[left]
            } else {
                result += leftMax - height[left]
            }
            left++
        } else {
            if height[right] >= rightMax {
                rightMax = height[right]
            } else {
                result += rightMax - height[right]
            }
            right--
        }
    }

    return result
}
```

### 方法三：单调栈

```go
func trap(height []int) int {
    n := len(height)
    if n <= 2 {
        return 0
    }

    res := 0
    stack := make([]int, 0)

    for i := 0; i < n; i++ {
        // 当栈不为空且当前高度大于栈顶高度时，可以形成凹槽
        for len(stack) > 0 && height[i] > height[stack[len(stack)-1]] {
            // 弹出栈顶，作为凹槽底部
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]

            // 如果栈为空，无法形成凹槽
            if len(stack) <= 0 {
                break
            }

            // 计算凹槽的宽度和高度
            left := stack[len(stack)-1]
            width := i - left - 1
            h := min(height[i], height[left]) - height[top]
            res += width * h
        }

        // 当前索引入栈
        stack = append(stack, i)
    }

    return res
}
```

## 执行过程分析

以示例 [0,1,0,2,1,0,1,3,2,1,2,1] 分析双指针法的执行过程：

**初始状态**：

- left = 0, right = 11
- leftMax = 0, rightMax = 0
- result = 0

**执行过程**：

1. height[0] = 0 < height[11] = 1

   - leftMax = max(0, 0) = 0
   - result += 0 - 0 = 0
   - left = 1
2. height[1] = 1 = height[11] = 1 (相等，任选一边)

   - leftMax = max(0, 1) = 1
   - left = 2
3. height[2] = 0 < height[11] = 1

   - result += 1 - 0 = 1
   - left = 3
4. height[3] = 2 > height[11] = 1

   - rightMax = max(0, 1) = 1
   - result += 1 - 1 = 0
   - right = 10
5. height[3] = 2 = height[10] = 2

   - rightMax = max(1, 2) = 2
   - right = 9

... (继续执行直到 left >= right)

**最终结果**：result = 6

## 方法比较

| 方面       | 动态规划         | 双指针法               | 单调栈               |
| ---------- | ---------------- | ---------------------- | -------------------- |
| 时间复杂度 | O(n)             | O(n)                   | O(n)                 |
| 空间复杂度 | O(n)             | O(1)                   | O(n)                 |
| 易理解性   | 最直观，容易理解 | 抽象，需要理解左右边界 | 适合理解凹槽积水过程 |
| 实现复杂度 | 简单             | 中等                   | 较复杂               |
| 优点       | 思路清晰         | 空间效率最高           | 能处理多种地形       |
| 缺点       | 需要额外空间     | 思路不够直观           | 实现复杂             |
| 推荐度     | ★★★★☆       | ★★★★★             | ★★★☆☆           |

## 复杂度分析

- **时间复杂度**：

  - 动态规划：O(n)，需要三次遍历数组
  - 双指针：O(n)，只需一次遍历
  - 单调栈：O(n)，每个元素最多入栈出栈各一次
- **空间复杂度**：

  - 动态规划：O(n)，需要两个额外数组
  - 双指针：O(1)，只使用常数额外空间
  - 单调栈：O(n)，最坏情况下栈的大小为 n

## 核心要点

1. **理解积水条件**：对于位置 i，能接的水量取决于 min(左侧最高，右侧最高) - 当前高度
2. **优化思路**：从空间 O(n) 到 O(1) 的优化是本题的一个亮点
3. **双指针技巧**：利用双指针避免使用额外空间，是解决此类问题的重要技巧

## 相关题目

- LeetCode 11: 盛最多水的容器
- LeetCode 407: 接雨水 II（三维版本）
- LeetCode 238: 除自身以外数组的乘积（类似的预处理思想）

## 总结

接雨水问题展示了多种算法思想：动态规划的预处理、双指针的空间优化、单调栈处理特定形状。通过分析每个位置能接的雨水量，我们可以得到整体的结果。在实际应用中，双指针法因其 O(1) 的空间复杂度而被认为是最优解，但动态规划法更易于理解和实现。
