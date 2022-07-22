---
published: true
title: "Elastic Search - 2"
categories:
  - elastic
tags:
  - [devops, elastic]
toc: true
toc_sticky: true
date: "2022-07-04 19:30"
---

#### 준비

- 클라우드 Free tier(14일 이후 자동 종료)
- OS 설치
- Docker container 생성

#### 설치

window로 진행

- admin 유저 저장

- 토큰생성(30분동안유지)

```bash
bin/elasticsearch-create-enrollment-token.bat -s kibana
```

- TLS 인증서 생성

#### 개념

**노드**

데이터를 저장하는 `Elasticsearch`의 인스턴스

노드는 머신이 아니라 인스턴스를 참조하므로 원하는 만큼 실행할 수 있다.

* Server, VM, Container

**클러스터**

노드의 모음

**문서**

클러스터 내 저장하는 데이터 단위

* 원하는 모든 데이터를 포함하는 `json`객체
* 모든 문서는 인덱스 내에 저장됨

```json
// json
{
    "name": "Bo Andersen",
    "country": "Denmark"
}

// document 메타데이터와 함께 저장됨
{
    "_index": "people",
    "_type": "_doc",
    "_id": "123",
    "_version": 1,
    "_seq_no": 0,
    "_primary_term": 1,
    "_source": { // JSON Data
        "name": "Bo Andersen",
        "country": "Denmark"
    }
}
```

**색인(index)**

문서를 논리적으로 그룹화하고 옵션을 제공함

* 문서의 모음

* 인덱스는 원하는 만큼 문서를 포함할 수 있다.

* 위의 `Bo Andersen`데이터는 아래 색인에 참조될 수 있다.

    * People index

    * Departments index

* 검색할 떄 원하는 인덱스를 지정 함

#### 명령

```bash
GET /_cluster/health
     API지정  명령지정
```

**_cat API**

사람이 읽을 수 있는 형식으로 출력

```bash
$ GET /_cat/nodes?v
{v: desc header include}

ip             heap.percent ram.percent cpu load_1m load_5m load_15m node.role   master name
192.168.115.48            4          98  47                          cdfhilmrstw *      LAPTOP-TQ895JSP
```

