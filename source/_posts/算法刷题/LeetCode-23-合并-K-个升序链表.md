---
title: "LeetCode-23-合并 K 个升序链表"
date: 2025-07-09 00:01:36
categories:
  - 算法刷题
tags:
  - LeetCode
  - 堆
  - 链表
description: "本文介绍了 LeetCode 第 23 题——合并 K 个升序链表的解题思路，包括最小堆的解法和顺序合并的解法。"
---

## 题目描述

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

**示例 1：**

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1->4->5,
  1->3->4,
  2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6
```

**示例 2：**

```
输入：lists = []
输出：[]
```

**示例 3：**

```
输入：lists = [[]]
输出：[]
```

**提示：**

*   `k == lists.length`
*   `0 <= k <= 10^4`
*   `0 <= lists[i].length <= 500`
*   `-10^4 <= lists[i][j] <= 10^4`
*   `lists[i]` 按 **升序** 排列
*   `lists[i].length` 的总和不超过 `10^4`

## 解题思路

### 方法一：最小堆

我们可以使用一个最小堆来维护 `k` 个链表的头节点。每次从堆中取出最小的节点，将其加入到结果链表中，然后将该节点的下一个节点加入到堆中。

这个过程重复进行，直到堆为空。

*   **时间复杂度：** O(N log k)，其中 `N` 是所有链表中元素的总数，`k` 是链表的数量。
*   **空间复杂度：** O(k)，堆中最多存储 `k` 个元素。

```go
package main

/*
 * @lc app=leetcode.cn id=23 lang=golang
 *
 * [23] 合并 K 个升序链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */

/**
* 最小堆
* 时间复杂度：O(nlogk)
* 空间复杂度：O(k)
 */

type ListItem struct {
	index int
}

type ListMinHeap struct {
	data  []*ListItem
	lists *[]*ListNode
}

func NewListMinHeap(lists *[]*ListNode) *ListMinHeap {
	return &ListMinHeap{
		data:  []*ListItem{},
		lists: lists,
	}
}

func (heap *ListMinHeap) Smaller(index1, index2 int) bool {
	return (*(heap.lists))[heap.data[index1].index].Val < (*(heap.lists))[heap.data[index2].index].Val
}

func (heap *ListMinHeap) Push(x *ListItem) {
	heap.data = append(heap.data, x)
	n := len(heap.data) - 1

	for n != 0 && heap.Smaller(n, (n-1)/2) {
		heap.data[n], heap.data[(n-1)/2] = heap.data[(n-1)/2], heap.data[n]
		n = (n - 1) / 2
	}
}

func (heap *ListMinHeap) Pop() *ListItem {
	top := heap.data[0]
	heap.data[0] = heap.data[len(heap.data)-1]
	heap.data = heap.data[:len(heap.data)-1]

	index := 0
	heapLen := len(heap.data)
	for {
		leftChildren := 2*index + 1
		rightChildren := 2*index + 2

		minIndex := index
		if leftChildren < heapLen && heap.Smaller(leftChildren, minIndex) {
			minIndex = leftChildren
		}
		if rightChildren < heapLen && heap.Smaller(rightChildren, minIndex) {
			minIndex = rightChildren
		}

		if minIndex == index {
			break
		}

		heap.data[index], heap.data[minIndex] = heap.data[minIndex], heap.data[index]

		index = minIndex

	}

	return top
}

func mergeKLists(lists []*ListNode) *ListNode {

	if len(lists) == 0 {
		return nil
	}

	dummyHead := &ListNode{}

	h := NewListMinHeap(&lists)

	remain := 0
	for i := 0; i < len(lists); i++ {
		if lists[i] == nil {
			continue
		}
		remain++
		h.Push(&ListItem{index: i})
	}

	cur := dummyHead
	for remain != 0 {
		// 处理最后一个链表
		if remain == 1 {
			cur.Next = lists[h.Pop().index]
			break
		}

		top := h.Pop()
		minIndex := top.index

		cur.Next = lists[minIndex]

		lists[minIndex] = lists[minIndex].Next

		if lists[minIndex] == nil {
			remain--
		} else {
			// 放回去重新排序
			h.Push(top)
		}
		cur = cur.Next

	}

	return dummyHead.Next
}
```

### 方法二：顺序合并

我们也可以通过两两合并链表的方式来实现。每次将两个链表合并成一个新的链表，直到所有链表都合并完毕。

*   **时间复杂度：** O(N*k)，其中 `N` 是所有链表中元素的总数，`k` 是链表的数量。
*   **空间复杂度：** O(1)。

```go
/**
* 顺序合并
* 时间复杂度：O(n*k)
* 空间复杂度：O(1)顺序合并
 */
func mergeKListsSequential(lists []*ListNode) *ListNode {
    if len(lists) == 0 {
        return nil
    }
    if len(lists) == 1 {
        return lists[0]
    }

    merge := func(l1, l2 *ListNode) *ListNode {
        dummy := &ListNode{}
        cur := dummy
        for l1 != nil && l2 != nil {
            if l1.Val < l2.Val {
                cur.Next = l1
                l1 = l1.Next
            } else {
                cur.Next = l2
                l2 = l2.Next
            }
            cur = cur.Next
        }
        if l1 != nil {
            cur.Next = l1
        }
        if l2 != nil {
            cur.Next = l2
        }
        return dummy.Next
    }

    res := lists[0]
    for i := 1; i < len(lists); i++ {
        res = merge(res, lists[i])
    }
    return res
}
```

## 总结

本文介绍了两种解决 "合并 K 个升序链表" 问题的方法。

*   **最小堆** 的方法在时间和空间上都表现得更优，尤其是在 `k` 值较大的情况下。
*   **顺序合并** 的方法实现起来更简单直观，但时间复杂度较高。

在实际应用中，推荐使用最小堆的方法。 