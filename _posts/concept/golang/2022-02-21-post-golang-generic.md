---
title: "golang - generic"
categories:
  - GoLang
tags:
  - [golang, generic]
toc: true
toc_sticky: true
date: "2022-02-21 16:00"
---

### generic

golang에서 generic에 대해 많은 피드백을 받은 결과로 조금 있으면 generic이 1.18버전에 포함되어 배포됩니다:smile:

미리 사용법을 알아보는 시간을 가져볼려고 합니다.

#### go generic 왜 필요한데?

자바나 c++을 기존에 사용하시던 분들은 generic에 익숙하실 내용입니다. go 개발자들은 예전부터 제네릭과 관련하여 많은 요청을 하였습니다. 왜 그럴까요?

#### 문제점

```go
package main

func printTest(a int) {
    fmt.Println(a)
}

func main() {
    var a int = 10
    printTest(a) // 성공  
    var ab int16 = 20
    printTest(a) // 실패
    var a string = "20"
    printTest(a) // 실패
}
```

위에 코드에서 문제점이 보이시나요? `printTest`는 인트형으로 되어있기에 int밖에 넣어주지 못합니다. 물론! int()로 형변환해서 넣어줄수도 있지요!

하지만 string이라면 가능할까요? 따라서 각 형과 관련된 func들을 직접 하나하나 만들어 줄 수 밖에 없었습니다. 

#### interface{} 로 해결하면 되지않을까?

generic이 없던 go 개발자들은 interface{}를 활용하여 여러 타입의 변수들을 사용할 수 있었습니다.

```go
package main

func sumTest(a, b interface) {
    switch a.(type) {
    case int:
    case int:...
    }
}

func main() {
    var a int = 10
    var b int16 = 20
    sumTest(a, b)
}
```

음... 딱 봐도 많이 불편하네요... 

#### 사용법

```go
package main

func sumTest[T any](a, b T) T { 
    if a < b {
        return a
    }
    return b
}

func main() {
    var a int = 10
    var b int16 = 20
    sumTest(a, b)
}
```

그래서 c++과 같이 generic을 다음과 같이 넣었습니다. go에서는 새로운 키워드 자체를 넣는것을 굉장히 지양합니다. 그래서 삼항연산자부터 while문까지 중복된 기능을 하는 키워드들을 넣지 않습니다. generic이 배포되면서 `any`타입이라는게 생겼는데요. 모든 타입을 넣어줄 수 있습니다. 하지만 go에서는 연산이 안되는 타입들의 경우에는 직접 지정을 해줘야 될 필요가 있습니다.

```go
package main

// 1번 방법 hard coding
func sumTest[T int|int16|int32|int64](a, b T) T { 
    if a < b {
        return a
    }
    return b
}

// 2번 방법 interface 
type Integer interface {
	int|int16|int32|int64
}

func sumTest[T Interger](a, b T) T { 
    if a < b {
        return a
    }
    return b
}

// 3번 방법 package
import "golang.org/x/exp/constraints"

func sumText[T constraints.Ordered](a, b T) T {
    if a < b {
        return a
    }
    return b
}
```

사용법은 위와 같습니다. go는 키워드를 생성하는걸 굉장히 싫어하기 때문에 기존에 있던 interface를 다음과 같이 형을 지정하여 사용할 수 있습니다. 또한 저런 형들을 모아둔 interface를 따로 타입으로 분리시킨 package를 사용할 수 있습니다.

> https://pkg.go.dev/golang.org/x/exp/constraints

#### 추가내용

```go
// https://pkg.go.dev/golang.org/x/exp/constraints

type Signed interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}
```

타입들을 모아둔 constraints패키지를 보면 `~` 기호를 통해 정의 한 것을 확인 할 수 있습니다.

저건 뭘까요? 문서를 보면 1.18버전에 추가된 것을 확인 할 수 있는데요.

> - The new token `~` has been added to the set of [operators and punctuation](https://tip.golang.org/ref/spec#Operators_and_punctuation).

내용을 보니 golang의 경우 type을 재지정하여 사용하는 경우가 있는데 재지정한 타입까지 포함하여 사용할 수 있게 새롭게 추가된 토큰이라고 합니다.  타입을 재정의 할 경우 타입은 같으나 정의가 다를경우 에러가 발생하는데 앞으로는 `~` 을 사용하여 지정하면 같은 타입이면 상관없이 사용 할 수 있게 변경되었습니다.

```go
type JoinType int

// Join Type도 지정가능
type Signed interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

// 아래와 같이 형이 지정된 interface도 가능
type Test interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
    Test() string
}

func testPrint[T Test](a T) {
    a.Test()
}
```

### 마치며

1.18버전부터 go는 다양하게 변경될 것을 확인할 수 있었습니다. go언어 개발진에서도 goper들에게 많은 피드백을 원하며, 실제로 반영되는게 보기 좋습니다. 공용라이브러리나 좀 더 진화된 코드를 짤 수 있게 변하여 좋네요:hugs:
