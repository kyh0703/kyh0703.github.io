---
published: true
title: "Ansible - gather_facts"
categories:
  - Ansible
tags:
  - [devops, Ansible]
toc: true
toc_sticky: true
date: "2022-04-07 19:30"
---

#### Gather_facts

`ansible-playbook.yml`파일들을 보다보면 `gather_facts`라는 것이 보입니다. 

**Facts?**

`ansible`에서 `node`에 동적으로 할당되는 변수들을 의미합니다. 각 노드들의 정보를 취합하는 옵션이라고 보시면 됩니다.

**How?**

```yaml
- name: Gethe Facts
  hosts:
    - all
  gather_facts: true
  tasks:
    - include: ./taksks/test.yml
```

단순히 `playbook.yml`에 `gather_facts`라는 키워드를 넣기만 하면 노드들의 정보들을 취합합니다. 하지만 주의할 점은 **`gather_facts` 옵션을 키면 노드들의 정보를 가져오는데 시간이 걸리기에 작업이 느려질 수 이 있음을 인지하여야 합니다.**

노드들의 정보를 보면 `호스트네임, 호스트..` 사용할 수 있는 많은 정보들이 보입니다.

예시를 들면 아래와 같이 `/etc/hosts`에 전체 노드들의 대한 정보를 넣어줄 수 있습니다.

```yaml
---
- name: gen etc hosts
  lineinfile:
    path: /etc/hosts
    line: "{{ hostvars[item]['ansible_facts']['default_ipv4']['address'] }} {{ hostvars[item]['ansible_facts']['hostname'] }}"
  loop: "{{ ansible_play_hosts }}"

```

### 마치며

`Ansible`의 관심을 가지고 나서 유데미 강의와 조훈님의 책을 완독했습니다. 사내에 사용하던 장비들의 `Role`을 구성하는 재미가 있네요🙂
