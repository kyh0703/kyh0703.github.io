---
published: true
title: "Ansible - connection & delegate-to"
categories:
  - Ansible
tags:
  - [devops, Ansible]
toc: true
toc_sticky: true
date: "2022-07-04 19:30"
---

### connction & delegate-to

`playbook`을 작성하다 보면, `hosts`의 정보들을 취합하여 데이터를 저장하여야 되는 경우가 있습니다. 이럴 때 각 `hosts`들의 정보를 각각 `host`에서 처리 할 수 도 있지만, `ansible`을 기동하는 서버에서 데이터를 취합 후 처리할 수 도 있습니다.

**상황별 처리 예시**

* 특정 노드에서 호스트 정보를 취합 후 사용

```yaml
- name: RKE Known hosts
  include: ./known_hosts.yml
  delegate_to: rke_master1
```

* known_hosts

```yaml
- name: known hosts
  connection: local
  serial: 1
  gather_facts: false
  hosts:
    - all
  tasks:
    - include: ./tasks/known_hosts.yml
```

**설명**

`connection`과 `deletegate-to`는 같은 기능을 하지만 주도적으로 담당하는 `host`가 어디인가를 구분 할 수 있습니다. `connection: local`인 경우에는 `ansible`을 기동하는 서버를 기준으로 동작합니다. 마찬가지로 `deletegate_to`를 특정 `host`로 지정하게 된다면 `ansible host`의 역할이 위임되어 지정한 노드를 기준으로 동작하게 됩니다.

### 마치며

`RKE`를 구성할 떄 `RKE를 동작 서버`를 기준으로 처리하여야 하였는데 `delegate-to`를 통해 해결하였습니다.