package token

import (
	"fmt"
	"log/slog"

	jwt "github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	jwt.RegisteredClaims
}

func Parse(token string) (*Claims, error) {
	pemString := `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuPBg5wNVJzSauOIVVcNF
c/jLoMnDhDvCwhpVGK1tIW1k5Ndl/KlCSYwVVySu2we9+r3M8n9gNGpUJ+N7LYSm
jjLrMwsncG0JjK0YY4LZD6gnw+BA5RN0d7FnPW4ufZcxrjc0/QDH35BUE42AF8OZ
86oaeLSZv/Jr4zc44PgFcOOFO06u2YPX7IFztEi5D6mMYhe3CL9b0c7iF4jYkNdX
c04RgHmFzNa+uN1Uq9bdMxXGEuRdqpH8wXHc6YJ1a+5sbYm6oNz/Qyl/Gzp/tynG
9Wkp1C+qDURsPNohjWbCEis3DlfDOD+CJfqVPY7LLfhACPMa87d1cPQhRYSdHArN
5wIDAQAB
-----END PUBLIC KEY-----`

	key, err := jwt.ParseRSAPublicKeyFromPEM([]byte(pemString))

	if err != nil {
		slog.Info("error parsing public key from pem", slog.Any("error", err))
		return &Claims{}, err
	}

	claims := &Claims{}

	_, err = jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return key, nil
	})

	if err != nil {
		slog.Warn("error parsing token", slog.Any("error", err))

		return &Claims{}, err
	}

	return claims, nil
}
