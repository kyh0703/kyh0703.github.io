---
published: true
title: "CKA 자격증 따기 - day18"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-05-06 12:00"
---

#### Networking Cluster Node

* `k8s`클러스터는 마스터, 작업자 노드가 있고, 각 노드는 하나의 인터페이스를 가지며 이 인터페이스는 하나의 아이피 주소를 갖는다.
* 호스트들은 고유한 이름이 필요한다 MAC주소를 키로 가진다.
* `master`노드는 `kube-apiserver`는  `6443` 포트 오픈
* 각 노드의 `kubelet`은 `19250` 포트 오픈
* `kube-scheduler`는 `10251` 포트 오픈
* `kube-controller-manager`는 `10252` 포트 오픈
* `worker`노드들은 노드포트인 `30000-32767` 포트 오픈
* `etcd`는 `2379` 포트 오픈
* `mater` 노드가 여러개이면 `etcd-client`가 통신할 수 있게 `2380` 포트 오픈

> * [벤더 CNI](https://kubernetes.io/docs/concepts/cluster-administration/addons/)
> * [네트워킹 구조](https://kubernetes.io/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)
> * [방화벽포트](https://kubernetes.io/docs/reference/ports-and-protocols/)

**명령어**

```bash
# ARP(Address resolution Protocol)
# IP주소로 MAC주소를 알기 위한 프로토콜
$ arp
Address                  HWtype  HWaddress           Flags Mask            Iface
172.25.0.1               ether   02:42:d6:4e:96:0f   C                     eth1
10.244.0.3               ether   66:12:13:71:43:b7   C                     cni0
10.33.20.13              ether   02:42:0a:21:14:0d   C                     eth0
10.244.1.0               ether   8e:28:0c:77:39:1a   CM                    flannel.1
10.244.0.2               ether   fe:0c:ff:4e:8a:8b   C                     cni0
10.33.20.7               ether   02:42:0a:21:14:07   C                     eth0
10.33.20.10              ether   02:42:0a:21:14:0a   C                     eth0
10.33.20.4               ether   02:42:0a:21:14:04   C                     eth0
10.33.20.11              ether   02:42:0a:21:14:0a   C                     eth0
k8-multi-node-ttyd-1-20  ether   02:42:0a:21:14:0c   C                     eth0

# 라우트 테이블 확인
$ route
```

#### Pod Networking

* 각각의 파드들은 `bridge`와 연결되며 IP주소를 할당 받는다.
* 각 노드간 파드들은 서로 통신할 수 있는 구조여야 하는데 , 이를 위해서는 일일이 파드가 생성될때 마다 가상케이블을 만들고, 연결하고, namespace에 IP주를 연결하며, 설정하는 작업들을 스크립트로 만들어둬서 파드가 생성될떄마다 이 작업을 하여야 한다.
* 더 개선된 작업으로서는 노드들을 모두 연결하는 라우터를 둬서 특정 IP CIDR로 들어오는 요청에 대해서는 특정 노드로 전달시켜버리는 것이다.
* 수천개가 넘어가면 수동으로 하기 힘들다.
* 중개자 역할을 하는 CNI(Container Network Interface)가 `k8s`에게 스크립트를 파드가 만들어질때 뭘할지 명시하는 내용을 스크립트로 준다.

```sh
# 각각 CNI마다 스크립트는 다름

# [ ADD Section ]
# Create veth pair
ip link add ...

# Attach veth pair
ip link set ...
ip link set ...

# assign ip address
ip -n <namespace> addr add ...
ip -n <namespace> route add ...

# Bring Up Interace
ip -n <namespace> link set ...

# [Delete Section ]
# Delete veth pair
ip link del ...
```

* `kubelet`은 각 노드에서 `container`생성을 담당한다.
* `kubelet`에 CNI 값 확인

```bash
# kubelet
--cni-conf-dir=/etc/cni/net.d
--cni-bin/dir=/etc/cni/bin # 스크립트가 정의되어 있고 실행함

# 실행
./net-script.sh add <container> <namespace>
```

#### CNI In Kubernetes

* CNI 인터페이스를 구현하는 `plugin`을 사용하여 `k8s네트워크`를 설정할 수 있다.
* `CNI Plugin`은 컨테이너를 생성하는 책임을 가진 각 노드의 `kubelet` 서비스에 의해 설정되며 실행된다.
* `kubelet.service`파일을 확인해보면 CNI 네트워크 플러그인 설정 옵션을 확인 할 수 있다.

```bash
ExecStart=/usr/local/bin/kubelet \\
...
--network=plugin=cni \\
--cni-bin-dir=/opt/cin/bin \\
--cni-conf-dir=/etc/cni/net.d
...

$ cat /etc/cni/net.d/10-bridge.conf
ipMasq: NET규칙을 추가해야되는 지 여부
ipam: IPAM구성을 정의 # 파드에 할당할 서브넷 및 IP주소 범위 지정
```
