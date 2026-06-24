# 🍽️ WF Restaurant

Sistema de gestão de restaurante desenvolvido com FastAPI e JavaScript puro.

🔗 **[Acessar o sistema](https://carlos456123.github.io/WFrestaurant-Carlos-wesley/)**

---

## 🌐 URLs em produção

| Serviço | URL |
|---------|-----|
| Frontend | https://carlos456123.github.io/WFrestaurant-Carlos-wesley/ |
| Backend | https://wfrestaurant-backend.onrender.com |
| Documentação API | https://wfrestaurant-backend.onrender.com/docs |

> ⚠️ O backend usa o plano gratuito do Render. A primeira requisição após inatividade pode demorar ~30 segundos (cold start). Isso é normal.

---

## 🛠️ Tecnologias

**Backend**
- Python 3.13 + FastAPI
- SQLAlchemy + SQLite
- JWT (python-jose)
- bcrypt (hash de senha)
- python-dotenv

**Frontend**
- HTML + CSS + Bootstrap 5
- jQuery

---

## 📁 Estrutura

```
projeto-web/
├── backend/
│   ├── main.py          ← Rotas da API
│   ├── models.py        ← Tabelas do banco
│   ├── schemas.py       ← Validação dos dados
│   ├── crud.py          ← Operações no banco
│   ├── auth.py          ← JWT e hash de senha
│   ├── email_service.py ← Envio de email
│   ├── database.py      ← Conexão com SQLite
│   ├── seed.py          ← Cria usuário admin
│   └── requirements.txt
│
└── frontend/
    ├── login.html
    ├── cadastro.html
    ├── index.html       ← Cardápio do cliente
    ├── style.css
    ├── js/
    │   ├── utils.js
    │   ├── cardapio.js
    │   ├── cardapio-admin.js
    │   ├── pedidos.js
    │   ├── criar-prato.js
    │   ├── editar-prato.js
    │   └── editar-pedido.js
    └── pages/
        ├── pedidos.html
        ├── cardapio-admin.html
        ├── criar-prato.html
        ├── editar-prato.html
        └── editar-pedido.html
```

---

## ▶️ Como rodar localmente

### 1. Instalar dependências

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configurar variáveis de ambiente

Cria o arquivo `backend/.env`:

```
MAIL_USERNAME=seuemail@gmail.com
MAIL_PASSWORD=sua_senha_de_app
MAIL_FROM=seuemail@gmail.com
```

### 3. Criar o usuário admin

```bash
cd backend
python seed.py
```

### 4. Iniciar o servidor

```bash
uvicorn main:app --reload
```

### 5. Abrir o frontend

Abre `frontend/login.html` no navegador.

---

## 🔑 Credenciais de teste

| Campo | Valor |
|-------|-------|
| Email | admin@wf.com |
| Senha | xxxxxx |
| Role  | admin |

---

## 🔗 Rotas da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /login | Retorna token JWT |
| POST | /usuarios | Cadastro de novo usuário |

### Produtos
| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| GET | /produtos | Pública | Lista com busca e paginação |
| GET | /produtos/{id} | Pública | Busca por ID |
| POST | /produtos | 🔒 JWT | Cria produto |
| PUT | /produtos/{id} | 🔒 JWT | Atualiza produto |
| DELETE | /produtos/{id} | 🔒 JWT | Remove produto |

### Pedidos
| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| GET | /pedidos | Pública | Lista com paginação |
| GET | /pedidos/{id} | Pública | Busca por ID |
| POST | /pedidos | 🔒 JWT | Cria pedido |
| PUT | /pedidos/{id} | 🔒 JWT | Atualiza pedido |
| DELETE | /pedidos/{id} | 🔒 JWT | Remove pedido |

### Query Parameters
```
GET /produtos?nome=frango        → busca por nome
GET /produtos?page=1&limit=8     → paginação
GET /pedidos?page=1&limit=10     → paginação
```

---

## 🗄️ Banco de dados

```
usuarios          produtos              pedidos
────────          ────────              ───────
id (PK)           id (PK)               id (PK)
nome              nome                  nome_cliente
email (unique)    descricao             telefone
senha_hash        preco                 produto_id (FK)
role              disponivel            quantidade
                  imagem                valor_total
                                        status
```