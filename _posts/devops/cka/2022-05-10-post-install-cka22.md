---
published: true
title: "CKA 자격증 따기 - day21"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-05-10 12:00"
---

#### Application Failure

* 웹 애플리케이션 파드와 DB 파드가 있을 때 가장 빈번하게 일어날 수 있는 이슈가 **연결 관련**이다.

- 사용자가 웹 애플리케이션 서비스로 접근하고 웹 애플리케이션이 DB 서비스로 접근할 때 이슈가 생길 수 있다.
- 이를 위해, Service 체크, Pod 체크의 순서로 하여 이슈가 있는지 확인해볼 수 있다.
- `kubectl logs {pod_name} -f --previous` 명령어는 파드의 지난 로그들도 보여준다.

#### Control Plane Failure

- Control Plane 컴포넌트들을 확인하기 위해서 다음과 같은 명령어를 사용하여 상태를 확인해볼 수 있다.
- `service kube-apiserver status`
- `service kube-controller-manager status`
- `service kube-scheduler status`
- kubelet이나 kube-proxy는 워커 노드에 접근하여 확인해볼 수 있다.
- `service kubelet status`
- `service kube-proxy status`
- 로그를 명령어로 불러서 해당 Control Plane 컴포넌트의 로깅을 확인해볼 수도 있다.
- `kubectl logs kube-apiserver-master -n kube-system`
