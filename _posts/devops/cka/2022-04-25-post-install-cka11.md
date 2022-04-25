---
published: true
title: "CKA 자격증 따기 - day10"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-24 12:00"
---

#### Security Primitives

`kube-apiserver`는 앞단에서 우리와 상호작용한다. 

`kube-apiserver`는 첫번쨰 방어선으로써 API서버 자체에 대한 엑세스를 제어해야 한다.

`kube-apiserver`를 주축으로 `kubelet, etcd, controller-manager, kube-proxy, kube-scheduler`와의 통신에는 TLS인증이 필요하다.

기본적으로 모든 `pod`들은 클러스터 내 다른 모든 `pod`들에 접근 할 수 있지만, 네트워크 정책을 사용하여 엑세스를 제안할수 있음

**인증**

* FIles: ID & PASSWORD, ID & TOKEN

* Certificate, External Authentication provider - LDAP

* Service Account

**인증 완료 후 권한 부여**

* RBAC(Role Based Access Control) Authorization
* ABAC(Attribute Based Access Control) Authorization
* Node Authorization
* Webhook Mode

#### Authentication

* 모든 사용자의 엑세스는 `kube-apiserver`를 거친다.
* `kube-apiserver`에는 정적 파일에 유저 정보와 유저 정보 + 토큰을 관리하는 기능을 제공
* 이는 가장 쉬운 방법이며 `.csv`파일에 `비밀번호, 유저이름, 유저ID` 순으로 기록 하고 `kube-apiserver`에 `--basic-auth-file=user-details.csvc`를 지정

```csv
password123,user1,u0001,{group}
```

```bash
# 직접 argument를 지정 후 재시작
kube-apiserver --basic-auth-file=user-detail.csv

# yaml파일 변경하면 자동으로 재시작
/etc/kubernetes/manifests/kube-apiserver.yaml
- command:
  - --basic-auth-file=user-detail.csv
```

* 또한 token으로도 인증이 가능하다. `토큰, 비밀번호, 유저이름, 유저아이디` 순으로 기록하며 `--token-auth-file=user.details.csv`로 지정
* `requst`시 `Authorization: Token` 전달

> 방법은 위와 동일하다

* 정적파일에 일반 텍스트를 저장하는 이 인증은 안전하지 않으므로 권장되지 않음
