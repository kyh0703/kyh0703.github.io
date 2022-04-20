---
published: true
title: "CKA 자격증 따기 - day7"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-20 12:00"
---

#### Rolling Updates and Rollbacks

* 파드의 기본 배포 전략 `Rolling update`
* 배포될 때마다 `REVISION`으로 변경사항을 추적

**명령어**

* 상태

```bash
k rollout status deploy myapp-deployment
```

* 기록

```bash
k rollout history deploy myapp-deployment
```

* 이미지 변경

```bash
# 배치 정의 파일이 다른 구성을 갖게 됨
k set image deploy myapp-deployment nginx=nginx:1.91
# apply 권장
k apply -f myapp-deployment.yaml
```

* 롤백

```bash
k rollout undo deploy myapp-deployment
```

**배포 전략**

1. Recreate
    * 파드를 전체 제거 후 다시 재 배포
2. Rolling Update(Default)
    * `replicaSet`을 새로 만들어 파드를 생성함과 동시에 기존 파드를 삭제

```bash
$ k describe deploy
stretegyType: Recreate or RollingUpdate
```

