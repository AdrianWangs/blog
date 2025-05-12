---
title: 算法目录
date: 2025-04-19 22:00:00
layout: page
comments: true
---

# 算法目录

本页面汇总了我在学习算法和解决编程问题过程中的笔记和心得。这些内容按算法类型进行分类，希望能对你有所帮助。

## 算法类型

### 栈与队列

- [❌ LeetCode 84 - 柱状图中最大的矩形](/2025/05/13/算法刷题/LeetCode-84-柱状图中最大的矩形/) - 深入剖析柱状图中最大矩形问题，解析暴力法、分治法和单调栈三种解法，以及单调栈实现中的常见错误。
- [LeetCode 739 - 每日温度 (Daily Temperatures)](/2025/05/12/算法刷题/LeetCode-739-每日温度/) - 详细解析 LeetCode 739 题「每日温度」的解题思路，使用单调栈巧妙解决，并探讨代码优化，让你的代码更简洁。
- [LeetCode 394 - 字符串解码 (String Decode)](/2025/05/11/算法刷题/LeetCode-394-字符串解码/) - 详细解析 LeetCode 第 394 题字符串解码，通过栈辅助实现，并提供优化思路和代码。
- [LeetCode 155: 最小栈 (Min Stack)](/2025/05/11/算法刷题/LeetCode-155-最小栈/) - 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

### 树结构与前缀树

- [LeetCode 208: 实现 Trie 前缀树](/2025/05/05/算法刷题/LeetCode-208-实现-Trie-前缀树/) - Trie 前缀树实现优化与空间复杂度分析

### 数组与矩阵

### 链表

- [LeetCode 148: 排序链表（Sort List）](/2025/04/26/算法刷题/LeetCode-148-Sort-List/) - 归并排序在链表中的两种实现：自底向上与自顶向下
- [LeetCode 24: 两两交换链表中的节点（Swap Nodes in Pairs）](/2025/04/24/算法刷题/LeetCode-24-Swap-Nodes-in-Pairs/) - 链表节点两两交换的递归和迭代解法比较
- [LeetCode 2: 两数相加（Add Two Numbers）](/2025/04/23/算法刷题/LeetCode-2-两数相加/) - 链表表示的两数相加问题的代码优化与分析
- [LeetCode 142: 环形链表 II（Linked List Cycle II）](/2025/04/22/算法刷题/LeetCode-142-Linked-List-Cycle-II/) - Floyd 判圈算法数学原理详解与实现
- [LeetCode 234: 回文链表（Palindrome Linked List）](/2025/04/21/算法刷题/LeetCode-234-Palindrome-Linked-List/) - 判断链表是否为回文结构的多种解法与优化分析
- [❌ LeetCode 160: 相交链表（Intersection of Two Linked Lists）](/2025/04/20/算法刷题/LeetCode-160-Intersection-of-Two-Linked-Lists/) - 寻找两个链表交点的多种方法与解法分析
- [LeetCode 206: 反转链表](/2025/04/21/算法刷题/LeetCode-206-Reverse-Linked-List) - 经典链表反转问题，包含递归和迭代两种解法
- [❌ LeetCode 25: K 个一组翻转链表（Reverse Nodes in k-Group）](/2025/04/24/算法刷题/LeetCode-25-Reverse-Nodes-in-k-Group/) - 分析了循环终止条件中的微妙错误
- [❌ LeetCode 138: 随机链表的复制](/2025/04/25/LeetCode-138-Copy-List-with-Random-Pointer/) - 链表深拷贝，处理 random 指针

### 回溯

- [LeetCode 52: N 皇后 II（N-Queens II）](/2025/05/07/算法刷题/LeetCode-52-N皇后-II/) - 使用位运算优化 N 皇后问题的空间复杂度，求解方案数量
- [LeetCode 51: N 皇后（N-Queens）](/2025/05/07/算法刷题/LeetCode-51-N皇后/) - 利用回溯算法和对角线数学特性高效求解 N 皇后问题
- [❌ LeetCode 131: 分割回文串（Palindrome Partitioning）](/2025/05/06/算法刷题/LeetCode-131-分割回文串/) - 动态规划预处理和记忆化搜索两种方法解决分割回文串问题
- [LeetCode 22: 括号生成（Generate Parentheses）](/2025/05/06/算法刷题/LeetCode-22-括号生成/) - 回溯法和动态规划解决括号生成问题详解
- [LeetCode 78: 子集（Subsets）](/2025/05/06/算法刷题/LeetCode-78-子集/) - 位运算与回溯两种方法生成所有子集的详细对比
- [❌ LeetCode 46: 全排列（Permutations）错误分析](/2025/05/05/算法刷题/LeetCode-46-全排列-错误分析/) - 分析在 Go 语言实现全排列时的切片复制误区

