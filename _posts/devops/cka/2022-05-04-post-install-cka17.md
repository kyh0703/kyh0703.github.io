---
published: true
title: "CKA 자격증 따기 - day16"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-05-04 12:00"
---

#### Network Namespace

* 네트워크 네임스페이스는 도커와 같이 네트워크 독립성을 위해 사용된다.
* 호스트를 집으로 상상해보면 네임스페이스는 집 안의 방이다.
* 방안의 자식들은 자기 방만 볼 수 있고, 부모는 모든 집안을 볼 수 있다.
* 필요하다면 방을 연결 시킬 수도 있다.
* 호스트는 라우팅 테이블과 ARP 테이블을 갖는다.
* 컨테이너는 자신만의 라우팅 테이블과 ARP 테이블을 갖는다.
* 컨테이너 안의 네트워크는 독자적인 네트워크 체계이다.

```bash
# namespace 생성
$ ip netns add red

# namespace 조회
$ ip netns
```

#### Process Namespace

* 호스트 안에 프로스세를 만들고 그 안에 네임스페이스를 줬을떄
* 컨테이너 안에서 보면 프로세스는 하나이다.
* 호스트 안에 프로스세를 확인해보면, 컨테이너 안의 프로세스를 포함한 모든 프로스세를 확인 할 수 있다.
* 같은 프로세스가 다른 ID로 컨테이너 안과 밖에 동작하고 있는 것이다.
* 이것이 네임스페이스가 동작하는 원리

#### Exec in Network Namespace

```bash
# 호스트내 존재하는 eth0 인터페이스와 루프백 인터페이스 조회
$ ip link

# 네임스페이스 정보 확인
$ ip nents exec red ip link

# 호스트의 전체 네트워크 확인
# 컨테이너 안에서는 못봄
$ arp

# 두 네임스페이스간의 연결을 위해서 가상 인터페이스 생성
# veth-red == veth-blue
$ ip link add veth-red type veth peer name veth-blue

# 설정
$ ip link set veth-red netns red
$ ip link set veth-blue nents blue

# IP 할당
$ ip -n red addr add 192.168.15.1 dev veth-red
$ ip -n blue addr add 192.168.15.2 dev veth-blue

# 인터페이스 up
$ ip -n red link set veth-red up
$ ip -n blue link set veth-blue up

```

* 여러개의 네임스페이스를 연결하기 위해서는 `가상 스위치`를 만들어서 연결시킨다.
* 가상스위치
  * Linux Bridge
  * Open vSwitch

```bash
# 브리지 생성
$ ip link add v-net-0 type bridge

# IP 할당 및 업
ip link set dev v-net-0 up
```

* 도커의 가상인터페이스의 네트워크 바인딩 구조

#### Docker Networking

```bash
# none: 네트워크 생성 X
# 네트워크가 없기에 호스트든 컨테이너든 네트워크 접근이 안됌
docker run --network none nginx

# host: 호스트와 네트워크 동일(Linux만 가능)
docker run --network host nginx

# bridge(default): 내부 사설망이 생성
# 도커 호스트와 컨테이너가 연결됨
docker run nginx
```

* docker는 호스트에 설치되면 기본적으로 `bridge`라는 내부 사설 네트워크가 생성됌
* `docker network ls`로 `bridge` 확인 가능
* 호스트에서는 `docker0`이라는 인터페이스 확인 가능

* `docker0`에 `container`와 가상 케이블을 생성하여 붙임
* 도커 컨테이너가 생성되면 `docker0`과 컨테이너를 연결함
* 호스트와 연결을 위해선 `port foward`가 필요

```bash
# 포트포워드
$ docker run -p 8080:80 nginx

$ iptables \
-t nat \
-A PREROUTING \
-j DNAT \
--dport 8080 \
--to-destination 80

$ iptables \
-t nat \
-A DOCKER \
-j DNAT \
--dport 8080 \
--to-destination 172.17.0.3:80
```

