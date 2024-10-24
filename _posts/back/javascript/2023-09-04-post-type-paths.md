---
published: true
title: "typescript paths + eslint"
categories:
  - Javascript
tags:
  - [Javascript, jest]
toc: true
toc_sticky: true
date: "2023-09-04 10:00"
---

#### require

- eslit-import-resolver-typescript

```bash
$ yarn add -D eslint-import-resolver-typescript
```

**tsconfig.json**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**eslint.json**

```json
{
  "import/parsers": {
    "@typescript-eslint/parser": [".ts", ".tsx"]
  },
  "import/resolver": {
    "typescript": {}
  }
}
```
