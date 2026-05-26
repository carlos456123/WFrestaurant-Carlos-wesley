from sqlalchemy import Boolean, Column, Integer, String, Float
from database import Base

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, default="")
    preco = Column(Float, nullable=False)
    disponivel = Column(Boolean, default=True)
    imagem = Column(String, default="")

class Pedido(Base):
    __tablename__ = "pedidos"

    id = Column(Integer, primary_key=True, index=True)
    nome_cliente = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    produto = Column(String, nullable=False)
    quantidade = Column(Integer, default=1)
    valor_total = Column(Float, nullable=False)
    status = Column(String, default="Preparando")