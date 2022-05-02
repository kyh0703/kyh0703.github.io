---
published: true
title: "CKA 자격증 따기 - day15"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-05-02 12:00"
---

#### Linux Networking Basics

#### Swiching

* A와 B라는 시스템이 서로 통신하기 위해선 스위치가 필요
* 스위치는 A, B시스템의 랜카드에 있는 정보를 연결
* 스위치로 A와 B시스템이 연결되면 `ip addr`명령어를 사용하여 고유 IP주소를 부여할 수 있다. 
* 각자 고유의 IP까지 생성되고 스위치에 연결되있으면 스위치를 통해 상호 통신이 가능

![image-20220502124542894](../../assets/images/posts/2022-05-02-post-install-cka16/image-20220502124542894.png)

#### Routing

* 한 네트워크 시스템이 다른 네트워크 시스템과 연결하기 위해서는 라우터가 필요하다
* 라우터는 두 개의 네트워크를 연결하는데 사용
* 라우터는 스위치에 연결될 떄 해당 네트워크의 IP를 할당받는다.
* 연결된 라우팅을 통해 네트워크 간 통신이 가능하다

![image-20220502124559312](../../assets/images/posts/2022-05-02-post-install-cka16/image-20220502124559312.png)

#### GATEWAY

* B에서 C로 패킷을 보낼때 라우터가 어떤 네트워크에 존재할까?
* 라우터는 그냥 장비일 뿐이다.

* 네트워크가 방이었다면 게이트웨이는 외부 세게로의 다른 네트워크나 다른 네트워크로 통하는 문
* 라우터 장비에 있는 게이트웨이에 명시된 IP주소에 따라 라우트 장비로 들어오는 IP대역을 지정할 수 있다.
* 라우팅 테이블에 `Destination IP`를 `0.0.0.0 or default` 로 지정하면 어떤 퍼블릭 네트워크든 인터넷이 연결되어 있는 어떤 곳으로도 패킷을 전송할 수 있다는 의미가 된다.

![image-20220502124626935](../../assets/images/posts/2022-05-02-post-install-cka16/image-20220502124626935.png)

![image-20220502125240566](../../assets/images/posts/2022-05-02-post-install-cka16/image-20220502125240566.png)

* linux에서 한 인터페이스에서 다음 인터페이스로 전달되지 않는다.

* 명시적으로 허용
    * /proc/sys/net/ipv4/ip_forward 0 (X)
    * /proc/sys/net/ipv4/ip_forward 1 (O)

* 변경사항을 위지할려면
    * /etc/network/interfaces 파일 설정
