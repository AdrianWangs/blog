---
title: 'LeetCode 394 - 字符串解码 (String Decode)'
date: 2025-05-11 19:52:30
categories:
  - 算法刷题
  - LeetCode
tags:
  - 栈
  - 字符串
  - Medium
  - LeetCode
description: '详细解析LeetCode第394题字符串解码，通过栈辅助实现，并提供优化思路和代码。'
---

## 问题描述

给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为：`k[encoded_string]`，表示其中方括号内部的 `encoded_string` 正好重复 `k` 次。注意 `k` 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 `k` ，例如不会出现像 `3a` 或 `2[4]` 的输入。

**示例 1：**

```
输入：s = "3[a]2[bc]"
输出："aaabcbc"
```

**示例 2：**

```
输入：s = "3[a2[c]]"
输出："accaccacc"
```

**示例 3：**

```
输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"
```

**示例 4：**

```
输入：s = "abc3[cd]xyz"
输出："abccdcdcdxyz"
```

**约束条件：**

- `1 <= s.length <= 30`
- `s` 由小写英文字母、数字和方括号 `'[]'` 组成
- `s` 保证是一个有效的输入。
- `s` 中所有整数的取值范围为 `[1, 300]`

## 解题思路

这道题的特点是存在嵌套的括号和重复次数，这种具有递归结构或者需要处理嵌套关系的问题，通常可以考虑使用栈来解决。

我们可以维护两个栈：

1.  `numStack`：用于存储重复次数 `k`。
2.  `strStack`：用于存储待解码的字符串片段。

遍历输入的字符串 `s`，根据遇到的不同字符进行相应的操作：

- **遇到数字**：
  - 解析出完整的数字（可能不止一位）。
  - 将解析得到的数字压入 `numStack`。
- **遇到字母**：
  - 解析出连续的字母串。
  - 将这个字母串压入 `strStack`。
- **遇到 `[`**：
  - 这是一个新的解码单元的开始，我们将一个特殊标记（例如 `[` 本身）压入 `strStack`，用于后续识别解码单元的边界。
- **遇到 `]`**：
  - 这是当前解码单元的结束。我们需要从 `strStack` 中弹出字符串，直到遇到 `[`。这些弹出的字符串拼接起来就是当前 `encoded_string`。
  - 从 `numStack` 中弹出一个数字，这是当前 `encoded_string` 需要重复的次数 `k`。
  - 将 `encoded_string` 重复 `k` 次得到解码后的子串。
  - 将这个解码后的子串压回 `strStack`。

遍历完成后，`strStack` 中剩下的所有字符串按顺序拼接起来就是最终的解码结果。

## 代码实现 (优化前)

这是你提供的原始 Go 代码：

```golang
package main

import (
  "fmt"
  "strings"
)

/*
 * @lc app=leetcode.cn id=394 lang=golang
 *
 * [394] 字符串解码
 */

// @lc code=start
func decodeString(s string) string {

  if s == "" {
    return s
  }

  numStack := make([]int, 0)
  strStack := make([]string, 0)

  for i := range s {
    c := s[i]
    // fmt.Println(c) // 调试语句
    if isNum(c) {

      if i >= 1 && isNum(s[i-1]) {
        top := len(numStack) - 1
        numStack[top] = numStack[top]*10 + int(c-'0')
      } else {
        numStack = append(numStack, int(c-'0'))
      }
      continue
    }
    if c == ']' {
      str := ""
      for strStack[len(strStack)-1] != "[" {
        str = strStack[len(strStack)-1] + str
        strStack = strStack[:len(strStack)-1]
      }

      strStack = strStack[:len(strStack)-1] // 弹出 '['
      topNum := numStack[len(numStack)-1]
      numStack = numStack[:len(numStack)-1]

      str = strings.Repeat(str, topNum)
      strStack = append(strStack, str)

      continue
    }

    if c == '[' {
      strStack = append(strStack, string(c))
      continue
    }

    // 处理字母
    if i >= 1 && isChar(s[i-1]) && len(strStack) > 0 && strStack[len(strStack)-1] != "[" {
      // 如果前一个也是字符，并且栈顶不是'['，则追加到栈顶字符串
      strStack[len(strStack)-1] = strStack[len(strStack)-1] + string(c)
    } else {
      // 否则，作为新的字符串入栈
      strStack = append(strStack, string(c))
    }

  }

  res := ""
  for i := 0; i < len(strStack); i++ {
    res += strStack[i]
  }
  return res
}

func isNum(c byte) bool {
  return c <= '9' && c >= '0'
}

func isChar(c byte) bool {
  return (c >= 'a' && c <= 'z')
}

// @lc code=end
```

