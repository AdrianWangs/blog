---
title: '❌ LeetCode 380 - O(1) 时间插入、删除和获取随机元素'
date: 2025-05-25 14:05:44
categories:
  - 算法刷题
  - LeetCode
tags:
  - 数组
  - 哈希表
  - 数据结构设计
  - Medium
  - LeetCode
  - ❌错题集
description: '设计一个支持在平均时间复杂度 O(1) 下，执行插入、删除、获取随机元素操作的数据结构。分析错误实现中索引不一致的问题及正确解法。'
---

## 问题描述

设计一个支持在**平均**时间复杂度 **O(1)** 下，执行以下操作的数据结构：

- `insert(val)`：当元素 val 不存在时返回 true，并向集合中插入该项，否则返回 false
- `remove(val)`：当元素 val 存在时返回 true，并从集合中移除该项，否则返回 false
- `getRandom()`：随机返回现有集合中的一项。每个元素应该有**相同的概率**被返回

你必须实现类的所有函数，并满足每个函数的**平均**时间复杂度为 **O(1)**。

**示例：**

```
输入
["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
[[], [1], [2], [2], [], [1], [2], []]
输出
[null, true, false, true, 2, true, false, 2]

解释
RandomizedSet randomizedSet = new RandomizedSet();
randomizedSet.insert(1); // 向集合中插入 1 。返回 true 表示 1 被成功地插入。
randomizedSet.remove(2); // 返回 false ，表示集合中不存在 2 。
randomizedSet.insert(2); // 向集合中插入 2 。返回 true 。集合现在包含 [1,2] 。
randomizedSet.getRandom(); // getRandom 应随机返回 1 或 2 。
randomizedSet.remove(1); // 从集合中移除 1 ，返回 true 。集合现在包含 [2] 。
randomizedSet.insert(2); // 2 已在集合中，所以返回 false 。
randomizedSet.getRandom(); // 由于 2 是集合中唯一的数字，getRandom 总是返回 2 。
```

## 错误解法与分析

我的初始解法采用了哈希表 + 数组 + begin 指针的设计：

```go
type RandomizedSet struct {
    hashTable map[int]int
    nums      []int
    begin     int
}

func (this *RandomizedSet) Remove(val int) bool {
    if index, ok := this.hashTable[val]; ok {
        beginVal := this.nums[this.begin]

        // ❌ 错误点：只更新了索引，没有交换实际元素位置
        this.hashTable[beginVal] = index

        this.begin++
        delete(this.hashTable, val)
        return true
    }
    return false
}
```

### 错误原因分析

这个解法在 Remove 方法中犯了一个严重错误：**只更新了哈希表的索引映射，但没有实际交换数组中的元素位置**，导致索引与实际位置不一致。

让我用具体例子说明问题：

**初始状态：**

- `nums = [1, 2, 3, 4]`
- `hashTable = {1: 0, 2: 1, 3: 2, 4: 3}`
- `begin = 0`

**删除元素 3 时：**

1. `index = 2`（元素 3 的位置）
2. `beginVal = nums[0] = 1`
3. `hashTable[1] = 2` ❌（将元素 1 的索引改为 2）
4. `begin = 1`
5. 删除 `hashTable[3]`

**错误结果：**

- `nums = [1, 2, 3, 4]`（数组没变！）
- `hashTable = {1: 2, 2: 1, 4: 3}`（元素 1 的索引变成了 2）
- `begin = 1`

现在哈希表说元素 1 在索引 2，但实际上元素 1 还在索引 0，而索引 2 位置是元素 3！这导致了**数据结构内部状态不一致**的严重问题。

## 正确解法

要实现 O(1) 的插入、删除和随机获取，需要结合**哈希表**和**动态数组**：

- **哈希表**：提供 O(1) 的查找能力
- **动态数组**：提供 O(1) 的随机访问能力

关键是在删除元素时，采用**交换到末尾再删除**的策略，避免数组元素的移动。

