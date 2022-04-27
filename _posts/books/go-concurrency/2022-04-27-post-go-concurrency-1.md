---
title: "GO 동시성 프로그래밍- 1"
categories:
  - Books
tags:
  - [book, go, concurrency]
toc: true
toc_sticky: true
date: "2022-04-27 17:00"
---

#### 1장 동시성 소개

`무어의 법칙`은 발열과 경제성 문제로 한계가 드러나며, 이를 극복하기 위해 `멀티 코어 프로세서`가 등장하였다. 소프트웨어의 속도 개선을 위해선 동시성 프로그래밍이 필요하다.

**동시성이 어려운 이유**

* 레이스 컨디션

```go
var data int
go func() {
    data++
}()

if data == 0 {
    fmt.Println("the value is %v\n", data)
}
# 결과
# 1. 아무것도 출력되지 않음
# 2. the value is 0
# 3. the value is 1
```

위에 결과가 나오는 것은 `go`문을 위에 썼다고 먼저 실행될거라 기대하는 프로그래머의 생각이다. 해당 문제를 해결하기 위해 `time.Sleep()`을 주는 것은 잘못된 행동이다.

* 원자성

원자성은 특정 실행 컨텍스트에서 더 이상 나눌 수 없는 연산을 얘기함.

따라서 같은 메모리를 사용하면 원자적이지 않다고 할 수 있다.

> i 값을 다른 고루틴들에게 노출하지 않는 고루틴의 컨텍스트인 경우 원자적이다.
>
> 동시에 수행되는 프로세스들이 없는 프로그램의 컨텍스트라면 원자적이다.

* 메모리 접근 동기화

```go
package main

import "fmt"

func main() {
    var value int
    go func() {
        value++
    }()
    if value == 0 {
        fmt.Println("the value is 0")
    } else {
        fmt.Println("the value is ", value)
    }
}
```

결과를 예측 할 수 없음

```go
package main

import (
	"fmt"
    "sync"
)

func main() {
    var (
        memoryAccess sync.Mutext
        value int
    )
    go func() {
        memoryAccess.Lock()
        value++
        memoryAccess.UnLock()
    }()
    memoryAccess.Lock()
    if value == 0 {
        fmt.Println("the value is 0")
    } else {
        fmt.Println("the value is ", value)
    }
    memoryAccess.UnLock()
}
```

Lock으로 자원의 접근을 막았지만 레이스 컨디션을 막을 수 없어 결과는 동일함

`sync.atomic`이라는 원자성 카운터 기능 제공

* 데드락
* 라이브락
* 기아상태
* 동시실행 안정성 판단

**동시성과 병렬성의 차이**

동시성은 코드의 속성이고, 병렬 처리는 실행 중인 프로그램의 속성이다.

> 코드를 짤 때 동시성을 생각하며 설계하고 구성하지만 실제로 동작하는 것은 CPU이기에 병렬로 처리될지는 프로세스 및 환경에서 결정된다.