### 数组操作

- [LeetCode 169: 多数元素（Majority Element）](/2025/05/10/算法刷题/LeetCode-169-多数元素/) - 使用摩尔投票算法高效找出数组中的多数元素
- [LeetCode 48: 旋转图像（Rotate Image）](/2025/04/19/算法刷题/LeetCode-48-Rotate-Image/) - 矩阵顺时针旋转 90 度的高效实现
- [LeetCode 54: 螺旋矩阵（Spiral Matrix）](/2025/04/19/算法刷题/LeetCode-54-Spiral-Matrix/) - ❌ 螺旋顺序遍历矩阵的解题思路与错误分析
- [LeetCode 73: 矩阵置零（Matrix Zeroes）](/2025/04/19/算法刷题/LeetCode-73-matrix-zeroes/) - ❌ 原地算法实现矩阵置零的多种方法

### 哈希表

- [LeetCode 146: LRU 缓存](/2025/04/27/算法刷题/LeetCode-146-LRU-Cache/) - 哈希表和双向链表结合实现高效的 LRU 缓存
- [LeetCode 41: 缺失的第一个正数（First Missing Positive）](/2025/04/18/算法刷题/LeetCode-41-first-missing-positive/) - ❌ 使用原地哈希解决的 Hard 难度问题

### 双指针

- [LeetCode 234: 回文链表（Palindrome Linked List）](/2025/04/21/算法刷题/LeetCode-234-Palindrome-Linked-List/) - 判断链表是否为回文结构的多种解法与优化分析
- [LeetCode 42: 接雨水（Trapping Rain Water）](/2025/04/18/算法刷题/LeetCode-42-trapping-rain-water/) - 使用双指针、动态规划和单调栈三种方法解决
- [❌ LeetCode 160: 相交链表（Intersection of Two Linked Lists）](/2025/04/20/算法刷题/LeetCode-160-Intersection-of-Two-Linked-Lists/) - 寻找两个链表交点的多种方法与解法分析

### 二分查找

- [LeetCode 4: 寻找两个正序数组的中位数（Median of Two Sorted Arrays）](/2025/05/11/算法刷题/LeetCode-4-寻找两个正序数组的中位数/) - 深入理解二分思想解决两个有序数组中位数问题
- [❌ LeetCode 33: 搜索旋转排序数组（Search in Rotated Sorted Array）](/2025/05/08/算法刷题/LeetCode-33-搜索旋转排序数组-错误分析/) - 分析旋转排序数组中查找旋转点的错误及其优雅解法
- [❌ LeetCode 74: 搜索二维矩阵（Search a 2D Matrix）](/2025/05/08/算法刷题/LeetCode-74-搜索二维矩阵-错误分析/) - 分析二分查找在矩阵搜索中的边界条件处理错误
- [LeetCode 35: 搜索插入位置（Search Insert Position）](/2025/05/08/算法刷题/LeetCode-35-搜索插入位置/) - Go 语言中二分搜索函数全解析与应用场景详解
- [LeetCode 240: 搜索二维矩阵 II（Search a 2D Matrix II）](/2025/04/20/算法刷题/LeetCode-240-Search-a-2D-Matrix-II/) - 角落搜索法、二分查找法和分治法三种解法比较
- [LeetCode 2563: 统计公平数对的数目（Count the Number of Fair Pairs）](/2025/04/20/算法刷题/LeetCode-2563-统计公平数对的数目/) - 利用排序和二分查找高效计算满足条件的数对
- [LeetCode 153: 寻找旋转排序数组中的最小值](/2025/05/10/算法刷题/LeetCode-153-寻找旋转排序数组中的最小值/) - 使用传统二分和 Go 的 sort.Search 解决

### 排序

- [LeetCode 148: 排序链表（Sort List）](/2025/04/26/算法刷题/LeetCode-148-Sort-List/) - 归并排序在链表中的两种实现：自底向上与自顶向下

### 设计

- [LeetCode 155: 最小栈 (Min Stack)](/2025/05/11/算法刷题/LeetCode-155-最小栈/) - 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
- [LeetCode 146: LRU 缓存](/2025/04/27/算法刷题/LeetCode-146-LRU-Cache/) - 哈希表和双向链表结合实现高效的 LRU 缓存

