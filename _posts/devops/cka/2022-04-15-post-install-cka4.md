---
published: true
title: "CKA 자격증 따기 - day3"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-15 12:00"
---

#### Namespace

* k8s를 설치하면 kube-system, kube-public, default이란 namespace를 생성한다

* 개발환경, 상용환경을 따로 구성

* 고유한 정책

* 리소스 할당량 설정 가능

* 다른네임스페이스의 서비스에도 연결 할 수 있다.

    > servicename.namespace.svc.cluster.local 형식을 사용
    >
    > {cluster.local}: k8s 클러스터의 기본 도메인 이름
    >
    > {svc}: 서브 도메인

**명령어**

명령어로 지정

```bash
k create -f pod-definition.yml --namespace=dev
```

metadata에 namespace지정(항상 같은 네임스페이스를 지정)

```yaml
apiVersion: v1
Kind: Pod
metadata:
  name: myapp-pod
  namespace: dev
  labels:
    app: myapp
    type: front-end
 spec:
  containers:
  - name: nginx-controller
    image: nginx
```

생성

```bash
k create ns dev
```

명령어 사용할 때 기본 namespace를 지정하는 방법

```bash
k config set-context $(kubectl config current-context) --namespace=dev
```

모든 네임스페이스

```bash
$ k get po --all-namespaces
$ k get po -A
```

**네임스페이스 할당량 조정**

* quota파일로 조정

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: computer-quota
  namespace: dev
spec:
  hard:
    pods: "10"
    requests.cpu: "4"
    requests.memory: 5Gi
    limits.cpu: "10"
    limits.memory: 10Gi
```

