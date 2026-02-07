---
title: "LeetCode 399 - 除法求值：从图论到Floyd算法的优雅转换"
date: 2025-06-22 17:15:21
categories:
  - 算法刷题
  - LeetCode
  - 图论
tags:
  - 图论
  - 深度优先搜索
  - Floyd-Warshall
  - Medium
  - 面试经典150
  - LeetCode
description: "深入探讨除法求值问题的多种解法：从直观的图论DFS到优雅的Floyd算法改进，揭示经典算法在新问题中的巧妙应用"
---

## 引言：一个看似简单的数学问题

当我第一次看到LeetCode 399这道题时，心想："不就是计算一些除法吗？"但仔细一看，发现事情远没有那么简单。

题目给出了一些变量之间的除法关系，比如 `a/b = 2.0, b/c = 3.0`，然后要求我们计算其他变量对的除法结果，如 `a/c = ?`。如果变量不存在或者无法通过已知关系推导出结果，就返回 `-1.0`。

这个问题的有趣之处在于，它表面上是数学计算，实际上是一个**关系传递**的问题。就像现实生活中的汇率换算：如果你知道 `1美元 = 7人民币` 和 `1人民币 = 0.14欧元`，那么你自然能推算出 `1美元 = 0.98欧元`。

## 第一直觉：这不就是图论问题吗？

面对这样的关系传递问题，我的第一直觉是：**这可以用图来建模**！

### 思路的形成过程

让我们一步步分析：

1. **变量可以看作节点**：每个变量（如 `a`, `b`, `c`）都是图中的一个节点
2. **除法关系可以看作边**：如果 `a/b = 2.0`，那么可以建立一条从 `a` 到 `b` 的有向边，权重为 `2.0`
3. **查询就是路径搜索**：要计算 `a/c`，就是要找从节点 `a` 到节点 `c` 的路径

但这里有个关键问题：**路径上的权重如何计算？**

在传统的图论问题中，我们通常计算路径长度（权重相加）。但在除法问题中，关系是**乘性的**：
- 如果 `a/b = 2.0` 且 `b/c = 3.0`
- 那么 `a/c = (a/b) × (b/c) = 2.0 × 3.0 = 6.0`

这个洞察很重要：**路径权重需要相乘，而不是相加**！

### 图的构建策略

明确了基本思路后，我们需要考虑如何构建图：

```
给定：a/b = 2.0, b/c = 3.0

构建的图：
   a ----2.0---→ b ----3.0---→ c
   ↑             ↑             ↑
   |             |             |
 0.5            0.33          0.33
   |             |             |
   ↓             ↓             ↓
   a ←---0.5---- b ←---0.33--- c
```

注意几个要点：
1. **双向边**：如果 `a/b = 2.0`，那么 `b/a = 0.5`
2. **自环**：每个变量除以自己等于 `1.0`
3. **权重传递**：通过中间节点可以计算间接关系

## 解法一：DFS图搜索 - 直观而有效

基于图论的思路，最直观的解法就是深度优先搜索：

### 核心算法设计

```go
func calcEquation(equations [][]string, values []float64, queries [][]string) []float64 {
    // 1. 构建图的邻接表
    graph := make(map[string]map[string]float64)
    
    // 2. 初始化图 - 添加双向边和自环
    for i, equation := range equations {
        a, b := equation[0], equation[1]
        value := values[i]
        
        if graph[a] == nil {
            graph[a] = make(map[string]float64)
        }
        if graph[b] == nil {
            graph[b] = make(map[string]float64)
        }
        
        // 关键：双向边的建立
        graph[a][b] = value      // a/b = value
        graph[b][a] = 1.0 / value // b/a = 1/value
        
        // 自环处理
        graph[a][a] = 1.0
        graph[b][b] = 1.0
    }
    
    // 3. DFS搜索函数 - 寻找路径并计算乘积
    var dfs func(start, end string, visited map[string]bool) float64
    dfs = func(start, end string, visited map[string]bool) float64 {
        if graph[start] == nil {
            return -1.0
        }
        
        // 直接可达
        if val, exists := graph[start][end]; exists {
            return val
        }
        
        // 标记访问，避免环路
        visited[start] = true
        
        // 递归搜索所有邻居
        for neighbor, weight := range graph[start] {
            if !visited[neighbor] {
                result := dfs(neighbor, end, visited)
                if result != -1.0 {
                    return weight * result  // 关键：权重相乘
                }
            }
        }
        
        // 回溯
        visited[start] = false
        return -1.0
    }
    
    // 4. 处理所有查询
    results := make([]float64, len(queries))
    for i, query := range queries {
        start, end := query[0], query[1]
        
        if graph[start] == nil || graph[end] == nil {
            results[i] = -1.0
            continue
        }
        
        if start == end {
            results[i] = 1.0
            continue
        }
        
        visited := make(map[string]bool)
        results[i] = dfs(start, end, visited)
    }
    
    return results
}
```

