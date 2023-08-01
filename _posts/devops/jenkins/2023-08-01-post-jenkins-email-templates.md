---
published: true
title: "jenkins - email-template"
categories:
  - Jenkins
tags:
  - [jenkins]
toc: true
toc_sticky: true
date: "2023-08-01 10:00"
---

`jenkins`는 `email-template`기능을 활용하여 수정하여 보낼 수 있습니다. 그렇게 구성하기 위해서는 다음과 같은 절차가 필요합니다.

1. jenkins 홈에 email-templates구성

```bash
mkdir -p /var/lib/jenkins/email-templates
```

2. template 파일 구축

[email-extension 문서](https://plugins.jenkins.io/email-ext/)

플러그인 공식 문서를 보면 `groovy`와 `jelly` template를 지원하는 것을 알 수 있습니다. 해당 템플릿을 사용하기위해서는 `HTML`모드로 변경 후에 다음과 같이 `jenkins`설정을 통해 메일을 배포할 수 있습니다.

```bash
rnd@jenkins-ctrl:/var/lib/jenkins/email-templates$ ls
default.jelly
```

3. jenkins email content 설정

```bash
${JELLY_SCRIPT, template="default"}
```

4. 빌드 결과 전송 확인

```bash
      emailext(
        to: 'kyh0703@nate.co.kr',
        subject: '${DEFAULT_SUBJECT}',
        body: '${DEFAULT_CONTENT}'
      )
```
