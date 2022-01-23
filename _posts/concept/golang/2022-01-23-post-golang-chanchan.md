---
title: "golang - chan chan"
categories:
  - GoLang
tags:
  - [golang, chan chan, chan]
toc: true
toc_sticky: true
date: "2022-01-23 16:00"
---

### chan chan

golang에 오픈소스들을 확인하다 보면 chan에 chan을 보내는 형태를 확인하실 수 있습니다. 어떻게 go의 채널을 더 잘 활용 할 수 있을까요?

### chan과의 차이점

* chan
  * 채널에 데이터를 전송
* chan chan
  * 소비자가 생성자에게 채널을 전달하며, 생성자는 소비자가 보내준 채널로 데이터를 전송

#### 예제

```go
package main

import (
	"context"
	"log"
	"sync"
	"time"
)

var wg sync.WaitGroup

func consumer(ctx context.Context, reqCh chan chan string) {
	defer wg.Done()

	log.Print("consumer make chan")
	repCh := make(chan string)
	defer close(repCh)

	// proc init
	time.Sleep(time.Second)

	log.Print("consumer send chan")
	reqCh <- repCh

	for {
		select {
		case msg := <-repCh:
			log.Print(msg)
		case <-ctx.Done():
			log.Print("close consumer")
			return
		}
	}
}

func producer(ctx context.Context, reqCh chan chan string) {
	defer wg.Done()
	log.Print("producer wait chan")
	repCh := <-reqCh
	repCh <- "hihihihi"
}

func main() {
	ctx, _ := context.WithTimeout(context.Background(), time.Second*3)
	reqCh := make(chan chan string)

	wg.Add(1)
	go consumer(ctx, reqCh)
	wg.Add(1)
	go producer(ctx, reqCh)

	wg.Wait()
	close(reqCh)
}

```

제가 임의로 공부하기 위해서 작성했던 코드입니다. 코드를 보시면 ``chan chan``을 생성 후 소비자는 메시지를 받을 채널을 생성 후 생성자에게 전달하여 생성자가 보내준 채널을 통하여 데이터를 전달함을 볼 수 있습니다.

#### 어디에 쓸까요?

이더리움소스에서 확인했을 때 아래와 같은 경우에 사용하는 것을 볼 수 있습니다.

* 종료 및 에러 처리
* 전송 처리

```go
type Manager struct {
	config      *Config                    // Global account manager configurations
	backends    map[reflect.Type][]Backend // Index of backends currently registered
	updaters    []event.Subscription       // Wallet update subscriptions for all backends
	updates     chan WalletEvent           // Subscription sink for backend wallet changes
	newBackends chan newBackendEvent       // Incoming backends to be tracked by the manager
	wallets     []Wallet                   // Cache of all wallets from all registered backends

	feed event.Feed // Wallet feed notifying of arrivals/departures

	quit chan chan error
	term chan struct{} // Channel is closed upon termination of the update loop
	lock sync.RWMutex
}

// Close terminates the account manager's internal notification processes.
func (am *Manager) Close() error {
	errc := make(chan error)
	am.quit <- errc
	return <-errc
    
}

.
.
.
func (w *wallet) Close() error {
    // Terminate the self-derivations
    var derr error
    if dQuit != nil {
        errc := make(chan error)
        dQuit <- errc
        derr = <-errc // Save for later, we *must* close the USB
    }
}
```

### 마치며

이더리움 소스를 보며 늘 많이 배워갑니다:grinning:

