---
published: true
title: "CKA 자격증 따기 - day6"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-04-19 12:00"
---

#### Monitor Cluster Components

- `Prometheus`, `Elastic Stack`, `Datadog`, `Dynatrace` 솔루션을 사용할 수 있음
- k8s는 모니터링 솔루션을 자체적으로 제공하지 않음
- 클러스터 별 하나의 `Metric-Server`를 가질 수 있음

**Metric Server**

- 각 클러스터에서 메트릭을 검색한다
- 노드 및 포드의 일부를 집계하여 `IN-MEMORY`에 저장
- 메트릭 서버는 메모리 모니터링 솔루션일 뿐 저장하지 않아서 기록데이터를 볼 수 없으며, 기록데이터를 보기 위해선 오픈소스솔루션을 사용하여야 한다.
- kubelet은 `cAdvior` 또는 `Container Advisor`로 알려진 하위 구성요소를 가지고 있는데 이것은 파드의 성능 지표를 가져와 메트릭 서버가 수집 가능하게 `kubelet API`를 통해 놀출한다.

**cmd**

```bash
$ k top no # 노드 성능 지표
$ k top pod # 파드 성능 지표
```

#### Application Log

- 애플리케이션에서 표준출력으로 스트리밍하는 이벤트

**cmb**

```bash
k logs -f event-pod
```

하나의 파드에 여러 컨테이너가 있는 경우 명시적으로 지정해줘야됨

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: event-simulator-pod
spec:
  containers:
    - name: event-simulator
      image: kodekloud/event-simulator
    - name: image-processor
      image: some-image-proccesor
```

```bash
k logs -f event-simulator-pod event-simulator
```

```bash
k logs webapp-2 TAB동작
```
