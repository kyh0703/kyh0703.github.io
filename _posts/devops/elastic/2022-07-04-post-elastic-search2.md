---
published: true
title: "Elastic Search - 2"
categories:
  - ELK
tags:
  - [devops, elk]
toc: true
toc_sticky: true
date: "2022-07-04 19:30"
---

#### 준비

* 클라우드 Free tier(14일 이후 자동 종료)
* OS 설치
* Docker container 생성

#### 설치

window로 진행

* admin 유저 저장

* 토큰생성(30분동안유지)

```bash
bin/elasticsearch-create-enrollment-token.bat -s kibana
```

* TLS 인증서 생성