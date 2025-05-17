---
title: LeetCode 236 - 二叉树的最近公共祖先
date: 2025-04-30 17:23:27
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 二叉树
- 深度优先搜索
- 递归
- Medium
- LeetCode
- Hot100
---
## 问题描述

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为："对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。"

**示例 1：**
```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出：3
解释：节点 5 和节点 1 的最近公共祖先是节点 3 。
```

**示例 2：**
```
输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
输出：5
解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。
```

**示例 3：**
```
输入：root = [1,2], p = 1, q = 2
输出：1
```

**提示：**
- 树中节点数目在范围 [2, 10^5] 内。
- -10^9 <= Node.val <= 10^9
- 所有 Node.val 互不相同。
- p != q
- p 和 q 均存在于给定的二叉树中。

## 解题思路

这个问题看起来很复杂，但通过递归方法可以优雅地解决。**关键洞见**是：如果我们从根节点开始，对于任意节点：

1. 如果当前节点就是 p 或 q，那么这个节点就是它们的最近公共祖先（可能一个是另一个的后代）
2. 如果当前节点不是 p 或 q，我们需要在左右子树中寻找 p 和 q：
   - 如果 p 和 q 分别在当前节点的左右子树中，那么当前节点就是最近公共祖先
   - 如果 p 和 q 都在左子树，那么最近公共祖先在左子树中
   - 如果 p 和 q 都在右子树，那么最近公共祖先在右子树中

这个问题可以通过几种方法解决：

### 方法一：递归 - 后序遍历

递归是解决这个问题最直观的方法。我们可以通过后序遍历（左、右、根）的方式，自底向上地寻找最近公共祖先。

#### 实现思路：

1. **基本情况**：
   - 如果当前节点为空，返回 nil
   - 如果当前节点等于 p 或 q，返回当前节点

2. **递归调用**：
   - 在左子树中递归寻找 p 和 q
   - 在右子树中递归寻找 p 和 q

3. **合并结果**：
   - 如果左子树和右子树的递归调用都返回非空结果，说明 p 和 q 分别在当前节点的左右子树中，当前节点就是最近公共祖先
   - 如果只有一个子树返回非空结果，则该结果就是最近公共祖先
   - 如果两个子树都返回空，则返回空

### 方法二：使用父节点映射

我们也可以通过建立每个节点到其父节点的映射来解决这个问题：

1. 从根节点开始DFS，创建每个节点到其父节点的映射
2. 从 p 开始，向上遍历至根，记录经过的所有节点
3. 从 q 开始，向上遍历至根，找到第一个在 p 的路径中出现的节点，该节点即为最近公共祖先

### 方法三：路径比较法

1. 找出从根节点到 p 的路径
2. 找出从根节点到 q 的路径
3. 比较这两条路径，找到最后一个相同的节点，即为最近公共祖先

## 代码实现

### 方法一：递归实现

```go
/**
 * Definition for a binary tree node.
 * type TreeNode struct {
 *     Val int
 *     Left *TreeNode
 *     Right *TreeNode
 * }
 */
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    // 基本情况：空节点返回nil
    if root == nil {
        return nil
    }
    
    // 如果当前节点是p或q，直接返回当前节点
    if root.Val == p.Val || root.Val == q.Val {
        return root
    }
    
    // 在左右子树中寻找p和q
    left := lowestCommonAncestor(root.Left, p, q)
    right := lowestCommonAncestor(root.Right, p, q)
    
    // 如果p和q分别在左右子树中，当前节点就是LCA
    if left != nil && right != nil {
        return root
    }
    
    // 如果左子树中没有找到p或q，则LCA在右子树中
    if left == nil {
        return right
    }
    
    // 否则LCA在左子树中（或两者都为空，此时返回nil）
    return left
}
```

### 方法二：父节点映射实现

