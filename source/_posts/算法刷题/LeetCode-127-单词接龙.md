---
title: "LeetCode 127 - 单词接龙（Word Ladder）"
date: 2025-06-29 14:49:09
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 广度优先搜索
  - 图
  - BFS
  - Medium
  - 面试经典150
  - LeetCode
description: "使用BFS和虚拟节点技巧解决单词接龙问题，将单词转换建模为图的最短路径，巧妙利用中间节点连接相似单词"
---

## 问题描述

字典 `wordList` 中从单词 `beginWord` 和 `endWord` 的**转换序列**是一个按下述规格组成的序列：

1. 序列中第一个单词是 `beginWord`
2. 序列中最后一个单词是 `endWord`
3. 每次转换只能改变一个字母
4. 转换过程中的中间单词必须是字典 `wordList` 中的单词

给你两个单词 `beginWord` 和 `endWord` 和一个字典 `wordList`，找到从 `beginWord` 到 `endWord` 的**最短转换序列**中的**单词数目**。如果不存在这样的转换序列，返回 0。

### 示例 1

```
输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
输出：5
解释：一个最短转换序列是 "hit" -> "hot" -> "dot" -> "dog" -> "cog", 返回它的长度 5。
```

### 示例 2

```
输入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]
输出：0
解释：endWord "cog" 不在字典中，所以无法进行转换。
```

### 约束条件

- `1 <= beginWord.length <= 10`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 5000`
- `wordList[i].length == beginWord.length`
- `beginWord`、`endWord` 和 `wordList[i]` 由小写英文字母组成
- `beginWord != endWord`
- `wordList` 中的所有字符串**互不相同**

## 解题思路

这道题本质上是一个**图的最短路径问题**。我们需要将单词转换问题建模为图，然后使用 BFS 找到最短路径。

### 核心洞察

**关键思路**：将每个单词看作图中的节点，如果两个单词只相差一个字符，就在它们之间建立一条边。然后使用 BFS 从 `beginWord` 开始搜索到 `endWord` 的最短路径。

### 虚拟节点技巧

直接比较每对单词是否只相差一个字符的时间复杂度很高。我们使用一个巧妙的**虚拟节点**技巧：

1. 对于每个单词的每个位置，将该位置的字符替换为 `*`，创建一个虚拟节点
2. 例如：`"hit"` 可以生成 `"*it"`、`"h*t"`、`"hi*"` 三个虚拟节点
3. 所有能生成相同虚拟节点的单词之间都只相差一个字符

```
单词图示例：
hit -> *it <- hot
hit -> h*t <- hut  
hit -> hi* <- his

这样 hit 和 hot 通过虚拟节点 *it 连接起来
```

### 算法步骤

1. **建图阶段**：
   - 为每个单词创建虚拟节点
   - 建立单词节点与虚拟节点之间的双向边

2. **BFS 搜索阶段**：
   - 从 `beginWord` 开始 BFS
   - 当找到 `endWord` 时返回路径长度
   - 由于存在虚拟节点，实际路径长度需要除以 2 再加 1

## 实现细节

### 建图过程

```go
// 添加单词到图中，返回单词的ID
addWord := func(word string) int {
    id, has := wordId[word]
    if !has {
        id = len(wordId)
        wordId[word] = id
        graph = append(graph, []int{})
    }
    return id
}

// 为单词创建虚拟节点并建立连接
addEdge := func(word string) int {
    id1 := addWord(word)
    s := []byte(word)
    
    for i, b := range s {
        s[i] = '*'                    // 创建虚拟节点
        id2 := addWord(string(s))     // 添加虚拟节点
        graph[id1] = append(graph[id1], id2)  // 建立双向边
        graph[id2] = append(graph[id2], id1)
        s[i] = b                      // 恢复原字符
    }
    return id1
}
```

### BFS 搜索过程

```go
// 初始化距离数组
const inf int = math.MaxInt32
dist := make([]int, len(wordId))
for i := range dist {
    dist[i] = inf
}
dist[beginId] = 0

// BFS 队列
queue := []int{beginId}

