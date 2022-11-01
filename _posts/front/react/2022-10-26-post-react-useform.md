---
published: true
title: "react - useform"
categories:
  - React
tags:
  - [react, useform]
toc: true
toc_sticky: true
date: "2022-10-26 14:20"
---

### useForm()

`react`에서 `Form`을 구현하기 위해서는 사용자가 입력 한 값에 대한 `검증`이 필요합니다.

각각의 데이터들을 `검증`하기 위해서는 `Input`데이터에 대한 입력을 기억할 필요가 있습니다.

따라서 다음과 같이 구현하게 되는데요.

```react
...

const LoginForm = () => {
	const {form} = useSelector(({auth}) => ({
        form: auth.Form
    }));
    const onSubmit = (e) => {
        e.preventDefault();
        const {username, password} = form;
        // TODO validation
        dispatch(login({username, password}))
	}
    return (
        <AuthForm
            type='login'
            form={form}
            onSubmit={onSubmit}
        />
    )
}
```

각각의 상태들을 기억하면서 해당 값을 수정하여야 하기에 `검증` 과정들이 복잡해집니다.

위와 관련해서 `useForm()`을 사용하면 수월하게 작성할 수 있습니다.

#### 사용법

* `yarn`으로 사용할 패키지들을 설치하여 줍니다.

```bash
yarn add react-hook-form yup @hookform/resolvers
```

* `검증` 로직 정의

```react
const LoginForm = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('아이디가 입력되지 않았습니다')
      .email('아이디는 이메일형식입니다'),
    password: Yup.string()
      .required('패스워드가 입력되지 않았습니다')
      .min(6, '패스워드는 최소 6자리 이상입니다')
      .max(40, '패스워드는 최대 40자리 이하입니다'),
  });
}
```

* `useForm`정의

```react
const LoginForm = () => {
  ...
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginUserParams>({
    // validator 등록
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: LoginUserParams) => {
    dispatch(loginUser(data));
  };
}
```

* `params` 정의

```react
// src/fetures/auth/authAPI.ts
export interface LoginUserParams {
  email: string;
  password: string;
}
```

* `register` 등록

```react
const LoginForm = () => {
  ...
  return (
    <LoginFormBlock>
      <h3>로그인</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="아이디"
          {...register('email')}
        />
        {errors?.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        <StyledInput
          id="password"
          type="password"
          autoComplete="password"
          placeholder="비밀번호"
          {...register('password')}
        />
        {errors?.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
        <LoginButton color="blue">로그인</LoginButton>
      </form>
      <Footer>
        <Link to="/register">회원가입</Link>
      </Footer>
    </LoginFormBlock>
  );
}
```

#### 전체 소스

```react
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { LoginUserParams, loginUser } from '../../features/auth/authAPI';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from '../common/Button';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
    
  // validation 정의
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('아이디가 입력되지 않았습니다')
      .email('아이디는 이메일형식입니다'),
    password: Yup.string()
      .required('패스워드가 입력되지 않았습니다')
      .min(6, '패스워드는 최소 6자리 이상입니다')
      .max(40, '패스워드는 최대 40자리 이하입니다'),
  });
  const { auth, authError, user } = useAppSelector(({ auth, user }) => ({
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginUserParams>({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data: LoginUserParams) => {
    dispatch(loginUser(data));
  };

  return (
    <LoginFormBlock>
      <h3>로그인</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledInput
          id="email"
          type="email"
          autoComplete="email"
          placeholder="아이디"
          {...register('email')}
        />
        {errors?.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        <StyledInput
          id="password"
          type="password"
          autoComplete="password"
          placeholder="비밀번호"
          {...register('password')}
        />
        {errors?.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
        <LoginButton color="blue">로그인</LoginButton>
      </form>
      <Footer>
        <Link to="/register">회원가입</Link>
      </Footer>
    </LoginFormBlock>
  );
};

...styled

export default LoginForm;

```

위와 같은 방식으로 구성하게 되면 상태들을 바로 핸들링 할 수 있기에 따로 `redux`의 정의하지 않고 직접적으로 사용할 수 있습니다.