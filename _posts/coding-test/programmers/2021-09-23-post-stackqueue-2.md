---
title: "프로그래머스 (스택/큐)2 - 프린터"
categories:
  - Programmers
tags:
  - [programmers, queue]
date: "2021-09-23 22:10"
last_modified_at: 2021-09-23T23:00:00.540Zs
---

#### 문제

일반적인 프린터는 인쇄 요청이 들어온 순서대로 인쇄합니다. 그렇기 때문에 중요한 문서가 나중에 인쇄될 수 있습니다. 이런 문제를 보완하기 위해 중요도가 높은 문서를 먼저 인쇄하는 프린터를 개발했습니다. 이 새롭게 개발한 프린터는 아래와 같은 방식으로 인쇄 작업을 수행합니다.

```
1. 인쇄 대기목록의 가장 앞에 있는 문서(J)를 대기목록에서 꺼냅니다.
2. 나머지 인쇄 대기목록에서 J보다 중요도가 높은 문서가 한 개라도 존재하면 J를 대기목록의 가장 마지막에 넣습니다.
3. 그렇지 않으면 J를 인쇄합니다.
```

예를 들어, 4개의 문서(A, B, C, D)가 순서대로 인쇄 대기목록에 있고 중요도가 2 1 3 2 라면 C D A B 순으로 인쇄하게 됩니다.

내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 알고 싶습니다. 위의 예에서 C는 1번째로, A는 3번째로 인쇄됩니다.

현재 대기목록에 있는 문서의 중요도가 순서대로 담긴 배열 priorities와 내가 인쇄를 요청한 문서가 현재 대기목록의 어떤 위치에 있는지를 알려주는 location이 매개변수로 주어질 때, 내가 인쇄를 요청한 문서가 몇 번째로 인쇄되는지 return 하도록 solution 함수를 작성해주세요.

##### 제한사항

- 현재 대기목록에는 1개 이상 100개 이하의 문서가 있습니다.
- 인쇄 작업의 중요도는 1~9로 표현하며 숫자가 클수록 중요하다는 뜻입니다.
- location은 0 이상 (현재 대기목록에 있는 작업 수 - 1) 이하의 값을 가지며 대기목록의 가장 앞에 있으면 0, 두 번째에 있으면 1로 표현합니다.

##### 입출력 예

| priorities         | location | return |
| ------------------ | -------- | ------ |
| [2, 1, 3, 2]       | 2        | 1      |
| [1, 1, 9, 1, 1, 1] | 0        | 5      |

##### 입출력 예 설명

예제 #1

문제에 나온 예와 같습니다.

예제 #2

6개의 문서(A, B, C, D, E, F)가 인쇄 대기목록에 있고 중요도가 1 1 9 1 1 1 이므로 C D E F A B 순으로 인쇄합니다.

#### C++

```c++
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

int solution(vector<int> priorities, int location)
{
    int answer = 0;

    while (!priorities.empty())
    {
        int max = *max_element(priorities.begin(), priorities.end());
        if (priorities.front() < max)
        {
            if (0 == location)
                location = priorities.size() - 1;
            else
                location--;

            priorities.push_back(priorities.front());
            priorities.erase(priorities.begin());
        }
        else
          {
            priorities.erase(priorities.begin());
            answer++;

            if (0 == location)
                break;

            location--;
        }
    }

    return answer;
}
```

#### 마치며

다 풀고나서 c++에서 ``priority_queue``와 ``queue``를 두개 사용하여 넣어놓고 처리하는 풀이방식을 봤다. ``queue``를 직접사용하기보다 ``vector``를 통해 구현하였는데 오래 걸렸다..이게 왜 이리 오래 걸리지.. 자존감 박살 날 뻔 했다.