---
published: true
title: "AWS SAA-C03 - 정리"
categories:
  - Certificate
tags:
  - [certificate, AWS, SAA-C03]
toc: true
toc_sticky: true
date: "2022-12-15 12:00"
---

### AWS(Amazon Web services)

* 온디맨드 방식으로 쉽게 확장할 수 있는 서버, 서비스 제공

#### Regions

* 데이터 센터의 집합

**리전 선택 영향 요인**

* 법률 준수
    * 프랑스 데이터는 프랑스에서만 있어야 됌
* 지연시간
    * 지역이 가까울 수록 지연시간이 줄어듬
* 모든 리전이 모든 서비스를 가지고 있지 않음
* 요금

#### AWS Avaliablity zones

* 가용영역은 리전 안에서만 존재
* 리전은 많은 가용 영역을 가질 수 있음
* 보통 3, 최소 2, 최대 6개까지
* 재난에 대비해 서로 단절되어 있음

### IAM(Identity and Access Management)

* 사용자를 생성
* 그룹에 배치
* 사용자들을 그룹으로 묶어서 관리할 수 있다.
* 한 사용자가 다른 여러 그룹에 속할 수 있다.

#### 패스워드정책

* 패스워드 변경 정책
* MFA
    * 사용자의 디바이스와 같이 인증

### EC2(Elastic Compute Cloud)

* 온디맨드 인스턴스
    * 사용한 만큼 금액 지불
* 정기 예약 인스턴스
    * 1년이나 3년주기로 계약
    * 선불 혹은 달마다
* 전환형 예약 인스턴스
    * 예약 후 인스턴스 유형을 변경 할 수 있다.
* 스팟 인스턴스
    * 설정한 가격에 맞을 경우 인스턴스를 실행
    * 인스턴스가 파괴될 수 있음
    * 온디맨드와 비교해서 최대 90% 할인가능

#### spot instance and spot fleet

**스팟블록**

* 특정기간 동안 인스턴스를 차단하는 기능
* 2022년 12월 31일자로 서비스 종료

**스팟요청**

* 일회성 요청
    * 일회성 요청으로 스팟 요청이 완료된 후 요청은 사라진다.
* 지속적인 요청
    * 지속적으로 스팟을 요청하게 되며, 생성 후에도 스팟 요청이 남아있다.

> 스팟을 지우기 위해서는 스팟 요청을 삭제 후 인스턴스를 종료시켜야된다.

#### 스팟집합(spot fleet)

한 세트의 스팟 인스턴스에다가 선택적으로 온디맨드 인스턴스를 조합해 사용하는 방식

정해진 예산이나 정해진 용량이 도달하면 인스턴스 실행을 멈춤

**할당 전략**

lowestPrice
* 가장 적은 비용을 가진 풀에서부터 인스턴스를 실행
* 아주 짧은 워크로드에 적합

diversified
* 모든 풀에 거쳐 분산이 됨
* 한 풀이 종료되더라도 다른 풀에서 가동 됨

capacity optimized
* 인스턴스의 개수에 따라서 최적용량으로 실행이 되고 적절한 풀을 찾아주는 옵션

### Network

**public**

공용 아이피

**private**

사설 아이피

#### Elastic IPs

* 인스턴스가 재시작되어도 유지되는 public IP

* 계정 당 5개

> 탄력적 아이피보단 임의의 공용 IP를 써서 DNS이름을 할당하는 것이 좋음. 또는 로드밸런서를 사용

#### Placement Groups(배치그룹)

EC2 인스턴스가 AWS인프라에 배치되는 방식을 제어하고자 할 때 사용

**3가지 배치 전략**

cluster

* 단일 가용 영역 내에서 지연시간이 짧은 하드웨어 설정
* 동일한 랙에 구성 됨(동일한 가용영역)
* 10Gbps
* 하드웨어가 고장나면 ec2인스턴스가 다 종료 됨
* 극히 짧은 지연시간, 고속의 네트워크

spread

* 인스턴스가 다른 하드웨어(랙, 가용영역)에 분산
* 배치그룹 당 `7`개의 EC2인스턴스만 가짐
* 동시 실패의 위험 감소

partition

* 여러 파티션에 인스턴스를 분할
* 파티션은 다운 오류 파티션과 격리됨
* 가용영역당 `7`개 파티션
* 각 파티션은 랙을 말함
* 랙 실패로부터 안전함
* HDFS, HBase, Kafka, Cassndra

#### ENI(Elastic Network Interfaces)

* VPC의 논리적 구성요서이며 가상 네트워크 카드를 나타냄(NIC)

* 인스턴스가 네트워크에 엑세스 할 수 있게 해줌

**속성**

* 주요 사설 IPv4와 하나 이상의 보조 IPv4를 가질 수 있음

