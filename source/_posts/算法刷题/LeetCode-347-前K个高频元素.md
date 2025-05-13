---
title: 'LeetCode 347 - 前 K 个高频元素 (Top K Frequent Elements)'
date: 2025-05-13 16:00:00
categories:
  - 算法刷题
  - LeetCode
tags:
  - 堆
  - 哈希表
  - Medium
  - LeetCode
description: '本文详细介绍了 LeetCode 347 题“前 K 个高频元素”的解题思路，并重点讲解了如何在 Go 语言中使用 heap（优先队列）来解决此问题。'
---

## 问题描述

给定一个非空的整数数组，返回其中出现频率前 k 高的元素。

**示例 1:**

输入: nums = `[1,1,1,2,2,3]`, k = 2
输出: `[1,2]`

**示例 2:**

输入: nums = `[1]`, k = 1
输出: `[1]`

**提示：**

- 你可以假设给定的 k 总是合理的，且 1 ≤ k ≤ 数组中不相同的元素的个数。
- 你的算法的时间复杂度必须优于 O(_n_ log _n_) , _n_ 是数组的大小。
- 题目数据保证答案唯一，换句话说，数组中前 k 个高频元素的集合是唯一的。
- 你可以按任意顺序返回答案。

## 解题思路

解决这个问题的核心思路分为两步：

1.  **统计频率**：遍历整个数组，使用哈希表（在 Go 中是 `map`）来统计每个元素出现的频率。
2.  **找出前 K 个高频元素**：利用堆（优先队列）这种数据结构，来高效地找出频率最高的前 K 个元素。

具体步骤如下：

1.  创建一个哈希表 `freqMap`，用于存储每个数字及其出现的频率。
2.  遍历输入数组 `nums`，对于每个数字：
    - 如果数字已存在于 `freqMap` 中，则将其频率加 1。
    - 如果数字不存在于 `freqMap` 中，则将其添加到 `freqMap` 并设置频率为 1。
3.  创建一个小顶堆（min-heap）。堆中存储的是一个包含数字和其频率的结构体或数组。堆的大小维持在 K。
4.  遍历 `freqMap` 中的每个键值对（数字和频率）：
    - 如果堆的大小小于 K，直接将当前元素（数字和频率）加入堆中。
    - 如果堆的大小等于 K，比较当前元素的频率与堆顶元素的频率：
      - 如果当前元素的频率大于堆顶元素的频率，则将堆顶元素移除，并将当前元素加入堆中。这样可以保证堆中始终存储的是当前已遍历元素中频率最高的 K 个。
5.  遍历结束后，堆中的 K 个元素即为频率最高的前 K 个元素。将这些元素的数字部分提取出来即可。

## Go 中 `container/heap` 的使用方法

Go 语言标准库 `container/heap` 提供了一个实现堆（优先队列）的接口。要使用它，我们需要定义一个类型，并为该类型实现 `heap.Interface` 接口，该接口包含以下五个方法：

- `Len() int`：返回集合中的元素个数。
- `Less(i, j int) bool`：比较索引为 `i` 和 `j` 的两个元素，如果 `heap[i]` 应该排在 `heap[j]` 前面，则返回 `true`。对于小顶堆，如果 `heap[i] < heap[j]` 则返回 `true`；对于大顶堆，如果 `heap[i] > heap[j]` 则返回 `true`。
- `Swap(i, j int)`：交换索引为 `i` 和 `j` 的两个元素。
- `Push(x interface{})`：向堆中添加一个元素 `x`。注意 `x` 的类型是 `interface{}`，通常我们会将其断言为我们定义的元素类型。这个方法通常是追加元素到内部的 slice 末尾。
- `Pop() interface{}`：移除并返回堆顶元素（对于小顶堆是最小元素，对于大顶堆是最大元素）。这个方法通常是移除内部 slice 的末尾元素。

### 针对本题的堆实现

为了解决“前 K 个高频元素”的问题，我们需要一个**小顶堆**，堆中元素的比较基准是它们的**频率**。

```go
import "container/heap"

// 定义堆中元素的结构
type FreqElement struct {
	Val   int // 元素值
	Count int // 元素出现的频率
}

// 定义一个类型，它实现了 heap.Interface 接口
type MinHeap []FreqElement

// Len 返回堆中元素的数量
func (h MinHeap) Len() int { return len(h) }

// Less 比较两个元素的频率，用于构建小顶堆
// 如果 h[i] 的频率小于 h[j] 的频率，则 h[i] 应该排在 h[j] 前面
func (h MinHeap) Less(i, j int) bool { return h[i].Count < h[j].Count }

// Swap 交换堆中两个元素的位置
func (h MinHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }

// Push 向堆中添加一个元素
// 注意：Push 方法的参数是 interface{}，需要类型断言
// heap.Push 会调用这个 Push 方法，并将元素追加到 slice 的末尾
// 然后通过 up 调整堆结构
func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(FreqElement))
}

// Pop 从堆中移除并返回最小频率的元素（堆顶元素）
// 注意：Pop 方法返回的是 interface{}，需要类型断言
// heap.Pop 会先将堆顶元素与末尾元素交换，然后移除末尾元素
// 再通过 down 调整堆结构，最后返回移除的元素
func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}
```

