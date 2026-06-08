from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id         = Column(Integer, primary_key=True, index=True)
    nome       = Column(String, nullable=False)
    email      = Column(String, unique=True, nullable=False, index=True)
    senha_hash = Column(String, nullable=False)


class Produto(Base):
    __tablename__ = "produtos"

    id         = Column(Integer, primary_key=True, index=True)
    nome       = Column(String, nullable=False)
    descricao  = Column(String, default="")
    preco      = Column(Float, nullable=False)
    disponivel = Column(Boolean, default=True)
    imagem     = Column(String, default="")

    # Um produto pode ter vários pedidos
    pedidos = relationship("Pedido", back_populates="produto_rel")


class Pedido(Base):
    __tablename__ = "pedidos"

    id           = Column(Integer, primary_key=True, index=True)
    nome_cliente = Column(String, nullable=False)
    telefone     = Column(String, nullable=False)
    quantidade   = Column(Integer, default=1)
    valor_total  = Column(Float, nullable=False)
    status       = Column(String, default="Preparando")

    # Chave estrangeira apontando para produtos.id
    produto_id   = Column(Integer, ForeignKey("produtos.id"), nullable=False)

    # Relacionamento — carrega o objeto Produto completo
    produto_rel  = relationship("Produto", back_populates="pedidos")