* ENI에 하나이상의 보안 그룹을 연결 할 수 있음
* 인스턴스와 독립적으로 ENI를 생성하여 즉시 연결하거나 장애 조치를 위해 EC2인스턴스에서 이동시킬 수 있음

#### EC2 Hibernate(절전모드)

* 절전모드가 되면 램에 있던 인 메모리 상태는 보존 됨
* EBS 볼륨에 기록되어 있음
* 빠르게 재 부팅하거나 RAM상태를 저장하고 싶을 때
* 베어메탈 인스턴스 적용 X
* 루트 볼륨, 즉 EBS에만 저장이 가능
* 암호화가 필요
* 절전 모드는 최대 60일이 최대 기간

**절전 순서**

1. 인스턴스를 절전모드로 설정
2. 인스턴스의 메모리는 EBS에 기록
3. 인스턴스 중지 시 RAM은 제거
4. EBS의 기록된 RAM  dump를 가지고 부팅

### EC2  인스턴스 스토리지

#### EBS(Elastic Block Store)

* 네트워크 드라이버
* USB와 같다 생각하면 됨
* 인스턴스가 종료된 후에도 데이터를 지속 가능
    * **하나의 인스턴스에 하나의 EBS(CCP Level)**
    * 어소시에이트 레벨: 일부 EBS 다중연결
* 가용영역에 종속적임
    * 다른 가용영역이나 다른 지역으로 볼륨을 이동시킬려면 스냅샷을 사용해야됨
* **종료시 삭제 기능을 Enable/Disable로 EC2인스턴스가 종료시 root볼륨을 유지할 수 있다**

#### EBS Snapshot

* EBS볼륨의 특정시점에 대한 백업
* 다른 가용영역이나 다른 리전에도 복사할 수 있음

**스냅샷 종류**

EBS Snapshot Archive

* 최대 75%까지 저렴한 아카이브 티어로 스냅샷을 옮길 수 있는 기능
* 아카이브를 복원하는데 24시간에서 최대 72시간까지 걸림
* 즉시 복원 X 

Recycle Bin for EBS Snapshot 

* EBS 스냅샷을 영구 삭제 하는 대신 휴지통에 넣음
* 기간을 1일에서 1년까지 지정 가능

Fast Snapshot Restore(FSR)

* 스냅샷을 완전 초기화해 지연시간을 없애는 기능
* 인스턴스를 빠르게 초기화할때 유용
* 비용이 많이 듬

#### AMI(Amazon Machin Image)

사용자 지정 인스턴스를 나타냄

**AMI 종류**

* Public AMI
    * AWS 제공

* Your Own AMI
    * 사용자 제작

* An AWS Marketplace
    * 다른사람이 만든 공식이미지


#### ECS Instance Store

EC2 인스턴스는 가상 머신이지만 실제로 하드웨어 서버에 연결되어 있다.

물리적으로 연결된 디스크 공간을 `EC2인스턴스 스토어`라고 부른다

* 향상된 디스크 성능
* ec2인스턴스를 종료하면 손실된다.
* 임시 스토리지
* 버퍼, 캐시를 저장하는 임시콘텐츠를 사용하는 경우
* 장기 스토리지는 EBS가 적합
* 백업 및 복제는 사용자의 책임

#### EBS 볼륨 유형

**범용 SSD(gp2/gp3)**

* 다양한 워크로드에 대해 가격과 성능의 절충안이 되어줌
* 부팅볼륨으로 사용될 수 있음
* 1GB ~ 16GB 까지 다양함
* 개발, 테스트, 가상데스크톱
* gp2는 예전 버전
    * `3000-16000 IOPS`
    * 3IOPS는 5,334GB

* gp3는 최신 세대 볼륨
    * `3000 IOPS`와 초당 `125MB`의 처리량을 제공
    * 16000IOPS 이상


**프로비저닝 된 IOPS (io1/io2)**

* 최고 성능을 자랑함
* 부팅 볼륨으로 사용할 수 있음

* 16000 IOPS성능 이상 유지할 필요가 있는 애플리케이션
* 데이터베이스 워크로드
  * io1/io2(4GiB - 16Tib)
    * Max PIOPS: 64000 for Nitro EC2
    * `Nitro EC2` 인스턴스가 아닐경우 32000IOPS
    * io2는 4GB ~ 64TB
  * io2 Block Expree(4GiB - 64TiB)
    * 256,000 IOPS

**st1(HDD)**

* 저비용의 HDD볼륨으로 잦은 접근과 처리량이 많은 워크로드에 사용

* 125GiB - 16TiB
* 빅 데이터, 로그, 데이터 웨어하우스
* 최대 500MIB - 500 IOPS

**콜드 HDD sc1(HDD)**

* 가장 비용이 적게 드는 HDD볼륨으로 접근 빈도가 낮은 워크로드에 사용
* chleo 250MIB - 250 IOPS

#### EBS 다중 연결(io1/io2)

