# 🎮 IsTeen — Remaster de Clássicos

O IsTeen nasceu de uma ideia que tive durante uma aula de empreendedorismo na faculdade, onde nos foi proposto um **Shark Tank de jogos desenvolvidos no Construct 3**. Como solução, desenvolvi uma plataforma de **remaster de jogos já considerados ultrapassados**, enquanto amigos do grupo desenvolveram jogos na plataforma proposta, dando a eles uma nova vida em ambiente web.

O nome **IsTeen** carrega um duplo significado: além do trocadilho com a gigante da indústria de games **Steam**, o propósito da plataforma é manter sempre jovens aqueles jogos que já foram até mesmo esquecidos.

####
---
# 🛠️ Stack do Projeto

### Backend
- **Node.js** + **Fastify** — Servidor HTTP de alta performance
- **TypeScript** — Tipagem estática
- **Prisma** — ORM com migrations gerenciadas
- **PostgreSQL** — Banco de dados relacional (via Docker)
- **Zod** — Validação de schemas
- **JWT** + **@fastify/cookie** — Autenticação com access token e refresh token via cookie HttpOnly
- **@fastify/multipart** — Upload de imagens
- **Supabase** — Armazenamento de imagens (storage)
- **SMTP** - Envio de emails
- **Vitest** — Testes unitários e e2e

### Frontend
- **Next.js 16** + **React 19**
- **TypeScript**
- **TailwindCSS**
- **Axios** — consumo da API REST
- **Lucide React** — ícones
- **React Toastify** — notificações

---

# 🏗️ Arquitetura do Backend

A aplicação segue uma arquitetura em camadas, separando responsabilidades de forma clara:

```
src/
├── http/
│   ├── controllers/         # Camada HTTP: recebe a requisição, valida e devolve a resposta
│   │   ├── games/
│   │   └── users/
│   └── middlewares/         # Autenticação JWT e verificação de roles
├── use-cases/               # Regras de negócio; independentes do framework
│   ├── games/
│   └── users/
├── repositories/            # Abstrações de acesso a dados (interfaces + implementações)
│   ├── in-memory/           # Implementação para testes
│   └── prisma/              # Implementação com banco de dados
├── services/                # Serviços auxiliares (ex: upload para Supabase Storage)
├── lib/                     # Instâncias compartilhadas (Prisma Client, etc.)
└── env/                     # Validação e tipagem das variáveis de ambiente
```

O padrão **Factory** é utilizado para instanciar os Use Cases e injetar os repositórios corretos. O padrão **Repository** desacopla a lógica de negócio do mecanismo de persistência, o que também viabiliza os testes com repositórios in-memory.

---

## ⚙️ Rodando Localmente

### Clone o projeto

```bash
git clone https://github.com/LucasVizoto/IsTeen_v2.git
```

---

### 🔧 Configurando o Backend

Acesse a pasta do backend:

```bash
cd ./backend
```

#### 1. Suba o banco de dados com Docker

Requisito mínimo: ter o **Docker** instalado na máquina.

```bash
docker compose up -d
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do `/backend` seguindo os campos presentes em `.env.example`:

```env
NODE_ENV=
DATABASE_URL=
JWT_SECRET=
```

> Exemplo de `DATABASE_URL` usando as credenciais do Docker Compose:
> `postgresql://isteen:isteen@localhost:5436/isteen_postgres_db`

#### 4. Execute as migrations

```bash
npx prisma migrate dev
```

#### 5. Faça o build do projeto

```bash
npm run build
```

#### 6. Execute o servidor

```bash
npm run dev
```

O servidor será iniciado na porta **3333** por padrão.

---

### 🖥️ Configurando o Frontend

Abra um novo terminal e acesse a pasta do frontend:

```bash
cd ./frontend/isteen-frontend
```

#### 1. Instale as dependências

```bash
npm install
```

#### 2. Execute o projeto

```bash
npm run dev
```

> **Observação:** Por padrão, o frontend aponta para `http://localhost:3333`. Caso a porta do backend seja alterada no `.env`, atualize também o arquivo de configuração da API no frontend.

---

# 📖 Documentação da API

### 🔐 Autenticação

#### Registrar um novo usuário

```
POST /users
```

**Body:**
```json
{
  "name": "Lucas",
  "email": "lucas@email.com",
  "password": "123456"
}
```

---

#### Autenticar (Login)

```
POST /auth
```

