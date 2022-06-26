---
published: true
title: "CKAD 자격증 따기 - 1"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-06-20 19:30"
---

#### Multi-Container Pods

`엠버서더 컨테이너`는 다양한 개발 단계에서 서로 다른 데이터베이스 인스턴스와 통신한다 하였을 때 새로운 컨테이너는 요청을 프록시 하는 것을 앰버서더 컨테이너라고 한다.

* 엠버서더 패턴
  * 소비자 서비스 또는 응용 프로그램을 대신하여 네트워크 요청을 전송하는 도우미 서비스를 만드는 패턴
* 사이트카 패턴
  * 로그 애플리케이션을 따로 배포 하여 수집
* 어댑터 패턴
  * 
* 대사 패턴

#### InitContainers

컨테이너 초기화시 사용할 수 있다. 초기화 완료 후 컨테이너 생성

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

#### Readiness Probes

**PodStatus**

1. pending (스케줄러가 파드를 배치할 노드를 찾는 과정)
2. ContainerCreating(컨테이너가 예약 된 상태)
3. Running(컨테이너가 실행된 상태)

**Pod Condition(Detail)**

True, False로 판단됌

1. PodScheduled
2. Initialized
3. ContainersReady
4. Ready: 사용자의 트래픽을 받아 들일 준비

컨테이너의 애플리케이션이 준비하는데 더 오래 걸리면 서비스가 이를 인식하지 못하고 컨테이너가 준비 상태임으로 사용자가 POD에 도달하도록 트래픽을 보낸다. 여기서 필요 한 것은 준비 상태를 내부 애플리케이션의 실제 상태와 연결하는 방법이다.

```bash
# URL
curl HTTP Test - /api/ready

# TCP
TCP Test -3306

# Exec Command
Sh command.sh
```

Pod 내에서 구성하기 위해 `readinessProbe`를 사용한다. 기본적으로 3시간 후에도 애플리케이션이 준비되지 않으면 프로브가 중지된다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: simple-webapp
  lables:
    name: simple-webapp
spec:
  containers:
  - name: simple-webapp
    image: simple-webapp
    ports:
      - containerPort: 8080
    readinessProbe:
      httpGet:
        path: /ap/ready
        port: 8080
      initialDelaySeconds: 10 # 추가 지연
      preiodSeconds: 5 # 조사 기간
      failureThredsHold: 8 # 실패 임계값
```

* http

```yaml
readinessProbe:
  httpGet:
    path: /ap/ready
    port: 8080
```

* tcp

```yaml
readinessProbe:
  tcpSocket:
    port: 3306
```

* exec Command

```yaml
readinessProbe:
  exec:
    command:
      - cat
      - /app/is_ready
```

#### Liveness Probes

응용 프로그램이 실제로 작동하지 않지만 컨테이너가 계속 살아 있는 상황이 발생 할 수 있다.

예시) 무한루프에 빠졌을때 컨테이너가 작동 중인것으로 가정되지만 사용자가 컨테이너의 연결 시 연결이 안 됌.

이 경우 컨테이너를 다시 시작하여야 한다.

`Liveness`는 컨테이너에 구성되어 애플리케이션 내에서 주기적으로 테스트 할 수 있다.

테스트가 실패하면 컨테이너가 비정상으로 간주되어 폐기되고 다시 생성 된다.

Readinress와 동일한 정책을 가진다.

#### Job

배치 처리 분석, 보고 워크로드, 계산수행, 이미지 처리, 대규모 분석, 데이터 세트, 보고서 생성, 이메일 전송

pod세트를 실행하여 주어진 작업을 완료하는데 사용

`parallelism`으로 작업을 병렬로 생성 할 수 있음

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: math-add-job
sepc:
  completions: 3
  parallelism: 3
  template:
    sepc:
      containers:
        - name: mth-add
          image: ubuntu
          command: ['expre', '3', '+', '2']
      restartPolicy: Newver
```

#### CronJob

Linux `crontab`과 같다. 주기적으로 실행

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: reporting-cron-job
sepc:
  Schedule: "*/1 * * * *"
  jobTemplate:
    sepc:
      completions: 3
      parallelism: 3
      template:
        sepc:
          containers:
            - name: mth-add
              image: ubuntu
              command: ['expre', '3', '+', '2']
          restartPolicy: Newver
```





