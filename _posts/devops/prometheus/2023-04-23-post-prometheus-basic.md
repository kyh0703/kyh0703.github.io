---
published: true
title: "prometheus - basic"
categories:
  - Prometheus 
tags:
  - [prometheus]
toc: true
toc_sticky: true
date: "2023-04-23 10:30"
---

#### Dashboard

![image-20230423003211207](/home/overthinker1127/Project/kyh0703.github.io/assets/images/posts/2023-04-23-post-prometheus-2/image-20230423003211207.png)

* 9090포트를 사용함

* value가 `0`이라면 메트릭 실패 `1`이면 메트릭 성공을 의미

* graph로 확인 시계열 데이터를 확인할 수 있음

* alert, graph, status등 여러 부분을 확인 할 수 있음

#### Prometheus.yml

* 메트릭을 스크랩
* 대상을 지정
* 스크랩 기간을 지정

```bash
# 전역설정
global:
  # 스크랩 간격
  scrape_interval: 15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  # 평가 간격
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# 경고 블록
# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

# 규칙파일 블록: 서버가 로드하기를 원하는 모든 규칙파일
# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# 스크랩: 모니터링 하는 리소스를 제어
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "prometheus"

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
      - targets: ["localhost:9090"]

```

#### Metrics

```yaml
# HELP net_conntrack_dialer_conn_attempted_total Total number of connections attempted by the given dialer a given name.
# TYPE net_conntrack_dialer_conn_attempted_total counter
net_conntrack_dialer_conn_attempted_total{dialer_name="alertmanager"} 0
[메트릭이름]{레이블}{값}
```

* 기본적으로 `/metrics`에 있는 `endpoint`를 조회한다 

* 

