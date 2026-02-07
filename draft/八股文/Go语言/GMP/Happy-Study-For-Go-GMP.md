---
title: "Happy Study For Go's GMP"
date: 2026-01-18
categories:
  - 八股文
  - Go语言
  - GMP
tags:
  - Go
  - GMP
  - Goroutine
  - 并发编程
  - 协程
---

煮波理解关于一个语言知识的学习是离不开工作里的细节的。如果只对着一个语言的底层知识死磕而不和工作实际场景结合是无法深刻理解和铭记于心的，也无法在真正的代码中实现使用，因此一个语言的底层学习一定是和实际应用相辅相成的，需要不停的带有疑问，不断的记录，不断的学习，还要跟着时代的版本与时俱进。

## 一次 CR 中对 Go 的协程的提及

而这里面主要记录着一些关于实际代码中遇到的问题，以及对应的记录。

首先来看：

```go
func A(ctx context.Context) {
    go func(index int, image *spu.Image) {
        defer func() {
            if r := recover(); r != nil {
                fmt.Println("Recovered from uploadImage panic:", r)
            }
        }()
        // 执行逻辑
    }()
}
```

如果是第一次写 Go，可能考虑到，如果在 go func 中，这段代码执行逻辑，如果 func A 结束了，那这段 `goroutine` 还会继续执行么？

> 我们的第一反应都是：肯定会执行，如果不会执行的话，那我们运行的服务中，很多这么写的内容岂不是早出问题了？

事实的确如此，在我们的机器服务实例上，当 func A 结束之后，这段 `goroutine` 依然会继续执行，因为服务程序并不会结束。但是如果是我们本地写一个测试：

```go
func main() {
    // 创建 goroutine
    go func() {
        time.Sleep(1 * time.Second)
        fmt.Println("goroutine执行完成")
    }()

    fmt.Println("main函数执行完成")
}
```

其实这里这个 `goroutine` 还会不会执行完成呢？其实是不会的，main 函数退出之后，未完成的 `goroutine` 都会被强制终止，因为 main 函数的 `goroutine` 是程序的主 `goroutine`。

这里的 main 是程序的生命周期，实际上对于 `goroutine` 来说，它的生命周期是独立于创建它的创建函数的，也就是说在我们的服务当中调用这个 A 方法，`goroutine` 的生命周期不依赖于 A，它自身的栈内存都是独立分配的。对于这个 `goroutine` 来说，只有当：

- `goroutine` 自身逻辑执行完毕
- 被显式终止，例如通过 context 取消。因此，在函数 A 创建异步线程的时候，需要 `goroutine` 创建自己的 ctx，而不是复用 A 函数的 ctx 的生命周期。
- 程序主体退出

的时候才会停止。但是我们要防止**悬垂指针**的问题，也就是第一个代码块中的 `image *spu.Image`，需要确保变量的生命周期覆盖 goroutine 的执行周期，防止 A 函数返回后内存被释放。如果是对象较小，直接传值没什么问题，如果对象较大，需要考虑延长周期或者通过 wait 的方式等待执行完成等措施避免问题。

## 进一步看看 `goroutine`

既然已经发掘到这里，那么不妨进一步往下看看，Go 语言的 `goroutine`，以及它背后的 GMP。

我们俗称将 `goroutine` 称之为协程，协程是用户态线程，和线程是 N:1 的关系，是更细粒度的调度单元，完全由用户态自闭环就可以了。而线程是操作系统视角下最小的调度单元，也就是它的创建等生命周期操作都是需要内核参与，因此协程的资源消耗比线程要小。

但是从语义上来讲，协程 coroutine 并不完全等于用户态线程，但是可以作为用户态线程的基础。

> "User-level threads are different from coroutines. Coroutines voluntarily yield to each other; user-level threads can preempt or be preempted." --MIT 6.828 Operating System Engineering

| 学术 | 工程「Go语言」 |
|------|---------------|
| 协程是一种比子程序更通用的控制结构 | 协程一词往往用于描述更轻量、可挂起、用户态调度的执行单元。 |
| 协程不等于线程也不等于用户态线程 | 实际语义更接近于用户态线程，是用户态调度和具备并发能力的「实体」 |
| 协程本质不用于并发执行，是更灵活的控制流机制 | |

