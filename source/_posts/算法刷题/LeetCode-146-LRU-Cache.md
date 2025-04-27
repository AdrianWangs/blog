---
title: "LeetCode 146 - LRU 缓存"
date: 2025-04-27 11:06:28
categories:
  - 算法刷题
  - LeetCode
tags:
  - 哈希
  - 链表
  - Medium
  - LeetCode
---

## 问题描述

请你设计并实现一个满足 LRU (最近最少使用) 缓存约束的数据结构。

实现 `LRUCache` 类：
- `LRUCache(int capacity)` - 以正整数作为容量 capacity 初始化 LRU 缓存
- `int get(int key)` - 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1。
- `void put(int key, int value)` - 如果关键字 key 已经存在，则变更其数据值 value；如果不存在，则向缓存中插入该组 key-value。如果插入操作导致关键字数量超过 capacity，则应该逐出最久未使用的关键字。

函数 `get` 和 `put` 必须以 **O(1)** 的平均时间复杂度运行。

**示例**:
```
输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释
LRUCache lRUCache = new LRUCache(2);  // 缓存容量为 2
lRUCache.put(1, 1);                    // 缓存是 {1=1}
lRUCache.put(2, 2);                    // 缓存是 {1=1, 2=2}
lRUCache.get(1);                       // 返回 1
lRUCache.put(3, 3);                    // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);                       // 返回 -1 (未找到)
lRUCache.put(4, 4);                    // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);                       // 返回 -1 (未找到)
lRUCache.get(3);                       // 返回 3
lRUCache.get(4);                       // 返回 4
```

**约束**:
- 1 <= capacity <= 3000
- 0 <= key <= 10000
- 0 <= value <= 10^5
- 最多调用 2 * 10^5 次 get 和 put

## 解题思路

LRU (Least Recently Used) 缓存是一种常见的缓存淘汰策略，它基于"最近最少使用"的原则来管理缓存空间。要实现 LRU 缓存，我们需要两个核心数据结构：

1. **哈希表**：用于 O(1) 时间复杂度查找键值对
2. **双向链表**：用于维护缓存项的使用顺序

**关键思路**：

- 双向链表按照使用顺序存储缓存项，链表头部是最近使用的，尾部是最久未使用的
- 哈希表以 key 为键，链表节点为值，用于快速定位链表中的节点
- 每当缓存被访问（get 或 put 操作），将对应节点移动到链表头部
- 当缓存满时，移除链表尾部的节点（最久未使用的项）

下面是 LRU 缓存操作的流程图示意：

```
  双向链表（使用顺序从左到右：最近使用 → 最久未使用）
 ┌───────────────────────────────────────────────┐
 │  HEAD ↔ Node1 ↔ Node2 ↔ ... ↔ NodeN ↔ TAIL    │
 └───────────────────────────────────────────────┘
       ▲
       │
       │ 快速定位
 ┌─────┴─────┐
 │  HashMap  │
 └───────────┘
```

## 实现细节

我们使用 Golang 实现 LRU 缓存，主要包含以下步骤：

1. 定义双向链表节点结构 `DLinkedNode`，包含 key、value 和指向前后节点的指针
2. 定义 LRU 缓存结构 `LRUCache`，包含容量、大小、哈希表和双向链表的头尾节点
3. 实现 `Constructor` 函数初始化 LRU 缓存
4. 实现 `Get` 方法按键获取值并更新使用顺序
5. 实现 `Put` 方法添加或更新键值对，并在必要时淘汰最久未使用的项

关键实现细节：

- 使用哈希表（map）存储 key 到节点的映射，实现 O(1) 查找
- 双向链表用于追踪元素的使用顺序，新节点或被访问的节点移到链表头部
- 创建两个伪节点（head 和 tail）简化边界情况处理
- 每次访问节点（Get 或 Put 操作）时，将节点移到链表头部
- 当缓存满时，移除链表尾部的节点（最久未使用的项）

## 代码实现

下面是完整的 Golang 实现：

```go
type DLinkedNode struct {
	key, value int
	prev, next *DLinkedNode
}

type LRUCache struct {
	capacity   int
	size       int
	cache      map[int]*DLinkedNode
	head, tail *DLinkedNode
}

func Constructor(capacity int) LRUCache {
	tmp := LRUCache{
		capacity: capacity,
		size:     0,
		cache:    make(map[int]*DLinkedNode),
		head:     &DLinkedNode{},
		tail:     &DLinkedNode{},
	}
	tmp.head.next = tmp.tail
	tmp.tail.prev = tmp.head
	return tmp
}

func (this *LRUCache) Get(key int) int {
	// 找不到就返回-1
	if _, ok := this.cache[key]; !ok {
		return -1
	}

	// 找到就把这个cache更新到首部
	cur := this.cache[key]
	cur.prev.next = cur.next
	cur.next.prev = cur.prev
	cur.next = this.head.next
	cur.prev = this.head
	this.head.next.prev = cur
	this.head.next = cur

	return cur.value
}

func (this *LRUCache) Put(key int, value int) {
	// 有就直接更新
	if _, ok := this.cache[key]; ok {
		cur := this.cache[key]
		// 断掉和之前位置的链接
		cur.prev.next = cur.next
		cur.next.prev = cur.prev
		// 连上新的位置
		cur.next = this.head.next
		cur.prev = this.head
		this.head.next.prev = cur
		this.head.next = cur
		cur.value = value
		return
	}

	cur := &DLinkedNode{
		key:   key,
		value: value,
	}

	if this.size >= this.capacity {
		lastElement := this.tail.prev
		lastElement.prev.next = lastElement.next
		lastElement.next.prev = lastElement.prev
		delete(this.cache, lastElement.key)
		this.size--
	}

	cur.next = this.head.next
	cur.prev = this.head
	this.head.next.prev = cur
	this.head.next = cur

	this.cache[key] = cur
	this.size++
}
```

## 复杂度分析

- **时间复杂度**：
  - `Get` 操作：O(1)，哈希表查找是 O(1)，移动节点到链表头部也是 O(1)
  - `Put` 操作：O(1)，哈希表查找/插入是 O(1)，链表操作也是 O(1)

- **空间复杂度**：O(capacity)，存储 capacity 个键值对需要 O(capacity) 的空间

## 关键收获

通过实现 LRU 缓存，我们学习了以下重要概念：

1. **数据结构组合**：哈希表和双向链表的组合可以创建高效的缓存机制
2. **缓存淘汰策略**：LRU（最近最少使用）是一种常见且有效的缓存淘汰策略
3. **双向链表的应用**：双向链表适合需要频繁在任意位置插入和删除的场景
4. **边界情况处理**：使用伪头尾节点（dummy head/tail）可以简化链表操作

LRU 缓存在实际应用中非常广泛，比如：

- 浏览器的缓存管理
- 数据库的缓存层
- 操作系统的页面置换算法
- 分布式缓存系统（如 Redis）中的淘汰策略

这种设计思想和实现技巧在许多系统设计问题中都有应用。 