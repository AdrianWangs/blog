---
title: "LeetCode 80 - 删除有序数组中的重复项 II（Remove Duplicates from Sorted Array II）"
date: 2025-05-24 13:49:27
categories:
  - 算法刷题
  - LeetCode
  - 数组与哈希
tags:
  - 数组
  - 双指针
  - Medium
  - 面试经典150
  - LeetCode
description: "使用双指针技术解决有序数组去重问题，允许每个元素最多出现两次。核心思路是通过比较当前元素与目标位置前两个元素的关系来判断是否可以保留。"
---

## 问题描述

给你一个有序数组 `nums`，请你**原地**删除重复出现的元素，使得出现次数超过两次的元素**只出现两次**，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在**原地修改输入数组**并在使用 O(1) 额外空间的条件下完成。

**示例 1：**
```
输入：nums = [1,1,1,2,2,3]
输出：5, nums = [1,1,2,2,3]
解释：函数应返回新长度 length = 5, 并且原数组的前五个元素被修改为 1, 1, 2, 2, 3。
不需要考虑数组中超出新长度后面的元素。
```

**示例 2：**
```
输入：nums = [0,0,1,1,1,1,2,3,3]
输出：7, nums = [0,0,1,1,2,3,3]
解释：函数应返回新长度 length = 7, 并且原数组的前七个元素被修改为 0, 0, 1, 1, 2, 3, 3。
不需要考虑数组中超出新长度后面的元素。
```

**约束条件：**
- `1 <= nums.length <= 3 * 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 已按**非严格递增**顺序排列

## 解题思路

这道题是经典的**双指针**问题，核心思想是维护一个"有效区域"，确保每个元素最多出现两次。

### 核心洞察

**关键洞察**：对于位置 `left`，如果 `nums[left-2] != nums[right]`，那么 `nums[right]` 可以安全地放入位置 `left`，因为这保证了最多连续两个相同元素。

### 算法步骤

1. **初始化**：由于前两个元素无论如何都可以保留，所以从索引 2 开始处理
2. **双指针遍历**：
   - `left`：指向下一个要填入的位置
   - `right`：遍历整个数组
3. **判断条件**：比较 `nums[left-2]` 和 `nums[right]`
   - 如果不相等，说明 `nums[right]` 可以放入，因为它与前面第二个元素不同
   - 如果相等，说明已经有两个相同元素了，跳过当前元素

### 可视化示例

以 `nums = [1,1,1,2,2,3]` 为例：

```
初始状态: [1,1,1,2,2,3]
           ↑     ↑
         left  right

步骤1: nums[0] != nums[2] → 1 != 1 (false)
       right++

步骤2: nums[0] != nums[3] → 1 != 2 (true)
       nums[2] = nums[3] = 2
       [1,1,2,2,2,3]
             ↑   ↑
           left right

步骤3: nums[1] != nums[4] → 1 != 2 (true)
       nums[3] = nums[4] = 2
       [1,1,2,2,2,3]
               ↑ ↑
             left right

步骤4: nums[2] != nums[5] → 2 != 3 (true)
       nums[4] = nums[5] = 3
       [1,1,2,2,3,3]
                 ↑
               left

最终结果: [1,1,2,2,3], length = 5
```

## 代码实现

```go
func removeDuplicates(nums []int) int {
    n := len(nums)
    
    // 边界情况：长度小于等于2时，所有元素都可以保留
    if n <= 2 {
        return n
    }
    
    // 双指针：left指向下一个要填入的位置，right遍历数组
    left, right := 2, 2
    
    for right < n {
        // 关键判断：如果当前元素与left-2位置的元素不同
        // 说明可以安全放入，保证最多连续两个相同元素
        if nums[left-2] != nums[right] {
            nums[left] = nums[right]
            left++
        }
        right++
    }
    
    return left
}
```

### 执行过程分析

以 `nums = [0,0,1,1,1,1,2,3,3]` 为例：

```
初始: [0,0,1,1,1,1,2,3,3]  left=2, right=2
      
right=2: nums[0] != nums[2] → 0 != 1 (true)
         nums[2] = 1, left=3
         [0,0,1,1,1,1,2,3,3]

right=3: nums[1] != nums[3] → 0 != 1 (true)  
         nums[3] = 1, left=4
         [0,0,1,1,1,1,2,3,3]

right=4: nums[2] != nums[4] → 1 != 1 (false)
         跳过

right=5: nums[3] != nums[5] → 1 != 1 (false)
         跳过

right=6: nums[4] != nums[6] → 1 != 2 (true)
         nums[4] = 2, left=5
         [0,0,1,1,2,1,2,3,3]

right=7: nums[5] != nums[7] → 1 != 3 (true)
         nums[5] = 3, left=6
         [0,0,1,1,2,3,2,3,3]

right=8: nums[6] != nums[8] → 2 != 3 (true)
         nums[6] = 3, left=7
         [0,0,1,1,2,3,3,3,3]

最终结果: [0,0,1,1,2,3,3], length = 7
```

## 复杂度分析

**时间复杂度**：$O(n)$
- 只需要遍历数组一次，每个元素最多被访问两次

**空间复杂度**：$O(1)$
- 只使用了常数个额外变量，原地修改数组

## 关键收获

### 核心技巧
1. **双指针模式**：一个指针负责遍历，另一个指针维护有效区域
2. **前瞻比较**：通过比较 `nums[left-2]` 和 `nums[right]` 来判断是否可以保留元素
3. **原地修改**：直接在原数组上操作，节省空间

### 常见陷阱
1. **边界处理**：忘记处理数组长度小于等于 2 的情况
2. **索引越界**：`left-2` 可能越界，需要从索引 2 开始
3. **理解错误**：误以为需要计数每个元素的出现次数

### 扩展应用
- 可以轻松扩展到"最多保留 k 个重复元素"的情况
- 类似的原地修改数组问题都可以使用双指针技术
- 这种模式在处理有序数组时特别有效

### 相关问题
- [LeetCode 26: Remove Duplicates from Sorted Array](https://leetcode.cn/problems/remove-duplicates-from-sorted-array/)
- [LeetCode 27: Remove Element](https://leetcode.cn/problems/remove-element/)
- [LeetCode 283: Move Zeroes](https://leetcode.cn/problems/move-zeroes/) 