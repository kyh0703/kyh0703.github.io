---
title: "k8s 'cannot allocate memory' 이슈"
categories:
  - DevOpsTip
tags:
  - [devops, k8s, docker]
toc: true
toc_sticky: true
date: "2021-12-07 22:58"
---

### Linux Cannot Allocate Memory

k8s를 centOS7버전을 사용하여 배포하던 도중 아래와 같은 에러가 발생하여 내용 확인 및 해결 공유 드려요 :happy:

#### 에러

`mkdir /sys/fs/cgroup/memory/docker/fe4159ed6f4ec16af63ba0c2af53ec9c6b0c0c2ac42ff96f6816d5e28a821b4e: cannot allocate memory\` 

#### 원인

Redhat 7에서 최근에 발견 된 리눅스 커널 공식적인 이슈번호를 확인하여 보니  `cgroup`이 제대로 동작하지 않는 버그였습니다.

> [이슈 확인]
>
> https://github.com/docker/for-linux/issues/841

#### 해결방안

**Linux 3.10이상의 커널 버전이 필요(RHEL7)**

1. yum update

```bash
yum update
reboot
```

2.  kernal boot option 추가

```bash
sudo /sbin/grubby --update-kernel=ALL --args='cgroup_enable=memory cgroup.memory=nokmem swapaccount=1'
```

3. over 커널 모드 활성화

```bash
echo "overlay" | sudo tee -a /etc/modules-load.d/overlay.conf
```

4. grup 구성

```bash
sudo grub2-set-default 0
sudo grub2-mkconfig -o /etc/grub2.cfg
```

**RHEL8 이슈 해결**

### 마치며

친숙한 `centOS7`으로 환경을 구성하다보니 커널 이슈와 관련하여 확인하지 못했습니다. 해결방안은 찾았지만 안정적인 서비스를 위해 `centOS8`로 재 구성하는게 제일 좋은 방안이 될 꺼 같습니다:sweat:
