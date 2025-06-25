---
title: "LeetCode 433 - 最小基因变化 (Minimum Genetic Mutation)"
date: 2025-06-25 19:21:49
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 图
  - 广度优先搜索
  - BFS
  - Dijkstra
  - Medium
  - 面试经典150
  - LeetCode
description: "本文详细探讨了 LeetCode 433 题「最小基因变化」的两种核心解法：首先将问题抽象为图论模型，使用 Dijkstra 算法求解；接着介绍更适合本场景的广度优先搜索（BFS）算法，并对两种方法进行深度比较。"
---

### 问题描述

基因序列可以表示为一条由 8 个字符组成的字符串，其中每个字符都是 'A'、'C'、'G' 和 'T' 之一。

假设我们需要调查从基因序列 `startGene` 变为 `endGene` 所发生的基因变化。一次基因变化就意味着这个基因序列中的一个字符发生了变化。

- 例如，`"AACCGGTT" --> "AACCGGTA"` 就是一次基因变化。

另有一个基因库 `bank` 记录了所有有效的基因变化，只有基因库中的基因才是有效的基因序列。（变化后的基因必须位于基因库 `bank` 中）

给你两个基因序列 `startGene` 和 `endGene` ，以及一个基因库 `bank` ，请你找出并返回能够使 `startGene` 变化为 `endGene` 所需的 **最少变化次数**。如果无法完成此基因变化，返回 -1 。

**注意：** 起始基因序列 `startGene` 默认是有效的，但是它并不一定会出现在基因库中。

**示例 1：**

```
输入：startGene = "AACCGGTT", endGene = "AACCGGTA", bank = ["AACCGGTA"]
输出：1
```

**示例 2：**

```
输入：startGene = "AACCGGTT", endGene = "AAACGGTA", bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]
输出：2
```

**示例 3：**

```
输入：startGene = "AAAAACCC", endGene = "AACCCCCC", bank = ["AAAACCCC","AAACCCCC","AACCCCCC"]
输出：3
```

**约束条件:**
- `startGene.length == 8`
- `endGene.length == 8`
- `0 <= bank.length <= 10`
- `bank[i].length == 8`
- `startGene`、`endGene` 和 `bank[i]` 仅由字符 `['A', 'C', 'G', 'T']` 组成

### 解题思路

这个问题要求解"最少变化次数"，这是一个典型的最短路径问题。我们可以将每个基因序列看作一个节点，如果两个基因序列之间可以通过一次变化（即一个字符不同）相互转换，并且目标序列在基因库 `bank` 中，那么这两个节点之间就存在一条边。问题的目标就是找到从 `startGene` 到 `endGene` 的最短路径。

#### 思路一：建图 + Dijkstra 算法

这种方法将问题显式地转换为图的最短路径问题。

1.  **节点定义**：将 `startGene` 以及 `bank` 中所有不重复的基因序列作为图的节点。
2.  **边的定义**：如果两个基因序列（节点）之间只有一个字符不同，则在它们之间连接一条权重为 1 的边。
3.  **构建邻接矩阵**：我们可以创建一个邻接矩阵 `graph` 来存储图的结构。`graph[i][j] = 1` 表示节点 `i` 和节点 `j` 之间可以相互转换。
4.  **最短路径算法**：在构建好的图上，从 `startGene` 对应的节点开始，使用 Dijkstra 算法计算到 `endGene` 对应节点的最短路径。

##### 实现细节

Dijkstra 算法是一种经典的解决单源最短路径问题的算法，它适用于边权为非负数的情况。虽然在这里所有边权都为 1，使用它也是完全正确的。

##### 代码实现 (Go - Dijkstra)

