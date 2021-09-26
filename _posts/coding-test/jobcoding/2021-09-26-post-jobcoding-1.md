---
title: "이것이 취업을 위한 코딩테스트다 - 그리디"
categories:
  - Jobcoding
tags:
  - [jobcoding, c++]
date: "2021-09-26 17:00"
last_modified_at: 2021-09-25T17:00:00.540Zs
---

### 거스름돈

#### 문제

당신은 음석점의 계산을 도와주는 점원이다. 카운터에는 거스름 돈으로 사용할 500원, 100원, 50원, 10원짜리 동전이 무한히 존재한다고 가정한다. 손님에게 거슬러 줘야 할 돈이 N원일 때 거슬러줘야 할 동전의 최소 개수를 구하라. 단, 거슬러 줘야 할 돈 N은 항상 10의 배수이다.

#### C++

```c++
#include <string>
#include <vector>

vector<int> solution(int money)
{
    vector<int> answer;
    vector<int> coin_type = {500, 100, 50, 10};

    for (int coin : coin_type)
    {
        int count = money / coin;
        money %= coin;
        answer.push_back(count);
    }

    return answer;
}
```

### 큰 수의 법칙

#### 문제

동빈이의 큰 수의 법칙은 다양한 수로 이루어진 배열이 있을 때 주어진 수들을 M번 더하여 가장 큰수를 만드는 법칙이다. 단, 배열의 특정한 인덱스(번호)에 해당하는 수가 연속해서 K번을 초과하여 더해질 수 없는 것이 이 법칙의 특징이다.

예를 들어 순서대로 2, 4, 5, 4, 6으로 이루어진 배열이 있을때 M이 8이고, K가 3이라고 가정하다. 이 경우 특정한 인덱스의 수가 연속해서 세 번까지만 더해질 수 있으므로 큰 수의 법칙에 따른 결과는 6 + 6 + 6 + 5 +6 + 6 +6 + 5인 46이 된다.

단 서로 다른 인덱스에 해당하는 수가 같은 경우에도 서로 다른 것으로 간주한다. 예를 들어 순서대로 3, 4, 3, 4, 3으로 이루어진 배열이 있을 때 M이 7이고, K가 2라고 가정하자. 이 경우 두 번째 원소에 해당하는 4와 네번째 원소에 해당하는 4를 번갈아 두 번씩 더하는 것이 가능핟. 결과적으로 4 + 4 + 4 +4 +4 +4 +4인 28이 도출된다.

배열의 크기 N, 숫자가 더해지는 횟수 M, 그리고 K가 주어질 떄 동빈이의 큰 수의 법칙에 따른 결과를 출력하시오.

#### C++

```c++
int solution(int n, int m, int k, vector<int> array)
{
    int answer = 0;
    int max_index = array.size() - 1;
    sort(array.begin(), array.end());

    for (int i = 1; i <= m; i++)
    {
        if (i % k == 0)
        {
            answer += array[max_index - 1];
            continue;
        }
        answer += array[max_index];
    }

    return answer;
}
```

#### 