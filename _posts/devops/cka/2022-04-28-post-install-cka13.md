---
published: true
title: "CKA 자격증 따기 - day12"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-04-28 12:00"
---

#### API Groups

* k8s API 그룹은 목적에 따라 여러 그룹으로 나뉘어짐
    * `metrics`, `/healthz`, `/version`, `/api`, `/apis`, `/logs`...
* 그룹은 크게 `core`, `named`그룹으로 이루어짐
* `core`그룹에는 `namespace, pod, replicaset, event, endpoint, node, binding, pv, pvc, configmap, secret, service` 등으로 이루어짐
* `name`그룹은 `app, extension, networking, stroage, authentication, certificates`등으로 이루어짐

#### kubectl proxy

* 유저가 `kube-apiserver`에 접근하기 위해서 인증서를 가지고 API요청시에 인증서를 지정하여아한다.
* 이 대신 로컬에 kubectl proxty가 이를 대행 할 수있다.
* `kube proxy` != `kubectl proxy`
* `kube proxy`는 파드와 서비스를 다른 노드들과 연결하는 오브젝트

#### Authorization

* 클러스터에 접근하는 다양한 유저(관리자, 봇, 사용자)에게 접근 권한을 달리 주기 위함
    * 삭제 권한
    * 네트워킹 삭제
* 다양한 인증 메커니즘을 제공
    * Node
    * ABAC
    * RBAC
    * Webhook

**Node**

* 노드에 접근 권한을 주기위해 `Node Authorizer`라는 것이 존재
* `kubelet`이 `kube-apiserver`에 다양한 요청을 보낼 수 있는데. 이를 위해 `Node`간 접근을 위해 `Node authorizer`가 필요

**ABAC(Atrributed Based Access Control)**

* 속성기반 엑세스 제어 구성

* JSON 포맷으로 특정유저가 접근 할 수 있는 정책을 정의해 API서버에 저장시킬 수 있음

```json
// 수동으로 편집 후 kube-apiserver 재시작 필요
{"kind": "Policy", "spec": {"user": "dev-user", "namespace": "*", "resource": "pods", "apiGroup": "*"}}

{"kind": "Policy", "spec": {"user": "dev-user2", "namespace": "*", "resource": "pods", "apiGroup": "*"}}
```

* 유저마다 파일로 유저의 접근 권한을 지정할 수 있으며 이파일들을 `kube-apiserver`에서 관리하는 것이 ABAC

**RBAC**(Role base Access Control)

* 역할기반 엑세스제어
* 사용자 또는 그룹을 권한 집합과 연결함
* 사용자들에게 역할을 부여하여 그 역할에 맞는 권한을 미리 부여 `Service Role Object`

* 일반적인 방법

**Webhook**

* 외부에서 웹 훅으로 클러스터에 접근 할수 있는 Authorization

**AlwaysAllow**

* 모든 요청 허용

**AlwaysDeny**

* 모든 요청 거부

----

**사용법**

* 권한 부여는 `kubeapi`의 인증모드옵션(`--authorization-mode=`)을 사용하며 지정하지 않으면 `AlwaysAllow`로 설정되어있음
* 여러 모드를 구성한 경우 `,`로 구분함
* 여러개 일 경우 거부할 때마다 다음 요청으로 이동
* 승인될 경우 사용자에게 권한 부여
