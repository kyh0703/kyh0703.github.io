---
published: true
title: "알고리즘 - 이분탐색"
categories:
  - Algorithm
tags:
  - [algorithm, binarysearch]
toc: true
toc_sticky: true
date: "2022-07-10 19:00"
---

## 이분탐색

퀵 정렬과 비슷하게 가운데 값을 기준으로 있는 구간을 찾아내는 기법

* 정렬이 되어 있어야 한다.
* 살펴보는 범위를 절반 씩 줄여가면서 답을 찾는다.

**c++ lower/upper_bound**

```c++
#include <algorithsm>

vector<int> v = {0, 1, 3, 3, 6, 6, 7, 8, 8, 9};
int three = upper_bound(v.begin(), v.end(), 3) - lower_bound(v.begin(), v.end(), 3);
int four = upper_bound(v.begin(), v.end(), 4) - lower_bound(v.begin(), v.end(), 4);
int six = upper_bound(v.begin(), v.end(), 6) - lower_bound(v.begin(), v.end(), 6);
print("%d\n", three); // 2
print("%d\n", four); // 0
print("%d\n", six); // 3

// upper_bound는 지정한 값보다 초과했을 때 최소 값
// lower_bound는 지정한 값을 포함한 작은 수중 제일 먼저 만나는 값
// upper - lower는 지정 한 값이 몇 개인지 찾을 수 있음
```

**python bisect_left, bisect-right**

```python
from bisect import bisect_left, bisect_right

v = (0, 1, 3, 3, 6, 6, 6, 7, 8, 8, 9)
three = bisect_right(v, 3) - bisect_left(v, 3)
four = bisect_right(v, 4) - bisect_left(v, 4)
six = bisect_right(v, 6) - bisect_left(v, 6)
print(f'number of 3: {three}')
print(f'number of 4: {four}')
print(f'number of 6: {six}')
```



