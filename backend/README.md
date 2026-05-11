# 🚀 MinaroForms API

API para gerenciamento de formulários e submissões, construída com .NET 8, PostgreSQL e Docker.

---

## 📦 Pré-requisitos

Antes de começar, instale:

* Docker Desktop (ou Docker Engine + Compose)
* .NET SDK 8 *(opcional, só se quiser rodar fora do Docker)*

---

## 📥 Clonar o projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd MinaroForms
```

---

## 🐳 Rodar com Docker (RECOMENDADO)

Subir tudo (API + banco):

```bash
docker compose up --build
```

---

## 🌐 Acessos

Depois que subir:

* API: http://localhost:8080
* Health check: http://localhost:8080/health
* Swagger: http://localhost:8080/swagger

---

## 🧪 Banco de dados

* Host: `localhost`
* Porta: `5455`
* Database: `appdb`
* User: `postgres`
* Password: `postgres`

---

### 🧪 Banco de dados: migrations

e rode o comando abaixo para criar a migration, dentro de src/src
```bash
dotnet ef migrations add <Nome da migration> --project MinaroForms.Infrastructure --startup-project MinaroForms.Api
```

e depois rode para aplicar a migration no banco
```bash
dotnet ef database update --project MinaroForms.Infrastructure --startup-project MinaroForms.Api
```

---

## 🔁 Desenvolvimento (Hot Reload)

O projeto já roda com:

```bash
dotnet watch run
```

Dentro do container, então:

* Qualquer alteração no código → recompila automático
* Não precisa rebuild manual

---

## 🧹 Resetar tudo

Apagar containers e volumes:

```bash
docker compose down -v
```

---

## ⚠️ Problemas comuns

### ❌ Porta 8080 não abre

Verifique:

```bash
docker compose ps
```

Deve aparecer:

```
0.0.0.0:8080->8080/tcp
```

---

### ❌ Erro de pacote EFCore.NamingConventions

Instale versão compatível:

```bash
dotnet add src/MinaroForms.Infrastructure package EFCore.NamingConventions --version 8.0.3
```

---

### ❌ Swagger não aparece

Verifique se existe no `Program.cs`:

```csharp
builder.Services.AddSwaggerGen();

app.UseSwagger();
app.UseSwaggerUI();
```

---

## 📁 Estrutura do projeto

```
src/
 ├── MinaroForms.Api            → endpoints / configuração
 ├── MinaroForms.Application    → regras de negócio
 ├── MinaroForms.Domain         → entidades
 └── MinaroForms.Infrastructure → banco / EF Core
```

---

## 🧠 Dicas

* Use `/health` para ver se a API está viva
* Use Swagger para explorar endpoints
* O banco sobe automaticamente via Docker
* `EnsureCreated()` cria o banco na primeira execução

---

## 🛑 Parar o projeto

```bash
Ctrl + C
```

ou

```bash
docker compose down
```