다중 연결 기능은 하나의 EBS 볼륨을 같은 가용영역에 있는 여러 EC2인스턴스에 연결 할 수 있게 해줌

* io1, io2만 가능
* 같은 가용영역내에서만 사용 할 수 있다.
* 16개의 EC2인스턴스만 같은 볼륨에 연결 할 수 있다

#### EBS 암호화

* 볼륨간 데이터 및 저장되는 볼륨 역시 암호화 된다.
* 비 암호화 스냅샷을 암호화 시킬 수 있음
* KMS(AES-256)

**비암호화 EBS를 암호화시키는방법**

1. 비암호화 된 EBS를 암호화를 킨 상태로 스냅샷
2. 그 후 스냅샷 된 EBS를 가지고 EBS를 만듬
3. EBS를 EC2에 부착

#### EFS(Elastic File System)

* 관리형 NFS(Network File System)
* 여러 EC2인스턴스에 마운트 될 수 있음
* EC2인스턴스는 여러 가용 영역에 있을 수 있다.
* 가용성이 높고 확장성도 높다
* 그만큼 가격이 비쌈
* WIndow가 아닌 `Linux AMI`와 호환 됨
* 파일 시스템이 자동으로 확장되고 사용량에 따라 요금을 지불
* 따라서 용량 계획하지 않아도 됨
* 웹서버, 데이터 공유 word Press에 사용
* 처리량은 초당 10GB
* 교차 AZ - 100개의 인스턴스

**성능모드**

범용모드

* 기본 설정으로 민감한 웹 서버

* 최대 IO
  * 처리량을 높이고 싶다면 사용
* 미디어 처리 작업이 있을 때 유용

처리량 모드

* `버스팅모드`가 기본값

* 초당 50MiB ~ 초당 100Mib까지 버스트 할 수 있음
* 프로비저닝 모드에서는 크기에 상관없이 처리량을 설정 할 수 있다.

### 로드밸런서

#### 로드밸런서 역할

* Health Check
* 균일한 분배
* 앱의 단일 지점
* 분산 처리
* SSL Termination
* High Availability
* public, private 트래픽 분리

#### **로드밸런서 종류**

CLB(Classic Loadbalancer)

* 만료됐음
* HTTP, HTTPS, TLS, SSL

ALB(Application Loadbalancer)

* L7
* path, query, header.. 등으로 다른 타겟그룹으로 라우팅 할 수 있음
* HTTP, HTTPS, HTTP/2, Web Socket
* 400ms
* 타겟그룹
    * EC2 Instance
    * EC2 Tasks
    * Lambda function
    * IP Address


NLB(Network Loadbalancer)

* L4
* 100ms

* TCP, TLS, UDP
* 고성능
* EIP
* 타겟그룹
    * EC2 Instances
    * IP Address
    * Application Load Balancer

* 상태확인
    * TCP, HTTP, HTTPS


GWLB(Gateway Load Balancer)

* L3

* 인그레스 게이트웨이처럼 들어오는 트래픽을 가지고 검증을 한 후 애플리케이션에 분배
* `GENEVE` 6081 포트를 사용
* 타겟 그룹
    * EC2 instance
    * IP Address - must be private IPs


#### **Sticky Sessions (Session Affinity)**

쿠키에 데이터를 심어 처음 연결된 인스턴스와 연결 시켜줌. ALB & CLB만 사용가능

* Application Based Coookies
    * Custom Cookie
        * `AWSALB`, `WWSALBAPP`, `AWSALBTG` 사용하면 안됨
    * Application Cookie
        * Generate by load balancer
* Duration-based Cookie
    * Generate by load balancer
    * Cookie Name: `AWSALB`, `AWSELB`

#### Cross Zone Load Balancing

다른 가용영역안에 인스턴스들에게 동일한 트래픽을 분배함

**Application LoadBalancer**

* 항상 켜져 있음
* 끌 수 없다
* 돈을 지불하지 않음

**Network LoadBalancer & Gateway Load Balancer**

* 기본 값 꺼져있음
* 키면 돈을 지불함

**Classic Load Balancer**

* 기본 값 꺼져있음
* 켜도 돈을 지불하지 않음

#### SSL 인증서

* `ACM(AWS Certificate Manager)`를 통해 SSL인증서를 관리할 수 있음
* x509 인증 방식 사용
* 사용자 인증서로 교체 가능

**SNI(sever Name Indication)**

* 최신 프로토콜
* 대상 서버의 호스트 이름을 지정하여야 됨
* ALB, NLB 같은 최신 로드밸런서에서 사용가능
* 서로 다른 인증서를 사용하여 다른 웹사이트로 연결되는 다수의 대상그룹을 가질 수 있음
    * CLB는 하나의 인증서만
    * NLB, ALB는 다수의 인증서와 SNI를 지원

#### Connection Draining