因此 `goroutine` 其实是 Go 语言自身对 coroutine 的一种封装。

Go 语言的 `goroutine` 定义结构体，其中较为常用的通过颜色进行了标记：

```go
type g struct {
    // 三个 stack 核心作用是控制 goroutine 的动态栈伸缩
    stack       stack   // offset known to runtime/cgo
    stackguard0 uintptr // offset known to liblink
    stackguard1 uintptr // offset known to liblink

    _panic    *_panic // innermost panic - offset known to liblink
    _defer    *_defer // innermost defer
    // 当前绑定的 machine，同一时刻一个 G 只能绑定一个 M
    m         *m      // current m; offset known to arm liblink
    // 调度上下文
    sched     gobuf
    syscallsp uintptr // if status==Gsyscall, syscallsp = sched.sp to use during gc
    syscallpc uintptr // if status==Gsyscall, syscallpc = sched.pc to use during gc
    syscallbp uintptr // if status==Gsyscall, syscallbp = sched.bp to use in fpTraceback
    stktopsp  uintptr // expected sp at top of stack, to check in traceback
    // param is a generic pointer parameter field used to pass
    // values in particular contexts where other storage for the
    // parameter would be difficult to find. It is currently used
    // in four ways:
    // 1. When a channel operation wakes up a blocked goroutine, it sets param to
    //    point to the sudog of the completed blocking operation.
    // 2. By gcAssistAlloc1 to signal back to its caller that the goroutine completed
    //    the GC cycle. It is unsafe to do so in any other way, because the goroutine's
    //    stack may have moved in the meantime.
    // 3. By debugCallWrap to pass parameters to a new goroutine because allocating a
    //    closure in the runtime is forbidden.
    // 4. When a panic is recovered and control returns to the respective frame,
    //    param may point to a savedOpenDeferState.
    param        unsafe.Pointer
    // 原子化状态标识 生命周期 _Gwaiting→_Grunnable→_Grunning
    atomicstatus atomic.Uint32
    stackLock    uint32 // sigprof/scang lock; TODO: fold in to atomicstatus
    goid         uint64
    schedlink    guintptr
    waitsince    int64      // approx time when the g become blocked
    waitreason   waitReason // if status==Gwaiting
    
    // 调度器设置的标志，配合 stackguard0 来实现协作式抢占
    preempt       bool // preemption signal, duplicates stackguard0 = stackpreempt
    preemptStop   bool // transition to _Gpreempted on preemption; otherwise, just deschedule
    preemptShrink bool // shrink stack at synchronous safe point

    // asyncSafePoint is set if g is stopped at an asynchronous
    // safe point. This means there are frames on the stack
    // without precise pointer information.
    asyncSafePoint bool

    paniconfault bool // panic (instead of crash) on unexpected fault address
    // 栈是否完成 gc 扫描，避免 GC 重复处理
    gcscandone   bool // g has scanned stack; protected by _Gscan bit in status
   
    // Per-G GC state

    // gcAssistBytes is this G's GC assist credit in terms of
    // bytes allocated. If this is positive, then the G has credit
    // to allocate gcAssistBytes bytes without assisting. If this
    // is negative, then the G must correct this by performing
    // scan work. We track this in bytes to make it fast to update
    // and check for debt in the malloc hot path. The assist ratio
    // determines how this corresponds to scan work debt.
    // gcAssistBytes 为负时，Goroutine 需执行扫描工作以补偿内存分配
    gcAssistBytes int64
    throwsplit   bool // must not split stack
    // activeStackChans indicates that there are unlocked channels
    // pointing into this goroutine's stack. If true, stack
    // copying needs to acquire channel locks to protect these
    // areas of the stack.
    activeStackChans bool
    // parkingOnChan indicates that the goroutine is about to
    // park on a chansend or chanrecv. Used to signal an unsafe point
    // for stack shrinking.
    parkingOnChan atomic.Bool
    // inMarkAssist indicates whether the goroutine is in mark assist.
    // Used by the execution tracer.
    inMarkAssist bool
    coroexit     bool // argument to coroswitch_m

    raceignore    int8  // ignore race detection events
    nocgocallback bool  // whether disable callback from C
    tracking      bool  // whether we're tracking this G for sched latency statistics
    trackingSeq   uint8 // used to decide whether to track this G
    trackingStamp int64 // timestamp of when the G last started being tracked
    runnableTime  int64 // the amount of time spent runnable, cleared when running, only used when tracking
    lockedm       muintptr
    sig           uint32
    writebuf      []byte
    sigcode0      uintptr
    sigcode1      uintptr
    sigpc         uintptr
    parentGoid    uint64          // goid of goroutine that created this goroutine
    gopc          uintptr         // pc of go statement that created this goroutine
    ancestors     *[]ancestorInfo // ancestor information goroutine(s) that created this goroutine (only used if debug.tracebackancestors)
    startpc       uintptr         // pc of goroutine function
    racectx       uintptr
    waiting       *sudog         // sudog structures this g is waiting on (that have a valid elem ptr); in lock order
    cgoCtxt       []uintptr      // cgo traceback context
    labels        unsafe.Pointer // profiler labels
    timer         *timer         // cached timer for time.Sleep
    sleepWhen     int64          // when to sleep until
    // select 操作完成的标志
    selectDone    atomic.Uint32  // are we participating in a select and did someone win the race?

    // goroutineProfiled indicates the status of this goroutine's stack for the
    // current in-progress goroutine profile
    goroutineProfiled goroutineProfileStateHolder

    coroarg *coro // argument during coroutine transfers

    // Per-G tracer state.
    trace gTraceState
}
```

