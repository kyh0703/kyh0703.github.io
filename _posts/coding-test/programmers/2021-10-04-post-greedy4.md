---
title: "프로그래머스 그리디 - 구명보트"
categories:
  - Programmers
tags:
  - [programmers, heap, c++]
toc: true
toc_sticky: true
date: "2021-10-04 18:00"
last_modified_at: 2021-10-04T18:00:00.540Zs
---

#### 문제

무인도에 갇힌 사람들을 구명보트를 이용하여 구출하려고 합니다. 구명보트는 작아서 한 번에 최대 **2명**씩 밖에 탈 수 없고, 무게 제한도 있습니다.

예를 들어, 사람들의 몸무게가 [70kg, 50kg, 80kg, 50kg]이고 구명보트의 무게 제한이 100kg이라면 2번째 사람과 4번째 사람은 같이 탈 수 있지만 1번째 사람과 3번째 사람의 무게의 합은 150kg이므로 구명보트의 무게 제한을 초과하여 같이 탈 수 없습니다.

구명보트를 최대한 적게 사용하여 모든 사람을 구출하려고 합니다.

사람들의 몸무게를 담은 배열 people과 구명보트의 무게 제한 limit가 매개변수로 주어질 때, 모든 사람을 구출하기 위해 필요한 구명보트 개수의 최솟값을 return 하도록 solution 함수를 작성해주세요.

##### 제한사항

- 무인도에 갇힌 사람은 1명 이상 50,000명 이하입니다.
- 각 사람의 몸무게는 40kg 이상 240kg 이하입니다.
- 구명보트의 무게 제한은 40kg 이상 240kg 이하입니다.
- 구명보트의 무게 제한은 항상 사람들의 몸무게 중 최댓값보다 크게 주어지므로 사람들을 구출할 수 없는 경우는 없습니다.

##### 입출력 예

| people           | limit | return |
| ---------------- | ----- | ------ |
| [70, 50, 80, 50] | 100   | 3      |
| [70, 80, 50]     | 100   | 3      |

#### C++

```c++
#include <string>
#include <vector>
#include <algorithm>

int solution(vector<int> people, int limit)
{
    int answer = 0;
    sort(people.begin(), people.end(), greater<int>());

    int min_index = people.size();
    for (size_t max_index = 0; max_index < min_index; max_index++)
    {
        int max = people[max_index];
        answer++;
        if (max + people[min_index - 1] <= limit)
            min_index--;
        else if (max + people[max_index] <= limit)
            max_index++;
    }

    return answer;
}
```

#### 테스트케이스

```c++
int main()
{
    cout << solution({100, 500, 500, 900, 950}, 1000) << endl; // 정답은 3
}
```



#### 마치며

공유해드린 ``테스트 케이스``까지 생각해야 풀 수 있는 문제입니다. ``사람수가 2명``이 넘어서는 안되는데 위와 같이 처리하면 해당 조건문도 피해 갈 수 있습니다. 아쉬운 점은 **제한사항**에 조금 친절하게 기재 좀 해뒀으면 했는데 맨날 문제 읽다가 시간 다 지나가는거 같아서 한편으로 속상합니다.

> 성능이 안 나와서 통과 못하시는 분들은 ``vector.erase``를 하시면 통과가 안 됩니다.