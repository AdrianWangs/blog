---
title: "LeetCode 2 - 两数相加（Add Two Numbers）"
date: 2025-04-23 15:02:33
categories:
  - 算法刷题
  - LeetCode
tags:
  - 链表
  - Medium
---
## 问题描述

给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

### 示例 1：

```
输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.
```

### 示例 2：

```
输入：l1 = [0], l2 = [0]
输出：[0]
```

### 示例 3：

```
输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
输出：[8,9,9,9,0,0,0,1]
```

### 提示：

- 每个链表中的节点数在范围 [1, 100] 内
- 0 <= Node.val <= 9
- 题目数据保证列表表示的数字不含前导零

## 解题思路

这道题考察的是链表操作和数字加法。由于两个链表已经是逆序存储，与我们正常从低位到高位进行加法计算的顺序相同，所以可以直接对两个链表进行遍历并相加。主要需要处理的点是：

1. 两个数字相加可能产生进位
2. 两个链表可能长度不同
3. 最高位相加后可能还有进位，需要额外增加一个节点

解题的核心思想是**模拟加法运算的过程**，按位相加并处理进位。

## 初始实现分析（有待优化的代码）

下面是一个可以通过但有待优化的实现：

```go
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	oneFlag := false
	res := &ListNode{}
	var prev *ListNode
	cur := res

	for l1 != nil && l2 != nil {
		tmp := l1.Val + l2.Val
		if oneFlag {
			tmp += 1
		}
		cur.Val = tmp % 10
		if tmp >= 10 {
			oneFlag = true
		} else {
			oneFlag = false
		}
		cur.Next = &ListNode{}
		prev = cur
		cur = cur.Next
		l1 = l1.Next
		l2 = l2.Next
	}

	for l1 != nil {
		tmp := l1.Val
		if oneFlag {
			tmp += 1
		}
		cur.Val = tmp % 10
		if tmp >= 10 {
			oneFlag = true
		} else {
			oneFlag = false
		}
		cur.Next = &ListNode{}
		prev = cur
		cur = cur.Next
		l1 = l1.Next
	}

	for l2 != nil {
		tmp := l2.Val
		if oneFlag {
			tmp += 1
		}
		cur.Val = tmp % 10
		if tmp >= 10 {
			oneFlag = true
		} else {
			oneFlag = false
		}
		cur.Next = &ListNode{}
		prev = cur
		cur = cur.Next
		l2 = l2.Next
	}

	if oneFlag {
		cur.Val = 1
		prev = cur
	}
	prev.Next = nil
	return res
}
```

### 存在的问题

这段代码虽然可以解决问题，但存在以下几个问题：

1. **代码冗余**：有三个几乎相同的循环，处理逻辑重复
2. **效率不高**：每次循环都创建了新节点，包括可能无用的节点
3. **可读性差**：变量名不够直观（如 `oneFlag` 表示进位）
4. **代码结构**：循环后的收尾处理逻辑不够清晰

## 优化实现

我们可以通过以下几点优化代码：

1. 合并重复的三个循环，使用一个循环处理所有情况
2. 使用更清晰的变量名（如 `carry` 代替 `oneFlag`）
3. 只在确实需要新节点时才创建
4. 简化进位的处理逻辑

### 优化后的代码

```go
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	// 创建虚拟头节点，简化操作
	dummy := &ListNode{}
	current := dummy
	carry := 0

	// 只要有一个链表还有节点或者有进位，就继续循环
	for l1 != nil || l2 != nil || carry > 0 {
		sum := carry

		// 添加当前节点的值（如果存在）
		if l1 != nil {
			sum += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			sum += l2.Val
			l2 = l2.Next
		}

		// 计算进位和当前位的值
		carry = sum / 10
		current.Next = &ListNode{Val: sum % 10}
		current = current.Next
	}

	return dummy.Next
}
```

### 优化说明

1. **使用虚拟头节点（dummy head）**：通过创建一个虚拟头节点，我们可以简化链表操作，避免处理头节点为空的特殊情况。
2. **合并循环**：将三个循环合并为一个循环，只要有一个链表还有节点或者有进位，就继续循环。
3. **改进变量命名**：使用 `carry` 代替 `oneFlag`，使代码更易理解。
4. **按需创建节点**：只在确实需要添加新节点时才创建，而不是提前创建可能无用的节点。
5. **简化进位计算**：使用 `sum / 10` 计算进位，`sum % 10` 计算当前位的值，代码更简洁清晰。

## 复杂度分析

- **时间复杂度**：O(max(n, m))，其中 n 和 m 分别是两个链表的长度。我们需要遍历两个链表的全部位置，而处理每个位置只需要 O(1) 的时间。
- **空间复杂度**：O(max(n, m))，新链表的长度最多为 max(n, m) + 1（当有进位时）。不考虑返回值所占用的空间，空间复杂度为 O(1)。

## 优化前后对比

| 方面       | 优化前           | 优化后       |
| ---------- | ---------------- | ------------ |
| 代码行数   | ~50 行           | ~20 行       |
| 循环次数   | 3个循环          | 1个循环      |
| 可读性     | 较差             | 良好         |
| 变量命名   | 不直观           | 清晰明了     |
| 节点创建   | 可能创建无用节点 | 按需创建     |
| 时间复杂度 | O(max(n, m))     | O(max(n, m)) |
| 空间复杂度 | O(max(n, m))     | O(max(n, m)) |

## 学习要点

1. **代码简化**：通过合并相似的逻辑，可以大幅减少代码量，提高可读性。
2. **虚拟头节点技巧**：在处理链表问题时，使用虚拟头节点可以简化边界情况的处理。
3. **条件合并**：将多个条件合并到一个循环中，使代码更加简洁。
4. **变量命名**：使用清晰的变量名可以提高代码可读性，如使用 `carry` 表示进位。
5. **按需分配内存**：只在必要时创建新的节点，避免无用的内存分配和释放。

这种链表加法的模式在处理大数加法等问题时也很常见，掌握这种模式对解决类似问题很有帮助。
