---
published: true
title: "CKA 자격증 따기 - day14"
categories:
  - CKA
tags:
  - [devops, cka]
toc: true
toc_sticky: true
date: "2022-05-01 12:00"
---

#### Docker Storage

`Storage Drivers`와 `Volume Drivers`로 나누어진다.

도커를 설치하면 `/var/lib/docker`폴더가 생성되며 그 아래에는 `aufs, contianers, image, volumes`등의 폴더가 생긴다.

도커는 기본적으로 레이어 아키텍처를 갖는다. 

* 레이어 아키텍처의 장점은 도커 이미지가 빌드 될 떄 업데이트 할 이미지를 레이어만 변경함으로써 더 빠르게 빌드 할 수 있다. 

* 이전 레이어를 재 사용가능하다.

* 레이어는 `Bottom-Up`구조를 가지며, OS로부터 소스코드 명령어까지 레이어가 위에 계속 쌓인다. (Layer 1 -> Later 5)
* 빌드가 완료되면 레이어의 내용을 수정 할 수 없다.
* 읽기 전용이고 새 빌드를 시작해야만 수정 할 수 있다.
* 도커는 이미지 레이어에 존재하는 코드나 파일을 사용자가 수정하려고 하면 이를 현재 컨테이너 레이어에서 복사해서 Write할 수 있게 해준다. `Copy-On-Write`

**Container Layer**

컨테이너가 종료되면 데이터가 없어진다 그러므로 영속적으로 보존하기 위해선 `volume`에 저장한다.

```bash
# READ WRITE
Layer 6. Container Layer
```

**Image Later**

이미지 레이어는 저장되며 빌드시에만 수정 가능하다.

```bash
Layer 5. Update Entrypoint
Layer 4. Source Code
Layer 3. Changes in pip packages
Layer 2. Changes in apt packages
Layer 1. Base Ubuntu Layer
```

**볼륨 지정 예시**

```bash
# /var/lib/docker/volumes
$ docker volume create data_volume
# 볼륨을 생성하거나 호스트의 볼륨을 연결할 수 있다.
$ docker run -v data:volume:/var/lib/mysql mysql
```

* 최근에는 대시 마운트 옵션을 사용하는것이 선호된다.

```bash
docker run mysql \
--mount type=bind,source=/data/mysql,target=/var/lib/mysql
```

#### Storage drivers

볼륨은 스토리지 드라이버에서 처리되지 않는다.

* AUFS
* ZFS
* BTRFS
* Device Mapper
* Overlay
* Overlay2

#### Volume Drivers

컨테이너 구동 시 특정 볼륨 드라이버를 설정 할 수 있다.

* Local(Default)
* Azure File Storage
* Convoy
* DigitalOcean Block Storage
* Flocker
* gce-docker
* GlusteFS
* NetApp
* RexRay
* Portworx
* VMware vSphere Storage

```bash
# 클라우드로 볼륨이 연결됨
docker run mysql -it \
  --name mysql
  --volume-driver rexray/ebs
  --mount src=ebs-vol,target=/var/lib/mysql
```

#### Container Storage Interface

* CRI(컨테이너 런타임 인터페이스) 는 `k8s`와 `container`가 어떻게 통신할 수 있는지에 대한 인터페이스를 제공한다.
  * rkt
  * docker
  * cri-o
* CNI(컨테이너 네트워크 인터페이스)는 다른 네트워크 벤더들이 `k8s`와 어떻게 통신할수 있는지에 대한 인터페이스를 제공
  * Flannel
  * Calico
  * Cilium

* CSI(컨테이너 저장소 인터페이스)는 `k8s`와 통신할 수 있는 저장소들간의 인터페이스다.
  * portworx
  * Amazon EBS
  * DELL EMC
  * GlusterFS
  * CephFS
  * Longhorn

#### Volume

* 컨테이너와 데이터는 수명을 함께 한다.
* `volume`을 사용하면 컨테이너에 저장한 데이터를 영속화가능하다.
* 파드 역시 마찬가지이며, 데이터를 보존하기 위해 `volume`이 필요하다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: random-number-generator
spec:
  containrs:
  - image: alpine
    name: alpine
    command: ["/bin/sh", "-c"]
    args: ["shuf -i 0-100 -n 1 >> /opt/number.out;"]
    volumeMounts:
    - moutPath: /opt
      name: data-volume
# opt에 저장한 데이터를 아래 볼륨과 연결 하지만 hostPath라 노드들의 데이터는 동일하지 않음
  volumes:
  - name: data-volume
    hostPath:
      path: /data
      type: Directory
     
```

#### Persistent Volume(PV)

* `pv`는 `k8s`에서 관리하는 대용량 저장소 풀이다.
* `k8s`의 `pod`들이 데이터를 보존하기 위해서 `pv`를 사용할 수 있다.
* `pv`는 만들어진 용량 풀이고 `pod`가 `pvc`요청을 해서 자원을 사용한다.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-voll
spec: 
  accessModes:
    - ReadWriteOnce #ReadOnlyMany ReadWriteOnce ReadWriteMany
  capacity:
    storage: 1Gi
  # 프로덕션 환경에서 안씀
  hostPath: 
    path: /tmp/data 
  # AWS
  awsElasticBlockStorage:
    volumeID: <volume-id>
    fsType: ext4
  # Retain: 관리자가 수동으로 삭제할때까지 영구볼륨 유지
  # Delete: PVC삭제 즉시 볼륨 삭제되며 저장공간이 확보됨
  # Recycle: 다른 클레임에서 사용되도록 재활용
  # persistentVolumeReclaimPolicy: Retain
```

#### Persistent Volume Claims

* `pvc`가 생기면 `k8s`는 `pv`와 `pvc`를 바인딩한다.
* 자동으로 찾아주지면 `label` 과 `selector`를 사용하여 볼륨을 바인딩 할 수 있음
* 적당한 볼륨이 없으면 볼륨이 생성될때까지 생성을 보류함
* `pv`와 `pvc`는 1대1이다. `pvc`하나가 여러 개 `pv`에 할당 할 수 없다.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spc:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  volumes:
    - name: mypd
      persistentVolumeClaim:
        claimName: myclaim
```

#### Storage Class

* pod를 생성할때마다 PVC를 수동으로 프로비저닝 하기에는 힘들다 이를 정적 프로비저닝 볼륨이라고 한다.
* 자동으로 프로비저닝 하게 할 수 있는데 스토리지 클래스를 사용하면 가능하다.
* 자동으로 프로비저닝하게 하면 수동으로 `pv, pvc`정의가 필요없다.
* 스토리지 클래스가 자동으로 만듬
* 기본 스토리지클래스를 정의하여 넣을수  있음
* 가령 스토리지 클래스를 사용하면, 실버 골드 플래티넘과 같이 유저 등급에 따른 저장공간을 나눠놓고 해당 저장소의 옵션을 다르게 주는 것 또한 가능

```yaml
apiVersion: storage.k8s.io/v1
kind: StroageClass
metadata:
  name: google-storage
provisioner: kubernetes.io/gce-pd
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
    - name: myfrontend
      image: nginx
      volumeMounts:
      - mountPath: "/var/www/html"
        name: mypd
  storageClassName: google-storage
```

