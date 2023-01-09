---
published: true
title: "CKAD 자격증 따기 - 2"
categories:
  - Certificate
tags:
  - [certificate, CKAD]
toc: true
toc_sticky: true
date: "2022-06-27 19:30"
---

### 2021 Update

#### Admission Controllers

kubectl API 요청이 API 서버에 도달하면 인증프로세스를 거친다. 사용자가 유효한지 확인한다.

`RBAC`에 해당하는 경우 통과, 그렇지 않으면 거부됨

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["create"]
  resourceNames: ["blue", "orange"] # 리소스 제한가능
```

기존 `RBAC`로 엑세스 제어를 할 수 없는 몇가지 사항이 있음.

**요청 자체를 변경하거나 포트가 생성되기전에 추가 작업을 수행**

순서: `kubectl > authentication > authorization > Admission Controllers > Create Pod`

`Admission Controller` 는 다음과 같은 역할을 할 수 있다.

* AlwaysPullImages
* DefaultStorageClass
* EventRateLimit
* NamespaceExists
* May more ...

> 예시)
>
> kubectl run nginx --image nginx --namespace blue
>
> 네임 스페이스가 존재하지 않으면 error 발생
>
> `NamespaceAutoProvision`가 있으면 생성가능

**활성화**

* 승인 목록 확인

```bash
kube-apiserver -h | grep enable-admission-plugins
# 승인 목록 표기
```

* 활성화

```yaml
ExecStart=/usr/local/bin/kube-apiverser \\
--enable-admission-plugins=NodeRestriction, NamespaceAutoProvision # 활성화
--disable-admission-plugins=DefaultStorageClass # 비활성화
```

#### Validating & Mutating Admission Controllers

`Default Storage Class`는  PC 생성 요청을 감시하고 확인한다.

지정하지 않은 경우 `Default`로 지정하고 기본 값을 추가하는데, 이러한 유형의 Admission Controller를 `Mutating Controller`라고 한다.

* Mission Controller는 요청을 확인하고 허용하거나 거부할 수 있는 컨트롤러
* Mutating Controller는 요청을 변경하고 유효성을 검사 할수 있는 컨트롤러

> 순서는 Mutation -> Mission

**Custom Admission Controller가 필요할 경우**

* Webhook
  * k8s 클러스터 내에서 호스팅 되는 서버를 가리키도록 웹 훅을 구성할 수 있음
* Validating

**How?**

자체 로직이 있는 웹 서버를 배포

* 예제 코드는 k8s Doc 참조
* 변경을 수락하고 API를 확인하고 해당 JSON으로 응답해야 됌
* 호스팅을 위해서 서버를 실행하거나 Container하여 K8s 클러스터 내 배포
* `service`배포

> 시험에서는 코드 개발 X, 배포 서버로 수신 및 응답만 시험

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "pod-policy.example.com"
webhooks:
- name: "pod-policy.example.com"
  clientConfig:
    service:
      namespace: "webhook-namespcae"
      name: "webhook-service"
    caBundle: "Ci0t"
  rules:
    - apiGroups: [""]
    - apiVersions: ["v1"]
    - operations: ["CRETATE"]
    - resources: ["pods"]
    - scope: "Namespaced"
```

#### API Version

API 아래의 모든 것이 앱, 확장, 네트워킹과 같은 API그룹이다.

API그룹마다 버전이 다르다.

API그룹이  `V1`에 있으면 안정적인 버전

* GA/Stable

`Alpha`는 API가 처음 개발 되고 Kubernetes코드 베이스에 병합되어 일부가 되는 때 나타남

`Alpha`그룹은 일반적으로 활성화 되어 있지 않음

* /v1alpha
* /v1beta1
* 버그가 있을 수 있고 신뢰할 수 없음.
* 향후 삭제 가능

> 알파 버전에서 모든 주요 버그가 수정되고 테스트가 완료되면 베타 단계로 이동. 향후 GA로 이동할 수 있음
>
> 여러 버전이 있을 경우 하나의 버전만 저장소 버전이 될 수 있다.

**특정버전을 활성화 하는 방법**

사용하기 위해서는 해당 버전을 런타임 구성 매개변수에 추가해야 한다.

`kube-apiserver`에서 활성화 되어 있지 않음으로 다음과 같이 추가할수 있다.

```bash
ExecStart=/usr/local/bin/kube-apiserver \\
--runtime-config=batch/v2alpha1\\
```

#### API Deprecations

**API 그룹의 수명 주기**

* API요소는 API그룹의 버전을 높여야만 제거 할 수 있다.
* API 객체는 정보 손실 없이 주어진 릴리스의 API버전 간에 왕복할 수 있어야 한다.
* 각 트랙의 최신 API 버전 이외의 이전 API 버전은 발표된 사용 중단 아래 릴리스 기간동안만 지원된다. ( 9 ~ 12 개월)
    * GA: 12 months or 3 releases
    * Beta: 9 months or 3 releases
    * Alpha: 0 release

