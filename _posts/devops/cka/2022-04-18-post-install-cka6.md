---
published: true
title: "CKA 자격증 따기 - day5"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-18 12:00"
---

#### Node Selector

* 크기가 큰 파드를 특정 노드에 배치시키고 싶을 떄 사용

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    - name: nginx
      image: nginx
  # 노드에 라벨링
  nodeSelector:
    size: Large
```

* 노드에 레이블 정하기

```bash
k lable no node-1 size=Large
```

* 요구사항이 복잡하면 `Node affinity`를 사용해야 한다
    * Medium Or Large
    * Not Small

#### Node Affinity

pod가 특정 노드에서 호스팅 되도록 하기 위해 사용

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp
spec:
  containers:
    - name: nginx
      image: nginx
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: size
                operator: In # In, NotIn, Exist(values 없음)
                # Large Or Mediaum 
                values:
                  - Large
                  - Medium
```

**노드선호도**

Avaliable

* requireDuringSechedulingIgnoredDuringExecution(Type1)
* preferredDuringSechedulingIgnoredDuringExecution(Type2)

Planned

* requireDuringSechedulingRequiredDuringExecution(Type3)

|        | DuringScheduling(파드가 존재하지않고 생성될때) | DuringExecution(파드가 실행되어있을 떄) |
| ------ | ---------------------------------------------- | --------------------------------------- |
| Type 1 | Required(일치하는 노드가 없으면 배포 X)        | Ignored                                 |
| Type 2 | Preferred(없으면 노드selector 무시하고 배포)   | Ignored                                 |
| Type 3 | Required                                       | Required(포드는 추출되거나 죽음)        |

