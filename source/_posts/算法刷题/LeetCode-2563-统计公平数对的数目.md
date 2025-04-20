---
title: "LeetCode 2563 - 统计公平数对的数目（Count the Number of Fair Pairs）"
date: 2025-04-20 13:18:36
categories:
  - 算法刷题
tags:
  - 数组
  - 双指针
  - 二分查找
  - 排序
  - LeetCode
  - Medium
---

## 问题描述

给你一个下标从 0 开始、长度为 `n` 的整数数组 `nums` 和两个整数 `lower` 和 `upper`，返回公平数对的数目。

如果 `(i, j)` 数对满足以下情况，则认为是一个公平数对：
- `0 ≤ i < j < n` 且
- `lower ≤ nums[i] + nums[j] ≤ upper`

### 示例 1:

```
输入: nums = [0,1,7,4,4,5], lower = 3, upper = 6
输出: 6
解释: 共计 6 个公平数对: (0,3), (0,4), (0,5), (1,3), (1,4) 和 (1,5)。
```

### 示例 2:

```
输入: nums = [1,7,9,2,5], lower = 11, upper = 11
输出: 1
解释: 只有单个公平数对: (2,3)。
```

### 提示:

- `1 ≤ nums.length ≤ 10^5`
- `nums.length == n`
- `-10^9 ≤ nums[i] ≤ 10^9`
- `-10^9 ≤ lower ≤ upper ≤ 10^9`

## 解题思路

这道题目要求统计符合条件的数对数量，主要难点在于如何高效地找出所有满足 `lower ≤ nums[i] + nums[j] ≤ upper` 的数对。

一个常见的思路是使用嵌套循环枚举所有可能的数对，但这种方法的时间复杂度为 O(n²)，在数组长度较大时会超时。

我们可以利用**排序 + 二分查找**来优化解法：

1. 首先对数组 `nums` 进行排序
2. 对于每个元素 `nums[j]`，我们需要找出有多少个索引 `i (i < j)` 满足：
   - `lower ≤ nums[i] + nums[j] ≤ upper`
   - 即 `lower - nums[j] ≤ nums[i] ≤ upper - nums[j]`
3. 由于数组已排序，我们可以使用二分查找：
   - 找到第一个满足 `nums[i] ≥ lower - nums[j]` 的位置 `left`
   - 找到第一个满足 `nums[i] > upper - nums[j]` 的位置 `right`
   - 则满足条件的元素个数为 `right - left`

### 具体实现步骤

实现这个解法，我们可以按照以下步骤操作：

1. 对 `nums` 数组排序
2. 初始化计数器 `res = 0`
3. 遍历数组中的每个位置 `j`：
   - 对于当前元素 `nums[j]`，在 `nums[0...j-1]` 中二分查找：
     - 找到第一个大于等于 `lower - nums[j]` 的位置 `left`
     - 找到第一个大于 `upper - nums[j]` 的位置 `right`
   - 将 `right - left` 加到结果 `res` 上
4. 返回最终的 `res`

在 Golang 中，我们可以使用标准库中的 `sort.SearchInts` 函数来执行二分查找。

但实际上，这里有一个小问题需要注意：在题目中，我们需要找的是 `nums[i] ≤ upper - nums[j]` 的最右边界，而 `sort.SearchInts` 找的是第一个 `>=` 目标值的位置。所以我们需要查找的是 `upper - nums[j] + 1`，即找到第一个大于 `upper - nums[j]` 的位置。

## 代码实现

```go
func countFairPairs(nums []int, lower int, upper int) (res int64) {
	sort.Ints(nums)

	for j := 0; j < len(nums); j++ {
		right := sort.SearchInts(nums[:j], upper-nums[j]+1)
		left := sort.SearchInts(nums[:j], lower-nums[j])
		res += int64(right - left)
	}

	return
}
```

### 执行过程分析

让我们以示例 1 为例，跟踪代码的执行过程：

