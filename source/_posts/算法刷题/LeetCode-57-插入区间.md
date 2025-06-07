---
title: "LeetCode 57. 插入区间 - Go 题解"
date: 2025-06-07 17:13:16
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 数组
  - 区间
  - LeetCode
  - Go
  - Medium
description: "本文详细讲解了 LeetCode 57. 插入区间的解题思路，通过一次遍历实现新旧区间的合并，并提供了 Go 语言的完整实现代码及复杂度分析。"
---

### 问题描述

给你一个 **无重叠的**、**按照区间起始端点排序的** 区间列表 `intervals`，其中 `intervals[i] = [starti, endi]` 表示第 `i` 个区间的开始和结束，并且 `intervals` 中的区间不重叠。

另给出一个新区间 `newInterval = [start, end]`。

你需要将 `newInterval` 插入 `intervals` 中，并保证 `intervals` 仍然是按起始端点排序的无重叠区间。

**示例 1:**

-   **输入:** `intervals = [[1,3],[6,9]]`, `newInterval = [2,5]`
-   **输出:** `[[1,5],[6,9]]`

**示例 2:**

-   **输入:** `intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]`
-   **输出:** `[[1,2],[3,10],[12,16]]`
-   **解释:** 新区间 `[4,8]` 与 `[3,5]`, `[6,7]`, `[8,10]` 重叠。

### 解题思路

这道题的核心是在一个有序且无重叠的区间列表中插入一个新区间，并合并所有重叠的区间。由于原区间列表已经是有序的，我们可以通过一次遍历来完成这个任务。

我们的目标是构建一个新的结果列表 `res`。遍历原始区间 `intervals`，对于每个区间，有三种情况：

1.  **当前区间在 `newInterval` 的左侧且无交集**：
    如果当前区间的结束点 `interval[1]` 小于 `newInterval` 的起始点 `left`，说明当前区间与新区间没有交集，并且位于新区间之前。我们可以直接将当前区间加入结果列表 `res`。

2.  **当前区间在 `newInterval` 的右侧且无交集**：
    如果当前区间的起始点 `interval[0]` 大于 `newInterval` 的结束点 `right`，说明当前区间与新区间没有交集，并且位于新区间之后。这时，我们需要先将合并后的新区间（可能是 `newInterval` 本身，也可能是它与其他区间合并后的结果）加入结果列表 `res`，然后再加入当前区间。为了防止重复添加，我们用一个 `merged` 标志位来记录是否已经添加过合并区间。

3.  **当前区间与 `newInterval` 有交集**：
    只要不满足以上两种情况，就说明当前区间与 `newInterval` 存在重叠。我们需要更新 `newInterval` 的边界，使其能够覆盖当前区间。具体做法是：
    -   将 `newInterval` 的左边界 `left` 更新为 `min(left, interval[0])`。
    -   将 `newInterval` 的右边界 `right` 更新为 `max(right, interval[1])`。
    这样，遍历结束后，`[left, right]` 就代表了 `newInterval` 与所有重叠区间合并后的最终区间。

遍历结束后，如果 `merged` 标志位仍然是 `false`，说明合并后的区间还没有被添加到结果列表中（这通常发生在 `newInterval` 与所有原区间都合并，或者它位于所有原区间的末尾），此时需要手动将其添加到 `res` 中。

### 代码实现

```go
package main

/*
 * @lc app=leetcode.cn id=57 lang=golang
 *
 * [57] 插入区间
 */

// @lc code=start
func insert(intervals [][]int, newInterval []int) (res [][]int) {
	left, right := newInterval[0], newInterval[1]
	merged := false
	for _, interval := range intervals {
		// 当前区间在 newInterval 的右侧且无交集
		if interval[0] > right {
			if !merged {
				res = append(res, []int{left, right})
				merged = true
			}
			res = append(res, interval)
		} else if interval[1] < left {
			// 当前区间在 newInterval 的左侧且无交集
			res = append(res, interval)
		} else {
			// 有交集，更新 newInterval 的范围
			if interval[0] < left {
				left = interval[0]
			}
			if interval[1] > right {
				right = interval[1]
			}
		}
	}

	if !merged {
		res = append(res, []int{left, right})
	}

	return res
}
// @lc code=end
```

### 复杂度分析

-   **时间复杂度**: $O(n)$，其中 $n$ 是 `intervals` 的长度。我们只需要遍历一次区间列表。
-   **空间复杂度**: $O(n)$，我们需要一个额外的空间来存储结果列表。在最坏的情况下（没有区间合并），结果列表会包含所有原始区间和新区间。

### 关键收获

本题的关键在于利用输入区间的有序性。通过一次遍历，我们可以清晰地划分出与新区间不重叠的左侧部分、重叠部分以及不重叠的右侧部分，从而高效地完成插入和合并操作。这种思路在处理区间问题时非常常用。 