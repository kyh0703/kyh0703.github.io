---
title: "프로그래머스 (스택/큐)4 - 주식가격"
categories:
  - Programmers
tags:
  - [programmers, queue, c++]
toc: true
toc_sticky: true
date: "2021-09-25 14:00"
last_modified_at: 2021-09-25T14:00:00.540Zs
---

#### 문제

초 단위로 기록된 주식가격이 담긴 배열 prices가 매개변수로 주어질 때, 가격이 떨어지지 않은 기간은 몇 초인지를 return 하도록 solution 함수를 완성하세요.

##### 제한사항

- prices의 각 가격은 1 이상 10,000 이하인 자연수입니다.
- prices의 길이는 2 이상 100,000 이하입니다.

##### 입출력 예

| prices          | return          |
| --------------- | --------------- |
| [1, 2, 3, 2, 3] | [4, 3, 1, 1, 0] |

##### 입출력 예 설명

- 1초 시점의 ₩1은 끝까지 가격이 떨어지지 않았습니다.
- 2초 시점의 ₩2은 끝까지 가격이 떨어지지 않았습니다.
- 3초 시점의 ₩3은 1초뒤에 가격이 떨어집니다. 따라서 1초간 가격이 떨어지지 않은 것으로 봅니다.
- 4초 시점의 ₩2은 1초간 가격이 떨어지지 않았습니다.
- 5초 시점의 ₩3은 0초간 가격이 떨어지지 않았습니다.

※ 공지 - 2019년 2월 28일 지문이 리뉴얼되었습니다.

#### C++

* vector만 사용

```c++
#include <string>
#include <vector>
#include <queue>

using namespace std;

vector<int> solution(vector<int> prices)
{
    vector<int> answer;
    for (size_t i = 0; i < prices.size() - 1; i++)
    {
        int index = -1;
        for (size_t j = i + 1; j < prices.size(); j++)
        {
            if (prices[j] < prices[i])
            {
                index = j;
                break;
            }
        }
        if (index == -1)
            answer.push_back(prices.size() - 1 - i);
        else
            answer.push_back(index - i);
    }
    answer.push_back(0);
    return answer;
}
```

#### 마치며

일단 이 문제는 풀다가 안되서 포기했다. 이유는 문제를 잘못 이해하고 있었다. 내가 지문 독해력이 떨어지나 열받는 문제다... "3초 시점의 ₩3은 1초뒤에 가격이 떨어집니다. 따라서 1초간 가격이 떨어지지 않은 것으로 봅니다." 위에 문구는 한번이라도 떨어지면 1초라는 얘기이다. 나는 떨어졌다 올라오면 그 시간까지 더해야 되는줄 알고 문제를 잘못 풀고 있었다. 원 지문은 더 보기힘들었다 문제 이해하는데만 시간 다 쏟았는데 출처가 어딜까 진짜..