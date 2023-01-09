---
published: true
title: "CKA 자격증 따기 - day10"
categories:
  - Certificate
tags:
  - [Certificate, CKA]
toc: true
toc_sticky: true
date: "2022-04-24 12:00"
---

#### Security Primitives

`kube-apiserver`는 앞단에서 우리와 상호작용한다.

`kube-apiserver`는 첫번쨰 방어선으로써 API서버 자체에 대한 엑세스를 제어해야 한다.

`kube-apiserver`를 주축으로 `kubelet, etcd, controller-manager, kube-proxy, kube-scheduler`와의 통신에는 TLS인증이 필요하다.

기본적으로 모든 `pod`들은 클러스터 내 다른 모든 `pod`들에 접근 할 수 있지만, 네트워크 정책을 사용하여 엑세스를 제안할수 있음

**인증**

- FIles: ID & PASSWORD, ID & TOKEN

- Certificate, External Authentication provider - LDAP

- Service Account

**인증 완료 후 권한 부여**

- RBAC(Role Based Access Control) Authorization
- ABAC(Attribute Based Access Control) Authorization
- Node Authorization
- Webhook Mode

#### Authentication

- 모든 사용자의 엑세스는 `kube-apiserver`를 거친다.
- `kube-apiserver`에는 정적 파일에 유저 정보와 유저 정보 + 토큰을 관리하는 기능을 제공
- 이는 가장 쉬운 방법이며 `.csv`파일에 `비밀번호, 유저이름, 유저ID` 순으로 기록 하고 `kube-apiserver`에 `--basic-auth-file=user-details.csvc`를 지정

```csv
password123,user1,u0001,{group}
```

```bash
# 직접 argument를 지정 후 재시작
kube-apiserver --basic-auth-file=user-detail.csv

# yaml파일 변경하면 자동으로 재시작
/etc/kubernetes/manifests/kube-apiserver.yaml
- command:
  - --basic-auth-file=user-detail.csv
```

- 또한 token으로도 인증이 가능하다. `토큰, 비밀번호, 유저이름, 유저아이디` 순으로 기록하며 `--token-auth-file=user.details.csv`로 지정
- `requst`시 `Authorization: Token` 전달

> 방법은 위와 동일하다

- 정적파일에 일반 텍스트를 저장하는 이 인증은 안전하지 않으므로 권장되지 않음

#### TLS Basic

* 인증서는 거래중 두 당사자 간의 신뢰를 보장하는데 사용

* 유저가 로그인 하려 할 때 네트워크로 전송되는 유저의 정보는 중간에 가로챌 가능성이 반드시 존재한다.

* `http`에서 사용자가 로그인 할 때 유저 정보와 비밀번호를 평문으로 전달하면 공격자가 탈취가 가능하기에 `https`를 사용하여야 한다.

* 데이터에 난수를 추가하고 인식할수 없는 형식으로 암호화하여 보내고 서버가 메시지를 해독하고 읽을 수 있도록 키 사본도 서버로 보내야한다. 하지만 공격자가 키 사본을 탈취하면 평문으로 해독이 가능함(`대칭암호화`)
* 유저정보를 `공개키`를 통해 암호화 하고 `개인키`를 통해 복호화 할 수 있다.(`비대칭암호화`)

**웹서버 예시**

> 서버는 공개 SSL명령을 사용하여 개인 및 공개키 쌍을 생성한다.

1. 클라이언트는 서버에게 지원 가능한 방식을 서버에게 알려준다(`client hello`)

   * 32byte 난수 값 전달(master secret)

   * 암호화 방식전달

2. 서버는 TLS버전, Cihper suite, 압축 방식등 client에게 전달(`server hello`)
   * 32byte 난수 값 전달(master secret)

3. 서버는 유저에게 `공개키` 전달(`server certificate`)
   * 이 인증서를 통해 클라이언트는 서버가 신뢰할 수 있는 서버인지 확인

4. 서버는 키교환에 필요한 정보를 제공(`Server key exchange`)
   * 생략가능

5. 서버가 클라이언트 인증서요청 가능(`Certificate request`)
   * 생략가능

6. 서버 인사 종료(`Server hello done`)
7. 클라이언트 인증서 전달(`Certificate`)
   * 서버가 `Certificate request`를 요청한 경우

8. 클라이언트 키 교환(`Client key exchange`)

   * 이전에 서버한테 받은 난수와 클라이언트가 생성한 난수를 조합하여 서버에게 전달

   * 서버에게 받은 공개키로 암호화 하여 전송

   * 클라이언트와 서버는 `master secret`으로 세션에 사용할 키를 생성하게 되는데 이것이 `대칭키`

9. 클라이언트 인증 확인(`Certificate vertify`)
   * 서버가 `Certificate request`를 요청한 경우 개인키로 디지털 서명하여 전송

10. 클라이언트 보안 파라미터 적용(`Change ciper spec`)

11. 클라이언트 끝(`Finished`)

12. 서버 보안 파라미터 변경 알림(`Change chper spec`)

13. 서버 끝(`Finished`)

**해커의 공격방법**

