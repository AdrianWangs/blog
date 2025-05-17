---
title: ❌ LeetCode 322 - 零钱兑换
date: 2025-05-16 15:30:00
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 动态规划
- Medium
- LeetCode
- ❌错题集
- 背包问题
- Hot100
description: 零钱兑换是一个经典的完全背包问题，本文分析了错误的解题思路以及两种正确的动态规划实现方式，包括自底向上的迭代法和自顶向下的记忆化搜索
---
## 问题描述

给你一个整数数组 `coins` ，表示不同面额的硬币；以及一个整数 `amount` ，表示总金额。

计算并返回可以凑成总金额所需的 **最少的硬币个数** 。如果没有任何一种硬币组合能组成总金额，返回 `-1` 。

你可以认为每种硬币的数量是无限的。

**示例 1：**

```
输入：coins = [1, 2, 5], amount = 11
输出：3
解释：11 = 5 + 5 + 1
```

**示例 2：**

```
输入：coins = [2], amount = 3
输出：-1
```

**示例 3：**

```
输入：coins = [1], amount = 0
输出：0
```

**约束条件：**

- 1 <= coins.length <= 12
- 1 <= coins[i] <= 2^31 - 1
- 0 <= amount <= 10^4

## 错误解法与分析

我的初始解法是尝试使用动态规划，但实现方式有误：

```go
func coinChange(coins []int, amount int) int {
	dp := make([]int, amount+1)

	for i := 0; i <= amount; i++ {
		dp[i] = math.MaxInt32
	}
	dp[0] = 0
	for _, coin := range coins {
		for j := 0; j <= amount; j++ {
			for k := 0; k*coin <= j; k++ {
				dp[j] = min(dp[j], dp[j-k*coin]+1) // ❌ 错误点：这里应该是 +k
			}
		}
	}

	if dp[amount] == math.MaxInt32 {
		return -1
	}
	return dp[amount]
}
```

### 错误原因分析

这个解法存在几个问题：

1. **状态转移方程错误**：在使用 k 个当前面值的硬币时，应该是 `dp[j-k*coin]+k`，而不是 `dp[j-k*coin]+1`。这是因为我们使用了 k 个硬币，所以应该加上 k。

2. **不必要的三重循环**：即使修正了状态转移方程，这种实现方式也有严重的效率问题。三重循环导致时间复杂度高达 O(amount^2 \* n)，其中 n 是硬币数量。最内层循环（枚举使用硬币的个数）是不必要的。

3. **理解完全背包问题的本质**：这是一个典型的完全背包问题，每种物品（硬币）可以重复选择，目标是使用最少的物品达到特定容量（金额）。对于完全背包问题，有更高效的解法。

## 正确解法一：标准动态规划（自底向上）

```go
func coinChange(coins []int, amount int) int {
	dp := make([]int, amount+1) // dp[i] 表示凑成金额i所需的最少硬币数

	// 初始化dp数组
	for i := 1; i <= amount; i++ {
		dp[i] = math.MaxInt32 // 初始化为一个很大的数
	}
	dp[0] = 0 // 凑成金额0需要0个硬币

	// 对于每种硬币
	for _, coin := range coins {
		// 从coin面值开始遍历，确保可以使用当前硬币
		for j := coin; j <= amount; j++ {
			// 状态转移：不使用当前硬币 vs 使用当前硬币
			dp[j] = min(dp[j], dp[j-coin]+1)
		}
	}

	// 如果dp[amount]仍然是初始值，说明无法凑成amount
	if dp[amount] == math.MaxInt32 {
		return -1
	}
	return dp[amount]
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
```

### 解法一分析

这是完全背包问题的标准解法，时间复杂度为 O(amount \* n)，其中 n 是硬币数量。

**状态定义**：

- `dp[i]` 表示凑成金额 i 所需的最少硬币数

**状态转移方程**：

- `dp[i] = min(dp[i], dp[i-coin]+1)`，其中 i ≥ coin

**解题步骤**：

1. 初始化 dp 数组，除了 dp[0] = 0 外，其他位置设为一个很大的数（表示暂时无法达到）
2. 对每种硬币，遍历从该面值到 amount 的所有金额
3. 对于金额 j，考虑使用当前硬币后的最少硬币数：当前状态 dp[j] 与 dp[j-coin]+1 取较小值
4. 最后，如果 dp[amount] 仍为初始大值，返回 -1；否则返回 dp[amount]

