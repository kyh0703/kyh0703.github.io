---
published: true
title: "golang - junit"
categories:
  - GoLang
tags:
  - [golang, jnit]
toc: true
toc_sticky: true
date: "2023-08-01 09:00"
---

`golang`에서 `jenkins`를 통해 빌드를 하다보면 `junit`파일 형식으로 출력해야 되는 경우가 있습니다. 대부분에 `golang` 도구들은 `jnit`을 지원합니다. 아래와 같이 `Makefile`을 작성하여 CI를 구축하였습니다.

#### GO-STAND-LINT

```makefile
.PHONY: test
test:
	@echo "test-result:"
	@mkdir -p $(BUILD_REPORT)
	@$(GO) test -v \
		-tags="unit integration" \
		-covermode=atomic \
		-coverprofile=coverage.out \
		-outputdir=$(BUILD_REPORT) ./... \
		> $(BUILD_REPORT)/test.log
	@cat $(BUILD_REPORT)/test.log
	@go-junit-report -in $(BUILD_REPORT)/test.log -out $(BUILD_REPORT)/test.xml
	@echo ""
	@echo "test-cover:"
	@$(GO) tool cover -func $(BUILD_REPORT)/coverage.out
	@echo ""

```

#### GINKGO

```makefile
.PHONY: test
test:
	@echo "test-result:"
	@mkdir -p $(BUILD_REPORT)
	@ginkgo -v \
		--no-color \
		-covermode=atomic \
		-coverprofile=coverage.out \
		--junit-report=report.xml \
		-output-dir=$(BUILD_REPORT) ./...
	@echo ""
	@echo "test-cover:"
	@$(GO) tool cover -func $(BUILD_REPORT)/coverage.out
	@echo ""
```

![image-20230801132902399](C:\Users\bt-rnd6-user\AppData\Roaming\Typora\typora-user-images\image-20230801132902399.png)
