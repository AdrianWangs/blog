---
title: Golang并发控制最佳实践
date: 2026-01-18
categories:
  - 八股文
  - Go语言
  - 并发编程
---

## 概述

Go语言的并发模型基于CSP（Communicating Sequential Processes）理论，通过Goroutine和Channel实现高效的并发编程能力。Go语言提供了丰富的并发控制机制，每种方法都有其适用场景和优缺点，正确选择和组合使用这些工具，能够构建出高效、安全、可维护的并发程序。

## 核心能力

### 1. Channel

#### 1.1 基本概念

Channel是Go语言中用于Goroutine间通信的核心机制，遵循"不要通过共享内存来通信，而要通过通信来共享内存"的设计哲学。

#### 1.2 无缓冲通道（Unbuffered Channels）

> 无缓冲通道提供同步通信机制，发送和接收操作必须同时准备好才能完成。

**基本使用示例**

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan string)

    go func() {
        time.Sleep(2 * time.Second)
        ch <- "Hi"
    }()

    message := <-ch
    fmt.Println(message)
}
```

**工作流程同步示例**

```go
package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for job := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, job)
        time.Sleep(time.Second)
        results <- job * 2
    }
}

func main() {
    jobs := make(chan int, 5)
    results := make(chan int, 5)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    for r := 1; r <= 5; r++ {
        result := <-results
        fmt.Printf("Result: %d\n", result)
    }
}
```

#### 1.3 缓冲通道（Buffered Channels）

> 缓冲通道允许异步通信，只有当缓冲区满时发送才会阻塞，缓冲区空时接收才会阻塞。

**基本使用示例**

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan int, 3)

    // 发送数据不会阻塞（直到缓冲区满）
    ch <- 1
    ch <- 2
    ch <- 3

    fmt.Printf("Channel length: %d, capacity: %d\n", len(ch), cap(ch))

    for i := 0; i < 3; i++ {
        fmt.Printf("Received: %d\n", <-ch)
    }
}
```

**生产者-消费者模式（错误示例）**

```go
package main

import (
    "fmt"
    "math/rand"
    "sync"
    "time"
)

func producer(ch chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for i := 0; i < 5; i++ {
        value := rand.Intn(100)
        ch <- value
        fmt.Printf("Produced: %d\n", value)
        time.Sleep(time.Millisecond * 500)
    }
}

func consumer(id int, ch <-chan int, wg *sync.WaitGroup) {
    defer wg.Done()
    for value := range ch {
        fmt.Printf("Consumer %d consumed: %d\n", id, value)
        time.Sleep(time.Millisecond * 300)
    }
}

func main() {
    ch := make(chan int, 2)
    var wg sync.WaitGroup

    wg.Add(1)
    go producer(ch, &wg)

    wg.Add(2)
    go consumer(1, ch, &wg)
    go consumer(2, ch, &wg)

    wg.Wait()
    close(ch)

    // 等待消费者处理完剩余数据
    time.Sleep(time.Second)
}
```

**生产者-消费者模式（正确示例）**

```go
package main

import (
    "fmt"
    "math/rand"
    "sync"
    "time"
)

func producer(ch chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for i := 0; i < 5; i++ {
        value := rand.Intn(100)
        ch <- value
        fmt.Printf("Produced: %d\n", value)
        time.Sleep(time.Millisecond * 500)
    }
}

func consumer(id int, ch <-chan int, wg *sync.WaitGroup) {
    defer wg.Done()
    for value := range ch {
        fmt.Printf("Consumer %d consumed: %d\n", id, value)
        time.Sleep(time.Millisecond * 300)
    }
}

func main() {
    ch := make(chan int, 2)
    var producerWg sync.WaitGroup
    var consumerWg sync.WaitGroup

    producerWg.Add(1)
    go producer(ch, &producerWg)

    consumerWg.Add(2)
    go consumer(1, ch, &consumerWg)
    go consumer(2, ch, &consumerWg)

    // 1. 等待生产者完成工作
    producerWg.Wait()

    // 2. 当生产者完成后，关闭 channel
    //    这会向消费者发出信号，表明不会再有新的数据
    close(ch)

    // 3. 等待消费者处理完 channel 中所有剩余的数据
    consumerWg.Wait()

    fmt.Println("All goroutines finished successfully.")
}
```

#### 1.4 Select语句

> Select语句允许goroutine在多个通道操作中进行选择，提供了强大的多路复用能力。

**基本Select使用**

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go func() {
        time.Sleep(1 * time.Second)
        ch1 <- "message from ch1"
    }()

    go func() {
        time.Sleep(2 * time.Second)
        ch2 <- "message from ch2"
    }()

    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println("Received: ", msg1)
        case msg2 := <-ch2:
            fmt.Println("Received: ", msg2)
        case <-time.After(3 * time.Second):
            fmt.Println("Timeout!")
            return
        }
    }
}
```

**非阻塞通道操作**

```go
package main

import (
    "fmt"
    "time"
)

func tryReceive(ch <-chan int) {
    select {
    case value := <-ch:
        fmt.Printf("Received: %d\n", value)
    default:
        fmt.Println("No value received")
    }
}

