---
title: LeetCode 105 - 从前序与中序遍历序列构造二叉树（Construct Binary Tree from Preorder and Inorder
  Traversal）
date: 2025-04-30 11:15:40
categories:
- 算法刷题
- LeetCode
- 树
tags:
- 二叉树
- 递归
- 分治
- 哈希
- Medium
- LeetCode
- Hot100
---
## 问题描述

给定两个整数数组 `preorder` 和 `inorder`，其中 `preorder` 是二叉树的**先序遍历**，`inorder` 是同一棵树的**中序遍历**，请构造二叉树并返回其根节点。

### 示例

**示例 1：**

```
输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出: [3,9,20,null,null,15,7]
```

生成的二叉树如下：

```
    3
   / \
  9  20
    /  \
   15   7
```

**示例 2：**

```
输入: preorder = [-1], inorder = [-1]
输出: [-1]
```

### 提示

- `1 <= preorder.length <= 3000`
- `inorder.length == preorder.length`
- `-3000 <= preorder[i], inorder[i] <= 3000`
- `preorder` 和 `inorder` 均无重复元素
- `inorder` 均出现在 `preorder`
- `preorder` 保证为二叉树的前序遍历序列
- `inorder` 保证为二叉树的中序遍历序列

## 解题思路

这道题要求我们根据二叉树的前序遍历和中序遍历结果重构二叉树。解决这个问题的核心是理解前序遍历和中序遍历的特点：

- **前序遍历**：根节点 → 左子树 → 右子树
- **中序遍历**：左子树 → 根节点 → 右子树

**关键洞见**：前序遍历的第一个元素始终是当前子树的根节点。而在中序遍历中，根节点将数组分成两部分：左边是左子树的所有节点，右边是右子树的所有节点。

以示例 1 为例：

- 前序遍历：`[3, 9, 20, 15, 7]` - 第一个元素 `3` 是根节点
- 中序遍历：`[9, 3, 15, 20, 7]` - 根节点 `3` 将数组分成 `[9]`（左子树）和 `[15, 20, 7]`（右子树）

通过这个特性，我们可以递归地构建二叉树：

1. 确定根节点：前序遍历的第一个元素
2. 在中序遍历中找到根节点的位置
3. 将中序遍历分成左右两部分，分别对应左右子树
4. 相应地划分前序遍历（根据左右子树的大小）
5. 递归地构建左右子树

### 方法一：递归 + 数组切片

我们可以使用 Go 的切片特性方便地划分数组，然后递归构建子树。

#### 步骤详情

1. 如果前序遍历数组为空，返回 `nil`（递归终止条件）
2. 取前序遍历的第一个元素作为根节点
3. 在中序遍历中找到根节点的位置
4. 根据根节点位置，将中序遍历分为左子树和右子树
5. 根据左子树的大小，确定前序遍历中左子树和右子树的范围
6. 递归构建左子树和右子树

### 方法二：递归 + 哈希表优化

方法一中，我们每次递归都要在中序遍历中线性查找根节点的位置，这导致了额外的时间复杂度。为了优化这一步骤，我们可以使用哈希表预先存储中序遍历中每个元素的位置。

#### 步骤详情

1. 创建一个哈希表，记录中序遍历中每个元素的索引
2. 定义一个辅助函数，接收前序和中序遍历的范围，以及哈希表
3. 在辅助函数中：
   - 如果当前范围为空，返回 `nil`
   - 取前序遍历起始位置的元素作为根节点
   - 从哈希表中找到根节点在中序遍历中的位置
   - 计算左子树的大小
   - 递归构建左右子树，使用计算得到的范围
4. 返回根节点

## 实现细节

对于方法一和方法二，主要的区别在于如何找到中序遍历中根节点的位置，以及如何划分数组。

在方法一中，我们使用 Go 的切片特性直接对数组进行切片操作，这使得代码简洁但会产生额外的内存开销。

在方法二中，我们避免了切片操作，而是使用索引来指定子数组的范围。同时，使用哈希表优化了查找操作，将查找根节点的时间复杂度从 O(n) 降低到 O(1)。

### 代码实现

#### 方法一：递归 + 数组切片

```go
func buildTree(preorder []int, inorder []int) *TreeNode {
    // 处理空树的情况
    if len(preorder) == 0 {
        return nil
    }

    // 前序遍历的第一个元素是根节点的值
    rootVal := preorder[0]
    root := &TreeNode{Val: rootVal}

    // 在中序遍历中找到根节点的位置
    rootIndex := 0
    for i, val := range inorder {
        if val == rootVal {
            rootIndex = i
            break
        }
    }

    // 递归构建左子树和右子树
    // 左子树：前序遍历中 [1:rootIndex+1]，中序遍历中 [:rootIndex]
    // 右子树：前序遍历中 [rootIndex+1:]，中序遍历中 [rootIndex+1:]
    root.Left = buildTree(preorder[1:rootIndex+1], inorder[:rootIndex])
    root.Right = buildTree(preorder[rootIndex+1:], inorder[rootIndex+1:])

    return root
}
```

#### 方法二：递归 + 哈希表优化

