---
title: ❌ LeetCode 437 - 路径总和 III (Path Sum III)
date: 2025-04-30 16:43:12
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 二叉树
- 深度优先搜索
- 前缀和
- 哈希
- Medium
- LeetCode
- ❌错题集
- Hot100
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

## 错误解法与分析

我的初始解法是：

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

    // ❌ 错误点：只检查单个节点值等于目标和的情况
    if node.Val == targetSum {
        *cnt++
    }
    
    // ❌ 错误点：混合了两种不同的递归逻辑，职责不清晰
    dfsPathSum(node.Left, totalSum, totalSum, cnt)      // 左子节点作为新起点
    dfsPathSum(node.Left, targetSum-node.Val, totalSum, cnt)  // 左子节点作为路径延续
    dfsPathSum(node.Right, totalSum, totalSum, cnt)     // 右子节点作为新起点 
    dfsPathSum(node.Right, targetSum-node.Val, totalSum, cnt) // 右子节点作为路径延续
}
```

### 错误原因分析

通过示例 1 的树结构来详细分析错误：

```
       10
      /  \
     5   -3
    / \    \
   3   2   11
  / \   \
 3  -2   1
```

当我们查找目标和为 8 的路径时，预期结果是 3 条路径。但我的实现存在以下问题：

#### 1. 递归职责混淆导致的重复计算

从根节点 10 开始执行 `dfsPathSum(root, 8, 8, &cnt)`：

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

## 正确解法

经过分析，我改进的解法是：

### 方案一：双重递归实现

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

### 方案二：前缀和优化实现

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

### 为什么这些解法可以工作

1. **双重递归解法**：
   - 将问题分解为清晰的两个子问题：遍历每个节点 + 统计从特定节点出发的路径
   - 每个递归函数只有单一职责，避免逻辑混淆
   - 使用返回值而非指针引用，使状态管理更清晰

2. **前缀和解法**：
   - 利用数学关系 `currentSum - x = targetSum`，只需寻找前缀和为 `x = currentSum - targetSum` 的路径
   - 一次遍历就能统计所有路径，避免重复计算
   - 使用回溯技术维护哈希表状态，确保正确统计不同分支的路径

## 方法比较

| 方面 | 双重递归法 | 前缀和法 |
| ---- | ---- | ----- |
| 时间复杂度 | O(n²) | O(n) |
| 空间复杂度 | O(h)，h为树高 | O(n) |
| 优点 | 直观易懂，代码简洁 | 性能更优，只需一次遍历 |
| 缺点 | 对大型树性能较差 | 需要额外哈希表空间 |
| 适用场景 | 树节点数较少 | 大型树结构 |
| 推荐度 | ★★★☆☆ | ★★★★★ |

## 学习总结

通过这个错误，我学到了以下重要经验：

1. **递归设计原则**：
   - 递归函数应当功能单一，职责明确
   - 参数设计需要考虑清晰的意义和传递方式
   - 复杂问题可以拆分为多个独立的递归函数配合解决

2. **常见递归错误模式**：
   - 混合不同职责的递归会导致计算路径混乱和重复
   - 递归爆炸：每个节点产生过多递归调用会导致性能灾难
   - 状态管理混乱：使用全局变量或指针引用时需特别小心

3. **前缀和技术应用**：
   - 前缀和不仅适用于数组，也适用于树结构
   - 使用哈希表结合前缀和可以将时间复杂度从 O(n²) 降至 O(n)
   - 回溯思想在树的遍历中的重要应用

4. **代码质量提升**：
   - 清晰的函数命名和参数设计对递归代码尤为重要
   - 使用返回值代替指针引用通常能提高代码可读性
   - 使用 `int64` 处理可能的整数溢出

这个错误也提醒我在处理树的路径问题时，需要特别注意不同路径的定义和计数方式，以避免重复或遗漏。 