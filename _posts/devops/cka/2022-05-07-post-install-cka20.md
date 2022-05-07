---
published: true
title: "CKA 자격증 따기 - day19"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-05-07 12:00"
---

#### CNI weave

* 다른 노드에 있는 파드간의 통신을 위해서 라우팅 테이블로는 100개가 넘는 노드의 네트워크와 게이트웨이를 일일이 정의하기란 쉽지 않다.
* 이 문제를 해결하기 위해 CNI Plugin이 필요하다.
* `weave`는 각 노드에 `agent`를 배치한다. 이 `agent`들은 서로 연결되어 있고, 특정 노드에서 나가는 패킷을 `agent`가 가로챈다.
* `agent`들은 대상 주소화 어느 노드에 위치하는지 알고 있다. 노드에 자체 `bridge`를 만들고 이름을 지정함
* 그리고 이 패킷을 한번 포장 한 다음 전달 후 전달 받은 측에서 이 패킷을 풀어서 원본을 파드에게 전달한다.
* `agent`끼리 연결 되어 있고 이를 위해 `CNI Plugin`이 이러한 네트워크를 담당해주기 때문이다.

#### Devploy Weave

* `weave`는 수동으로 클러스터 내 명령을 통해 서비스나 데몬으로 각 노드에 배포될수 있다.
* 만약 클러스터에 `mater`노드와 `worker`노드에 배포되어 있고, `control plan component`가 배포되있다면 `weave`를 배포 할 수 있다.

```bash
kubectl apply -f -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')
```

* `weave peers`라고 하는 데몬셋 배포
