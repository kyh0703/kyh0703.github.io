---
title: "프로그래머스 스택/큐 - 다리를 지나는 트럭"
categories:
  - Programmers
tags:
  - [programmers, queue, c++]
toc: true
toc_sticky: true
date: "2021-09-24 18:00"
last_modified_at: 2021-09-24T18:00:00.540Zs
---

#### 문제

트럭 여러 대가 강을 가로지르는 일차선 다리를 정해진 순으로 건너려 합니다. 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 알아내야 합니다. 다리에는 트럭이 최대 bridge_length대 올라갈 수 있으며, 다리는 weight 이하까지의 무게를 견딜 수 있습니다. 단, 다리에 완전히 오르지 않은 트럭의 무게는 무시합니다.

예를 들어, 트럭 2대가 올라갈 수 있고 무게를 10kg까지 견디는 다리가 있습니다. 무게가 [7, 4, 5, 6]kg인 트럭이 순서대로 최단 시간 안에 다리를 건너려면 다음과 같이 건너야 합니다.

| 경과 시간 | 다리를 지난 트럭 | 다리를 건너는 트럭 | 대기 트럭 |
| --------- | ---------------- | ------------------ | --------- |
| 0         | []               | []                 | [7,4,5,6] |
| 1~2       | []               | [7]                | [4,5,6]   |
| 3         | [7]              | [4]                | [5,6]     |
| 4         | [7]              | [4,5]              | [6]       |
| 5         | [7,4]            | [5]                | [6]       |
| 6~7       | [7,4,5]          | [6]                | []        |
| 8         | [7,4,5,6]        | []                 | []        |

따라서, 모든 트럭이 다리를 지나려면 최소 8초가 걸립니다.

solution 함수의 매개변수로 다리에 올라갈 수 있는 트럭 수 bridge_length, 다리가 견딜 수 있는 무게 weight, 트럭 별 무게 truck_weights가 주어집니다. 이때 모든 트럭이 다리를 건너려면 최소 몇 초가 걸리는지 return 하도록 solution 함수를 완성하세요.

##### 제한 조건

- bridge_length는 1 이상 10,000 이하입니다.
- weight는 1 이상 10,000 이하입니다.
- truck_weights의 길이는 1 이상 10,000 이하입니다.
- 모든 트럭의 무게는 1 이상 weight 이하입니다.

##### 입출력 예

| bridge_length | weight | truck_weights                   | return |
| ------------- | ------ | ------------------------------- | ------ |
| 2             | 10     | [7,4,5,6]                       | 8      |
| 100           | 100    | [10]                            | 101    |
| 100           | 100    | [10,10,10,10,10,10,10,10,10,10] | 110    |

[출처](http://icpckorea.org/2016/ONLINE/problem.pdf)

※ 공지 - 2020년 4월 06일 테스트케이스가 추가되었습니다.

#### C++

```c++
#include <string>
#include <vector>
#include <queue>

using namespace std;

int solution(int bridge_length, int weight, vector<int> truck_weights)
{
    int answer = 0;
    queue<int> trucks;
    for (int truck : truck_weights)
        trucks.push(truck);

    queue<pair<int, int>> progress;
    int current_weight = 0;
    int second = 1;
    while (true)
    {
        if (!progress.empty())
        {
            int start_second = progress.front().first;
            int truck_weight = progress.front().second;
            int distance = second - start_second;
            if (bridge_length <= distance)
            {
                progress.pop();
                current_weight -= truck_weight;
            }
        }

        if (!trucks.empty() && current_weight + trucks.front() <= weight)
        {
            int truck_weight = trucks.front();
            current_weight += truck_weight;
            trucks.pop();
            progress.push(make_pair(second, truck_weight));
        }

        if (progress.empty() && trucks.empty())
            break;

        second++;
    }

    answer = second;
    return answer;
}
```

#### 마치며

내가 너무 어렵게 문제를 푸는거 같단 생각이 든다. 다른사람 풀이를 보면 참 간단히도 했는데..이번 문제 풀이는 큐로 처리해야겠단 생각을 가지고 시작부터 큐에 넣고 시작했는데 트럭에 거리를 구하여 처리하는 부분을 위로 두어야 해결이 되는건 알고있었지만 아래쪽에 두고 싶은 아집이 생겨서하다가 시간이 걸려서 그냥 올렸다. 재밌긴 한데 찜찜하다 다른 문제들을 부지런히 풀어봐야겠다.