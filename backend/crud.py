from sqlalchemy.orm import Session
from models import Produto, Pedido
from schemas import (ProdutoCreate,ProdutoUpdate,PedidoCreate,PedidoUpdate)

def listar_produtos(db: Session):
    return db.query(Produto).all()

def buscar_produto(db: Session, produto_id: int):
    return db.query(Produto).filter(Produto.id == produto_id).first()

def criar_produto(db: Session, dados: ProdutoCreate):
    produto = Produto(**dados.model_dump())
    db.add(produto)
    db.commit()
    db.refresh(produto)
    return produto

def atualizar_produto(db: Session, produto_id: int, dados: ProdutoCreate):
    produto = buscar_produto(db, produto_id)
    if not produto:
        return None
    atualizacoes = dados.model_dump(exclude_unset=True)
    for campo, valor in atualizacoes.items():
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

# ==========================================================================================

def listar_pedidos(db: Session):
    return db.query(Pedido).all()

def buscar_pedido(db: Session, pedido_id: int):
    return db.query(Pedido).filter(Pedido.id == pedido_id).first()

def criar_pedido(db: Session, dados: PedidoCreate):
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