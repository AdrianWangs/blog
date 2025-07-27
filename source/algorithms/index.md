---
title: 算法目录
date: 2025-04-19 22:00:00
layout: page
comments: true
---

# 算法目录

本页面汇总了我在学习算法和解决编程问题过程中的笔记和心得。这些内容按算法类型进行分类，希望能对你有所帮助。

## 算法类型

### 数学

- [LeetCode 50 - Pow(x, n)（快速幂算法）](/2025/07/20/算法刷题/LeetCode-50-Pow-x-n/) - 使用快速幂算法高效计算 x 的 n 次方，通过二进制分解将时间复杂度从 O(n) 优化到 O(log n)，是数学计算中的经典优化技巧 **[面试经典 150]**
- [LeetCode 172 - 阶乘后的零（Factorial Trailing Zeroes）](/2025/07/20/算法刷题/LeetCode-172-阶乘后的零/) - 通过统计因子中5的个数来计算阶乘末尾零的数量，关键在于理解每个零都是由2和5配对产生的 **[面试经典 150]**

### 哈希表

- [LeetCode 560 - 和为 K 的子数组（Subarray Sum Equals K）](/2025/07/26/算法刷题/LeetCode-560-和为K的子数组/) - 使用前缀和和哈希表解决子数组和问题，通过维护前缀和的出现次数来统计和为K的子数组数量，时间复杂度O(n)，空间复杂度O(n) **[面试经典 150]**
- [LeetCode 149 - 直线上最多的点数（Max Points on a Line）](/2025/07/20/LeetCode-149-直线上最多的点数/) - 使用哈希表存储斜率信息，通过枚举每个点作为基准点，计算与其他点形成的直线斜率，统计最多共线的点数。核心思路是避免浮点数精度问题，使用最简分数表示斜率 **[面试经典 150]**
- [LeetCode 128 - 最长连续序列：一个循环引发的性能血案](/2025/06/06/LeetCode-128-最长连续序列/) - 通过对比两种循环方式，揭示一个细节如何导致性能天差地别，避免超时。
- [LeetCode 49 - 字母异位词分组（Group Anagrams）](/2025/06/05/算法刷题/LeetCode-49-字母异位词分组/) - 详解基于排序和计数两种方法解决字母异位词分组问题，分析 Go 语言中数组作为哈希表键的特性 **[面试经典 150]**
- [LeetCode 146: LRU 缓存](/2025/04/27/算法刷题/LeetCode-146-LRU-Cache/) - 哈希表和双向链表结合实现高效的 LRU 缓存
- [LeetCode 41: 缺失的第一个正数（First Missing Positive）](/2025/04/18/算法刷题/LeetCode-41-first-missing-positive/) - ❌ 使用原地哈希解决的 Hard 难度问题

### 字符串与模式匹配

- [❌ LeetCode 76 - 最小覆盖子串（Minimum Window Substring）](/2025/06/03/算法刷题/LeetCode-76-最小覆盖子串-错误分析/) - 深入分析最小覆盖子串问题的滑动窗口解法，通过错误分析帮助理解双指针技巧的正确使用方式 **[面试经典 150]**
- [LeetCode 30 - 串联所有单词的子串（Substring with Concatenation of All Words）](/2025/06/02/算法刷题/LeetCode-30-串联所有单词的子串/) - 深入分析滑动窗口优化解法，对比暴力解法和滑动窗口的时间复杂度差异，解答为什么滑动窗口能显著提升性能 **[面试经典 150]**
- [LeetCode 68 - 文本左右对齐（Text Justification）](/2025/05/30/算法刷题/LeetCode-68-文本左右对齐/) - 详解文本左右对齐算法，通过模拟方法实现单词在指定宽度内的均匀分布，掌握字符串处理和空格分配的核心技巧 **[面试经典 150]**
- [LeetCode 28 - 找出字符串中第一个匹配项的下标](2025/05/28/算法刷题/LeetCode-28-找出字符串中第一个匹配项的下标/) - 使用 KMP 算法解决字符串模式匹配问题，详细讲解 next 数组构建过程和算法优化，通过具体例子演示完整匹配流程 **[面试经典 150]**

