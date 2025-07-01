---
title: "LeetCode 212 - 单词搜索 II（Word Search II）"
date: 2025-07-01 19:15:36
categories:
  - 算法刷题
  - LeetCode
  - 面试经典150
tags:
  - 字典树
  - 深度优先搜索
  - 回溯算法
  - 难度Hard
  - 面试经典150
  - LeetCode
description: "使用字典树(Trie)优化的单词搜索问题，通过DFS遍历二维字符网格同时匹配字典树中的单词，实现高效的多单词搜索算法"
---

## 问题描述

给定一个 `m x n` 二维字符网格 `board` 和一个单词列表 `words`，返回所有在二维网格中可以找到的单词。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中"相邻"单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母在一个单词中不允许被重复使用。

**示例 1：**
```
输入：board = [["o","a","a","n"],
              ["e","t","a","e"],
              ["i","h","k","r"],
              ["i","f","l","v"]], 
     words = ["oath","pea","eat","rain"]
输出：["eat","oath"]
```

**示例 2：**
```
输入：board = [["a","b"],
              ["c","d"]], 
     words = ["abcb"]
输出：[]
```

**约束条件：**
- `m == board.length`
- `n == board[i].length`
- `1 <= m, n <= 12`
- `board[i][j]` 是一个小写英文字母
- `1 <= words.length <= 3 * 10^4`
- `1 <= words[i].length <= 10`
- `words[i]` 由小写英文字母组成
- `words` 中的所有字符串互不相同

## 解题思路

这道题是**单词搜索问题的升级版**，需要在同一个二维网格中搜索多个单词。如果我们对每个单词都进行一次 DFS 搜索，时间复杂度会非常高。因此，我们需要使用**字典树（Trie）**来优化搜索过程。

### 核心思路

**关键洞见**：使用字典树将所有目标单词存储在一个数据结构中，然后只需要对网格进行一次 DFS 遍历，在遍历过程中同时匹配字典树中的所有单词。

### 算法步骤

#### 1. 构建字典树
- 将所有待搜索的单词插入到字典树中
- 在叶子节点存储完整的单词，便于识别完整匹配

#### 2. DFS 搜索策略
- 从网格的每个位置开始进行 DFS
- 在 DFS 过程中，根据当前路径的字符在字典树中进行匹配
- 如果当前路径无法在字典树中继续匹配，则提前剪枝
- 如果匹配到完整单词，则记录结果

#### 3. 回溯机制
- 使用标记字符（如 `#`）来避免在同一次 DFS 中重复访问相同位置
- 在 DFS 返回时恢复原始字符，确保不同路径可以重复使用相同位置

## 实现细节

### 字典树节点设计
```go
type Trie1 struct {
    nodes [26]*Trie1  // 26个字母的子节点
    word  string      // 存储完整单词（仅在单词结尾节点）
}
```

### DFS 搜索流程
1. **边界检查**：检查坐标是否越界或位置是否已访问
2. **字典树匹配**：根据当前字符在字典树中查找对应子节点
3. **剪枝优化**：如果字典树中没有对应子节点，直接返回
4. **结果记录**：如果当前节点包含完整单词，记录到结果中
5. **标记访问**：将当前位置标记为已访问（使用特殊字符）
6. **递归搜索**：向四个方向继续 DFS
7. **恢复状态**：回溯时恢复原始字符

## 代码实现