### 二叉树

- [❌ LeetCode 124: 二叉树中的最大路径和（Binary Tree Maximum Path Sum）](/2025/05/02/算法刷题/LeetCode-124-Binary-Tree-Maximum-Path-Sum/) - 后序遍历与递归返回值设计解决树路径问题
- [LeetCode 236: 二叉树的最近公共祖先（Lowest Common Ancestor of a Binary Tree）](/2025/04/30/算法刷题/LeetCode-236-二叉树的最近公共祖先/) - 递归、父节点映射和路径比较法解决 LCA 问题
- [❌ LeetCode 437: 路径总和 III（Path Sum III）](/2025/04/30/算法刷题/LeetCode-437-路径总和-III/) - 双重递归和前缀和优化对比，详解树路径问题的递归设计
- [LeetCode 105: 从前序与中序遍历序列构造二叉树（Construct Binary Tree from Preorder and Inorder Traversal）](/2025/04/30/算法刷题/LeetCode-105-从前序与中序遍历序列构造二叉树/) - 递归和哈希表结合重建二叉树的两种优化方法
- [❌ LeetCode 114: 二叉树展开为链表 (Flatten Binary Tree to Linked List)](/2025/04/29/算法刷题/LeetCode-114-Binary-Tree-Flatten/) - 分析树转链表过程中的指针操作错误
- [LeetCode 230: 二叉搜索树中第 K 小的元素（Kth Smallest Element in a BST）](/2025/06/01/算法刷题/LeetCode-230-Kth-Smallest-Element-in-BST/) - 中序遍历解法与进阶优化方案
- [LeetCode 101: Symmetric Tree](/2025/04/28/算法刷题/LeetCode-101-Symmetric-Tree) - 使用递归和迭代方法判断二叉树是否对称
- [❌ LeetCode 98: 验证二叉搜索树（Validate Binary Search Tree）](/2025/04/29/算法刷题/LeetCode-98-validate-binary-search-tree/) - 分析二叉搜索树验证中的比较运算符错误
- [❌ LeetCode 543: 二叉树的直径（Binary Tree Diameter）](/2025/05/29/算法刷题/LeetCode-543-Binary-Tree-Diameter/) - 在 DFS 计算树深度的同时维护全局最大直径

### 图

- [LeetCode 207: 课程表（Course Schedule）](/2025/05/03/算法刷题/LeetCode-207-课程表/) - 使用 BFS 拓扑排序和 DFS 检测环两种方法解决课程依赖问题

### 动态规划

- [❌ LeetCode 131: 分割回文串（Palindrome Partitioning）](/2025/05/06/算法刷题/LeetCode-131-分割回文串/) - 动态规划预处理和记忆化搜索两种方法解决分割回文串问题
- [LeetCode 22: 括号生成（Generate Parentheses）](/2025/05/06/算法刷题/LeetCode-22-括号生成/) - 回溯法和动态规划解决括号生成问题详解
- [❌ LeetCode 790: 多米诺和托米诺平铺（Domino and Tromino Tiling）](/2025/05/06/算法刷题/LeetCode-790-多米诺和托米诺平铺/) - 状态定义与转移方程解决瓷砖平铺的组合计数问题

### 位运算

- [LeetCode 136: 只出现一次的数字（Single Number）](/2025/05/10/算法刷题/LeetCode-136-只出现一次的数字/) - 使用异或运算解决的数组元素查找问题，详解位运算特性
- [LeetCode 52: N 皇后 II（N-Queens II）](/2025/05/07/算法刷题/LeetCode-52-N皇后-II/) - 使用位运算优化 N 皇后问题的空间复杂度，求解方案数量
- [LeetCode 78: 子集（Subsets）](/2025/05/06/算法刷题/LeetCode-78-子集/) - 位运算与回溯两种方法生成所有子集的详细对比

### 分治算法

- [LeetCode 169: 多数元素（Majority Element）](/2025/05/10/算法刷题/LeetCode-169-多数元素/) - 使用摩尔投票算法高效找出数组中的多数元素
- [LeetCode 240: 搜索二维矩阵 II（Search a 2D Matrix II）](/2025/04/20/算法刷题/LeetCode-240-Search-a-2D-Matrix-II/) - 角落搜索法、二分查找法和分治法三种解法比较
- [LeetCode 4: 寻找两个正序数组的中位数（Median of Two Sorted Arrays）](/2025/05/11/算法刷题/LeetCode-4-寻找两个正序数组的中位数/) - 深入理解二分思想解决两个有序数组中位数问题