> 최신 버전을 출시 할 떄 이전 버전을 더 이상 사용하지 않고 제거해야됨. 이는 모든 버전을 사용할 수 있어야 되는 것을 보장하는 것은 아니다.
>
> 릴리즈 시 제거 버전에 관련하여 사용자에게 알려야 한다.

* 지정된 그룹에 대한 기본 API 버전과 스토리지 버전을 명시하고 있기 때문에 새버전과 ㅏ이전 버전을 모두 지원하는 릴리스가 나올때까지 진행되지 않을 수 있다.

**변경 명령어**

```bash
k convert -f nginx.yaml --output-version apps/v1
```

#### Custom Resource Definition(CRD)

리소스를 만들면 `etcd`에 저장 후 `controller`가 관리한다.

**만드는 방법**

1. Resource 정의
2. 리소스 생성

```yaml
apiVersion: flights.com/v1
kind: FlightTicket
metadata:
  name: my-flight-ticket
spec:
  from: Mumbai
  to: London
  number: 2
```

예시로 실제 항공 예약을 하는 API를 호출한다 가정한다.

이 API를 호출하기 위해서는 `controller`가 필요하다.

* 사용자 지정 리소스 (정의)
* 사용자 지정 컨트롤러 (작업)

사용자 지정 리소스를  생성할려고 하면 실패한다.

먼저 생성할려는 리소스가 무엇인지 정의해야 함.

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: flighttickets.flights.com
spec:
  scope: Namespced
  group: flights.com # 사용자 지정 리소스에 apiVersion
  names:
    kind: FlightTicket
    singular: flightticket
    plural: flighttickets
    shortnames:
      - ft
  versions:
    - name: v1
      served: true
      storage: true
  schema: #사양 섹션에서 지정할 수 있는 모든 매개 변수를 정의
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          properties:
            from:
              type: string
            to:
              type: string
            number:
              type: integer
              minimum: 1
              maximum: 10
```

#### Custom Controllers

* 모니터링(특정개체의 이벤트 수신)
* 작업(비행기 예약)

**만드는 방법**

* [샘플컨트롤러](https://github.com/kubernetes/sample-controller) github repositiory확인 후 복사

* go 빌드
* 컨트롤러 생성
* 배포를 직접하거나 컨테이너화 하여 k8s에 넣을 수 있음

```bash
./sample-controller --kubeconfig=$HOME/.kube/config
```

#### Operator Framework

`crd`와 `controller`를 같이 패키지 하여 배포 하여야 한다.

> Operator Hub가 유명하다

**CRD**

* EtcdCluster
* EtcdBackup
* EtcdRestore

**Custom Controller**

* ETCD Controller
* Backup Operator
* Restore Operator

#### Deployment Strategy

`recreate`는 전체 파드를 다 종료시킨 후 재 생성한다. 유저가 접근 장애 발생

`rollingupdate`하나 하나 씩 내리면서 접근

istio를 통하여 정확한 비율에 배포를 구성할 수 있다.

**Blue/Green**

트래픽을 한번에 blue => green으로 옮김. 이러한 전략은 `istio`가 잘 구성함

Deployment와 서비스를 연결 (labels version=>v1)

서비스에서 version:=v2로 label을 변경하여 서비스에 트래픽을 전환함

**Carnary**

새버전을 배포 하고 트래픽의 작은 비율만 새 서비스로 전달

1. 서비스와 애플리케이션을 배포(version=v1)
2. v2 deploy 배포
3. 동시에 배포 하기 위해서는 공통레이블을 만들고 서비스에서 공통레이블을 지정후 동일하게 배포함(이때 50%임)
4. 작은 트래픽을 유지하기 위해서는 Canary 배포 파드수를 최저로 줄이면 (83:17%) 까지 내릴 수 있음
5. 해당 서비스 장애시 다시 제거
6. 마찬가지로 istio에서 배포 전략을 잘 구성하였음

#### Helm

k8s object들을 배포하는 것은 복잡한 일이다. 단순하게 배포 할 수 있는 방법이 필요함

예를들어 20GB-> 100Gi로 변경 시 각각 Yaml 파일들을 편집하여야 한다. 이를 관리하기 위해서 `helm`을 사용 할 수 있다.

`패키지 관리자`인 헬름을 사용하여 많은 Object파일을 하나의 앱으로 관리 할 수 있다.

**설치**

requirement

* k8s
* kubectl

**more**

`value.yaml`을 사용하여 value를 overwrap 할수 있다.

템플릿 +  yaml의 조합

helm Chart를 구성한다.

자신만의 차트나 다른 사용자가 업로드 한 차트를 찾을 수 있따.

**search**

```bash
helm search hub wordpress

helm repo add bitnami https://charts.bitnami.com/bitnali

# install 시마다 다름 독립적임
helm install [release-name] [char-name]

helm uninstall my-release

# helm 가져오기
helm pull --untar bitnami/wordpress
```
