---
title: 'LeetCode 155 - 最小栈 (Min Stack)'
date: 2025-05-11 16:52:46
categories:
  - 算法刷题
  - LeetCode
tags:
  - 栈
  - 设计
  - Easy
  - LeetCode
description: '设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。'
---

## 问题描述

设计一个支持 `push` ，`pop` ，`top` 操作，并能在常数时间内检索到最小元素的栈。

实现 `MinStack` 类:

- `MinStack()` 初始化堆栈对象。
- `void push(int val)` 将元素 val 推入堆栈。
- `void pop()` 删除堆栈顶部的元素。
- `int top()` 获取堆栈顶部的元素。
- `int getMin()` 获取堆栈中的最小元素。

**示例:**

```
输入：
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

输出：
[null,null,null,null,-3,null,0,-2]

解释：
MinStack minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();   --> 返回 -3.
minStack.pop();
minStack.top();      --> 返回 0.
minStack.getMin();   --> 返回 -2.
```

**约束条件:**

- `-2^31 <= val <= 2^31 - 1`
- `pop`、`top` 和 `getMin` 操作总是在 **非空栈** 上调用
- `push`, `pop`, `top`, and `getMin`最多被调用 `3 * 10^4` 次

## 解题思路

这道题的核心要求是在常数时间内检索到栈中的最小元素，同时要支持常规的栈操作（push, pop, top）。

一个常见的解法是使用 **辅助栈**。我们维护两个栈：

1.  `stack`: 普通的数据栈，用于存储所有推入的元素。
2.  `minStack`: 辅助栈，用于存储当前 `stack` 中对应状态下的最小值。

**具体操作如下：**

- **`push(val)`**:

  - 将 `val` 正常推入 `stack`。
  - 对于 `minStack`：
    - 如果 `minStack` 为空，则将 `val` 推入 `minStack`。
    - 否则，比较 `val` 和 `minStack` 的栈顶元素 `currentMin`。将 `min(val, currentMin)` 推入 `minStack`。这样 `minStack` 的栈顶始终是当前 `stack` 中的最小值。

- **`pop()`**:

  - 同时从 `stack` 和 `minStack` 中弹出栈顶元素。

- **`top()`**:

  - 返回 `stack` 的栈顶元素。

- **`getMin()`**:
  - 返回 `minStack` 的栈顶元素。

这种方法可以保证所有操作的时间复杂度都是 O(1)。

## 代码实现

```go
// filepath: /Users/adrianwang/.leetcode/155.最小栈.go
package main

// @lc code=start
type MinStack struct {
	stack    []int
	minStack []int
}

func Constructor() MinStack {
	return MinStack{
		stack:    make([]int, 0),
		minStack: make([]int, 0),
	}
}

func (this *MinStack) Push(val int) {
	this.stack = append(this.stack, val)
	var minVal int
	if len(this.minStack) == 0 {
		minVal = val
	} else {
		minVal = this.minStack[len(this.minStack)-1]
	}
	// Go 语言没有内置的 min 函数，需要自己实现或者直接比较
	if val < minVal {
		this.minStack = append(this.minStack, val)
	} else {
		this.minStack = append(this.minStack, minVal)
	}
}

func (this *MinStack) Pop() {
	this.minStack = this.minStack[:len(this.minStack)-1]
	this.stack = this.stack[:len(this.stack)-1]
}

func (this *MinStack) Top() int {
	return this.stack[len(this.stack)-1]
}

func (this *MinStack) GetMin() int {
	return this.minStack[len(this.minStack)-1]
}

/**
 * Your MinStack object will be instantiated and called as such:
 * obj := Constructor();
 * obj.Push(val);
 * obj.Pop();
 * param_3 := obj.Top();
 * param_4 := obj.GetMin();
 */
// @lc code=end

// 辅助函数 min (Go语言标准库没有，需要自行实现)
// func min(a, b int) int {
// 	if a < b {
// 		return a
// 	}
// 	return b
// }
```

**注意:** 上述 Go 代码中的 `Push` 方法有一个小调整，因为 Go 标准库中没有直接的 `min` 函数。在实际 LeetCode 提交时，如果 `min` 函数未提供，你需要自己实现一个，或者像代码中那样直接进行比较。在提供的代码片段中，`min(val, minVal)` 这一行会报错，我已经将其修改为直接比较。

### 空间优化思路

上述辅助栈的方法虽然简单，但 `minStack` 的大小始终与 `stack` 相同。我们可以对 `minStack` 的使用进行优化，使其仅在必要时存储元素，从而可能节省空间。

**优化逻辑：**