### 堆与优先队列

- [LeetCode 295 - 数据流的中位数 (Find Median from Data Stream)](/2025/05/14/算法刷题/LeetCode-295-数据流的中位数/) - 使用两个堆（最大堆与最小堆）维护数据流的中位数，实现 O(log n) 插入和 O(1) 查询
- [LeetCode 347 - 前 K 个高频元素 (Top K Frequent Elements)](/2025/05/13/算法刷题/LeetCode-347-前K个高频元素/) - 使用哈希表和堆解决前 K 个高频元素问题

### 栈与队列

- [LeetCode 173 - 二叉搜索树迭代器（Binary Search Tree Iterator）](/2025/06/16/算法刷题/LeetCode-173-二叉搜索树迭代器/) - 使用栈模拟中序遍历实现二叉搜索树迭代器，深入理解懒加载和均摊时间复杂度分析 **[面试经典 150]**
- [LeetCode 224 - 基本计算器（Basic Calculator）](/2025/06/08/算法刷题/LeetCode-224-基本计算器/) - 使用栈解决带括号的基本计算器问题，掌握处理优先级和符号的核心技巧 **[面试经典 150]**
- [❌ LeetCode 84 - 柱状图中最大的矩形](/2025/05/13/算法刷题/LeetCode-84-柱状图中最大的矩形/) - 深入剖析柱状图中最大矩形问题，解析暴力法、分治法和单调栈三种解法，以及单调栈实现中的常见错误。
- [LeetCode 739 - 每日温度 (Daily Temperatures)](/2025/05/12/算法刷题/LeetCode-739-每日温度/) - 详细解析 LeetCode 739 题「每日温度」的解题思路，使用单调栈巧妙解决，并探讨代码优化，让你的代码更简洁。
- [LeetCode 394 - 字符串解码 (String Decode)](/2025/05/11/算法刷题/LeetCode-394-字符串解码/) - 详细解析 LeetCode 第 394 题字符串解码，通过栈辅助实现，并提供优化思路和代码。
- [LeetCode 155: 最小栈 (Min Stack)](/2025/05/11/算法刷题/LeetCode-155-最小栈/) - 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

### 树结构与前缀树

- [LeetCode 212 - 单词搜索 II（Word Search II）](/2025/07/01/算法刷题/LeetCode-212-单词搜索-ii/) - 使用字典树(Trie)优化的单词搜索问题，通过DFS遍历二维字符网格同时匹配字典树中的单词，实现高效的多单词搜索算法 **[面试经典 150]**
- [LeetCode 211 - 添加与搜索单词-数据结构设计（Design Add and Search Words Data Structure）](/2025/06/29/算法刷题/LeetCode-211-添加与搜索单词-数据结构设计/) - 使用字典树(Trie)实现支持通配符搜索的单词字典，关键在于递归DFS处理'.'字符的所有可能匹配 **[面试经典 150]**
- [LeetCode 208: 实现 Trie 前缀树](/2025/05/05/算法刷题/LeetCode-208-实现-Trie-前缀树/) - Trie 前缀树实现优化与空间复杂度分析

### 数组与矩阵

- [LeetCode 57. 插入区间](/2025/06/07/LeetCode-57-插入区间/) - 通过一次遍历实现新旧区间的合并，高效处理区间插入问题 **[面试经典 150]**
- [❌ LeetCode 274 - H 指数（H-Index）](/2025/05/25/算法刷题/LeetCode-274-H指数/) - H 指数问题的三种解法详解：排序法、计数排序法和二分查找法，包含错误分析和解题思路对比

### 链表

