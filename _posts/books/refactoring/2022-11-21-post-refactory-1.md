---
title: "리팩터링- 1"
categories:
  - Books
tags:
  - [book, refactory]
toc: true
toc_sticky: true
date: "2022-11-21 10:00"
---

### 리팩터링: 첫 번째 예시

* 공연 요청이 들어오면 연극의 장르와 관객 규모를 기초로 비용을 측정함
* 현재는 `비극`과 `희극`만 공연
* 공연료의 별개로 `포인트`를 지급하여 다음 번 의뢰시 공연료를 할인 받을 수도 있음

#### 기초데이터

```js
// plays.json
{
    "hemlet": {"name": "Hamlet", "type": "tragedy"},
    "as-like": {"name": "As You Like it", "type": "comedy"}
}
```

```js
[
    {
        "customer": "BihCo",
        "performances": [
            {
                "playID": "hamlet",
                "audience": 55
            },
            {
                "playID": "as-like",
                "audience": 35
            },
        ]
	}
]
```

#### 리팩토링 전 코드

```js
function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer}\n`l
    const format = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD", minimunFactionDigits: 2}).format;
    
    for (let perf of invoice.performances) {
        const play = plays[perf.palyID]l
        let thisAmount = 0;
        
        switch (paly.type) {
        case 'tragedy':
            thisAmount = 40000;
            if (perf.audience > 30) {
                thisAmount += 1000 * (perf.audience - 30);
            }
            break;
        case 'comedy':
            thisAmount = 30000;
            if (perf.audience > 20) {
                thisAmount += 1000 + 500 * (perf.audience - 20);
            }
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error('알수없음')
        }
    }
    
    // 포인트를 적립한다
    volumeCredits += Math.max(perf.audience - 30, 0);
    
    // 희극 관객 5명마다 추가 포인트제공
    if ('comedy' === paly.type) volumeCredits += Math.floor(perf.audience / 5)
    
    result += `${play.nmae}`
    totalAmount += thisAmount;
}
```

> 프로그램이 새로운 기능을 추가하기에 편한 구조가 아니라면, 먼저 기능을 추가하기 쉬운 형태로 리팩터링 하고 나서 원하는 기능을 추가한다.

**변경포인트**

1. HTML 출력기능
2. 공연 정책이 변경 될 때마다 코드를 변경하여야 됨.

#### 리팩터링의 첫 단계

* 리팩터링 하기 전부터 테스트 코드들부터 마련하여야 한다.
* 중복 검사로 원본 코드와 바뀐 코드를 테스트하여 실수를 줄인다.
* 사람은 실수한다.
* 조금씩 수정하여 피드백 주기를 짧게 가져가야 재앙을 피할 수 있음

```js
function amountFor(aPerformance, play) {
	let result = 0;
    switch (play.type) {
    case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
        }
        break;
    case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
            result += 1000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
    default:
        throw new Error('알수없음')
    }
    return result
}
```

> 리팩터링은 프로그램 수정을 작은 단계로 나눠 진행한다. 그래서 중간에 실수하더라도 버그를 쉽게 찾을 수 있다.
