---
published: true
title: "CKAD 자격증 따기 - 3"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-06-27 19:30"
---

#### CKAD 시험 전날 마지막 정리

**Network 문제**

```bash
$ k run curl-test --image:nginx/curl -l app=test -- sh
# ! 꼭 잊지 말고 ingress 문제는 확인이 필요하다
```

**auth**

```bash
k auth can-i create pods --as michelle
# ! RBAC 문제도 잊지말고 확인
```

**vim**

```bash
set expanttab
set tabstop=2
set shiftwidth=2
```

**bash**

```bash
export do='--dry-run=client -o yaml'

# Now는 CKA때는 안썼는데 종료되는데 느리면 힘들어진다..
export now='--force --grace-period 0'
```

#### Killer.sh

* pod status  확인

```bash
kubectl -n default describe pod pod1 | grep -i status:
```

* helm pending 된거 확인

```bash
helm -n mercury ls -a
```

* network policy 확인

* curl

```bash
k run tmp --restart=Never --rm --image=nginx:alpine -i -- curl http://project-plt-6cc-svc.pluto:3333
```

#### 필요블로그

[파드컨피그맵](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)

[시크릿](https://kubernetes.io/docs/concepts/configuration/secret/)

#### 마치며

마지막 하루 남았는데 화이팅!🙂👍
