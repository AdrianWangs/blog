---
title: 'LeetCode 739 - 每日温度 (Daily Temperatures)'
date: 2025-05-12 21:26:58
categories:
  - 算法刷题
  - LeetCode
tags:
  - 栈
  - 单调栈
  - Medium
  - LeetCode
description: '详细解析 LeetCode 739 题「每日温度」的解题思路，使用单调栈巧妙解决，并探讨代码优化，让你的代码更简洁。'
---

## 问题描述

给定一个整数数组 `temperatures`，表示每天的温度。你需要返回一个数组 `answer`，其中 `answer[i]` 是指对于第 `i` 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 `0` 来代替。

**示例：**

输入: `temperatures = [73,74,75,71,69,72,76,73]`
输出: `[1,1,4,2,1,1,0,0]`

**约束条件：**

- `1 <= temperatures.length <= 10^5`
- `30 <= temperatures[i] <= 100`

## 解题思路

这道题要求我们找到每天之后第一个比它温度高的日子，并计算相差的天数。

### 暴力解法（朴素想法）

最直接的想法是，对于每一天 `i`，我们都向后遍历，找到第一个温度比 `temperatures[i]` 高的日子 `j`，那么 `answer[i] = j - i`。如果找不到，则 `answer[i] = 0`。这种方法的时间复杂度是 O(N^2)，在 N 达到 10^5 时，会超时。

### 单调栈解法

为了优化时间复杂度，我们可以使用「单调栈」。单调栈是一种特殊的栈，它在任何时候栈内元素都保持单调递增或单调递减的性质。对于这道题，我们希望找到每个元素的「下一个更大元素」，这正是单调栈的经典应用场景。

我们可以维护一个**单调递减栈**，栈中存储的是温度值的**索引**。为什么是单调递减呢？

- 当我们遍历到当天的温度 `temperatures[i]` 时：
  - 如果栈为空，或者当前温度小于等于栈顶索引对应的温度，说明当前温度没有打破栈的单调递减性（或者说，对于栈顶元素而言，当前温度还不是它右边第一个更高的温度），直接将当前温度的索引 `i` 入栈。
  - 如果当前温度 `temperatures[i]` **大于**栈顶索引 `topIdx` 对应的温度 `temperatures[topIdx]`，这说明我们找到了 `temperatures[topIdx]` 右边第一个比它大的元素，这个元素就是 `temperatures[i]`。此时，栈顶元素 `topIdx` 的等待天数就是 `i - topIdx`。我们将 `topIdx` 出栈，并记录结果。然后继续比较新的栈顶元素和当前温度 `temperatures[i]`，直到栈为空或者当前温度不再大于栈顶温度。处理完毕后，将当前温度的索引 `i` 入栈，以维持后续的判断。

通过这种方式，每个元素的索引最多入栈一次、出栈一次，所以总的时间复杂度是 O(N)。

## 代码实现 (Go)

这是你提供的 Go 语言解法，它正确地使用了单调栈：

```go
package main

/*
 * @lc app=leetcode.cn id=739 lang=golang
 *
 * [739] 每日温度
 */

// @lc code=start
func dailyTemperatures(temperatures []int) (res []int) {
	stack := make([]int, 0) // 存储索引的单调递减栈
	res = make([]int, len(temperatures)) // 结果数组，默认值为0

	for i := range temperatures {
		// 【待优化部分】
		if len(stack) == 0 {
			stack = append(stack, i)
			continue
		}

		// 当栈不为空，且当前温度大于栈顶索引对应的温度时
		for len(stack) > 0 && temperatures[stack[len(stack)-1]] < temperatures[i] {
			top := stack[len(stack)-1] // 取出栈顶索引
			stack = stack[:len(stack)-1] // 弹出栈顶

			res[top] = i - top // 计算等待天数
		}

		stack = append(stack, i) // 当前索引入栈
	}

	return res
}
// @lc code=end
```

## 代码优化

我们来看看上面代码中标记的【待优化部分】：

```go
if len(stack) == 0 {
    stack = append(stack, i)
    continue
}
```

这段代码的意图是：如果栈为空，就直接把当前索引 `i` 加进去，然后跳过后续的 `for` 循环，开始下一次迭代。

**为什么可以优化呢？**

我们分析一下后续的逻辑：

1.  `for len(stack) > 0 && temperatures[stack[len(stack)-1]] < temperatures[i]`：这个循环处理的是当栈**不为空**且当前温度**大于**栈顶温度的情况。如果栈为空，`len(stack) > 0` 这个条件自然不满足，循环体不会执行。
2.  `stack = append(stack, i)`：在 `for` 循环之后，无论之前栈是否为空，或者 `for` 循环是否执行，当前索引 `i` 都会被加入栈中。

考虑如果我们将【待优化部分】去掉：

```go
// ...
for i := range temperatures {
    // 【待优化部分】被移除

    // 当栈不为空，且当前温度大于栈顶索引对应的温度时
    for len(stack) > 0 && temperatures[stack[len(stack)-1]] < temperatures[i] {
        top := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        res[top] = i - top
    }

    stack = append(stack, i) // 当前索引入栈
}
// ...
```

现在，如果遍历到 `i` 时栈是空的：

- 内部的 `for` 循环因为 `len(stack) > 0` 不满足，所以不会执行。
- 然后，`stack = append(stack, i)` 会将 `i` 加入到空栈中。

这与原始代码中【待优化部分】的行为结果是一致的！原始代码中，如果栈为空，会执行 `stack = append(stack, i)` 然后 `continue`。优化后，如果栈为空，内部 `for` 循环不执行，然后 `stack = append(stack, i)` 执行。两者最终都使得 `i` 被加入栈中，且没有错误地执行内部 `for` 循环的逻辑。

因此，那段显式的空栈检查和 `continue` 语句其实是**不必要**的。移除它可以让代码更简洁，因为后续的逻辑已经隐式地正确处理了栈为空的情况。

## 优化后的代码实现 (Go)

```go
package main

// @lc code=start
func dailyTemperatures(temperatures []int) (res []int) {
	stack := make([]int, 0)
	res = make([]int, len(temperatures))

	for i := range temperatures {
		// 优化：移除了显式的空栈检查
		// if len(stack) == 0 {
		//  stack = append(stack, i)
		//  continue
		// }

		for len(stack) > 0 && temperatures[stack[len(stack)-1]] < temperatures[i] {
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			res[top] = i - top
		}
		stack = append(stack, i)
	}
	return res
}
// @lc code=end
```

这段优化后的代码功能完全相同，但更加精炼。

## 复杂度分析

- **时间复杂度**: O(N)，其中 N 是 `temperatures` 数组的长度。每个元素的索引最多被压入和弹出栈一次。
- **空间复杂度**: O(N)，在最坏的情况下（例如温度持续递减 `[70,60,50,40]`），栈中会存储所有元素的索引。

## 关键收获

- 单调栈是解决“下一个更大/更小元素”问题的有效工具。
- 在编写循环和条件判断时，仔细思考边界条件和已有逻辑的覆盖范围，有时可以发现冗余代码，使代码更简洁。
- 对于这道题，维护一个存储索引的单调递减栈是核心。

希望这篇题解能帮助你更好地理解这道题目和单调栈的应用！
