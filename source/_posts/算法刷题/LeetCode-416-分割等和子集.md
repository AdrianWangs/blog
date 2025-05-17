---
title: 'LeetCode 416 - 分割等和子集 (Partition Equal Subset Sum)'
date: 2025-05-17 21:40:00 # Placeholder, will be updated by a subsequent call if necessary
categories:
  - 算法刷题
  - LeetCode
  - Hot100
tags:
  - 动态规划
  - 背包问题
  - Medium
  - LeetCode
  - Hot100
description: 'LeetCode 416 分割等和子集问题详解，使用动态规划（0/1背包问题）解决。判断一个数组是否可以分割成两个元素和相等的子集。'
---

## 问题描述

给定一个**只包含正整数**的非空数组 `nums`。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

**示例 1：**

```
输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1, 5, 5] 和 [11] 。
```

**示例 2：**

```
输入：nums = [1,2,3,5]
输出：false
解释：数组不能分割成两个元素和相等的子集。
```

**约束条件：**

- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 100`

## 解题思路

这个问题可以转化为一个经典的组合优化问题：**0/1 背包问题**。

首先，计算整个数组的总和 `sum`。如果 `sum` 是奇数，那么不可能将数组分割成两个元素和相等的子集，因为两个子集的和必须都是 `sum / 2`，而 `sum / 2` 必须是整数。因此，如果 `sum` 为奇数，直接返回 `false`。

如果 `sum` 是偶数，设目标和 `target = sum / 2`。问题就转化为：能否从数组 `nums` 中选取若干个元素，使得这些元素的和恰好等于 `target`？

这就可以看作是一个 0/1 背包问题：

- **背包的容量 (W)**：`target`
- **物品的重量 (weight[i])**：数组中的每个元素 `nums[i]`
- **物品的价值 (value[i])**：同样是数组中的每个元素 `nums[i]` (因为我们关心的是和，所以重量和价值是相同的)
- **问题**：能否恰好装满容量为 `target` 的背包？

我们定义一个动态规划数组 `dp`，其中 `dp[j]` 表示是否存在一种选取方式，使得选取的元素之和等于 `j`。`dp[j]` 是一个布尔值，`true` 表示存在，`false` 表示不存在。

**状态定义：**
`dp[j]`：表示从数组 `nums` 中选取元素，是否存在一个子集的和恰好为 `j`。

**状态转移方程：**
对于数组中的每个元素 `num` (即 `nums[i]`)，我们需要更新 `dp` 数组。
遍历 `dp` 数组时，为了确保每个元素只被使用一次（0/1 背包的特性），我们需要从后往前遍历 `j` (从 `target` 到 `num`)。

对于当前的元素 `num` 和当前的和 `j`：

- 如果不选取 `num`，那么 `dp[j]` 的值保持不变，即 `dp[j]`。
- 如果选取 `num` (前提是 `j >= num`)，那么我们需要看 `dp[j - num]` 是否为 `true`。如果 `dp[j - num]` 为 `true`，表示在不包含当前 `num` 的情况下，已经可以凑成 `j - num`，那么加上 `num` 之后就可以凑成 `j`。

所以，状态转移方程为：
`dp[j] = dp[j] || dp[j - num]` (当 `j >= num` 时)

**初始化：**
`dp[0] = true`，因为不选取任何元素时，和为 0，这是肯定可以达成的。
其余 `dp[j]` (j > 0) 初始化为 `false`。

**遍历顺序：**

1. 外层循环遍历数组 `nums` 中的每个元素 `num`。
2. 内层循环遍历背包容量 `j`，从 `target` 向下到 `num` (确保每个物品只用一次)。

**最终结果：**
遍历完所有元素后，`dp[target]` 的值就是最终答案。如果 `dp[target]` 为 `true`，则可以分割成两个和相等的子集；否则，不可以。

## 推导过程

假设 `nums = [1, 5, 11, 5]`

1. 计算总和 `sum = 1 + 5 + 11 + 5 = 22`。
2. `sum` 是偶数，`target = sum / 2 = 11`。
3. 初始化 `dp` 数组，长度为 `target + 1 = 12`。
   `dp = [true, false, false, false, false, false, false, false, false, false, false, false]`
   (`dp[0] = true`)

**遍历 `nums`:**

**1. `num = 1`:**
内层循环 `j` 从 `11` 到 `1`：

- `j = 11`: `dp[11] = dp[11] || dp[11-1] = false || dp[10] = false`
- `j = 10`: `dp[10] = dp[10] || dp[10-1] = false || dp[9] = false`
- ...
- `j = 1`: `dp[1] = dp[1] || dp[1-1] = false || dp[0] = false || true = true`
  `dp` 变为: `[true, true, false, false, false, false, false, false, false, false, false, false]`

**2. `num = 5`:**
内层循环 `j` 从 `11` 到 `5`：

- `j = 11`: `dp[11] = dp[11] || dp[11-5] = false || dp[6]` (此时 `dp[6]` 还是 `false`) `= false`
- `j = 10`: `dp[10] = dp[10] || dp[10-5] = false || dp[5]` (此时 `dp[5]` 还是 `false`) `= false`
- ...
- `j = 6`: `dp[6] = dp[6] || dp[6-5] = false || dp[1] = false || true = true`
- `j = 5`: `dp[5] = dp[5] || dp[5-5] = false || dp[0] = false || true = true`
  `dp` 变为: `[true, true, false, false, false, true, true, false, false, false, false, false]` (dp[1], dp[5], dp[6] 为 true)

**3. `num = 11`:**
内层循环 `j` 从 `11` 到 `11`：

- `j = 11`: `dp[11] = dp[11] || dp[11-11] = false || dp[0] = false || true = true`
  `dp` 变为: `[true, true, false, false, false, true, true, false, false, false, false, true]` (dp[1], dp[5], dp[6], dp[11] 为 true)

**4. `num = 5` (第二个 5):**
内层循环 `j` 从 `11` 到 `5`：

- `j = 11`: `dp[11]` 已经是 `true`。`dp[11] = dp[11] || dp[11-5] = true || dp[6] = true || true = true`
- `j = 10`: `dp[10] = dp[10] || dp[10-5] = false || dp[5] = false || true = true`
- `j = 9`: `dp[9] = dp[9] || dp[9-5] = false || dp[4]` (此时 `dp[4]` 为 `false`) `= false`
- `j = 8`: `dp[8] = dp[8] || dp[8-5] = false || dp[3]` (此时 `dp[3]` 为 `false`) `= false`
- `j = 7`: `dp[7] = dp[7] || dp[7-5] = false || dp[2]` (此时 `dp[2]` 为 `false`) `= false`
- `j = 6`: `dp[6]` 已经是 `true`。`dp[6] = dp[6] || dp[6-5] = true || dp[1] = true || true = true`
- `j = 5`: `dp[5]` 已经是 `true`。`dp[5] = dp[5] || dp[5-5] = true || dp[0] = true || true = true`

After this iteration, `dp` might look like:
`dp[0]=true` (initial)
`dp[1]=true` (from num=1)
`dp[5]=true` (from first num=5)
`dp[6]=true` (from first num=5 + num=1)
`dp[10]=true` (from second num=5 + first num=5)
`dp[11]=true` (from num=11 or from second num=5 + dp[6])

最终 `dp[11]` 为 `true`。所以返回 `true`。

## 代码实现

```go
// filepath: /Users/adrianwang/.leetcode/416.分割等和子集.go
package main

