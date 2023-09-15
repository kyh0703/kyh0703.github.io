---
published: true
title: "helm CI/CD 배포 전략"
categories:
  - Kubernetes
tags:
  - [kubernetes]
toc: true
toc_sticky: true
date: "2023-09-15 09:00"
---

`k8s`를 통해 배포를 하기 위해서는 다양한 전략들을 사용 할 수 있습니다. 그래서 많은 회사들은 `devops` 통해 배포 전략을 수립하는데요. 기존 엔지니어링 팀이 있는 회사에 경우 `package`로 묶어서 `private`한 환경에 배포하는 경우들이 많습니다. 자체 서비스를 고객들을 대상으로 클라우드에서 배포할 경우에는 `gitops`를 두고 `main` 브랜치만 사용할 수 있으나, `private`한 환경에 배포와는 맞지 않을 수 있습니다. 저도 다양한 배포 전략들을 검색하고 조사하여 아래와 같은 배포 전략을 수립하였는데요. 해당 배포 전략을 공유할려고 합니다

## Git Flow VS Github Flow

#### git flow

![img](https://blog.kakaocdn.net/dn/ebj1jK/btrLD1enloU/wTI6Zq2iPLHI7fQOmjIeKk/img.png)

#### github flow

![img](https://blog.kakaocdn.net/dn/chZkih/btrLDZ8HnfJ/Lw4h7KftKky6jxcz4U5ft0/img.png)

기업에서 개발 시 크게 위와 같은 두 가지 개발 방식을 수립하게 됩니다. `github flow`에 경우 `main`브랜치를 두고 해당 기능을 바로바로 반영하여 동작하게 됩니다. `gitops`를 구축하는 회사들은 대부분 `github flow`방식을 사용하게 됩니다. `main`브랜치에 바로 반영되어야 되기에 많은 테스트 코드와 통합 검증 확인이 필수입니다. 그와 반대로 전통적인 `git flow`방식은 `release`브랜치를 통해 `version fix`후 배포하게 되어있습니다. 만약 클라우드 환경에서 제품을 고객들에게 배포하는 환경이라면 `github flow`가 좀 더 적합할 것으로 보입니다. `private`한 환경에서도 배포가 되어야 된다면 `git flow`가 좀 더 모델에 맞습니다🤣

## Helm Chart VS Kustomize

차트를 배포하기 위해서는 `helm`을 사용하게 됩니다. 배포 환경 별로 구성하기 위해서는 `kustomize`를 같이 사용하는 회사들도 많이 있습니다. 
