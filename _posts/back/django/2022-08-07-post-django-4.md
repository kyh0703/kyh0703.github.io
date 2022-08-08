---
published: true
title: "django - 4"
categories:
  - Django
tags:
  - [django]
toc: true
toc_sticky: true
date: "2022-08-07 11:00"
---

### Form

`django`에서는 간단한 폼을 통해 템플릿으로 보낼 수 있는 `form`클래스를 제공

>  해커는 위조폼을를 통해 일종의 피싱 사기를 칠 수 있다.

`django`에서는 `CSRF(Cross-Site request Forgery)`라는 개념이 있는데 교차 사이트 요청 위조라고 한다.

* 각 개별 세션 동안 모든 폼에 임의의 비밀번호와 토큰을 생성하는 것이다,
* 서버는 토큰이 현재 세션과 일치하는 지 확인 할 수 있다.
* `HTML <form>태그`에 <% csrf_token %>을 삽입하면 된다.

**django Form**

* 폼 태그
* `submit input`

```python
# cars/form.py
from django import forms


class ReviewForm(forms.Form):
    first_name = forms.CharField(label="First Name", max_length=100)
    last_name = forms.CharField(label="Last Name", max_length=100)
    email = forms.EmailField(label="Email")
    review = forms.CharField(label="Please Write your review hear")
```

```python
# cars/views.py
from django.shortcuts import render, redirect
from django.urls import reverse
from .forms import ReviewForm

# Create your views here.
def rental_review(request):

    # POST REQUEST --> FORM CONTENTS --> THANK YOU
    if request.method == "POST":
        form = ReviewForm(request.POST)
        if form.is_valid():
            # {'first_name':'job}
            print(form.cleaned_data)
            return redirect(reverse("cars:thank_you"))
    # ELSE, RENDER FORM
    else:
        form = ReviewForm()
    return render(request, "cars/rental_review.html", context={"form": form})


def thank_you(request):
    return render(request, "cars/thank_you.html")

```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>RENTAL_REVIEW</h1>
    <form action="" method="POST">
      {{form}}
      <input type="submit" />
    </form>
  </body>
</html>
```

