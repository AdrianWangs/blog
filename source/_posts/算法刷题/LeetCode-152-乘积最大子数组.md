---
title: 'LeetCode 152 - 乘积最大子数组 (Maximum Product Subarray)'
date: 2025-05-17 00:00:00 # 请替换为实际时间
categories:
  - 算法刷题
  - LeetCode
  - Hot100
tags:
  - 动态规划
  - 数组
  - Medium
  - LeetCode
  - Hot100
description: 'LeetCode 152 乘积最大子数组的解题思路、代码实现和复杂度分析。这道题要求找到一个数组中乘积最大的非空连续子数组。'
---

## 问题描述

给你一个整数数组 `nums` ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），并返回该子数组所对应的乘积。

测试用例的答案是一个 32-位 整数。

**示例 1:**

```
输入: nums = [2,3,-2,4]
输出: 6
解释: 子数组 [2,3] 有最大乘积 6。
```

**示例 2:**

```
输入: nums = [-2,0,-1]
输出: 0
解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。
```

**约束条件:**

- `1 <= nums.length <= 2 * 10^4`
- `-10 <= nums[i] <= 10`
- `nums` 的任何前缀或后缀的乘积都保证是一个 32-位 整数。

## 解题思路

这道题可以使用动态规划来解决。我们需要维护两个变量：到当前位置为止的最大乘积和最小乘积。

为什么需要维护最小乘积呢？因为当遇到一个负数时，之前的最小乘积乘以这个负数可能会变成最大乘积，同样，之前的最大乘积乘以这个负数可能会变成最小乘积。

我们定义 `maxDp[i]` 为以 `nums[i]` 结尾的连续子数组的最大乘积，`minDp[i]` 为以 `nums[i]` 结尾的连续子数组的最小乘积。

状态转移方程如下：

- `maxDp[i] = max(nums[i], nums[i] * maxDp[i-1], nums[i] * minDp[i-1])`
- `minDp[i] = min(nums[i], nums[i] * maxDp[i-1], nums[i] * minDp[i-1])`

最终的结果是所有 `maxDp[i]` 中的最大值。

为了优化空间复杂度，我们可以注意到 `maxDp[i]` 和 `minDp[i]` 只依赖于 `maxDp[i-1]` 和 `minDp[i-1]`，因此我们可以使用滚动数组的思想，只用两个变量来存储前一个状态的最大和最小乘积。

## 实现细节

我们初始化 `maxProductSoFar` 和 `minProductSoFar` 为 `nums[0]`，同时初始化 `maxAns` 为 `nums[0]`。
然后从数组的第二个元素开始遍历：
对于每个元素 `nums[i]`：

1. 计算当前的 `currentMax = max(nums[i], nums[i] * prevMax, nums[i] * prevMin)`
2. 计算当前的 `currentMin = min(nums[i], nums[i] * prevMax, nums[i] * prevMin)`
3. 更新 `maxAns = max(maxAns, currentMax)`
4. 更新 `prevMax = currentMax`，`prevMin = currentMin`

## 代码实现

```go
package main

/*
 * @lc app=leetcode.cn id=152 lang=golang
 *
 * [152] 乘积最大子数组
 */

// @lc code=start
func maxProduct(nums []int) int {
	n := len(nums)
	if n == 0 {
		return 0
	}

	maxDp := nums[0] // 以当前元素结尾的最大乘积
	minDp := nums[0] // 以当前元素结尾的最小乘积
	maxAns := nums[0]

	for i := 1; i < n; i++ {
		// 当 nums[i] < 0 时，最大值和最小值会互换
		// 所以需要一个临时变量存储之前的 maxDp
		prevMaxDp := maxDp
		maxDp = maxx(nums[i], nums[i]*maxDp, nums[i]*minDp)
		minDp = minn(nums[i], nums[i]*prevMaxDp, nums[i]*minDp) // 注意这里用 prevMaxDp
		maxAns = max(maxAns, maxDp)
	}

	return maxAns
}

func maxx(a ...int) int {
	maxAns := a[0]
	for _, v := range a {
		if v > maxAns {
			maxAns = v
		}
	}
	return maxAns
}

func minn(a ...int) int {
	minAns := a[0]
	for _, v := range a {
		if v < minAns {
			minAns = v
		}
	}
	return minAns
}

// @lc code=end
```

## 方法比较

| 方面       | 方法一 (动态规划)           |
| ---------- | --------------------------- |
| 时间复杂度 | $O(n)$                      |
| 空间复杂度 | $O(1)$ (使用滚动变量优化后) |
| 优点       | 思路清晰，易于理解和实现    |
| 缺点       | 需要注意负数带来的影响      |
| 推荐度     | ★★★★★                       |

## 复杂度分析

- **时间复杂度**: $O(n)$，其中 $n$ 是数组 `nums` 的长度。我们只需要遍历数组一次。
- **空间复杂度**: $O(1)$。我们只使用了常数个变量来存储中间结果。

## 关键收获

- 动态规划问题中，状态的定义至关重要。
- 处理乘积问题时，需要特别注意负数的影响，负负得正可能使得一个很小的负数变成一个很大的正数。
- 维护最大值的同时，往往也需要维护最小值，以应对负数的情况。
- 空间复杂度可以通过滚动数组或只保留前一个状态的方式进行优化。
