---
published: true
title: "CKA 자격증 따기 - day9"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-24 12:00"
---

#### Kubernetes Software version

```bash
k get no
# VERSION 확인가능
```

* v1.11.3
  * v1: major
    * 2015년 7월 릴리스
  * .11: minor
    * Features
    * Functionalites
  * .3: patch
    * Bug Fix
* merge 과정
  * alpha -> beta -> release

* ETCD 클러스터와 CoreDNS서버는 별도의 Third Party이기에 자체버전을 가진다.

#### Cluster Upgrade Process

- 쿠버네티스는 최소 하위 2버전까지 지원해준다.
- 이 말은 즉슨 현재 버전이 v1.10버전이라면 이 버전은 v1.13이 나오는 순간 v1.10을 지원하지 않게 된다는 뜻이기도 하다.
- 쿠버네티스에서는 v1.10 -> v1.13으로 바로 가기 보다는 마이너버전을 하나씩 점진적으로 올리기를 권장한다.

**명령어**

```bash
apt-get upgrade -y kubeadm=1.12.0-00
```

```bash
kubeadm upgrade plan v1.12.0
```

```bash
k get no
```

```bash
systemctl restart kubectl
```

```bash
k drain node-01
```

```bash
kubeadm upgrade node config --kubelet-version v1.12.0
```

**upgrade**

* 먼저 마스터 노드를 업그레이드 한 다음 작업자 노드로 업그레이드 하여야 함
* 업그레이드 전략
  1. 한번에 업그레드
     * 서비스는 정상적이나 `kube-api-server`에서 파드를 생성 삭제 하는 작업 불가
  2. 한번에 하나의 노드를 업그레이드
     * 업그레이드 노드에 자원은 다른 노드에 배치 되어 작업됨
  3. 최신 소프트웨어 버전으로 클러스터 노드에 새 노드를 추가
     * 편리하며 업그레이드 후 구 버전 노드 제거
