---
title: "LeetCode 240 - 搜索二维矩阵 II（Search a 2D Matrix II）"
date: 2025-04-20 14:03:49
categories:
  - 算法刷题
tags:
  - 数组
  - 矩阵
  - 二分查找
  - 分治
  - LeetCode
  - Medium
---

## 问题描述

编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target。该矩阵具有以下特性：

- 每行的元素从左到右升序排列。
- 每列的元素从上到下升序排列。

**示例 1：**

输入：matrix = 
```
[
  [1,  4,  7,  11, 15],
  [2,  5,  8,  12, 19],
  [3,  6,  9,  16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```
target = 5

输出：true

**示例 2：**

输入：matrix = 
```
[
  [1,  4,  7,  11, 15],
  [2,  5,  8,  12, 19],
  [3,  6,  9,  16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```
target = 20

输出：false

**提示：**

- m == matrix.length
- n == matrix[i].length
- 1 <= n, m <= 300
- -10^9 <= matrix[i][j] <= 10^9
- 每行的所有元素从左到右升序排列
- 每列的所有元素从上到下升序排列
- -10^9 <= target <= 10^9

## 解题思路

这道题目提供了一个特殊性质的二维矩阵，要求我们查找一个目标值。矩阵的特性是每行从左到右升序，每列从上到下升序。根据这个特性，我们可以有多种解题思路。

### 方法一：角落搜索法

**核心思想**: 利用矩阵的排序特性，从右上角或左下角开始搜索，每次能够排除一行或一列。

从右上角（或左下角）开始搜索的原理：
- 若当前元素等于目标值，直接返回 true
- 若当前元素大于目标值，则可以排除当前列（因为当前列下方的元素更大）
- 若当前元素小于目标值，则可以排除当前行（因为当前行左侧的元素更小）

这种方法的时间复杂度是 O(m + n)，其中 m 是行数，n 是列数，因为每次操作都会排除一行或一列。

#### 实现细节

我们从矩阵的右上角开始搜索：
1. 初始化指针位置为右上角坐标 (0, columns-1)
2. 当指针在矩阵范围内时，比较当前元素与目标值：
   - 如果相等，返回 true
   - 如果当前元素大于目标值，则向左移动（列索引减一）
   - 如果当前元素小于目标值，则向下移动（行索引加一）
3. 如果搜索结束后仍未找到目标值，返回 false

#### 代码实现

```go
func searchMatrix(matrix [][]int, target int) bool {
    // 获取矩阵的行数和列数
    rows := len(matrix)
    if rows == 0 {
        return false
    }
    columns := len(matrix[0])
    
    // 从右上角开始搜索
    row, col := 0, columns-1
    
    // 当指针在矩阵范围内时继续搜索
    for row < rows && col >= 0 {
        currentValue := matrix[row][col]
        
        if currentValue == target {
            // 找到目标值
            return true
        } else if currentValue > target {
            // 当前值大于目标值，排除当前列
            col--
        } else {
            // 当前值小于目标值，排除当前行
            row++
        }
    }
    
    // 搜索完毕未找到目标值
    return false
}
```

### 方法二：二分查找法

**核心思想**: 由于每一行都是排序的，我们可以对每一行使用二分查找。

#### 实现细节

1. 遍历矩阵的每一行
2. 对每一行使用二分查找寻找目标值
3. 如果在任一行中找到目标值，返回 true
4. 否则，返回 false

这种方法的时间复杂度是 O(m log n)，其中 m 是行数，n 是列数。

#### 代码实现

```go
func searchMatrix(matrix [][]int, target int) bool {
    // 获取矩阵行数
    rows := len(matrix)
    if rows == 0 {
        return false
    }
    
    // 对每一行使用二分查找
    for _, row := range matrix {
        // 如果在当前行找到目标值，返回 true
        if binarySearch(row, target) {
            return true
        }
    }
    
    // 所有行都搜索完毕未找到目标值
    return false
}

// 二分查找辅助函数
func binarySearch(nums []int, target int) bool {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2
        
        if nums[mid] == target {
            return true
        } else if nums[mid] > target {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }
    
    return false
}
```

### 方法三：分治法

**核心思想**: 利用矩阵的特性，将矩阵划分为四个子矩阵，递归搜索。

#### 实现细节

