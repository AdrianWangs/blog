---
title: "LeetCode 234 - 回文链表（Palindrome Linked List）"
date: 2025-04-21 18:16:22
categories:
  - 算法刷题
tags:
  - 链表
  - 双指针
  - LeetCode
  - Easy
---

## Problem Description

给你一个单链表的头节点 `head`，请你判断该链表是否为回文链表。如果是，返回 `true`；否则，返回 `false`。

回文链表指的是从前往后读和从后往前读是一样的链表。例如，`1->2->2->1` 是回文链表，而 `1->2` 不是回文链表。

### Examples

**示例 1：**
```
输入：head = [1,2,2,1]
输出：true
```

可视化表示:
```
1 -> 2 -> 2 -> 1
```

**示例 2：**
```
输入：head = [1,2]
输出：false
```

可视化表示:
```
1 -> 2
```

### Constraints

- 链表中节点数目在范围 [1, 10^5] 内
- 0 <= Node.val <= 9

**进阶**：你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？

## Solution Approach

对于回文链表的判断，我们需要考虑几个关键点：

1. 链表不能像数组那样随机访问，无法直接从两端同时向中间比较
2. 直观思路是将链表转为数组，但这需要 O(n) 额外空间
3. 最优解法需要找到链表中点，反转后半部分，然后比较两半部分

以下我会介绍多种解决此问题的方法，从简单到优化逐步讲解。

### 方法一：转换为数组

最直观的方法是将链表节点值复制到数组中，然后使用双指针判断数组是否回文。

#### 实现细节

1. 遍历链表，将所有节点值存入数组
2. 使用双指针从数组两端向中间移动并比较

#### 代码实现

```go
func isPalindrome(head *ListNode) bool {
    // 将链表值复制到数组
    vals := []int{}
    for node := head; node != nil; node = node.Next {
        vals = append(vals, node.Val)
    }
    
    // 使用双指针判断数组是否回文
    for i, j := 0, len(vals)-1; i < j; i, j = i+1, j-1 {
        if vals[i] != vals[j] {
            return false
        }
    }
    return true
}
```

### 方法二：使用栈

利用栈的特性，我们可以先将前半部分节点值入栈，然后与后半部分比较。

#### 实现细节

1. 使用快慢指针找到链表中点
2. 将前半部分节点值入栈
3. 比较栈中元素与后半部分节点值

#### 代码实现

```go
func isPalindrome(head *ListNode) bool {
    if head == nil || head.Next == nil {
        return true
    }
    
    // 快慢指针找中点
    slow, fast := head, head
    stack := []int{}
    
    // 将前半部分入栈
    for fast != nil && fast.Next != nil {
        stack = append(stack, slow.Val)
        slow = slow.Next
        fast = fast.Next.Next
    }
    
    // 如果链表长度为奇数，跳过中间节点
    if fast != nil {
        slow = slow.Next
    }
    
    // 比较栈顶元素与后半部分
    for slow != nil {
        if len(stack) == 0 || stack[len(stack)-1] != slow.Val {
            return false
        }
        stack = stack[:len(stack)-1]
        slow = slow.Next
    }
    
    return true
}
```

### 方法三：原地反转（原始实现）

这是用户提供的原始解法，使用 O(n) 时间和 O(1) 空间。

#### 实现细节

1. 使用快慢指针找到链表中点
2. 反转后半部分链表
3. 比较前半部分和反转后的后半部分

#### 代码实现（原始版本）

```go
func isPalindrome(head *ListNode) bool {
    if head == nil {
        return true
    }

    fast, slow := head, head
    for fast.Next != nil {
        fast = fast.Next
        if fast.Next == nil {
            break
        }
        slow = slow.Next
        fast = fast.Next
    }

    head2 := slow.Next
    slow.Next = nil
    head2 = reverseListTmp(head2)

    cur1, cur2 := head, head2
    for cur2 != nil {
        if cur1.Val != cur2.Val {
            return false
        }
        cur1 = cur1.Next
        cur2 = cur2.Next
    }

    return true
}

func reverseListTmp(head *ListNode) *ListNode {
    if head == nil || head.Next == nil {
        return head
    }

    var cur, prev *ListNode
    cur = head
    for cur != nil {
        tmp := cur.Next
        cur.Next = prev
        prev = cur
        cur = tmp
    }

    return prev
}
```

### 方法四：优化的原地反转（最优解）

在原始实现的基础上，我们可以进行一些优化，使代码更加健壮和易读。

#### 实现细节

