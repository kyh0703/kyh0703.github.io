---
published: true
title:  "python basic tip"
categories:
  - Tip
tags:
  - [tip, python]
toc: true
toc_sticky: true
date: "2022-07-08 10:00"
---

#### 알파벳 출력

**AS_IS**

```python
answer = 'abcdefghijk (편의상 생략)'
```

**TO_BE**

```python
import string 

string.ascii_lowercase # 소문자 abcdefghijklmnopqrstuvwxyz
string.ascii_uppercase # 대문자 ABCDEFGHIJKLMNOPQRSTUVWXYZ
string.ascii_letters # 대소문자 모두 abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
string.digits # 숫자 0123456789
```

#### 2차원 리스트 뒤집기

**AS-IS**

```python
mylist = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
new_list = [[], [], []]

for i in range(len(mylist)):
    for j in range(len(mylist[i])):
        new_list[i].append(mylist[j][i])
```

**TO-BE**

```python
mylist = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
new_list = list(map(list, zip(*mylist)))
```

#### i번째 원소와 i+1번째 원소 - zip

**AS-IS**

```python
def solution(mylist):
    answer = []
    for i in range(len(mylist)-1):
        answer.append(abs(mylist[i] - mylist[i+1]))
    return answer
```

**TO-BE**

```python
def solution(mylist):
    answer = []
    for number1, number2 in zip(mylist, mylist[1:]):
        answer.append(abs(number1 - number2))
    return answer
```

#### 모든 멤버의 type 변환하기 - map

**AS-IS**

```python
list1 = ['1', '100', '33']
list2 = []
for value in list1:
    list2.append(int(value))
```

**TO-BE**

```python
list1 = ['1', '100', '33']
list2 = list(map(int, list1))
```

#### sequence 멤버를 하나로 이어붙이기 - join

```python
my_list = ['1', '100', '33']
answer = ''.join(my_list)
```

#### 곱집합(Cartesian product) 구하기 - product

**AS-IS**

```python
iterable1 = 'ABCD'
iterable2 = 'xy'
iterable3 = '1234'

for value1 in iterable1:
    for value2 in iterable2:
        for value3 in iterable3:
            print(value1, value2, value3)
```

**TO-BE**

```py
import itertools

iterable1 = 'ABCD'
iterable2 = 'xy'
iterable3 = '1234'
print(list(itertools.product(iterable1, iterable2, iterable3)))
```



