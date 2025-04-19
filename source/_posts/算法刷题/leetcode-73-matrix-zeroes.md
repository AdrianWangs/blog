---
title: LeetCode 73 - 矩阵置零（Matrix Zeroes）解题思路与错误分析
date: 2025-04-19 11:33:48
categories:
  - 算法刷题
  - LeetCode
tags:
  - 数组
  - 矩阵
  - 原地算法
  - 空间优化
  - Medium
  - ❌错题集
---

## 问题描述

给定一个 m x n 的矩阵，如果一个元素为 0，则将其所在行和列的所有元素都设为 0。请使用**原地**算法。

## 解题思路

这个问题看似简单，但实际上有一些需要注意的细节，特别是在原地修改矩阵时容易出现错误。我总结了三种解决方案，从简单到优化的顺序。

### 方法一：使用额外空间记录

最直观的方法是先遍历一次矩阵，记录哪些行和列需要置零，然后再进行置零操作。

```go
func setZeroes(matrix [][]int) {
    rows := len(matrix)
    cols := len(matrix[0])

    // 记录需要置零的行和列
    zeroRows := make([]bool, rows)
    zeroCols := make([]bool, cols)

    // 第一次遍历，标记需要置零的行和列
    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            if matrix[i][j] == 0 {
                zeroRows[i] = true
                zeroCols[j] = true
            }
        }
    }

    // 第二次遍历，执行置零操作
    for i := 0; i < rows; i++ {
        for j := 0; j < cols; j++ {
            if zeroRows[i] || zeroCols[j] {
                matrix[i][j] = 0
            }
        }
    }
}
```

- 时间复杂度：O(m\*n)，需要遍历矩阵两次
- 空间复杂度：O(m+n)，需要两个额外数组记录行列状态

### 方法二：使用矩阵首行和首列作为标记

为了优化空间复杂度，我们可以利用矩阵的第一行和第一列来记录哪些行和列需要置零。但需要特别处理第一行和第一列本身是否需要置零。

```go
func setZeroes(matrix [][]int) {
    rows := len(matrix)
    cols := len(matrix[0])

    // 标记第一行和第一列是否需要置零
    firstRowHasZero := false
    firstColHasZero := false

    // 检查第一行是否有零
    for j := 0; j < cols; j++ {
        if matrix[0][j] == 0 {
            firstRowHasZero = true
            break
        }
    }

    // 检查第一列是否有零
    for i := 0; i < rows; i++ {
        if matrix[i][0] == 0 {
            firstColHasZero = true
            break
        }
    }

    // 使用第一行和第一列记录其他行列的零状态
    for i := 1; i < rows; i++ {
        for j := 1; j < cols; j++ {
            if matrix[i][j] == 0 {
                matrix[i][0] = 0
                matrix[0][j] = 0
            }
        }
    }

    // 根据第一行和第一列的标记，置零其他行和列
    for i := 1; i < rows; i++ {
        for j := 1; j < cols; j++ {
            if matrix[i][0] == 0 || matrix[0][j] == 0 {
                matrix[i][j] = 0
            }
        }
    }

    // 如果第一行有零，将第一行全部置零
    if firstRowHasZero {
        for j := 0; j < cols; j++ {
            matrix[0][j] = 0
        }
    }

    // 如果第一列有零，将第一列全部置零
    if firstColHasZero {
        for i := 0; i < rows; i++ {
            matrix[i][0] = 0
        }
    }
}
```

- 时间复杂度：O(m\*n)
- 空间复杂度：O(1)，只使用了常数个额外变量

### 方法三：进一步优化的原地算法

我们可以通过一个技巧进一步简化方法二，只使用第一行来记录信息，并用一个额外变量记录第一列的状态。

```go
func setZeroes(matrix [][]int) {
    rows := len(matrix)
    cols := len(matrix[0])
    firstColHasZero := false

    // 第一次遍历，标记第一行和第一列
    for i := 0; i < rows; i++ {
        // 检查第一列是否有零
        if matrix[i][0] == 0 {
            firstColHasZero = true
        }

        for j := 1; j < cols; j++ {
            if matrix[i][j] == 0 {
                matrix[i][0] = 0
                matrix[0][j] = 0
            }
        }
    }

    // 从后向前遍历，根据标记置零
    for i := rows - 1; i >= 0; i-- {
        for j := cols - 1; j >= 1; j-- {
            if matrix[i][0] == 0 || matrix[0][j] == 0 {
                matrix[i][j] = 0
            }
        }
        // 处理第一列
        if firstColHasZero {
            matrix[i][0] = 0
        }
    }
}
```

- 时间复杂度：O(m\*n)
- 空间复杂度：O(1)

## 我的错误分析

我最初的解法有几个关键错误：

```go
func setZeroes(matrix [][]int) {
	row := len(matrix)
	col := len(matrix[0])

	for i := 0; i < row; i++ {
		for j := 0; j < col; j++ {
			if matrix[i][j] == 0 {
				matrix[i][0] = 0
				matrix[0][j] = 0
			}
		}
	}

	for i := 0; i < row; i++ {
		if matrix[i][0] == 0 {
			for j := 0; j < col; j++ {
				matrix[i][j] = 0
			}
		}
	}
	for i := 0; i < col; i++ {
		if matrix[0][i] == 0 {
			for j := 0; j < row; j++ {
				matrix[j][i] = 0
			}
		}
	}
}
```

主要问题：

1. **没有保存首行和首列的原始状态**：我的代码使用第一行和第一列作为标记，但没有事先保存它们的原始状态。如果原矩阵的第一行或第一列中本来就有 0，会导致错误的标记传播。
2. **标记和置零顺序错误**：在没有保存原始状态的情况下，我直接根据首行首列的值进行置零操作，但这些值可能已经在第一次遍历过程中被修改了。
3. **处理第一行和第一列的交叉点问题**：matrix[0][0]同时表示第一行和第一列的标记，会导致信息冲突。正确做法是使用额外变量分别记录第一行和第一列是否需要置零。

## 总结

矩阵置零问题是一个典型的原地修改矩阵的问题，关键在于如何记录需要置零的行和列信息而不干扰原矩阵的遍历过程。

最优解法是利用矩阵的第一行和第一列作为标记空间，同时用额外的变量记录第一行和第一列本身是否需要置零。这样可以将空间复杂度优化到 O(1)。

在实现类似的原地算法时，应该注意分离"信息收集"和"修改执行"两个阶段，避免修改操作影响到信息收集的正确性。
