---
title: ❌ LeetCode 215 - 数组中的第K个最大元素 (超时分析与优化)
date: 2025-05-13 16:07:14
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 快速选择
- 数组
- Medium
- LeetCode
- ❌错题集
- Hot100
description: 对 LeetCode 215 题 “数组中的第K个最大元素” 的 Quick Select 解法进行超时分析，并提供优化后的正确题解，强调了算法关键点和可读性。
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
func findKthLargest(nums []int, k int) int {
  n := len(nums)
  if n == 0 || k > n {
    return 0
  }

  left, right := 0, n-1

  for left < right {
    pivot := left + rand.Intn(right-left+1)
    nums[left], nums[pivot] = nums[pivot], nums[left]
    tmpLeft, tmpRight := left, right
    tmp := nums[left]
    for tmpLeft < tmpRight {
      for tmpLeft < tmpRight && nums[tmpRight] < tmp {
        tmpRight--
      }
      nums[tmpLeft] = nums[tmpRight]

      // 错误的分区条件
      for tmpLeft < tmpRight && nums[tmpLeft] > tmp {
        tmpLeft++
      }
      nums[tmpRight] = nums[tmpLeft]
    }
    nums[tmpLeft] = tmp

    if tmpLeft == k-1 {
      break
    }
    if tmpLeft < k-1 {
      left = tmpLeft + 1
    } else {
      right = tmpLeft - 1
    }
  }

  return nums[k-1]

}
```

### 错误原因分析

- **分区判断不严谨**：错误代码中左侧分区使用 `for tmpLeft < tmpRight && nums[tmpLeft] > tmp`，跳过了等于基准值的元素，导致分区不均衡，在存在大量重复或极端分布时，退化为 O(n²) 耗时。
- **随机枢轴未充分利用**：在重复元素较多或近似有序的数组上，未能有效打乱数据顺序，分区效率低下。

通过将左侧分区条件修改为 `nums[tmpLeft] >= tmp`、在达到目标位置后及时退出循环，并结合合理的随机枢轴抽取，可保证平均 O(n) 性能。

## 正确解法

快速选择（Quick Select）算法是解决"第 k 大/小元素"问题的经典方法，它是快速排序的变种，平均时间复杂度为 O(n)，远优于完全排序的 O(n log n)。

### 解题原理

#### 快速选择的本质原理

快速选择算法的核心思想非常直接：**我们不需要知道整个数组的排序情况，只需要确定第 k 大元素在哪里**。这就像在一群人中找到身高排第 k 高的人，我们不需要把所有人按身高排好队，只需要找到那个特定位置的人。

想象你手里有一堆扑克牌，要找到大小排第 k 的牌：

1. 你随机抽一张牌作为"参考牌"
2. 把比参考牌大的放左边，比参考牌小的放右边
3. 看看参考牌现在是第几位：
   - 如果正好是第 k 位，恭喜你找到了答案！
   - 如果参考牌排在第 j 位且 j<k，说明目标在右边那堆牌里
   - 如果 j>k，说明目标在左边那堆牌里
4. 只在可能包含目标的那一堆牌中重复上述过程

**这种"排除法"的精妙之处**在于：每次操作后，我们可以确定一个元素的最终位置，并排除掉一大半不可能包含答案的元素。我们不断缩小搜索范围，直到找到答案。

#### 为什么会超时？重复元素的陷阱

在有大量重复元素的情况下，如果我们把"等于参考牌"的牌全都放在一边（比如都放在大于参考牌的一组），会导致分区极度不平衡。最坏情况下，每次只能排除一个元素，算法就退化为 O(n²)。

这就像在找第 k 高的人时，如果有很多人身高相同，而我们将所有相同身高的人都放在同一组，可能导致每次只能排除很少的人，效率大大降低。

#### 随机选择的威力

随机选择参考元素是另一个关键点。如果总是选第一个元素作为参考，遇到已排序或特殊构造的数组时会陷入最坏情况。随机选择就像是在扑克牌中闭眼随机抽一张作为参考，这样不管牌是否有序，都能以较高概率获得平衡的分区。

**随机化使算法具有"概率意义上的稳健性"**—算法的期望运行时间是 O(n)，即使在最坏数据分布下也很难触发最坏情况。

#### 时空复杂度解析

从数学角度看，快速选择的平均时间复杂度是 O(n)，这是因为：

- 第一次分区需要比较 n 个元素
- 第二次大约需要比较 n/2 个元素
- 第三次约 n/4 个元素
- 以此类推...

最终得到：n + n/2 + n/4 + ... ≈ 2n，所以复杂度是 O(n)。

相比之下，如果用排序算法，必须把所有元素都排好序，至少需要 O(n log n)的时间复杂度。快速选择巧妙地避开了"完全排序"这一昂贵操作，直接定位到我们关心的那个位置。

### 代码实现与讲解

```go
func findKthLargest(nums []int, k int) int {
  n := len(nums)
  if n == 0 || k > n {
    return 0  // 边界检查，确保k有效
  }

  left, right := 0, n-1

  for left < right {
    // 随机选择基准值，避免最坏情况
    pivot := left + rand.Intn(right-left+1)
    nums[left], nums[pivot] = nums[pivot], nums[left]  // 将基准值交换到左侧

    tmpLeft, tmpRight := left, right
    tmp := nums[left]  // 保存基准值

    // 快速排序的分区过程
    for tmpLeft < tmpRight {
      // 从右向左找到第一个大于等于基准值的元素
      for tmpLeft < tmpRight && nums[tmpRight] < tmp {
        tmpRight--
      }
      nums[tmpLeft] = nums[tmpRight]  // 将该元素放到左侧

      // 修正分区条件：包含等于基准值的元素，避免倾斜分区
      // 在存在大量重复元素时，这个修正至关重要
      for tmpLeft < tmpRight && nums[tmpLeft] >= tmp {
        tmpLeft++
      }
      nums[tmpRight] = nums[tmpLeft]  // 将该元素放到右侧
    }

    // 将基准值放到最终位置
    nums[tmpLeft] = tmp

    // 根据基准值位置调整搜索区间
    if tmpLeft == k-1 {
      break  // 达到目标位置后及时退出，找到第k大元素
    }
    if tmpLeft < k-1 {
      left = tmpLeft + 1  // 在右侧区间继续寻找
    } else {
      right = tmpLeft - 1  // 在左侧区间继续寻找
    }
  }

  // 此时第k大的元素已经位于正确的位置
  return nums[k-1]
}
```

## 复杂度分析与优化总结

### 时间复杂度

- **平均情况**：O(n)
  - 每次分区操作能够排除约一半的元素
  - 总体递归深度为 O(log n)，每层处理 O(n)个元素
  - 数学表达：T(n) = T(n/2) + O(n) = O(n)
- **最坏情况**：O(n²)
  - 如果每次选择的基准值都是最大或最小元素
  - 但随机选择基准值使最坏情况的概率变得极低

### 空间复杂度

- **O(1)** - 原地操作，只使用常数额外空间
- 没有使用递归，避免了递归栈的空间消耗