/*
 * @lc app=leetcode.cn id=416 lang=golang
 *
 * [416] 分割等和子集
 */

// @lc code=start
func canPartition(nums []int) bool {
	total := 0

	for _, num := range nums {
		total += num
	}
	// 如果总和是奇数，则不可能分割成两个和相等的子集
	if total%2 == 1 {
		return false
	}

	half := total / 2
	// dp[i] 表示是否存在和为 i 的子集
	dp := make([]bool, half+1)

	// 和为0的子集总是存在的（即空集）
	dp[0] = true

	// 0/1 背包问题
	// 外层循环遍历物品（数组中的数字）
	for _, num := range nums {
		// 内层循环遍历背包容量（目标和），必须从大到小，保证每个物品只用一次
		for j := half; j >= num; j-- {
			// 对于当前数字 num，如果 dp[j-num] 为 true（即存在和为 j-num 的子集）
			// 那么加上 num 之后，就存在和为 j 的子集
			// 或者，如果 dp[j] 本身已经是 true（不包含当前 num 时已经可以凑成 j），则保持 true
			dp[j] = dp[j] || dp[j-num]
		}
	}

	return dp[half]
}

// @lc code=end

```

## 复杂度分析

- **时间复杂度**: O(n \* target)，其中 `n` 是数组 `nums` 的长度，`target` 是数组总和的一半。我们需要遍历每个数字，并对每个数字更新 `dp` 数组中最多 `target` 个状态。
- **空间复杂度**: O(target)，`dp` 数组的大小为 `target + 1`。

## 关键收获

- 识别问题是否可以转化为背包问题是解决这类动态规划问题的关键。
- 0/1 背包问题的核心在于每个物品只能选择一次，这通常通过内层循环逆序遍历容量来实现。
- 动态规划的状态定义和状态转移方程是解题的核心。