- [LeetCode 148: 排序链表（Sort List）](/2025/04/26/算法刷题/LeetCode-148-Sort-List/) - 归并排序在链表中的两种实现：自底向上与自顶向下
- [LeetCode 24: 两两交换链表中的节点（Swap Nodes in Pairs）](/2025/04/24/算法刷题/LeetCode-24-Swap-Nodes-in-Pairs/) - 链表节点两两交换的递归和迭代解法比较
- [LeetCode 2: 两数相加（Add Two Numbers）](/2025/04/23/算法刷题/LeetCode-2-两数相加/) - 链表表示的两数相加问题的代码优化与分析
- [LeetCode 142: 环形链表 II（Linked List Cycle II）](/2025/04/22/算法刷题/LeetCode-142-Linked-List-Cycle-II/) - Floyd 判圈算法数学原理详解与实现
- [LeetCode 234: 回文链表（Palindrome Linked List）](/2025/04/21/算法刷题/LeetCode-234-Palindrome-Linked-List/) - 判断链表是否为回文结构的多种解法与优化分析
- [❌ LeetCode 160: 相交链表（Intersection of Two Linked Lists）](/2025/04/20/算法刷题/LeetCode-160-Intersection-of-Two-Linked-Lists/) - 寻找两个链表交点的多种方法与解法分析
- [LeetCode 206: 反转链表](/2025/04/21/算法刷题/LeetCode-206-Reverse-Linked-List) - 经典链表反转问题，包含递归和迭代两种解法
- [❌ LeetCode 25: K 个一组翻转链表（Reverse Nodes in k-Group）](/2025/04/24/算法刷题/LeetCode-25-Reverse-Nodes-in-k-Group/) - 分析了循环终止条件中的微妙错误
- [❌ LeetCode 138: 随机链表的复制](/2025/04/25/算法刷题/LeetCode-138-Copy-List-with-Random-Pointer/) - 链表深拷贝，处理 random 指针

### 回溯

- [LeetCode 52: N 皇后 II（N-Queens II）](/2025/05/07/算法刷题/LeetCode-52-N皇后-II/) - 使用位运算优化 N 皇后问题的空间复杂度，求解方案数量
- [LeetCode 51: N 皇后（N-Queens）](/2025/05/07/算法刷题/LeetCode-51-N皇后/) - 利用回溯算法和对角线数学特性高效求解 N 皇后问题
- [❌ LeetCode 131: 分割回文串（Palindrome Partitioning）](/2025/05/06/算法刷题/LeetCode-131-分割回文串/) - 动态规划预处理和记忆化搜索两种方法解决分割回文串问题
- [LeetCode 22: 括号生成（Generate Parentheses）](/2025/05/06/算法刷题/LeetCode-22-括号生成/) - 回溯法和动态规划解决括号生成问题详解
- [LeetCode 78: 子集（Subsets）](/2025/05/06/算法刷题/LeetCode-78-子集/) - 位运算与回溯两种方法生成所有子集的详细对比
- [❌ LeetCode 46: 全排列（Permutations）错误分析](/2025/05/05/算法刷题/LeetCode-46-全排列-错误分析/) - 分析在 Go 语言实现全排列时的切片复制误区

### 数组操作

