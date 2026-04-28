# Minaro Forms Backend

Backend inicial em .NET 8 usando Clean Architecture por use case.

## Camadas

- `MinaroForms.Domain`: entidades e regras centrais.
- `MinaroForms.Application`: contratos, DTOs e use cases.
- `MinaroForms.Infrastructure`: EF Core, Postgres, repositories e unit of work.
- `MinaroForms.Api`: endpoints HTTP finos.

## Rodando

```bash
cd backend
docker compose up --build
```

No scaffold inicial, a API usa `EnsureCreatedAsync` ao subir para criar as tabelas a partir do modelo EF. Quando o domínio estabilizar, o ideal é trocar isso por migrations versionadas.

API:

- `GET /health`
- `POST /api/forms`
- `GET /api/forms/{formId}`
- `POST /api/forms/{formId}/publish`
- `POST /api/forms/{formId}/submissions`

## Próximos passos naturais

- Criar migrations com EF Core.
- Adicionar autenticação e obter `ownerUserId` do usuário logado.
- Validar respostas obrigatórias e tipos de pergunta no use case de submissão.
