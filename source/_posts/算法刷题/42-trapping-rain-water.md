---
title: LeetCode 第 42 题：接雨水 (Trapping Rain Water)
date: 2024-4-18T17:56:00
categories:
  - 算法刷题
  - LeetCode
tags:
  - LeetCode
  - 数组
  - 双指针
  - 单调栈
  - 动态规划
---

# LeetCode 第 42 题：接雨水 (Trapping Rain Water)

## 题目描述

给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

## 解法一：单调栈

```go
func trap(height []int) int {
    n := len(height)
    if n <= 2 {
        return 0
    }

    res := 0
    stack := make([]int, 0)

    for i := 0; i < n; i++ {
        for len(stack) > 0 && height[i] > height[stack[len(stack)-1]] {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]

            if len(stack) <= 0 {
                break
            }

            left := stack[len(stack)-1]
            width := i - left - 1
            h := min(height[i], height[left]) - height[top]
            res += width * h
        }

        stack = append(stack, i)
    }

    return res
}
```

**思路解析**：

- 维护一个单调递减栈，栈中存储的是柱子的下标
- 当我们遇到一个比栈顶元素高的柱子时，就可以计算积水量
- 计算过程：弹出栈顶元素作为坑的底部，新的栈顶和当前柱子作为坑的左右边界
- 水量 = 宽度 × 高度，宽度是右边界与左边界之间的距离减 1，高度是两边界的较小值减去底部高度

**时间复杂度**：O(n)，每个元素最多入栈出栈各一次
**空间复杂度**：O(n)，栈的大小

## 解法二：双指针法

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

**思路解析**：

- 使用左右两个指针从两端向中间移动
- 记录左右两侧遇到的最大高度 leftMax 和 rightMax
- 关键思想：如果 height[left] < height[right]，那么左侧的水量只取决于 leftMax
- 同理，如果 height[left] >= height[right]，那么右侧的水量只取决于 rightMax
- 每次移动较小的那一侧的指针，并更新对应的最大高度和积水量

**时间复杂度**：O(n)，只需遍历一次数组
**空间复杂度**：O(1)，只使用常数额外空间

## 解法三：动态规划

```go
func trap(height []int) int {
    n := len(height)
    if n <= 2 {
        return 0
    }

    leftMax := make([]int, n)
    rightMax := make([]int, n)

    leftMax[0] = height[0]
    for i := 1; i < n; i++ {
        leftMax[i] = max(leftMax[i-1], height[i])
    }

    rightMax[n-1] = height[n-1]
    for i := n-2; i >= 0; i-- {
        rightMax[i] = max(rightMax[i+1], height[i])
    }

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

**思路解析**：

- 预处理得到每个位置左边的最大高度 leftMax 和右边的最大高度 rightMax
- 对于位置 i，能接的雨水量为 min(leftMax[i], rightMax[i]) - height[i]
- 遍历每个位置，累加雨水量

**时间复杂度**：O(n)，需要三次遍历数组
**空间复杂度**：O(n)，需要两个额外数组

## 解法比较

1. **单调栈**：实现相对复杂，但思路清晰，适合理解雨水形成的过程
2. **双指针**：最优解，时间复杂度 O(n)，空间复杂度 O(1)
3. **动态规划**：思路最直观，容易理解，但需要额外空间

对于这个问题，如果追求空间效率，双指针法是最佳选择；如果追求代码简洁和理解，动态规划方法更合适；如果想理解"坑"的形成过程，单调栈方法更有启发性。