## 代码分析与可优化点

原始代码的思路是正确的，使用了两个栈来分别存储数字和字符串。但在处理连续数字和连续字母时，逻辑稍微有些复杂：

1.  **连续数字处理**：通过 `if i >= 1 && isNum(s[i-1])` 来判断是否是多位数的一部分，然后更新栈顶数字。
2.  **连续字母处理**：通过 `if i >= 1 && isChar(s[i-1]) && len(strStack) > 0 && strStack[len(strStack)-1] != "["` 来判断是否追加到栈顶的字符串。这种方式使得栈 `strStack` 中存储的元素类型不统一，有时是单个字符，有时是 `[`，有时是已经拼接好的字符串。这增加了处理的复杂度。
3.  **字符串拼接**：在遇到 `]` 时，从 `strStack` 弹出字符串并进行反向拼接 (`str = strStack[len(strStack)-1] + str`)，效率较低。
4.  **栈元素统一性**：`strStack` 中混合了单个字符、`[` 标记和解码后的字符串片段。如果能让栈中元素类型更统一，或者处理逻辑更清晰，会更好。

**优化思路：**

- **简化解析**：我们可以引入一个指针 `ptr` 来遍历字符串 `s`。
- **数字解析**：当遇到数字时，连续读取所有数字位，组成一个完整的数字。
- **字母解析**：当遇到字母时，连续读取所有字母，组成一个完整的字符串。
- **栈内元素**：`strStack` 可以设计为只存储解码过程中的字符串片段。当遇到 `[` 时，可以将当前数字和 `[` 之前累积的字符串（如果有的话）一起入栈。
- **更通用的栈处理**：可以考虑使用一个栈来同时存储数字和字符串，或者使用更结构化的方式。一个常见的优化是，当遇到 `[` 时，将当前的数字和 `[` 前的字符串结果入栈；遇到 `]` 时，出栈得到数字和之前的字符串，然后进行拼接。

## 优化后的代码实现

下面是一个优化后的 Go 版本。这个版本尝试简化解析逻辑，并使栈的操作更清晰。

```golang
import "strings"

func decodeStringOptimized(s string) string {
    numStack := []int{}      // 存储重复次数
    strStack := []string{}   // 存储遇到'['前的字符串结果
    currentNum := 0
    currentStr := strings.Builder{}

    for _, char := range s {
        if char >= '0' && char <= '9' {
            currentNum = currentNum*10 + int(char-'0')
        } else if char == '[' {
            // 将当前的数字和字符串入栈
            numStack = append(numStack, currentNum)
            strStack = append(strStack, currentStr.String())
            // 重置当前数字和字符串
            currentNum = 0
            currentStr.Reset()
        } else if char == ']' {
            // 弹出栈顶的数字和字符串
            repeatTimes := numStack[len(numStack)-1]
            numStack = numStack[:len(numStack)-1]

            prevStr := strStack[len(strStack)-1]
            strStack = strStack[:len(strStack)-1]

            // 构建重复后的字符串
            decodedPart := strings.Repeat(currentStr.String(), repeatTimes)

            // 更新 currentStr 为 prevStr + decodedPart
            currentStr.Reset()
            currentStr.WriteString(prevStr)
            currentStr.WriteString(decodedPart)
        } else { // 字母
            currentStr.WriteRune(char)
        }
    }
    return currentStr.String()
}

// 辅助函数 (如果需要在 main 包外使用，则不需要)
// func isNum(c byte) bool {
//  return c <= '9' && c >= '0'
// }

// func isChar(c byte) bool {
//  return (c >= 'a' && c <= 'z')
// }
```

