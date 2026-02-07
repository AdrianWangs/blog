---
title: LeetCode 148 - 排序链表（Sort List）
date: 2025-07-03 10:30:00
categories:
- 算法刷题
- LeetCode
- 链表
tags:
- 链表
- 归并排序
- 排序
- Medium
- Hot100
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

## 错误分析与总结

在尝试实现自底向上归并排序时，我遇到了几个典型的链表操作边界问题。以下是我的错误代码和具体分析，希望能帮助我（以及他人）避免重蹈覆辙。

### 初始错误代码

```go
func sortList(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	dummyHead := &ListNode{}
	dummyHead.Next = head
	length := 0
	cur := head
	for cur != nil {
		cur = cur.Next
		length++
	}

	for k := 1; k < length; k <<= 1 {
		prev, cur := dummyHead, dummyHead.Next
		for cur != nil {
			head1 := cur
			// 这里应该是1开始
			for i := 0; i < k && cur.Next != nil; i++ {
				cur = cur.Next
			}
			head2 := cur.Next
			cur.Next = nil

			// 可能会带来cur = nil
			cur = head2

			for i := 0; i < k && cur != nil && cur.Next != nil; i++ {
				cur = cur.Next
			}

			var next *ListNode
			if cur != nil {
				next = cur.Next
				cur.Next = nil
			}

			prev.Next = mergeSorted(head1, head2)

			for prev.Next != nil {
				prev = prev.Next
			}
			// 这里没必要加，因为后面的处理完自然会加上
			prev.Next = next
			cur = next
		}
	}
	return dummyHead.Next
}

func mergeSorted(head1, head2 *ListNode) *ListNode {
	dummyHead := &ListNode{}
	cur := dummyHead
	for head1 != nil && head2 != nil {
		if head1.Val < head2.Val {
			cur.Next = head1
			head1 = head1.Next
		} else {
			cur.Next = head2
			head2 = head2.Next
		}
		cur = cur.Next
	}
	if head1 != nil {
		cur.Next = head1
	} else {
		cur.Next = head2
	}
	return dummyHead.Next
}
```

### 错误点分析

我在代码注释中标记了几个疑点，经过分析，主要有两个核心错误：

#### 1. 子链表切分错误

**问题所在**：
```go
// ...
head1 := cur
// 这里应该是1开始
for i := 0; i < k && cur.Next != nil; i++ {
    cur = cur.Next
}
head2 := cur.Next
cur.Next = nil
// ...
```
用于切分长度为 `k` 的子链表的循环 `for i := 0; i < k && ...` 执行了 `k` 次，这使得 `cur` 指针前进了 `k` 步。正确的做法是，从 `head1` 开始，指针需要前进 `k-1` 步才能到达长度为 `k` 的子链表的尾部。

**原因分析**：
当子链表长度为 `k` 时，我们需要找到第 `k` 个节点作为尾部。如果 `cur` 初始指向第 1 个节点，那么前进 `k-1` 步后，`cur` 会指向第 `k` 个节点。而 `for i := 0; i < k` 这个循环会执行 `k` 次，导致 `cur` 指向了第 `k+1` 个节点，这是不正确的。例如，当 `k=1` 时，循环会执行一次，`cur` 前进了一步，导致切分出的 `head1` 包含了两个节点，而我们期望的是一个节点。

**正确实现**：
循环应该从 `1` 开始，到 `k` 结束（不包括 `k`），即循环 `k-1` 次。
```go
// 正确的切分逻辑
curr := head1
for i := 1; i < k && curr != nil && curr.Next != nil; i++ {
    curr = curr.Next
}
// 此时 curr 是第一个子链表的尾节点
head2 := curr.Next
curr.Next = nil // 断开
```

#### 2. 对链表连接方式的误解

**问题所在**：
```go
//...
for prev.Next != nil {
    prev = prev.Next
}
// 我曾认为这里没必要加，因为后面的处理完自然会加上
prev.Next = next
cur = next
```
我曾认为 `prev.Next = next` 这一行是多余的，理由是在下一次循环中，`prev.Next` 会被 `mergeSorted` 的结果自然覆盖。

**原因分析**：
这个想法是错误的。在 `for cur != nil` 的整个循环过程中，我们需要维护一个指向 **已排序部分尾部** 的指针 `prev`，并将后续处理好的片段依次连接到它后面。

我写的 `prev.Next = next` 这行代码本身是一种有效的连接方式，它确保在处理下一对子链表 *之前*，将刚合并完的链表与后面还未处理的链表部分先连接起来，从而保证链表的完整性。我的错误在于，我误以为这行代码是多余的，如果将其删除，那么在处理完最后一对子链表后，如果原始链表长度不是2的幂，剩余的尾部 `next` 就会丢失。

**正确逻辑**：
正确的做法是在 `for cur != nil` 循环中，始终维护 `prev` 作为已处理部分的尾巴。
1.  `prev.Next = mergedList` 将新合并的链表接在 `prev` 后面。
2.  然后 `prev` 自身前进到新合并链表的尾部（`while (prev.Next != nil) { prev = prev.Next; }`）。
3.  `cur` 更新为 `next`，开始下一对子链表的处理。
在下一次循环中，`prev.Next = mergedList` 会再次将新的合并结果连接到更新后的 `prev` 之后，从而将所有部分串联起来。我的代码实现了类似的效果，但我的注释却反映了我对这个关键连接步骤的误解。

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