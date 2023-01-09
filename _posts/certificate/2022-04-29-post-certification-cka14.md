---
published: true
title: "CKA 자격증 따기 - day13"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-04-29 12:00"
---

#### Service Account

- 쿠버네티스에는 사용자계정과 서비스계정으로 분류된다
- 사용자계정은 사람이 사용한다
  - 관리작업을 수행하기 위해 클러스터에 엑세스하는 관리자
  - 개발자
- 서비스계정은 기계가 사용한다
  - 모니터링 애플리케이션
  - 빌드 도구
  - 서비스 계정이 생성되면 서비스 계정 토큰도 자동으로 생성됨
  - 토큰은 secret으로 저장된다.
  - 외부 애플리케이션은 토큰으로 인증
- 네임스페이스를 만들면 `default`계정이 있으며 `default`라는 암호에서 볼륨이 자동으로 생성됨

```bash
$ k exec -it my-kubernetes-dashboard ls /var/run/secrets/kubernetes.io/serviceaccount
> ca.crt namespace token #k8s 엑세스 접근 토큰
```

- 기본 서비스 계정은 기본 공통 API쿼리를 실행할 수 있는 권한만 가지고 있다.
- 기존 서비스 계정은 편집할 수 없기에 재시작 필요

**명령어**

- 생성

```bash
k creaete serviceaccount dashboard-sa
```

- 부여하기

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-k8s-dashboard
spec:
  containers:
    - name: my-kubernetes-dashboard
      image: my-kubernetes-dashboard
  serviceAccountName: dashboard-sa
```

**타사애플리케이션이 접근할경우**

- 서비스 계정 토큰을 내보내고 타사를 구성하는 프로세스가 서비스토큰 시크릿을 볼륨으로 자동 마운트하여 사용애플리리케이션을 구성
- 파드 내부에서 타사 애플리케이션을 호스팅

#### Image Security

**보안된 저장소에서 이미지를 가져오는법**

- 이미지는 기본적으로 도커 허브에서 가져오며, `docker.io`에서 가져온다
- 구글은 `gcr.io`와 같이 구글저장소 명을 제공 및 타 벤더사들도 도커 허브를 제공한다.
- `private`를 구축할 경우 `docker login {private repository}`를 이용하여 로그인 시킨다.
- 이미지 명은 `private저장소/유저, 저장소이름/이미지이름`으로 구성되어있다.

**인증**

1. 인증을 위해서는 `secret`오브젝트를 만들고 도커저장소에 관련된 서버 명과 유저이름/비밀번호 정보를 만든다
2. 그 후 `imagePullSecret`섹션에서 해당 `secret`을 지정한다.

```bash
k create secret docker-registry recred \
  --docker-server=100.100.103.167\
  --docker-username=test \
  --docker-password=1234 \
  --docker-email=harbor@org.com
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx
      image: private-registry.io/apps/internal-app
  imagePullsecrets:
    - name: regcred
```

#### Security Context

- `pod`레벨에서 `pod`에 `securityContext`를 정의하고 `runAsUser`에 UserID를 명시할 수 있다.
- 이를 `containers`아래에 명시하면 컨테이너 레벨에서 `securityContext`를 지정할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-k8s-dashboard
spec:
  # 여기 위치에 두면 전체 적용
  securityContext:
    runAsUser: 1000
  containers:
    - name: my-kubernetes-dashboard
      image: my-kubernetes-dashboard
      # 여기 위치에 두면 해당 컨테이너만
      securityContext:
        runAsUser: 1000
        capabilities:
          add: ["MAC_ADMIN"]
```

#### Network Policy

- 네트워크 트래픽에는 `ingress`와 `egress`가 있다.
- `ingress`는 들어오는 트래픽이다.
- `egress`는 바깥으로 나가는 트래픽이다.
- 웹 서버의 경우 사용자한테 들어오는 트래픽(80포트로)은 `ingress`이며, 웹서버에서 API요청으로 나가는 트래픽은 `egress`트래픽이다.

**Network security**

- `pod`들은 경로와 추가 설정 없이도 다른 `pod`들과 통신할 수 있으며 `Virtual Private Network`위에서 서로 통신이 가능하다.

- k8s는 기본적으로 모든 `pod`에서 다른 `pod`로의 트래픽은 `All Allow`트래픽 정책을 가진다.
- 만약 디비 서버에는 API에서만 접근이 가능하여야 한다면 `NetworkPolicy`라는 오브젝틀를 생성하여 접근 제어 할 수 있다.
- 네트워크 정책은 k8s클러스터에 구현된 네트워크 솔루션에 의해 시행된다. 지원하지 않는 네트워크 솔루션도 있다는 것을 잊으면 안된다.
  - 지원: `kube-router, Calico, Romana, Weave-net`...
  - 미지원: `Flannel`

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-policy
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchlables:
          name: api-pod
      # 지정 네임스페이스에 접근만 허용하기 위해서
      namespaceSelector: #여기에 - 를 붙이면 별도에 지정 옵션이 됨으로 모든 접근이 허용되게 되버림 OR
        matchlables:
          name: prod
    - ipBlock:
        cidr: 192.168.5.10/32
    ports:
    - protocol: TCP
      port: 3306
 egress:
 - to:
   - ipBlock:
     cidr: 192.168.5.10./32
   ports:
   - protocol: TCP
     port: 80
```

**more**

- 특정 파드로부터 트래픽을 막기 위해 k8s 내부에서 네트워크 정책을 수립할 수 있다.
- 기본적으로 모든 트래픽을 허용할 수 있다.
- 디비서버에 3306으로 들어오는 `ingress`를 설정하였을때 들어오는 트래픽을 허용하면 해당 트래픽에 대한 응답은 자동으로 허용된다.
- 따라서 규칙을 만들 때 방향만 고려하면 된다. 응답은 신경쓰지 않아도 됨
- `namespaceSelecto`가 존재하면 지정 `namespace`만 접근이 가능하다.
- `ipblock`과 `cidr`을 지정하여 `acl`을 동작 시킬 수 있따.
