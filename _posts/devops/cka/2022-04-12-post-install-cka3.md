---
published: true
title: "CKA 자격증 따기 - day2"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-04-12 12:00"
---

#### POD

- 애플리케이션의 단일 인스턴스
- 가장 작은 개체
- 단일 pod에 여러 컨테이너가 올라 갈 수 있음
  - 동일한 네트워크, 동일한 스토리지

```bash
kubectl run nginx --image {image}
```

```yaml
apiVersion: kube API 버전
kind: 만들려는 객체의 유형
metadata: 이름, 레이블 개체등 개체 데이터(사전)
  name: myapp-pod
  lables: 필터링
    app: myapp
    type: front-end
sepc: 사양
  containers: [List/Array]
    - name: nginx
      image: nginx
```

```bash
k create -f {}.yaml
k run nginx --image nginx
k describe po {pod}
```

#### Replicaset

- 단일포드의 여러인스턴스는 고가용성을 제공

- 로드밸런싱 & 스캐일링
- 단일 파드여도 자동 회복 기능을 제공

- 서로 다른 노드의 여러 pod간 부하를 분산하고 애플리케이션을 확장
- Replicas <= 100

| Repication Controller | Replica Set     |
| --------------------- | --------------- |
| 오래 됨               | 새로운 권장방법 |
| Selector X            | Selector O      |

**Replication Controller**

```yaml
apiVersion: v1
kind: RelicationController
metadata:
  name: myapp-rc
  labels:
    app: myapp
    type: front-end
spec:
  teplate:
    # 아래부분은 파드에 metadata부분과 동일하다
    metadata:
    name: mypod-pod
    lables:
      app: myapp
      type: front-end
    spec:
      continaers:
        - name: nginx-controller
          image: nginx
replicas: 100
```

**Replicat Set**

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # 케이스에 따라 레플리카를 수정한다.
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
        - name: php-redis
          image: gcr.io/google_samples/gb-frontend:v3
```

#### Label Selector

파드가 많아지면 식별하기 어렵고 `replicaset`에 `selector`를 지정하여 모니터링할 부분을 알고 있게 만들어 쉽게 관리할 수 있음.

**sacle 조정 명령어**

복제본 세트 업데이트

```bash
kubectl replace -f replicaset-definition.yml
```

복제 매개 변수 사용

```bash
kubectl scale --replicas=6 -f replicaset-definition.yml
```

```bash
kubectl scale --replicas=6 replicaset myapp-replicaset
```

**alias**

```bash
k scale --replicas=6 rs myapp-repicaset
```

#### Deployment

- deployment > replicaset > pod

> deployment 안에 replicaset이 있으며 그 안에 pod가 있다.

- 인스턴스를 여러개 구성
- 인스턴스를 업그레이드 가능
- 롤링 업데이트, 변경사항 실행 취소, 일시중지 및 재개

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  # 케이스에 따라 레플리카를 수정한다.
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
        - name: php-redis
          image: gcr.io/google_samples/gb-frontend:v3
```

**alias**

```bash
# k get all로 보면 앞에 alias를 확인 할 수 있다.
k get deploy
```

#### TIP

파일을 생성하여 만들기는 시험떄 어려울 수 있기에 다음과 같이 `run` 명령어를 사용하여 `yaml`파일을 가져올 수 있다.

- pod

```bash
k run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
```

- deployment

```bash
k create depoly --image=nginx --dry-run=client --replicas-o yaml > deploy_sample.yaml
```