**优化点说明：**

1.  **`strings.Builder`**：使用 `strings.Builder` 进行字符串拼接，比直接使用 `+` 更高效。
2.  **栈的职责更清晰**：
    - `numStack` 只存储 `[` 对应的重复次数。
    - `strStack` 只存储遇到 `[` 时，它前面的那部分已经解码（或本身就是）的字符串。
3.  **变量作用**：
    - `currentNum`：用于累积当前遇到的数字，形成完整的重复次数。
    - `currentStr`：用于累积当前解码单元内的字符串（在 `[` 和 `]` 之间，或者在最外层）。
4.  **逻辑流程**：
    - **数字**：累加到 `currentNum`。
    - **`[`**：将 `currentNum` 和 `currentStr`（`[`之前的部分）入栈，然后重置 `currentNum` 和 `currentStr` 以开始处理括号内的新内容。
    - **`]`**：
      - 从 `numStack` 弹出重复次数 `repeatTimes`。
      - 从 `strStack` 弹出 `[` 之前的那部分字符串 `prevStr`。
      - `currentStr` 此时是 `]` 和与之配对的 `[` 之间的内容解码结果（如果内部还有嵌套，也已处理完）。
      - 将 `currentStr` 重复 `repeatTimes` 次，然后与 `prevStr` 拼接，形成新的 `currentStr`。
    - **字母**：追加到 `currentStr`。

最终，遍历结束后，`currentStr` 中就是完全解码后的字符串。

## 复杂度分析

假设 `N` 是输入字符串 `s` 的长度。

- **时间复杂度**：

  - 我们遍历字符串 `s` 一次。
  - 栈操作（入栈、出栈）的平均时间复杂度是 O(1)。
  - 字符串的重复操作 `strings.Repeat(str, k)` 的时间复杂度是 O(len(str) \* k)。在最坏情况下，解码后的字符串长度可能非常大。例如 `100[a100[b]]`。
  - 如果最终解码后的字符串长度为 `L`，那么总的时间复杂度可以认为是 O(L)。因为每个字符最终都会被构建出来。在某些情况下，`L` 可能远大于 `N`。如果仅考虑遍历和栈操作，不考虑字符串生成，则是 O(N)。但实际瓶颈在于字符串生成。

- **空间复杂度**：
  - 栈 `numStack` 和 `strStack` 的深度取决于嵌套的层数。最坏情况下，嵌套层数可以是 O(N)（例如 `[[[...]]]`）。
  - `strStack` 中存储的字符串片段的总长度也可能很大。
  - `currentStr` (strings.Builder) 存储中间结果。
  - 综合来看，空间复杂度也与解码后字符串的中间片段长度和嵌套深度有关，最坏情况下可能是 O(L) 或 O(N)（取决于哪个是主导因素）。

## 关键收获

1.  **栈的应用**：对于处理具有嵌套结构或需要“后进先出”逻辑的问题（如括号匹配、表达式求值、字符串解码），栈是非常有效的数据结构。
2.  **状态管理**：在遍历过程中，清晰地管理当前状态（如当前数字 `currentNum`、当前构建的字符串 `currentStr`）至关重要。
3.  **字符串构建效率**：在 Go 中，频繁进行字符串拼接时，使用 `strings.Builder` 通常比直接用 `+` 或 `fmt.Sprintf` 更高效，因为它避免了每次拼接都创建新字符串对象的开销。
4.  **问题分解**：将复杂问题分解为对不同类型字符（数字、`[`、`]`、字母）的独立处理逻辑，可以使代码更模块化、更易于理解和调试。
5.  **栈内元素设计**：精心设计栈中存储的内容，可以简化出栈和入栈时的处理逻辑。在优化后的版本中，`strStack` 存储的是 `[` 符号出现之前的累积字符串，这使得 `]` 出栈逻辑更直接。

这道题是一个很好的练习，可以帮助理解栈在字符串处理中的应用，以及如何通过优化数据结构和算法流程来提高代码的清晰度和效率。
