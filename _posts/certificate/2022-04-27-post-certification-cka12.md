---
published: true
title: "CKA 자격증 따기 - day11"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-04-27 12:00"
---

#### Certificate API

* 마스터 유저는 요청이 온 유저에게 `CA`를 부여해주고, 해당 유저는 그 `CA`를 사용하여 클러스터에 접근이 가능하다.
* 공유 받은 CA는 유효기간이 존재하며, 만료될때마다 새로운 CSR을 생성하고 서명을 받는 동일한 프로세스를 따름
* 인증을 담당하는 `CA`서버 존재
* `CA`는 키와 인증서 한쌍으로 다른 `CA`에 인증을 부여 할 수 있음
* 보호되어진 서버에 존재하여야 되며, 인증서에 서명할 때마다 해당 서버에서만 로그인이 가능하다.
* 마스터 노드 또한 CA서버임(`kubeadm`이 동일한 작업을 수행)
* k8s에는 인증 절차를 수행하는 내장 API가 있음

**절차**

1. Create CertificateSigningRequest Objec
   * 관리자는 `CertificateSigningRequest`라는 k8s 객체를 생성함

2. Review Request
   * 개체가 모든 인증서를 생성하면 관리자는 모든 요청을 볼 수 있음
3. Approve Request
   * `kubectl`명령으로 승인가능

----

**유저가 관리자에게 요청할때**

```bash
# 유저는 키를 생성
$ openssl genrsa -out jane.key 2048
> jane.key

# 관리자에게 보냄
$ openssl req -new -key jane.key -subj "/CN="

# 관리자는 인증서를 가져옴
cat jane.csr | base64 > encoding.text

# 관리자는 k8s객체 생성
$ cat jane-csr.yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: jane
spec:
  groups:
  - system:authenticated
  usages:
  - digital signature
  - key encipherment
  - server auth
  requeset:
    {encoding.text}

# 요청 확인
$ k get csr

# 허가
$ k certificate approve jane

# 공유
$ k get csr jane -o yaml

# decoding
$ echo "LS0...Qo=" | base64 --decode
```

----

**모든 작업은 `Controller Manager` 가 담당**

Contorller manager

* csr-approving
* csr-signging
* ...

```bash
$ cat /etc/kubernetes/mainifests/kube-controller-manager.yaml
spec:
  containers:
  - command:
    - --cluster-signing-cert-file=
    - --cluster-signing-key-file
```

#### KubeConfig

* kube-apiserver에 TLS요청을 위해선 `.crt, .key`파일이 필요하다.
* 매번 지정하기 어렵기에 `$HOME/.kube/config`에 `key`, `crt`파일 경로를 지정하여 요청마다 반복적으로 옵션을 주지 않게 할 수 있다.

```bash
# TLS 인증파일을 지정한다면
$ k get po
  --server my-kube-playground:6443
  --client-key admin.key
  --client-certificate admin.crt
  --certificate-authority ca.crt
```

```yaml
# $HOME/.kube/config
apiVersion: v1
kind: Config

# default
current-context: dev-user@google

clusters:
- name: my-kube-playground
  cluster:
    certificate-authority: ca.crt # 인증서 경로를 적어주거나
    certificate-authority-data: MIIC... # 직접 데이터를 넣어줄수 있다. base64
    server: https://my-kube-playgroud:6443
      
contexts:
- name: my-kube-admin@my-kube-playground
  context:
    cluster: my-kube-playgroud
    user: my-kube-admin
    namespcae: finance # namespace를 지정할 수도 있다.
    
users:
- name: my-kube-admin
  user:
    client-certificate: admin.crt
    client-key: admin.key
```

`kube config`파일은 3가지 영역으로 구분된다.

* 클러스터
  * 연결할 클러스터 환경
  * 개발, 상품, 구글
* 컨텍스트
  * 클러스터와 유저를 연결 시킴
  * ex) Admin@Production: 매핑시킨 클러스터로 연결
* 유저
  * 관리자
  * 개발유저
  * 사용자

**kubectl은 어떻게 아는가**

* `kubeconfig`파일에 `current-context` 필드를 추가하여 기본 컨텍스트 지정 가능

**명령어**

* 컨피그 구성 확인

```bash
# 기본 
$ kubectl config view

# 지정
$ kubectl config --kubeconfig=my-custom-config
```

* 컨택스트 변경

```bash
k config user-context prod-user@production
```