```go
package main

import "math"

// LeetCode 433
func minMutation(startGene string, endGene string, bank []string) int {
	cnt := 0
	DNA2Index := map[string]int{}

	// 将 startGene 和 bank 中的基因序列加入映射并编号
	DNA2Index[startGene] = cnt
	cnt++
	for _, dna := range bank {
		if _, ok := DNA2Index[dna]; ok {
			continue
		}
		DNA2Index[dna] = cnt
		cnt++
	}

	// 如果 endGene 不在可达的基因库中，直接返回 -1
	if _, ok := DNA2Index[endGene]; !ok {
		return -1
	}

	// 初始化邻接矩阵
	graph := make([][]int, cnt)
	for i := range graph {
		graph[i] = make([]int, cnt)
		for j := range graph[i] {
			if i != j {
				graph[i][j] = math.MaxInt32
			}
		}
	}
	
	// 根据基因差异构建图的边
	dnaList := make([]string, cnt)
	for dna, index := range DNA2Index {
		dnaList[index] = dna
	}

	for i := 0; i < cnt; i++ {
		for j := i + 1; j < cnt; j++ {
			if diff(dnaList[i], dnaList[j]) == 1 {
				graph[i][j] = 1
				graph[j][i] = 1
			}
		}
	}

	startIndex := DNA2Index[startGene]
	endIndex := DNA2Index[endGene]

	// 使用 Dijkstra 算法求解
	dist, has := dijkstra(graph, startIndex, endIndex)
	if !has {
		return -1
	}
	return dist
}

// dijkstra 算法实现
func dijkstra(matrix [][]int, start, end int) (int, bool) {
	n := len(matrix)
	dist := make([]int, n)
	visited := make([]bool, n)
	for i := range dist {
		dist[i] = math.MaxInt32
	}
	dist[start] = 0

	for i := 0; i < n; i++ {
		u := -1
		minDist := math.MaxInt32
		for j := 0; j < n; j++ {
			if !visited[j] && dist[j] < minDist {
				minDist = dist[j]
				u = j
			}
		}

		if u == -1 {
			break
		}
		visited[u] = true

		for v := 0; v < n; v++ {
			if !visited[v] && matrix[u][v] != math.MaxInt32 && dist[u]+matrix[u][v] < dist[v] {
				dist[v] = dist[u] + matrix[u][v]
			}
		}
	}

	if dist[end] == math.MaxInt32 {
		return 0, false
	}
	return dist[end], true
}

// 计算两个基因序列的差异字符数
func diff(a, b string) int {
	diffNum := 0
	for i := 0; i < len(a); i++ {
		if a[i] != b[i] {
			diffNum++
		}
	}
	return diffNum
}
```

#### 思路二：广度优先搜索 (BFS)

对于边权全部为 1 的图，广度优先搜索（BFS）是求解最短路径问题的更直接、更高效的选择。BFS 按层级遍历图，第一次到达目标节点时所经过的层数（步数）就是最短路径的长度。

1.  **数据结构**：
    *   一个队列 `queue` 用于存储待访问的基因序列。
    *   一个哈希集合 `visited` (或 `map`) 用于记录已经访问过的序列，防止重复搜索和陷入循环。
    *   一个哈希集合 `bankSet` 用于快速查询一个基因序列是否在基因库 `bank` 中。
2.  **算法流程**：
    *   将 `startGene` 和初始步数 0 加入队列。
    *   将 `startGene` 加入 `visited` 集合。
    *   当队列不为空时，取出队头元素（当前基因序列 `currentGene` 和步数 `steps`）。
    *   如果 `currentGene` 等于 `endGene`，则 `steps` 就是最短路径，返回 `steps`。
    *   否则，生成 `currentGene` 的所有可能的一次变化。对于每个新的基因序列 `nextGene`：
        *   如果 `nextGene` 存在于 `bankSet` 中且未被访问过，则将其加入队列和 `visited` 集合，步数加 1。
    *   如果队列为空仍未找到 `endGene`，说明无法转换，返回 -1。

##### 代码实现 (Go - BFS)

