---
published: true
title: "CKA 자격증 따기 - day8"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-04-22 12:00"
---

#### Operating System upgrade

**노드를 중단하는 시나리오**

- 노드가 다운되면 노드의 파드들에 접근 할 수 없다
- 노드가 5분 이상 중단된 경우 해당 노드 pod가 종료

> kube-conftorller-manager --pod-eviction-timeout=5m0s

- 죽어버린 pod는 다른 노드에서 다시 생성됨
- 포드 제거 시간 초과 후 노드는 pod가 없이 빈 상태임
- 워크로드가 다른 노드로 이동할 수 있게 의도적으로 배치 시킨다. 여기서 배치란 파드를 죽이고 재 생성한다는 의미

> 타노드로 이동한 pod들을 폴백하지 말아야한다.

```bash
k drain node-01 --ignore-daemonsets
```

- 파드를 스케쥴링 하지 않게 변경

```bash
k cordon node-2
k uncordon node-1
```
