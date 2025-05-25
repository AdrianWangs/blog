---
title: '❌ LeetCode 274 - H指数（H-Index）'
date: 2025-05-25 13:34:33
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 数组
  - 排序
  - 计数排序
  - 二分查找
  - Medium
  - LeetCode
  - ❌错题集
description: 'H指数问题的三种解法详解：排序法、计数排序法和二分查找法，包含错误分析和解题思路对比'
---

## 问题描述

给你一个整数数组 `citations`，其中 `citations[i]` 表示研究者第 `i` 篇论文被引用的次数。计算并返回该研究者的 `h` 指数。

**H 指数的定义**：h 代表"高引用次数"（high citations），一名科研人员的 h 指数是指他（她）的（`n` 篇论文中）**总共**有 `h` 篇论文分别被引用了**至少** `h` 次。且其余的 `n - h` 篇论文每篇被引用次数 **不超过** `h` 次。

如果 `h` 有多种可能的值，**h 指数** 是其中的 **最大值**。

**示例 1：**

```
输入：citations = [3,0,6,1,5]
输出：3
解释：给定数组表示研究者总共有 5 篇论文，每篇论文相应的被引用了 3, 0, 6, 1, 5 次。
     由于研究者有 3 篇论文每篇 至少 被引用了 3 次，其余 2 篇论文每篇被引用 不多于 3 次，所以她的 h 指数是 3。
```

**示例 2：**

```
输入：citations = [1,3,1]
输出：1
```

**约束条件：**

- `n == citations.length`
- `1 <= n <= 5000`
- `0 <= citations[i] <= 1000`

## 错误解法与分析

我最初尝试的解法是：

```go
func hIndex(citations []int) int {
    slices.Sort(citations)
    n := len(citations)

    if citations[n-1] == 0 {
        return 0
    }

    res := 1
    for i := n - 1; i >= 0; i-- {
        if citations[i] <= n-i {  // ❌ 错误点：应该是 >=
            res = max(res, citations[i])
        }
    }
    return res
}
```

### 错误原因分析

1. **条件判断错误**：使用了 `citations[i] <= n-i`，但根据 H 指数定义，应该是 `citations[i] >= n-i`
2. **返回值逻辑错误**：在寻找满足错误条件的最大引用次数，而不是寻找满足 H 指数定义的最大 h 值
3. **初始值设置不当**：`res := 1` 无法处理 H 指数为 0 的情况

## 方法一：排序法

### 解题思路

H 指数的核心思想是：将论文按引用次数排序后，找到一个位置，使得从该位置到数组末尾的所有论文引用次数都至少为这个位置对应的论文数量。

排序后从左到右遍历，对于位置 `i`：

- 从位置 `i` 到数组末尾共有 `h = n - i` 篇论文
- 如果 `citations[i] >= h`，说明这 `h` 篇论文的引用次数都 ≥ h
- 由于我们要找最大的 h，返回第一个满足条件的 h 值即可

### 实现代码

```go
func hIndex(citations []int) int {
    slices.Sort(citations)
    n := len(citations)

    for i := 0; i < n; i++ {
        h := n - i  // 从位置i到末尾的论文数
        if citations[i] >= h {
            return h
        }
    }
    return 0
}
```

### 复杂度分析

- **时间复杂度**：$O(n \log n)$，主要是排序的时间复杂度
- **空间复杂度**：$O(1)$，只使用了常数额外空间

### 执行过程示例

以 `citations = [3,0,6,1,5]` 为例：

1. 排序后：`[0,1,3,5,6]`
2. 遍历过程：
   - i=0: h=5, citations[0]=0 < 5 ❌
   - i=1: h=4, citations[1]=1 < 4 ❌
   - i=2: h=3, citations[2]=3 ≥ 3 ✅

返回 h=3

## 方法二：计数排序法

### 解题思路

由于引用次数有上限（题目中最大为 1000），而且 H 指数最大不会超过论文总数，我们可以用计数排序的思想。

关键观察：

- H 指数最大为论文总数 n
- 引用次数超过 n 的论文对 H 指数的贡献等同于引用次数为 n 的论文

