---
title: LeetCode 230 - 二叉搜索树中第K小的元素（Kth Smallest Element in a BST）
date: 2025-04-29 19:34:00
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 二叉树
- 二叉搜索树
- 深度优先搜索
- 递归
- Medium
- LeetCode
- Hot100
---
## 问题描述

给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 小的元素（从 1 开始计数）。

**示例 1:**

```
输入：root = [3,1,4,null,2], k = 1
输出：1
```

**示例 2:**

```
输入：root = [5,3,6,2,4,null,null,1], k = 3
输出：3
```

**提示：**

- 树中的节点数为 n 。
- 1 <= k <= n <= 10^4
- 0 <= Node.val <= 10^4

**进阶：** 如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 k 小的值，你将如何优化算法？

## 解题思路

这道题要求我们找到二叉搜索树中第 k 小的元素，有几种不同的方法可以解决。

### 方法一：中序遍历（递归法）

二叉搜索树的一个重要特性是：**中序遍历的结果是按照节点值从小到大排列的**。利用这个特性，我们可以通过中序遍历得到树中所有元素的有序序列，然后取第 k 个元素即可。

具体步骤：

1. 对树进行中序遍历（左 → 根 → 右）
2. 使用计数器记录当前访问的是第几个节点
3. 当计数器等于 k 时，返回当前节点的值

这种方法的关键在于理解二叉搜索树的中序遍历性质，以及如何在遍历过程中及时停止以提高效率。

### 方法二：中序遍历（迭代法）

上述递归方法也可以用迭代的方式实现，使用栈来模拟递归过程。这种方法在某些情况下可能更高效，特别是当 k 很小而树很大时。

### 方法三：计数优化（针对进阶问题）

对于进阶问题，我们需要考虑如何在频繁修改的情况下高效查找第 k 小的元素。一种优化方法是在每个节点中维护额外信息：**以该节点为根的子树中节点的数量**。这样可以在 O(log n) 的时间复杂度内找到第 k 小的元素。

## 实现细节

### 方法一：中序遍历（递归法）

递归解法的核心思想是按顺序访问节点并计数：

1. 先遍历左子树
2. 递增计数器，检查是否达到 k
3. 如果达到 k，返回当前节点值
4. 否则继续遍历右子树

这种方法的实现简洁，且能在找到目标后立即返回，不需要遍历整棵树。

### 方法二：中序遍历（迭代法）

迭代解法使用栈来模拟递归过程：

1. 使用栈记录遍历路径
2. 不断将左子节点入栈，直到没有左子节点
3. 弹出栈顶节点，递增计数器
4. 检查计数器是否等于 k，是则返回当前节点值
5. 处理右子节点

### 方法三：节点计数优化

对于进阶问题的解决方案：

1. 扩展树节点结构，添加 count 字段表示左子树节点数量
2. 插入/删除节点时更新 count 值
3. 查找第 k 小元素时，根据 count 值决定向左还是向右子树移动

## 代码实现

### 方法一：中序遍历（递归法）

```go
func kthSmallest(root *TreeNode, k int) int {
    cnt := 0
    return dfsKthSmallest(root, k, &cnt)
}

func dfsKthSmallest(node *TreeNode, k int, cnt *int) int {
    if node == nil {
        return -1
    }
  
    // 先遍历左子树
    leftRes := dfsKthSmallest(node.Left, k, cnt)
    if leftRes != -1 {
        return leftRes
    }
  
    // 访问当前节点
    *cnt++
    if *cnt == k {
        return node.Val
    }
  
    // 遍历右子树
    return dfsKthSmallest(node.Right, k, cnt)
}
```

### 方法二：中序遍历（迭代法）

```go
func kthSmallest(root *TreeNode, k int) int {
    stack := []*TreeNode{}
    curr := root
    count := 0
  
    for curr != nil || len(stack) > 0 {
        // 将所有左子节点入栈
        for curr != nil {
            stack = append(stack, curr)
            curr = curr.Left
        }
      
        // 弹出栈顶节点
        curr = stack[len(stack)-1]
        stack = stack[:len(stack)-1]
      
        // 计数
        count++
        if count == k {
            return curr.Val
        }
      
        // 处理右子节点
        curr = curr.Right
    }
  
    return -1
}
```

### 方法三：节点计数优化（进阶问题的解决方案）

为了解决进阶问题，我们可以设计一个增强版的二叉搜索树：

```go
// 增强的树节点结构
type EnhancedTreeNode struct {
    Val       int
    Left      *EnhancedTreeNode
    Right     *EnhancedTreeNode
    LeftCount int  // 左子树节点数量
}

// 插入节点
func insert(root *EnhancedTreeNode, val int) *EnhancedTreeNode {
    if root == nil {
        return &EnhancedTreeNode{Val: val}
    }
  
    if val < root.Val {
        root.Left = insert(root.Left, val)
        root.LeftCount++
    } else {
        root.Right = insert(root.Right, val)
    }
  
    return root
}

// 查找第k小的元素
func findKthSmallest(root *EnhancedTreeNode, k int) int {
    if root == nil {
        return -1
    }
  
    // 当前节点的排名 = 左子树节点数 + 1
    leftSize := root.LeftCount
  
    if k == leftSize + 1 {
        return root.Val
    } else if k <= leftSize {
        // 第k小的元素在左子树中
        return findKthSmallest(root.Left, k)
    } else {
        // 第k小的元素在右子树中，需要调整k值
        return findKthSmallest(root.Right, k - leftSize - 1)
    }
}
```

## 方法比较

| 方面       | 中序遍历（递归）       | 中序遍历（迭代）   | 节点计数优化                 |
| ---------- | ---------------------- | ------------------ | ---------------------------- |
| 时间复杂度 | O(n)                   | O(n)               | O(log n)                     |
| 空间复杂度 | O(h)                   | O(h)               | O(h)                         |
| 优点       | 实现简单直观           | 避免递归栈溢出风险 | 频繁查询时效率高             |
| 缺点       | 递归层数深时可能栈溢出 | 代码稍复杂         | 需要修改节点结构，维护成本高 |
| 适用场景   | 一般查询场景           | 树较深时的查询     | 频繁修改和查询               |
| 推荐度     | ★★★★☆             | ★★★★☆         | ★★★★★（针对进阶问题）   |

## 复杂度分析

### 方法一和方法二（中序遍历）：

- **时间复杂度**：O(n)，最坏情况下需要遍历整棵树，但平均情况下为 O(h + k)，其中 h 是树的高度。
- **空间复杂度**：O(h)，h 是树的高度，递归调用栈或迭代方法中的栈空间。

### 方法三（节点计数优化）：

- **时间复杂度**：
  - 查询：O(log n)，每次查询只需要遍历一条从根到叶的路径。
  - 插入/删除：O(log n)，同时需要更新路径上节点的计数。
- **空间复杂度**：O(h)，h 是树的高度。

## 关键收获

1. **利用二叉搜索树的特性**：中序遍历二叉搜索树可以得到有序序列，这是解决许多二叉搜索树问题的关键。
2. **数据结构增强**：通过在节点中存储额外信息（如子树节点数量），可以显著优化特定操作的性能。这是解决进阶问题的常用技巧。
3. **权衡取舍**：方法三通过增加存储空间和维护成本，换取查询时间的优化，这在频繁操作的场景下是值得的。
4. **递归与迭代**：同一算法既可以用递归实现，也可以用迭代实现，不同场景下可能有不同的优势。

相关问题：

- LeetCode 98: 验证二叉搜索树
- LeetCode 173: 二叉搜索树迭代器
- LeetCode 235: 二叉搜索树的最近公共祖先