1. 找到矩阵中心点 (midRow, midCol)
2. 将矩阵分为四个区域：左上、右上、左下、右下
3. 比较中心点的值与目标值：
   - 如果等于目标值，返回 true
   - 如果大于目标值，则目标值可能在左上区域或左下区域或右上区域
   - 如果小于目标值，则目标值可能在右下区域或右上区域或左下区域
4. 递归搜索可能包含目标值的子矩阵

这种方法的时间复杂度在最坏情况下可能接近 O(m*n)，但在平均情况下表现较好。

#### 代码实现

```go
func searchMatrix(matrix [][]int, target int) bool {
    // 获取矩阵的行数和列数
    rows := len(matrix)
    if rows == 0 {
        return false
    }
    columns := len(matrix[0])
    
    // 调用递归搜索函数
    return searchMatrixRecursively(matrix, target, 0, 0, rows-1, columns-1)
}

// 递归搜索函数
func searchMatrixRecursively(matrix [][]int, target int, rowStart, colStart, rowEnd, colEnd int) bool {
    // 基本情况：超出矩阵范围
    if rowStart > rowEnd || colStart > colEnd {
        return false
    }
    
    // 基本情况：矩阵只有一个元素
    if rowStart == rowEnd && colStart == colEnd {
        return matrix[rowStart][colStart] == target
    }
    
    // 计算中心点坐标
    rowMid := rowStart + (rowEnd-rowStart)/2
    colMid := colStart + (colEnd-colStart)/2
    
    // 中心点值
    midValue := matrix[rowMid][colMid]
    
    // 如果找到目标值，直接返回
    if midValue == target {
        return true
    }
    
    // 根据中心点值与目标值的关系，决定搜索哪些子矩阵
    if midValue > target {
        // 搜索左上区域（行结束和列结束都是中心点）
        return searchMatrixRecursively(matrix, target, rowStart, colStart, rowMid, colMid) ||
               // 搜索右上区域（行从开始到中心，列从中心+1到结束）
               searchMatrixRecursively(matrix, target, rowStart, colMid+1, rowMid, colEnd) ||
               // 搜索左下区域（行从中心+1到结束，列从开始到中心）
               searchMatrixRecursively(matrix, target, rowMid+1, colStart, rowEnd, colMid)
    } else {
        // 搜索右下区域（行开始和列开始都是中心点+1）
        return searchMatrixRecursively(matrix, target, rowMid+1, colMid+1, rowEnd, colEnd) ||
               // 搜索右上区域（行从开始到中心，列从中心+1到结束）
               searchMatrixRecursively(matrix, target, rowStart, colMid+1, rowMid, colEnd) ||
               // 搜索左下区域（行从中心+1到结束，列从开始到中心）
               searchMatrixRecursively(matrix, target, rowMid+1, colStart, rowEnd, colMid)
    }
}
```

## 复杂度分析

| 方法         | 时间复杂度   | 空间复杂度 | 优点                     | 缺点                     |
|------------|-----------|--------|------------------------|------------------------|
| 角落搜索法     | O(m + n)  | O(1)   | 非常高效，实现简单             | 需要理解特定的搜索策略          |
| 二分查找法     | O(m log n)| O(1)   | 易于理解，二分查找是常见算法        | 对于大矩阵，比角落搜索法慢        |
| 分治法       | 最坏 O(m*n)| O(log(m*n)) | 适用于更一般的搜索问题          | 实现复杂，递归调用开销大         |

综合考虑，角落搜索法（方法一）是解决此问题最高效的方法，它充分利用了矩阵的特性，时间复杂度为 O(m + n)，空间复杂度为 O(1)。

## 关键学习点

1. **利用数据结构特性**：矩阵的排序特性使我们能够设计出 O(m+n) 的算法。在解决问题时，充分理解并利用数据的特殊性质往往能找到最优解。

2. **搜索空间缩减**：角落搜索法的核心思想是每次操作都能排除一行或一列，有效地缩小搜索空间。

3. **多种解法思考**：同一个问题可以有多种解法，从暴力法到优化解法，通过比较不同算法的复杂度，可以找到最适合的解决方案。

4. **二维空间的搜索技巧**：对于二维空间的搜索问题，可以考虑从特殊点（如角落）开始，利用排序特性引导搜索方向。 