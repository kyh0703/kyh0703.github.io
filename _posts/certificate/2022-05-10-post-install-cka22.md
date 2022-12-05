---
published: true
title: "CKA 자격증 따기 - day21"
categories:
  - Certificate
tags:
  - [certificate, CKA]
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

#### Worker Node Failure

- 노드 장애시의 Trobule Shooting을 배워보자
- 노드가 만약 `NotReady` 상태라면, `describe` 명령어를 사용해 노드의 상태를 보자.
- `top`, `df -h` 명령어를 사용해 노드의 CPU, 메모리와 디스크를 확인해보자
- `service kubelet status`를 사용해 쿠버렛의 상태를 확인하자
- `sudo journalctl -u kubelet`을 사용해 쿠버렛에 이상이 있는지 확인하자
- 이상을 수정했다면 `systemctl daemon-restart` `systemctl restart kubelet`
