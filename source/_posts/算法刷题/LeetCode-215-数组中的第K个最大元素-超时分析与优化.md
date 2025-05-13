---
title: '❌ LeetCode 215 - 数组中的第K个最大元素 (超时分析与优化)'
date: 2025-05-13 16:07:14
categories:
  - 算法刷题
  - LeetCode
tags:
  - 快速选择
  - 数组
  - Medium
  - LeetCode
  - ❌错题集
description: '对 LeetCode 215 题 “数组中的第K个最大元素” 的 Quick Select 解法进行超时分析，并提供优化后的正确题解，强调了算法关键点和可读性。'
---

## 问题描述

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

**示例 1:**

```
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
```

**示例 2:**

```
输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
```

**约束条件:**

- `1 <= k <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

## 错误解法与分析

我最初使用快速选择（Quick Select）算法来解决这个问题，但在某些情况下遇到了超时问题。

### 最初的错误代码

```go
package main

import "math/rand"

// @lc code=start
func findKthLargest(nums []int, k int) int {
	n := len(nums)
	if n == 0 || k > n {
		return 0
	}

	left, right := 0, n-1

	for left <= right { // 初始循环条件是 left < right
		// 随机选择 pivot
		pivotIndex := left + rand.Intn(right-left+1)
		nums[left], nums[pivotIndex] = nums[pivotIndex], nums[left]

		// Partition 过程
		tmpLeft, tmpRight := left, right
		pivotValue := nums[left] // 基准值

		for tmpLeft < tmpRight {
			// 从右向左找第一个小于 pivotValue 的元素
			for tmpLeft < tmpRight && nums[tmpRight] < pivotValue { // 错误点1：这里应该是 >= pivotValue (对于找第k大) 或者 <= pivotValue (对于找第k小)
				tmpRight--
			}
			nums[tmpLeft] = nums[tmpRight] // 将较小的元素放到左边

			// 从左向右找第一个大于等于 pivotValue 的元素
			for tmpLeft < tmpRight && nums[tmpLeft] >= pivotValue { // 错误点2：这里应该是 <= pivotValue (对于找第k大) 或者 >= pivotValue (对于找第k小)
				tmpLeft++
			}
			nums[tmpRight] = nums[tmpLeft] // 将较大的元素放到右边
		}
		nums[tmpLeft] = pivotValue // 将基准值放到正确的位置

		// 检查基准值的位置
		if tmpLeft == k-1 {
			break // 错误点3：找到后仅 break，没有立即返回
		}
		if tmpLeft < k-1 {
			left = tmpLeft + 1
		} else {
			right = tmpLeft - 1
		}
	}

	return nums[k-1] // 错误点4：循环结束后，nums[k-1] 不一定是正确答案

}
// @lc code=end
```

### 错误原因分析

1.  **Partition 逻辑错误**：

    - 在寻找第 `k` 个**最大**元素时，Partition 的目标是将数组分为两部分：一部分元素 `>= pivotValue`（或者说，所有比 `pivotValue` 大的元素在左边，所有比 `pivotValue` 小的元素在右边，如果我们希望第 k 大的元素在左侧），另一部分元素 `< pivotValue`。
    - 原始代码中 `for tmpLeft < tmpRight && nums[tmpRight] < pivotValue` 和 `for tmpLeft < tmpRight && nums[tmpLeft] >= pivotValue` 的设计，试图将小于 `pivotValue` 的放右边，大于等于 `pivotValue` 的放左边（这是为了让 `pivotValue` 左边的元素都比它大或等于它，右边的都比它小）。
    - **举例说明 Partition 逻辑问题**:
      假设 `nums = [3,2,1,5,6,4]`, `k = 2`。我们要找第 2 大的元素。
      假设第一次随机选择 `pivotValue = 3` (nums[0])。
      `tmpLeft = 0`, `tmpRight = 5`, `pivotValue = 3`。
      内部循环 `for tmpLeft < tmpRight`:
      1.  `for tmpLeft < tmpRight && nums[tmpRight] < pivotValue`:
          - `nums[5] = 4` 不小于 `3`。
          - `nums[4] = 6` 不小于 `3`。
          - `nums[3] = 5` 不小于 `3`。
          - `nums[2] = 1` 小于 `3`。此时 `tmpRight = 2`。
      2.  `nums[tmpLeft] = nums[tmpRight]` => `nums[0] = nums[2]` => `nums = [1,2,1,5,6,4]`, `tmpLeft = 0`。
      3.  `for tmpLeft < tmpRight && nums[tmpLeft] >= pivotValue`:
          - `nums[0] = 1` 不大于等于 `3`。
      4.  `nums[tmpRight] = nums[tmpLeft]` => `nums[2] = nums[0]` => `nums = [1,2,1,5,6,4]`, `tmpRight = 2`。
          此时 `tmpLeft = 0`, `tmpRight = 2`。`tmpLeft < tmpRight` 仍然成立。
          再次循环：
      5.  `for tmpLeft < tmpRight && nums[tmpRight] < pivotValue`:
          - `nums[2] = 1` 小于 `3`。此时 `tmpRight = 2`。
      6.  `nums[tmpLeft] = nums[tmpRight]` => `nums[0] = nums[2]` => `nums = [1,2,1,5,6,4]`, `tmpLeft = 0`。
      7.  `for tmpLeft < tmpRight && nums[tmpLeft] >= pivotValue`:
          - `nums[0] = 1` 不大于等于 `3`。
      8.  `nums[tmpRight] = nums[tmpLeft]` => `nums[2] = nums[0]` => `nums = [1,2,1,5,6,4]`, `tmpRight = 2`。
          这里会陷入一个死循环，因为 `tmpLeft` 和 `tmpRight` 在这种情况下没有正确地向中间靠拢。
          正确的 Partition 逻辑（例如 Hoare's partition scheme 或者 Lomuto partition scheme）会确保指针正确移动并最终交叉。

2.  **未立即返回结果**：

    - 当 `tmpLeft == k-1` 时，表示我们已经找到了第 `k` 个最大的元素（因为数组下标是从 0 开始，所以第 `k` 大的元素下标是 `k-1`）。此时应该立即 `return nums[tmpLeft]`。
    - 原始代码中只是 `break` 了内部的 `for left <= right` 循环，然后执行了函数末尾的 `return nums[k-1]`。
    - **举例说明未立即返回的问题**:
      假设经过某次 Partition 后，`nums = [..., 5, ...]` 并且此时 `tmpLeft` 指向 `5`，且 `tmpLeft == k-1`。
      代码执行 `break`，跳出 `for left <= right` 循环。
      然后执行 `return nums[k-1]`。如果 `nums` 数组在 `break` 后到 `return nums[k-1]` 之间没有被修改，且 `tmpLeft` 确实是 `k-1`，那么结果是正确的。
      但是，如果 `break` 之后，`k-1` 位置的元素因为某种原因（虽然在这个特定代码结构中不太可能发生）被改变了，或者 `break` 的条件判断本身就有问题，那么依赖最后的 `return nums[k-1]` 是不健壮的。
      更主要的问题是，如果循环是因为 `left > right` 而结束（意味着没有在 `tmpLeft == k-1` 时 `break`），那么 `nums[k-1]` 的值就不一定是正确的第 `k` 大元素。例如，如果 `k=1` (找最大值)，目标下标是 `0`。如果第一次 partition 后 `tmpLeft = 2`，那么 `left` 会变成 `3`。如果后续 `left > right` 导致循环结束，此时 `nums[k-1]` 即 `nums[0]` 就不一定是最大值。

3.  **循环条件与最终返回值的关系**：

    - 如果循环因为 `left > right` 而终止（意味着搜索范围已经无效），并且之前没有在 `tmpLeft == k-1` 时返回，那么最后的 `return nums[k-1]` 几乎肯定是错误的。一个健壮的 Quick Select 实现应该在 `tmpLeft == k-1` 时直接返回值。

4.  **处理重复元素时的潜在效率问题**：
    - 当数组中存在大量重复元素，特别是当这些重复元素恰好是我们要找的第 `k` 大元素时，如果 Partition 逻辑中对于等于 `pivotValue` 的元素的处理不够好，可能会导致每次 Partition 后，搜索范围缩小的效率不高，极端情况下可能退化到 O(n^2)。
    - 例如，如果 `nums[tmpLeft] >= tmp`，当 `nums[tmpLeft] == tmp` 时，`tmpLeft` 也会 `++`，这可能导致 `pivotValue` 被移到不恰当的位置，或者使得某一侧的子数组过大。

这些问题综合起来，尤其是在特定测试用例下（比如包含大量重复元素，或者 `k` 值接近数组两端），很容易导致算法效率低下，从而超时。

## 正确解法

下面是优化后的 Quick Select 算法实现。

### 解题思路

快速选择算法是基于快速排序思想的一种选择算法，其平均时间复杂度为 O(n)。

1.  **选择基准 (Pivot)**：从数组中随机选择一个元素作为基准。为了避免最坏情况（例如数组已经有序或接近有序），随机选择基准是一个好策略。将基准元素与数组的第一个元素（或最后一个元素）交换位置，方便后续处理。
2.  **分区 (Partition)**：重新排列数组，使得所有小于基准的元素都移动到基准的左边，所有大于或等于基准的元素都移动到基准的右边。完成分区后，基准元素就位于其最终排序后的正确位置。
    - 我们使用双指针 `i` 和 `j`，`i` 从 `left + 1` 开始，`j` 从 `right` 开始。
    - 指针 `i` 向右移动，直到找到一个元素 `nums[i] < pivotValue`。
    - 指针 `j` 向左移动，直到找到一个元素 `nums[j] >= pivotValue`。
    - 如果 `i < j`，则交换 `nums[i]` 和 `nums[j]`。
    - 重复此过程，直到 `i >= j`。
    - 最后，将基准元素（最初放在 `nums[left]`）与 `nums[j]` 交换。此时 `nums[j]` 就是基准元素在排序后数组中的正确位置。
3.  **递归选择**：
    - 设基准元素的最终位置为 `pivotIndex` (即上面分区后的 `j`)。
    - 我们要找的是第 `k` 大的元素，其在 0-indexed 数组中的目标下标是 `targetIndex = k - 1`。
    - 如果 `pivotIndex == targetIndex`，那么 `nums[pivotIndex]` 就是我们要找的第 `k` 大的元素，直接返回。
    - 如果 `pivotIndex < targetIndex`，说明第 `k` 大的元素在基准的右侧，我们递归地在右子数组 `[pivotIndex + 1, right]` 中查找。
    - 如果 `pivotIndex > targetIndex`，说明第 `k` 大的元素在基准的左侧，我们递归地在左子数组 `[left, pivotIndex - 1]` 中查找。
4.  **边界条件**：当 `left == right` 时，子数组只有一个元素，这个元素就是当前子问题要找的元素。

为了找到第 `k` 个**最大**的元素，我们的 Partition 逻辑需要调整，使得大于等于基准的元素在左边，小于基准的元素在右边。或者，更直观地，我们可以寻找第 `(n - k + 1)` 个**最小**的元素，这样 Partition 逻辑就和标准的 Quick Sort 保持一致了。这里我们直接调整 Partition 逻辑来找第 `k` 大。

### 代码实现

```go
package main

