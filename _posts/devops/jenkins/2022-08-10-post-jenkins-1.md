---
published: true
title: "jenkins - 2022"
categories:
  - Jenkins
tags:
  - [jenkins]
toc: true
toc_sticky: true
date: "2022-08-08 11:00"
---

### SSH 리모트 호스트 제어하기

SSH로 리모트 호스트를 제어하기 위해선 SSH 플러그인을 먼저 설치해줍니다.

![image-20220812202726845](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220812202726845.png)

 SSH HOST를 추가합니다.

![image-20220812203227280](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220812203227280.png)

### Jenkins & Maven(CENTOS7)

1. epel-release 설치

```bash
yum install -y epel-release
```

2. java  설치

```bash
yum install java-11-openjdk-devel.x86_64
```

3. bash_profile

```bash
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
        . ~/.bashrc
fi
M2_HOME=/opt/maven
M2=/opt/maven/bin
JAVA_HOME=/lib/jvm/java-11-openjdk-11.0.10.0.9-1.el7_9.x86_64
# User specific environment and startup programs

PATH=$PATH:$HOME/bin:$JAVA_HOME:$M2_HOME:$M2

export PATH                     
```

4. maven 플러그인 설치

![image-20220812204959367](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220812204959367.png)

5. jenkins 설정

![image-20220812205436594](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220812205436594.png)

6. 프로젝트 확인

![image-20220812205635140](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220812205635140.png)

### Jenkins & Tomcat

1. tomcat 장비 설치
2. `deploy to container` plugin 설치
3. `빌드 후 조치` 추가

![image-20220813001546671](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220813001546671.png)

### Jenkins & Git

![image-20220814174034012](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220814174034012.png)

* Poll SCM: 빌드 정책에 따라 지속적 확인(cronjob)
* BUild Periodically: 지속적인 감시

![image-20220814175038425](../../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220814175038425.png)

빌드가 주기적으로 감시하여 변경사항이 있으면 재 빌드 시킴.

### Jenkins & Security Value

![image-20220816112339184](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816112339184.png)

![image-20220816115016251](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816115016251.png)

### Jenkins & Ansible

![image-20220816145214150](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816145214150.png)

![image-20220816145925731](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816145925731.png)

![image-20220816145946344](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816145946344.png)

환경 변수도 넣을 수 있다.

### Jenkins & Color

![image-20220816150252321](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816150252321.png)

![image-20220816155021399](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816155021399.png)

![image-20220816155033064](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816155033064.png)

### Jenkins & Security

**유저가입허용**

![image-20220816174744947](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816174744947.png)

**보안플러그인 설치**

![image-20220816175049315](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816175049315.png)

![image-20220816175158676](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816175158676.png)

![image-20220816175217441](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816175217441.png)

플러그인 설치 후에는 로그인 시 `access denine`이 발생한다.

![image-20220816175913709](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816175913709.png)

롤을 추가한다.

![image-20220816180021714](../../assets/images/posts/2022-08-10-post-jenkins-1/image-20220816180021714.png)
