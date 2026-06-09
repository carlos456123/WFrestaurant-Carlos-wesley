# 🍽️ WF Restaurant

Sistema de gerenciamento de pedidos e cardápio para restaurante.

---

## 🛠️ Tecnologias usadas

**Backend**
- Python + FastAPI
- SQLAlchemy (ORM)
- SQLite (banco de dados)
- python-jose (JWT)
- bcrypt (hash de senha)

**Frontend**
- HTML + CSS
- Bootstrap 5
- jQuery

---

## 📁 Estrutura do projeto

```
projeto/
│
├── backend/
│   ├── main.py        ← Rotas da API
│   ├── models.py      ← Tabelas do banco (Usuario, Produto, Pedido)
│   ├── schemas.py     ← Validação e formato dos dados
│   ├── crud.py        ← Operações no banco (busca, paginação)
│   ├── auth.py        ← JWT e hash de senha
│   ├── database.py    ← Conexão com o SQLite
│   └── seed.py        ← Cria o usuário admin no banco
│
└── frontend/
    ├── index.html         ← Cardápio do cliente + fazer pedido
    ├── login.html         ← Tela de login
    ├── style.css          ← Estilos globais
    │
    ├── js/
    │   ├── utils.js           ← Funções compartilhadas (auth, sidebar, helpers)
    │   ├── cardapio.js        ← Lógica do cardápio do cliente
    │   ├── cardapio-admin.js  ← Lógica do gerenciamento + busca + paginação
    │   ├── pedidos.js         ← Lógica da listagem de pedidos + paginação
    │   ├── criar-prato.js     ← Lógica do formulário de criar prato
    │   ├── editar-prato.js    ← Lógica do formulário de editar prato
    │   └── editar-pedido.js   ← Lógica do formulário de editar pedido
    │
    └── pages/
        ├── pedidos.html          ← Listagem de pedidos
        ├── cardapio-admin.html   ← Gerenciar cardápio (admin)
        ├── criar-prato.html      ← Cadastrar novo prato
        ├── editar-prato.html     ← Editar prato existente
        └── editar-pedido.html    ← Editar pedido existente
```

---

## ▶️ Como rodar

### 1. Instalar dependências do backend

Abra o terminal na pasta `backend/` e execute:

```bash
pip install fastapi uvicorn sqlalchemy python-jose[cryptography] bcrypt==4.0.1
```

### 2. Criar o usuário admin

Ainda na pasta `backend/`, execute o seed **uma única vez**:

```bash
python seed.py
```

Isso cria o usuário administrador no banco. Credenciais:
- **Email:** `admin@wf.com`
- **Senha:** `admin123`

### 3. Iniciar o servidor

```bash
uvicorn main:app --reload
```

O servidor vai rodar em: `http://localhost:8000`

Para verificar as rotas disponíveis, acesse:
```
http://localhost:8000/docs
```

### 4. Abrir o frontend

Abra o arquivo `frontend/login.html` no navegador e faça login
com as credenciais acima.

> ⚠️ O backend precisa estar rodando antes de abrir o frontend.

---

## 🔁 Fluxo do sistema

1. Acesse `login.html` e faça login com `admin@wf.com` / `admin123`
2. No **Cardápio** (`index.html`) veja os pratos disponíveis
3. Clique em **Adicionar ao Pedido** e depois em **Finalizar Pedido**
4. Informe nome e telefone do cliente para confirmar
5. O pedido aparece em **Pedidos** com status `Preparando`
6. Em **Gerenciar Cardápio** é possível buscar, editar e excluir pratos
7. Em **Novo Prato** cadastre novos itens no cardápio
8. Clique em **Sair** na sidebar para encerrar a sessão

---

## 🔗 Rotas da API

### Autenticação

| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| POST | /login | Pública | Retorna token JWT |

### Produtos

| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| GET | /produtos | Pública | Lista produtos (com busca e paginação) |
| GET | /produtos/{id} | Pública | Busca produto por ID |
| POST | /produtos | 🔒 JWT | Cria produto |
| PUT | /produtos/{id} | 🔒 JWT | Atualiza produto |
| DELETE | /produtos/{id} | 🔒 JWT | Remove produto |

### Pedidos

| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| GET | /pedidos | Pública | Lista pedidos (com paginação) |
| GET | /pedidos/{id} | Pública | Busca pedido por ID |
| POST | /pedidos | 🔒 JWT | Cria pedido |
| PUT | /pedidos/{id} | 🔒 JWT | Atualiza pedido |
| DELETE | /pedidos/{id} | 🔒 JWT | Remove pedido |

---

## 🔍 Query Parameters disponíveis

```
GET /produtos?nome=frango          → busca por nome (parcial, sem case)
GET /produtos?page=1&limit=8       → paginação (8 por página)
GET /produtos?nome=frang&page=2    → busca + paginação juntas

GET /pedidos?page=1&limit=10       → paginação (10 por página)
```

---

## 🗄️ Banco de dados

O sistema usa SQLite com 3 tabelas relacionadas:

```
usuarios          produtos              pedidos
────────          ────────              ───────
id (PK)           id (PK)               id (PK)
nome              nome                  nome_cliente
email (unique)    descricao             telefone
senha_hash        preco                 produto_id (FK → produtos.id)
                  disponivel            quantidade
                  imagem                valor_total
                                        status
```

O campo `produto_id` na tabela `pedidos` é uma **chave estrangeira (FK)**
que garante que todo pedido está vinculado a um produto válido.