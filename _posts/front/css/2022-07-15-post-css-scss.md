---
published: true
title: "css - scss"
categories:
  - CSS
tags:
  - [css, nomadcoders]
toc: true
toc_sticky: true
date: "2022-07-15 21:00"
---

### SCSS

**SCSS**

* 기본적으로 `CSS preprocessor`이다.

* CSS 프로그래밍 랭귀지로 만든다

* 컴파일-빌드 단계가 필요하다.
* 업계 표준이다.

#### variable

web에서 중요한 `color`이나 `style`을 저장할 때 사용

**적용**

* src/scss/_variables.scss 파일 생성

```scss
$bg: #e7473c;
```

> 밑줄이 있는 파일은 `css`로 변환하지 않기위해 명시

* styles.scss 적용

```scss
@import "_variables";

body {
  background: $bg;
}
```

#### Nesting

* 타겟하는 `element`를 정확하게 함

```scss
.box {
  margin-top: 20px;
  h2 {
    color: blue;
    &:hover {
      color: red;
    }
  }
  button {
    color: red;
  }
  &:hover {
    background-color: green;
  }
}
```

#### Mixins

SCSS functionality를 재사용할 수 있도록 함

css결과 값을 프로그래밍으로 바꿈

> 상황에 따라 다르게 코딩을 하고 싶으면 사용

* src/scss/_mixins.scss

```scss
@mixin link($word) {
  text-decoration: none;
  display: block;
  @if $word == "odd" {
    color: blue;
  } @else {
    color: red;
  }
}
```

* src/scss/style.scss

```scss
@import "_variables";
@import "_mixins";

a {
  margin-bottom: 10px;
  &:nth-child(odd) {
    @include link("odd");
  }
  &:nth-child(even) {
    @include link("even");
  }
}

```

#### Extends

다른 코드를 확장하거나 코드를 재사용하고 싶을 때 사용

> 같은 코드를 중복하고 싶지 않을 때 사용

* src/scss/_button.scss

```scss
%button {
  font-family: inherit;
  border-radius: 7px;
  font-size: 12px;
  text-transform: uppercase;
  padding: 5px 10px;
  background-color: peru;
  color: white;
  font-weight: 500;
}
```

* src/scss/styles.scss

```scss
@import "_buttons";

a {
  @extend %button;
  text-decoration: none;
}

button {
  @extend %button;
  border: none;
}
```

#### Responsive Mixins

* minxins

```scss
$minIphone: 500px;
$maxIphone: 690px;
$minTablet: $minIphone + 1;
$maxTablet: 1120px;

@mixin responsive($device) {
  @if $device == "iphone" {
    @media screen and (min-width: $minIphone) and (max-width: $maxIphone) {
      @content;
    }
  } @else if $device == "tablet" {
    @media screen and (min-width: $minTablet) and (max-width: $maxTablet) {
      @content;
    }
  } @else if $device == "iphone-l" {
    @media screen and (max-width: $minIphone) and (max-width: $maxIphone) and (orientation: landscape) {
      @content;
    }
  } @else if $device == "ipad-l" {
    @media screen and (max-width: $minTablet) and (max-width: $maxTablet) and (orientation: landscape) {
      @content;
    }
  }
}

```

* style.scss

```scss
@import "_mixins";

h1 {
  color: red;
  @include responsive("iphone") {
    color: yellow;
  }
  @include responsive("iphone-l") {
    font-size: 60px;
  }
  @include responsive("tablet") {
    color: green;
  }
  @include responsive("tablet-l") {
    font-size: 60px;
  }
}
```

#### Awesome-scss

[AWESOME-SCSS](https://github.com/colourgarden/awesome-scss)

* Bourbon
* Sass MediaQueries
* animate
