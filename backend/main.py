from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
from database import Base, engine, get_db
from schemas import (ProdutoCreate, ProdutoUpdate, ProdutoResponse, PedidoCreate, PedidoUpdate, PedidoResponse)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="WF Restaurant , vesion=0.0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/produtos", response_model=list[ProdutoResponse])
def listar_produtos(db: Session = Depends(get_db)):
    return crud.listar_produtos(db)

@app.get("/produtos/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(
    produto_id: int,
    db: Session = Depends(get_db)):
    produto = crud.buscar_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404,
        detail="Produto nao encontrado")
    return produto

@app.post("/produtos", response_model=ProdutoResponse, status_code=201)
def criar_produto(
    dados: ProdutoCreate,
    db: Session = Depends(get_db)):
    return crud.criar_produto(db, dados)

@app.put("/produtos/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: int,
    dados: ProdutoCreate,
    db: Session = Depends(get_db)): 
    produto = crud.atualizar_produto(db, produto_id, dados)
    if not produto:
        raise HTTPException(status_code=404,detail="Produto nao encontrado")
    return produto  

@app.delete("/produtos/{produto_id}", status_code=204)
def deletar_produto(
    produto_id: int,
    db: Session = Depends(get_db)):
    produto = crud.deletar_produto(db, produto_id)
    if not produto:
        raise HTTPException(status_code=404,detail="Produto nao encontrado")

# =======================================================================================

@app.get("/pedidos", response_model=list[PedidoResponse])
def listar_pedidos(db: Session = Depends(get_db)):
    return crud.listar_pedidos(db)

@app.get("/pedidos/{pedido_id}", response_model=PedidoResponse)
def buscar_pedido(
    pedido_id: int,
    db: Session = Depends(get_db)):
    pedido = crud.buscar_pedido(db, pedido_id)
    if not pedido:
        raise HTTPException(
            status_code=404,
            detail="Pedido nao encontrado")
    return pedido

@app.post("/pedidos", response_model=PedidoResponse, status_code=201)
def criar_pedido(
    dados: PedidoCreate,
    db: Session = Depends(get_db)):
    return crud.criar_pedido(db, dados)

@app.put("/pedidos/{pedido_id}", response_model=PedidoResponse)
def atualizar_pedido(
    pedido_id: int,
    dados: PedidoUpdate,
    db: Session = Depends(get_db)):
    pedido = crud.atualizar_pedido(db, pedido_id, dados)
    if not pedido:
        raise HTTPException(
            status_code=404,
            detail="Pedido nao encontrado")
    return pedido

@app.delete("/pedidos/{pedido_id}", status_code=204)
def deletar_pedido(
    pedido_id: int,
    db: Session = Depends(get_db)):
    pedido = crud.deletar_pedido(db, pedido_id)
    if not pedido:
        raise HTTPException(
            status_code=404,
            detail="Pedido nao encontrado")