import "math/rand"

func findKthLargest(nums []int, k int) int {
	n := len(nums)
	// 第 k 大的元素，在升序排序后，其下标为 n-k。
	// 例如，数组 [1,2,3,4,5,6]，n=6。
	// k=1 (第1大，是6)，目标下标 n-k = 6-1 = 5。
	// k=2 (第2大，是5)，目标下标 n-k = 6-2 = 4。
	// k=6 (第6大，是1)，目标下标 n-k = 6-6 = 0。
	targetSortedIndex := n - k

	left, right := 0, n-1

	for left <= right {
		// 1. 随机选择一个基准元素 (pivot)
		// 为了避免最坏情况 (如数组已排序或几乎排序)，随机选择 pivot 很重要。
		// 将选中的 pivot 与当前子数组的第一个元素交换，方便后续分区。
		pivotChoiceOriginalIndex := left + rand.Intn(right-left+1)
		nums[left], nums[pivotChoiceOriginalIndex] = nums[pivotChoiceOriginalIndex], nums[left]
		pivotValue := nums[left]

		// 2. 分区 (Partition) 操作
		// 使用 Hoare Partition Scheme:
		// 目标是将数组分为两部分：
		// - 左边部分的元素都 <= pivotValue
		// - 右边部分的元素都 >= pivotValue
		// i 指针从左向右扫描 (跳过 pivotValue 本身，从 left+1 开始)
		// j 指针从右向左扫描
		i := left + 1
		j := right

		for {
			// 从左向右找到第一个 > pivotValue 的元素
			// 注意边界 i <= j，防止 i 越过 j
			for i <= j && nums[i] <= pivotValue {
				i++
			}
			// 从右向左找到第一个 < pivotValue 的元素
			// 注意边界 i <= j，防止 j 越过 i
			for i <= j && nums[j] >= pivotValue {
				j--
			}

			// 如果 i 和 j 指针交叉，说明分区完成
			if i > j {
				break
			}

			// 交换 nums[i] 和 nums[j]
			nums[i], nums[j] = nums[j], nums[i]
			// 继续扫描 (在某些 Hoare 实现中，交换后 i++, j-- 是可选的，
			// 但如果加上，可以帮助更快地缩小范围，尤其是当有重复元素时)
			// 这里我们不立即移动 i, j，让外层循环的条件去判断
		}

		// 循环结束后，j 指向的是分区后左边部分的最后一个元素的下标。
		// (或者说，j 是最后一个使得 nums[j] <= pivotValue 的位置，如果从右边开始扫描的话)
		// (更准确地说，Hoare partition 后，pivot 的最终位置是 j)
		// 将 pivotValue (即 nums[left]) 与 nums[j] 交换，
		// 这样 pivotValue 就放到了它在排序后数组中的正确位置。
		nums[left], nums[j] = nums[j], nums[left]
		finalPivotIndex := j // 基准元素的最终下标

		// 3. 根据基准元素的最终位置，决定下一步搜索的范围
		if finalPivotIndex == targetSortedIndex {
			// 如果基准元素的下标正好是我们要找的目标下标，则返回该元素
			return nums[finalPivotIndex]
		} else if finalPivotIndex < targetSortedIndex {
			// 如果基准元素的下标小于目标下标，说明目标元素在基准的右侧
			left = finalPivotIndex + 1
		} else { // finalPivotIndex > targetSortedIndex
			// 如果基准元素的下标大于目标下标，说明目标元素在基准的左侧
			right = finalPivotIndex - 1
		}
	}

	// 理论上，上述循环总能找到 targetSortedIndex 并返回。
	// 添加此返回值是为了满足 Go 编译器的所有代码路径都有返回。
	// 在一个正确的实现中，这里不应该被执行到。
	return -1
}
```

### 复杂度分析

- **时间复杂度**:
  - 平均情况：O(n)。每次分区操作平均能将问题规模减半。
  - 最坏情况：O(n^2)。如果每次选择的基准都非常差（例如，总是选到最大或最小的元素），会导致分区极不平衡。但由于我们使用了随机选择基准的策略，最坏情况的概率非常低。
- **空间复杂度**: O(1)。我们是原地修改数组，没有使用额外的与输入规模相关的存储空间（递归版本会有 O(log n) 的栈空间，但迭代版本是 O(1)）。

## 关键收获

1.  **Quick Select 的核心是 Partition**：理解并正确实现 Partition 是关键。Hoare Partition 和 Lomuto Partition 是两种常见的方案。Hoare Partition 通常效率更高一些。
2.  **随机化 Pivot 选择**：可以有效避免最坏情况的发生，保证算法的平均性能。
3.  **确定目标下标**：要清楚第 `k` 大的元素在（升序）排序后的数组中对应的下标是什么。对于 0-indexed 数组，第 `k` 大的元素下标是 `n-k`。
4.  **立即返回**：当找到目标元素时，应立即返回，避免不必要的计算。
5.  **迭代实现**：迭代实现的 Quick Select 可以避免递归带来的额外栈空间开销，空间复杂度为 O(1)。
6.  **Hoare Partition 细节**：
    - `i` 和 `j` 指针的初始位置和移动条件。
    - 交换 `nums[i]` 和 `nums[j]` 后，`i` 和 `j` 是否需要立即移动。在上面的实现中，我们让外层循环的 `nums[i] <= pivotValue` 和 `nums[j] >= pivotValue` 来控制，这样更稳妥。
    - 循环终止条件 (`i > j`)。
    - 最后 `pivotValue` 与 `nums[j]` 交换。

通过这次错题分析，我对 Quick Select 算法的细节和易错点有了更深刻的理解。
