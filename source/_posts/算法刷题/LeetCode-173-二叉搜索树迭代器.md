---
title: "LeetCode 173 - 二叉搜索树迭代器（Binary Search Tree Iterator）"
date: 2025-06-16 19:43:07
categories:
  - 算法刷题
  - LeetCode
  - 树
tags:
  - 二叉搜索树
  - 栈
  - 迭代器
  - Medium
  - 面试经典150
  - LeetCode
description: "设计二叉搜索树迭代器，实现中序遍历序列的 next() 和 hasNext() 操作，使用栈优化空间复杂度至 O(h)"
---

## 问题描述

实现一个二叉搜索树迭代器类 `BSTIterator`，表示一个按中序遍历二叉搜索树（BST）的迭代器：

- `BSTIterator(TreeNode root)` 初始化 `BSTIterator` 类的一个对象。BST 的根节点 root 会作为构造函数的一部分给出。指针应初始化为一个不存在于 BST 中的数字，且该数字小于 BST 中的任何元素。
- `boolean hasNext()` 如果向指针右侧遍历存在数字，则返回 `true`；否则返回 `false`。
- `int next()` 将指针向右移动，然后返回指针处的数字。

注意，指针初始化为一个不存在于 BST 中的数字，所以对 `next()` 的首次调用将返回 BST 中的最小元素。

你可以假设 `next()` 调用总是有效的，也就是说，当调用 `next()` 时，BST 的中序遍历中至少存在一个下一个数字。

**示例 1：**

```
输入
["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"]
[[[7, 3, 15, null, null, 9, 20]], [], [], [], [], [], [], [], [], []]
输出
[null, 3, 7, true, 9, true, 15, true, 20, false]

解释
BSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);
bSTIterator.next();    // 返回 3
bSTIterator.next();    // 返回 7
bSTIterator.hasNext(); // 返回 True
bSTIterator.next();    // 返回 9
bSTIterator.hasNext(); // 返回 True
bSTIterator.next();    // 返回 15
bSTIterator.hasNext(); // 返回 True
bSTIterator.next();    // 返回 20
bSTIterator.hasNext(); // 返回 False
```

**约束条件：**
- 树中节点的数目在范围 `[1, 10^5]` 内
- `0 <= Node.val <= 10^6`
- 最多调用 `10^5` 次 `hasNext` 和 `next` 操作

**进阶：**
你可以设计一个满足下述条件的解决方案吗？`next()` 和 `hasNext()` 操作均摊时间复杂度为 `O(1)`，并使用 `O(h)` 内存。其中 `h` 是树的高度。

## 解题思路

这道题的关键是理解**二叉搜索树的中序遍历会产生有序序列**这一重要性质。我们需要实现一个迭代器，能够按照中序遍历的顺序依次返回节点值。

### 核心算法思想

**关键洞见**：使用栈模拟中序遍历的递归过程，但不需要一次性遍历整棵树，而是**按需遍历**，实现懒加载（Lazy Evaluation）。

中序遍历的访问顺序是：**左子树 → 根节点 → 右子树**

### 算法设计要点

1. **初始化阶段**：从根节点开始，将所有左子节点依次压入栈中，这样栈顶就是最小值节点
2. **next() 操作**：
   - 弹出栈顶元素作为当前访问的节点
   - 如果该节点有右子树，将右子树的所有左子节点压入栈中
3. **hasNext() 操作**：检查栈是否为空即可

### 可视化示例

以示例树为例：
```
      7
     / \
    3   15
       /  \
      9   20
```

初始化后栈的状态：
```
栈顶 → [3, 7]  # 从根节点开始，将所有左子节点压入栈
```

执行过程：
1. `next()` → 返回 3，3 无右子树
2. `next()` → 返回 7，7 有右子树 15，将 15 及其左子节点 9 压入栈
3. `next()` → 返回 9，9 无右子树  
4. `next()` → 返回 15，15 有右子树 20，将 20 压入栈
5. `next()` → 返回 20，20 无右子树，栈为空

## 实现细节

### 关键函数设计

#### pushAllLeft 辅助函数
```go
// 将节点及其所有左子节点压入栈
func (this *BSTIterator) pushAllLeft(node *TreeNode) {
    for node != nil {
        this.nodeStack = append(this.nodeStack, node)
        node = node.Left
    }
}
```