**Body:**
```json
{
  "email": "lucas@email.com",
  "password": "123456"
}
```

**Resposta esperada:**
```json
{
  "token": "<access_token_jwt>"
}
```

> O `refreshToken` é retornado automaticamente via cookie `HttpOnly`.

---

#### Renovar o token de acesso

```
PATCH /token/refresh
```

> Utiliza o cookie `refreshToken` automaticamente.

---

#### Obter perfil do usuário autenticado

```
GET /me
```

> Requer header: `Authorization: Bearer <token>`

---

#### Listar usuários

```
GET /users/search
```

> Requer autenticação.

---

#### Promover usuário a administrador

```
PATCH /users/:userId/promote-admin
```

| Campo    | Tipo     | Descrição                        |
|----------|----------|----------------------------------|
| `userId` | `string` | **Obrigatório.** ID do usuário   |

> Requer autenticação.

---

### 🕹️ Jogos

> Todas as rotas de jogos requerem autenticação via `Authorization: Bearer <token>`.

---

#### Buscar jogos

```
GET /games/search
```

**Query Params:**

| Campo  | Tipo     | Descrição                                      |
|--------|----------|------------------------------------------------|
| `q`    | `string` | **Obrigatório.** Termo de busca                |
| `page` | `number` | Página dos resultados. Padrão: `1`             |

**Resposta esperada:**
```json
{
  "games": [
    {
      "id": "...",
      "game_name": "Pong Remastered",
      "game_description": "O clássico Pong em versão renovada.",
      "release_date": "2024-01-01T00:00:00.000Z",
      "url_game": "https://example.com/pong",
      "url_image_game": "https://example.com/pong.png",
      "developer": "IsTeen Studio"
    }
  ]
}
```

---

#### Buscar jogo por ID

```
GET /games/:gameId
```

| Campo    | Tipo     | Descrição                       |
|----------|----------|---------------------------------|
| `gameId` | `string` | **Obrigatório.** UUID do jogo   |

**Resposta esperada:**
```json
{
  "game": {
    "id": "...",
    "game_name": "Pong Remastered",
    "game_description": "O clássico Pong em versão renovada.",
    "release_date": "2024-01-01T00:00:00.000Z",
    "url_game": "https://example.com/pong",
    "url_image_game": "https://example.com/pong.png",
    "developer": "IsTeen Studio"
  }
}
```

---

#### Cadastrar novo jogo *(Admin)*

```
POST /games
```

> Requer que o usuário possua a role `ADMIN`.

**Body (multipart/form-data):**

| Campo               | Tipo     | Descrição                                                     |
|---------------------|----------|---------------------------------------------------------------|
| `game_name`         | `string` | **Obrigatório.** Nome do jogo                                 |
| `game_description`  | `string` | **Obrigatório.** Descrição do jogo                            |
| `release_date`      | `string` | **Obrigatório.** Data de lançamento (ISO 8601)                |
| `url_game`          | `string` | **Obrigatório.** URL do jogo (deve ser uma URL válida)        |
| `url_image_game`    | `string` | Opcional. URL da imagem de capa (ou feito via upload de arquivo) |
| `developer`         | `string` | **Obrigatório.** Nome do desenvolvedor/estúdio               |

**Resposta esperada:**
```json
{
  "game": {
    "id": "...",
    "game_name": "Space Invaders: Redux",
    "game_description": "A clássica invasão espacial, refeita do zero.",
    "release_date": "2024-06-15T00:00:00.000Z",
    "url_game": "https://example.com/space-invaders",
    "url_image_game": "https://storage.supabase.co/...",
    "developer": "IsTeen Studio"
  }
}
```

---

#### Deletar jogo *(Admin)*

```
DELETE /games/:gameId
```

| Campo    | Tipo     | Descrição                       |
|----------|----------|---------------------------------|
| `gameId` | `string` | **Obrigatório.** UUID do jogo   |

> Requer que o usuário possua a role `ADMIN`.

---

# ⚗️ Rodando os Testes

Os testes são configurados com **Vitest** e cobrem tanto testes unitários (usando repositórios in-memory) quanto testes e2e.

Estando na pasta `/backend`:

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Todos os testes em modo watch
npm run test:watch

# Interface visual dos testes
npm run test:ui

# Cobertura de código
npm run test:coverage
```

---
# 🔎 Onde me encontrar

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucasvizoto/)

[![e-mail](https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white)](mailto:lucavizoto364@gmail.com)
