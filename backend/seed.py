"""
Rode esse arquivo UMA VEZ para criar o usuário admin no banco:
    python seed.py
"""

from database import SessionLocal, engine, Base
from models import Usuario
from auth import gerar_hash

Base.metadata.create_all(bind=engine)

def criar_admin():
    db = SessionLocal()

    existente = db.query(Usuario).filter(Usuario.email == "admin@wf.com").first()
    if existente:
        print("Usuário admin já existe.")
        db.close()
        return

    admin = Usuario(
        nome       = "Administrador",
        email      = "admin@wf.com",
        senha_hash = gerar_hash("admin123"),
        role       = "admin"
    )

    db.add(admin)
    db.commit()
    print("✓ Usuário admin criado com sucesso!")
    print("  Email: admin@wf.com")
    print("  Senha: admin123")
    print("  Role:  admin")
    db.close()

if __name__ == "__main__":
    criar_admin()
