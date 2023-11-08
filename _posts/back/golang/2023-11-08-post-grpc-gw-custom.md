---
published: true
title: "golang - grpc-gateway custom body"
categories:
  - GoLang
tags:
  - [golang, jnit]
toc: true
toc_sticky: true
date: "2023-11-08 09:00"
---

`golang`을 사용하여 `grpc-gateway`를 사용하던 도중 `google`에서 정해 준 규격외로 `body`메시지를 구성하여 던져야 되는 경우가 있어 정리하였습니다.

## google grpc error body

```json
{
    code: 0,
    message: "rpc error:...",
    details: []
}
```

## Custom error body

**message**

```json
{
    result: false,
    code: 1654401,
    msg: "error message"
}
```

**main.go**

```go
	// register greeter
	gwmux := runtime.NewServeMux(
		runtime.WithErrorHandler(intercept.CustomHttpError),
	)
	if err = callpb.RegisterApiHandler(ctx, gwmux, conn); err != nil {
		return err
	}
```

interceptor.go

```go
func (inter *GrpcInterceptor) CustomHttpError(ctx context.Context, _ *runtime.ServeMux, marshaler runtime.Marshaler, w http.ResponseWriter, _ *http.Request, err error) {
	const fallback = `{"result": false, "msg": "failed to marshal error message", "code": 146000}`

	w.Header().Del("Trailer")
	w.Header().Del("Transfer-Encoding")
	w.Header().Set("Content-Type", "application/json")

	s, ok := status.FromError(err)
	if !ok {
		s = status.New(codes.Unknown, err.Error())
	}

	md, ok := runtime.ServerMetadataFromContext(ctx)
	if !ok {
		inter.log.Warn("failed to extract server metadata from context")
	}

	body, berr := types.GrpcErrorBody(md)
	if berr != nil {
		body = &types.GrpcBody{
			Code:    types.CodeServerInternal,
			Message: err.Error(),
			Result:  false,
		}
	}

	buf, merr := marshaler.Marshal(body)
	if merr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		if _, err := io.WriteString(w, fallback); err != nil {
			inter.log.Warn("failed to wirte response: %v", err)
		}
		return
	}

	st := runtime.HTTPStatusFromCode(s.Code())
	w.WriteHeader(st)
	if _, err := w.Write(buf); err != nil {
		inter.log.Warn("failed to write response buf: %v", err)
	}
}
```

utils.go

```go
func GrpcErrorBody(md runtime.ServerMetadata) (*GrpcBody, error) {
	for k, vs := range md.TrailerMD {
		if !strings.Contains(k, GrpcGateWayKey) {
			continue
		}
		body := new(GrpcBody)
		if err := json.Unmarshal([]byte(vs[0]), body); err != nil {
			return nil, err
		}
		return body, nil
	}

	return nil, errors.New("not found grpc error body")
}

func SetGrpcErrorBody(ctx context.Context, code int, message string) {
	body := GrpcBody{
		Result:  false,
		Code:    code,
		Message: message,
	}
	b, err := json.Marshal(body)
	if err != nil {
		ilog.Warn("failed to marshal body: %v", err)
		return
	}
	md := metadata.Pairs(GrpcGateWayKey, string(b))
	if err := grpc.SetTrailer(ctx, md); err != nil {
		ilog.Warn("set grpc error body failed: %v", err)
	}
}
```

**소스 설명**

먼저 `grpcgateway-mux`에 `interceptor`를 추가하여 줍니다. 그 후 `context`에 사용자가 지정한 데이터를 추가하여 `Trailer`에 보관합니다. `interceptor`에서 해당 `Trailer`가 지정된 경우에는 `body message`를 구성하여 전달합니다.

#### 마치며

처음에는 `interceptor`에서 `error`형을 받길래 `custom error`형을 정의하여 전달할려고 하였으나 `status.Error`로 형 변환이 되어서 받을 수가 없었습니다. `gateway`를 사용한다는 것은 `grpc`, `http`를 같이 사용하기 위해서였는데 메시지를 조정하는 방법을 몰라 한참 해맸네요.. 저의 경우 `interceptor`에 `DefaultHandler`를 재구성하여 만들어서 해결하였습니다! 혹시 같은 고민을 하는 분들께 도움이 되면 좋겠네요:)
