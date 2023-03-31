---
published: true
title: "golang - test-framework"
categories:
  - GoLang
tags:
  - [golang, ginkgo]
toc: true
toc_sticky: true
date: "2023-03-31 09:00"
---

`golang`에서 오픈소스들을 보다 보면 go언어에 자유로움으로 인해 각기 다른 테스트 프레임워크를 사용합니다. 

`golang`에서는 대체로 다음과 같이 테스트 프레임워크를 사용합니다.

* Go Standard testing package
* Testify
* GoConvey
* ginkgo
* goblin

저는  `ginkgo`가 마음에 들어서 사용하고 있습니다.

[ginkgo문서](https://onsi.github.io/ginkgo/)

필요한 패키지들을 다운 받고 먼저 테스트 할 디렉토리에서 아래 명령어를 입력하여 줍니다!

```bash
$ ginkgo bootstrap
```

그러면 아래와 같이 파일이 하나 생기게 되는데요.

![image-20230331102117627](../../../assets/images/posts/2023-03-31-post-golang-test-framework/image-20230331102117627.png)

파일을 열어보면 다음과 같이 구성되어 있습니다.

```go
package service_test

import (
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func TestService(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Service Suite")
}
```

해당 파일에 테스트 코드를 기술하는 방식이 있고, 아니면 `generate`명령을 통해 테스트 파일을 하나 더 생성 할 수 있습니다.

이 문서에서는 해당 testfile을 생성합니다.

```bash
$ ginkgo generate transaction_service
```

```bash
package service_test

import (
	"context"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
	
	...
)

var _ = Describe("TransactionService", func() {
	It("DidCallTx - normal", func() {
		By("initialize variable")
		var (
			callsSvcMock     = new(CallsServiceMock)
			numberSvcMock    = new(NumberServiceMock)
			endpointRepoMock = new(EndpointRepositoryMock)
			txService        = service.ProvideTransactionService(
				nil,              // rpc.Rpc
				callsSvcMock,     // calls.Service
				numberSvcMock,    // number.Service
				endpointRepoMock, // endpoint.Repository
			)
			req = &callpb.DidCallRequest{
				CallId: "1",
				ConnId: "leg1",
			}
		)

		By("verify DidCallTx error")
		txdata, err := txService.DidCallTx(context.Background(), req)
		Expect(err).NotTo(HaveOccurred())

		By("verify DidCallTx call")
		call := txdata.FirstCall
		Expect(call.ID).To(Equal("1"))
		Expect(call.CallType).To(Equal(string(ievent.CallTypeNormal)))
		Expect(call.Seq).To(Equal(1))
		Expect(call.Category).To(Equal(string(ievent.CategoryIn)))
		Expect(call.Event.Reason).To(Equal(string(ievent.ReasonCodeNormal)))
		Expect(call.Route.DNIS).To(Equal("7777"))
		Expect(call.Route.Site).To(Equal("site1"))
	})
)
```

`Describe, It, BeforeEach` 등 많은 키워드를 제공합니다.  `gingo watch` 명령어를 통해서 `jest`와 같이 모니터링 하며 코드를 작성 할 수도 있습니다.

#### 결과

![image-20230331113807415](../../../assets/images/posts/2023-03-31-post-golang-test-framework/image-20230331113807415.png)
