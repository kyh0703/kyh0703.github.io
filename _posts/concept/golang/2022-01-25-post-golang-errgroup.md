---
title: "golang - errgroup"
categories:
  - GoLang
tags:
  - [golang, errgroup, goroutine]
toc: true
toc_sticky: true
date: "2022-01-25 16:00"
---

### errgroup

goroutine을 제어하기 위해 다양한 방법들이 있습니다. 오늘은 `errgroup`에 대해 내용을 정리해봅니다.

#### waitGroup

```go
var wg sync.WaitGroup

wg.Add(1) // goroutine 추가
go func() {
    defer wg.Done() // 종료됨을 알림
    test1()
}

wg.Wait() // 종료를 기다림
```

#### errgroup

제가 `errgroup`을 사용하면서 기대했던 이벤트는 여러 goroutine을 생성하여 사용 중 하나가 error가 되면 전체 goroutine을 종료시킵니다.

#### 차이점

* `waitGroup`에 사용되는 `Add, Del`로 조정할 필요가 없음
* `error` 발생 시 확인 가능
* `error` 발생 시 고루틴 종료

#### 예제 (외부 context사용)

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/opentracing/opentracing-go/log"
	"golang.org/x/sync/errgroup"
)

func test1(ctx context.Context) error {
	timer := time.NewTimer(time.Second * 5)
	select {
	case <-timer.C:
		fmt.Println("test1 timer")
		return nil
	case <-ctx.Done():
		fmt.Println("test1 cancel")
		return ctx.Err()
	}
}

func test2(ctx context.Context) error {
	timer := time.NewTimer(time.Second * 2)
	select {
	case <-timer.C:
		// TEST2: go routine 내부에서 에러 발생
		// TEST2: context=> test1이 종료되지않는다.
		fmt.Println("test2 timer")
		fmt.Println("Occur error test2")
		return errors.New("error test2")
	case <-ctx.Done():
		fmt.Println("test2 cancel")
		return ctx.Err()
	}
}

func main() {
	ctx, _ := context.WithCancel(context.Background())
	errGrp, _ := errgroup.WithContext(ctx)

	errGrp.Go(func() error { return test1(ctx) })
	errGrp.Go(func() error { return test2(ctx) })

    // TEST(1): 넘겨준 context cancel 발생시 처리
    // TEST(1) RESULT: go routine 2개 종료

	// timer := time.NewTimer(time.Second * 2)
	// <-timer.C
	// cancel()

	if err := errGrp.Wait(); err != nil {
		log.Error(err)
	}
}
```

* 외부에서 생성한 ``context``를 전달하여 `cancel`호출 시 종료되는가? **예**

* `goroutine` 에 에러 발생시 다른 `goroutine`이 종료되는가? **아니오**

#### 예제 (errgroup context사용)

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/opentracing/opentracing-go/log"
	"golang.org/x/sync/errgroup"
)

func test1(ctx context.Context) error {
	timer := time.NewTimer(time.Second * 5)
	select {
	case <-timer.C:
		fmt.Println("test1 timer")
		return nil
	case <-ctx.Done():
		fmt.Println("test1 cancel")
		return ctx.Err()
	}
}

func test2(ctx context.Context) error {
	timer := time.NewTimer(time.Second * 2)
	select {
	case <-timer.C:
		fmt.Println("test2 timer")
		fmt.Println("Occur error test2")
		return errors.New("error test2")
	case <-ctx.Done():
		fmt.Println("test2 cancel")
		return ctx.Err()
	}
}

func main() {
	ctx, _ := context.WithCancel(context.Background())
	errGrp, errCtx := errgroup.WithContext(ctx)

	errGrp.Go(func() error { return test1(errCtx) })
	errGrp.Go(func() error { return test2(errCtx) })

	if err := errGrp.Wait(); err != nil {
		log.Error(err)
	}
}
```

* `errgroup` 생성 시 만들어진 `context`를 가지고 전달하면 에러시 다른 고루틴이 종료되는가? **예**

### 마치며

제가 생각했던 `errgroup`에 기능을 구현하기 위해서는 `errgroup` 생성시에 `context`를 넘겨주어야 가능한 것을 확인 할 수 있었습니다:hugs:
