---
published: true
title: "prometheus - metric"
categories:
  - Prometheus 
tags:
  - [prometheus]
toc: true
toc_sticky: true
date: "2023-04-23 21:30"
---

### Metric Types

#### Counter

* 누적 메트릭
* 단조롭게 증가하는 단일 카운터
* 다시 시작할 때 0으로 재 설정 할 수 있음
* 증가만 가능
* 요청수, 완료된 작업

#### Gauge

* 시간에 따라 감소할수 있음
* 현재 상태의 스냅샷을 만듬
* 메모리사용량, 활성 스레드 수
* 증가, 감소, 설정

#### Summary

*  관측결과를 샘플링 함

* 애플레케이션이 응답하는데 걸린 시간 요청에 대기시간 및 응답 크기

#### Histogram

* 관측 결과를 샘플링 함
