---
title: "LeetCode 148 - 排序链表（Sort List）"
date: 2025-04-26 10:30:00
categories:
  - 算法刷题
  - LeetCode
tags:
  - 链表
  - 归并排序
  - 排序
  - Medium
---

## 问题描述

给你链表的头结点 `head`，请将其按 **升序** 排列并返回 **排序后的链表**。

### 示例

**示例 1：**
```
输入：head = [4,2,1,3]
输出：[1,2,3,4]
```

**示例 2：**
```
输入：head = [-1,5,3,4,0]
输出：[-1,0,3,4,5]
```

**示例 3：**
```
输入：head = []
输出：[]
```

### 提示

- 链表中节点的数目在范围 `[0, 5 * 10^4]` 内
- `-10^5 <= Node.val <= 10^5`

### 进阶

你可以在 `O(n log n)` 时间复杂度和常数级空间复杂度下，对链表进行排序吗？

## 解题思路

要排序链表，最直观的方法是先转换成数组，排序后再转回链表。但是这种方法需要 O(n) 的额外空间。如果要满足进阶要求，我们需要使用对链表友好的归并排序。

对于链表排序，可以考虑两种归并排序实现方式：
1. **自顶向下**：递归实现，空间复杂度为 O(log n)
2. **自底向上**：迭代实现，空间复杂度为 O(1)

### 方法一：自底向上归并排序

自底向上的归并排序是一种非递归的归并排序，它的基本思想是：

1. 先将链表拆分成长度为 1 的多个子链表
2. 然后两两合并成长度为 2 的子链表
3. 再两两合并成长度为 4 的子链表
4. 以此类推，直到整个链表排序完成

这种方法的空间复杂度是 O(1)，满足进阶要求。

## 代码实现（优化版）

```go
/**
 * Definition for singly-linked list.
 * type ListNode struct {
 *     Val int
 *     Next *ListNode
 * }
 */
func sortList(head *ListNode) *ListNode {
    // 处理空链表或单节点链表
    if head == nil || head.Next == nil {
        return head
    }
    
    // 计算链表长度
    length := getLength(head)
    
    // 创建哑节点，简化边界情况处理
    dummy := &ListNode{Next: head}
    
    // 自底向上归并排序
    // 每次迭代子链表长度乘以2（1->2->4->8...）
    for subLength := 1; subLength < length; subLength <<= 1 {
        prev, curr := dummy, dummy.Next
        
        // 每轮迭代处理整个链表
        for curr != nil {
            // 第一个子链表的头节点
            head1 := curr
            
            // 切割第一个子链表
            for i := 1; i < subLength && curr != nil && curr.Next != nil; i++ {
                curr = curr.Next
            }
            
            // 第二个子链表的头节点
            head2 := curr.Next
            curr.Next = nil // 断开第一个子链表
            curr = head2
            
            // 切割第二个子链表
            for i := 1; i < subLength && curr != nil && curr.Next != nil; i++ {
                curr = curr.Next
            }
            
            // 记录下一次要处理的节点
            var next *ListNode = nil
            if curr != nil {
                next = curr.Next
                curr.Next = nil // 断开第二个子链表
            }
            
            // 合并两个子链表
            merged := mergeTwoLists(head1, head2)
            prev.Next = merged
            
            // 移动prev到合并后链表的末尾
            for prev.Next != nil {
                prev = prev.Next
            }
            
            // 处理下一对子链表
            curr = next
        }
    }
    
    return dummy.Next
}

// 获取链表长度
func getLength(head *ListNode) int {
    length := 0
    for node := head; node != nil; node = node.Next {
        length++
    }
    return length
}

// 合并两个有序链表
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    curr := dummy
    
    for l1 != nil && l2 != nil {
        if l1.Val < l2.Val {
            curr.Next = l1
            l1 = l1.Next
        } else {
            curr.Next = l2
            l2 = l2.Next
        }
        curr = curr.Next
    }
    
    // 连接剩余部分
    if l1 != nil {
        curr.Next = l1
    } else {
        curr.Next = l2
    }
    
    return dummy.Next
}
```

### 方法二：自顶向下归并排序

自顶向下的归并排序是一种递归实现，它的基本思想是：

1. 使用快慢指针找到链表中点，将链表分为两半
2. 递归排序两个子链表
3. 合并两个排序后的子链表

这种方法的空间复杂度是 O(log n)，因为递归栈的深度是 log n。

```go
func sortList(head *ListNode) *ListNode {
    // 递归终止条件
    if head == nil || head.Next == nil {
        return head
    }
    
    // 使用快慢指针找到链表中点
    slow, fast := head, head.Next
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }
    
    // 切分链表
    mid := slow.Next
    slow.Next = nil
    
    // 递归排序两个子链表
    left := sortList(head)
    right := sortList(mid)
    
    // 合并排序后的子链表
    return mergeTwoLists(left, right)
}

// 合并两个有序链表
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    curr := dummy
    
    for l1 != nil && l2 != nil {
        if l1.Val < l2.Val {
            curr.Next = l1
            l1 = l1.Next
        } else {
            curr.Next = l2
            l2 = l2.Next
        }
        curr = curr.Next
    }
    
    // 连接剩余部分
    if l1 != nil {
        curr.Next = l1
    } else {
        curr.Next = l2
    }
    
    return dummy.Next
}
```

## 方法比较

| 方面 | 自底向上（迭代） | 自顶向下（递归） |
| ---- | ---- | ----- |
| 时间复杂度 | O(n log n) | O(n log n) |
| 空间复杂度 | O(1) | O(log n) |
| 优点 | 常数空间复杂度 | 代码简洁易懂 |
| 缺点 | 实现较复杂 | 需要额外的递归栈空间 |
| 推荐度 | ★★★★★ | ★★★★☆ |

## 复杂度分析

- **时间复杂度**：O(n log n)
  - 归并排序的时间复杂度是 O(n log n)
  - 每次合并操作的时间复杂度是 O(n)，总共需要进行 log n 次合并

- **空间复杂度**：
  - 自底向上方法：O(1)，只需要常数级的额外空间
  - 自顶向下方法：O(log n)，因为递归调用栈的深度是 log n

## 关键学习点

1. **链表归并排序的实现**：学习如何对链表而非数组应用归并排序
2. **自底向上与自顶向下对比**：理解两种归并排序实现方式的区别
3. **链表操作技巧**：
   - 使用哑节点（dummy node）简化头节点处理
   - 使用快慢指针找链表中点
   - 链表的切分与合并技巧

排序链表是一道很好的练习题，它不仅考察了链表操作，还考察了排序算法的实现。通过这道题，我们可以学习如何在链表这种线性数据结构上实现高效的排序算法。 