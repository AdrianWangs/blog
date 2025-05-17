---
title: LeetCode 35 - 搜索插入位置与Go语言二分搜索全解析
date: 2025-05-08 10:39:16
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 二分查找
- 数组
- Easy
- LeetCode
- Go
- Hot100
description: 深入剖析LeetCode 35题及Go语言中的二分搜索函数，包括sort包中的各类二分搜索API、常见变体与应用场景，帮助读者全面掌握二分搜索技巧。
---
## 问题描述

给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 $O(log n)$ 的算法。

**示例 1:**
```
输入: nums = [1,3,5,6], target = 5
输出: 2
```

**示例 2:**
```
输入: nums = [1,3,5,6], target = 2
输出: 1
```

**示例 3:**
```
输入: nums = [1,3,5,6], target = 7
输出: 4
```

**提示:**
- $1 <= nums.length <= 10^4$
- $-10^4 <= nums[i] <= 10^4$
- nums 为 **无重复元素** 的 **升序** 排列数组
- $-10^4 <= target <= 10^4$

## 解题思路

这道题要求我们在排序数组中找到目标值的位置，如果目标值不存在，则返回它应该被插入的位置。由于题目要求算法时间复杂度为 O(log n)，很明显需要使用二分搜索。

对于此类问题，我们需要找到**第一个大于等于目标值**的元素索引，这正是二分搜索的一个常见应用场景。

### 二分搜索基本原理

二分搜索的基本思想是将查找范围逐步缩小为原来的一半，直到找到目标元素或确定目标元素不存在。具体步骤如下：

1. 设置左边界 `left = 0` 和右边界 `right = n - 1`
2. 当 `left <= right` 时，计算中间位置 `mid = left + (right - left) / 2`
3. 如果 `nums[mid] == target`，返回 `mid`
4. 如果 `nums[mid] < target`，说明目标在右半部分，设置 `left = mid + 1`
5. 如果 `nums[mid] > target`，说明目标在左半部分，设置 `right = mid - 1`
6. 如果循环结束后仍未找到目标，那么 `left` 就是目标值应该插入的位置

## Go语言中的二分搜索

Go语言标准库中的 `sort` 包提供了一系列的二分搜索函数，非常适合用来解决此类问题。接下来，让我们详细介绍这些函数。

### 1. sort.Search - 通用二分搜索函数

`sort.Search` 是Go语言二分搜索的核心函数，其他几个搜索函数都是基于它实现的。其函数签名为：

```go
func Search(n int, f func(int) bool) int
```

这个函数在`[0, n)`范围内搜索，返回使函数 `f(i)` 首次返回 `true` 的最小索引 `i`。如果没有这样的索引，则返回 `n`。

**重要特性：**

- 函数 `f` 必须满足对于某个索引 `k`，当 `i < k` 时，`f(i) = false`；当 `i >= k` 时，`f(i) = true`
- 如果对于所有的 `i` 都有 `f(i) = false`，则返回 `n`
- 如果对于所有的 `i` 都有 `f(i) = true`，则返回 `0`

这个函数非常灵活，可以用来实现各种二分搜索变体。

### 2. sort.SearchInts - 整数切片搜索

```go
func SearchInts(a []int, x int) int
```

`SearchInts` 在已排序的整数切片 `a` 中搜索 `x`，返回 `x` 应该插入的位置（即第一个大于等于 `x` 的元素的位置）。如果 `a` 中所有元素都小于 `x`，则返回 `len(a)`。

### 3. sort.SearchFloat64s - 浮点数切片搜索

```go
func SearchFloat64s(a []float64, x float64) int
```

`SearchFloat64s` 在已排序的浮点数切片 `a` 中搜索 `x`，用法与 `SearchInts` 类似。

### 4. sort.SearchStrings - 字符串切片搜索

```go
func SearchStrings(a []string, x string) int
```

`SearchStrings` 在已排序的字符串切片 `a` 中搜索 `x`，用法与 `SearchInts` 类似。

### 5. 自定义比较函数搜索

对于复杂的数据结构，可以结合 `sort.Search` 和自定义比较函数来实现二分搜索。

## 代码实现

### 方法一：使用 sort.Search

```go
func searchInsert(nums []int, target int) int {
    n := len(nums)
    return sort.Search(n, func(i int) bool {
        return nums[i] >= target
    })
}
```

这个实现非常简洁，使用 `sort.Search` 函数查找第一个大于等于 `target` 的元素索引。判断函数 `func(i int) bool { return nums[i] >= target }` 用于确定索引 `i` 处的元素是否大于等于目标值。

### 方法二：手写二分搜索

```go
func searchInsert(nums []int, target int) int {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    
    return left
}
```

这个实现是经典的二分搜索算法。当循环结束时，`left` 就是目标值应该插入的位置。

## 二分搜索的常见变体及应用场景

二分搜索有多种变体，适用于不同的场景：

### 1. 查找值是否存在