可以看到，G 是和唯一一个 M 进行绑定的。

## 接着再来聊聊 GMP

在聊 GMP 模型之前，不妨可以先看下整体的设计模型图。

### 初看 GMP 调度模型

> P 的数量可以由 GOMAXPROCS 指定，但是实际有用的数量需要跟 CPU 核数正相关。P 数量超出 CPU 核数的时候就失去了意义。

<!-- 图片需要手动从 Notion 下载：GMP调度模型白板图 -->

GMP 即 goroutine + machine + processor。与我们最接近的 goroutine 上面已经简单聊过了，这下我们看下他们的组合。

### GMP -> G

G 在上面已经简略说过，让我们来看看其他两个 M 和 P。

### GMP -> M

> machine 是 golang 中对操作系统线程的抽象，是真正执行 goroutine 的实体。在 G 的视角里，M 就类似他们的 CPU 一样，去寻找可以调度的 G。系统在启动时，M 的数量一般有默认值，`runtime/debug` 中的 `SetMaxThreads` 函数设置 M 的最大数量。

- **g0**：由 machine 伴生的调度 G，主要作用执行调度相关的操作，可以用来寻找合适的普通 G，寻找可执行的 G，也可以进行栈扩容。值得注意的是，g0 的栈是 M 的系统栈，不受 Go 栈扩容机制影响。
- **curg**：当前正在运行的 G
- **p**：表示 M 需要与 P 相结合才能执行 goroutine，该内容当前 M 绑定的 P。puintptr 是可绕过 GC 屏障的指针类型
- **oldp**：当 M 进入系统调用（syscall）时，会释放当前 P（避免 P 闲置），并将 p 保存到 oldp。系统调用返回后，M 会尝试重新绑定 oldp 或从全局队列获取新 P，恢复执行 G

