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

虽然Go标准库的`sort.Search`非常强大且简洁，但在面试或需要高度自定义的场景中，手写二分搜索仍然是一项必备技能。

下面是针对本题"查找第一个大于等于目标值的元素"的经典实现。

```go
func searchInsert(nums []int, target int) int {
	n := len(nums)
	left, right := 0, n-1

	// 循环终止条件 left > right
	for left <= right {
		// mid := left + (right-left)>>1 可防止left+right溢出
		mid := (left + right) >> 1
		
		// 如果 mid 的值大于等于 target，说明目标在左半部分或就是 mid
		// 我们不能排除 mid，所以尝试在 [left, mid-1] 中继续寻找更靠前的插入点
		if nums[mid] >= target {
			right = mid - 1
		} else {
			// 如果 mid 的值小于 target，说明目标必定在右半部分
			// mid 以及其左边的元素都可以被排除，所以从 [mid+1, right] 继续寻找
			left = mid + 1
		}
	}

	// 循环结束后，left 就是目标值应该插入的位置
	return left
}
```

这个实现是经典的二分搜索算法。当循环结束时，`left` 就是目标值应该插入的位置。

### 手写二分搜索深度解析

上面的代码虽然简洁，但包含了很多二分搜索的细节。为了彻底理解它，我们来拆解一下：

#### 1. 核心问题转化

首先，我们要把原问题"如果找到就返回索引，如果找不到就返回插入位置"转化为一个更清晰的数学表述：**在有序数组中，查找第一个大于或等于 `target` 的元素的索引**。

不信可以试试：
- 对于 `[1,3,5,6]` 和 `target = 5`，第一个大于等于5的元素是5，索引为2。
- 对于 `[1,3,5,6]` 和 `target = 2`，第一个大于等于2的元素是3，索引为1。
- 对于 `[1,3,5,6]` 和 `target = 7`，数组中没有大于等于7的元素，但如果插入，它应该在所有元素之后，也就是索引4的位置。

#### 2. 定义与维护搜索区间 `[left, right]`

- **定义**：我们采用闭区间 `[left, right]` 来定义搜索范围。这意味着在每一轮循环开始时，我们都假设要找的答案位于 `nums[left]` 到 `nums[right]`（包含边界）之间。
- **初始化**：`left = 0`, `right = len(nums) - 1`，初始搜索区间覆盖整个数组。
- **循环条件**：`left <= right`。只要区间有效（`left` 不大于 `right`），搜索就继续。当 `left == right` 时，区间还有一个元素 `nums[left]`，也需要被检查。当 `left` 最终越过 `right`（即 `left = right + 1`），循环终止，说明搜索区间为空。

#### 3. 区间收缩的精髓

这是二分查找最核心的逻辑，我们的目标是每一步都安全地排除掉一半的元素。

- `mid := (left + right) >> 1`: 计算中间点。
- `if nums[mid] >= target`:
  - **含义**：`nums[mid]` 这个元素**有可能是我们要找的答案**（比如它就是第一个大于等于`target`的元素），或者真正的答案在它的**左边**。
  - **操作**：我们不能排除 `mid`，但可以肯定地说，`mid` 右边的所有元素都**不是**我们要找的"第一个"大于等于`target`的元素。因此，我们将搜索范围收缩到左半部分，即 `right = mid - 1`。我们期待在 `[left, mid - 1]` 这个新区间里找到一个更靠前的、符合条件的位置。
- `else`: (`nums[mid] < target`)
  - **含义**：`nums[mid]` 比 `target` 还小，那么 `mid` 以及 `mid` 左边的所有元素**都不可能是**我们要找的答案。
  - **操作**：我们必须去右边寻找。将搜索范围收缩到右半部分，即 `left = mid + 1`。

#### 4. 深度剖析：为什么最后返回 `left`？

你问到了最关键的问题。要彻底想明白，我们需要引入一个编程中证明算法正确性的强大思想：**循环不变量 (Loop Invariant)**。

循环不变量是一个在循环开始前为真，并且在每次循环迭代后依然保持为真的性质。如果能找到一个合适的不变量，并证明它在循环结束后能引导我们得到正确答案，那么算法的正确性就得到了保证。

对于我们的二分搜索，我们可以定义这样一组不变量：

> 在 `for left <= right` 循环的**每一次迭代开始前**，`left` 和 `right` 指针都满足以下两个条件：
> 1.  `left` 指针左侧的所有元素（即 `nums[0...left-1]`）都 **严格小于** `target`。
> 2.  `right` 指针右侧的所有元素（即 `nums[right+1...n-1]`）都 **大于等于** `target`。

我们来验证一下这个不变量是否成立：

- **初始化**:
  - 循环开始前，`left = 0`, `right = n-1`。
  - `nums[0...-1]` 是一个空区间，所以"所有元素都小于 `target`"的说法天然成立。
  - `nums[n...n-1]` 也是一个空区间，所以"所有元素都大于等于 `target`"也天然成立。
  - **结论**：不变量在循环开始前是成立的。

- **保持 (Maintenance)**:
  - 假设在某一次循环开始时，不变量是成立的。我们来分析循环体内部的两种情况：
    1.  **当 `nums[mid] < target` 时**:
        - 这意味着 `nums[mid]` 以及它左边的所有元素都小于 `target`。
        - 我们执行 `left = mid + 1`。
        - 在下一次循环开始时，新的 `left` 指针是 `mid + 1`。`left` 左边的区间变成了 `nums[0...mid]`，这个区间内的所有元素确实都小于 `target`。`right` 指针没变，所以不变量的第二部分依然成立。
        - **结论**：不变量得以保持。
    2.  **当 `nums[mid] >= target` 时**:
        - 这意味着 `nums[mid]` 以及它右边的所有元素都大于等于 `target`。
        - 我们执行 `right = mid - 1`。
        - 在下一次循环开始时，新的 `right` 指针是 `mid - 1`。`right` 右边的区间变成了 `nums[mid...n-1]`，这个区间内的所有元素确实都大于等于 `target`。`left` 指针没变，所以不变量的第一部分依然成立。
        - **结论**：不变量得以保持。

- **终止 (Termination)**:
  - 循环在 `left > right` 时终止。此时，`left = right + 1`。
  - 我们再来看一下不变量在这一刻告诉了我们什么：
    1.  `left` 左侧的元素 `nums[0...left-1]` 都 `< target`。
    2.  `right` 右侧的元素 `nums[right+1...n-1]` 都 `>= target`。
  - 因为 `left = right + 1`，所以第二条可以改写为：`nums[left...n-1]` 都 `>= target`。
  - 把两条合在一起看：
    - `nums[left-1]` (如果存在) 是最后一个 `< target` 的元素。
    - `nums[left]` (如果存在) 是第一个 `>= target` 的元素。
  - 因此，`left` 正是那个分割点，它指向的位置就是第一个大于或等于 `target` 的元素应该在的位置，也就是我们苦苦寻找的**插入位置**。

这个逻辑可能初看有点绕，但它是理解二分搜索所有变体的基石。通过维护这个清晰的"< target"和">= target"的区间边界，我们最终就能精确地锁定目标位置。

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