这是最基本的二分搜索，用于确定一个值是否在有序数组中。

```go
func binarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid // 找到目标值，返回索引
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    
    return -1 // 目标值不存在
}
```

在Go中可以使用：

```go
idx := sort.SearchInts(nums, target)
if idx < len(nums) && nums[idx] == target {
    // 找到目标值
} else {
    // 目标值不存在
}
```

### 2. 查找第一个大于等于目标值的元素（本题）

查找第一个大于等于目标值的元素，是 `sort.Search` 和 `sort.SearchInts` 的默认行为。

```go
// 使用sort.Search
idx := sort.Search(len(nums), func(i int) bool {
    return nums[i] >= target
})

// 使用sort.SearchInts
idx := sort.SearchInts(nums, target)
```

### 3. 查找第一个大于目标值的元素

```go
idx := sort.Search(len(nums), func(i int) bool {
    return nums[i] > target
})
```

### 4. 查找最后一个小于等于目标值的元素

```go
idx := sort.Search(len(nums), func(i int) bool {
    return nums[i] > target
}) - 1
if idx >= 0 {
    // 找到了最后一个小于等于目标值的元素
} else {
    // 没有小于等于目标值的元素
}
```

### 5. 查找最后一个小于目标值的元素

```go
idx := sort.Search(len(nums), func(i int) bool {
    return nums[i] >= target
}) - 1
if idx >= 0 {
    // 找到了最后一个小于目标值的元素
} else {
    // 没有小于目标值的元素
}
```

## 实际应用场景

二分搜索在实际编程中有很多应用场景：

### 1. 旋转排序数组中的搜索（LeetCode 33）

```go
func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }
        
        if nums[left] <= nums[mid] {
            // 左半部分有序
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            // 右半部分有序
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    
    return -1
}
```

### 2. 二分查找答案（二分答案）

例如，求平方根（LeetCode 69）：

```go
func mySqrt(x int) int {
    if x <= 1 {
        return x
    }
    
    left, right := 1, x/2
    for left <= right {
        mid := left + (right-left)/2
        if mid <= x/mid && (mid+1) > x/(mid+1) {
            return mid
        } else if mid > x/mid {
            right = mid - 1
        } else {
            left = mid + 1
        }
    }
    
    return left
}
```

### 3. 查找峰值元素（LeetCode 162）

```go
func findPeakElement(nums []int) int {
    left, right := 0, len(nums)-1
    
    for left < right {
        mid := left + (right-left)/2
        if nums[mid] > nums[mid+1] {
            right = mid
        } else {
            left = mid + 1
        }
    }
    
    return left
}
```

### 4. 在2D矩阵中二分查找（LeetCode 240）

```go
func searchMatrix(matrix [][]int, target int) bool {
    if len(matrix) == 0 || len(matrix[0]) == 0 {
        return false
    }
    
    rows, cols := len(matrix), len(matrix[0])
    row, col := 0, cols-1
    
    for row < rows && col >= 0 {
        if matrix[row][col] == target {
            return true
        } else if matrix[row][col] > target {
            col--
        } else {
            row++
        }
    }
    
    return false
}
```

## 注意事项和常见错误

使用二分搜索时，有几个常见的注意事项和潜在错误：

1. **整数溢出**：计算中间索引时，应使用 `mid := left + (right-left)/2` 而不是 `mid := (left+right)/2`，后者在大数据范围时可能导致整数溢出。

2. **循环条件**：根据需要选择 `left <= right` 或 `left < right`。前者在循环结束时有 `left = right + 1`，后者在循环结束时有 `left = right`。

3. **边界更新**：根据不同的搜索需求，边界更新方式也不同。例如，查找第一个满足条件的元素时，可能需要 `right = mid`，而不是 `right = mid - 1`。

4. **判断函数设计**：使用 `sort.Search` 时，判断函数必须满足单调性。

5. **返回值处理**：当使用 `sort.Search` 或 `sort.SearchInts` 等函数时，需要检查返回的索引是否在有效范围内。

## 复杂度分析

对于二分搜索：
- 时间复杂度：$O(\log n)$，其中 $n$ 是数组的长度。每次操作都会将搜索范围缩小为原来的一半。
- 空间复杂度：$O(1)$，只使用了常数额外空间。

## 总结

二分搜索是一种强大的算法技术，Go语言的标准库提供了多种便捷的二分搜索函数。通过本文的示例和解析，我们不仅解决了LeetCode 35题，还深入学习了Go语言中二分搜索的各种变体和应用场景。

**关键收获：**

1. 掌握 `sort.Search` 及其变体函数的用法和特性
2. 了解五种常见的二分搜索变体及其适用场景
3. 学会处理二分搜索中的边界条件和常见错误
4. 掌握在实际编程中应用二分搜索的技巧

记住，二分搜索不仅限于在数组中查找元素，还可以用于各种需要在有序空间中高效查找的场景，如二分答案、查找边界等。灵活运用这种算法技术，将大大提高我们解决问题的效率。 