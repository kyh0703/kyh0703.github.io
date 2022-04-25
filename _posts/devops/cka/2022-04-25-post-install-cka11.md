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
