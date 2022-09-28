---
published: true
title: "k8s 조금 더 쉽게 쓰기"
categories:
  - Kubernetes
tags:
  - [kubernetes]
toc: true
toc_sticky: true
date: "2022-09-28 09:00"
---

#### Kubeconfig

```bash
~/.kube/config
```

명령을 통하거나 수동으로 여러 개의 `kubeconfig`파일을 병합하여 `context` 구성

![image-20220928094847492](../../../assets/images/posts/2022-09-28-post-k8s-cozy/image-20220928094847492.png)

![image-20220928094501358](../../../assets/images/posts/2022-09-28-post-k8s-cozy/image-20220928094501358.png)

```bash
k config use-context {context}
```

위의 명령어를 통해 여러 클러스터에 접근 할 수 있습니다.

### kubectl

[k8s doc](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

#### Bash

```bash
source <(kubectl completion bash) # setup autocomplete in bash into the current shell, bash-completion package should be installed first.
echo "source <(kubectl completion bash)" >> ~/.bashrc # add autocomplete permanently to your bash shell.
```

```bash
alias k=kubectl
complete -o default -F __start_kubectl k
```

#### Zsh

```bash
source <(kubectl completion zsh)  # setup autocomplete in zsh into the current shell
echo '[[ $commands[kubectl] ]] && source <(kubectl completion zsh)' >> ~/.zshrc # add autocomplete permanently to your zsh shell
```

#### 적용 확인

적용 후 `tab`키를 통해서 자동완성으로 `resource`들을 확인 할 수 있습니다.

![image-20220928094031158](../../../assets/images/posts/2022-09-28-post-k8s-cozy/image-20220928094031158.png)

### k9s

**kubectl TUI**

```bash
$k9s -n bcloud
```

![image-20220928093205207](../../../assets/images/posts/2022-09-28-post-k8s-cozy/image-20220928093205207.png)

![image-20220928093705434](../../../assets/images/posts/2022-09-28-post-k8s-cozy/image-20220928093705434.png)

> `?`를 통해서 사용 명령어 확인이 가능합니다.