```go
type Trie1 struct {
    nodes [26]*Trie1
    word  string
}

func Insert(word string, root *Trie1) {
    node := root
    
    for i := range word {
        ch := word[i] - 'a'
        if node.nodes[ch] == nil {
            node.nodes[ch] = &Trie1{}
        }
        node = node.nodes[ch]
    }
    
    node.word = word  // 在单词结尾存储完整单词
}

var dirs = []struct{ x, y int }{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

func findWords(board [][]byte, words []string) []string {
    // 1. 构建字典树
    root := &Trie1{}
    for _, word := range words {
        Insert(word, root)
    }
    
    n, m := len(board), len(board[0])
    seen := map[string]bool{}  // 去重
    
    // 2. DFS 搜索函数
    var dfs func(node *Trie1, x, y int)
    dfs = func(node *Trie1, x, y int) {
        ch := board[x][y]
        node = node.nodes[ch-'a']
        
        // 剪枝：如果字典树中没有对应路径
        if node == nil {
            return
        }
        
        // 如果找到完整单词，记录结果
        if node.word != "" {
            seen[node.word] = true
        }
        
        // 标记当前位置为已访问
        board[x][y] = '#'
        
        // 向四个方向继续搜索
        for _, dir := range dirs {
            nx, ny := x+dir.x, y+dir.y
            if nx < 0 || ny < 0 || nx >= n || ny >= m {
                continue
            }
            if board[nx][ny] == '#' {  // 已访问过
                continue
            }
            dfs(node, nx, ny)
        }
        
        // 回溯：恢复原始字符
        board[x][y] = ch
    }
    
    // 3. 从每个位置开始搜索
    for i, row := range board {
        for j := range row {
            dfs(root, i, j)
        }
    }
    
    // 4. 转换结果格式
    res := make([]string, 0, len(seen))
    for w := range seen {
        res = append(res, w)
    }
    
    return res
}
```

## 方法比较

| 方面       | 暴力解法              | 字典树 + DFS            |
| ---- | ---- | ----- |
| 时间复杂度 | $O(k \cdot m \cdot n \cdot 4^L)$ | $O(m \cdot n \cdot 4^L)$ |
| 空间复杂度 | $O(L)$                | $O(\sum w_i)$            |
| 优点       | 实现简单              | 高效剪枝，减少重复搜索  |
| 缺点       | 重复搜索相同路径      | 需要额外的字典树空间    |
| 推荐度     | ★★☆☆☆               | ★★★★★                   |

其中：
- $k$ = 单词数量
- $m \times n$ = 网格大小  
- $L$ = 单词最大长度
- $\sum w_i$ = 所有单词的字符总数

## 复杂度分析

### 时间复杂度：$O(m \cdot n \cdot 4^L)$

详细分析：
1. **字典树构建**：$O(\sum w_i)$，其中 $\sum w_i$ 是所有单词的字符总数
2. **DFS 搜索**：
   - 从每个位置开始：$O(m \cdot n)$
   - 每次 DFS 最多递归 $L$ 层（单词最大长度）
   - 每层有 4 个方向选择：$O(4^L)$
   - 字典树剪枝大大减少了实际搜索空间

总时间复杂度：$O(m \cdot n \cdot 4^L + \sum w_i)$，主要部分是 $O(m \cdot n \cdot 4^L)$

### 空间复杂度：$O(\sum w_i)$

空间使用分析：
1. **字典树存储**：$O(\sum w_i)$ - 存储所有单词的字符
2. **DFS 递归栈**：$O(L)$ - 最大递归深度为单词长度
3. **结果存储**：$O(k \cdot L)$ - 最多 $k$ 个单词，每个长度 $L$

## 关键收获

### 算法技巧
1. **字典树优化**：将多个单词的搜索问题转化为单次遍历问题
2. **剪枝策略**：利用字典树的前缀特性提前终止无效路径
3. **状态恢复**：使用标记字符避免重复访问，回溯时恢复状态

### 常见陷阱
1. **忘记回溯**：必须在 DFS 返回时恢复原始字符
2. **重复计数**：使用 `map[string]bool` 去重，避免同一单词被多次计算
3. **边界处理**：检查数组越界和已访问位置

### 扩展应用
- **单词游戏**：如 Boggle 游戏的单词搜索
- **文本匹配**：在大文本中搜索多个模式串
- **路径规划**：在图中搜索满足特定模式的路径

这道题完美展示了**字典树在多模式匹配中的强大作用**，是掌握高级字符串算法的重要题目。 