### 算法执行过程分析

让我们通过一个具体例子来看DFS的执行过程：

**输入**：`equations = [["a","b"],["b","c"]], values = [2.0,3.0]`
**查询**：`a/c`

1. **图构建阶段**：
   ```
   graph["a"]["b"] = 2.0, graph["b"]["a"] = 0.5
   graph["b"]["c"] = 3.0, graph["c"]["b"] = 0.33
   graph["a"]["a"] = 1.0, graph["b"]["b"] = 1.0, graph["c"]["c"] = 1.0
   ```

2. **DFS搜索过程**：
   ```
   dfs("a", "c", {})
   → 检查直接边：不存在 a→c
   → 标记 a 为已访问
   → 遍历邻居：找到 b，权重 2.0
     → dfs("b", "c", {"a": true})
       → 检查直接边：存在 b→c，权重 3.0
       → 返回 3.0
     → 返回 2.0 × 3.0 = 6.0
   ```

### DFS解法的优缺点

**优点**：
- 思路直观，容易理解
- 实现相对简单
- 适合中小规模数据

**缺点**：
- 每次查询都需要重新搜索
- 时间复杂度较高：$O(M \times (N + E))$
- 大量查询时效率不高

## 解法二：Floyd-Warshall算法的优雅转换

就在我对DFS解法基本满意的时候，突然意识到一个问题：如果查询量很大怎么办？每次都DFS搜索显然不够高效。

这时我想到了经典的**Floyd-Warshall算法**。传统的Floyd算法用于计算所有点对之间的最短路径，核心是这样的：

```go
for k := 0; k < n; k++ {
    for i := 0; i < n; i++ {
        for j := 0; j < n; j++ {
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
        }
    }
}
```

但是等等！**我们的除法问题中，路径权重是相乘的，不是相加的**。那么，能不能把加法改成乘法呢？

### 算法改进的关键洞察

答案是肯定的！关键在于理解除法的传递性：

```
如果 a/k = x 且 k/b = y
那么 a/b = (a/k) × (k/b) = x × y
```

这正好对应Floyd算法中通过中间点k的路径计算！

### Floyd算法的除法版本

```go
func calcEquationFloyd(equations [][]string, values []float64, queries [][]string) []float64 {
    // 1. 建立变量到索引的映射
    variables := make(map[string]int)
    idx := 0
    for _, equation := range equations {
        for _, variable := range equation {
            if _, exists := variables[variable]; !exists {
                variables[variable] = idx
                idx++
            }
        }
    }
    
    n := len(variables)
    
    // 2. 初始化距离矩阵
    dist := make([][]float64, n)
    for i := range dist {
        dist[i] = make([]float64, n)
        for j := range dist[i] {
            if i == j {
                dist[i][j] = 1.0    // 自己/自己 = 1
            } else {
                dist[i][j] = -1.0   // 初始不可达
            }
        }
    }
    
    // 3. 填充已知的除法关系
    for i, equation := range equations {
        a, b := variables[equation[0]], variables[equation[1]]
        value := values[i]
        
        dist[a][b] = value
        dist[b][a] = 1.0 / value
    }
    
    // 4. Floyd核心算法 - 关键在于乘法！
    for k := 0; k < n; k++ {
        for i := 0; i < n; i++ {
            for j := 0; j < n; j++ {
                // 传统Floyd: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                // 除法版本: 如果通过k的路径存在，则计算乘积
                if dist[i][k] != -1.0 && dist[k][j] != -1.0 {
                    if dist[i][j] == -1.0 {
                        dist[i][j] = dist[i][k] * dist[k][j]
                    }
                }
            }
        }
    }
    
    // 5. 处理查询 - O(1)时间复杂度
    results := make([]float64, len(queries))
    for i, query := range queries {
        start, end := query[0], query[1]
        startIdx, startExists := variables[start]
        endIdx, endExists := variables[end]
        
        if !startExists || !endExists {
            results[i] = -1.0
        } else {
            results[i] = dist[startIdx][endIdx]
        }
    }
    
    return results
}
```

