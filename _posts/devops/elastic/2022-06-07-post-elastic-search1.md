---
published: true
title: "Elastic Search - 1"
categories:
  - ELK
tags:
  - [devops, elk]
toc: true
toc_sticky: true
date: "2022-06-07 19:30"
---

#### Elastic Search

**사용**

* 데이터 쿼리
* APM(Application Performance Management)
* 데이터 분석
* 용량 관리
* 탐지

**개념**

오픈소스 분석 및 전체 텍스트 검색 엔진 분색플랫픔으로 다양한 서버 시스템의 메트릭 로그를 저장한다음 분석할 수 있다.

Java로 작성되었으며 Apache Lucene위에 구축 됌

엘라스틱 데이터는 문서(json)로 저장한다. 

* document = row(사람, 판매, 기타)
* field = column

* Rest API를 통해 질의 가능

**장점**

* 사용하기 쉬우며
* 높은 확장성

#### Elastic Stack

* ELASTICSEARCH
* X-PACK
* KIBANA
* BEATS
* LOGSTASH

**KIBANA**

데이터를 쉽게 시각화 할 수 있는 시각화 플랫폼(ElasticSearch 대시보드로 생각 할 수도 있따.)

