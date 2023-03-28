---
published: true
title: "ubuntu ssh 접속이 안될 때"
categories:
  - Tip
tags:
  - [tip, ubuntu]
toc: true
toc_sticky: true
date: "2023-02-06 10:00"
---

서버도 잘 설치하고 sshd 포트도 열려있는 것도 확인했는데 접속이 안될 때가 있습니다. 그럴 땐 당황하지 말고 아래와 같이 명령어를 날려줍니다.

```bash
$ sudo service sshd status
```

위와 같이 쳤을 때 `Could not load host key` 다음과 같은 문구가 있다면 다음 명령어를 입력하세요.

```bash
ssh-keygen -f /etc/ssh/ssh_host_rsa_key -t rsa -N ""
ssh-keygen -f /etc/ssh/ssh_host_ecdsa_key -t ecdsa -N ""
ssh-keygen -f /etc/ssh/ssh_host_ed25519_key -t ed25519 -N "" 
```

재시작

```bash
$ sudo service sshd restart
```

