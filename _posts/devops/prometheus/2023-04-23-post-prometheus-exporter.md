---
published: true
title: "prometheus - exporter"
categories:
  - Prometheus 
tags:
  - [prometheus]
toc: true
toc_sticky: true
date: "2023-04-23 10:30"
---

#### Exporters

![image-20230423010613916](/home/overthinker1127/Project/kyh0703.github.io/assets/images/posts/2023-04-23-post-prometheus-exporter/image-20230423010613916.png)

* 프로그램은 메트릭을 구현하여야 한다.
* 운영체제커널의 정보같은 경우에는 측정항목을 직접 추가하여야 한다.
* 이러한 시스템을 모니터링 하기 위해서는 `exporter`가 필요하다.
* 프로메테우스가 이해 할 수 있는 형식으로 변경
