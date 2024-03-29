---
published: true
title: "css - rem"
categories:
  - CSS
tags:
  - [css]
toc: true
toc_sticky: true
date: "2022-09-02 15:00"
---

### Pixel🤣

지금까지 디자인을 배우면서 항상 강의에서는 `px`단위를 사용하기에 당연히 저도 그렇게 사용했습니다. 하지만 반응형이 나오면서 저에게는 `em, rem`이란 단위가 보이기 시작하게 되었습니다. 오늘은 왜 `em`을 사용해야 되는지를 알아볼려고 합니다.

먼저 픽셀은 절댓값을 사용하는 단위이기에 고정된 크기입니다. 원하는 위치에 고정된 디자인을 나타낼 수 있는데요. `px`을 사용하면 문제가 되는 이유 중 하나는 `글꼴크기설정` 입니다.

브라우저에서 지원하는 `루트 글꼴 크기`를 조정하게 되면, 글꼴크기가 변화되는데 `px`로 고정시에는 설정을 무시합니다!

> px은 브라우저에 크기를 확대/축소는 문제 없으나, 글꼴 크기는 무시하게 됩니다. 하지만 rem은 유연하게 반응합니다.

정리하자면, `pixel`은 고정 `rem`은 상대적으로 바뀌는 단위입니다.

### 상대 단위

고정되지 않고 유동적으로 바뀔 수 있는 단위입니다. 우리는 이러한 것들을 `css`를 통해 많이 다뤄봤는데요.

```css
body {
    height: 100vh;
    width: 100%
}
```

위와 같이 상대 단위로 표기하는 단위입니다. 그와 반대로 고정된 길이를 나타내는 단위를 `절대단위`라고 합니다. `절대단위`에는 `px, cm, pt`등이 있을 수 있습니다.

### 계산법

브라우저의 기본 단위는 `1rem = 16px`입니다.

`font-size`가 `16px`일 경우 공식은 다음과 같습니다.

`px`: font-size * em

* 0.5em: 16 * 0.5 = 8px
* 1em: 16 * 1 = 16px
* 2em: 16 * 2 = 32px

### REM VS EM

em은 해당 단위가 사용되고 있는 요소의 `font-size`이며, `rem`은 최상위인 루트`<html> 입니다.

### 결론은 REM

`em`은 상대적으로 계산해야 되는 문제가 있기에 정확한 이해를 하지 않았다면 `rem`으로 권장한다고 합니다.

하지만 먼저 `px`을 사용하여 디자인이 완료된 후 고민해야 되는 문제라고 생각합니다.
