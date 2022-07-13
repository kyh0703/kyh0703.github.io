---
published: true
title: "Elastic Search - 1"
categories:
  - Elastic
tags:
  - [devops, elastic]
toc: true
toc_sticky: true
date: "2022-06-07 19:30"
---

### Elastic Search

**사용**

- 데이터 쿼리
- APM(Application Performance Management)
- 데이터 분석
- 용량 관리
- 탐지

**개념**

오픈소스 분석 및 전체 텍스트 검색 엔진 분색플랫픔으로 다양한 서버 시스템의 메트릭 로그를 저장한다음 분석할 수 있다.

Java로 작성되었으며 Apache Lucene위에 구축.

엘라스틱 데이터는 문서(json)로 저장한다.

- document = row(사람, 판매, 기타)
- field = column

- Rest API를 통해 질의 가능

**장점**

- 사용하기 쉬우며
- 높은 확장성

**APM(Application Performance ManageMent)**

#### Elastic Stack

- ELASTICSEARCH
- X-PACK
- KIBANA
- BEATS
- LOGSTASH

#### **KIBANA**

데이터를 쉽게 시각화 할 수 있는 시각화 플랫폼(ElasticSearch 대시보드로 생각 할 수도 있다.

인증과 같은 Elasticsearch의 특정 부분을 관리하기 위한 인터페이스도 제공

여러 메트릭 및 시각화를 배치하는 대시보드를 구축할 수 있음

- `APM` 모니터링
- 애플리케이션 오류 수
- KPI(Key Point of interest) 대시보드 (판매 수익, 비즈니스 수행방식)

**Logstash**

애플리케이션의 로그를 처리하여 Elasticsearch로 보내느데 사용하였으나 범용적인 도구로 발전하였다.

즉 `logstash`는 데이터 처리 파이프라인이다.

하나이상의 입력에서 이벤트를 수신하고 처리하고 하나이상의 `은닉처`로 보낸다.

**이벤트**

- 로그 파일 항목
- 전자 상거래 주문
- 고객
- 채팅 메시지

**은닉처**

- Elastcic search
- Kafka
- email message
- http endpoint

> 파이프 라인은 `입력,필터,출력` 세 부분의 단계로 구성되며 각 단계별로 플러그인을 사용할 수 있다. 많은 플러그인들이 있다(Kafka, http, csv, json..) 또한 IP주소 조회 및 지리적 해결과 같은 데이터 강화를 수행 할 수 있다.

**장점**

- 여러 파이프라인을 병렬로 수행가능하며 확장가능하다.
- Markup 형식으로 정의됨
- 파이프 라인을 동적으로 만듬

#### **X-Pack**

실제로 Elasticsearch에 추가기능을 추가하는 기능팩

- Kibana와 Elasticsearch에 인증과 권한 부여를 추가
- 사용자 및 역할을 추가하고 주어진 사용자 또는 역할이 엑세스 할 수 있는 항목을 정확하게 구성할 수 있다. (K8s RABC)
- Elastic Stack의 성능을 모니터링 할 수 있다.
  - 특히 CPU 및 메모리 사용량, 디스크 공간 및 기타 여러 유용한 지표
- 알람 설정 후 알람을 받을 수 있다.
  - Slack 이나 이메일로 알림
- kibana 시각 화 및 대시보드를 PDF 파일로 보낼 수 있따.

**머신 러닝으로 할 수 있는 일**

1. 데이터 기반의 비정상적인 변화를 감지하는 것과 같은 이상 감지를 할 수 있다.
2. 당사 웹사이트의 일일 방문 횟수가 상담한 감소나 증가가 있을 경우 식별 후 통지 가능

**Graph**

그래프는 데이터의 모든 관계에 관한 것

- 관계성
- 애플리케이션 통합 API 제공
- 데이터를 대화형 그래프로 시각화 할 수 있는 `kibana`용 플러그인을 제공

**SQL**

`Eleastic search`에서는 `query DSL`이라는 독점 쿼리 언어로 문서를 쿼리한다.

`Elasticsearch`가 하는 일은 SQL쿼리를 `query DSL`형식으로 변환하는 것

**Beats**

데이터 배송업체의 모음

서버에 설치하는 단일 목적의 경량 에이전트로써 데이터를 `logstash`또는 `Elasticsearch`로 보낸다.

- Filebeat
- meticbeat
