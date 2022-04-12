---
published: true
title: "CKA 자격증 따기 - day2"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-12 12:00"
---

#### POD

* 애플리케이션의 단일 인스턴스
* 가장 작은 개체
* 단일 pod에 여러 컨테이너가 올라 갈 수 있음
    * 동일한 네트워크, 동일한 스토리지

```bash
kubectl run nginx --image {image}
```

```yaml
apiVersion: kube API 버전
kind: 만들려는 객체의 유형
metadata: 이름, 레이블 개체등 개체 데이터(사전)
  name: myapp-pod
  lables: 필터링
    app: myapp
    type: front-end
sepc: 사양
  containers: [List/Array]
    - name: nginx
      image: nginx
```



