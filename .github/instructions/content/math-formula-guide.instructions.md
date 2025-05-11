---
description: 
globs: 
alwaysApply: false
---
# 数学公式展示指南

## Markdown 中的数学公式格式

在博客文章中展示数学公式时，应始终使用 Markdown 的数学公式语法，这样可以确保公式的正确渲染和良好显示。本指南提供了在文章中使用数学公式的标准方法。

### 内联公式

对于行内的小型公式，使用单个美元符号 `$` 包围公式：

```markdown
这是一个内联公式 $E = mc^2$ 的示例。
```

内联公式适用于：
- 简单的数学表达式
- 不需要另起一行的公式
- 文本流中的数学符号

### 块级公式

对于需要单独成行、更为复杂或需要强调的公式，使用双美元符号 `$$` 包围公式：

```markdown
下面是一个块级公式：

$$
\frac{d}{dx}\left( \int_{a}^{x} f(t) \, dt \right) = f(x)
$$
```

块级公式适用于：
- 复杂的数学表达式
- 需要居中显示的重要公式
- 多行数学推导

### 常见数学符号与格式

#### 基本数学符号
```markdown
- 加减：$a + b - c$
- 乘除：$a \times b \div c$ 或 $a \cdot b / c$
- 幂和下标：$x^2$, $y_i$
- 分数：$\frac{a}{b}$
- 平方根：$\sqrt{x}$ 或 $\sqrt[n]{x}$
```

#### 求和与积分
```markdown
- 求和：$\sum_{i=1}^{n} x_i$
- 积分：$\int_{a}^{b} f(x) \, dx$
- 多重积分：$\iint_{D} f(x,y) \, dx \, dy$
```

#### 矩阵与向量
```markdown
- 向量：$\vec{a}$ 或 $\overrightarrow{AB}$
- 矩阵：
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$
```

#### 逻辑与集合
```markdown
- 属于：$a \in A$
- 包含：$A \subset B$
- 交集与并集：$A \cap B$, $A \cup B$
- 逻辑运算：$p \land q$, $p \lor q$, $\neg p$
```

### 算法复杂度表示

在算法文章中，使用数学公式表示时间和空间复杂度：

```markdown
- 时间复杂度：$O(n \log n)$
- 空间复杂度：$O(n^2)$
- 最好情况：$\Omega(n)$
- 平均情况：$\Theta(n \log n)$
```

### 多行公式与对齐

对于需要对齐的多行公式，使用 `align` 环境：

```markdown
$$
\begin{align}
f(x) &= (x+a)(x+b) \\
&= x^2 + (a+b)x + ab
\end{align}
$$
```

### 算法中的递归式

展示递归关系时使用数学公式：

```markdown
动态规划的状态转移方程：

$$
dp[i] = \begin{cases}
1, & \text{if } i = 0 \text{ or } i = 1 \\
dp[i-1] + dp[i-2], & \text{if } i > 1
\end{cases}
$$
```

## 最佳实践

1. **一致性**：在同一篇文章中保持公式风格的一致性
2. **简洁性**：尽量使公式简洁明了，避免不必要的复杂性
3. **变量命名**：使用有意义的变量名，并在必要时解释符号含义
4. **分段解释**：对于复杂公式，先展示完整形式，然后逐步解释各部分含义
5. **结合示例**：用具体数值示例解释抽象公式
6. **适当换行**：确保长公式在所有设备上都能正确显示

## 注意事项

- 检查公式渲染效果：发布前预览文章，确保所有公式正确渲染
- 转义字符：在普通文本中使用数学符号时，使用反斜杠 `\` 转义特殊字符
- 公式编号：对于需要引用的重要公式，可以添加编号：

```markdown
$$
E = mc^2 \tag{1}
$$

如公式(1)所示...
```

## 相关资源

- [KaTeX 支持的函数列表](mdc:hexo-blog/https:/katex.org/docs/supported.html)
- [LaTeX 数学符号速查表](mdc:hexo-blog/https:/oeis.org/wiki/List_of_LaTeX_mathematical_symbols)
- [Markdown 数学公式语法指南](mdc:hexo-blog/https:/math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)