* 연결드레이닝 = 등록 취소 지연
* 인스턴스가 등록 취소, 혹은 비정상적인 상태에 있을 때 어느정도 시간을 주어 활성 요청을 완료할 수 있는 기능
* 1 - 3600초 (기본은 300초)
* 끌 수 도 있음

#### Auto Scaling Group(ASG)

* 스케일 인 / 스케일 아웃 할 때 사용
* 최소 및 최대 갯수, 목표 개수 설정 가능
* 로드 밸런서에 묶어서 사용할 수 있음
* 최소 개수의 인스턴스 실행을 보장한다.
* 상태가 비정상이면 EC2인스턴스를 재 생성한다.
* 비용은 무료
* `ASG Launch Template`으로 생성
* `Cloud Watch`에 경보를 통해 ASG를 컨트롤(ex 평균 CPU 사용량)

#### Group Attribute

* Launch Configuration은 만료됐음

* Launch Template를 사용
    * AMI + Instance Type
    * EC2 User Data
    * EBS Volumes
    * Security Group
    * SSH Key pair
    * IAM Role
    * Load Balancer Infomation
* Min / Max / Init Capacity
* Scaling Policies

#### Cloud Watch Alarms & Scaling

* Cloud Watch 알람을 통해 스케일 업/다운
* Average CPU or custom metric

#### Dynamic  Scaling Polices

* Target Tracking Scaling
    * 대상 추적 스케일링
    * 가장 단순하고 설정하기 쉬움
    * 평균 CPU 사용량처럼 기준 선을 세워두고 사용
* Smple/step scaling
    * Cloud Watch 경보를 설정하고 인스턴스를 추가하거나 삭제
* Sheduled Action
    * 사용패턴을 바탕으로 스케일링을 예상
    * 5시에 행사가 있을 때 해당 시간에 인스턴스 수를 늘림
* Predictive Scaling
    * 시간에 걸쳐 과거 로드를 분석하여 인스턴스 수를 조정
    * 머신러닝 기반

**Good Metrics to sclae on**

* CPUUtilzation: CPU 평균
* RequestCountPerTarget: EC2 인스턴스에 request 사용량
* Average Network In / out: 네트워크 병목 현상 기준으로
* Any: `CloudWatch`에서 커스텀하여 직접 설정할 수 있음

#### Scaling Cooldowns

스케일링이 작업이 끝날 떄마다 인스턴스의 추가 또는 삭제를 막론하고 5분 혹은 300초의 휴식 기간을 갖는것

휴식기간에는 추가인스턴스를 실행 또는 종료 할 수 없다.

### RDS

#### 종류

* PostgreSQL
* MySQL
* maria
* oracle
* microsoft sql server
* aurora

#### 특징

* 자동 프로비저닝, OS 패치
* 지속적인 백업 및 복원
* 모니터링 대시보드
* 읽기전용 복제본
* 다중 가용영역, DR
* 윈도우 업그레이드
* 스케일링
* Storage backged by EBS(gp2 or io1)
* SSH로 접속불가

#### Storage Auto Scaling

* 오토 스케일링이 활성화 되어 있으면 자동으로 스토리지를 확장해줌
* IOPS 임계값 확인
* 확장할 최대치 정하기
* 예측이 어려울 떄 사용
* 모든 RDS 데이터베이스 엔진에서 지원

#### 읽기전용 복제본과 다중 AZ

**읽기전용복제본**

* 읽기 인스턴스를 스케일링 함
* 최대 다섯개까지 생성할 수 있음
* 동일한 AZ 또는 리전을 걸쳐서 생성될 수 있음
* 비동기식 복제
* Only For `SELECT`
* 동일한 리전이면 비용이 부과 되지 않으나, 다른 리전이면 비용이 부과 됨

**다중 AZ**

* 재해 복구에 사용
* 마스터 - 슬레이브
* 가용성
* 동기식 복제
* 비용은 무료
* 재해 복구를 위해 읽기전용 복제본을 다중 AZ로 설정 가능

**시험에 나오는 문제**

* 단일 AZ에서 다중 AZ로 전환 시 데이터베이스를 중지 할 필요가 없음
* AZ기능을 활성화 시키면 됨
* 스냅 샷으로 동기화

#### RDS Custom

* 기존 데이터베이스와 OS에 엑세스 할 수 있음
* **오라클 및 MS SQL Server만 관리할 수 있음**

#### Amazon Aurora

* aws의 고유 기술
* Postgres, Mysql과 호환
* 클라우드에 최적화
* Mysql 5배, postgres 3배 높은 성능
* 스토리지 자동 확장 10GB -> 128TB
* 읽기 전용 복제본 15개까지 가능
* 전체적으로 다 빠름
* 비용은 20% 정도 높음
* 높은 가용성과 읽기 스케일링
* 6개의 사본을 저장함 (이중 4개만 있어도 괜찮음)
* Failover가 30초도 안걸림
* 수백개의 볼륨 사용
* 매우 빠른 장애 조치
* 쓰기 엔드포인터(마스터 인스턴스와 연결됨)
* 리더 엔드포인터(읽기전용복제본과 연결됨) - 로드벨런싱
* 백트랙 (과거시점으로 데이터 복원)
* **크로스 리전 지원**