- [LeetCode 238: 除自身以外数组的乘积 (Product of Array Except Self)](/2025/05/25/算法刷题/LeetCode-238-除自身以外数组的乘积/) - 前缀后缀乘积思想，四种解法对比：暴力、两数组、空间优化和特殊处理，深入分析时空复杂度差异
- [LeetCode 31: 下一个排列 (Next Permutation)](/2025/05/22/算法刷题/leetcode-31-next-permutation/) - 详解 LeetCode 31 题"下一个排列"的解题思路与 Go 语言实现。
- [❌ LeetCode 215: 数组中的第 K 个最大元素](/2025/05/13/算法刷题/LeetCode-215-数组中的第K个最大元素-超时分析与优化/) - 分析 Quick Select 算法的超时原因，并提供针对重复元素和分区优化的正确实现
- [LeetCode 45: 跳跃游戏 II (Jump Game II)](/2025/05/15/算法刷题/LeetCode-45-跳跃游戏-II/) - 通过贪心算法高效解决最少跳跃次数问题，详细分析贪心策略的原理与实现
- [LeetCode 169: 多数元素（Majority Element）](/2025/05/10/算法刷题/LeetCode-169-多数元素/) - 使用摩尔投票算法高效找出数组中的多数元素
- [LeetCode 48: 旋转图像（Rotate Image）](/2025/04/19/算法刷题/LeetCode-48-Rotate-Image/) - 矩阵顺时针旋转 90 度的高效实现
- [LeetCode 54: 螺旋矩阵（Spiral Matrix）](/2025/04/19/算法刷题/LeetCode-54-Spiral-Matrix/) - ❌ 螺旋顺序遍历矩阵的解题思路与错误分析
- [LeetCode 73: 矩阵置零（Matrix Zeroes）](/2025/04/19/算法刷题/leetcode-73-matrix-zeroes/) - ❌ 原地算法实现矩阵置零的多种方法

### 双指针

- [LeetCode 202 - 快乐数 (Happy Number)](/2025/06/06/算法刷题/LeetCode-202-快乐数/) - 详细解析 LeetCode 第 202 题"快乐数"。通过快慢指针（弗洛伊德循环查找算法）判断一个数是否为快乐数，并分析其时间和空间复杂度。 **[面试经典 150]**
- [LeetCode 209 - 长度最小的子数组 (Minimum Size Subarray Sum)](/2025/06/01/算法刷题/LeetCode-209-长度最小的子数组/) - 深入分析前缀和双指针与滑动窗口两种解法，比较时空复杂度差异，提供优雅的代码实现与详细的算法思路分析 **[面试经典 150]**
- [LeetCode 15 - 三数之和 (3Sum)](/2025/05/31/算法刷题/LeetCode-15-三数之和/) - 使用排序+双指针解决三数之和问题，通过固定一个数并用双指针寻找另外两个数的经典解法，详细演示算法执行过程 **[面试经典 150]**
- [LeetCode 80 - 删除有序数组中的重复项 II](/2025/05/24/算法刷题/LeetCode-80-删除有序数组中的重复项-II/) - 使用双指针技术解决有序数组去重问题，允许每个元素最多出现两次，原地修改数组实现 O(1) 空间复杂度
- [LeetCode 287 - 寻找重复数](/2025/05/22/算法刷题/LeetCode-287-寻找重复数/) - 详细解析 LeetCode 287 "寻找重复数"，利用快慢指针（Floyd 判圈算法）在 O(n) 时间和 O(1) 空间内找到重复数。
- [LeetCode 75 - 颜色分类 (Sort Colors)](/2025/05/21/算法刷题/LeetCode-75-颜色分类/) - LeetCode 75 颜色分类题解，使用双指针原地排序包含 0、1、2 的数组。
- [LeetCode 234: 回文链表（Palindrome Linked List）](/2025/04/21/算法刷题/LeetCode-234-Palindrome-Linked-List/) - 判断链表是否为回文结构的多种解法与优化分析

### 滑动窗口

