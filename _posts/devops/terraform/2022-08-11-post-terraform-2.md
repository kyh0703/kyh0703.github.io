---
published: true
title: "terraform - 2"
categories:
  - Terraform 
tags:
  - [terraform ]
toc: true
toc_sticky: true
date: "2022-08-11 10:30"
---

[실습링크](https://terraform101.inflearn.devopsart.dev/preparation/aws-configure/)

### 구성요소

* `provider` 테라폼으로 생성할 인프라의 종류
* `resource` 테라폼으로 실제로 생성할 인프라 자원
* `state` 테라폼을 통해 생성한 자원의 상태
* `output` 테라폼으로 만든 자원을 변수 형태로 state에 저장
* `module` 공통적으로 활용할 수 있는 코드를 모듈 형태로 정의
* `remote` 다른 경로의 state를 참조

#### provider.tf

```bash
provider "aws" {
  region = "ap-norheast-2"
  version = "~> 3.0"
}
```

### 기본 명령어

* `init` 테라폼 명령어 사용을 위해 각종 설정을 진행
* `plan` 테라폼으로 작성한 코드가 실제로 어떻게 만들어질지에 대한 예측 결과를 보여줌
* `apply` 테라폼 코드로 실제 인프라를 생성하는 명령어
* `import` 이미 만들어진 자원을 테라폼 "state"파일로 옮겨주는 명령어
* `state` 테라폼 "state"를 다루는 명령어
* `destroy` 생성된 자원들 "state"파일 모두 삭제하는 명령어

### AWS 계정 설정

Terraform 을 사용하기 위해서는 적절한 권한을 가진 IAM 이 필요합니다.
이 문서에서는 EC2/S3/DynamoDB/RDS/CloudWatch/IAM 의 접근 권한이 있는 IAM 을 생성합니다. ( AWS 계정은 이미 준비되어 있다고 가정합니다. )

1. [AWS Console](https://aws.amazon.com/ko/console/) 접속
2. Region 선택 ( 이 글에서는 ap-northeast-2 Seoul 을 기준으로 설명 합니다. )
3. **IAM** 메뉴 접속
4. 새로운 유저 추가 ( 프로그래밍 방식 액세스 선택 )
5. 새로운 유저에 적절한 정책 추가 ( 관리하려는 리소스에 따라 적절한 권한이 필요합니다. )
   - AmazonEC2FullAccess
   - AmazonS3FullAccess
   - AmazonDynamoDBFullAccess
   - AmazonRDSFullAccess
   - CloudWatchFullAccess
   - IAMFullAccess
6. 생성된 유저 토큰 정보를 안전하게 저장 ( 텍스트로 저장하는 것 보다는, Bitwarden / Keybase / KeyChain 등의 안전한 Passowrd 보관 유틸리티에 저장하는 것을 권장합니다. )
7. 토큰 정보를 테라폼에서 사용할 수 있게 환경 변수로 export
   `export AWS_ACCESS_KEY_ID=${위에서 생성한 ACCESS KEY}`
   `export AWs_SECRET_ACCESS_KEY=${위에서 생성한 SECRET ACCESS KEY}`

```bash
$ aws configure

$ cat ~/.aws/config
$ cat ~/.aws/credntials
```

[테라폼사이트](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket)