1. 更清晰地处理边界情况
2. 简化找中点的逻辑
3. 明确区分奇偶长度链表的处理
4. 模块化功能，提高代码可读性
5. 提供可选的链表恢复功能

#### 代码实现（优化版本）

```go
type ListNode struct {
    Val int
    Next *ListNode
}

func isPalindrome(head *ListNode) bool {
    // 处理边界情况
    if head == nil || head.Next == nil {
        return true
    }

    // 查找链表中点
    fast, slow := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
    }

    // 处理奇数长度链表的情况
    var secondHalf *ListNode
    if fast == nil {
        // 偶数长度
        secondHalf = slow
    } else {
        // 奇数长度，中间节点不参与比较
        secondHalf = slow.Next
    }
    
    // 断开链表
    firstHalfEnd := slow
    if fast == nil {
        firstHalfEnd = findPredecessor(head, slow)
    }
    firstHalfEnd.Next = nil
    
    // 反转后半部分
    secondHalf = reverseList(secondHalf)

    // 比较两半部分
    result := compareHalves(head, secondHalf)
    
    // 可选：恢复链表结构
    // firstHalfEnd.Next = reverseList(secondHalf)
    
    return result
}

// 找到前驱节点
func findPredecessor(head, target *ListNode) *ListNode {
    if head == target {
        return nil
    }
    
    curr := head
    for curr != nil && curr.Next != target {
        curr = curr.Next
    }
    return curr
}

// 比较两个链表
func compareHalves(first, second *ListNode) bool {
    for first != nil && second != nil {
        if first.Val != second.Val {
            return false
        }
        first = first.Next
        second = second.Next
    }
    return true
}

// 反转链表
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    
    return prev
}
```

### 方法五：递归解法

递归方法也可以用来解决此问题，但需要 O(n) 的栈空间。

#### 实现细节

1. 使用递归遍历到链表末尾
2. 回溯时，与前面的节点比较

#### 代码实现

```go
func isPalindrome(head *ListNode) bool {
    frontPointer := head
    
    var recursiveCheck func(*ListNode) bool
    recursiveCheck = func(currentNode *ListNode) bool {
        if currentNode != nil {
            if !recursiveCheck(currentNode.Next) {
                return false
            }
            if frontPointer.Val != currentNode.Val {
                return false
            }
            frontPointer = frontPointer.Next
        }
        return true
    }
    
    return recursiveCheck(head)
}
```

## Comparison of Approaches

| 方面 | 方法一：数组 | 方法二：栈 | 方法三：原始反转 | 方法四：优化反转 | 方法五：递归 |
| ---- | ---- | ---- | ----- | ----- | ----- |
| 时间复杂度 | O(n) | O(n) | O(n) | O(n) | O(n) |
| 空间复杂度 | O(n) | O(n) | O(1) | O(1) | O(n) |
| 优点 | 实现简单 | 直观易懂 | 空间效率高 | 代码健壮，易于理解 | 简洁优雅 |
| 缺点 | 空间开销大 | 空间开销大 | 代码结构不够清晰 | 略微复杂 | 使用了隐式栈空间 |
| 推荐度 | ★★☆☆☆ | ★★☆☆☆ | ★★★★☆ | ★★★★★ | ★★★☆☆ |

## Complexity Analysis

### 时间复杂度

所有方法的时间复杂度都是 O(n)，其中 n 是链表的长度。这是因为所有方法都需要至少遍历一次链表。

### 空间复杂度

- 方法一（数组）：需要 O(n) 额外空间存储数组
- 方法二（栈）：需要 O(n) 额外空间存储栈
- 方法三和方法四（反转）：只需要几个指针变量，空间复杂度为 O(1)
- 方法五（递归）：由于递归调用栈，需要 O(n) 空间

## Key Learnings

1. **快慢指针**：找链表中点的有效技术，对于链表操作很常用
2. **原地反转**：链表反转是一个重要的基本操作，可以不使用额外空间完成
3. **空间与时间权衡**：此题展示了如何通过算法优化将空间复杂度从 O(n) 降至 O(1)
4. **代码模块化**：将复杂功能拆分为多个函数可以提高代码的可读性和可维护性
5. **边界条件处理**：链表操作中需要特别注意空链表、单节点链表等边界条件

在实际应用中，方法四（优化的原地反转）是最推荐的解法，因为它既满足了进阶要求的 O(1) 空间复杂度，又保持了代码的清晰性和健壮性。值得注意的是，如果链表结构在操作后需要保持不变，可以考虑添加链表恢复步骤。 