- [LeetCode 239 - 滑动窗口最大值（Sliding Window Maximum）](/2025/07/26/LeetCode-239-滑动窗口最大值/) - 使用单调队列解决滑动窗口最大值问题，通过维护递减队列来高效获取每个窗口的最大值，时间复杂度O(n)，空间复杂度O(k) **[面试经典 150]**
- [❌ LeetCode 76 - 最小覆盖子串（Minimum Window Substring）](/2025/06/03/算法刷题/LeetCode-76-最小覆盖子串-错误分析/) - 深入分析最小覆盖子串问题的滑动窗口解法，通过错误分析帮助理解双指针技巧的正确使用方式 **[面试经典 150]**
- [LeetCode 30 - 串联所有单词的子串（Substring with Concatenation of All Words）](/2025/06/02/算法刷题/LeetCode-30-串联所有单词的子串/) - 深入分析滑动窗口优化解法，对比暴力解法和滑动窗口的时间复杂度差异，解答为什么滑动窗口能显著提升性能 **[面试经典 150]**
- [LeetCode 42: 接雨水（Trapping Rain Water）](/2025/04/18/算法刷题/LeetCode-42-trapping-rain-water/) - 使用双指针、动态规划和单调栈三种方法解决
- [❌ LeetCode 160: 相交链表（Intersection of Two Linked Lists）](/2025/04/20/算法刷题/LeetCode-160-Intersection-of-Two-Linked-Lists/) - 寻找两个链表交点的多种方法与解法分析

### 二分查找

- [LeetCode 34 - 在排序数组中查找元素的第一个和最后一个位置](/2024/07/30/LeetCode-34-在排序数组中查找元素的第一个和最后一个位置/) - 详解通过两次二分搜索精确查找元素左右边界的技巧，是掌握二分搜索精髓的必刷题。 **[面试经典 150]**
- [LeetCode 69 - x 的平方根（Sqrt(x)）](/2025/06/13/算法刷题/LeetCode-69-x的平方根/) - 使用二分查找算法求解整数平方根问题，核心思路是在[0,x]范围内二分搜索，时间复杂度 O(log x)，是一道经典的二分查找应用题目 **[面试经典 150]**
- [LeetCode 4: 寻找两个正序数组的中位数（Median of Two Sorted Arrays）](/2025/05/11/算法刷题/LeetCode-4-寻找两个正序数组的中位数/) - 深入理解二分思想解决两个有序数组中位数问题
- [❌ LeetCode 33: 搜索旋转排序数组（Search in Rotated Sorted Array）](/2025/05/08/算法刷题/LeetCode-33-搜索旋转排序数组-错误分析/) - 分析旋转排序数组中查找旋转点的错误及其优雅解法
- [❌ LeetCode 74: 搜索二维矩阵（Search a 2D Matrix）](/2025/05/08/算法刷题/LeetCode-74-搜索二维矩阵-错误分析/) - 分析二分查找在矩阵搜索中的边界条件处理错误
- [LeetCode 35: 搜索插入位置（Search Insert Position）](/2025/05/08/算法刷题/LeetCode-35-搜索插入位置/) - Go 语言中二分搜索函数全解析与应用场景详解
- [LeetCode 240: 搜索二维矩阵 II（Search a 2D Matrix II）](/2025/04/20/算法刷题/LeetCode-240-Search-a-2D-Matrix-II/) - 角落搜索法、二分查找法和分治法三种解法比较
- [LeetCode 2563: 统计公平数目的数目（Count the Number of Fair Pairs）](/2025/04/20/算法刷题/LeetCode-2563-统计公平数对的数目/) - 利用排序和二分查找高效计算满足条件的数对
- [LeetCode 153: 寻找旋转排序数组中的最小值](/2025/05/10/算法刷题/LeetCode-153-寻找旋转排序数组中的最小值/) - 使用传统二分和 Go 的 sort.Search 解决

### 排序

- [LeetCode 148: 排序链表（Sort List）](/2025/04/26/算法刷题/LeetCode-148-Sort-List/) - 归并排序在链表中的两种实现：自底向上与自顶向下

### 设计

- [❌ LeetCode 380: O(1) 时间插入、删除和获取随机元素](/2025/05/25/算法刷题/LeetCode-380-O1时间插入删除和获取随机元素/) - 设计支持 O(1) 操作的随机集合，分析索引不一致错误和正确的删除策略
- [LeetCode 155: 最小栈 (Min Stack)](/2025/05/11/算法刷题/LeetCode-155-最小栈/) - 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
- [LeetCode 146: LRU 缓存](/2025/04/27/算法刷题/LeetCode-146-LRU-Cache/) - 哈希表和双向链表结合实现高效的 LRU 缓存

