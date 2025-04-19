---
title: 'LeetCode 1: Two Sum'
date: 2023-07-15 14:30:00
categories:
  - 算法刷题
tags:
  - 数组
  - 哈希表
  - LeetCode
  - Easy
---

## Problem Description

Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

## Problem Analysis

We need to find two numbers in the array that add up to the target value. The naive approach would be to use nested loops to check all possible pairs, but that would be O(n²) time complexity.

A more efficient approach is to use a hash map to store previously visited elements and their indices. For each element, we check if the complement (target - current element) exists in the hash map. If it does, we've found our solution.

## Solution Approach

1. Create a hash map to store numbers and their indices
2. Iterate through the array:
   - For each element, calculate the complement (target - current element)
   - If the complement exists in the hash map, return the current index and the complement's index
   - Otherwise, add the current element and its index to the hash map
3. If no solution is found, return an empty array

## Code Implementation

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  const map = new Map()

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]

    if (map.has(complement)) {
      return [map.get(complement), i]
    }

    map.set(nums[i], i)
  }

  return []
}
```

## Complexity Analysis

- Time Complexity: O(n) where n is the length of the array. We only need to traverse the array once.
- Space Complexity: O(n) for storing the hash map, which in the worst case could contain all n elements.

## Alternative Solutions

### Brute Force Approach

```javascript
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j]
      }
    }
  }
  return []
}
```

The brute force approach has O(n²) time complexity and O(1) space complexity, which is less efficient for large arrays but uses less memory.
