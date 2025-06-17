---
title: '技术八股: Go Map 基础概念与用法'
date: 2025-06-16 20:56:03
categories:
  - 技术八股
  - Go语言
tags:
  - Go语言
  - 八股文
  - 面试题
  - 后端
  - 数据结构
  - Map
description: '深入解析Go语言map的基础概念和基本用法，包括初始化、读写删除、遍历等操作，以及map的特性和注意事项'
---

# Go Map 基础概念与用法

## 概述

map 又称字典，是一种常用的数据结构，核心特征包含下述三点：

（1）存储基于 key-value 对映射的模式；

（2）基于 key 维度实现存储数据的去重；

（3）读、写、删操作控制，时间复杂度 O(1)。

## 初始化

### 几种初始化方法

golang 中，对 map 的初始化分为以下几种方式：

```go
myMap1 := make(map[int]int, 2)
```

通过 make 关键字进行初始化，同时指定 map 预分配的容量。

```go
myMap2 := make(map[int]int)
```

通过 make 关键字进行初始化，不显式声明容量，因此默认容量为 0。

```go
myMap3 := map[int]int{
	1: 2,
	3: 4,
}
```

初始化操作连带赋值，一气呵成。

### key 的类型要求

map 中，key 的数据类型必须为可比较的类型，chan、map、func 不可比较。

**可作为 key 的类型：**

- 基本类型：bool, 数值类型, string
- 指针类型
- 数组类型（元素可比较）
- 结构体类型（所有字段可比较）

**不可作为 key 的类型：**

- slice（切片）
- map（映射）
- function（函数）

## 读操作

读 map 分为下面两种方式：

```go
v1 := myMap[10]
```

第一种方式是直接读，倘若 key 存在，则获取到对应的 val，倘若 key 不存在或者 map 未初始化，会返回 val 类型的零值作为兜底。

```go
v2, ok := myMap[10]
```

第二种方式是读的同时添加一个 bool 类型的 flag 标识是否读取成功。倘若 ok == false，说明读取失败，key 不存在，或者 map 未初始化。

此处同一种语法能够实现不同返回值类型的适配，是由于代码在汇编时，会根据返回参数类型的区别，映射到不同的实现方法。

### 判断 key 是否存在

**正确方式：**

```go
value, ok := m[key]
if ok {
    // key存在，value是对应的值
    fmt.Println("key存在，值为:", value)
} else {
    // key不存在，value是零值
    fmt.Println("key不存在")
}

// 简化写法
if value, ok := m[key]; ok {
    // key存在的处理逻辑
}
```

**注意：** 不能仅通过值判断 key 是否存在，因为值可能就是零值。

## 写操作

```go
myMap[5] = 6
```

写操作的语法如上。须注意的一点是，倘若 map 未初始化，直接执行写操作会导致 panic：

```go
panic("assignment to entry in nil map")
```

## 删除操作

```go
delete(myMap, 5)
```

执行 delete 方法时，倘若 key 存在，则会从 map 中将对应的 key-value 对删除；倘若 key 不存在或 map 未初始化，则方法直接结束，不会产生显式提示。

## 遍历操作

遍历分为下面两种方式：

```go
for k, v := range myMap {
	// ...
}
```

基于 k,v 依次承接 map 中的 key-value 对；

```go
for k := range myMap {
	// ...
}
```

基于 k 依次承接 map 中的 key，不关注 val 的取值。

### 遍历顺序

需要注意的是，在执行 map 遍历操作时，获取的 key-value 对并没有一个固定的顺序，因此前后两次遍历顺序可能存在差异。

**Go map 遍历无序的原因：**

1. **哈希表特性**：数据存储位置由哈希值决定，不保证顺序
2. **故意随机化**：Go 1.0 后故意引入随机化，防止程序依赖遍历顺序
3. **扩容影响**：扩容过程中数据重新分布，进一步打乱顺序

**如需有序遍历：**

```go
// 先收集key并排序
keys := make([]string, 0, len(m))
for k := range m {
	keys = append(keys, k)
}
sort.Strings(keys)

// 按排序后的key遍历
for _, k := range keys {
	fmt.Println(k, m[k])
}
```

## 并发安全性

map 不是并发安全的数据结构，倘若存在并发读写行为，会抛出 fatal error。

具体规则是：

（1）并发读没有问题；

（2）并发读写中的"写"是广义上的，包含写入、更新、删除等操作；

（3）读的时候发现其他 goroutine 在并发写，抛出 fatal error；

（4）写的时候发现其他 goroutine 在并发写，抛出 fatal error。

```go
fatal("concurrent map read and map write")
fatal("concurrent map writes")
```

需要关注，此处并发读写会引发 fatal error，是一种比 panic 更严重的错误，无法使用 recover 操作捕获。

### 解决方案

**使用互斥锁：**

```go
var mu sync.RWMutex
var m = make(map[string]int)

// 读操作
mu.RLock()
value := m[key]
mu.RUnlock()

// 写操作
mu.Lock()
m[key] = value
mu.Unlock()
```

**使用 sync.Map：**

```go
var m sync.Map

// 存储
m.Store(key, value)

// 读取
value, ok := m.Load(key)

// 删除
m.Delete(key)

// 遍历
m.Range(func(key, value interface{}) bool {
    // 处理逻辑
    return true // 返回false会停止遍历
})
```

## map 的零值

- **零值**：Go map 的零值是 `nil`
- **读操作**：可以从 nil map 读取，返回零值和 false
- **写操作**：不能向 nil map 写入，会 panic：`assignment to entry in nil map`

**正确初始化方式：**

```go
// 方式1：使用make
m1 := make(map[string]int)

// 方式2：字面量初始化
m2 := map[string]int{"key": 1}

// 方式3：指定容量
m3 := make(map[string]int, 10)
```

## 小结

Go 语言的 map 是一个功能强大且高效的数据结构，但在使用时需要注意：

1. **类型限制**：key 必须是可比较类型
2. **并发安全**：map 不是并发安全的，需要额外的同步机制
3. **零值处理**：nil map 只能读不能写
4. **遍历顺序**：遍历顺序是随机的，不要依赖顺序
5. **性能特征**：读写删除操作的时间复杂度为 O(1)

理解这些基础概念和用法是深入学习 Go map 底层实现的重要基础。
