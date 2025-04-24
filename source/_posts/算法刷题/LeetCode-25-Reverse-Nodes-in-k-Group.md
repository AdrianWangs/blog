---
title: "LeetCode 25: K 个一组翻转链表（Reverse Nodes in k-Group）"
date: 2025-04-24 19:39:38
categories:
  - 算法刷题
  - LeetCode
tags:
  - 链表
  - 递归
  - 迭代
  - Hard
  - LeetCode
  - ❌错题集
---

## 问题描述

给你一个链表，每 k 个节点一组进行翻转，请你返回修改后的链表。

k 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 k 的整数倍，那么请将最后剩余的节点保持原有顺序。

你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

**示例 1:**
```
输入: head = [1,2,3,4,5], k = 2
输出: [2,1,4,3,5]
```

**示例 2:**
```
输入: head = [1,2,3,4,5], k = 3
输出: [3,2,1,4,5]
```

**约束条件:**

- 链表中节点的数目为 n
- 1 <= k <= n <= 5000
- 0 <= Node.val <= 1000

## 解题思路

本题要求我们以 k 个节点为一组进行翻转，如果最后剩余的节点不足 k 个，则保持原样。这是链表操作中的一个典型问题，主要涉及链表的翻转操作。

解决这个问题的核心思想是：
1. 确定每组 k 个节点的范围
2. 翻转这 k 个节点
3. 将翻转后的组与前后部分连接起来
4. 移动到下一组继续操作

我们使用迭代的方式来解决这个问题，通过一个循环来处理每组 k 个节点。

## 实现细节

### 错误版本分析

首先，让我们看看出错的代码版本：

```go
func reverseKGroup(head *ListNode, k int) *ListNode {
	if head == nil || head.Next == nil || k == 1 {
		return head
	}

	dummyHead := &ListNode{
		Next: head,
	}

	first := dummyHead

	var prev, end *ListNode
	cur := dummyHead.Next

	for {
		end = first
		for i := 0; i < k; i++ {
			end = end.Next
			if end == nil {
				break
			}
		}
		if end == nil {
			break
		}
		tmp := first.Next
		cur = tmp.Next
		prev = tmp
		for cur != nil && cur != end.Next {
			tmp2 := cur.Next
			cur.Next = prev
			prev = cur
			cur = tmp2
		}
		first.Next = end
		tmp.Next = cur

		first = tmp
	}

	return dummyHead.Next
}
```

这个版本的主要问题出现在翻转链表的循环条件中：

```go
for cur != nil && cur != end.Next {
    tmp2 := cur.Next
    cur.Next = prev
    prev = cur
    cur = tmp2
}
```

**错误原因**: 在翻转链表的过程中，我们修改了节点的 `Next` 指针。当我们在循环中检查 `cur != end.Next` 这个条件时，由于 `end` 是链表中的一个节点，其 `Next` 指针可能在循环过程中被修改，导致循环终止条件不符合预期。

### 修复版本

修复后的代码版本：

```go
func reverseKGroup(head *ListNode, k int) *ListNode {
	if head == nil || head.Next == nil || k == 1 {
		return head
	}

	dummyHead := &ListNode{
		Next: head,
	}

	first := dummyHead

	var prev, end *ListNode
	cur := dummyHead.Next

	for {
		end = first
		for i := 0; i < k; i++ {
			end = end.Next
			if end == nil {
				break
			}
		}
		if end == nil {
			break
		}
		tmp := first.Next
		cur = tmp.Next
		prev = tmp
		afterEnd := end.Next
		for cur != nil && cur != afterEnd {
			tmp2 := cur.Next
			cur.Next = prev
			prev = cur
			cur = tmp2
		}
		first.Next = end
		tmp.Next = cur

		first = tmp
	}

	return dummyHead.Next
}
```

**修复点**: 通过在开始翻转前保存 `end.Next` 到 `afterEnd` 变量，我们确保了循环的终止条件不会受到链表结构变化的影响。这样，即使在翻转过程中修改了节点间的连接关系，我们仍然能正确地确定何时停止翻转当前组的节点。

### 优化版本

虽然修复后的代码能够正确工作，但我们可以进一步优化代码，使其逻辑更清晰：

```go
func reverseKGroup(head *ListNode, k int) *ListNode {
	// 处理特殊情况
	if head == nil || head.Next == nil || k == 1 {
		return head
	}

	// 创建虚拟头节点简化边界处理
	dummy := &ListNode{Next: head}
	
	// groupPrev 指向当前待翻转组的前一个节点
	groupPrev := dummy
	
	// 持续处理每组 k 个节点
	for {
		// 1. 检查剩余节点是否有 k 个
		groupEnd := groupPrev
		for i := 0; i < k; i++ {
			groupEnd = groupEnd.Next
			if groupEnd == nil {
				// 剩余节点不足 k 个，不再翻转
				return dummy.Next
			}
		}
		
		// 2. 获取分组的起始和结束位置
		groupStart := groupPrev.Next
		groupNext := groupEnd.Next
		
		// 3. 翻转 k 个节点
		prev := groupNext  // 翻转后尾节点指向的位置
		curr := groupStart
		
		// 经典链表翻转算法
		for curr != groupNext {
			next := curr.Next
			curr.Next = prev
			prev = curr
			curr = next
		}
		
		// 4. 连接翻转后的组与之前的链表
		groupPrev.Next = groupEnd  // 前一个节点连接到翻转后的头
		groupStart.Next = groupNext  // 翻转后的尾连接到下一组的开始
		
		// 5. 更新 groupPrev 为下一组的前节点
		groupPrev = groupStart
	}
}
```

在这个优化版本中：
1. 使用了更有描述性的变量名（如 `groupStart`, `groupEnd`, `groupNext`, `groupPrev`）
2. 添加了清晰的注释，解释每个步骤的目的
3. 简化了链表翻转的实现，使用标准的三指针翻转方法
4. 分离了不同的逻辑部分，使代码更易理解
5. 直接返回 `dummy.Next` 而不是使用 `break` 和额外的控制变量

## 复杂度分析

- **时间复杂度**: O(n)，其中 n 是链表的长度。虽然有嵌套循环，但每个节点最多被访问两次。
- **空间复杂度**: O(1)，只使用了常数个额外变量，没有使用额外的数据结构。

## 关键要点

1. **链表修改的注意点**: 在修改链表结构时，需要特别注意那些依赖于链表当前结构的条件判断。在本例中，我们学到了在开始修改前保存关键节点引用的重要性。

2. **变量命名的重要性**: 优化版代码通过使用更有描述性的变量名，极大地提高了代码的可读性，使人更容易理解算法的逻辑。

3. **分组处理的思想**: 这种按组处理的思想在很多链表和数组问题中都很有用，可以将一个复杂问题分解为处理单个组和组之间连接的子问题。

这个问题是链表操作的典型例子，掌握了这里的翻转技巧，可以应用到很多其他的链表问题中，如链表的部分翻转、两两交换节点等。 