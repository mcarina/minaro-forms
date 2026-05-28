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

## 🧪 Estrutura das Tabelas no banco

<img width="608" height="561" alt="minaro-forms drawio" src="https://github.com/user-attachments/assets/ac63e0b3-8778-4339-9ffd-fff757652d26" />

```
users/
 ── id        → identificador único. È um uuid 
 ── nome      → nome do usuario
 ── email     → email do usuario, único
 ── password  → senha criptografada
 ── role      → papel do usuário no sistema, sua permissão, padrão "User admin"
```
```
forms/
 ── id             → identificador único. È um uuid
 ── owner_user_id  → id do usuario, dono/criador do formulário
 ── title          → título do formulário
 ── description    → descrição opcional do formulário
 ── is_publisehd   → indica se o formulário está publicado ou não
```
```
questions/
 ── id            → identificador único. È um uuid
 ── form_id       → id do formulário, indica á qual formulario pertence
 ── type          → tipo de pergunta, ex: multipla escolha etc. (questionType)
 ── title         → titulo principal da pergunta
 ── description   → descrição ou ajuda opcional da pergunta
 ── is_required   → indica se a pergunta é obrigatória
 ── position      → ordem da pergunta dentro do formulário
 ── settings_json → configurações extras da pergunta em json, ùtil para regras específicas por tipo de pergunta
```
```
questions_options/
 ── id          → identificador único. È um uuid
 ── question_id → id do pergunta/question, dona dessa opção
 ── label       → texto exibido para o usuário
 ── value       → Valor interno salvo quando essa opção é escolhida.
 ── position    → ordem da opção dentro da pergunta
```
---

## 🧠 Dicas

* Use `/health` para ver se a API está viva
* Use Swagger para explorar endpoints
* O banco sobe automaticamente via Docker

---

## 🛑 Parar o projeto

```bash
Ctrl + C
```

ou

```bash
docker compose down
```
