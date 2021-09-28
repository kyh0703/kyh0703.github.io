---
title: "이것이 취업을 위한 코딩테스트다 - 그리디"
categories:
  - Jobcoding
tags:
  - [jobcoding, c++]
toc: true
toc_sticky: true
date: "2021-09-26 17:00"
last_modified_at: 2021-09-25T17:00:00.540Zs
---

### 거스름돈

#### 문제

당신은 음석점의 계산을 도와주는 점원이다. 카운터에는 거스름 돈으로 사용할 500원, 100원, 50원, 10원짜리 동전이 무한히 존재한다고 가정한다. 손님에게 거슬러 줘야 할 돈이 N원일 때 거슬러줘야 할 동전의 최소 개수를 구하라. 단, 거슬러 줘야 할 돈 N은 항상 10의 배수이다.

#### C++

```c++
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

### 숫자카드게임

#### 문제

숫자 카드 게임은 여러 개의 숫자 카드 중에서 가장 높은 숫자가 쓰인 카드 한 장을 뽑는 게임이다.

단, 게임의 룰을 지키며 카드를 뽑아야 하고 룰은 다음과 같다.

1. 숫자가 쓰인 카드들이 N * M 형태로 놓여있다. 이때 N은 행의 개수를 의미하며, M은 열의 개수를 의마한다.
2. 먼저 뽑고자 하는 카드가 포함되어 있는 행을 선택한다.
3. 그 다음 선택된 행에 포함된 카드들 중 가장 숫자가 낮은 카드를 뽑아야 한다.
4. 따라서 처음에 카드를 골라낼 행을 선택할 때, 이후에 해당 행에서 가장 숫자가 낮은 카드를 뽑을 것을 고려하여 최정적으로 가장 높은 숫자의 카드를 뽑을수 있도록 전략을 세워야 한다.

#### C++

```c++
int solution(vector<vector<int>> cards)
{
    int answer = -1;
    for (size_t i = 0; i < cards.size(); i++)
    {
        int min = *min_element(cards[i].begin(), cards[i].end());
        if (answer < min)
            answer = min;
    }
    return answer;
}

int main(void)
{
    cout  << solution({
        {7 ,3, 1, 9},
        {3, 3, 3, 4},
    }) << endl;
}
```

### 1이 될 때까지

#### 문제

어떠한 수 N이 1이 될때까지 다음의 두 과정 중 하나를 반복적으로 선택하여 수행하려고 한다. 단, 두 번째 연산은 N이 K로 나누어떨어질 때만 선택할 수 있다.

1. N에서 1을 뺀다.
2. N을 K로 나눈다

예를 들어 N이 17, K가 4라고 가정하자. 이때 1번의 과정을 한 번 수행하면 N은 16이 된다. 이후에 2번의 과정을 두 번 수행하면 N은 1이 된다. 결과적으로 이 경우 전체 과정을 실행한 횟수는 3이 된다. 이는 N을 1로 만드는 최소 횟수이다.

N과 K가 주어질 때 N이 1이 될 때까지 1번 혹은 2번의 과정을 수행해야 하는 최소 횟수를 구하는 프로그램을 작성하시오.

#### C++

```c++
int solution(int n, int k)
{
    int answer = 0;

    while (n != 1)
    {
        if (n / k)
            n /= k;
        else
            n -= 1;

        answer++;
    }

    return answer;
}
```

### 상하좌우

#### 문제

여행가 A는 N * N 크기의 정사각형 공간위에 서 있다. 이 공간은 1 * 1 크기의 정사각형으로 나누어져 있다. 가장 왼쪽 위 좌표는 (1,1)이며, 가장 오른쪽 아래 좌표는 (N,N)에 해당한다. 여행가 A는 상, 하, 좌, 우 방향으로 이동할 수 있으며, 시작 좌표는 항상(1,1)이다. 우리 앞에는 여행가 A가 이동할 계획이 적힌 계획서가 놓여있다.

계획서에는 하나의 줄에 띄어쓰기를 기준으로 하여 L, R, U, D 중 하나의 문자가 반복적으로 적혀 있다. 각 문자의 의미는 다음과 같다.

* L: 왼쪽으로 한 칸이동
* R: 오른쪽으로 한 칸 이동
* U: 위로 한 칸 이동
* D: 아래로 한 칸 이동

이때 여행가 A가 N*N 크기의 정사각형 공간을 벗어나는 움직임은 무시된다. 예를 들어 (1,1)의 위치에서 L 혹은 U를 만나면 무시된다.

#### C++

```c++
vector<int> solution(int n, vector<string> plans)
{
    int x = 1, y = 1;
    vector<int> answer;
    for (string plan : plans)
    {
        if (plan == "L")
        {
            if (1 < x)
                x--;
        }
        else if (plan == "R")
        {
            if (x < n)
                x++;
        }
        else if (plan == "U")
        {
            if (1 < y)
                y--;
        }
        else if (plan == "D")
        {
            if (y < n)
                y++;
        }
    }
    answer.push_back(y);
    answer.push_back(x);
    return answer;
}
```

### 시각

#### 문제

정수 N이 입력되면 00시 00분 00초부터 N시 59분 59초까지의 모든 시각 중에서 3이 하나라도 포함되는 모든 경우의 수를 구하는 프로그램을 작성하시오. 예를 들어 1을 입력했을 때 다음은 3이 하나라도 포함되어 있으므로 세어야 하는 시각이다.

* 00시00분03초
* 00시13분30초

반면에 다음은 3이 하나도 포함되어 있지 않으므로 세면 안 되는 시각이다.

* 00시 02분 55초
* 01시 27분 45초

#### C++

```c++
int solution(int n)
{
    int answer = 0;
    char time[10] = {'\0', };

    for (int h = 0; h < n  + 1; h++)
    {
        for (int m = 0; m < 60; m++)
        {
            for (int s = 0; s < 60; s++)
            {
                sprintf(time, "%02d%02d%02d", h, m, s);
                string time_str = time;
                if (time_str.find("3") != string::npos)
                    answer++;
            }
        }
    }

    return answer;
}
```

### 왕실의 나이트

#### 문제

행복 왕국의 왕실 정원은 체스판과 같은 8 * 8 좌표 평면이다. 왕실 정원의 특정한 한 칸에 나이트가 서 있다. 나이트는 매우 충성스러운 신하로서 매일 무술을 연마한다.

나이트는 말을 타고 있기 때문에 이동을 할떄는 L자 형태로만 이동할 수 있으며 정원 밖으로는 나갈 수 없다. 나이트는 특정한 위치에서 다음과 같은 2가지 경우로 이동할 수 있다.

1. 수평으로 두칸 이동한 뒤에 수직으로 한 칸 이동하기
2. 수직으로 두칸 이동한 뒤에 수평으로 한 칸 이동하기

이처럼  8 * 8 좌표 평면상에서 나이트의 위치가 주어졌을 때 나이트가 이동할 수 있는 경우의 수를 출력하는 프로그램을 작성하시오

#### C++

```c++
int solution(vector<int> position)
{
    int answer = 0;
    vector<pair<int, int>> steps = {
        make_pair(-2, -1), make_pair(-1, -2),
        make_pair(2, -1), make_pair(1, -2),
        make_pair(-2, 1), make_pair(-1, 2),
        make_pair(1, 2), make_pair(2, 1)};

    int col = position[0];
    int row = position[1];
    for (pair<int, int> step : steps)
    {
        int next_col = col + step.first;
        int next_row = row + step.second;
        if (1 <= next_row && next_row <= 8 && 1 <= next_col && next_col <= 8)
            answer++;
    }
    return answer;
}
```
