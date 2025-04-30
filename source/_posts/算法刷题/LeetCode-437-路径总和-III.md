---
title: "LeetCode 437 - 路径总和 III (Path Sum III)"
date: 2025-04-30 16:43:12
categories:
  - 算法刷题
  - LeetCode
tags:
  - 二叉树
  - 深度优先搜索
  - 前缀和
  - 哈希
  - Medium
  - LeetCode
---

## 问题描述

给定一个二叉树的根节点 `root` 和一个整数 `targetSum`，求该二叉树里节点值之和等于 `targetSum` 的**路径**的数目。

**路径定义**：不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。

**示例 1**：
```
       10
      /  \
     5   -3
    / \    \
   3   2   11
  / \   \
 3  -2   1
```

**输入**：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8  
**输出**：3  
**解释**：和为 8 的路径有 3 条
1. 5 -> 3
2. 5 -> 2 -> 1
3. -3 -> 11

**示例 2**：
```
       5
      / \
     4   8
    /   / \
   11  13  4
  /  \    / \
 7    2  5   1
```

**输入**：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22  
**输出**：3  

**提示**：
- 二叉树的节点个数的范围是 [0,1000]
- -10^9 <= Node.val <= 10^9
- -1000 <= targetSum <= 1000

## 解题思路

解决这道题的关键是**理解路径的定义**和**如何不重不漏地统计所有符合条件的路径**。由于路径可以从任意节点开始，但必须向下延伸，我们需要一种方法来系统地考虑每个节点作为起点的可能性。

这道题有两种主要的解法思路：

### 1. 双重递归法

这种方法直观但效率较低，由两层递归组成：
- **外层递归**：遍历树中的每个节点，将每个节点都视为潜在的路径起点
- **内层递归**：以当前节点为起点，向下探索所有路径，统计符合条件的路径数量

**核心思想**：将大问题分解为子问题，即分别计算以每个节点为起点的路径数量，然后求和。

### 2. 前缀和优化法

这种方法更高效，利用**前缀和**技术只需要一次遍历树：
- 维护一个从根节点到当前节点路径上的**前缀和哈希表**
- 对于当前节点，检查是否存在某个前缀，使得**当前前缀和 - 某个已存在的前缀和 = 目标和**
- 使用回溯思想，在处理完当前节点的子树后，将其贡献从前缀和中移除

**关键优化**：将时间复杂度从 O(n²) 降低到 O(n)。

## 实现细节

### 我最初的错误实现

```go
func pathSum(root *TreeNode, targetSum int) int {
    cnt := 0
    dfsPathSum(root, targetSum, targetSum, &cnt)
    return cnt
}

func dfsPathSum(node *TreeNode, targetSum, totalSum int, cnt *int) {
    if node == nil {
        return
    }

    if node.Val == targetSum {
        *cnt++
    }
    dfsPathSum(node.Left, totalSum, totalSum, cnt)
    dfsPathSum(node.Left, targetSum-node.Val, totalSum, cnt)
    dfsPathSum(node.Right, totalSum, totalSum, cnt)
    dfsPathSum(node.Right, targetSum-node.Val, totalSum, cnt)
}
```

### 错误分析与示例说明

我的原始代码存在几个关键问题，让我通过示例 1 的树结构来说明：

```
       10
      /  \
     5   -3
    / \    \
   3   2   11
  / \   \
 3  -2   1
```

当我们查找目标和为 8 的路径时，预期结果是 3 条路径。但我的实现会导致什么问题？

#### 1. 递归职责混淆导致的重复计算

假设我们从根节点 10 开始执行 `dfsPathSum(root, 8, 8, &cnt)`：

- 检查 10 是否等于 8：不等于，不增加计数
- 对左子节点 5 生成 **两个递归调用**：
  - `dfsPathSum(5, 8, 8, &cnt)` —— 视 5 为新路径起点
  - `dfsPathSum(5, 8-10=-2, 8, &cnt)` —— 视 5 为延续 10 的路径

这里问题就出现了：当我们访问节点 5，会同时以它作为**新起点**和**路径延续点**，产生两条不同处理路径。但函数内部的逻辑没有区分这两种不同的职责。

继续追踪 `dfsPathSum(5, 8, 8, &cnt)` 的执行：
- 检查 5 是否等于 8：不等于，不增加计数
- 又生成 4 个递归调用：
  1. `dfsPathSum(3, 8, 8, &cnt)` —— 3 作为新起点
  2. `dfsPathSum(3, 8-5=3, 8, &cnt)` —— 3 作为 5 的延续
  3. `dfsPathSum(2, 8, 8, &cnt)` —— 2 作为新起点
  4. `dfsPathSum(2, 8-5=3, 8, &cnt)` —— 2 作为 5 的延续

对于 `dfsPathSum(3, 3, 8, &cnt)`：
- 检查 3 是否等于 3：**相等，计数加1**（正确找到 5->3 路径）
- 但同时也会递归调用 `dfsPathSum(3, 3-3=0, 8, &cnt)` 和 `dfsPathSum(-2, 0-3=-3, 8, &cnt)`

这种不分职责的递归会导致：
1. **指数级爆炸的递归调用**——每个节点生成 4 个新的递归
2. **重复计算**——同一路径会在不同递归分支中重复统计

#### 2. 路径判断逻辑不完整

考虑 `dfsPathSum(3, 3, 8, &cnt)` 这种情况：
- 代码判断 `node.Val == targetSum`，此处 3 == 3，所以 cnt++
- 但这只考虑了节点值等于目标和的"叶子路径"情况
- 没有考虑从 3 点开始，可能向下延伸的其他路径，应递归传递 targetSum-node.Val

