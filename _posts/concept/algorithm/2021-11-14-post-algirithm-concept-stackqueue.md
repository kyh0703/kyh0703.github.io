---
title: "알고리즘 - stack/queue"
categories:
  - Algorithm
tags:
  - [algorithm, stack, queue]
toc: true
toc_sticky: true
date: "2021-11-14 23:00"
last_modified_at: 2021-11-14T18:00:00.540Z
---

## stack / queue

#### **stack - LIFO(Last In First Out)**

```c++
#include <iostream>
#include <stack>

// 나중에 들어온 값이 제일 먼저 나감
int main() {
    stack<int> pages;
    
	// | 1 |
    pages.push(1);
    
  	// | 1 | 2 |
    pages.push(2);
    
	// | 1 | 2 | 3 |
    pages.push(3);
    
	pages.pop();
    // | 1 | 2 |
    
    pages.pop();
    // | 1 |
    
    pages.pop();
    // empty
}
```

#### **queue- FIFO(First In First Out)**

```cpp
#include <iostream>
#include <queue>

// 먼저 들어온 값이 제일 먼저 나감
int main() {
    queue<int> buffer;
    
	// | 1 |
    buffer.push(1);
    
  	// | 1 | 2 |
    buffer.push(2);
    
	// | 1 | 2 | 3 |
    buffer.push(3);
    
    buffer.pop();
    // | 2 | 3 |     
    
    buffer.pop();
    // | 2 | 
    
    buffer.pop();
    // empty
}
```

#### 마치며

코딩테스트를 위해서는 스택과 큐에 대한 개념이 꼭 필요합니다. 스택은 LIFO 큐는 FIFO!✍️
