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
```

#### 마치며

마지막 하루 남았는데 화이팅해서 잘 마무리 되고 더 행복해지길..