### Floyd算法的执行过程

让我们看看Floyd算法是如何工作的：

**初始状态**（以 `a/b=2.0, b/c=3.0` 为例）：
```
    a    b    c
a [ 1.0  2.0  -1 ]
b [ 0.5  1.0  3.0]
c [ -1   0.33 1.0]
```

**k=0时**（通过a作为中间点）：
- 检查所有i,j对，看是否能通过a连接
- 发现没有新的连接

**k=1时**（通过b作为中间点）：
- 检查 `dist[a][c]`：`dist[a][b] * dist[b][c] = 2.0 * 3.0 = 6.0`
- 检查 `dist[c][a]`：`dist[c][b] * dist[b][a] = 0.33 * 0.5 = 0.167`

**最终状态**：
```
    a    b    c
a [ 1.0  2.0  6.0 ]
b [ 0.5  1.0  3.0 ]
c [0.167 0.33 1.0 ]
```

现在，任何查询都可以在O(1)时间内完成！

### ❌ 常见错误分析：条件判断的陷阱

在实现Floyd-Warshall算法时，有一个常见的错误会导致精度问题和错误结果。让我们看看这个错误的实现：

```go
// ❌ 错误的Floyd实现
for k := 0; k < cnt; k++ {
    for i := 0; i < cnt; i++ {
        for j := 0; j < cnt; j++ {
            // 问题出现在这里！
            if matrix[i][k] != 0 && matrix[k][j] != 0 && matrix[i][j] != 0 {
                matrix[i][j] = matrix[i][k] * matrix[k][j]
            }
        }
    }
}
```

**错误的根本原因：不必要的 `matrix[i][j] != 0` 条件**

这个多余的条件导致算法只在已存在路径的情况下才更新，错过了许多建立新路径的机会。

**具体的错误场景**

以下测试用例暴露了这个问题：

```
输入：
equations = [["b","a"],["c","b"],["d","c"],...,["t","u"]]  // 20个连续关系
values = [1e-05,1e-05,1e-05,...,1e-05]  // 20个相同的小数值
queries = [["a","u"]]

预期输出：[1.0]
实际输出：[0.99994]  // 精度丢失
```

**错误分析**：

1. **路径建立失败**：由于 `matrix[i][j] != 0` 条件，算法错过了通过中间节点建立新路径的机会

2. **精度累积误差**：算法可能在不同中间节点间重复计算，导致浮点运算累积误差

3. **理论vs实际**：理论上 `a/u` 应该等于：
   ```
   (1×10^5)^20 × (1×10^-5)^20 = 1.0
   ```
   但错误的条件判断破坏了这个数学关系

**正确的实现方式**：

```go
// ✅ 正确的Floyd实现
for k := 0; k < n; k++ {
    for i := 0; i < n; i++ {
        for j := 0; j < n; j++ {
            // 关键修改：移除多余的条件
            if dist[i][k] != -1.0 && dist[k][j] != -1.0 {
                if dist[i][j] == -1.0 {  // 只在没有路径时建立新路径
                    dist[i][j] = dist[i][k] * dist[k][j]
                }
            }
        }
    }
}
```

