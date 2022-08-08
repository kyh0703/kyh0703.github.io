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