#### Constructor 构造函数
- 初始化栈
- 将根节点的所有左子节点压入栈，确保栈顶是最小值

#### Next 函数
- 弹出栈顶节点作为返回值
- 如果该节点有右子树，将右子树的所有左子节点压入栈

#### HasNext 函数
- 简单检查栈是否为空

## 代码实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
type BSTIterator struct {
    nodeStack []*TreeNode
}

func Constructor(root *TreeNode) BSTIterator {
    iterator := BSTIterator{
        nodeStack: []*TreeNode{},
    }
    // 将根节点及其所有左子节点压入栈
    iterator.pushAllLeft(root)
    return iterator
}

// 辅助函数：将节点及其所有左子节点压入栈
func (this *BSTIterator) pushAllLeft(node *TreeNode) {
    for node != nil {
        this.nodeStack = append(this.nodeStack, node)
        node = node.Left
    }
}

func (this *BSTIterator) Next() int {
    // 弹出栈顶节点
    n := len(this.nodeStack)
    top := this.nodeStack[n-1]
    this.nodeStack = this.nodeStack[:n-1]
    
    // 如果该节点有右子树，将右子树的所有左子节点压入栈
    if top.Right != nil {
        this.pushAllLeft(top.Right)
    }
    
    return top.Val
}

func (this *BSTIterator) HasNext() bool {
    return len(this.nodeStack) > 0
}
```

### 执行过程分析

以示例树为例，详细跟踪执行过程：

```
初始状态：栈 = [7, 3]  // 从根节点7开始，沿左子树到3

1. next() → 返回3
   - 弹出3，3无右子树
   - 栈 = [7]

2. next() → 返回7  
   - 弹出7，7有右子树15
   - 将15及其左子节点9压入栈
   - 栈 = [15, 9]

3. next() → 返回9
   - 弹出9，9无右子树
   - 栈 = [15]

4. next() → 返回15
   - 弹出15，15有右子树20
   - 将20压入栈（20无左子节点）
   - 栈 = [20]

5. next() → 返回20
   - 弹出20，20无右子树
   - 栈 = []
```

## 复杂度分析

### 时间复杂度
- **Constructor**：$O(h)$，其中 $h$ 是树的高度，需要将根节点到最左叶子节点的路径上所有节点压入栈
- **next()**：**均摊** $O(1)$
- **hasNext()**：$O(1)$

**next() 均摊时间复杂度分析**：
每个节点最多被压入栈一次，最多被弹出栈一次。对于 $n$ 个节点的树，总共执行 $n$ 次 `next()` 操作，总的栈操作次数为 $2n$，因此均摊时间复杂度为 $O(1)$。

### 空间复杂度
$O(h)$，其中 $h$ 是树的高度。在最坏情况下（完全不平衡的树），空间复杂度为 $O(n)$；在最好情况下（完全平衡的树），空间复杂度为 $O(\log n)$。

## 方法比较

| 方面       | 栈迭代法（推荐）        | 数组预处理法            |
| -------- | --------------- | --------------- |
| 时间复杂度   | next(): 均摊O(1)   | next(): O(1)    |
| 空间复杂度   | O(h)            | O(n)            |
| 初始化时间   | O(h)            | O(n)            |
| 内存使用    | 优秀              | 较差              |
| 懒加载     | ✅ 支持            | ❌ 不支持          |
| 推荐度     | ★★★★★             | ★★★☆☆             |

## 关键收获

1. **BST中序遍历的重要性质**：中序遍历二叉搜索树得到的序列是有序的
2. **栈模拟递归**：使用栈可以将递归的中序遍历转换为迭代形式
3. **懒加载思想**：不需要一次性处理所有数据，按需处理可以显著优化空间复杂度
4. **均摊分析**：虽然单次 `next()` 操作可能需要 $O(h)$ 时间，但均摊下来是 $O(1)$
5. **空间优化技巧**：相比于预先存储所有节点值的方法，栈方法将空间复杂度从 $O(n)$ 优化到 $O(h)$

### 常见陷阱
- 忘记在 `next()` 方法中处理右子树的左子节点压栈
- 混淆中序遍历的访问顺序（应该是左→根→右）
- 在构造函数中没有正确初始化栈状态 