**为什么正确的实现可以工作**：

1. **积极路径发现**：只要通过k有路径就尝试建立i到j的连接
2. **避免重复更新**：只在没有直接路径时才建立新路径
3. **数值稳定性**：减少了不必要的重复计算，提高了精度

**学习要点**：

- Floyd-Warshall算法的本质是**尝试通过中间节点改进路径**
- 不要随意添加"看似合理"的条件判断
- 在浮点运算中要格外注意累积误差的影响
- 算法的正确性不仅在于核心思想，更在于实现细节的准确性

## 两种解法的深度对比

### 复杂度分析

| 方面 | DFS解法 | Floyd解法 |
|------|---------|-----------|
| 预处理时间 | $O(N + E)$ | $O(N^3)$ |
| 单次查询 | $O(N + E)$ | $O(1)$ |
| 总时间复杂度 | $O(M \times (N + E))$ | $O(N^3 + M)$ |
| 空间复杂度 | $O(N + E)$ | $O(N^2)$ |

### 适用场景分析

**DFS解法适合**：
- 变量数量较多，但查询较少的情况
- 图比较稀疏的情况
- 内存受限的情况

**Floyd解法适合**：
- 变量数量不多（N ≤ 100），但查询频繁
- 需要预计算所有可能结果的情况
- 代码简洁性要求高的场合

### 代码可读性对比

从代码可读性来说，Floyd算法明显更胜一筹：

1. **逻辑清晰**：核心就是三重循环，经典算法模板
2. **易于调试**：可以直接观察距离矩阵的变化
3. **数学美感**：加法→乘法的转换体现了算法的适应性

## 深入思考：算法设计的艺术

这道题给我最大的收获不是具体的解法，而是对**算法适应性**的深入理解。

### 经典算法的新应用

Floyd-Warshall算法最初是为了解决最短路径问题，核心操作是：
```
distance = min(current_distance, path1 + path2)
```

但在除法求值问题中，我们巧妙地将其转换为：
```
ratio = path1 × path2  (如果路径存在)
```

这种转换不是简单的替换，而是对算法本质的深刻理解：
- **Floyd算法的本质**：通过中间节点建立连接
- **关键适应**：将"距离相加"改为"比率相乘"
- **数学基础**：除法的传递性

### 问题抽象的重要性

这道题还展示了**问题抽象**的重要性：

1. **表面问题**：计算除法表达式
2. **抽象后的问题**：在有向加权图中计算路径权重乘积
3. **进一步抽象**：传递闭包的计算问题

正确的抽象让我们能够运用已有的算法知识，而不是从零开始设计解法。

## 实际应用场景

除了算法题，这种思路在实际开发中也很有用：

### 货币汇率转换
```go
// 如果知道 USD/CNY = 7.0, CNY/EUR = 0.14
// 就能计算出 USD/EUR = 7.0 × 0.14 = 0.98
```

### 单位换算系统
```go
// 长度单位：米→厘米→毫米
// 1米 = 100厘米, 1厘米 = 10毫米
// 因此 1米 = 1000毫米
```

### 网络拓扑分析
```go
// 网络节点间的传输延迟比例
// 可以用类似方法计算端到端的性能指标
```

## 总结：算法思维的提升

通过这道题，我深刻体会到了算法学习的几个层次：

1. **基础层**：知道某个算法怎么写
2. **应用层**：知道在什么场景下使用某个算法
3. **创新层**：能够改造经典算法解决新问题
4. **设计层**：能够抽象问题本质，选择最优解法

Floyd算法的除法应用完美体现了第三层的能力。它不是简单的算法套用，而是在理解算法本质的基础上，进行创造性的改进。

更重要的是，这种思维方式可以推广到其他问题：
- 当遇到新问题时，首先思考它的本质是什么
- 是否可以抽象为已知的经典问题
- 如果不完全匹配，能否通过巧妙的转换来适应

这就是算法学习的真正价值：不是记住多少个算法模板，而是培养解决问题的思维方式。而LeetCode 399这道除法求值问题，正是这种思维训练的绝佳案例。 