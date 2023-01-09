---
published: true
title: "CKA 자격증 따기 - day17"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-05-05 12:00"
---

#### Container Networking Interface(CNI)

```bash
1. Create Network Namespace
2. Create Bridge Network/Interface
3. Create VETH Pairs(Pipe, Virtual Cable)
4. Attach vEth to Namespace
5. Attach Oher vEth to Bridge
6. Assign IP Address
7. Bring the interfaces up
8. Enable NAT - IP Masquerade
```

* 도커 역시 여러 네임스페이스를 연결하는 방식과 동일한 방식이다.
* 타 컨테이너 솔루션도 같은 방식으로 네트워크 문제를 해결한다. (`rkt, MESOS`)
* 2 ~ 8번까지 단일 표준 접근 방식으로 `bridge`라고 부름(프로그램이나 스크립트로 만듬)

```bash
# rkt또는 k8s가 세컨테이너를 생성할때마다 브리지 플러그인을 호출하고 전달
bridge add 2e34dcf34 /var/run/netns/23e4dcf34
```

* 위에 있는 `bridge` 프로그램은 CNI용 플러그인이다.
* CNI 플러그인 기본
  * BRIDGE
  * VLAN
  * IPVLAN
  * MACVLAN
  * WINDOWS
  * host-local
  * DHCP
* CNI 플러그인 벤더
  * weaveworks
  * flannel
  * cilium
  * NSX
  * Calico
  * infoblox
* CNI는 컨테이너 런타임이나 플로그인을 위한 몇가지 요소들을 정의한다.
  * 각 컨테이너에 대한 네트워크 네임스페이스 생성을 담당 하도록 지정
  * 컨테이너가 런타임에 연결한 다음 호출해야 하는 네트워크를 식별해야 한다.
  * 컨테이너 런타임은 컨테이너가 추가, 삭제 되면 네트워크 플러그인(bridge)를 호출한다.
  * 네트워크 설정은 JSON 파일 형식으로 관리한다.
  * 모든 컨테이너 런타임은 CNI를 구현해야만한다.

* docker는 `CNI`를 구현하지 않고 `CNM`이라는 자체 표준을 구현

  * 비슷하나 약간의 차이가 있어서 Docker와 통합되지 않음
  * k8s도 아래 방식으로 CNI를 구현

  ```bash
  # cni network가 없어서 아래 명령어는 실패
  $ docker run --network=cni-bridge nginx
  
  # 따라서 직접 만들어서 해결해야됌
  $ docker run --network=none nginx
  $ bridge add 2e43dcf34 /var/run/netns/2e34dcf34
  ```

  