## 代码实现

```go
package leetcode

import "container/heap"

// FreqElement 定义堆中元素的结构
type FreqElement struct {
	Val   int // 元素值
	Count int // 元素出现的频率
}

// MinHeap 定义一个类型，它实现了 heap.Interface 接口
type MinHeap []FreqElement

func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i].Count < h[j].Count } // 小顶堆，按频率比较
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

func (h *MinHeap) Push(x interface{}) {
	*h = append(*h, x.(FreqElement))
}

func (h *MinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

func topKFrequent(nums []int, k int) []int {
	// 1. 统计元素频率
	freqMap := make(map[int]int)
	for _, num := range nums {
		freqMap[num]++
	}

	// 2. 构建小顶堆
	h := &MinHeap{}
	heap.Init(h) // 初始化堆

	// 3. 遍历频率映射，维护大小为 k 的小顶堆
	for val, count := range freqMap {
		if h.Len() < k {
			heap.Push(h, FreqElement{Val: val, Count: count})
		} else {
			// 如果当前元素的频率大于堆顶元素的频率（堆顶是当前k个元素中频率最小的）
			// 则弹出堆顶，并将当前元素压入堆
			if count > (*h)[0].Count { // (*h)[0] 是堆顶元素
				heap.Pop(h)
				heap.Push(h, FreqElement{Val: val, Count: count})
			}
		}
	}

	// 4. 提取结果
	result := make([]int, k)
	for i := 0; i < k; i++ {
		// Pop出来的是频率最小的，但因为我们维护的是大小为k的堆，
		// 并且不断用更高频率的元素替换低频率的，所以最后堆里剩下的就是前k个高频元素。
		// 题目对顺序没有要求，所以直接Pop即可。
		// 如果需要按频率从高到低输出，则需要先将所有元素压入大顶堆，然后Pop k次。
		// 或者，将小顶堆的元素取出后反转。
		// 这里我们直接按Pop的顺序（频率从小到大，但都是前k个高频的）放入结果数组，然后反转。
		// 或者，更简单地，因为题目不要求顺序，可以直接从堆中取出。
		result[i] = heap.Pop(h).(FreqElement).Val
	}
    // 如果需要按频率从高到低输出，可以对result进行一次反转
    // for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
	// 	result[i], result[j] = result[j], result[i]
	// }
	return result
}

```

## 方法比较

| 方面       | 哈希表 + 排序                                         | 哈希表 + 小顶堆 (本解法)                                                  |
| ---------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| 时间复杂度 | O(N + M log M)，其中 N 是数组长度，M 是不同元素的个数 | O(N + M log K)，其中 N 是数组长度，M 是不同元素的个数，K 是要找的元素个数 |
| 空间复杂度 | O(M)                                                  | O(M + K)                                                                  |
| 优点       | 实现相对简单                                          | 时间复杂度更优，特别是当 M 远大于 K 时                                    |
| 缺点       | 当不同元素很多时，排序开销大                          | 实现略复杂，需要自定义堆结构                                              |
| 推荐度     | ★★★☆☆                                                 | ★★★★★                                                                     |

**说明：**

- **哈希表 + 排序**：先用哈希表统计频率 (O(N))，然后将哈希表中的元素（值和频率）存入一个列表并按频率排序 (O(M log M))，最后取前 K 个。
- **哈希表 + 小顶堆**：先用哈希表统计频率 (O(N))，然后遍历哈希表中的 M 个元素，每个元素进行堆操作 (Push/Pop)，堆操作的时间复杂度是 O(log K)。所以这部分是 O(M log K)。

由于题目要求时间复杂度优于 O(_n_ log _n_)，当 M 接近 N 时，O(N + M log M) 约等于 O(N log N)，可能不满足要求。而 O(N + M log K) 通常会更好。

## 复杂度分析

- **时间复杂度**：
  - 统计频率：O(N)，其中 N 是数组 `nums` 的长度。
  - 构建和维护堆：我们遍历 `freqMap`，其大小最多为 N (当所有元素都不同时，记为 M，M <= N)。对于 `freqMap` 中的每个元素，我们执行一次堆操作（`Push` 或 `Pop` 后 `Push`）。堆的大小最多为 K。因此，堆操作的时间复杂度为 O(log K)。总共是 O(M log K)。
  - 所以，总的时间复杂度是 O(N + M log K)。
- **空间复杂度**：
  - 哈希表 `freqMap`：最坏情况下存储 M 个不同元素，空间复杂度为 O(M)。
  - 堆 `h`：存储 K 个元素，空间复杂度为 O(K)。
  - 所以，总的空间复杂度是 O(M + K)。

## 关键收获

- 理解哈希表在统计频率问题中的高效应用。
- 掌握 Go 语言中 `container/heap` 包的使用方法，包括如何定义自定义类型并实现 `heap.Interface` 接口。
- 学会使用小顶堆来解决“前 K 大/高”这类问题，通过维护一个固定大小的堆，不断将更优的元素替换堆顶元素。
- 对于需要自定义比较逻辑的优先队列，`container/heap` 提供了灵活的解决方案。
