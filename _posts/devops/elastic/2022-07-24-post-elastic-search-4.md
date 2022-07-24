---
published: true
title: "Elastic Search -4"
categories:
  - elastic
tags:
  - [devops, elastic]
toc: true
toc_sticky: true
date: "2022-07-24 12:30"
---

### Managing

#### 조회

```bash
GET /products/_doc/100
```

#### 수정

```bash
POST /products/_update/100
{
  "doc": {
    "in_stock": 3
  }
}
```

#### 갱신

`elastic search`는 문서를 찾아 갱신하는 것이 아니라 지웠다가 다시 등록한다.

```bash
POST /products/_doc
{
  "name": "Coffee Maker",
  "price": 64,
  "in_stock": 10
}
```

_id키를 지정할려면 `PUT`을 사용한다.

```bash
PUT /products/_doc/100
{
  "name": "Toaster",
  "price": 49,
  "in_stock": 4
}
```

#### 삭제

```bash
DELETE /products/_doc/100
```

#### 스크립트 업데이트

```bash
# _in_stock을 하나 뺀다.
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock--"
  }
}
```

```bash
POST /products/_update/100
{
  "script": {
    "source": "ctx._source.in_stock-= params.quantity",
    "params": {
      "quantity": 4
    }
  }
}
```

```bash
POST /products/_update/100
{
  "script": {
    "source": """
      if (ctx._source.in_stock == 0) {
        ctx.op = 'noop';
      }
      ctx._source.in_stock--;
      """
    }
  }
}
```

#### Upsert

조건에 따라 문서를 조건부로 업데이트하거나 삽입하는 것을 의미

