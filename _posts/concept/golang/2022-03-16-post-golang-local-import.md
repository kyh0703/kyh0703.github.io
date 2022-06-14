---
published: true
title: "golang - local 패키지 import"
categories:
  - GoLang
tags:
  - [golang, import]
toc: true
toc_sticky: true
date: "2022-03-16 12:00"
---

go로 개발하다보면 로컬 패키지를 `import`하여 개발을 할 상황이 생깁니다. 로컬 패키지를 어떻게 `import` 할 수 있는지 정리했습니다.:happy:

방법은 3가지로 나눌 수 있습니다!

* go get
* 로컬 디렉토리 mod 파일 생성 후 import
* 로컬 디렉토리 import

각 상황 별 디렉토리 구조 및 환경을 알아봅니다.

### go get

특별한 방법처럼 적어두었지만 `github` 패키지를 가져오는 것과 다를 바 없습니다. 로컬에서 패키지를 `go get`으로 가져올 수 있다면, 해당 구조로 `import`를 할 수 있습니다. 

```go
pakcage main

package main

import (
    "encoding/json"
    "log"
    "net/http"
    "sort"
    "strconv"

    "gitlab.com/cloud/test"
)

func main() {
    mux := test.Tester()
    ...
}
```

### 로컬 디렉토리 mod 파일 생성 후 import

* directory

```bash
├── clog
│   ├── test
│       ├── go.mod
│       ├── test.go
│   ├── go.mod
│   └── log.go
├── go.mod
├── go.sum
├── main.go
```

* go.mod

```go
module github.com/kyh0703/tester

go 1.17

replace (
    clog => /clog
    test => /clog/test
)

require (
    clog v0.0.0-00010101000000-000000000000
    test v0.0.0-00010101000000-000000000000
)
```

* main.go

```go
package main

import (
    "clog"
)

func main() {
    clog.FATAL("error!")
}
```

디렉토리를 보시면 로컬 패키지마다 `go mod init {패키지명}`으로 `go.mod`파일을 생성 후 `go.mod`파일에서 `replace` 키워드를 통해 로컬 디렉토리를 지정할 수 있습니다. 

### 로컬 디렉토리 import

* directory

```bash
├── clog
│   ├── test
│       ├── test.go
│       ├── go.mod
│   └── log.go
│   └── go.mod
├── go.mod
├── go.sum
├── main.go
```

* go.mod

```go
module github.com/kyh0703/tester

go 1.17

replace (
    github.com/kyh0703/tester/clog => /clog
    github.com/kyh0703/tester/test => /clog/test
)

require (
    clog v0.0.0-00010101000000-000000000000
    test v0.0.0-00010101000000-000000000000
)
```

* main.go

```go
package main

import (
    "github.com/kyh0703/tester/clog"
)

func main() {
    clog.FATAL("error!")
}
```

위에 방법과 비슷한 방법이지만 따로 `go.mod`파일을 생성할 필요가 없습니다. 이 방법으로 저는 로컬 패키지를 `import`하여 사용하고 있습니다. 

### 마치며

다들 즐거운 코딩 하시기 바랍니다 👍