```go
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    // 建立父节点映射
    parentMap := make(map[int]*TreeNode)
    
    // DFS遍历树，建立子节点到父节点的映射
    var dfs func(*TreeNode)
    dfs = func(node *TreeNode) {
        if node == nil {
            return
        }
        
        if node.Left != nil {
            parentMap[node.Left.Val] = node
            dfs(node.Left)
        }
        
        if node.Right != nil {
            parentMap[node.Right.Val] = node
            dfs(node.Right)
        }
    }
    dfs(root)
    
    // 收集从p到根的路径中的所有节点
    visited := make(map[int]bool)
    for node := p; node != nil; node = parentMap[node.Val] {
        visited[node.Val] = true
    }
    
    // 从q向上遍历，找到第一个已访问过的节点
    for node := q; node != nil; node = parentMap[node.Val] {
        if visited[node.Val] {
            return node
        }
    }
    
    return nil // 这里实际上不会被执行到，因为题目保证p和q在树中
}
```

### 方法三：路径比较法

```go
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    // 找出从根到指定节点的路径
    var findPath func(*TreeNode, *TreeNode, []*TreeNode) []*TreeNode
    findPath = func(root, target *TreeNode, path []*TreeNode) []*TreeNode {
        if root == nil {
            return nil
        }
        
        // 将当前节点加入路径
        path = append(path, root)
        
        // 如果找到目标节点，返回路径
        if root.Val == target.Val {
            return path
        }
        
        // 在左子树中寻找
        if left := findPath(root.Left, target, append([]*TreeNode{}, path...)); left != nil {
            return left
        }
        
        // 在右子树中寻找
        if right := findPath(root.Right, target, append([]*TreeNode{}, path...)); right != nil {
            return right
        }
        
        return nil
    }
    
    // 获取从根到p和q的路径
    pathP := findPath(root, p, []*TreeNode{})
    pathQ := findPath(root, q, []*TreeNode{})
    
    // 找到最后一个公共节点
    var lca *TreeNode
    for i := 0; i < len(pathP) && i < len(pathQ); i++ {
        if pathP[i].Val == pathQ[i].Val {
            lca = pathP[i]
        } else {
            break
        }
    }
    
    return lca
}
```

## 方法比较

| 方面       | 方法一：递归            | 方法二：父节点映射        | 方法三：路径比较法        |
| ---------- | ----------------------- | ------------------------- | ------------------------- |
| 时间复杂度 | O(n)                    | O(n)                      | O(n)                      |
| 空间复杂度 | O(h)，h为树高           | O(n)                      | O(n)                      |
| 优点       | 代码简洁，空间效率高    | 思路直观                  | 容易理解                  |
| 缺点       | 递归可能导致栈溢出      | 需要额外空间存储父节点映射| 需要额外空间存储路径      |
| 推荐度     | ★★★★★                   | ★★★☆☆                     | ★★★☆☆                     |

## 复杂度分析

### 方法一：递归

- **时间复杂度**: O(n)，其中 n 是树中的节点数。在最坏情况下，我们需要访问树中的所有节点。
- **空间复杂度**: O(h)，其中 h 是树的高度。递归调用的栈深度与树的高度成正比。在最坏情况下（树是一条链），空间复杂度为 O(n)。

### 方法二：父节点映射

- **时间复杂度**: O(n)，我们需要遍历整棵树来构建父节点映射，然后在最坏情况下需要遍历从 p 和 q 到根的所有节点。
- **空间复杂度**: O(n)，需要额外空间存储父节点映射和访问集合。

### 方法三：路径比较法

- **时间复杂度**: O(n)，需要遍历树来找到从根到 p 和 q 的路径。
- **空间复杂度**: O(n)，需要存储从根到 p 和 q 的路径。

## 关键收获

1. **递归思想在树问题中的应用**：树的问题通常可以通过递归优雅地解决，尤其是自底向上的后序遍历。

2. **最近公共祖先的特性**：
   - 如果两个节点在不同的子树中，它们的LCA就是子树的根节点
   - 如果一个节点是另一个节点的祖先，那么这个祖先节点就是LCA

3. **路径表示法**：从根到节点的路径可以唯一确定一个节点，比较两条路径可以找到分叉点

4. **空返回值的处理**：在递归中处理空返回值是很重要的，确保代码的健壮性

这道题是树的经典问题，它不仅考察了树的遍历技巧，还考察了对递归的理解和应用。方法一（递归）是最简洁和高效的解法，也是面试中推荐使用的方法。 