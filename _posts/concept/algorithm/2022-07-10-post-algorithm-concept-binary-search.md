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

#### **Parametric Search**

최적화 문제를 결정 문제로 바꿔서 이진탐색으로 푸는 방법

* 매개변수 `Parameter`가 주어지면 true or false가 결정되어야 한다.
* 가능한 해의 영역이 연속적이어야 한다.
* 범위를 반씩 줄여가면서 가운데 값이 true인지 false인지 구한다.
* 이진탐색과 똑같은 원리

**최적화 문제?**

문제 상황을 만족하는 변수의 최솟값, 최댓값을 구하는 문제

**결정문제?**

YES/No Problem

> Q. 수강생들의 외모값과 커플/솔로 여부가 주어진다.
>
> 커플들은 솔로들보다 외모값이 높다
>
> 외모값이 최소 몇 이상일 때 부터 커플인가?
>
> > 선형탐색으로 풀면 하나하나씩 비교하면서 찾아야되지만 이분탐색으로 가운대 값부터 비교하면서 줄여간다.

