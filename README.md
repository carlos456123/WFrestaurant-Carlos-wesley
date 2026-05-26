# 🍽️ WF Restaurant

Sistema de gerenciamento de pedidos e cardápio para restaurante.

---

## 🛠️ Tecnologias usadas

**Backend**
- Python + FastAPI
- SQLAlchemy (ORM)
- SQLite (banco de dados)

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
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   └── database.py
│
└── frontend/
    ├── index.html       ← Cardápio + fazer pedido
    ├── index.js
    ├── style.css
    │
    ├── criar/
    │   ├── index.html   ← Cadastrar novo prato
    │   └── criar.js
    │
    ├── editar/
    │   ├── index.html   ← Editar pedido
    │   └── editar.js
    │
    └── pedidos/
        ├── index.html   ← Listar pedidos
        └── pedidos.js
```

---

## ▶️ Como rodar

### 1. Instalar dependências do backend

Abra o terminal na pasta `backend/` e execute:

```bash
pip install fastapi uvicorn sqlalchemy
```

### 2. Iniciar o servidor

Ainda na pasta `backend/`, execute:

```bash
uvicorn main:app --reload
```

O servidor vai rodar em: `http://localhost:8000`

Para confirmar que está funcionando, acesse no navegador:
```
http://localhost:8000/docs
```
Essa página mostra todas as rotas disponíveis.

### 3. Abrir o frontend

Abra o arquivo `frontend/index.html` direto no navegador.

> ⚠️ O backend precisa estar rodando antes de abrir o frontend, senão os dados não carregam.

---

## 🔁 Fluxo do sistema

1. Acesse o **Cardápio** (`index.html`) para ver os pratos disponíveis
2. Clique em **Adicionar ao Pedido** nos pratos desejados
3. Clique em **Finalizar Pedido**, informe nome e telefone, e confirme
4. O pedido aparece em **Pedidos** com status `Preparando`
5. Em **Pedidos** é possível editar o status ou excluir o pedido
6. Em **Novo Prato** é possível cadastrar novos itens no cardápio

---

## 🔗 Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /produtos | Lista todos os produtos |
| POST | /produtos | Cria um produto |
| PUT | /produtos/{id} | Atualiza um produto |
| DELETE | /produtos/{id} | Remove um produto |
| GET | /pedidos | Lista todos os pedidos |
| POST | /pedidos | Cria um pedido |
| PUT | /pedidos/{id} | Atualiza um pedido |
| DELETE | /pedidos/{id} | Remove um pedido |