* 동일한 웹서버를 구성하여 사용자가 키를 전달하게 하여 갈취함
* 이를 막기 위해 서버는 `public key`를 유저에게 전달할 때 `key`만 전달하는 것이 아니라 `certificate`라는 인증서와 함께 전달한다.
* 이 인증서는 해당 서버가 안전하다는 것을 보장해주는 인증서이다.
* 브라우저에서는 인증서가 유효하지 않을 경우 사용자에게 경고를 내어 알려줌

> 보안에 취약한 사이트입니다.

* 인증서가 유효하다는 것을 인증하기 위해서는 `CA기관`에 인증을 받아야된다.
* 해커는 `CA기관`에게 인증을 받기는 불가능하다. 웹 사이트의 진정한 주인인지 확인
* `CA기관`들은 각자 자신들만의 `개인키`와 `공개키`를 갖는다.
* `공개키`들은 모두 브라우저에 내장되어 있으며, 브라우저는 `CA`에 `공개키`를 통해 `CA`가 인증한 인증서인지 확인

> Comodo global sign인 Symantec등등...

#### TLS in Kubernetes

**구분법**

> "* key *" 가 없는 것은 공개키 또는 인증서

| Certificate(Public Key) | Private Key    |
| ----------------------- | -------------- |
| server.crt              | server.key     |
| server.pem              | server-key.pem |
| client.crt              | client.key     |
| client.pem              | client-key.pem |

* `kubernetes`간 모든 통신은 secure 해야 한다.
* `kube-apiserver`에 대한 통신도 sercure 해야 한다.

**Server Certificates for Servers**

* `kube-apiserver`: apiserver.crt, apiserver.key
* `etcd`: etcdserver.crt, etcdserver.key

* `kubelet`: kubelet.crt, kubelet.key

**Client Certificates for Clients**

* `user(kubectl 명령을 사용하는 ADMIN)`: admin.crt, admin.key
* `kube-scheduler`: scheduler.crt, scheduler.key
* `kube-controller-manager`: controller-manager.crt, contorller-manager.key
* `kube-proxy`: kube-proxy.crt, kube-proxy.key
* `kube-apiserver(서버들과 통신하는 유일한 서버)`: apiserver.crt, apiserver.key

**인증서 그룹화**

* 인증서가 너무 많기에 그룹화 하여 생성

* 모든 인증서에 서명할려면 하나 이상의 `CA기관`이 필요함

#### TLS in Kubernetes - Certificate Cration

다양 한 도구를 사용할 수 있음

* EASYRSA
* OPENSSL
* CFSSL

**Client Certificates for Client 실습**

**괸리자 인증서 생성**

```bash
# 개인 키 생성 (Generate Keys)
$ openssl genrsa -out ca.key 2048
> ca.key

# 인증서 생성 (Certificate Signing Request)
$ openssl req -new -key ca.key -subj "/CN=KUBERNETES-CA" -out ca.csr
> ca.csr

# 서명 요청 (Sign Certificates)
$ openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt
> ca.crt
```

**클라이언트 인증서 생성(만들어진 인증서를 가지고)**

```bash
# 개인 키 생성 (Generate Keys)
$ openssl genrsa -out admin.key 2048
> admin.key

# 인증서 생성 (Certificate Signing Request)
# O=매개변수를 사용하여 그룹 세부정보를 추가함
$ openssl req -new -key ad,om.key -subj "/CN=kube-admin/O=system:masters" -out admin.csr
> admin.csr

# 서명 요청 (Sign Certificates)
$ openssl x509 -req -in admin.csr -CA ca.crt -CAKey ca.key -out admin
> admin.crt
```

**kube-config.yaml**

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate=authority: ca.crt
    server: https://kube-apiserver:6443
  name: kubernetes
kind: Config
users:
- name: kubernetes-admin
  user:
    client-certificate: admin.crt
    client-key: admin.key
```

**Server Certificates for Server 실습**

* etcd

```bash
cat etcd.yaml
--key-file=
--cert-file
--peer-cert-file=
--peer-client-cert=
--peer-key-file=
--peer-trusted-ca-file=
--trusted-ca-file=
```

* kube-apiserver

```bash
# 개인 키 생성 (Generate Keys)
$ openssl genrsa -out admin.key 2048
> admin.key

# 인증서 생성 (Certificate Signing Request)
# O=매개변수를 사용하여 그룹 세부정보를 추가함
$ openssl req -new -key ad,om.key -subj "/CN=kube-admin/O=system:masters" -out admin.csr
> admin.csr

$ vi openssl.cnf
[alt_names]
DNS.1 = kubernetes
DNS.2 = kubernetes.default
DNS.3 = kubernetes.default.svc
DNS.4 = kubernetes.default.svc.cluster.local
IP.1 = 10.96.0.1
IP.2 = 172.17.0.87
```

#### View Certificated Details

* `kubeadm`을 사용하면 손쉽게 클러스터 설치와 설정이 가능하다.
* `kubeadm`을 사용해 설치하면 각종 CA가 설정값에 잡혀있는것을 볼 수 있다.
* `/etc/kubernetes/manifests/kube-apiserver.yaml`을 보면 `CA`파일 위츠를 알 수 있다.

**인증서 내용 보기**

```bash
$> openssl x509 -in /etc/kuber/netes/pki/apiserver.crt -text -noout
```

