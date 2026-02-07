---
title: "LeetCode 211 - 添加与搜索单词-数据结构设计（Design Add and Search Words Data Structure）"
date: 2025-06-29 16:04:36
categories:
  - 算法刷题
  - LeetCode
  - 模拟
tags:
  - 字典树
  - Trie
  - Medium
  - 面试经典150
  - LeetCode
  - 深度优先搜索
  - DFS
description: "使用字典树(Trie)实现支持通配符搜索的单词字典，关键在于递归DFS处理'.'字符的所有可能匹配"
---

## 问题描述

请你设计一个数据结构，支持添加新单词和查找字符串是否与任何先前添加的字符串匹配。

实现词典类 `WordDictionary`：
- `WordDictionary()` 初始化词典对象
- `void addWord(word)` 将 `word` 添加到数据结构中，之后可以对它进行匹配
- `bool search(word)` 如果数据结构中存在字符串与 `word` 匹配，则返回 `true`；否则，返回 `false`。`word` 中可能包含一些 `'.'`，每个 `'.'` 都可以表示任何一个字母。

### 示例

```
输入：
["WordDictionary","addWord","addWord","addWord","search","search","search","search"]
[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]

输出：
[null,null,null,null,false,true,true,true]

解释：
WordDictionary wordDictionary = new WordDictionary();
wordDictionary.addWord("bad");
wordDictionary.addWord("dad");
wordDictionary.addWord("mad");
wordDictionary.search("pad"); // 返回 False
wordDictionary.search("bad"); // 返回 True
wordDictionary.search(".ad"); // 返回 True
wordDictionary.search("b.."); // 返回 True
```

### 约束条件

- `1 <= word.length <= 25`
- `addWord` 中的 `word` 由小写英文字母组成
- `search` 中的 `word` 由 `'.'` 或小写英文字母组成
- 最多调用 `10^4` 次 `addWord` 和 `search`

## 解题思路

这道题需要实现一个支持通配符搜索的字典数据结构。**核心思路是使用字典树(Trie)存储单词，并用深度优先搜索(DFS)处理通配符匹配**。

### 关键洞察

1. **字典树适合前缀匹配**：Trie的每个节点表示一个字符，从根到叶子的路径构成完整单词
2. **通配符需要递归处理**：遇到 `'.'` 时，需要尝试所有可能的字符分支
3. **状态记录很重要**：每个节点需要标记是否为单词结尾

### 算法步骤

#### 1. 数据结构设计

```
TrieNode 结构：
├── children[26]  // 26个小写字母的子节点
└── isEnd        // 标记是否为单词结尾
```

#### 2. AddWord 操作

1. 从根节点开始遍历待添加的单词
2. 对每个字符，计算其在children数组中的索引：`index = char - 'a'`
3. 如果对应子节点不存在，创建新节点
4. 移动到子节点，继续处理下一个字符
5. 单词结束时，标记当前节点的 `isEnd = true`

#### 3. Search 操作（核心难点）

使用递归DFS处理两种情况：

**普通字符**：
- 直接沿着对应的子节点路径继续搜索

**通配符 '.'**：
- 遍历当前节点的所有非空子节点
- 对每个子节点递归调用搜索函数
- 只要有一个分支返回true，整个搜索就成功

## 实现细节

### DFS递归函数设计

```go
func dfs(node *TrieNode, word string, index int) bool {
    // 边界条件检查
    if node == nil {
        return false
    }
    
    // 搜索完成，检查是否为单词结尾
    if index >= len(word) {
        return node.isEnd
    }
    
    // 处理通配符
    if word[index] == '.' {
        // 尝试所有可能的字符
        for i := range node.children {
            if dfs(node.children[i], word, index+1) {
                return true
            }
        }
        return false
    }
    
    // 处理普通字符
    return dfs(node.children[word[index]-'a'], word, index+1)
}
```

### 算法执行示例

以搜索 `".ad"` 为例（假设字典中有 "bad", "dad", "mad"）：

```
1. dfs(root, ".ad", 0)
   ├── word[0] = '.' → 遍历所有子节点
   ├── dfs(node_b, ".ad", 1) → 搜索 "ad"
   │   └── word[1] = 'a' → 进入node_a
   │       └── word[2] = 'd' → 进入node_d
   │           └── index=3, node_d.isEnd=true → 返回true
   └── 找到匹配，返回true
```

## 代码实现

```go
type WordDictionary struct {
    root *TrieNode
}

type TrieNode struct {
    children [26]*TrieNode // 只针对小写字母 a-z
    isEnd    bool          // 标记单词结束
}

func Constructor() WordDictionary {
    return WordDictionary{
        root: &TrieNode{},
    }
}

func (this *WordDictionary) AddWord(word string) {
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

func (this *WordDictionary) Search(word string) bool {
    var dfs func(node *TrieNode, index int) bool
    
    dfs = func(node *TrieNode, index int) bool {
        if node == nil {
            return false
        }
        if index >= len(word) {
            return node.isEnd
        }
        
        if word[index] == '.' {
            // 尝试所有可能的字符分支
            for i := range node.children {
                if dfs(node.children[i], index+1) {
                    return true
                }
            }
            return false
        }
        
        // 普通字符，直接沿着对应路径搜索
        return dfs(node.children[word[index]-'a'], index+1)
    }
    
    return dfs(this.root, 0)
}
```

## 复杂度分析

### 时间复杂度

**AddWord操作**：$O(m)$
- 其中 $m$ 是单词长度
- 需要遍历单词的每个字符

**Search操作**：
- **最好情况**：$O(m)$ - 无通配符时
- **最坏情况**：$O(26^k \cdot m)$ - 其中 $k$ 是通配符数量
- 通配符会导致指数级的搜索分支

### 空间复杂度

$O(ALPHABET\_SIZE \times N \times M)$
- $ALPHABET\_SIZE = 26$（小写字母数量）
- $N$ 是单词总数
- $M$ 是平均单词长度
- Trie的空间消耗取决于单词的公共前缀

## 方法比较

| 方面         | Trie + DFS        | 哈希表 + 暴力搜索     |
|-------------|-------------------|----------------------|
| 时间复杂度   | AddWord: O(m)     | AddWord: O(1)        |
|             | Search: O(26^k×m) | Search: O(N×m)       |
| 空间复杂度   | O(26×N×M)         | O(N×M)               |
| 通配符支持   | ★★★★★             | ★★☆☆☆                |
| 实现复杂度   | ★★★☆☆             | ★★★★☆                |
| 前缀查询     | ★★★★★             | ★☆☆☆☆                |

## 关键收获

1. **Trie适合字符串前缀操作**：对于涉及字符串前缀匹配的问题，Trie通常是最佳选择
2. **递归处理分支逻辑**：通配符问题常需要递归探索多个可能的路径
3. **状态标记的重要性**：`isEnd` 标记确保只有完整单词才能匹配成功
4. **优化搜索策略**：可以考虑剪枝优化，比如提前终止无效分支

### 常见陷阱

- **忘记检查 `isEnd`**：搜索到单词结尾时必须验证是否为有效单词
- **边界条件处理**：空节点和索引越界需要正确处理
- **通配符逻辑错误**：需要遍历所有可能的子节点，而不是第一个找到的

### 相关问题

- [LeetCode 208: 实现 Trie (前缀树)](https://leetcode.cn/problems/implement-trie-prefix-tree/)
- [LeetCode 79: 单词搜索](https://leetcode.cn/problems/word-search/)
- [LeetCode 212: 单词搜索 II](https://leetcode.cn/problems/word-search-ii/) 