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

  모든 쓰레드가 잠들어있거나 대기하는 상황
* 라이브락

  프로그램들이 활동적으로 동시에 연산을 수행하고는 있지만 이연산들이 실제로 프로그램의 상태를 진행시키는데 아무런 영향을 줄 수 없을 때

* 기아상태

​		한프로세스가 다른 프로세스의 비해 많은 자원을 점유할 때

* 동시실행 안정성 판단
  * 누가 동시성을 책임지는가?
  * 누가 동기화를 책임지는가?
  * 문제 공간은 동시성 기본요인에 어떻게 매핑되는가?
