---
published: true
title: "golang - aes"
categories:
  - GoLang
tags:
  - [golang, aes, cbc, gcm]
toc: true
toc_sticky: true
date: "2022-11-14 12:00"
---

`golang`으로 개발하다 보면 상대적으로 정리된 자료가 많이 부족하다고 생각이 됩니다.

`cbc` 모드의 경우 `iv` 키 값을 고정적으로 구현하는 예시가 많아서 정리 및 `gcm`모드도 정리하였습니다

### 블록 암호화 모드

#### ECB

* 기본적인 타입
* 항상 값은 값이 나오기에 역추적이 쉽다.
* 보안에 취약

#### CBC

* ECB의 단점을 보완
* 암호화키에 IV(초기화 벡터) 값을 추가하여 역추적을 불가능하게 변경
* 중간자 공격 취약점
* A -> B로 변경 시 정말 A를 암호화했는지 검증할 수 없음

#### GCM

* CBC의 취약점을 보완
* 데이터 값의 HASH가 암호문에 들어가 검증이 가능

> 결론은 GCM을 사용하면 보안에 강하다.

### 공식문서

[golang 공식문서](https://go.dev/src/crypto/cipher/example_test.go)

암호화 관련하여서는 위와 같이 공식문서에서 구현과정을 기술하고 있습니다.

### 코드구현

#### CBC

```golang
package cipher

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strings"
)

type Aes struct {
	key string
}

func (crypto *Aes) Key() string {
	return crypto.key
}

func (crypto *Aes) SetKey(key string) error {
	if ck := len(key); ck != 32 {
		return aes.KeySizeError(ck)
	}
	crypto.key = key
	return nil
}

// https://go.dev/src/crypto/cipher/example_test.go 공식문서 참조
func (crypto *Aes) Encrypt(plainText string) (string, error) {
	if strings.TrimSpace(plainText) == "" {
		return plainText, nil
	}

	padded, err := crypto.padPKCS7([]byte(plainText), aes.BlockSize)
	if err != nil {
		return "", err
	}

	// CBC mode works on blocks so plaintexts may need to be padded to the
	// next whole block. For an example of such padding, see
	// https://tools.ietf.org/html/rfc5246#section-6.2.3.2. Here we'll
	// assume that the plaintext is already of the correct length.
	if len(padded)%aes.BlockSize != 0 {
		return plainText, fmt.Errorf("plaintext is not a multiple of the block size")
	}

	block, err := aes.NewCipher([]byte(crypto.key))
	if err != nil {
		return plainText, err
	}

	// The IV needs to be unique, but not secure. Therefore it's common to
	// include it at the beginning of the ciphertext.
	cipherText := make([]byte, len(padded)+aes.BlockSize)
	iv := cipherText[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return plainText, err
	}

	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(cipherText[aes.BlockSize:], []byte(padded))
	return base64.StdEncoding.EncodeToString(cipherText), nil
}

// https://go.dev/src/crypto/cipher/example_test.go 공식문서 참조
func (crypto *Aes) Decrypt(base64CipherText string) (string, error) {
	if strings.TrimSpace(base64CipherText) == "" {
		return base64CipherText, nil
	}

	block, err := aes.NewCipher([]byte(crypto.key))
	if err != nil {
		return base64CipherText, err
	}

	decodedCipherText, err := base64.StdEncoding.DecodeString(base64CipherText)
	if err != nil {
		return base64CipherText, err
	}

	// The IV needs to be unique, but not secure. Therefore it's common to
	// include it at the beginning of the ciphertext.
	if len(decodedCipherText) < aes.BlockSize {
		return base64CipherText, fmt.Errorf("decoded cipher text too short")
	}
	iv := decodedCipherText[:aes.BlockSize]
	lastCipherText := decodedCipherText[aes.BlockSize:]

	// CBC mode alway works in whole blocks.
	if len(lastCipherText)%aes.BlockSize != 0 {
		return "", fmt.Errorf("cipher text is not a multiple of the block size")
	}

	mode := cipher.NewCBCDecrypter(block, []byte(iv))
	mode.CryptBlocks([]byte(lastCipherText), []byte(lastCipherText))

	// CryptBlocks can work in-place if the two arguments are the same.
	lastCipherText, err = crypto.pkcs7strip(lastCipherText, aes.BlockSize)
	if err != nil {
		return "", err
	}

	return string(lastCipherText), nil
}

func (crypto *Aes) padPKCS7(data []byte, blockSize int) ([]byte, error) {
	if blockSize < 0 || blockSize > 256 {
		return nil, fmt.Errorf("pkcs7: Invalid block size %d", blockSize)
	} else {
		padLen := blockSize - len(data)%blockSize
		padding := bytes.Repeat([]byte{byte(padLen)}, padLen)
		return append(data, padding...), nil
	}
}

func (crypto *Aes) pkcs7strip(data []byte, blockSize int) ([]byte, error) {
	length := len(data)
	if length == 0 {
		return nil, errors.New("pkcs7: Data is empty")
	}
	if length%blockSize != 0 {
		return nil, errors.New("pkcs7: Data is not block-aligned")
	}
	padLen := int(data[length-1])
	ref := bytes.Repeat([]byte{byte(padLen)}, padLen)
	if padLen > blockSize || padLen == 0 || !bytes.HasSuffix(data, ref) {
		return nil, errors.New("pkcs7: Invalid padding")
	}
	return data[:length-padLen], nil
}

```

* 먼저 `plainText`가 작을 시 `padding`처리를 한다.
* `io.ReadFull(rand.Reader, iv);` 다음의 코드를 통해 IV값을 랜덤으로 발행한다.
* 암호화 후 `base64`로 인코딩 후 반환한다.

#### GCM

```go
package cipher

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"strings"
)

type Aes struct {
	key string
}

func (crypto *Aes) Key() string {
	return crypto.key
}

func (crypto *Aes) SetKey(key string) error {
	if ck := len(key); ck != 32 {
		return aes.KeySizeError(ck)
	}
	crypto.key = key
	return nil
}

// https://go.dev/src/crypto/cipher/example_test.go 공식문서 참조
func (crypto *Aes) Encrypt(plainText string) (string, error) {
	if strings.TrimSpace(plainText) == "" {
		return plainText, nil
	}

	block, err := aes.NewCipher([]byte(crypto.key))
	if err != nil {
		return plainText, err
	}

	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return plainText, err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return plainText, err
	}

	// first param is append nonce at cipher Text
	cipherText := aesgcm.Seal(nonce, nonce, []byte(plainText), nil)
	return base64.StdEncoding.EncodeToString(cipherText), nil
}

// https://go.dev/src/crypto/cipher/example_test.go 공식문서 참조
func (crypto *Aes) Decrypt(base64CipherText string) (string, error) {
	if strings.TrimSpace(base64CipherText) == "" {
		return base64CipherText, nil
	}

	block, err := aes.NewCipher([]byte(crypto.key))
	if err != nil {
		return base64CipherText, err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return base64CipherText, err
	}

	decodedCipherText, err := base64.StdEncoding.DecodeString(base64CipherText)
	if err != nil {
		return base64CipherText, err
	}

	var (
		nonceSize  = aesgcm.NonceSize()
		nonce      = decodedCipherText[:nonceSize]
		cipherText = decodedCipherText[nonceSize:]
	)
	plainText, err := aesgcm.Open(nil, nonce, cipherText, nil)
	if err != nil {
		return base64CipherText, err
	}

	return string(plainText), nil
}

```

* CBC와 마찬가지로 암호화를 진행한다.
* 따로 패딩작업은 필요하지 않다.
* `aesgcm.Seal(nonce, nonce, []byte(plainText), nil)`에 첫 번째 인자는 만들어진 암호문 앞에 `nonce`값을 붙인다.
* 따라서 복호화 시 앞에 `nonce`길이만큼 자른 후 복호화를 진행한다.