#### Aurora 고급개념

**복제본 자동 스케일링**

* 읽기요청이 매우 많을 경우 오토스켈링을 설정하면 확장 됨
* 리드 엔드포인터도 같이 확장됨

**사용자지정 엔드포인트**

* 사용자지정엔드포인터를 통해서 특정 인스턴스로 요청 가능
* 특정 서브넷으로만 가도록 지정할 수 있음

**서버리스기능**

* 실제 사용량에 기반한 자동 데이터베이스 인스터화
* 자동 스케일링
* 인스턴스당 매 초당 비용을 지불
* 비용 면에서 효율적

**멀티마스터**

* 높은 가용성을 주기 위해서 멀티마스터 기능을 사용할 수 있음
* 모든 노드에서 읽기 및 쓰기가 가능함
* 즉각적인 장애 조치가 가능함(리더선출 지연시간이 없음)

**Global Aurora**

* 리전 간 복제
* 재해 복구
* 최근에 Global 데이터베이스로 만드는 것을 권장
* 리전 최대 5개까지 지정가능
* 읽기전용 복제본 16개까지 사용가능
* RTO(Recovery Time Objective/복구목표시간) 1분 미만

**머신러닝**

* ML 경험이 없어도 됨

* SagaMaker: 어떤 머신 러닝 모델이라도 사용할 수 있게 해줌
* Amazon Comprehend: 감정분석

#### 백업과 모니터링

**자동백업**

* 매일 정해진 시간에 데이터베이스를 전체를 백업
* 5분마다 트랜잭션 로그도 백업
* 5분전 어떤 시점으로라도 복구가 가능
* 자동 백업 보유기간은 1 - 35일
* 기간이 지나면 사라짐

**수동 DB 스냅샷**

* 사용자가 수동으로 트리거
* 원하는만큼 오랫동안 보유할수 있다.

> 비용 측면에서는 2시간 사용 후 스냅샷을 만들고 데이터베이스를 삭제하면 더 저렴하게 사용할수 있다

**aurora 백업**

* 1 - 35일
* 비활성화는 불가능함
* 지정시간 복구기능
* 원하는 기간 보유가 가능

**RDS & Aurora Restore Option**

* 스냅샷
* Restoring MySQL RDS database from S3
    * Create Backup of your on-premises database
    * store it on amazon s3
    * Restore the backup file onto a New RDS Instance

* Restoring MySQL Aurora Cluster from S3
    * 온프레미스 데이터베이스를 `Percona XtraBackup`을 사용하여 s3로 백업

**Aurora Database Cloning**

* 기존 데이터베이스로 부터 새로운 Aurora DB 클러스터를 만들 수 있음.
* 빠른 스냅샷 및 복구
* `production` 데이터베이스에서 `staging` 데이터베이스로 영향없이 복사 가능

#### Security

* 데이터 암호화
* KMS를 사용해 모든 데이터를 암호화함
* 마스터를 암호화 하지 않았으면 읽기전용도 암호화 되지 않음
* 사용자 이름이나 패스워드나 IAM Role
* 보안 그룹을 통해 특정 접근을 차단 할 수 있음

#### proxy

* 프록시를 사용하면 데이터베이스 연결 풀을 형성하고 공유할 수 있음
* 완전한 서버리스
* 오토 스케일링이 가능함
* 다중 AZ지원
* 장애조치시간을 66%까지 줄일 수 있음
* Mysql, PostgresQL, Maria and Aurora
* Lamda

#### Elastic Cache

* RDS 앞에 놓인 캐시서버
* Redis, MemCache등 캐시 기술을 관리
* 인메모리 데이터베이스
* 무상태 앱을 만드는데 도움
* AWS가 OS, patching, setup, configuation 등 다 관리해줌
* 앱에서 코드를 많이 바꿔야됨
* 성능을 향상 시킴

**redis vs Memcache**

* redis(고가용성)

    * redis 는 다중 AZ 가능

    * 읽기전용 인스턴스 확장이 가능

    * 가용성이 높음

    * 백업 복원 기능

* Memcache(단순 분산 캐시)
    * 샤딩
    * 데이터 분할 다중 노드
    * 가용성이 높지 않음
    * 복제도 없고, 백업, 복원 기능도 없음
    * 멀티쓰레드

**Cache Security**

Redis Auth

* IAM 지원하지 않음
* API 레벨에서만 IAM을 지원
* 클러스터 생성시 비밀번호/토큰을 설정가능
* SSL 보안을 지원할 수 있음

Memcached

* SASL based authentication

**캐시 사용 패턴**

* Lazy Loading
    * 모든 읽기 데이터를 캐시(캐시 히트가 없을때 디비에서 가져옴)