### 二叉树

- [LeetCode 530 - 二叉搜索树的最小绝对差（Minimum Absolute Difference in BST）](/2025/06/18/算法刷题/LeetCode-530-二叉搜索树的最小绝对差/) - 利用二叉搜索树中序遍历有序性的特点，通过一次遍历找出相邻节点的最小绝对差值，时间复杂度 O(n)，空间复杂度 O(h) **[面试经典 150]**
- [LeetCode 222 - 完全二叉树的节点个数（Count Complete Tree Nodes）](/2025/06/17/算法刷题/LeetCode-222-完全二叉树的节点个数/) - 利用完全二叉树的性质，通过计算左右子树高度来优化节点计数，时间复杂度O(log²n)的高效解法 **[面试经典 150]**
- [LeetCode 112 - 路径总和（Path Sum）](/2025/06/15/算法刷题/LeetCode-112-路径总和/) - 使用递归和深度优先搜索解决二叉树路径求和问题，详细解析递归思路和边界条件处理
- [LeetCode 117 - 填充每个节点的下一个右侧节点指针 II（Populating Next Right Pointers in Each Node II）](/2025/06/15/算法刷题/LeetCode-117-填充每个节点的下一个右侧节点指针-ii/) - 详解三种解法：哈希表 DFS、层序遍历 BFS、O(1)空间优化。通过图解和代码详细分析如何为二叉树每个节点填充下一个右侧节点指针 **[面试经典 150]**
- [❌ LeetCode 124: 二叉树中的最大路径和（Binary Tree Maximum Path Sum）](/2025/05/02/算法刷题/LeetCode-124-Binary-Tree-Maximum-Path-Sum/) - 后序遍历与递归返回值设计解决树路径问题
- [LeetCode 236: 二叉树的最近公共祖先（Lowest Common Ancestor of a Binary Tree）](/2025/04/30/算法刷题/LeetCode-236-二叉树的最近公共祖先/) - 递归、父节点映射和路径比较法解决 LCA 问题
- [❌ LeetCode 437: 路径总和 III（Path Sum III）](/2025/04/30/算法刷题/LeetCode-437-路径总和-III/) - 双重递归和前缀和优化对比，详解树路径问题的递归设计
- [LeetCode 105: 从前序与中序遍历序列构造二叉树（Construct Binary Tree from Preorder and Inorder Traversal）](/2025/04/30/算法刷题/LeetCode-105-从前序与中序遍历序列构造二叉树/) - 递归和哈希表结合重建二叉树的两种优化方法
- [❌ LeetCode 114: 二叉树展开为链表 (Flatten Binary Tree to Linked List)](/2025/04/29/算法刷题/LeetCode-114-Binary-Tree-Flatten/) - 分析树转链表过程中的指针操作错误
- [LeetCode 230: 二叉搜索树中第 K 小的元素（Kth Smallest Element in a BST）](/2025/04/29/算法刷题/LeetCode-230-Kth-Smallest-Element-in-BST/) - 中序遍历解法与进阶优化方案
- [LeetCode 101: Symmetric Tree](/2025/04/28/算法刷题/LeetCode-101-Symmetric-Tree) - 使用递归和迭代方法判断二叉树是否对称
- [❌ LeetCode 98: 验证二叉搜索树（Validate Binary Search Tree）](/2025/04/29/算法刷题/LeetCode-98-validate-binary-search-tree/) - 分析二叉搜索树验证中的比较运算符错误
- [❌ LeetCode 543: 二叉树的直径（Binary Tree Diameter）](/2025/04/29/算法刷题/LeetCode-543-Binary-Tree-Diameter/) - 在 DFS 计算树深度的同时维护全局最大直径

### 图

