---
published: true
title: "CKA 자격증 따기 - day23"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-05-19 12:00"
---

#### 시험전 마지막 공부

**설정**

생각보다 타이핑이 많아 금방 지칩니다..

```bash
alias k=kubectl                         # will already be pre-configured
export do="--dry-run=client -o yaml"    # k get pod x $do
export now="--force --grace-period 0"   # k delete pod x $now
```

* vim

```bash
~/.vimrc
set tabstop=2
set expendtab
set siftwidth=2
```

**context  잘 확인하자!**

`killer.sh`를 통해서 공부중인데 난이도가 급격히 올라갔습니다. 주의 깊게 `context`를 확인하세요. 

```bash
# context 가져오기 -o name 생각보다 많이 씀..
k config get-contexts -o name 

# 현재 context
kubectl config current-context

# kubeconfig는 홈에 있다! 잊지말기
cat ~/.kube/config | grep current
```

**taint 문제**

마스터 노드에만 배포를 해야된다그러면 `toleration` 뿐만 아니라 `nodeSelector`도 지정해주자..

```yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: pod1
  name: pod1
spec:
  containers:
  - image: httpd:2.4.41-alpine
    name: pod1-container                  # change
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
  tolerations:                            # add
  - effect: NoSchedule                    # add
    key: node-role.kubernetes.io/master   # add
  nodeSelector:                           # add
    node-role.kubernetes.io/master: ""    # add
status: {}
```

**scale**

```bash
# 기록이 필요하다 하면 --record
$ k -n project-c13 scale sts o3db --replicas 1 --record
statefulset.apps/o3db scaled

# --record 확인 필요
$ k -n project-c13 describe sts o3db
Name:               o3db
Namespace:          project-c13
CreationTimestamp:  Sun, 20 Sep 2020 14:47:57 +0000
Selector:           app=nginx
Labels:             <none>
Annotations:        kubernetes.io/change-cause: kubectl scale sts o3db --namespace=project-c13 --replicas=1 --record=true
Replicas:           1 desired | 1 total
```

**livenessProbe ReadinessProbe**

> 리눅스 명령어를 쓴다고 하면 꼭 잊지말고 sh -c 를 입력하자

```yaml
# 4_pod1.yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: ready-if-service-ready
  name: ready-if-service-ready
spec:
  containers:
  - image: nginx:1.16.1-alpine
    name: ready-if-service-ready
    resources: {}
    livenessProbe:                               # add from here
      exec:
        command:
        - 'true'
    readinessProbe:
      exec:
        command:
        - sh
        - -c
        - 'wget -T2 -O- http://service-am-i-ready:80'   # to here
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

**Metric**

```bash
# /opt/course/7/node.sh
kubectl top node

# /opt/course/7/pod.sh
kubectl top pod --containers=true
```

**k8s component**

```bash
kubelet: process
kube-apiserver: static-pod
kube-scheduler: static-pod
kube-scheduler-special: static-pod (status CrashLoopBackOff)
kube-controller-manager: static-pod
etcd: static-pod
dns: pod coredns
```

**k8s scheduler**

> 봐도 모르는 문제다.. 

1. scheduler를 manifest 위로 이동 (stop이라고 하기에 당황함)
2. pod를 생성한다.
3. scheduler가 하는 일은 `nodeName:`을 붙이는 거다.
4. 따라서 올릴려면 pod에 nodeName을 넣어라

```yaml
# 9.yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2020-09-04T15:51:02Z"
  labels:
    run: manual-schedule
  managedFields:
...
    manager: kubectl-run
    operation: Update
    time: "2020-09-04T15:51:02Z"
  name: manual-schedule
  namespace: default
  resourceVersion: "3515"
  selfLink: /api/v1/namespaces/default/pods/manual-schedule
  uid: 8e9d2532-4779-4e63-b5af-feb82c74a935
spec:
  nodeName: cluster2-master1        # add the master node name
  containers:
  - image: httpd:2.4-alpine
    imagePullPolicy: IfNotPresent
    name: manual-schedule
    resources: {}
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-nxnc7
      readOnly: true
  dnsPolicy: ClusterFirst
...
```

**강제 삭제하고 올릴경우 apply 다음과 같이 사용가능**

```bash
k -f 9.yaml replace --force
```

**RBAC**

user는 사람이고 serviceAccount는 챗봇같은거다. 

user가 csr을 요청할 경우 kubernetes `k certificate approve`잊지말자

1. *역할* + *역할 바인딩* (단일 사용 가능) *네임 스페이스*, 단일 적용 *네임 스페이스*)
2. *Cluster역할* + *Cluster역할Binding* (클러스터 전체에서 사용 가능, 클러스터 전체에서 적용 가능)
3. *Cluster역할* + *역할 바인딩* (클러스터 전체에서 사용 가능하며 단일로 적용됩니다 *네임 스페이스*)
4. *역할* + *Cluster역할Binding* (**가능하지 않음 :** 단일로 제공됩니다 *네임 스페이스*, 클러스터 전체에 적용)

**deploy on all node**

지옥같은 문제다

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    id: very-important                  # change
  name: deploy-important
  namespace: project-tiger              # important
spec:
  replicas: 3                           # change
  selector:
    matchLabels:
      id: very-important                # change
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        id: very-important              # change
    spec:
      containers:
      - image: nginx:1.17.6-alpine
        name: container1                # change
        resources: {}
      - image: kubernetes/pause         # add
        name: container2                # add
      topologySpreadConstraints:                 # add
      - maxSkew: 1                               # add
        topologyKey: kubernetes.io/hostname      # add
        whenUnsatisfiable: DoNotSchedule         # add
        labelSelector:                           # add
          matchLabels:                           # add
            id: very-important                   # add
status: {}
```

```yaml
# 12.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    id: very-important                  # change
  name: deploy-important
  namespace: project-tiger              # important
spec:
  replicas: 3                           # change
  selector:
    matchLabels:
      id: very-important                # change
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        id: very-important              # change
    spec:
      containers:
      - image: nginx:1.17.6-alpine
        name: container1                # change
        resources: {}
      - image: kubernetes/pause         # add
        name: container2                # add
      affinity:                                             # add
        podAntiAffinity:                                    # add
          requiredDuringSchedulingIgnoredDuringExecution:   # add
          - labelSelector:                                  # add
              matchExpressions:                             # add
              - key: id                                     # add
                operator: In                                # add
                values:                                     # add
                - very-important                            # add
            topologyKey: kubernetes.io/hostname             # add
status: {}
```

#### SA Can-i

```bash
➜ k -n project-hamster auth can-i create secret \
  --as system:serviceaccount:project-hamster:processor
```

#### Find out cluster Infomation

```yaml
# /opt/course/14/cluster-info

# How many master nodes are available?
1: 1

# How many worker nodes are available?
2: 2

# What is the Service CIDR?
3: 10.96.0.0/12

# Which Networking (or CNI Plugin) is configured and where is its config file?
4: Weave, /etc/cni/net.d/10-weave.conflist

# Which suffix will static pods have that run on cluster1-worker1?
5: -cluster1-worker1
```

#### expire

```bash
openssl x509  -noout -text -in /etc/kubernetes/pki/apiserver.crt | grep Validity -A2
```

```bash
kubeadm cert expire | grep apiserver
```

