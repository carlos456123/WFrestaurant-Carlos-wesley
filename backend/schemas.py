from typing import Optional
from pydantic import BaseModel, ConfigDict


# ── AUTH ─────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    senha: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    nome:         str
    role:         str  # "admin" ou "usuario"


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
    produto_id:   int
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
    produto_rel:  ProdutoResponse
    model_config = ConfigDict(from_attributes=True)


# ── PAGINAÇÃO ─────────────────────────────────────────────

class ProdutoPaginado(BaseModel):
    data:  list[ProdutoResponse]
    total: int
    page:  int
    limit: int
    pages: int

class PedidoPaginado(BaseModel):
    data:  list[PedidoResponse]
    total: int
    page:  int
    limit: int
    pages: int


# ── USUARIO ──────────────────────────────────────────────

class UsuarioCreate(BaseModel):
    nome:  str
    email: str
    senha: str

class UsuarioResponse(BaseModel):
    id:    int
    nome:  str
    email: str
    role:  str
    model_config = ConfigDict(from_attributes=True)
