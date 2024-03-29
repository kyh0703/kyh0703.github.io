---
published: true
title: "django - 2"
categories:
  - Django
tags:
  - [django]
toc: true
toc_sticky: true
date: "2022-07-24 21:00"
---

#### Django Tree

```bash
C:.
│   manage.py
│
└───setting
        asgi.py     # ASGI 호환 웹서버를 프로젝트에 제공하는 엔트리 포인트
        settings.py # 전체 구성 설정
        urls.py     # 뷰 지정
        wsgi.py     # WSI 호환 웹 서버를 프로젝트에 제공하기 위한 엔트리 포인트
        __init__.py
```

**Django Project Structure**

```bash
------ social Network Website Project ------
 | messages App | Photos App | Video App |
```

동적 라우팅

```python
# urls.py
urlpatterns = [
    path('<str:topic>', views.new_view)
]


# views.py
articles = {
    "sports": "Sports Page",
    "finance": "Finance Page",
    "politics": "Politics Page",
}
# Create your views here.
def new_view(request, topic):
    return HttpResponse(articles[topic])
```

#### Response Not Found & 404

```python
def new_view(request, topic):
    try:
        result = articles[topic]
        return HttpResponse(articles[topic])
    except:
        raise Http404("404 GENERIC ERROR")
        # return HttpReseponseNotFound("404 GENERIC ERROR")
```

#### 리디렉션

```python
def num_page_view(request, num_page):
    try:
        topics_list = list(articles.keys())
        topic = topics_list[num_page]
        return HttpResponseRedirect(topic)
    except:
        raise Http404("404 GENERIC ERROR")
```

#### Render

- `project/templates/{app_name}/html`파일 생성
- settings.py template수정

```yaml

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # 자동으로 앱 및에 만들면 찾으나 여기선 지정
        "DIRS": [os.path.join(BASE_DIR, "templates/")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
```

#### Templates

1. 앱 설정

```bash
python manage.py startapp {app}
```

- URL, VIEWS 연결

2. migrate

`settings.,py`의 내부의 설치된 앱을 보고 필요한 데이터베이스 테이블을 생성함

```bash
python manage.py migrate
```

3. `settings.py` 내부에 앱 등록

```bash
INSTALLED_APPS = [
	{app}
]
```

4. make migration

앱과 모든 데이터베이스 변경 사항을 등록

```bash
python mamage.py makemigrations my_app
```

5. python manage.py migrate 실행

6. 앱 디렉토리 내부에 templates 생성

```bash
my_site
  my_app
    templates
      my_app
        exmaple.html
```

#### 태그 및 URL

```python
# url.py
from django.urls import path
from . import views

# register the app namespace
# URL NAMES
app_name = "my_app"

urlpatterns = [
	path("", views.example_view, name="example"),
  path("variable/", views.variable_view, name='variable'),
]
```

![image-20220726124202288](../../../assets/images/posts/2022-07-24-post-django-2/image-20220726124202288.png)

#### 사용자 정의 오류 템플릿

- 404 page등 사용자 오류 정의 페이지를 만들 수 있다.

- `templates > 404.html`
- 자동으로 찾아서 보여줌...

- 파일을 변경하면 리소스를 찾을 수 없음.
- 찾기 위해서는 특정 상태를 표기

`settings>views.py`

````

#### Static

`app/static/my_app/spider.png`

```python
from django.shortcuts import render


def my_custom_page_not_found_view(request, exception):
    return render(request, "error_view.html', status=404")
```

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("my_app/", include("my_app.urls")),
    path("admin/", admin.site.urls),
]

handle404= 'my_site.views.my_custom_page_not_found_view'
```
````