func trySend(ch chan<- int, value int) {
    select {
    case ch <- value:
        fmt.Printf("Sent: %d\n", value)
    default:
        fmt.Printf("Cannot send: %d (channel full)\n", value)
    }
}

func main() {
    ch := make(chan int, 1)

    // 尝试从空通道接收
    tryReceive(ch)

    trySend(ch, 100)

    // 尝试发送到满通道
    trySend(ch, 200)

    // 接收值
    tryReceive(ch)
}
```

#### 1.5 通道模式

**扇出/扇入模式（Fan-out/Fan-in）**

```go
package main

import (
    "fmt"
    "sync"
)

// 扇出：将工作分发给多个goroutine
func fanOut(input <-chan int, workers int) []<-chan int {
    outputs := make([]<-chan int, workers)

    for i := 0; i < workers; i++ {
        output := make(chan int)
        outputs[i] = output

        go func(out chan<- int) {
            defer close(out)
            for n := range input {
                out <- n * n // 计算平方
            }
        }(output)
    }

    return outputs
}

// 扇入：将多个goroutine的结果合并
func fanIn(inputs ...<-chan int) <-chan int {
    output := make(chan int)
    var wg sync.WaitGroup

    for _, input := range inputs {
        wg.Add(1)
        go func(in <-chan int) {
            defer wg.Done()
            for value := range in {
                output <- value
            }
        }(input)
    }

    go func() {
        wg.Wait()
        close(output)
    }()

    return output
}

func main() {
    input := make(chan int)
    go func() {
        defer close(input)
        for i := 1; i <= 10; i++ {
            input <- i
        }
    }()

    // 扇出到3个worker
    outputs := fanOut(input, 3)

    // 扇入合并结果
    result := fanIn(outputs...)

    // 收集结果
    for value := range result {
        fmt.Printf("Result: %d\n", value)
    }
}
```

**管道模式（Pipeline）**

```go
package main

import "fmt"

// 第一阶段：生成数字
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

// 第二阶段：计算平方
func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

// 第三阶段：过滤偶数
func filterEven(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            if n%2 == 0 {
                out <- n
            }
        }
    }()
    return out
}

