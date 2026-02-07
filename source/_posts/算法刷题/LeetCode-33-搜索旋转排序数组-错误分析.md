---
title: ❌ LeetCode 33 - 搜索旋转排序数组错误分析
date: 2025-05-08 20:30:00
categories:
- 算法刷题
- LeetCode
- 二分查找
tags:
- 二分查找
- Medium
- LeetCode
- ❌错题集
- Hot100
description: 分析在旋转排序数组中查找旋转点的常见错误，以及更优雅高效的解法
---
## 问题描述

[搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/) 是一个经典的二分查找变种问题：

整数数组 `nums` 按升序排列，数组中的值 **互不相同** 。

在传递给函数之前，`nums` 在预先未知的某个下标 `k` 上进行了旋转，使数组变为 `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`（下标 **从 0 开始** 计数）。例如， `[0,1,2,4,5,6,7]` 在下标 `3` 处经旋转后可能变为 `[4,5,6,7,0,1,2]` 。

给你 **旋转后** 的数组 `nums` 和一个整数 `target` ，如果 `nums` 中存在这个目标值 `target` ，则返回它的下标，否则返回 `-1` 。

你必须设计一个时间复杂度为 `O(log n)` 的算法解决此问题。

**示例 1：**

```
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
```

**示例 2：**

```
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
```

**示例 3：**

```
输入：nums = [1], target = 0
输出：-1
```

## 错误解法与分析

我初始的解法思路是：
1. 先找到旋转点（数组中值突然下降的位置）
2. 根据旋转点将数组分成两部分
3. 确定 target 在哪个部分，然后在相应部分中使用二分查找

代码实现如下：

```go
func search(nums []int, target int) int {
	// 找到旋转点
	n := len(nums)
	if n == 0 {
		return -1
	}

	rotateIdx := sort.Search(n, func(i int) bool {
		return nums[i] > nums[i+1]  // ❌ 错误点：可能导致数组越界
	})

	if rotateIdx == n-1 {
		rotateIdx = -1
	}

	if rotateIdx == -1 || target < nums[0] {
		idx := sort.SearchInts(nums[rotateIdx+1:], target)
		if idx+rotateIdx+1 < n && nums[idx+rotateIdx+1] == target {
			return idx + rotateIdx + 1
		}
	} else {
		idx := sort.SearchInts(nums[:rotateIdx+1], target)
		if idx < rotateIdx+1 && nums[idx] == target {
			return idx
		}
	}

	return -1
}
```

### 错误原因分析

这个解法存在几个严重问题：

1. **数组越界风险**：在使用 `sort.Search` 查找旋转点时，回调函数 `return nums[i] > nums[i+1]` 可能导致数组越界。当 `i = n-1` 时，`nums[i+1]` 会访问超出数组范围的元素。

2. **标准二分搜索不适合查找旋转点**：
   - `sort.Search` 假设数组满足某种单调性，查找第一个使谓词函数为true的索引
   - 但在旋转数组中，**谓词函数 `nums[i] > nums[i+1]` 不具有预期的单调性**
   - 对于完全有序的数组（如 `[1,2,3,4]`），不存在 `nums[i] > nums[i+1]` 的情况，此时 `sort.Search` 会返回 `n`，超出数组有效范围

3. **旋转点查找逻辑不完善**：
   - 代码通过检查 `rotateIdx == n-1` 试图解决完全有序的情况，但这个修复不彻底且容易误判
   - 当数组只有一个元素时也可能出现问题

4. **复杂且不直观**：这种"先找旋转点再搜索"的两步法使代码变得复杂，且容易出错

## 正确查找旋转点的方法

如果确实需要先找到旋转点，下面是一个更可靠的方法：

```go
func findRotateIndex(nums []int) int {
    left, right := 0, len(nums)-1
    
    // 如果数组完全有序（未旋转）
    if nums[left] <= nums[right] {
        return 0 // 或返回-1，表示无旋转
    }
    
    // 二分查找旋转点
    for left < right {
        mid := left + (right-left)/2
        
        if nums[mid] > nums[right] {
            // 旋转点在右半部分
            left = mid + 1
        } else {
            // 旋转点在左半部分或就是mid
            right = mid
        }
    }
    
    return left // 此时left就是旋转点
}
```

这个查找旋转点的算法基于以下观察：
- 如果 `nums[mid] > nums[right]`，说明旋转点在 `mid` 之后
- 否则，旋转点在 `mid` 或之前

与 `sort.Search` 不同，这个算法明确利用了旋转数组的特性，不依赖于索引访问的单调性，也不会有数组越界问题。

## 最优解法：一步到位

一个更优雅的解决方案是利用旋转排序数组的一个关键特性：**将数组一分为二，至少有一半是有序的**。我们可以在二分查找的同时确定目标值的位置，无需先找到旋转点。

```go
func search(nums []int, target int) int {
	n := len(nums)
	if n == 0 {
		return -1
	}
	
	left, right := 0, n-1
	
	for left <= right {
		mid := left + (right-left)/2
		
		if nums[mid] == target {
			return mid
		}
		
		// 判断哪一部分是有序的
		if nums[left] <= nums[mid] { // 左半部分有序
			if nums[left] <= target && target < nums[mid] {
				// target在左半部分
				right = mid - 1
			} else {
				// target在右半部分
				left = mid + 1
			}
		} else { // 右半部分有序
			if nums[mid] < target && target <= nums[right] {
				// target在右半部分
				left = mid + 1
			} else {
				// target在左半部分
				right = mid - 1
			}
		}
	}
	
	return -1
}
```

### 为什么这个解法可以工作

这个解法基于以下观察：

1. 在旋转排序数组中，无论如何切分，总有一部分是有序的
   - 如果 `nums[left] <= nums[mid]`，则左半部分有序
   - 否则，右半部分有序

2. 知道哪部分有序后，我们可以快速判断 target 是否在有序部分范围内：
   - 如果 target 在有序部分范围内，我们只需在该部分继续搜索
   - 否则，target 必然在另一部分中

3. 每次迭代都会将搜索范围缩小一半，保持了二分查找的 O(log n) 复杂度

这种方法直接在二分查找过程中确定目标位置，无需先找到旋转点，代码更简洁，错误风险更小，从根本上避免了错误地应用标准二分查找来寻找旋转点。

## 学习总结

从这个错误中，我们可以学到几个重要的算法设计原则：

1. **谨慎使用标准库函数**：
   - 像 `sort.Search` 这样的标准库函数有特定的应用场景和假设条件
   - 在使用前，确保你的问题确实符合这些条件

2. **防止数组越界**：在编写涉及数组索引的代码时，始终要考虑边界条件，特别是使用 `i+1` 或 `i-1` 等操作时

3. **简化问题**：有时候，看似需要两步的操作（先找旋转点，再查找目标）可以通过巧妙的算法设计合并为一步，使代码更简洁、更可靠

4. **利用问题特性**：旋转排序数组的关键特性是"部分有序"，直接利用这一特性比试图恢复完全有序更高效

5. **二分查找的变种**：标准二分查找可以根据具体问题进行调整，关键是每次都将搜索空间减半，同时保持目标值在搜索空间内

这个问题提醒我们，在实现算法时，先思考问题的本质特性，往往能找到更简洁优雅的解法，而不是机械地套用标准算法模板。 