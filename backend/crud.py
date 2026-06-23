import math
from typing import Optional
from sqlalchemy.orm import Session
from models import Produto, Pedido, Usuario
from schemas import ProdutoCreate, ProdutoUpdate, PedidoCreate, PedidoUpdate, UsuarioCreate
from auth import gerar_hash


# ── PRODUTO ──────────────────────────────────────────────

def listar_produtos(db: Session, nome: Optional[str] = None, page: int = 1, limit: int = 8):
    query = db.query(Produto)

    # Filtro de busca
    if nome:
        query = query.filter(Produto.nome.ilike(f"%{nome}%"))

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1

    # Paginação: offset pula os registros das páginas anteriores
    dados = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "data":  dados,
        "total": total,
        "page":  page,
        "limit": limit,
        "pages": pages
    }

def buscar_produto(db: Session, produto_id: int):
    return db.query(Produto).filter(Produto.id == produto_id).first()

def criar_produto(db: Session, dados: ProdutoCreate):
    produto = Produto(**dados.model_dump())
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

def atualizar_produto(db: Session, produto_id: int, dados: ProdutoUpdate):
    produto = buscar_produto(db, produto_id)
    if not produto:
        return None
    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(produto, campo, valor)
    db.commit()
    db.refresh(produto)
    return produto

def deletar_produto(db: Session, produto_id: int):
    produto = buscar_produto(db, produto_id)
    if produto:
        db.delete(produto)
        db.commit()
    return produto


# ── PEDIDO ───────────────────────────────────────────────

def listar_pedidos(db: Session, page: int = 1, limit: int = 10):
    query = db.query(Pedido)

    total = query.count()
    pages = math.ceil(total / limit) if total > 0 else 1

    dados = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "data":  dados,
        "total": total,
        "page":  page,
        "limit": limit,
        "pages": pages
    }

def buscar_pedido(db: Session, pedido_id: int):
    return db.query(Pedido).filter(Pedido.id == pedido_id).first()

def criar_pedido(db: Session, dados: PedidoCreate):
    produto = buscar_produto(db, dados.produto_id)
    if not produto:
        return None
    pedido = Pedido(**dados.model_dump())
    db.add(pedido)
    db.commit()
    db.refresh(pedido)
    return pedido

def atualizar_pedido(db: Session, pedido_id: int, dados: PedidoUpdate):
    pedido = buscar_pedido(db, pedido_id)
    if not pedido:
        return None

    atualizacoes = dados.model_dump(exclude_unset=True)

    if "produto_id" in atualizacoes:
        produto = buscar_produto(db, atualizacoes["produto_id"])
        if not produto:
            return "produto_nao_encontrado"

    for campo, valor in atualizacoes.items():
        setattr(pedido, campo, valor)
    db.commit()
    db.refresh(pedido)
    return pedido

def deletar_pedido(db: Session, pedido_id: int):
    pedido = buscar_pedido(db, pedido_id)
    if pedido:
        db.delete(pedido)
        db.commit()
    return pedido


# ── USUARIO ──────────────────────────────────────────────

def buscar_usuario_por_email(db: Session, email: str):
    return db.query(Usuario).filter(Usuario.email == email).first()

def criar_usuario(db: Session, dados: UsuarioCreate):
    # Verifica se email já existe
    existente = buscar_usuario_por_email(db, dados.email)
    if existente:
        return "email_duplicado"

    usuario = Usuario(
        nome       = dados.nome,
        email      = dados.email,
        senha_hash = gerar_hash(dados.senha),
        role       = "usuario"   # sempre cria como usuario comum
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario
