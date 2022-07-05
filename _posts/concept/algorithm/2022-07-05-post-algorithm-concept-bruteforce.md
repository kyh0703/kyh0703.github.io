---
published: true
title: "알고리즘 - 브루트포스"
categories:
  - Algorithm
tags:
  - [algorithm, dfs, bfs]
toc: true
toc_sticky: true
date: "2022-07-05 21:00"
---

## 브루트포스

모든 문자열을 하나 씩 대입하여 처리하는 암호학에서 쓰는 알고리즘

**permuations**

```python
from itertools import permutations

v = [0, 1, 2, 3]

for i in combinations(v, 4):
    print(i)
```

**combinations**

```python
from itertools import combinations

v = [0, 1, 2, 3]

for i in combinations(v, 2):
    print(i)
```