for len(queue) > 0 {
    v := queue[0]
    queue = queue[1:]
    
    if v == endId {
        return dist[endId]/2 + 1  // 除以2是因为有虚拟节点
    }
    
    for _, w := range graph[v] {
        if dist[w] == inf {
            dist[w] = dist[v] + 1
            queue = append(queue, w)
        }
    }
}
```

## 代码实现

```go
func ladderLength(beginWord string, endWord string, wordList []string) int {
    wordId := make(map[string]int)
    graph := make([][]int, 0)
    
    // 添加单词到图中
    addWord := func(word string) int {
        id, has := wordId[word]
        if !has {
            id = len(wordId)
            wordId[word] = id
            graph = append(graph, []int{})
        }
        return id
    }
    
    // 为单词创建虚拟节点并建立连接
    addEdge := func(word string) int {
        id1 := addWord(word)
        s := []byte(word)
        
        for i, b := range s {
            s[i] = '*'
            id2 := addWord(string(s))
            graph[id1] = append(graph[id1], id2)
            graph[id2] = append(graph[id2], id1)
            s[i] = b
        }
        return id1
    }
    
    // 建图：处理字典中的所有单词
    for _, word := range wordList {
        addEdge(word)
    }
    
    // 添加起始单词
    beginId := addEdge(beginWord)
    
    // 检查目标单词是否存在
    endId, has := wordId[endWord]
    if !has {
        return 0
    }
    
    // BFS 搜索最短路径
    const inf int = math.MaxInt32
    dist := make([]int, len(wordId))
    for i := range dist {
        dist[i] = inf
    }
    dist[beginId] = 0
    
    queue := []int{beginId}
    
    for len(queue) > 0 {
        v := queue[0]
        queue = queue[1:]
        
        if v == endId {
            return dist[endId]/2 + 1
        }
        
        for _, w := range graph[v] {
            if dist[w] == inf {
                dist[w] = dist[v] + 1
                queue = append(queue, w)
            }
        }
    }
    
    return 0
}
```

## 算法执行示例

以 `beginWord = "hit"`, `endWord = "cog"`, `wordList = ["hot","dot","dog","lot","log","cog"]` 为例：

### 建图阶段

```
单词节点：hit(0), hot(1), dot(2), dog(3), lot(4), log(5), cog(6)
虚拟节点：*it(7), h*t(8), hi*(9), *ot(10), ho*(11), ...

连接关系：
hit(0) <-> *it(7) <-> hot(1)
hit(0) <-> h*t(8) <-> hot(1)  
hot(1) <-> *ot(10) <-> dot(2), lot(4)
...
```

### BFS 搜索过程

```
初始：queue = [0(hit)], dist[0] = 0

第1轮：访问 hit(0)
- 访问虚拟节点 *it(7), h*t(8), hi*(9)
- dist[7] = dist[8] = dist[9] = 1
- queue = [7, 8, 9]

第2轮：访问虚拟节点
- 通过 *it(7) 访问到 hot(1), dist[1] = 2
- queue = [8, 9, 1]

...继续直到找到 cog(6)

最终：dist[6] = 8，返回 8/2 + 1 = 5
```

## 复杂度分析

### 时间复杂度：$O(M^2 \times N)$

- $M$ 是单词长度，$N$ 是单词列表长度
- 建图阶段：每个单词创建 $M$ 个虚拟节点，总共 $O(M \times N)$ 个节点
- BFS 阶段：最坏情况下访问所有节点和边，边数为 $O(M \times N)$
- 字符串操作：每次字符串复制需要 $O(M)$ 时间

### 空间复杂度：$O(M^2 \times N)$

- 图存储：$O(M \times N)$ 个节点，每个节点最多连接 $O(M)$ 条边
- 队列和距离数组：$O(M \times N)$

## 关键收获

### 重要算法概念

1. **图建模**：将问题转换为图的最短路径问题
2. **虚拟节点技巧**：避免直接比较所有单词对，提高建图效率
3. **BFS 特性**：保证找到最短路径

### 常见陷阱

1. **忘记检查目标单词**：如果 `endWord` 不在字典中直接返回 0
2. **路径长度计算错误**：由于有虚拟节点，需要 `dist/2 + 1`
3. **双向边建立**：虚拟节点与单词节点之间需要建立双向连接

### 相关问题

- LeetCode 126: 单词接龙 II（返回所有最短路径）
- LeetCode 433: 最小基因变化（相似的BFS问题）
- 其他图的最短路径问题

这道题展示了如何将字符串转换问题巧妙地转化为图论问题，并使用虚拟节点优化建图过程，是 BFS 算法的经典应用。 