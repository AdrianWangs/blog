---
title: "LeetCode 24 - 两两交换链表中的节点 (Swap Nodes in Pairs)"
date: 2025-04-24 17:30:40
categories:
  - 算法刷题
  - LeetCode
tags:
  - 链表
  - 递归
  - 迭代
  - Medium
  - LeetCode
---

## Problem Description

给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

### 示例

**示例 1:**
```
输入：head = [1,2,3,4]
输出：[2,1,4,3]
```

**示例 2:**
```
输入：head = []
输出：[]
```

**示例 3:**
```
输入：head = [1]
输出：[1]
```

### 约束条件
- 链表中节点的数目在范围 [0, 100] 内
- 0 <= Node.val <= 100

## Solution Approach

这是一个典型的链表操作问题，我们需要两两交换相邻节点。有两种常见的解决方法：迭代法和递归法。

### 迭代法

迭代法的核心思想是使用三个指针来完成相邻节点的交换。我们需要：
1. 一个哑节点（dummy node）作为新链表的起点
2. 一个前置指针（prev）指向已处理部分的最后一个节点
3. 一个当前指针（curr）指向待处理的第一个节点

**关键步骤**:
1. 创建一个哑节点指向原链表头
2. 初始化 prev 为哑节点，curr 为链表头
3. 当 curr 和 curr.next 都非空时进行交换：
   - 临时保存 curr.next.next
   - 调整指针完成交换
   - 移动 prev 和 curr 指针继续处理下一对节点
4. 返回哑节点的下一个节点作为新链表的头节点

以示例 1 为例，交换过程可视化：
```
dummy -> 1 -> 2 -> 3 -> 4
prev    curr

交换后
dummy -> 2 -> 1 -> 3 -> 4
          |    |
          |    curr (新的 curr)
          |
          prev (新的 prev)

继续交换
dummy -> 2 -> 1 -> 4 -> 3
                     |
                     curr=nil (结束)
```

## Code Implementation

### 1. 迭代解法

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func swapPairs(head *ListNode) *ListNode {
    // 处理边界情况：空链表或只有一个节点
    if head == nil || head.Next == nil {
        return head
    }
    
    // 创建哑节点指向链表头
    dummyHead := &ListNode{
        Next: head,
    }
    
    // 初始化指针
    prev, curr := dummyHead, head
    
    // 当有一对节点可交换时进行交换
    for curr != nil && curr.Next != nil {
        // 保存下一对节点的起始位置
        nextPair := curr.Next.Next
        
        // 交换当前一对节点
        // 1->2->3->4 变为 2->1->3->4
        second := curr.Next     // second = 2
        second.Next = curr      // 2->1
        curr.Next = nextPair    // 1->3
        prev.Next = second      // dummy->2
        
        // 移动指针，准备处理下一对节点
        prev = curr             // prev = 1
        curr = nextPair         // curr = 3
    }
    
    return dummyHead.Next
}
```

### 2. 递归解法

递归法更简洁，但需要理解递归思想：

```go
func swapPairs(head *ListNode) *ListNode {
    // 基本情况：空链表或只有一个节点
    if head == nil || head.Next == nil {
        return head
    }
    
    // 保存第二个节点
    second := head.Next
    
    // 递归处理剩余部分，从第三个节点开始
    head.Next = swapPairs(second.Next)
    
    // 交换前两个节点
    second.Next = head
    
    // 返回新的头节点（原来的第二个节点）
    return second
}
```

## Complexity Analysis

### 迭代法
- **时间复杂度**: O(n)，其中 n 是链表的长度。我们需要遍历一次链表，每次处理两个节点。
- **空间复杂度**: O(1)，只使用了常数个额外变量。

### 递归法
- **时间复杂度**: O(n)，同样需要处理每个节点一次。
- **空间复杂度**: O(n/2) ≈ O(n)，递归栈的深度为链表长度的一半（每次递归处理两个节点）。

## 方法比较

| 方面 | 迭代法 | 递归法 |
| ---- | ---- | ---- |
| 时间复杂度 | O(n) | O(n) |
| 空间复杂度 | O(1) | O(n) |
| 代码复杂度 | 中等 | 简洁 |
| 优点 | 节省空间 | 代码简洁易懂 |
| 缺点 | 需要处理多个指针 | 大链表可能导致栈溢出 |
| 推荐度 | ★★★★☆ | ★★★★★ |

## Key Learnings

1. **链表操作的关键在于指针管理**：在处理链表时，合理使用指针变量可以极大简化操作。
   
2. **哑节点（Dummy Node）的使用**：在许多链表问题中，使用哑节点可以统一操作，避免处理头节点的特殊情况。
   
3. **迭代vs递归**：链表问题通常可以用这两种方法解决。递归往往代码更简洁，但空间复杂度更高。

4. **画图辅助理解**：对于复杂的链表操作，画出节点和指针的变化过程有助于理解和调试。

这个问题是链表操作的基础练习，掌握它对理解更复杂的链表问题很有帮助。 