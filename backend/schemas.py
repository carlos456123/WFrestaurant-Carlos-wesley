from typing import Optional
from pydantic import BaseModel, ConfigDict

class ProdutoCreate(BaseModel):
    nome: str
    descricao: str
    preco: float
    disponivel: bool = True
    imagem: str = ""

class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[float] = None
    disponivel: Optional[bool] = None
    imagem: Optional[str] = None

class ProdutoResponse(BaseModel):
    id: int
    nome: str
    descricao: str
    preco: float
    disponivel: bool
    imagem: str
    model_config = ConfigDict(from_attributes=True)

 # ===========================================================

class PedidoCreate(BaseModel):
    nome_cliente: str
    telefone: str
    produto: str
    quantidade: int
    valor_total: float
    status: str = "Preparando"

class PedidoUpdate(BaseModel):
    nome_cliente: Optional[str] = None
    telefone: Optional[str] = None
    produto: Optional[str] = None
    quantidade: Optional[int] = None
    valor_total: Optional[float] = None
    status: Optional[str] = None

class PedidoResponse(BaseModel):
    id: int
    nome_cliente: str
    telefone: str
    produto: str
    quantidade: int
    valor_total: float
    status: str
    model_config = ConfigDict(from_attributes=True) 