- [LeetCode 127 - 单词接龙（Word Ladder）](/2025/06/29/算法刷题/LeetCode-127-单词接龙/) - 使用BFS和虚拟节点技巧解决单词接龙问题，将单词转换建模为图的最短路径，巧妙利用中间节点连接相似单词 **[面试经典 150]**
- [LeetCode 433 - 最小基因变化 (Minimum Genetic Mutation)](/2025/06/25/算法刷题/LeetCode-433-最小基因变化/) - 详解 Dijkstra 与广度优先搜索 (BFS) 在解决基因序列最短转换路径问题中的应用与对比。 **[面试经典 150]**
- [❌ LeetCode 909 - 蛇梯棋（Snakes and Ladders）](/2025/06/23/算法刷题/LeetCode-909-蛇梯棋-错误分析/) - 蛇梯棋BFS解法错误分析：坐标转换逻辑、内存限制超出、循环蛇梯处理等多个实现难点的深度解析 **[面试经典 150]**
- [LeetCode 399 - 除法求值（Evaluate Division）](/2025/06/22/算法刷题/LeetCode-399-除法求值/) - 使用图论和DFS解决除法求值问题，将除法关系建模为带权重的有向图，通过路径搜索计算查询结果 **[面试经典 150]**
- [LeetCode 133 - 克隆图（Clone Graph）](/2025/06/21/算法刷题/LeetCode-133-克隆图/) - 使用DFS和哈希表解决图的深拷贝问题，深入分析访问标记时机对避免无限递归的重要性 **[面试经典 150]**
- [LeetCode 207: 课程表（Course Schedule）](/2025/05/03/算法刷题/LeetCode-207-课程表/) - 使用 BFS 拓扑排序和 DFS 检测环两种方法解决课程依赖问题

### 动态规划

- [LeetCode 72 - 编辑距离 (Edit Distance)](/2025/05/21/算法刷题/LeetCode-72-编辑距离/) - 详解 LeetCode 72 题编辑距离的动态规划解法，包括状态定义、状态转移方程和代码实现。
- [LeetCode 1143 - 最长公共子序列 (Longest Common Subsequence)](/2025/05/20/算法刷题/LeetCode-1143-最长公共子序列/) - LeetCode 1143 最长公共子序列问题详解，使用动态规划思路解决，并提供 Go 语言的实现代码和复杂度分析。
- ❌ [LeetCode 5 - 最长回文子串：动态规划填表顺序错误分析](/2025/05/20/算法刷题/LeetCode-5-最长回文子串错误分析/) - 详细分析 LeetCode 第 5 题"最长回文子串"动态规划解法的常见填表顺序错误，并提供正确的思路与实现。
- ❌ [LeetCode 32 - 最长有效括号：动态规划思路错题分析](/2025/05/18/算法刷题/leetcode-32-longest-valid-parentheses-dp-error-analysis/) - 详细分析 LeetCode 32 题 '最长有效括号' 动态规划解法中一个常见的状态转移错误，并提供正确的思路和代码。
- [LeetCode 416 - 分割等和子集 (Partition Equal Subset Sum)](/2025/05/17/算法刷题/LeetCode-416-分割等和子集/) - LeetCode 416 分割等和子集问题详解，使用动态规划（0/1 背包问题）解决。
- [LeetCode 152 - 乘积最大子数组 (Maximum Product Subarray)](/2025/05/17/算法刷题/LeetCode-152-乘积最大子数组/) - LeetCode 152 乘积最大子数组的解题思路、代码实现和复杂度分析。
- [LeetCode 300: 最长递增子序列 - 动态规划与贪心优化](/2025/05/17/算法刷题/LeetCode-300-最长递增子序列/) - 详细解析 LeetCode 300 '最长递增子序列' 问题的动态规划解法和更优的贪心算法结合二分查找的思路，并提供带有注释的 Go 语言实现。
- [❌ LeetCode 322: 零钱兑换](/2025/05/16/算法刷题/LeetCode-322-零钱兑换/) - 零钱兑换是一个经典的完全背包问题，分析了错误的解题思路以及两种正确的动态规划实现方式
- [❌ LeetCode 131: 分割回文串（Palindrome Partitioning）](/2025/05/06/算法刷题/LeetCode-131-分割回文串/) - 动态规划预处理和记忆化搜索两种方法解决分割回文串问题
- [LeetCode 22: 括号生成（Generate Parentheses）](/2025/05/06/算法刷题/LeetCode-22-括号生成/) - 回溯法和动态规划解决括号生成问题详解
- [❌ LeetCode 790: 多米诺和托米诺平铺（Domino and Tromino Tiling）](/2025/05/06/算法刷题/LeetCode-790-多米诺和托米诺平铺/) - 状态定义与转移方程解决瓷砖平铺的组合计数问题

