from typing import Optional
from pydantic import BaseModel, ConfigDict


# ── PRODUTO ──────────────────────────────────────────────

class ProdutoCreate(BaseModel):
    nome:       str
    descricao:  str  = ""
    preco:      float
    disponivel: bool  = True
    imagem:     str   = ""

class ProdutoUpdate(BaseModel):
    nome:       Optional[str]   = None
    descricao:  Optional[str]   = None
    preco:      Optional[float] = None
    disponivel: Optional[bool]  = None
    imagem:     Optional[str]   = None

class ProdutoResponse(BaseModel):
    id:         int
    nome:       str
    descricao:  str
    preco:      float
    disponivel: bool
    imagem:     str
    model_config = ConfigDict(from_attributes=True)


# ── PEDIDO ───────────────────────────────────────────────

class PedidoCreate(BaseModel):
    nome_cliente: str
    telefone:     str
    produto_id:   int       # FK — recebe o ID do produto
    quantidade:   int
    valor_total:  float
    status:       str = "Preparando"

class PedidoUpdate(BaseModel):
    nome_cliente: Optional[str]   = None
    telefone:     Optional[str]   = None
    produto_id:   Optional[int]   = None
    quantidade:   Optional[int]   = None
    valor_total:  Optional[float] = None
    status:       Optional[str]   = None

class PedidoResponse(BaseModel):
    id:           int
    nome_cliente: str
    telefone:     str
    quantidade:   int
    valor_total:  float
    status:       str
    produto_id:   int
    produto_rel:  ProdutoResponse   # objeto do produto embutido na resposta
    model_config = ConfigDict(from_attributes=True)
