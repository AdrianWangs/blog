---
title: 'LeetCode 295 - 数据流的中位数（Find Median from Data Stream）'
date: 2025-05-14 20:32:32
categories:
  - 算法刷题
  - LeetCode
tags:
  - 堆
  - 优先队列
  - Hard
  - 数据结构设计
  - LeetCode
description: '使用两个堆（最大堆与最小堆）巧妙维护数据流的中位数，实现了 O(log n) 的插入和 O(1) 的查询效率，并通过数据平衡策略确保中位数快速获取。'
---

## 问题描述

中位数是有序整数列表中的中间值。如果列表的大小是偶数，则没有中间值，中位数是两个中间值的平均值。

例如：

- arr = [2,3,4] 的中位数是 3
- arr = [2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

- `void addNum(int num)` - 将整数 num 添加到数据结构中
- `double findMedian()` - 返回所有元素的中位数

示例：

```
输入：
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
输出：[null, null, null, 1.5, null, 2.0]

解释：
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // 返回 1.5 ((1 + 2) / 2)
medianFinder.addNum(3);    // arr = [1, 2, 3]
medianFinder.findMedian(); // 返回 2.0
```

约束条件：

- -10^5 <= num <= 10^5
- 在调用 findMedian 之前，数据结构中至少有一个元素
- 最多 5 \* 10^4 次调用 addNum 和 findMedian

## 解题思路

### 分析问题

这个问题要求我们设计一个数据结构，能够在数据流中快速获取中位数。关键挑战在于：

1. 数据是连续添加的，而不是一次性给出
2. 每次添加后可能需要重新计算中位数
3. 需要高效处理大量的添加操作和查找操作

对于中位数的查找，如果我们维护一个有序的数组，那么中位数的位置是确定的。但每次插入新元素时，为了保持有序，我们需要 O(n) 的时间复杂度进行插入，这在数据量大时效率很低。

### 核心思想：双堆法

**关键洞见**：我们可以将数据分成两部分，左半部分用最大堆维护，右半部分用最小堆维护。

这样设计的好处是：

- 左边最大堆的堆顶是左半部分的最大值
- 右边最小堆的堆顶是右半部分的最小值
- 当两个堆平衡时，这两个值就是我们需要的中间值

具体来说：

1. 如果元素总数是奇数，我们可以让左边的最大堆多一个元素，此时最大堆的堆顶就是中位数
2. 如果元素总数是偶数，中位数是最大堆堆顶和最小堆堆顶的平均值

### 算法流程

1. 创建两个堆：最大堆 `maxHeap` 和最小堆 `minHeap`
2. `maxHeap` 存储较小的一半数字，`minHeap` 存储较大的一半数字
3. 确保两个堆大小平衡：两堆大小要么相等，要么 `maxHeap` 比 `minHeap` 多一个元素
4. 每次添加元素时，通过交换堆顶元素来维护两个堆的数据平衡

添加元素的具体步骤：

1. 如果两个堆都为空，直接将元素添加到 `maxHeap`
2. 否则，根据两个堆的大小关系选择合适的堆进行元素添加
3. 添加时，先弹出一个堆的顶部元素，与新元素比较，较大的进入 `minHeap`，较小的进入 `maxHeap`
4. 这样确保了 `maxHeap` 中所有元素都小于等于 `minHeap` 中的所有元素

## 实现细节

Go 语言的标准库 `container/heap` 提供了堆的接口，但需要我们自己实现特定的方法。

### 实现堆接口

首先，我们需要为最大堆和最小堆分别实现 `heap.Interface` 接口：

1. 最小堆实现：

```go
type minHeap []int
func (h minHeap) Len() int           { return len(h) }
func (h minHeap) Less(i, j int) bool { return h[i] < h[j] }  // 最小堆：父节点小于子节点
func (h minHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x any) {
    *h = append(*h, x.(int))
}
func (h *minHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}
```

2. 最大堆实现：

```go
type maxHeap []int
func (h maxHeap) Len() int           { return len(h) }
func (h maxHeap) Less(i, j int) bool { return h[i] > h[j] }  // 最大堆：父节点大于子节点
func (h maxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *maxHeap) Push(x any) {
    *h = append(*h, x.(int))
}
func (h *maxHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}
```

### 关键实现细节

在 `AddNum` 方法中，我们需要确保两个堆的平衡并且数据分布正确：

```go
func (mf *MedianFinder) AddNum(num int) {
    // 特殊处理第一个元素
    if len(mf.maxh) == 0 && len(mf.minh) == 0 {
        heap.Push(&mf.maxh, num)
        return
    }

    // 比较两个堆的大小，调整元素分布
    if len(mf.maxh) <= len(mf.minh) {
        // 从最小堆弹出一个元素，与新元素比较
        num2 := heap.Pop(&mf.minh).(int)
        // 较大的进入最小堆
        heap.Push(&mf.minh, max(num, num2))
        // 较小的进入最大堆
        heap.Push(&mf.maxh, min(num2, num))
    } else {
        // 从最大堆弹出一个元素，与新元素比较
        num2 := heap.Pop(&mf.maxh).(int)
        // 较大的进入最小堆
        heap.Push(&mf.minh, max(num, num2))
        // 较小的进入最大堆
        heap.Push(&mf.maxh, min(num2, num))
    }
}
```

在 `FindMedian` 方法中，根据两个堆的大小关系快速计算中位数：

```go
func (mf *MedianFinder) FindMedian() float64 {
    if len(mf.maxh) != len(mf.minh) {
        // 奇数情况：最大堆的堆顶就是中位数
        return float64(mf.maxh[0])
    }
    // 偶数情况：两个堆顶的平均值
    return float64(mf.maxh[0] + mf.minh[0]) / 2.0
}
```

## 代码实现

完整的 Go 语言实现：

```go
package main

import "container/heap"

type MedianFinder struct {
    minh minHeap  // 存储较大的一半数字
    maxh maxHeap  // 存储较小的一半数字
}

func Constructor() MedianFinder {
    return MedianFinder{
        minh: minHeap{},
        maxh: maxHeap{},
    }
}

func (mf *MedianFinder) AddNum(num int) {
    if len(mf.maxh) == 0 && len(mf.minh) == 0 {
        heap.Push(&mf.maxh, num)
        return
    }

    if len(mf.maxh) <= len(mf.minh) {
        num2 := heap.Pop(&mf.minh).(int)
        heap.Push(&mf.minh, max(num, num2))
        heap.Push(&mf.maxh, min(num2, num))
    } else {
        num2 := heap.Pop(&mf.maxh).(int)
        heap.Push(&mf.minh, max(num, num2))
        heap.Push(&mf.maxh, min(num2, num))
    }
}

func (mf *MedianFinder) FindMedian() float64 {
    if len(mf.maxh) != len(mf.minh) {
        return float64(mf.maxh[0])
    }
    return float64(mf.maxh[0] + mf.minh[0]) / 2.0
}

// 定义最小堆
type minHeap []int
func (h minHeap) Len() int           { return len(h) }
func (h minHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h minHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x any) {
    *h = append(*h, x.(int))
}
func (h *minHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

// 定义最大堆
type maxHeap []int
func (h maxHeap) Len() int           { return len(h) }
func (h maxHeap) Less(i, j int) bool { return h[i] > h[j] }
func (h maxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *maxHeap) Push(x any) {
    *h = append(*h, x.(int))
}
func (h *maxHeap) Pop() any {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}
```

## 复杂度分析

### 时间复杂度

- `AddNum` 操作：O(log n)

  - 堆的插入和删除操作都是 O(log n)，其中 n 是堆的大小
  - 每次 AddNum 进行了固定次数（常数次）的堆操作

- `FindMedian` 操作：O(1)
  - 直接返回堆顶或两个堆顶的平均值，是常数时间操作

### 空间复杂度

- O(n)，其中 n 是添加到数据结构中的元素数量
  - 所有元素都存储在两个堆中

## 方法比较

| 方面                 | 双堆法         | 排序数组法         | AVL 树/红黑树法  |
| -------------------- | -------------- | ------------------ | ---------------- |
| 添加元素时间复杂度   | O(log n)       | O(n)               | O(log n)         |
| 查找中位数时间复杂度 | O(1)           | O(1)               | O(log n)         |
| 空间复杂度           | O(n)           | O(n)               | O(n)             |
| 实现复杂度           | 中等           | 简单               | 复杂             |
| 适用场景             | 高频添加和查询 | 高频查询，低频添加 | 数据量大且波动大 |

## 关键收获

1. **数据结构的选择至关重要**：使用两个堆能让我们高效地获取中位数
2. **数据平衡的维护**：确保两个堆的大小差不超过 1，是算法正确性的关键
3. **元素交换的技巧**：通过比较新元素和堆顶元素来保证数据分布正确
4. **数据流算法设计**：处理数据流问题时，我们通常无法一次处理所有数据，需要能够动态调整的数据结构
5. **堆的接口实现**：Go 语言 `container/heap` 包提供了灵活的堆接口，通过实现接口可以快速构建自定义堆

这道题目是堆和优先队列在实际问题中的一个典型应用，也展示了如何在不排序整个数组的情况下高效地维护数据的中位数。
