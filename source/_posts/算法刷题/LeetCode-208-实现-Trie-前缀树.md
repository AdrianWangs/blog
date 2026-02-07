---
title: LeetCode 208 - 实现 Trie (前缀树)
date: 2025-05-05 20:12:06
categories:
- 算法刷题
- LeetCode
- 字符串
tags:
- 数据结构
- 树
- Trie
- 字符串
- Medium
- LeetCode
- Hot100
description: 详解Trie前缀树的实现原理、常见优化策略以及Go语言高效实现方法，包含时空复杂度分析和性能优化技巧
---
## 问题描述

Trie（发音类似 "try"）或者说前缀树，是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补全和拼写检查。

请你实现 Trie 类：

- `Trie()` 初始化前缀树对象。
- `void insert(String word)` 向前缀树中插入字符串 `word`。
- `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false`。
- `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix`，返回 `true`；否则，返回 `false`。

**示例：**

```
输入：
["Trie", "insert", "search", "search", "startsWith", "insert", "search"]
[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
输出：
[null, null, true, false, true, null, true]

解释：
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");     // 返回 True
trie.search("app");       // 返回 False
trie.startsWith("app");   // 返回 True
trie.insert("app");
trie.search("app");       // 返回 True
```

**提示：**

- `1 <= word.length, prefix.length <= 2000`
- `word` 和 `prefix` 仅由小写英文字母组成
- `insert`、`search` 和 `startsWith` 调用次数总计不超过 `3 * 10^4` 次

## 解题思路

实现一个 Trie 前缀树需要我们理解其核心数据结构和操作原理。Trie 树是一种多叉树结构，每个节点代表字符串中的一个字符，从根节点到某一节点的路径上经过的字符连接起来，就是该节点对应的字符串。

### 关键概念

- **节点结构**：每个节点包含多个子节点（对应不同字符）和一个标志位（标记是否是单词结尾）
- **路径表示**：从根到任意节点的路径对应一个前缀
- **查找效率**：查找、插入操作的时间复杂度为 O(m)，其中 m 是字符串长度

### 基本实现思路

1. 创建一个 Trie 类，维护一个根节点
2. 定义节点结构，包含子节点映射和单词结束标记
3. 实现插入、查找、前缀匹配三个核心操作

## 实现细节

### 初始实现及其问题

最初的实现使用了一个长度为 255 的数组来表示每个节点的所有可能子节点，如下所示：

```go
type TrieNode struct {
    children []*TrieNode // 长度为 255 的数组
    flag     bool        // 标记单词结束
}
```

**问题分析**：
- **空间浪费**：对于只包含小写字母的题目，分配 255 个指针（覆盖整个 ASCII 范围）是极大的浪费
- **缓存效率低**：较大的节点结构会导致缓存命中率降低
- **内存分配开销**：每个新节点都需要分配大量内存，增加 GC 压力

### 优化方案

**方案1：减小子节点数组大小**

由于题目明确字符串仅由小写英文字母组成，可以将数组大小从 255 减少到 26：

```go
type TrieNode struct {
    children [26]*TrieNode // 只针对小写字母 a-z
    isEnd    bool          // 标记单词结束
}
```

**方案2：使用哈希表代替固定数组**

```go
type TrieNode struct {
    children map[rune]*TrieNode // 使用哈希表存储子节点
    isEnd    bool
}
```

**方案比较**：
- 对于本题（字符集小且确定），固定大小的数组更优
- 当字符集较大或不确定时，哈希表方案更灵活

## 代码实现

### 优化后的 Trie 实现

```go
type Trie struct {
    root *TrieNode
}

type TrieNode struct {
    children [26]*TrieNode // 只针对小写字母 a-z
    isEnd    bool          // 标记单词结束
}

func Constructor() Trie {
    return Trie{
        root: &TrieNode{},
    }
}

func (this *Trie) Insert(word string) {
    node := this.root
    for _, ch := range word {
        index := ch - 'a' // 将字符映射到0-25的索引
        if node.children[index] == nil {
            node.children[index] = &TrieNode{}
        }
        node = node.children[index]
    }
    node.isEnd = true // 标记单词结束
}

func (this *Trie) Search(word string) bool {
    node := this.searchPrefix(word)
    return node != nil && node.isEnd
}

func (this *Trie) StartsWith(prefix string) bool {
    return this.searchPrefix(prefix) != nil
}

// 提取公共查找逻辑
func (this *Trie) searchPrefix(prefix string) *TrieNode {
    node := this.root
    for _, ch := range prefix {
        index := ch - 'a'
        if node.children[index] == nil {
            return nil
        }
        node = node.children[index]
    }
    return node
}
```

### 执行示例

以 `insert("apple")` 为例，执行过程如下：

1. 从根节点开始
2. 处理 'a'：计算索引(0)，创建对应子节点
3. 处理 'p'：计算索引(15)，创建对应子节点
4. 处理 'p'：使用已存在的索引15子节点
5. 处理 'l'：计算索引(11)，创建对应子节点
6. 处理 'e'：计算索引(4)，创建对应子节点
7. 标记 'e' 节点的 isEnd 为 true，表示 "apple" 是一个完整单词

## 方法比较

| 方面 | 原始实现 | 优化实现 |
| --- | --- | --- |
| 时间复杂度 | O(m) | O(m) |
| 空间复杂度 | O(255*n) | O(26*n) |
| 内存使用 | 较高 | 降低约90% |
| 缓存效率 | 较低 | 较高 |
| 实现复杂度 | 简单 | 简单 |
| 推荐度 | ★★☆☆☆ | ★★★★★ |

## 复杂度分析

### 时间复杂度

- **插入操作**：O(m)，其中 m 是单词长度
- **查找操作**：O(m)
- **前缀匹配**：O(m)

上述操作的时间复杂度都是线性的，与单词长度成正比，这是最优的。

### 空间复杂度

- **原始实现**：O(255*n)，其中 n 是所有插入单词的字符总数
- **优化实现**：O(26*n)，减少了约 90% 的空间使用

## 关键收获

1. **空间优化很重要**：在处理大量数据的树结构时，节点设计对整体性能影响巨大
2. **针对约束优化**：根据题目约束（如字符集限制）有针对性地优化数据结构
3. **提取公共逻辑**：将重复的搜索逻辑提取为单独方法，提高代码可维护性
4. **常量级优化**：虽然复杂度级别相同，但常数级优化（如从255减少到26）在实际执行中能带来显著提升

## Trie的常见应用

- **自动补全**：搜索引擎、输入法的单词补全功能
- **拼写检查**：检查单词拼写是否正确
- **字符串匹配**：在大量字符串中快速查找
- **路由匹配**：Web服务器的URL路由

Trie树虽然实现简单，但在处理字符串前缀查询方面有着无可比拟的优势，是一种非常实用的数据结构。