* Write Through
    * 디비에 쓸 때 캐시를 업데이트함

* Session Store
    * 세션 데이터를 임시로 저장(TTL사용)

### Route 53

#### DNS

사람이 읽을 수 있는 주소

#### Amazon Route 53

* 고가용성, 확장성, AWS에 의해 관리됨
* 도메인 등록
* 리소스 상태체크
* 100% SLA 제공

#### Record

* Domain/Subdomain
    * example.com
* Record Type
    * A, AAAA, CNAME, NS...
* Value
    * 12.34.56.78]
* Routping Policy
* TTL

#### Hosted Zone

호스트 구역당 $0.50달러 지불

* public
    * internet으로 접근 가능
* private
    * 하나 이상의 VPC

#### Records TTL

* TTL 만큼 캐시됨

* TTL 이 지나지 않으면 연결 된 주소를 갱신하지 않음

#### CNAME VS Alias

* `CNAME`은 루트도메인 이름이 아닌 경우에만 동작

* `alias`는 루트 도메인 및 비루트도메인 모두 동작
    * 비용 무료
    * 상태체크

#### Alias Records

| RecordName  | Type | Value      |
| ----------- | ---- | ---------- |
| example.com | A    | MYALB..... |

* A / AAAA for AWS resource
* TTL을 사용할 수 없음
* 레코드 지정
    * Eleastic Load Balancer
    * CloudFront Distributions
    * API Gateway
    * Elastic Beanstalk
    * S3 Website
    * VPC Interface Endpoint
    * Global Accelerator
    * 같은 호스트 존 Route 53

> Alias는 EC2 DNS Name은 지정할 수 없다

#### Route Policies

**유형**

* Simple
    * 물리적인 싱글 리소스로 라우팅
    * Single / Multiple Value
        * A 111.22.33.44
        * A 55.66.77.88
    * 멀티 일 경우 랜덤으로 하나가 지정됨
    * 상태체크와 연결 시킬 수 없다.
* Weighted
    * 가중치
    * 70:20:10의 비율로 분배가능
    * 가중치는 100이 아니여도 된다
    * 0으로 지정할 경우 보내지 않음
        * 모두가 0이면 같은 비율로 리턴
* Failover
    * 상태 체크를 하여 primary/secondary 전환
* Lantency based
    * user와 aws 리전 간 최적의 라우팅
* Geolocation
    * 유저의 지역에 따라 라우팅 함
* Multi-Value Answer
    * 여러 리소스에 라우팅 할 떄 사용
    * 헬스 체크와 같이 사용할 수 있음
* GeoProximity
    * `bias`를 두어 유저의 위치와 가중치를 비교하여 높은`bias`기준으로 라우팅

**상태체크**

* 퍼블릭 리소스에 한해 체크함
* 헬스체크는 CW Metrics과 통합됨
* 200 ~ 300은 정상
* 5120 bytes on response
* 프라이빗의 경우는 `CloudWatch Metric`과 `CloudWatch Alarm`을 통해 상태체크를 진행

#### Elastic Beanstalk

* 개발자가 인프라를 신경 쓰지 않게 자동으로 구성해줌
* 오토 스케일링, 프로비저닝, 앱 모니터링
* 개발자는 코드만 작성하면 됨
* WebServer Tier
    * ELB + ASG
* Worker Tier
    * SQS + ASG

### S3

#### 용도

* 백업 및 저장
* DR(Disaster Recovery)
* 기록 저장소
* 하이브리드 클라우드 스토리지
* 앱 호스팅
* 미디어 호스팅
* 빅데이터 분석
* 앱 전송
* 정적 웹사이트

#### Buckets

* 전세계적으로 이름은 유니크 해야된다.
* 지역별로 생성

#### Object

* prefix + objectname
* `/`를 이용해 구분
* MAX 5TB
* 5GB이상은 `멀티업로드`기능을 사용해야함

> 100MB이상이면 멀티업로드 기능 권장

#### security

* User Based
    * IAM
* Resource-Based
    * Buckey Polices
    * Object ACL
    * Bucket ACL
* 암호화

#### Statica Website Hosting

* 정적 웹사이트를 올릴 수 있다.
* URL은 지역에 종속적임
* 403 Fobidden error가 뜬다면 bucket 정책 확인 필요

#### Version

* 버킷에서 버전관리를 활성화
* 버전 관리 전 파일은 `null`로 버전 아이디가 지정됨
* 파일을 삭제 하지 않게 도와줌
* Delete Marker를 구성

#### Replication

* Cross-Region Replication(CRR)
* Same-Region Replication(SRR)
* 비동기 적 복사
* A->B->C로 복사 안 되며, A -> B, A -> C로 복사시켜야 됨

#### Storage Classes

* S3 Standard - General Purpose
    * 99.99 Avaliability
    * 자주 접근되는 데이터
    * 짧은 지연시간, 고성능
    * 빅데이터, 모바일 앱...
