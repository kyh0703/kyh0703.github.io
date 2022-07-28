---
published: true
title:  "window zsh 사용하기"
categories:
  - Tip
tags:
  - [tip, window, zsh]
toc: true
toc_sticky: true
date: "2022-07-28 10:00"
---

윈도우에서 `gcc` 빌드라던가 리눅스 환경처럼 꾸며주면 평소 작업을 원활하게 할 수 있습니다. 어떻게 하는지 알아봅시다.

* MYSYS2 설치

![image-20220728173915458](../../assets/images/posts/2022-07-28-post-window-zsh/image-20220728173915458.png)

MYSYS2를 먼저 설치해줍니다.

* 패키지 설치

```bash
pacman -sSyu
```

* gcc 설치

```bash
pacman -S mingw-w64-x86_64-gcc
```

* Oh my zsh 설치

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

* [powerlevel10k](https://github.com/romkatv/powerlevel10k#installation) 설치

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
```

* Set theme

```bash
# ~/.zshrc
[powerlevel10k]
(https://github.com/romkatv/powerlevel10k#installation)
```

* vscode 설정

    ![image-20220728181349241](../../assets/images/posts/2022-07-28-post-window-zsh/image-20220728181349241.png)

