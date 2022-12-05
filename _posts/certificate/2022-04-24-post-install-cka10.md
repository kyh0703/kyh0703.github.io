---
published: true
title: "CKA 자격증 따기 - day9"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-04-24 12:00"
---

#### Kubernetes Software version

```bash
k get no
# VERSION 확인가능
```

- v1.11.3
  - v1: major
    - 2015년 7월 릴리스
  - .11: minor
    - Features
    - Functionalites
  - .3: patch
    - Bug Fix
- merge 과정

  - alpha -> beta -> release

- ETCD 클러스터와 CoreDNS서버는 별도의 Third Party이기에 자체버전을 가진다.

#### Cluster Upgrade Process

- 쿠버네티스는 최소 하위 2버전까지 지원해준다.
- 이 말은 즉슨 현재 버전이 v1.10버전이라면 이 버전은 v1.13이 나오는 순간 v1.10을 지원하지 않게 된다는 뜻이기도 하다.
- 쿠버네티스에서는 v1.10 -> v1.13으로 바로 가기 보다는 마이너버전을 하나씩 점진적으로 올리기를 권장한다.

**명령어**

- master

```bash
# update
$ apt update
# plan
$ kubeadm upgrade plan
# apt install kubeadm
$ apt install kubeadm=1.20.0-00
# apply
$ kubeadm upgrade apply v1.20.0-0
# apt install kubelet
$ apt install kubelet=1.20.0-00
# restart
$ systemctl restart kubelet
```

- node

```bash
# update
$ apt update
# apt install kubeadm
$ apt install kubeadm=1.20.0-00
# upgrade
$ kubeadm upgrade node
# apt install kubelet
$ apt install kubelet=1.20.0-00
# restart
$ systemctl restart kubelet
```

**upgrade**

- 먼저 마스터 노드를 업그레이드 한 다음 작업자 노드로 업그레이드 하여야 함
- 업그레이드 전략
  1. 한번에 업그레드
     - 서비스는 정상적이나 `kube-api-server`에서 파드를 생성 삭제 하는 작업 불가
  2. 한번에 하나의 노드를 업그레이드
     - 업그레이드 노드에 자원은 다른 노드에 배치 되어 작업됨
  3. 최신 소프트웨어 버전으로 클러스터 노드에 새 노드를 추가
     - 편리하며 업그레이드 후 구 버전 노드 제거

#### Backup and Restore

**resource**

- k8s 오브젝트 정의 파일은 github와 같은 버전관리 도구에서 관리하면 좋다
- 클러스터가 날라가도 형상 관리 도구에 남아있는 yaml파일로 복구가 가능하다
- 아래 명령어를 통해 리소스 오브젝트를 백업하는 과정은 `velero`를 구성하여 자동으로 오브젝트 스토리지로 백업할 수 있다. [velero 설치](https://1week.tistory.com/110)

```bash
k get all -A -o yaml > all-deploy-services.yaml
```

**server**

- `etcd`는 클러스의 상태에 대한 정보를 저장함으로 클러스터에서 생성된 모든 리소스를 저장한다.
- `etcd`는 마스터마다 1개씩 있으며, data 디렉토리에 정보를 저장한다.
- 리소스를 백업하는 대신 서버 자체를 백업 하도록 선택 할 수 있음

```bash
# check environment etcd
$ export ETCDCTL_API=3

# snapshot
$ etcdctl snapshot save snapshot.db

# check the file
$ ls
snapsho.db

# select
$ etcdctl snapshot status snapshot.db

# service stop
$ service kube-apiserver stop

# rollback
$ etcd snapshot restore snapshot.db --data-dir /var/lib/etcd-fron-backup

# restart etcd
$ systemctl restart etcd

# service kube-apiserver start
$ service kube-apiserver start

# mdfy etcd yaml
  volumes:
  - hostPath:
      path: /var/lib/etcd-from-backup
      type: DirectoryOrCreate
    name: etcd-certs
```

- etcd 서버에 접근하기 위해 TLS가 필요한대 다음 옵션 필요

```bash
$ etcd ctl snapshot save snapshot.db \
    --endpoints=https://127.0.0.1:2379 \ # 로컬호스트 2379로 노출되며 마스터노드에서 동작하는 ETCD의 디폴트 설정
    --cacert=/etc/etcd/ca.crt \ # TLS 인증을 위한 CA번들을 사용하기 위한 옵션
    --cert=/etc/etcd/etcd-server.crt \ # TLS 인증 파일
    --key=/etc/etcd/etcd-server.key # TLS 키 파일
```