* S3 Standard - Infrequent Access(IA)
    * 조금 덜 접근하는 데이터이지만 빠르게 접근이 가능해야될때
    * Standard 보다 조금 더 저렴
    * 99.9 Avaliability
    * Diaster Recovery, backup
    * 최소 30일
* S3 One Zone - Infrequent Access
    * 99.999999999%
    * Single AZ
    * 99.5 Avaliability
    * Copy On-premises data
    * 최소 30일
* S3 Glacier Instant Retrieval
    * 최소 90일
    * 분기에 한번 엑세스 하는 데이터에 적합
    * 밀리초 검색
* S3 Glacier Flexible Retrieval
    * 정책
        * Expeited(1 - 5 minutes)
        * Standard(3 - 5 hours)
        * Bulk(5 - 12 hours)
    * 최소 90일
* S3 Glacier Deep Archive
    * 정책
        * Standard(12 hours)
        * Bulk(48 hours)
    * 최소 180일
* S3 Inteligent Tiering
    * 사용 패턴에 따라 엑세스 티어간 객체를 이동할수 있게 해줌
    * 자동으로 이동 시켜줌
    * 검색 비용이 없음
        * Frequent Access tier (automatic): default tier
        *  Infrequent Access tier (automatic): objects not accessed for 30 days
        * Archive Instant Access tier (automatic): objects not accessed for 90 days
        * Archive Access tier (optional): configurable from 90 days to 700+ days
        * Deep Archive Access tier (optional): config. from 180 days to 700+ days

#### Lifecycle Rules

특정 이름만 가진 객체로 분리하여도 사용가능

시험 단골 문제

**Transition Action**

* 다른 스토리지 클래스로 객체를 이동 시키도록 구성

**Expiration action**

* 일정 시간이 지나면 데이터를 삭제하도록 구성
* 완료되지 않은 멀티파트 업로드를 삭제하도록도 구성 가능

#### Analytics - Storage Class Analysis

* 최적의 기간을 뽑을 때 사용
* Onezone IA or Glacier는 사용하지 않음
* Stand Stand IA만 사용
* 매일 기록들을 업데이트함
* 24 - 48 시간 분석

#### Requester Pays

대부분 S3에 사용자가 돈을 지불하지만 S3데이터를 요청한 인가된 사용자에게  요금을 지불 할 수 있음

#### Event Notifications

* SNS, SQS, Lamda Function으로 S3이벤트들을 전달 할 수 있음
* 몇 초 혹은 몇 분이 걸릴 수도 있음
* `Amazon EventBridge`를 사용하여  `bucket`에 이벤트를 전달 할 수 있음
    * 필터링
    * 다중 목적지 전달(kinesis, Firehose...)

#### Baseline Perfomance

* 요청이 많을 때 자동으로 확장 됨
* 지연시간 100 - 200ms
* 접두사당 초당 3500개의 `put/copy/post/delete`처리
* 접두사당 초당 5500개의 `GET/HEAD`처리
* 버킷 내 접두사에 제한이 없음

#### Perfomace

**Multi Upload**

* 100MB 이상이면 사용하도록 권장
* 최대 5GB
* 병렬처리로 빠름

**S3 Transfer Accelation**

* 파일을 AWS 엣지 로케이션으로 전송해서 전송 속도를 올려줌
* 멀티파트와 같이 사용할 수 있음

#### Select & Glacier Select

* s3 파일을 검색할 때 쉽게 질의할 수 있게 사용 가능
* 서버측 필터링

#### Batch Operation

* 단일요청으로 대량 요청을 진행 할 떄 사용
* 배치 작업으로 s3버킷간 객체 복사
* 암호화 되지 않은 객체를 암호화 시킬 수 있음
* 많은 객체를 복사 할 수 있음
* 사용자 지정작업도 가능

#### Security

**객체암호화**

* 서버사이드 암호화(SSE)
    * SSE-S3
        * AWS가 전적으로 관리
        * AES-256
        * `x-amz-server-side-encryption: AES256`
    * SSE-KMS
        * AWS에서 암호화가 일어나고 AWS가 암호화키를 관리하게 되지만 암호화키의 교체 정책은 당사자가 관리
        * `x-amz-server-side-encryption: aws:kms`
    * SSE-C
        * AWS에서 암호화가 일어나지만 당사자가 암호화키를 전적으로 관리
        * HTTPS만 사용
* 클라이언트 암호화

**CORS**

* Cross-Origin Resource Sharing
* `origin`과 비교하여 틀릴경우 에러가 발생함
* `Access-Control-Allow-Origin`을 사용하여 허용 가능

**MFA Delete**

* 객체 삭제 시 MFA 인증 활성화 가능

**Access Log**

* 엑세스 로그를 활성화하여 s3 요청 메시지를 로그 s3로 이동 가능

* 같은 리전이여야 함

