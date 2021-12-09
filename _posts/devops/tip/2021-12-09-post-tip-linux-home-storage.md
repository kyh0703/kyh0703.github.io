---
title: "리눅스 /home삭제 /root용량 늘리기"
categories:
  - DevOpsTip
tags:
  - [devops, lvm, home, disk, storage]
toc: true
toc_sticky: true
date: "2021-12-09 16:58"
---

``VM``을 확인하다보면 ``LVM``이 ``/root``, ``/home``으로 분리되어 디스크가 모자를 때가 있습니다. 이럴 땐 home의 용량을 줄이거나 삭제 후 ``/root``로 확장할 수 있습니다.

#### 용량 확인

```bash
$> df -h
Filesystem               Size  Used Avail Use% Mounted on
devtmpfs                 7.8G     0  7.8G   0% /dev
tmpfs                    7.8G   17M  7.8G   1% /dev/shm
tmpfs                    7.8G  766M  7.1G  10% /run
tmpfs                    7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/mapper/centos-root   50G   44G  6.2G  88% /
/dev/xvda1              1014M  150M  865M  15% /boot
/dev/mapper/centos-home   84G  2.5G   82G   3% /home
tmpfs                    1.6G     0  1.6G   0% /run/user/0
tmpfs                    1.6G     0  1.6G   0% /run/user/1000
```

#### 백업

```bash
tar zcvf home.tar ./home
```

백업은 정말 중요합니다. 가능하다면 홈디렉토리 및 ``xencenter``로 스냅샷을 꼭 찍어서 문제가 생길 시 복구가 가능하도록 만반의 준비를 합니다.

#### UNMOUNT

```bash
unmount /dev/mapper/centos-home
```

#### 로지컬 볼륨 삭제

```bash
lvremove /dev/mapper/centos-home
```

#### LVM /root확장

```bash
lvextend -l +100%FREE -r /dev/centos/root
```

#### 용량 확인

```bash
$> df -h
Filesystem               Size  Used Avail Use% Mounted on
devtmpfs                 7.8G     0  7.8G   0% /dev
tmpfs                    7.8G   17M  7.8G   1% /dev/shm
tmpfs                    7.8G  766M  7.1G  10% /run
tmpfs                    7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/mapper/centos-root  124G   44G 88.2G  88% /
/dev/xvda1              1014M  150M  865M  15% /boot
tmpfs                    1.6G     0  1.6G   0% /run/user/0
tmpfs                    1.6G     0  1.6G   0% /run/user/1000
```

### 마치며

장비를 누군가는 사용하고 있을 수 있습니다. 세심한 배려로 ``who``로 사용자를 배려해주고 꼭 백업을 생활화하시면 문제가 생겼을때도 의연하게 대처할 수 있습니다!👏
