---
title: ❌ LeetCode 46 - 全排列（Permutations）错误分析
date: 2025-05-05 20:49:04
categories:
- 算法刷题
- LeetCode
- Hot100
tags:
- 回溯
- 深度优先搜索
- Medium
- LeetCode
- ❌错题集
- Hot100
description: 分析在Go语言实现全排列时的常见错误：切片复制的误区及其正确实现方法
---
## 问题描述

[全排列](https://leetcode.cn/problems/permutations/)是一个经典的回溯算法问题：

给定一个不含重复数字的数组 `nums`，返回其所有可能的全排列。你可以按任意顺序返回答案。

**示例 1：**

```
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
```

**示例 2：**

```
输入：nums = [0,1]
输出：[[0,1],[1,0]]
```

**示例 3：**

```
输入：nums = [1]
输出：[[1]]
```

**提示：**

- 1 <= nums.length <= 6
- -10 <= nums[i] <= 10
- nums 中的所有整数互不相同

## 错误解法与分析

我的初始解法使用了经典的回溯算法，但在实现过程中有一个值得注意的错误：

```go
func permute(nums []int) (res [][]int) {
    flag := make([]bool, len(nums))
    tmpArray := make([]int, len(nums))

    var dfs func(index int)
    dfs = func(index int) {
        if index >= len(nums) {
            var tmp []int  // ❌ 错误点：切片声明但未分配内存
            copy(tmp, tmpArray)  // ❌ 复制操作无效，因为tmp长度为0
            res = append(res, tmp)
            return
        }

        for i := 0; i < len(nums); i++ {
            if !flag[i] {
                flag[i] = true
                tmpArray[index] = nums[i]
                dfs(index + 1)
                flag[i] = false
            }
        }
    }

    dfs(0)
    return res
}
```

这个解法在执行过程中会发现结果为空，因为我在复制切片时犯了一个常见错误。

### 错误原因分析

错误发生在完成排列构建后添加结果到 `res` 的代码部分：

```go
var tmp []int
copy(tmp, tmpArray)
res = append(res, tmp)
```

**错误原因：**

1. `var tmp []int` 声明了一个空切片，其长度和容量都为 0
2. Go语言的 `copy()` 函数只会复制目标切片能够容纳的元素数量
3. 由于 `tmp` 的长度为 0，所以 `copy(tmp, tmpArray)` 实际上没有复制任何元素
4. 结果是每次都将一个空切片追加到 `res` 中

这是 Go 语言中处理切片时的一个常见陷阱。在 Go 中，切片是对底层数组的引用，不是独立的数据结构。`copy()` 函数需要目标切片有足够的长度才能复制元素。

## 正确解法

经过分析，修复后的解法如下：

```go
func permute(nums []int) (res [][]int) {
    flag := make([]bool, len(nums))
    tmpArray := make([]int, len(nums))

    var dfs func(index int)
    dfs = func(index int) {
        if index >= len(nums) {
            tmp := make([]int, len(nums))  // ✅ 正确：为新切片分配足够的空间
            copy(tmp, tmpArray)  // 现在复制操作会正确进行
            res = append(res, tmp)
            return
        }

        for i := 0; i < len(nums); i++ {
            if !flag[i] {
                flag[i] = true
                tmpArray[index] = nums[i]
                dfs(index + 1)
                flag[i] = false
            }
        }
    }

    dfs(0)
    return res
}
```

### 为什么这个解法可以工作

修复方法很简单：使用 `make()` 函数为 `tmp` 切片分配适当的长度，确保它有足够的容量来接收复制的元素：

```go
tmp := make([]int, len(nums))  // 分配正确长度的内存
```

这样，`copy(tmp, tmpArray)` 函数就能正确复制所有元素，而不是创建空结果。

### 另一个可能的解决方案

另外，我们也可以直接使用切片的追加操作来创建一个新的切片：

```go
tmp := append([]int{}, tmpArray...)  // 通过追加创建新切片
```

或者更简洁的方法：

```go
tmp := append(make([]int, 0, len(nums)), tmpArray...)
```

这些方法同样可以创建 `tmpArray` 的深拷贝，避免引用同一个底层数组。

## 学习总结

从这个错误中，我们可以学到几个关于 Go 语言切片操作的重要知识点：

1. **切片深拷贝需要注意内存分配**：在 Go 中进行切片复制时，必须确保目标切片有足够的长度
2. **`copy()` 函数的行为**：`copy()` 只会复制目标切片能容纳的元素数量，不会自动扩展目标切片
3. **变量声明与内存分配的区别**：`var tmp []int` 只是声明了变量，没有分配内存；而 `make([]int, len)` 会分配指定长度的内存
4. **回溯算法中的状态复制**：在回溯算法中，将临时状态加入结果集时，必须创建深拷贝，否则后续的修改会影响已存储的结果

这个错误提醒我们在 Go 语言编程中要特别注意切片的内存管理和复制操作，避免因引用共享导致的意外行为。