### 位运算

- [LeetCode 136: 只出现一次的数字（Single Number）](/2025/05/10/算法刷题/LeetCode-136-只出现一次的数字/) - 使用异或运算解决的数组元素查找问题，详解位运算特性
- [LeetCode 52: N 皇后 II（N-Queens II）](/2025/05/07/算法刷题/LeetCode-52-N皇后-II/) - 使用位运算优化 N 皇后问题的空间复杂度，求解方案数量
- [LeetCode 78: 子集（Subsets）](/2025/05/06/算法刷题/LeetCode-78-子集/) - 位运算与回溯两种方法生成所有子集的详细对比

### 贪心算法

- [LeetCode 452 - 用最少数量的箭引爆气球 (Minimum Number of Arrows to Burst Balloons)](/2025/06/08/算法刷题/LeetCode-452-用最少数量的箭引爆气球/) - 贪心算法解决区间重叠问题，通过按右端点排序找到最少箭数引爆所有气球 **[面试经典 150]**
- [❌ LeetCode 135 - 分发糖果 (Candy)](/2025/05/27/算法刷题/LeetCode-135-分发糖果/) - 分发糖果问题的贪心算法解法，重点分析一次遍历的状态机处理思路和常见的边界情况错误
- [❌ LeetCode 134 - 加油站 (Gas Station)](/2025/05/26/算法刷题/LeetCode-134-加油站/) - 从超时的暴力解法到高效的贪心算法，深入分析加油站问题的解题思路和时间复杂度优化
- [LeetCode 300: 最长递增子序列 - 动态规划与贪心优化](/2025/05/17/算法刷题/LeetCode-300-最长递增子序列/) - 详细解析 LeetCode 300 '最长递增子序列' 问题的动态规划解法和更优的贪心算法结合二分查找的思路，并提供带有注释的 Go 语言实现。
- [LeetCode 763: 划分字母区间 (Partition Labels)](/2025/05/16/算法刷题/LeetCode-763-划分字母区间/) - 利用贪心策略和字符最后出现位置，实现字符串的最优分区
- [LeetCode 45: 跳跃游戏 II (Jump Game II)](/2025/05/15/算法刷题/LeetCode-45-跳跃游戏-II/) - 通过贪心算法高效解决最少跳跃次数问题，详细分析贪心策略的原理与实现

### 分治算法

- [LeetCode 169: 多数元素（Majority Element）](/2025/05/10/算法刷题/LeetCode-169-多数元素/) - 使用摩尔投票算法高效找出数组中的多数元素
- [LeetCode 240: 搜索二维矩阵 II（Search a 2D Matrix II）](/2025/04/20/算法刷题/LeetCode-240-Search-a-2D-Matrix-II/) - 角落搜索法、二分查找法和分治法三种解法比较
- [LeetCode 4: 寻找两个正序数组的中位数（Median of Two Sorted Arrays）](/2025/05/11/算法刷题/LeetCode-4-寻找两个正序数组的中位数/) - 深入理解二分思想解决两个有序数组中位数问题
