---
published: true
title: "ISTIO 설치"
categories:
  - Install
tags:
  - [istio]
toc: true
toc_sticky: true
date: "2022-08-04 18:00"
---

#### IstioCtl

클러스터에 istio를 설치할 때 사용

[설치링크](https://istio.io/latest/docs/setup/getting-started/#download)

> 알파나 베타는 설치하지 않는다.

* istio 설치

기본 버전만 설치됨

```bash
istioctl install
```

* istio 삭제(명령어임시)

```bash
istioctl x uninstall --purge
```

* 실험 명령어 보기

```bash
istioctl x
```

**Istio Profile**

[프로파일](https://istio.io/latest/docs/setup/additional-setup/config-profiles/)

- 특정 프로파일마다 Kiali가 활성화 되있거나등 옵션으로 조정되어있다.
- 이스티오에서 UI 컴포넌트를 제거했다 (에드온 형태로 빠짐)
- 크게 두 가지로 `default`와 `demo`로 나누어져있다.
    - default는 프로덕션
    - `demo` 보통 수준의 자원, 간소화버전(minikube)

> This profile enables high levels of tracing and access logging so it is not suitable for performance tests.

```bash
istioctl install --set profile=demo
```

**Plugin Install**
[플러그인](https://istio.io/latest/docs/ops/integrations/)

* `kiali`나 `grafana`를 설치할려면 플러그인을 추가하여야 한다.

* `istio/samples/addons`에서 `k apply -f` 설치 가능
* `jaeger, graphana, zipkin, Prometheus`

**Custom Profile**

* yaml 파일 추출

```bash
istioctl profile dump demo
```

* 적용 방법

```bash
istioctl install -f ./default-settings.yaml
```

**access token**

* 서드파티 토큰 사용
* `istioctl`은 퍼스트 파티 토큰 사용

**hpa**

```yaml
    pilot:
      autoscaleEnabled: true
      autoscaleMax: 5
      autoscaleMin: 1
```

* 프로덕션 환경에서 기본으로 사용하다 문제가 생기면 수정.

* `PILOT_TRACE_SAMPLING(demo)` 들어오는 요청 중 얼마만큼 잡아서 추적 시스템이 기록할지 정함
    * `default는 1%`
    * `default` 명시 안되어있지만 운영자가 직접 삽입
* istio request

```yaml
Request:
  cpu: 500m
  memory: 2Gi
```

**envoy proxy**

* 각 파드별로 `128Mi * N`요청 
* 클러스터를 돌리고 평균값을 확인 후 `request`를 조정하는것도 방법이다.

```yaml
        resources:
          limits:
            cpu: 2000m
            memory: 1024Mi
          requests:
            cpu: 100m
            memory: 128Mi
        statusPort: 15020
        tracer: zipkin
      proxy_init:
        image: proxyv2
        resources:
          limits:
            cpu: 2000m
            memory: 1024Mi
          requests:
            cpu: 10m
            memory: 10Mi
```

**Istio Manifest 파일로 변경**

* k8s object.yaml로 변경

```bash
istioctl manifest generate -f /default-setting.yaml
```

