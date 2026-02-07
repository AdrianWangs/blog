---
title: LeetCode 73 - 矩阵置零（Matrix Zeroes）解题思路与错误分析
date: 2025-06-04 11:33:48
categories:
- 算法刷题
- LeetCode
- 数组与哈希
tags:
- 数组
- 矩阵
- 原地算法
- 空间优化
- Medium
- ❌错题集
- Hot100
- 🔥二次错误
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

这道题我已经错了两次了，让我详细分析一下两次的错误原因。

### 第一次错误解法

第一次的解法没有保存第一行和第一列的原始状态：

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
1. **没有保存首行和首列的原始状态**：没有事先记录第一行和第一列是否原本就有0
2. **标记和置零顺序错误**：直接根据已被修改的首行首列进行置零操作
3. **处理第一行和第一列的交叉点问题**：matrix[0][0]同时表示行和列标记，信息冲突

### 第二次错误解法（最新的错误）

第二次我已经知道要保存第一行和第一列的原始状态，但在处理内部元素时又犯了新错误：

```go
func setZeroes(matrix [][]int) {
	row := len(matrix)
	col := len(matrix[0])

	row0, col0 := false, false

	// 正确保存了第一列的原始状态
	for i := range row {
		if matrix[i][0] == 0 {
			col0 = true
			break
		}
	}

	// 正确保存了第一行的原始状态
	for i := range col {
		if matrix[0][i] == 0 {
			row0 = true
			break
		}
	}
	
	// 正确标记了需要置零的行和列
	for i := 0; i < row; i++ {
		for j := 0; j < col; j++ {
			if matrix[i][j] == 0 {
				matrix[i][0] = 0
				matrix[0][j] = 0
			}
		}
	}

	// ❌ 错误：分离处理行和列，且从第0行开始
	for i := 0; i < row; i++ {
		if matrix[i][0] == 0 {
			for j := 1; j < col; j++ {
				matrix[i][j] = 0
			}
		}
	}
	for i := 0; i < col; i++ {
		if matrix[0][i] == 0 {
			for j := 1; j < row; j++ {
				matrix[j][i] = 0
			}
		}
	}

	// 后面的处理是正确的...
}
```

**第二次错误的关键问题**：

1. **错误的处理顺序**：从 i=0 开始处理行，这会影响第一行，但第一行应该最后单独处理
2. **分离处理逻辑错误**：用两个分离的循环分别处理行和列，而不是统一处理所有内部元素
3. **逻辑不一致**：这种分离处理可能导致某些位置被重复修改或遗漏

**正确的处理方式**应该是：
```go
// ✅ 正确：统一处理所有内部元素，从(1,1)开始
for i := 1; i < row; i++ {
    for j := 1; j < col; j++ {
        if matrix[i][0] == 0 || matrix[0][j] == 0 {
            matrix[i][j] = 0
        }
    }
}
```

### 错误原因总结

两次错误都反映了对原地算法的理解不够深入：

1. **第一次**：没有意识到需要保存第一行和第一列的原始状态
2. **第二次**：虽然保存了原始状态，但在处理内部元素时采用了错误的分离处理策略

**关键教训**：在原地修改矩阵时，必须严格区分：
- 信息收集阶段（标记）
- 信息处理阶段（置零内部元素）  
- 边界处理阶段（处理第一行第一列）

三个阶段不能混淆，否则会导致错误的结果。

## 总结

矩阵置零问题是一个典型的原地修改矩阵的问题，关键在于如何记录需要置零的行和列信息而不干扰原矩阵的遍历过程。我在这道题上犯了两次错误，深刻体现了原地算法的复杂性。

**最优解法的核心思想**：
1. 利用矩阵的第一行和第一列作为标记空间
2. 用额外变量记录第一行和第一列本身是否需要置零
3. 严格按照三个阶段执行：标记→处理内部→处理边界

**关键教训**：
- **第一次错误**教会我必须保存第一行第一列的原始状态
- **第二次错误**教会我不能分离处理行和列，必须统一处理所有内部元素
- **核心原则**：在原地算法中，要严格区分信息收集、信息处理和边界处理三个阶段，避免阶段间的相互干扰

这道题的空间复杂度可以优化到 O(1)，但实现的复杂度远高于看起来的样子。每一个细节都很重要，一个小的逻辑错误就可能导致整个算法失败。
