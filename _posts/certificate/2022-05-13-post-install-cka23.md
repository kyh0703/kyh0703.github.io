---
published: true
title: "CKA 자격증 따기 - day22"
categories:
  - Certificate
tags:
  - [certificate, CKA]
toc: true
toc_sticky: true
date: "2022-05-13 12:00"
---

#### YAML

```bash
# XML
<Servers>
  <Server>
    <name>Server1</name>
    <owner>John</owner>
    <created>1234</created>
    <status>active</status>
  </Server>
</Servers>

# JSON
{
  Servers: [
    {
      name: Server1,
      owner: John,
      created: 1234,
      status: active,
    }
  ]
}

# YAML
Servers:
  - name: Server1
    owner: John
    created: 1234
    status: active
```

* Key-Value Pair

```yaml
Fruit: Apple
```

* Array/Lists

```yaml
Fruits:
- Oragne
- Apple
- Banana
```

* Dictionary/Map

```yaml
Banana:
  Calories: 105
  Fat: 0.4g
  Carbs: 27g 
```

#### JSON Path

**Basic**

* data

```json
{
    "car": {
        "color": "blue",
        "price": "$20,000",
        "wheels": [
            {
                "model": "X345ERT",
                "location": "front-right"
            },
            {
                "model": "X236DEM",
                "location": "rear-right"
            },
            {
                "model": "X346ERT",
                "location": "front-left"
            },
            {
                "model": "X347ERT",
                "location": "rear-left"
            },
        ]
    }
}
```

* query

```bash
# Get the model of the rear-right wheel?

# [Array] 
$.car.wheels[2].model

# [Condition]
$.car.wheels[?(@.location == "rear-right")].model
```

**List**

```json
[
0    "apple", -5
1    "google", -4
2    "microsoft", -3
3    "amazon", -2
4    "facebook" -1 
]
```

* query

```bash
# Get the last element
$[-1:0]
$[-1:]

# Get the Last 3 elements
$[-3:]
```

**Kubernetes**

why? 

* Large Data sets
  * 100s of Nodes
  * 1000s of Pods, Delpoyments, ReplicaSets

* json query로 필요한데이터 추출

how?

1. Idenfiy the kubectl coomand
2. Familaize with JSON output
3. From the JSONPath Query(`$` 생략가능)

1. Use the JSON PATH query with kubectl command

```bash
k get po -o=jsonpath='{.items[0].sepc.container[0].image}'
k get no -o=jsonpath='{.items[*].metadata.name}'
k get no -o=jsonpath='{.items[*].status.nodeInfo.architecture}'
k get no -o=jsonpath='{.imtes[*].metadata.name}{.items[*].status.capacity.cpu}'
k get no -o=jsonpath='{.items[*].metadata.name} {"\n"} {.items[*].status.capacity.cpu}'
```

**loops - range**

* print

```bash
mater 4
node01 4
```

* plan

```bash
FOR EACH NODE
  PRINT NODE NAME \t PRINT CPU COUNT \n
END FOR
```

* command

```bash
`{range .itmes[*]}
	{.metadata.name} {"\t"} {.status.capacity.cpu} {"\n"}
{end}`
```

**custom columns**

```bash
# k get no -o=custom-columns=<COLUMN NAME>:<JSON PATH>
k get no -ocustom-columns=NODE:.metadata.name , CPU:.status.capacity.cpu
```

**sort**

```bash
k get no --sort-by=.metadat.name
```

#### 마치며

이로써 `udemy`강의를 끝냈습니다. 시험 신청 후 `killer.sh` 2일정도 할애한 후 자격증 시험에 도전할려합니다. 아자아자!