#### 3. 递归终止时机和状态混乱

在我的实现中，对于每个节点都创建 4 个递归调用，没有明确的层次和职责，导致计算路径时:
- 统计结果不准确（可能重复计数）
- 递归分支数量爆炸式增长（对于 n 个节点的树，最坏情况接近 4^n 次递归调用）

**具体示例错误**：
对于示例 1，目标和为 8，正确结果应该是 3 条路径。但使用我原始的代码，会产生大量重复计算和错误计数。例如路径 5->3 会被多条不同的递归路径重复发现和统计。

### 正确的双重递归实现

```go
func pathSum(root *TreeNode, targetSum int) int {
    if root == nil {
        return 0
    }
    
    // 计算以当前节点为起点的路径数
    cnt := dfsPathSum(root, targetSum)
    
    // 递归处理左右子树，将每个节点都作为潜在起点
    cnt += pathSum(root.Left, targetSum)
    cnt += pathSum(root.Right, targetSum)
    
    return cnt
}

func dfsPathSum(node *TreeNode, targetSum int) int {
    if node == nil {
        return 0
    }
    
    // 初始化计数
    cnt := 0
    
    // 如果当前节点值等于目标和，找到一条路径
    if node.Val == targetSum {
        cnt++
    }
    
    // 递归计算以子节点为路径延续的情况
    cnt += dfsPathSum(node.Left, targetSum-node.Val)
    cnt += dfsPathSum(node.Right, targetSum-node.Val)
    
    return cnt
}
```

**改进要点**：
- 将功能明确分离为两个独立的递归函数
- `pathSum` 负责遍历每个节点，把每个节点作为潜在起点
- `dfsPathSum` 专注于统计从当前节点出发，向下延伸的符合条件的路径数
- 递归返回值代替了指针引用，使代码更清晰

### 前缀和优化实现

```go
func pathSum(root *TreeNode, targetSum int) int {
    // 使用map存储前缀和及其出现次数
    prefixSum := make(map[int64]int)
    // 初始前缀和为0，出现1次（空路径）
    prefixSum[0] = 1
    
    // 使用int64避免大数溢出
    return dfsWithPrefixSum(root, 0, int64(targetSum), prefixSum)
}

func dfsWithPrefixSum(node *TreeNode, currSum int64, targetSum int64, prefixSum map[int64]int) int {
    if node == nil {
        return 0
    }
    
    // 更新当前路径和
    currSum += int64(node.Val)
    
    // 寻找有多少个前缀和为 currSum-targetSum 的路径
    // 这些路径与当前路径一起，形成和为targetSum的路径
    count := prefixSum[currSum-targetSum]
    
    // 更新前缀和出现次数
    prefixSum[currSum]++
    
    // 递归处理左右子树
    count += dfsWithPrefixSum(node.Left, currSum, targetSum, prefixSum)
    count += dfsWithPrefixSum(node.Right, currSum, targetSum, prefixSum)
    
    // 回溯：移除当前节点的影响，避免影响其他分支的计算
    prefixSum[currSum]--
    
    return count
}
```

**关键技术点**：
- 使用前缀和哈希表记录路径和及其出现次数
- 使用 `int64` 类型避免大整数溢出
- 回溯思想：递归返回前恢复哈希表状态
- 数学关系：`currentSum - x = targetSum` 意味着我们需要寻找前缀和为 `x = currentSum - targetSum` 的路径

## 方法比较

| 方面 | 双重递归法 | 前缀和法 |
| ---- | ---- | ----- |
| 时间复杂度 | O(n²) | O(n) |
| 空间复杂度 | O(h)，h为树高 | O(n) |
| 优点 | 直观易懂，代码简洁 | 性能更优，只需一次遍历 |
| 缺点 | 对大型树性能较差 | 需要额外哈希表空间 |
| 适用场景 | 树节点数较少 | 大型树结构 |
| 推荐度 | ★★★☆☆ | ★★★★★ |

## 复杂度分析

### 双重递归法
- **时间复杂度**：O(n²) 
  - 最坏情况下，对于每个节点（n个），都需要遍历其所有后代节点（最多n个）
  - 在高度为h的平衡树中，复杂度近似 O(n log n)
  - 在退化为链表的树中，复杂度为 O(n²)
  
- **空间复杂度**：O(h)
  - 递归栈的深度最多为树的高度h
  - 最坏情况下，树退化为链表，空间复杂度为 O(n)

### 前缀和法
- **时间复杂度**：O(n)
  - 只需对树进行一次深度优先遍历
  - 哈希表的操作（查询和更新）均为 O(1)
  
- **空间复杂度**：O(n)
  - 哈希表最多存储n个前缀和
  - 递归栈深度为树高h
  - 总体空间复杂度由较大者决定，为 O(n)

## 关键收获

1. **关于递归设计的重要教训**：
   - 递归函数应当功能单一，职责明确
   - 参数设计需要考虑清晰的意义和传递方式
   - 复杂问题可以拆分为多个独立的递归函数配合解决

2. **前缀和技术在树路径问题中的应用**：
   - 前缀和不仅适用于数组，也适用于树结构
   - 在需要计算"路径和"的问题中特别有效
   - 需要利用回溯思想维护正确的状态

3. **避免常见陷阱**：
   - 整数溢出：处理大型树时使用 int64 类型
   - 路径定义混淆：明确起点和终点的规则
   - 重复计算：确保路径不被重复统计

4. **相关问题**：
   - LeetCode 112 路径总和
   - LeetCode 113 路径总和 II
   - LeetCode 560 和为K的子数组
   - LeetCode 687 最长同值路径 