### 方法一：与最后元素交换（推荐）

```go
type RandomizedSet struct {
    hashTable map[int]int  // val -> index
    nums      []int        // 存储实际值
}

func Constructor() RandomizedSet {
    return RandomizedSet{
        hashTable: make(map[int]int),
        nums:      make([]int, 0),
    }
}

func (this *RandomizedSet) Insert(val int) bool {
    if _, ok := this.hashTable[val]; ok {
        return false  // 已存在
    }

    // 添加到数组末尾
    this.hashTable[val] = len(this.nums)
    this.nums = append(this.nums, val)
    return true
}

func (this *RandomizedSet) Remove(val int) bool {
    if index, ok := this.hashTable[val]; !ok {
        return false  // 不存在
    } else {
        lastIndex := len(this.nums) - 1
        lastVal := this.nums[lastIndex]

        // 将最后一个元素移到要删除的位置
        this.nums[index] = lastVal
        this.hashTable[lastVal] = index

        // 删除最后一个元素
        this.nums = this.nums[:lastIndex]
        delete(this.hashTable, val)
        return true
    }
}

func (this *RandomizedSet) GetRandom() int {
    return this.nums[rand.Intn(len(this.nums))]
}
```

### 方法二：使用 begin 指针的正确实现

如果坚持使用 begin 指针的设计，需要**实际交换元素位置**：

```go
func (this *RandomizedSet) Remove(val int) bool {
    if index, ok := this.hashTable[val]; ok {
        beginVal := this.nums[this.begin]

        // ✅ 实际交换数组中的元素位置
        this.nums[index] = beginVal
        this.nums[this.begin] = val

        // ✅ 更新哈希表中的索引
        this.hashTable[beginVal] = index

        this.begin++
        delete(this.hashTable, val)
        return true
    }
    return false
}

func (this *RandomizedSet) GetRandom() int {
    validLength := len(this.nums) - this.begin
    randomIndex := rand.Intn(validLength) + this.begin
    return this.nums[randomIndex]
}
```

## 算法核心思想

1. **哈希表存储值到索引的映射**：实现 O(1) 查找
2. **数组存储实际值**：实现 O(1) 随机访问
3. **删除时与末尾元素交换**：避免数组元素移动，保持 O(1) 复杂度

删除操作的关键步骤：

```
删除元素 X：
1. 找到 X 在数组中的位置 index
2. 将数组最后一个元素 Y 移动到 index 位置
3. 更新 Y 在哈希表中的索引为 index
4. 删除数组最后一个元素
5. 从哈希表中删除 X
```

## 复杂度分析

- **时间复杂度**：所有操作均为 $O(1)$

  - Insert：哈希表插入 + 数组追加 = $O(1)$
  - Remove：哈希表查找 + 元素交换 + 哈希表删除 = $O(1)$
  - GetRandom：随机数生成 + 数组访问 = $O(1)$

- **空间复杂度**：$O(n)$，其中 $n$ 是插入的元素个数

## 关键收获

1. **数据结构一致性**：当你更新索引映射时，必须同时更新实际的数据存储
2. **删除策略**：在需要保持 O(1) 复杂度的场景下，"交换到末尾再删除"是常用技巧
3. **组合数据结构**：哈希表 + 数组的组合可以同时获得快速查找和随机访问的能力
4. **边界情况**：特别注意删除操作中的索引更新逻辑

这道题很好地展示了如何通过巧妙的数据结构设计来满足复杂的性能要求，删除操作的实现是关键难点。

## 相关题目

- [LeetCode 381 - O(1) 时间插入、删除和获取随机元素 - 允许重复](mdc:hexo-blog/2025/05/25/LeetCode-381-Insert-Delete-GetRandom-O1-Duplicates-allowed)
- [LeetCode 146 - LRU 缓存](mdc:hexo-blog/source/_posts/算法刷题/LeetCode-146-LRU-Cache.md)