## 正确解法二：记忆化搜索（自顶向下）

```go
func coinChange(coins []int, amount int) int {
	// 创建记忆化数组，初始值为 -1，表示状态尚未计算
	memo := make([]int, amount+1)
	for i := range memo {
		memo[i] = -1
	}
	memo[0] = 0 // 金额为0时需要0个硬币

	// 自顶向下的递归函数
	var dp func(int) int
	dp = func(remaining int) int {
		// 剩余金额为负，无法凑成
		if remaining < 0 {
			return -1
		}

		// 已经计算过的状态，直接返回
		if memo[remaining] != -1 {
			return memo[remaining]
		}

		minCoins := math.MaxInt32

		// 尝试使用每种硬币
		for _, coin := range coins {
			// 递归计算使用当前硬币后所需的最少硬币数
			subProblem := dp(remaining - coin)

			// 如果子问题有解，并且比当前最小值更小，更新最小值
			if subProblem >= 0 && subProblem < minCoins {
				minCoins = subProblem + 1
			}
		}

		// 如果没有找到有效解，设置为-1
		if minCoins == math.MaxInt32 {
			memo[remaining] = -1
		} else {
			memo[remaining] = minCoins
		}

		return memo[remaining]
	}

	return dp(amount)
}
```

### 解法二分析

这种方法使用记忆化搜索（自顶向下的动态规划）来解决问题，时间复杂度同样为 O(amount \* n)。

**递归函数定义**：

- `dp(remaining)` 返回凑成金额 remaining 所需的最少硬币数

**递归转移关系**：

- `dp(remaining) = min(dp(remaining - coin) + 1) for coin in coins`，前提是 remaining ≥ coin

**解题步骤**：

1. 创建记忆化数组，初始值为 -1，表示状态尚未计算
2. 定义递归函数，对于每个金额，尝试使用每种硬币
3. 对于每种硬币，计算使用后剩余金额所需的最少硬币数
4. 取所有可能中的最小值
5. 使用记忆化数组避免重复计算

## 两种方法的比较与思考

### 方法对比表

| 对比维度   | 解法一：自底向上 DP    | 解法二：自顶向下记忆化搜索 |
| ---------- | ---------------------- | -------------------------- |
| 实现方式   | 迭代                   | 递归                       |
| 思考顺序   | 从小问题构建大问题     | 从大问题分解为小问题       |
| 时间复杂度 | O(amount \* n)         | O(amount \* n)             |
| 空间复杂度 | O(amount)              | O(amount) + 递归栈空间     |
| 实际效率   | 通常更快（无递归开销） | 可能稍慢（有递归调用开销） |
| 代码简洁度 | 较为简洁               | 较为直观，符合思考过程     |
| 适用场景   | 状态转移清晰的问题     | 递归思路更容易理解的问题   |
| 易理解性   | 对初学者可能较难理解   | 更符合直觉的思考方式       |
| 调试难度   | 相对容易追踪状态       | 递归调用栈可能较难追踪     |

### 详细比较

1. **自底向上 vs 自顶向下**：

   - 自底向上的方法（解法一）从小问题开始解决，逐步构建大问题的解
   - 自顶向下的方法（解法二）从大问题开始，分解成小问题，并使用记忆化避免重复计算
   - 两种方法的时间复杂度相同，但实际运行效率可能因具体问题而异

2. **空间复杂度**：

   - 两种方法的空间复杂度均为 O(amount)，用于存储 dp 数组或记忆化数组
   - 自顶向下方法有额外的递归调用栈开销，最坏情况为 O(amount)

3. **错误原因深入思考**：
   - 我的错误代码试图通过三重循环来枚举所有可能性，但这种方法效率低下且更容易出错
   - 标准的完全背包问题解法通过巧妙的动态规划转移关系，避免了显式枚举的需要
   - 在动态规划中，状态转移方程的正确设计是关键，需要深入理解问题的本质

## 学习总结

通过这个错题，我学到了：

1. 对于完全背包问题，标准的解法是两层循环，外层遍历物品，内层正序遍历金额
2. 动态规划问题中，状态定义和转移方程的正确性至关重要
3. 优化算法时，不仅要考虑正确性，还要考虑时间和空间复杂度
4. 记忆化搜索是解决动态规划问题的另一种思路，有时更直观
5. 在解决问题时，理解问题本质比死记硬背算法模板更重要

这个题目是动态规划中的经典问题，理解了它的解法，可以帮助解决许多类似的完全背包问题。
