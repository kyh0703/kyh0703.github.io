---
published: true
title: "golang - slices package"
categories:
  - GoLang
tags:
  - [golang]
toc: true
toc_sticky: true
date: "2024-01-15 09:00"

---

golang에서 `slice`를 삭제하기 위해서는 예전에는 인덱스 위치를 직접 옮겨줘야 되었습니다.

최근 golang `1.21`버전에는 `slices` 패키지를 도입함에 따라 조금 더 유연하게 사용할 수 있게 되었습니다.

#### AS-IS

```go
// You can edit this code!
// Click here and start typing.
package main

import (
	"fmt"
)

func main() {
	listeners := []string{"1", "2", "3", "4"}

	fmt.Println(listeners)
	length := len(listeners)
	for i, listener := range listeners {
		if listener == "2" {
			listeners[length-1], listeners[i] = listeners[i], listeners[length-1]
			listeners = listeners[:length-1]
			break
		}
	}
	fmt.Println(listeners)
}

```

#### TO-BE

```go
// You can edit this code!
// Click here and start typing.
package main

import (
	"fmt"
	"slices"
)

func main() {
	listeners := []string{"1", "2", "3", "4"}

	fmt.Println(listeners)
	for i, listener := range listeners {
		if listener == "3" {
			listeners = slices.Delete(listeners, i, i+1)
		}
	}
	fmt.Println(listeners)
}

```