- **`Push(val)`**:

  - 元素 `val` 正常推入 `stack`。
  - 对于 `minStack`：
    - 如果 `minStack` 为空，或者 `val` 小于或等于 `minStack` 的栈顶元素，则将 `val` 推入 `minStack`。我们使用 `<=` 是为了正确处理栈中存在多个相同最小值的情况。
    - 否则 (`val` 大于 `minStack` 的栈顶元素)，`minStack` 不做任何操作，因为当前的最小值仍然有效。

- **`Pop()`**:

  - 从 `stack` 弹出栈顶元素 `poppedVal`。
  - 检查 `poppedVal` 是否等于 `minStack` 的栈顶元素。
    - 如果相等，说明被弹出的元素是（或之一是）当前的最小值，因此也需要从 `minStack` 弹出栈顶元素，以更新最小值记录。
    - 如果不相等，`minStack` 不做任何操作。

- **`Top()` 和 `GetMin()`**:
  - `Top()` 逻辑不变，返回 `stack` 的栈顶。
  - `GetMin()` 逻辑不变，返回 `minStack` 的栈顶。

**优化后的代码实现示例：**

```go
// Push (空间优化版)
func (this *MinStack) Push(val int) {
    this.stack = append(this.stack, val)
    if len(this.minStack) == 0 || val <= this.minStack[len(this.minStack)-1] {
        this.minStack = append(this.minStack, val)
    }
}

// Pop (空间优化版)
func (this *MinStack) Pop() {
    // 假设栈非空 (根据题目约束)
    poppedVal := this.stack[len(this.stack)-1]
    this.stack = this.stack[:len(this.stack)-1]

    if len(this.minStack) > 0 && poppedVal == this.minStack[len(this.minStack)-1] {
        this.minStack = this.minStack[:len(this.minStack)-1]
    }
}
```

**注意：** `Constructor`, `Top`, `GetMin` 方法与原版相同。

## 方法比较

| 方面        | 辅助栈法 (同步栈)                              | 辅助栈法 (空间优化)                                                            |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| 时间复杂度  | Push: O(1), Pop: O(1), Top: O(1), GetMin: O(1) | Push: O(1), Pop: O(1), Top: O(1), GetMin: O(1)                                 |
| 空间复杂度  | O(n) - 辅助栈与数据栈等长                      | O(n) - 最坏情况 O(n) (如单调递减序列), 平均情况可能优于同步栈 (如单调递增序列) |
| `Push` 实现 | 总是向`minStack`推入当前比较后的最小值         | 仅当新元素 `<= minStack`栈顶时推入                                             |
| `Pop` 实现  | 总是从`minStack`同步弹出                       | 仅当弹出元素 `== minStack`栈顶时从`minStack`弹出                               |
| 优点        | 实现非常简单，`Pop`逻辑直接                    | 在某些数据模式下可能节省空间                                                   |
| 缺点        | `minStack`空间占用相对固定                     | `Pop`逻辑稍复杂，空间节省效果依赖输入数据序列                                  |
| 推荐度      | ★★★★★ (因其简洁性和稳定性)                     | ★★★★☆ (适用于对空间有极致要求的场景，或作为理解栈设计的进阶)                   |

## 复杂度分析

对于上述两种辅助栈实现方法：

- **时间复杂度**:

  - `push()`: O(1)。
  - `pop()`: O(1)。
  - `top()`: O(1)。
  - `getMin()`: O(1)。
    所有操作均为常数时间。

- **空间复杂度**: O(n)，其中 n 是栈中元素的数量。
  - 对于同步栈方法，`minStack` 的大小与 `stack` 始终相同。
  - 对于空间优化方法，`minStack` 的大小在最坏情况下（例如，输入序列单调递减）也是 O(n)，但平均情况下可能小于 O(n)（例如，输入序列单调递增时，`minStack` 只存一个元素）。

## 关键收获

- **辅助数据结构**: 解决这类需要在特定约束下（如常数时间）获取额外信息的问题时，辅助数据结构是一个非常有效的思路。
- **同步操作**: 辅助栈 `minStack` 的操作必须与主数据栈 `stack` 的操作同步，以确保 `minStack` 栈顶始终对应 `stack` 当前状态的最小值。
- **空间换时间**: 辅助栈的使用是以额外的空间开销为代价，来换取 `getMin` 操作的常数时间复杂度。
- **空间优化**: 在某些场景下，通过优化辅助栈的使用，可以进一步减少空间占用。

这道题是栈相关问题中的经典题目，理解辅助栈的思想以及空间优化的策略对于解决类似问题很有帮助。