```
nums = [0,1,7,4,4,5], lower = 3, upper = 6
```

排序后：
```
nums = [0,1,4,4,5,7]
```

遍历每个位置 j：

- j = 0: 没有比 0 更小的索引，跳过
- j = 1: nums[1] = 1
  - 在 nums[0:1] = [0] 中查找 ≥ lower-nums[1] = 3-1 = 2 的位置 left = 1
  - 在 nums[0:1] = [0] 中查找 ≥ upper-nums[1]+1 = 6-1+1 = 6 的位置 right = 1
  - 添加 right-left = 1-1 = 0 对
- j = 2: nums[2] = 4
  - 在 nums[0:2] = [0,1] 中查找 ≥ lower-nums[2] = 3-4 = -1 的位置 left = 0
  - 在 nums[0:2] = [0,1] 中查找 ≥ upper-nums[2]+1 = 6-4+1 = 3 的位置 right = 2
  - 添加 right-left = 2-0 = 2 对: (0,2), (1,2)
- j = 3: nums[3] = 4
  - 在 nums[0:3] = [0,1,4] 中查找 ≥ lower-nums[3] = 3-4 = -1 的位置 left = 0
  - 在 nums[0:3] = [0,1,4] 中查找 ≥ upper-nums[3]+1 = 6-4+1 = 3 的位置 right = 2
  - 添加 right-left = 2-0 = 2 对: (0,3), (1,3)
- j = 4: nums[4] = 5
  - 在 nums[0:4] = [0,1,4,4] 中查找 ≥ lower-nums[4] = 3-5 = -2 的位置 left = 0
  - 在 nums[0:4] = [0,1,4,4] 中查找 ≥ upper-nums[4]+1 = 6-5+1 = 2 的位置 right = 2
  - 添加 right-left = 2-0 = 2 对: (0,4), (1,4)
- j = 5: nums[5] = 7
  - 在 nums[0:5] = [0,1,4,4,5] 中查找 ≥ lower-nums[5] = 3-7 = -4 的位置 left = 0
  - 在 nums[0:5] = [0,1,4,4,5] 中查找 ≥ upper-nums[5]+1 = 6-7+1 = 0 的位置 right = 0
  - 添加 right-left = 0-0 = 0 对

最终结果: 0 + 0 + 2 + 2 + 2 + 0 = 6 对，符合预期。

## 复杂度分析

- **时间复杂度**: O(n log n)
  - 排序的时间复杂度为 O(n log n)
  - 遍历数组需要 O(n)，每次遍历中进行两次二分查找，每次二分查找的时间复杂度为 O(log n)
  - 总时间复杂度为 O(n log n)

- **空间复杂度**: O(log n) 或 O(n)
  - 除了输入数组外，排序可能需要 O(log n) 的栈空间
  - 如果排序算法就地进行，则额外空间复杂度为 O(log n)
  - 如果使用额外空间进行排序，则空间复杂度为 O(n)

## 关键收获

1. **排序 + 二分查找**: 这是解决区间查询问题的一种常见技巧。先将数组排序，然后通过二分查找快速确定符合条件的元素范围。

2. **等价转换**: 将条件 `lower ≤ nums[i] + nums[j] ≤ upper` 转换为 `lower - nums[j] ≤ nums[i] ≤ upper - nums[j]`，这样可以对固定的 `nums[j]` 查找符合条件的 `nums[i]`。

3. **边界处理**: 在使用标准库的二分查找函数时，需要正确理解函数的行为和边界处理。例如，`sort.SearchInts` 返回的是第一个大于等于目标值的位置，如果想找最后一个小于等于目标值的位置，需要做相应调整。

4. **索引范围控制**: 在二分查找中，需要明确在哪个范围内查找。在本题中，我们只在 `nums[0:j]` 范围内查找，确保 `i < j`。

这道题是对二分查找和排序应用的一个很好的例子，展示了如何通过预处理和高效的查找算法将时间复杂度从 O(n²) 优化到 O(n log n)。 