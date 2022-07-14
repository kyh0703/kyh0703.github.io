---
published: true
title: "css - grid"
categories:
  - CSS
tags:
  - [css, nomadcoders]
toc: true
toc_sticky: true
date: "2022-07-12 21:00"
---

### GRID

`flex-box`에서 `grid`를 만들기는 어렵다.

#### CSS Grid Basic Concept

`grid`도 부모에서 적용된다.

* grid-template-columns
* grid-template-rows
* column-gap
* row-gap
* gap

```css
.father{
    display: grid;
    grid-template-columns: 250px 250px 250px;
    grid-template-rows: 250px 250px;
    gap: 10px;10
}
```

