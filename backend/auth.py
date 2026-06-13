from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from database import get_db
from models import Usuario

# ── CONFIGURAÇÕES ────────────────────────────────────────
SECRET_KEY = "wf-restaurant-chave-secreta-2024"
ALGORITHM  = "HS256"
EXPIRA_EM  = 60  # minutos

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


# ── SENHA (bcrypt direto, sem passlib) ───────────────────
def gerar_hash(senha: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(senha.encode("utf-8"), salt).decode("utf-8")

def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(
        senha_plana.encode("utf-8"),
        senha_hash.encode("utf-8")
    )


# ── TOKEN ────────────────────────────────────────────────
def criar_token(dados: dict) -> str:
    payload = dados.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRA_EM)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ── VALIDAR TOKEN ────────────────────────────────────────
def verificar_token(token: str = Depends(oauth2_scheme)) -> dict:
    erro = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado. Faça login novamente.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if not payload.get("sub"):
            raise erro
        return payload
    except JWTError:
        raise erro


# ── BUSCAR E AUTENTICAR USUÁRIO ──────────────────────────
def buscar_usuario(db: Session, email: str) -> Optional[Usuario]:
    return db.query(Usuario).filter(Usuario.email == email).first()

def autenticar_usuario(db: Session, email: str, senha: str) -> Optional[Usuario]:
    usuario = buscar_usuario(db, email)
    if not usuario:
        return None
    if not verificar_senha(senha, usuario.senha_hash):
        return None
    return usuario