---
published: true
title: "알고리즘 - 동적계획법"
categories:
  - Algorithm
tags:
  - [algorithm, dynamic-programming]
toc: true
toc_sticky: true
date: "2022-07-11 8:00"
---

## 동적계획법

문제를 쪼개서 `작은 문제의 답`을 구하고, 그걸로 더 `큰 문제의 답`을 구하는 걸 반복

* 분할 정복
* 부분 문제들의 답을 `cache`에 저장

#### Top-Down

* 재귀로 구현
* 메모이제이션(Memoization)
* Lazy-Evaluation: 필요한 문제들의 답만 구한다.

#### Bottom-Up

* 반복문으로 구현
* 타뷸레이션(Tabulation)
* 미리 문제들의 답을 구한다. 
* Eager-Evaluation: 필요 없는 부분 문제들까지 전부 구함

#### 예시 - 피보나치수열

**Basic**

```python
# 기존 피보나치 수열을 구하는 문제이다. 재귀로 이미 구한 답이여도 계속 재귀를 호출함
def f(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    return f(n - 1) + f(n - 2)
```

**TopDown**

```python
cache=[-1] * 91
cache[0] = 0
cache[1] = 1

def f(n):
    if cache[n] == -1
        cache[n] = f(n - 1) + f(n - 2)
    return cache[n]
```

**BottomUp**

```python
cache = [-1] * 91
cache[0] = 0
cache[1] = 1

for i in range(2, N + 1):
    cache[n] = cache[n - 1] + cache[n + 1]
    
print(cache[N])
```
