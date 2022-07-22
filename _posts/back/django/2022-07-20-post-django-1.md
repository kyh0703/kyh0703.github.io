---
published: true
title: "django - 1"
categories:
  - django
tags:
  - [django]
toc: true
toc_sticky: true
date: "2022-07-20 11:00"
---

#### Requirement

* virtualenv 설치

```bash
pip3 install virtualenv
pip3 install django
pip3 install djangorestframework
```

* 적용

```bash
virtualenv --python=python3 devenv
```

* window 적용

```bash
devenv/Scripts/activate
```

#### Create Project

```bash
django-admin startproject setting
```

#### Secrets

`setting.py`에 있는 `SECCRET_KEY`는 따로 보관 되어야 됌.

* 보관 파일 생성

```bash
touch secrets.json
```

* 보관

```bash
{
    "SECRET_KEY": "{SECRET_KEY}"
}
```

* setting.py 변경

```python
# setting.py
import os
import json

secret_file = os.path.join(BASE_DIR, "secrets.json")

with open(secret_file) as f:
    secrets = json.loads(f.read())


def get_secret(setting, secrets=secrets):
    try:
        return secrets[setting]
    except KeyError:
        error_msg = f"Set the {setting} environment variable"
        raise ImproperlyConfigured(error_msg)


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = get_secret("SECRET_KEY")
```

#### Exec

* 기초작업

```bash
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py runserver
```

* app 생성

```bash
django-admin startapp authentication
```

* python 패키지

```bash
pip freeze > requirements.txt
```

