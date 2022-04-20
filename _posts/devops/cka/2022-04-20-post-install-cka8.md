---
published: true
title: "CKA 자격증 따기 - day7"
categories:
  - DevOps
tags:
  - [devops, CKA]
toc: true
toc_sticky: true
date: "2022-04-20 12:00"
---

#### Rolling Updates and Rollbacks

* 파드의 기본 배포 전략 `Rolling update`
* 배포될 때마다 `REVISION`으로 변경사항을 추적

**명령어**

* 상태

```bash
k rollout status deploy myapp-deployment
```

* 기록

```bash
k rollout history deploy myapp-deployment
```

* 이미지 변경

```bash
# 배치 정의 파일이 다른 구성을 갖게 됨
k set image deploy myapp-deployment nginx=nginx:1.91
# apply 권장
k apply -f myapp-deployment.yaml
```

* 롤백

```bash
k rollout undo deploy myapp-deployment
```

**배포 전략**

1. Recreate
    * 파드를 전체 제거 후 다시 재 배포
2. Rolling Update(Default)
    * `replicaSet`을 새로 만들어 파드를 생성함과 동시에 기존 파드를 삭제

```bash
$ k describe deploy
stretegyType: Recreate or RollingUpdate
```

#### Configure Applications

* k8s의 YAML 정의파일에 도커 컨테이너를 실행할때 명령어를 지정할 수 있음
* `Dockerfile`에 `CMD`를 정의해두었다면 오버라이딩이 가능

```dockerfile
FROM Ubuntu
ENTRYPOINT ["sleep"] # => command: ["sleep2.0"]
CMD ["5"] # => args: ["10"]
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: ubuntu
    image: ubuntu-sleeper
    args: ['10']
```

#### Configure Environment Variables in Application

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: ubuntu
    image: ubuntu-sleeper
  # 직접 지정
  env:
    - name: APP_COLOR
      value: build
  # config map
  env:
    - name: APP_COLOR
      valueFrom:
        configMapKeyRef:
  # secreat
  env:
    - name: APP_COLOR_
      valueFrom: 
        secretKeyRef:
```

#### ConfigMaps

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_COLOR: blue
  APP_MODE: prod
```

**적용방법**

* 환경변수 적용

```yaml
envFrom:
  - configMapRef:
      name: app-color
```

* 단일 환경변수 적용

```yaml
env:
  - name: APP_COLOR
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: APP_COLOR
```

* 볼륨

```yaml
volumes:
- name: app-config-volume
  configMap:
    name: app-config
```

**명령어**

```bash
# 변수 직접 지정
$ k create cm
    <config-name> --from-literal=<key>=<value>
    
$ k create configmap
    app-config --from-literal=APP_COLOR=blue

# 파일 지정
$ k create cm
    <config-name> --from-file=<path-to-file>
$ k create cm
    app-config --from-file=app_config.properties
```

#### Configure Secrets

* 암호나 키와 같은 민감한 정보를 저장하는 데 사용

* configmap과 동일하나 `base64`로 인코딩 하여 저장
* `bash64`로 디코딩이 되기 때문에 감추는것이지 암호화하는것은 아니다
* 암호화를 위해선 `Helm Secret`이나 `HashCorp Vault`도구 사용

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
data:
  DB_Host: mysql
  DB_User: test
```

**적용방법**

* 환경변수

```yaml
envFrom:
  - secretRef:
    name: app-secret
```

* 단일 환경변수 적용

```yaml
env:
  - name: APP_COLOR
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: APP_COLOR
```

* 볼륨

```yaml
volumes:
- name: app-config-volume
  secret:
    name: app-config
```

**명령어**

* 시크릿 생성

```bash
# 변수 직접 지정
$ k create secret generic
    <scret-name> --from-literal=<key>=<value>
$ k create secret generic
    app-secret --from-literal=DB_Host=mysql
    
# 파일 지정
$ k create secret generic
    <config-name> --from-file=<path-to-file>
$ k create secret generic
    app-config --from-file=app_secret.properties
```

* base64 인코딩

```bash
echo -n 'mysql' | base64
```

* base64 디코딩

```bash
echo -n 'bXlzcWw=' | base64 --decode
```