**Pre signed URL**

* s3 console, aws cli, sdk로 생성 가능
    * S3 Console (1 - 720min)
    * AWS CLI (기본:3600초, max:168hours)

**Glacier Valut Lock**

* Valut를 사용하여 객체 락
* 객체는 삭제 되지 않음

#### EC2 Instance Metadata

* http://169.254.169.254/latest/meta-data
* curl을 통해 메타 정보를 가져 올 수 있음

### Global Infrastructure

#### Cloud Front

* CDN(Content Dlivery Network)
* 읽기 성능을 향상 시키며 엣지에 캐시
* DDOS를 막을 수 있다(With Shield, With Web Application Firewall)

**origins**

s3 bucket

* OAI를 통해 보안을 강화할 수 있음
* ingress를 사용한다(upload file to s3)

custom origin(http)

* ALB
* EC2 Instance
* S3 Website
* Any HTTP Backend

**CloudFront VS S3 Cross Region Replications**

CloudFont

* Global Edge network
* 파일 캐시, TTL
* 정적인 컨텐츠에 적합

S3 Cross Region Replication

* 각 지역에서 앱 설치
* 실시간으로 업데이트
* 읽기 전용

**Geo Restriction**

* Allow List
* BlockList

#### Global Accelerator

* EIP, EC2 Instance, ALB, NLB, public or private
* UDP, TCP, VOIP
* 고정 아이피 필요
* 동시성 향상
    * 낮은 지연시간
* 상태 체크
* 보안
    * DDos 보호 (With AWS Shield)

### Advanced Storage on AWS

#### Snow Family

오프라인 장치에 데이터를 이전하는데 사용

광산이나 배 또한 트럭 이런 곳에서 사용

스노우볼은 Glacier에 직접적으로 임포트 할수 없으며 S3를 통해야 됨

* Data migration
    * snowcone
    * snowball Edge
    * snow mobile
* Edge Computing
    * snowcone
    * sonwball Edge

**Snowball Edge**

* move TBs or PBs of data AWS
* 전송 job에 따라 돈을 지불
* 80 TBs
* 옵션
    * Snowball Edge Storage Optimized
        * 80TB of HDD Capacity
        * 40 vCPU
    * Snowball Edge Compute Optimized
        * 42TB of HDD Capacity
        * 52 vCPU, 208 GiB

**Snowcone**

* 작고 가볍다
* 2 CPU, 4GB of Memory
* 8TBs of Usable Storage
* 베터리와 케이블을 제공해야됨
* `AWS DataSync`로 전송

**Snowmobile**

* 트럭임...
* 1EP를 전송하는데 사용(1000PB)
* 100PB 이상이면...

#### Amazon FSx

**Amazon FSx for windows**

* fully manage
* SMP protocol & NTFS
* Linux EC2 인스턴스에 마운트 가능
* DFS(Distributed File System) 지원

**Amazon FSx for Lustre**

* HPC(High Performance Computing)
* Scaled up to 100s GB/s
* Seamless intefration With S3
* 온프레미스 서버에서 사용가능(Aws VPN, AWS Direct Connect)
* `hotdata`

**Amazon FSx for NetApp ONTAP**

* NetApp OnTAP

* NFS, SMB, ISCSi Protocol
* Linux, window, mac, VMWare
* testing Network

**Amazon FSx for OpenZFS**

* NFS
* 1,000,000 IOPS

#### Hybrid Cloud for Storage

* 온프레미스 머신과 같이 사용
* AWS Storage GateWay를 사용함

**AWS Storage Gateway**

* 온프레미스 데이터와 클라우드 데이터사이에 브릿지

* 온프레미스 - Storage Gateway -  aws

* 백업 및 복구

* 온프레미스 캐쉬

* 종류

    * S3 File Gateway
        * NFS, SMB
        * 가장 최근에 사용된 사용자 데이터를 캐시함
        * Glacier를 사용할려면 S3에  LifeCycle Policy를 적용
        * IAM Role for each  File Gateway
        * S3, Glacier
    * FSx File Gateway
        * Window File Server
        * 자주 접근되는 데이터를 캐시함
        * SMB, NTFS, Active Diretory
        * `S3`

    * Volume GateWay
        * iSCSi Protocol
        * S3 버킷을 통해 `EBS Snapshot`백업
        * 캐시 볼륨
        * S3에 예약 백업
    * Tape Gateway
        * Vrtiaul Tape Library(VTL)
        * S3 To `Glacier`
        * 물리적인 테이프

#### AWS Transfer Faimily

* FTP
* FTPS
* SFTP

#### AWS Data Sync

* 온프레미스나 다른 클라우드의 경우 에이전트가 필요하다
* 파일권한과 파일 메타데이터는 보존된다.
* 복제는 시간, 일, 주로 구성할 수 있음
* 복제 목적지
    * S3(including Glacier)
    * EFS
    * FSX