### 实现代码

```go
func hIndex(citations []int) int {
    n := len(citations)
    count := make([]int, n+1)

    // 统计每个引用次数的论文数量
    for _, c := range citations {
        if c >= n {
            count[n]++  // 引用次数≥n的都统计到count[n]
        } else {
            count[c]++
        }
    }

    // 从高到低计算累计论文数
    total := 0
    for i := n; i >= 0; i-- {
        total += count[i]
        if total >= i {  // 至少有i篇论文引用次数≥i
            return i
        }
    }
    return 0
}
```

### 复杂度分析

- **时间复杂度**：$O(n)$，遍历数组两次
- **空间复杂度**：$O(n)$，需要计数数组

### 执行过程示例

以 `citations = [3,0,6,1,5]` 为例：

1. 初始化：`count = [0,0,0,0,0,0]` (长度为 6)
2. 统计：
   - citations[0]=3: count[3]++
   - citations[1]=0: count[0]++
   - citations[2]=6≥5: count[5]++
   - citations[3]=1: count[1]++
   - citations[4]=5≥5: count[5]++
   - 结果：`count = [1,1,0,1,0,2]`
3. 累计计算：
   - i=5: total=2, 2<5 ❌
   - i=4: total=2, 2<4 ❌
   - i=3: total=3, 3≥3 ✅

返回 h=3

## 方法三：二分查找法

### 解题思路

H 指数具有单调性：如果 H 指数为 h，那么 H 指数一定不会是 h+1、h+2...。我们可以在[0, n]范围内二分查找最大的满足条件的 h 值。

对于给定的 h，检查是否至少有 h 篇论文的引用次数 ≥h。

### 实现代码

```go
func hIndex(citations []int) int {
    n := len(citations)
    left, right := 0, n

    for left <= right {
        mid := (left + right) / 2
        if canAchieveH(citations, mid) {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return right
}

// 检查是否能达到H指数为h
func canAchieveH(citations []int, h int) bool {
    count := 0
    for _, c := range citations {
        if c >= h {
            count++
        }
    }
    return count >= h
}
```

### 复杂度分析

- **时间复杂度**：$O(n \log n)$，二分查找$O(\log n)$次，每次需要$O(n)$时间检查
- **空间复杂度**：$O(1)$，只使用了常数额外空间

### 执行过程示例

以 `citations = [3,0,6,1,5]` 为例：

1. 初始：left=0, right=5
2. mid=2: canAchieveH([3,0,6,1,5], 2) → count=3≥2 ✅ → left=3
3. mid=4: canAchieveH([3,0,6,1,5], 4) → count=2<4 ❌ → right=3
4. mid=3: canAchieveH([3,0,6,1,5], 3) → count=3≥3 ✅ → left=4
5. left>right，返回 right=3

## 方法比较

| 方面       | 排序法        | 计数排序法         | 二分查找法       |
| ---------- | ------------- | ------------------ | ---------------- |
| 时间复杂度 | $O(n \log n)$ | $O(n)$             | $O(n \log n)$    |
| 空间复杂度 | $O(1)$        | $O(n)$             | $O(1)$           |
| 实现难度   | 简单          | 中等               | 中等             |
| 适用场景   | 通用          | 引用次数范围较小时 | 理解二分查找思想 |
| 推荐度     | ★★★★★         | ★★★★☆              | ★★★☆☆            |

## 关键收获

1. **理解 H 指数定义**：至少有 h 篇论文的引用次数都 ≥h 次
2. **排序的威力**：通过排序可以将复杂的计数问题转化为简单的位置判断
3. **计数优化**：当数据范围有限时，计数排序可以将时间复杂度降到线性
4. **二分查找的应用**：单调性是应用二分查找的关键条件
5. **边界条件处理**：注意 H 指数可能为 0 的情况

## 总结

H 指数问题是一个经典的数组处理问题，展示了多种不同的解题思路。排序法最直观易懂，计数排序法在特定条件下最优，二分查找法体现了算法的巧妙性。在实际应用中，建议根据数据特点选择合适的方法。
