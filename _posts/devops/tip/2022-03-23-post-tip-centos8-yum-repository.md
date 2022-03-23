---
published: true
title: "CentOS8 Yum Repository 설정하기(Kakao, Disk)"
categories:
  - DevOpsTip
tags:
  - [devops, centos8, repository, kakao, disk]
toc: true
toc_sticky: true
date: "2022-03-23 12:00"
---

### Kakao Repository

```bash
cat <<EOF >/etc/yum.repos.d/CentOS-Kakao.repo
[AppStream]
name=CentOS-Kakao-\$releasever - AppStream
baseurl=http://mirror.kakao.com/\$contentdir/\$releasever-stream/AppStream/\$basearch/os/
gpgcheck=1
enabled=1
gpgkey=http://mirror.kakao.com/centos/RPM-GPG-KEY-CentOS-Official

[BaseOS]
name=CentOS-Kakao-\$releasever - Base
baseurl=http://mirror.kakao.com/\$contentdir/\$releasever-stream/BaseOS/\$basearch/os/
gpgcheck=1
enabled=1
gpgkey=http://mirror.kakao.com/centos/RPM-GPG-KEY-CentOS-Official


[extras]
name=CentOS-Kakao-\$releasever - Extras
baseurl=http://mirror.kakao.com/\$contentdir/\$releasever-stream/extras/\$basearch/os/
gpgcheck=1
enabled=1
gpgkey=http://mirror.kakao.com/centos/RPM-GPG-KEY-CentOS-Official
EOF
```

* yum repository 확인

```bash
$ yum clean all
$ yum repolist
repo id                                                                                           repo name
InstallMedia                                                                                      CentOS Linux 8 - BaseOS
InstallMedia-AppStream                                                                            CentOS Linux 8 - AppStream

# 에러가 나온다면, 다른 repository가 문제가 있을 수 있으니 yum.repos.d디렉토리안에 repository를 이동
$ yum grouplist
CentOS-8 - AppStream                            3.4 MB/s |  20 MB     00:05    
CentOS-8 - Base                                 435 kB/s | 3.9 kB     00:00    
CentOS-8 - Extras                               266 kB/s | 3.0 kB     00:00 
```

### Local Disk

Disk image를 통해 Repostiry를 설정하는 방법입니다. 아래 링크를 참조하였습니다.

> https://servermon.tistory.com/170

* base repository 따로 보관

```bash
sudo bzip2 /etc/yum.repos.d/CentOS-*.repo
```

* 디렉토리생성

```bash
mkdir /localrepo
```

* iso 삽입 위치 확인

```bash
# df -h or mount를 통해 위치를 확인한다.
$ df -h
Filesystem           Size  Used Avail Use% Mounted on
devtmpfs              30G     0   30G   0% /dev
tmpfs                 30G     0   30G   0% /dev/shm
tmpfs                 30G   19M   30G   1% /run
tmpfs                 30G     0   30G   0% /sys/fs/cgroup
/dev/mapper/cl-root   50G  4.4G   46G   9% /
/dev/mapper/cl-home  320G  2.3G  318G   1% /home
/dev/xvda1           976M  192M  717M  22% /boot
tmpfs                5.9G  4.6M  5.9G   1% /run/user/1000
tmpfs                5.9G  1.2M  5.9G   1% /run/user/42
/dev/sr0             7.7G  7.7G     0 100% /localrepo
tmpfs                5.9G  4.0K  5.9G   1% /run/user/0


$ mount
.
.
.
gvfsd-fuse on /run/user/1000/gvfs type fuse.gvfsd-fuse (rw,nosuid,nodev,relatime,user_id=1000,group_id=1000)
/dev/sr0 on /run/media/ipron/CentOS-8-2-2004-x86_64-dvd type iso9660 (ro,nosuid,nodev,relatime,nojoliet,check=s,map=n,blocksize=2048,uid=1000,gid=1000,dmode=500,fmode=400,uhelper=udisks2)
/dev/sr0 on /localrepo type iso9660 (ro,relatime,nojoliet,check=s,map=n,blocksize=2048,uid=1000,gid=1000,dmode=500,fmode=400)
```

* 마운트 하기

```bash
mount /dev/sr0 /localrepo
```

* 복사하기

```bash
cp /localrepo/media.repo /etc/yum.repos.d/local.repo
```

* 권한주기

```bash
chmod 644 /etc/yum.repos.d/local.repo
```

* `local.repo` 수정

```bash
cat <<EOF > /etc/yum.repos.d/local.repo
[InstallMedia]
name=CentOS Linux 8 - BaseOS
metadata_expire=-1
gpgcheck=1
enabled=1
baseurl=file:///localrepo/BaseOS/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial

[InstallMedia-AppStream]
name=CentOS Linux 8 - AppStream
metadata_expire=-1
gpgcheck=1
enabled=1
baseurl=file:///localrepo/AppStream/
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
EOF
```

* yum repo 확인

```bash
$ yum clean all
$ yum repolist
repo id                                                                                           repo name
InstallMedia                                                                                      CentOS Linux 8 - BaseOS
InstallMedia-AppStream                                                                            CentOS Linux 8 - AppStream

# 에러가 나온다면, 다른 repository가 문제가 있을 수 있으니 yum.repos.d디렉토리안에 repository를 이동
$ yum grouplist
CentOS Linux 8 - BaseOS                          85 MB/s | 2.2 MB     00:00    
CentOS Linux 8 - AppStream                      106 MB/s | 5.7 MB     00:00
```

### 마치며

`centos8`로 repository설치하는게 안 보여서 해당 문서 추가하였습니다👌