func main() {
    // 构建管道
    numbers := generate(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    squares := square(numbers)
    evens := filterEven(squares)

    // 处理结果
    for result := range evens {
        fmt.Printf("Even square: %d\n", result)
    }
}
```

#### 1.6 常见陷阱与避免方法

> **常见陷阱**
> - 忘记关闭通道导致goroutine泄漏
> - 向已关闭的通道发送数据导致panic
> - 死锁：所有goroutine都在等待
> - 通道容量设计不当影响性能

**避免goroutine泄漏**

```go
package main

import (
    "context"
    "fmt"
    "time"
)

// 错误示例：可能导致goroutine泄漏
func badExample() {
    ch := make(chan int)

    go func() {
        for i := 0; i < 1000; i++ {
            ch <- i // 如果没有接收者，这里会永远阻塞
        }
    }()

    // 只接收一个值就退出
    fmt.Println(<-ch)
    // goroutine仍在运行，造成泄漏
}

// 正确示例：使用context控制goroutine生命周期
func goodExample() {
    // 实现略
}
```

### 2. Sync 包

#### 2.1 Mutex（互斥锁）

> Mutex 提供互斥访问共享资源的机制，确保同一时间只有一个 goroutine 可以访问临界区。

**基本使用示例**

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}

func main() {
    counter := &Counter{}
    var wg sync.WaitGroup

    // 启动100个goroutine并发增加计数器
    for i := 0; i < 100; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for j := 0; j < 1000; j++ {
                counter.Increment()
            }
        }()
    }

    wg.Wait()
    fmt.Printf("Final counter value: %d\n", counter.Value())
}
```

**银行账户转账示例**

```go
package main

import (
    "fmt"
    "sync"
)

type Account struct {
    id      int // 新增唯一 ID
    mu      sync.Mutex
    balance int
}

func (a *Account) Deposit(amount int) {
    a.mu.Lock()
    defer a.mu.Unlock()
    a.balance += amount
}

func (a *Account) Withdraw(amount int) bool {
    a.mu.Lock()
    defer a.mu.Unlock()

    if a.balance >= amount {
        a.balance -= amount
        return true
    }
    return false
}

func (a *Account) Balance() int {
    a.mu.Lock()
    defer a.mu.Unlock()
    return a.balance
}

// 转账函数 - 避免死锁的正确实现
func Transfer(from, to *Account, amount int) bool {
    // 实现略：按账户ID顺序加锁以避免死锁
    return true
}
```

#### 2.2 RWMutex（读写锁）

> RWMutex允许多个读操作并发执行，但写操作需要独占访问，适用于**读多写少**的场景。

**本地缓存实现示例**

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func NewCache() *Cache {
    return &Cache{
        data: make(map[string]string),
    }
}

func (c *Cache) Get(key string) (string, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()

    value, exists := c.data[key]
    return value, exists
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()
    defer c.mu.Unlock()

    c.data[key] = value
}

func (c *Cache) Delete(key string) {
    c.mu.Lock()
    defer c.mu.Unlock()

    delete(c.data, key)
}

func (c *Cache) Keys() []string {
    c.mu.RLock()
    defer c.mu.RUnlock()

    keys := make([]string, 0, len(c.data))
    for key := range c.data {
        keys = append(keys, key)
    }
    return keys
}

func main() {
    cache := NewCache()
    var wg sync.WaitGroup

    // 写操作
    wg.Add(10)
    for i := 0; i < 10; i++ {
        go func(id int) {
            defer wg.Done()
            key := fmt.Sprintf("key%d", id)
            value := fmt.Sprintf("value%d", id)
            cache.Set(key, value)
            fmt.Printf("Set %s = %s\n", key, value)
        }(i)
    }

    // 等待写操作完成
    wg.Wait()

    // 并发读操作
    wg.Add(50)
    for i := 0; i < 50; i++ {
        go func(id int) {
            defer wg.Done()
            key := fmt.Sprintf("key%d", id%10)
            if value, exists := cache.Get(key); exists {
                fmt.Printf("Read %s = %s\n", key, value)
            }
        }(i)
    }

    wg.Wait()

    fmt.Printf("Cache keys: %v\n", cache.Keys())
}
```

#### 2.3 WaitGroup

> WaitGroup用于等待一组goroutine完成执行，是协调多个goroutine的重要工具。

**并行下载示例**

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type DownloadResult struct {
    URL      string
    Success  bool
    Duration time.Duration
    Error    error
}

func download(url string, results chan<- DownloadResult, wg *sync.WaitGroup) {
    defer wg.Done()

    start := time.Now()

    // 模拟下载过程
    time.Sleep(time.Duration(len(url)%3+1) * time.Second)

    // 模拟随机成功/失败
    success := len(url)%4 != 0

    result := DownloadResult{
        URL:      url,
        Success:  success,
        Duration: time.Since(start),
    }

    if !success {
        result.Error = fmt.Errorf("download failed for %s", url)
    }

    results <- result
}

func main() {
    urls := []string{
        "https://example1.com/file1.zip",
        "https://example2.com/file2.zip",
        "https://example3.com/file3.zip",
        "https://example4.com/file4.zip",
        "https://example5.com/file5.zip",
    }

    results := make(chan DownloadResult, len(urls))
    var wg sync.WaitGroup

    // 启动所有下载任务
    for _, url := range urls {
        wg.Add(1)
        go download(url, results, &wg)
    }

    // 等待所有下载完成
    go func() {
        wg.Wait()
        close(results)
    }()

    // 收集结果
    var successful, failed int
    for result := range results {
        if result.Success {
            successful++
            fmt.Printf("✓ Downloaded %s in %v\n", result.URL, result.Duration)
        } else {
            failed++
            fmt.Printf("✗ Failed %s: %v\n", result.URL, result.Error)
        }
    }

    fmt.Printf("\nSummary: %d successful, %d failed\n", successful, failed)
}
```

#### 2.4 Once

> Once确保某个操作只执行一次，常用于**单例**模式和**初始化**操作。

**单例模式实现**

```go
package main

import (
    "fmt"
    "sync"
)

type Singleton struct {
    data string
}

var (
    instance *Singleton
    once     sync.Once
)

func GetInstance() *Singleton {
    once.Do(func() {
        fmt.Println("Creating singleton instance...")
        instance = &Singleton{
            data: "I am a singleton",
        }
    })
    return instance
}

func (s *Singleton) GetData() string {
    return s.data
}

func main() {
    var wg sync.WaitGroup

    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()

            instance := GetInstance()
            fmt.Printf("Goroutine %d got instance: %s\n", id, instance.GetData())
        }(i)
    }

    wg.Wait()

    // 验证所有实例都是同一个
    inst1 := GetInstance()
    inst2 := GetInstance()
    fmt.Printf("Same instance: %t\n", inst1 == inst2)
}
```

**配置初始化示例**

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Config struct {
    DatabaseURL string
    APIKey      string
    Debug       bool
}

var (
    config *Config
    once   sync.Once
)

func loadConfig() {
    fmt.Println("Loading configuration...")
    time.Sleep(2 * time.Second) // 模拟耗时的配置加载

    config = &Config{
        DatabaseURL: "postgres://localhost:5432/mydb",
        APIKey:      "secret-api-key",
        Debug:       true,
    }
    fmt.Println("Configuration loaded successfully")
}

func GetConfig() *Config {
    once.Do(loadConfig)
    return config
}

func main() {
    var wg sync.WaitGroup

    // 多个goroutine同时请求配置
    for i := 0; i < 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()

            fmt.Printf("Goroutine %d requesting config...\n", id)
            cfg := GetConfig()
            fmt.Printf("Goroutine %d got config: %+v\n", id, cfg)
        }(i)
    }

    wg.Wait()
}
```

#### 2.5 Cond（条件变量）

> Cond用于在某个条件满足时通知等待的goroutine，适用于**复杂的同步场景**。

**生产者-消费者模式**

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// 使用Cond实现的生产者-消费者模式示例
// 具体实现可根据实际需求编写
```