```go
type m struct {
    // 由 machine 伴生的调度 g，主要作用执行调度相关的操作，可以用来寻找合适的普通 g，寻找可执行的 g，也可以进行栈扩容。
    // 值得注意的是，g0 的栈是 m 的系统栈，不受 go 栈扩容机制影响。
    g0      *g     // goroutine with scheduling stack
    morebuf gobuf  // gobuf arg to morestack
    divmod  uint32 // div/mod denominator for arm - known to liblink
    _       uint32 // align next field to 8 bytes

    // Fields not known to debuggers.
    procid          uint64            // for debuggers, but offset not hard-coded
    gsignal         *g                // signal-handling g
    goSigStack      gsignalStack      // Go-allocated signal handling stack
    sigmask         sigset            // storage for saved signal mask
    tls             [tlsSlots]uintptr // thread-local storage (for x86 extern register)
    mstartfn        func()
    // 当前正在运行的 g
    curg            *g       // current running goroutine
    caughtsig       guintptr // goroutine running during fatal signal
    // 表示 m 需要与 P 相结合才能执行 goroutine，该内容当前 m 绑定的 p。puintptr 是可绕过 GC 屏障的指针类型
    p               puintptr // attached p for executing go code (nil if not executing go code)
    nextp           puintptr
    // 执行系统调用前绑定的 p，
    // 当 M 进入系统调用（syscall）时，会释放当前 P（避免 P 闲置），并将 p 保存到 oldp。系统调用返回后，M 会尝试重新绑定 oldp 或从全局队列获取新 P，恢复执行 G
    oldp            puintptr // the p that was attached before executing a syscall
    id              int64
    mallocing       int32
    throwing        throwType
    preemptoff      string // if != "", keep curg running on this m
    locks           int32
    dying           int32
    profilehz       int32
    spinning        bool // m is out of work and is actively looking for work
    blocked         bool // m is blocked on a note
    newSigstack     bool // minit on C thread called sigaltstack
    printlock       int8
    incgo           bool          // m is executing a cgo call
    isextra         bool          // m is an extra m
    isExtraInC      bool          // m is an extra m that is not executing Go code
    isExtraInSig    bool          // m is an extra m in a signal handler
    freeWait        atomic.Uint32 // Whether it is safe to free g0 and delete m (one of freeMRef, freeMStack, freeMWait)
    needextram      bool
    g0StackAccurate bool // whether the g0 stack has accurate bounds
    traceback       uint8
    ncgocall        uint64        // number of cgo calls in total
    ncgo            int32         // number of cgo calls currently in progress
    cgoCallersUse   atomic.Uint32 // if non-zero, cgoCallers in use temporarily
    cgoCallers      *cgoCallers   // cgo traceback if crashing in cgo call
    park            note
    alllink         *m // on allm
    schedlink       muintptr
    lockedg         guintptr
    createstack     [32]uintptr // stack that created this thread, it's used for StackRecord.Stack0, so it must align with it.
    lockedExt       uint32      // tracking for external LockOSThread
    lockedInt       uint32      // tracking for internal lockOSThread
    mWaitList       mWaitList   // list of runtime lock waiters

    mLockProfile mLockProfile // fields relating to runtime.lock contention
    profStack    []uintptr    // used for memory/block/mutex stack traces

    // wait* are used to carry arguments from gopark into park_m, because
    // there's no stack to put them on. That is their sole purpose.
    waitunlockf          func(*g, unsafe.Pointer) bool
    waitlock             unsafe.Pointer
    waitTraceSkip        int
    waitTraceBlockReason traceBlockReason

    syscalltick uint32
    freelink    *m // on sched.freem
    trace       mTraceState

    // these are here because they are too large to be on the stack
    // of low-level NOSPLIT functions.
    libcall    libcall
    libcallpc  uintptr // for cpu profiler
    libcallsp  uintptr
    libcallg   guintptr
    winsyscall winlibcall // stores syscall parameters on windows

    vdsoSP uintptr // SP for traceback while in VDSO call (0 if not in call)
    vdsoPC uintptr // PC for traceback while in VDSO call

    // preemptGen counts the number of completed preemption
    // signals. This is used to detect when a preemption is
    // requested, but fails.
    preemptGen atomic.Uint32

    // Whether this is a pending preemption signal on this M.
    signalPending atomic.Uint32

    // pcvalue lookup cache
    pcvalueCache pcvalueCache

    dlogPerM

    mOS

    chacha8   chacha8rand.State
    cheaprand uint64

    // Up to 10 locks held by this m, maintained by the lock ranking code.
    locksHeldLen int
    locksHeld    [10]heldLockInfo

    // ...
}
```

---

*本文记录了从实际代码 CR 中引发的对 Go 语言 GMP 模型的学习和思考，从 goroutine 的生命周期到 G、M 结构体的深入分析。*
