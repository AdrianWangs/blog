---
title: "LeetCode 560 - 和为 K 的子数组（Subarray Sum Equals K）"
date: 2025-07-26 15:59:27
categories:
  - 算法刷题
  - LeetCode
  - 数组与哈希
tags:
  - 数组
  - 哈希表
  - 前缀和
  - Medium
  - 面试经典150
  - LeetCode
description: "使用前缀和和哈希表解决子数组和问题，通过维护前缀和的出现次数来统计和为K的子数组数量"
---

## 问题描述

给你一个整数数组 `nums` 和一个整数 `k`，请你统计并返回该数组中和为 `k` 的子数组的个数。

子数组是数组中元素的连续非空序列。

**示例 1：**

```
输入：nums = [1,1,1], k = 2
输出：2
解释：和为 2 的子数组有 [1,1] 和 [1,1]
```

**示例 2：**

```
输入：nums = [1,2,3], k = 3
输出：2
解释：和为 3 的子数组有 [1,2] 和 [3]
```

**约束条件：**
- `1 <= nums.length <= 2 * 10^4`
- `-1000 <= nums[i] <= 1000`
- `-10^7 <= k <= 10^7`

## 解题思路

这道题的核心思想是使用**前缀和**和**哈希表**的组合来解决。

### 核心洞见

**关键洞见**：如果存在两个位置 `i` 和 `j`（`i < j`），使得前缀和 `prefix[j] - prefix[i] = k`，那么子数组 `nums[i+1...j]` 的和就是 `k`。

### 算法步骤

1. **初始化**：
   - 创建一个哈希表 `count` 来记录每个前缀和出现的次数
   - 初始化 `count[0] = 1`，表示空前缀和出现 1 次
   - 初始化 `prefix_sum = 0` 和 `result = 0`

2. **遍历数组**：
   - 对于每个元素 `nums[i]`，计算当前的前缀和 `prefix_sum += nums[i]`
   - 检查是否存在 `prefix_sum - k` 在哈希表中
   - 如果存在，将对应的次数加到结果中
   - 将当前前缀和及其出现次数更新到哈希表中

3. **统计结果**：
   - 返回所有满足条件的子数组数量

### 可视化示例

以 `nums = [1, 1, 1], k = 2` 为例：

```
索引:    0  1  2
数组:   [1, 1, 1]
前缀和:   1  2  3

步骤分析：
i=0: prefix_sum=1, 查找 1-2=-1, count[-1]=0, 结果=0, count[1]=1
i=1: prefix_sum=2, 查找 2-2=0,  count[0]=1,  结果=1, count[2]=1  
i=2: prefix_sum=3, 查找 3-2=1,  count[1]=1,  结果=2, count[3]=1

最终结果：2
```

## 实现细节

### 为什么需要 `count[0] = 1`？

这是为了处理从数组开头开始的子数组。例如，如果 `nums[0] = k`，那么我们需要找到 `prefix_sum - k = 0`，即 `prefix_sum = k`。如果没有初始化 `count[0] = 1`，这种情况会被遗漏。

### 哈希表的作用

哈希表 `count` 用于快速查找某个前缀和值之前出现过多少次，这样我们就能知道有多少个子数组的和为 `k`。

## 代码实现

```go
func subarraySum(nums []int, k int) int {
    count := make(map[int]int)
    count[0] = 1  // 初始化空前缀和
    
    prefixSum := 0
    result := 0
    
    for _, num := range nums {
        prefixSum += num
        
        // 查找是否存在 prefixSum - k 的前缀和
        if freq, exists := count[prefixSum-k]; exists {
            result += freq
        }
        
        // 更新当前前缀和的出现次数
        count[prefixSum]++
    }
    
    return result
}
```

### 代码执行过程分析

以 `nums = [1, 1, 1], k = 2` 为例：

```
初始状态：
count = {0: 1}
prefixSum = 0
result = 0

i=0, num=1:
prefixSum = 1
查找 count[1-2] = count[-1] = 0
result = 0
count = {0: 1, 1: 1}

i=1, num=1:
prefixSum = 2
查找 count[2-2] = count[0] = 1
result = 1
count = {0: 1, 1: 1, 2: 1}

i=2, num=1:
prefixSum = 3
查找 count[3-2] = count[1] = 1
result = 2
count = {0: 1, 1: 1, 2: 1, 3: 1}

返回 result = 2
```

## 方法比较

| 方面 | 前缀和 + 哈希表 | 暴力枚举 |
|------|----------------|----------|
| 时间复杂度 | O(n) | O(n²) |
| 空间复杂度 | O(n) | O(1) |
| 优点 | 高效，一次遍历解决 | 直观易懂 |
| 缺点 | 需要额外空间 | 时间复杂度过高 |
| 推荐度 | ★★★★★ | ★★☆☆☆ |

## 复杂度分析

### 时间复杂度：O(n)

- 只需要遍历数组一次
- 哈希表的查找和插入操作平均时间复杂度为 O(1)
- 总体时间复杂度为 O(n)

### 空间复杂度：O(n)

- 哈希表最多存储 n 个不同的前缀和值
- 在最坏情况下，所有前缀和都不同，需要 O(n) 空间

### 数学推导

对于长度为 n 的数组，前缀和的计算：
```
T(n) = n × O(1) = O(n)
```

哈希表空间使用：
```
S(n) = O(n)  // 最坏情况下所有前缀和都不同
```

## 关键收获

1. **前缀和技巧**：当需要频繁计算子数组和时，前缀和是一个非常有用的技巧
2. **哈希表应用**：哈希表不仅可以用于去重，还可以用于快速统计和查找
3. **边界条件处理**：初始化 `count[0] = 1` 是处理边界情况的关键
4. **数学思维**：将问题转化为 `prefix[j] - prefix[i] = k` 的形式，大大简化了求解过程

### 常见陷阱

1. **忘记初始化**：没有设置 `count[0] = 1` 会导致从开头开始的子数组被遗漏
2. **顺序错误**：应该先查找再更新哈希表，避免重复计算
3. **整数溢出**：对于大数组，前缀和可能超出 int 范围，需要注意数据类型

### 相关问题

- [LeetCode 53: Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) - 最大子数组和
- [LeetCode 325: Maximum Size Subarray Sum Equals k](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/) - 和为k的最长子数组长度
- [LeetCode 209: Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) - 和大于等于目标值的最短子数组

这道题是前缀和技巧的经典应用，掌握这个思路对于解决类似的子数组问题非常有帮助。 