```go
func buildTree(preorder []int, inorder []int) *TreeNode {
    // 创建中序遍历的值到索引的映射，加速查找
    inorderMap := make(map[int]int)
    for i, val := range inorder {
        inorderMap[val] = i
    }
  
    return buildTreeHelper(preorder, 0, len(preorder)-1, inorder, 0, len(inorder)-1, inorderMap)
}

func buildTreeHelper(preorder []int, preStart, preEnd int, 
                    inorder []int, inStart, inEnd int, 
                    inorderMap map[int]int) *TreeNode {
    // 递归终止条件
    if preStart > preEnd {
        return nil
    }
  
    // 前序遍历的第一个元素是根节点
    rootVal := preorder[preStart]
    root := &TreeNode{Val: rootVal}
  
    // 在中序遍历中找到根节点的位置
    rootIndex := inorderMap[rootVal]
  
    // 计算左子树的节点数量
    leftSize := rootIndex - inStart
  
    // 递归构建左子树和右子树
    // 左子树：
    // - 前序遍历：[preStart+1 : preStart+leftSize+1)
    // - 中序遍历：[inStart : rootIndex)
    root.Left = buildTreeHelper(
        preorder, preStart+1, preStart+leftSize, 
        inorder, inStart, rootIndex-1, 
        inorderMap,
    )
  
    // 右子树：
    // - 前序遍历：[preStart+leftSize+1 : preEnd+1)
    // - 中序遍历：[rootIndex+1 : inEnd+1)
    root.Right = buildTreeHelper(
        preorder, preStart+leftSize+1, preEnd, 
        inorder, rootIndex+1, inEnd, 
        inorderMap,
    )
  
    return root
}
```

### 执行过程分析

以示例 1 为例，我们来一步步分析方法二的执行过程：

- 前序遍历：`[3, 9, 20, 15, 7]`
- 中序遍历：`[9, 3, 15, 20, 7]`

1. 创建哈希表：`{9:0, 3:1, 15:2, 20:3, 7:4}`
2. 调用 `buildTreeHelper` 函数，范围是整个数组
3. `rootVal = preorder[0] = 3`
4. `rootIndex = inorderMap[3] = 1`
5. `leftSize = 1 - 0 = 1`（左子树有 1 个节点）
6. 递归构建左子树：
   - 前序范围：`[1, 1]`，即 `[9]`
   - 中序范围：`[0, 0]`，即 `[9]`
   - 返回一个值为 9 的节点，没有子节点
7. 递归构建右子树：
   - 前序范围：`[2, 4]`，即 `[20, 15, 7]`
   - 中序范围：`[2, 4]`，即 `[15, 20, 7]`
   - 这又是一个子问题，会递归解决
8. 最终返回构建好的树

## 方法比较

| 方面       | 方法一：递归 + 数组切片                                  | 方法二：递归 + 哈希表优化 |
| ---------- | -------------------------------------------------------- | ------------------------- |
| 时间复杂度 | O(n²)                                                   | O(n)                      |
| 空间复杂度 | O(n)                                                     | O(n)                      |
| 优点       | 代码简洁，易于理解                                       | 更高效，尤其是对于大型树  |
| 缺点       | 在递归过程中查找根节点位置较慢，且切片操作会增加内存开销 | 代码相对复杂              |
| 推荐度     | ★★★☆☆                                               | ★★★★★                |

## 复杂度分析

### 方法一：递归 + 数组切片

- **时间复杂度**：O(n²)

  - 最坏情况下，每次递归都需要 O(n) 时间来找到根节点在中序遍历中的位置
  - 递归树的深度为 O(n)
  - 因此总时间复杂度为 O(n²)
- **空间复杂度**：O(n)

  - 递归调用栈的深度为 O(n)
  - 切片操作会创建新的数组，增加额外的空间开销

### 方法二：递归 + 哈希表优化

- **时间复杂度**：O(n)

  - 预处理哈希表需要 O(n) 时间
  - 每个节点只被访问一次，构建的时间为 O(n)
  - 查找根节点位置的时间从 O(n) 优化到 O(1)
  - 因此总时间复杂度为 O(n)
- **空间复杂度**：O(n)

  - 哈希表需要 O(n) 的空间
  - 递归调用栈的深度为 O(n)

## 关键收获

1. **前序遍历和中序遍历的特性**：理解这两种遍历方式的特点是解决此类问题的基础。前序遍历的第一个元素是根节点，中序遍历可以区分左右子树。
2. **递归思想**：这道题是典型的递归问题，通过不断地将大问题分解为小问题来解决。
3. **空间时间权衡**：方法二通过使用额外的哈希表空间换取时间效率，这是算法优化中常见的思路。
4. **索引计算**：在方法二中，正确计算子数组的范围是关键，需要特别注意索引边界。
5. **常见陷阱**：

   - 忘记考虑空树情况
   - 计算子树范围时的索引错误
   - 没有正确处理左右子树的划分

相关问题：

- LeetCode 106：从中序与后序遍历序列构造二叉树
- LeetCode 889：根据前序和后序遍历构造二叉树
- LeetCode 1008：前序遍历构造二叉搜索树