```go
import "container/list"

func minMutationBfs(startGene string, endGene string, bank []string) int {
	bankSet := make(map[string]struct{})
	for _, s := range bank {
		bankSet[s] = struct{}{}
	}
	if _, ok := bankSet[endGene]; !ok {
		return -1
	}

	type pair struct {
		gene  string
		steps int
	}

	q := list.New()
	q.PushBack(pair{startGene, 0})
	visited := make(map[string]struct{})
	visited[startGene] = struct{}{}

	chars := []byte{'A', 'C', 'G', 'T'}

	for q.Len() > 0 {
		element := q.Front()
		p := element.Value.(pair)
		q.Remove(element)

		if p.gene == endGene {
			return p.steps
		}

		geneChars := []byte(p.gene)
		for i := 0; i < len(geneChars); i++ {
			oldChar := geneChars[i]
			for _, c := range chars {
				if oldChar == c {
					continue
				}
				geneChars[i] = c
				nextGene := string(geneChars)
				if _, inBank := bankSet[nextGene]; inBank {
					if _, isVisited := visited[nextGene]; !isVisited {
						visited[nextGene] = struct{}{}
						q.PushBack(pair{nextGene, p.steps + 1})
					}
				}
			}
			geneChars[i] = oldChar // 恢复，以便进行下一个位置的变化
		}
	}

	return -1
}
```

### 方法比较

| 方面       | 方法一 (Dijkstra)          | 方法二 (BFS)               |
|------------|----------------------------|----------------------------|
| 时间复杂度 | O(N² + L*N²) or O(N²logN)  | O(C*L*N)                   |
| 空间复杂度 | O(N²)                      | O(L*N)                     |
| 核心思想   | 通用的单源最短路径算法     | 针对无权图的最短路径优化   |
| 优点       | 思路通用，可处理带权图     | 实现更简洁，效率更高       |
| 缺点       | 对于无权图来说过于复杂     | 仅适用于无权图             |
| 推荐度     | ★★★☆☆                      | ★★★★★                      |

*   **N**: `bank` 的长度。
*   **L**: 基因序列的长度 (这里是 8)。
*   **C**: 基因字符集的大小 (这里是 4)。
*   Dijkstra 的复杂度取决于其具体实现（邻接矩阵为 O(N²)，优先队列为 O(E log V)，在此图中 E 可能达到 O(N²))。
*   BFS 的复杂度中，`C*L` 代表从一个节点可以扩展出的邻居数量，N 是节点总数。

### 复杂度分析

#### Dijkstra
- **时间复杂度**: `O(N^2)`，其中 `N` 是图中节点的总数 (`len(bank) + 1`)。构建邻接矩阵需要 `O(N^2 * L)` 的时间（L=8），Dijkstra 算法在使用邻接矩阵和线性扫描找最小距离节点时的时间复杂度是 `O(N^2)`。
- **空间复杂度**: `O(N^2)`，主要用于存储邻接矩阵。

#### BFS
- **时间复杂度**: `O(C * L * N)`。`N` 是 `bank` 的长度，`L` 是基因序列长度 (8)，`C` 是字符集大小 (4)。对于队列中的每个元素，我们都需要遍历其所有可能的 `C*L` 种变化，并检查其是否在 `bank` 中。由于 `bank` 的大小 `N` 很小，这种方法非常高效。
- **空间复杂度**: `O(L * N)`，用于存储 `bankSet`、`visited` 集合和队列。

### 关键收获

- **问题建模**: 识别出 "最少次数"、"最短转换" 这类问题可以建模为图的最短路径问题是解决关键。
- **算法选择**: 在无权图（所有边的权重都为 1 或相同）中，BFS 是求解最短路径的首选算法。它的实现简单且时间复杂度优于通用的 Dijkstra 算法。
- **隐式图 vs 显式图**: Dijkstra 的解法是先 **显式** 地把图的完整结构（邻接矩阵）构建出来，然后再运行算法。而 BFS 的解法是在搜索过程中 **隐式** 地探索图的节点和边，无需预先构建整个图，从而节省了空间和预处理时间。对于节点连接规则明确但图可能很大的情况，隐式图搜索是更优的选择。 