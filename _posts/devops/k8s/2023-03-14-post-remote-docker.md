---
published: true
title: "docker remote로 연결하기"
categories:
  - Kubernetes
tags:
  - [kubernetes]
toc: true
toc_sticky: true
date: "2023-03-14 09:00"
---

window에서 `docker-desktop`을 설치하여 `WSL`을 사용하다보면 이미지 빌드 시마다 디스크 용량이 늘어나 디스크가 부족한 경우들이 있습니다. 또한 사용하다보면 컴퓨터가 느려지는 느낌이 드는데요. 처음 생각했던 것은 `kubectl`처럼 `docker-cli`도 `api`를 호출하는 것 뿐인데 원격으로 사용할 수 없을까하다 방법을 찾아서 정리합니다.

#### 서버

1. docker 설치 후 `systemctl`명령어를 통한 서버 설정 필요

```bash
systemctl edit docker
```

2. 서버 설정

```bash
[Service]
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 --containerd=/run/containerd/containerd.sock
```

3. 서비스 설정 및 재시작

```bash
systemctl daemon-reload
systemctl restart docker
```

#### 클라이언트

1. [docker-cli설치](https://github.com/StefanScherer/docker-cli-builder/releases)

2. 환경 변수 설정

```bash
export DOCKER_HOST=tcp://100.100.106.141:2375
```

