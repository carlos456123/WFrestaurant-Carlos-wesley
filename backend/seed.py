"""
Seed de emergência — popula o banco com usuário admin + cardápio completo.

Como rodar:
  - Localmente:            python seed.py
  - Em produção (Render):  abrir a aba "Shell" do seu Web Service e rodar:
        python seed.py

Pode ser rodado várias vezes sem problema: ele verifica o que já existe
antes de inserir, então nunca duplica dados.
"""

from database import SessionLocal, engine, Base
from models import Usuario, Produto
from auth import gerar_hash

Base.metadata.create_all(bind=engine)


CARDAPIO = [
    {
        "nome": "Camarão à Grega",
        "descricao": "Camarões com verduras ao molho de tomate da casa, arroz à grega, batata frita ou purê",
        "preco": 31.99,
        "disponivel": True,
        "imagem": "camarao_grega.jpg",
    },
    {
        "nome": "Camarão ao Catupiry",
        "descricao": "Camarões ao creme de catupiry, arroz branco, batata frita ou purê",
        "preco": 29.99,
        "disponivel": True,
        "imagem": "camarao_catupiry.jpg",
    },
    {
        "nome": "Camarão à Parmegiana",
        "descricao": "Camarões, spaguetti ao molho de tomate da casa, batata frita ou purê",
        "preco": 32.99,
        "disponivel": True,
        "imagem": "camarao_parmegiana.jpg",
    },
    {
        "nome": "Frango à Cubana",
        "descricao": "Filé de frango e banana à milanesa, arroz à grega, batata frita ou purê",
        "preco": 29.99,
        "disponivel": True,
        "imagem": "frango_cubana.jpg",
    },
    {
        "nome": "Frango à Delícia",
        "descricao": "Filé de frango à milanesa a base de purê de batatas, arroz branco, batata frita ou purê",
        "preco": 26.99,
        "disponivel": True,
        "imagem": "frango_delicia.jpg",
    },
    {
        "nome": "Filé ao Molho Madeira",
        "descricao": "Filé mignon ao molho madeira da casa, arroz à grega, batata frita ou purê",
        "preco": 32.99,
        "disponivel": True,
        "imagem": "file_madeira.jpg",
    },
    {
        "nome": "Filé à Parmegiana",
        "descricao": "Filé mignon, spaguetti ao molho de tomate da casa, batata frita ou purê",
        "preco": 28.99,
        "disponivel": True,
        "imagem": "file_parmegiana.jpg",
    },
    {
        "nome": "Frango à Parmegiana",
        "descricao": "Filé de frango, spaguetti ao molho de tomate da casa, batata frita ou purê",
        "preco": 27.99,
        "disponivel": True,
        "imagem": "frango_parmegiana.jpg",
    },
    {
        "nome": "Peixe ao Molho de Camarão",
        "descricao": "Filé de peixe com camarões e verduras ao molho de tomate da casa, arroz branco, batata frita ou purê",
        "preco": 49.99,
        "disponivel": True,
        "imagem": "peixe_camarao.jpg",
    },
    {
        "nome": "Peixe à Delícia",
        "descricao": "Filé de peixe ao molho branco da casa, arroz branco, batata frita ou purê",
        "preco": 44.99,
        "disponivel": True,
        "imagem": "peixe_delicia.jpg",
    },
    {
        "nome": "Filé ao Molho Quatro Queijos",
        "descricao": "Filé mignon ao molho quatro queijos da casa, arroz branco, batata frita ou purê",
        "preco": 34.99,
        "disponivel": True,
        "imagem": "file_quatro_queijos.jpg",
    },
    {
        "nome": "Frango ao Molho Branco",
        "descricao": "Filé de frango ao molho branco da casa, arroz à grega, batata frita ou purê",
        "preco": 28.99,
        "disponivel": True,
        "imagem": "frango_molho_branco.jpg",
    },
    {
        "nome": "Filé Acebolado",
        "descricao": "Filé mignon acebolado, arroz branco, feijão tropeiro e batata frita",
        "preco": 33.99,
        "disponivel": True,
        "imagem": "file_acebolado.jpg",
    },
    {
        "nome": "Peixe à Parmegiana",
        "descricao": "Filé de peixe empanado, spaguetti ao molho de tomate da casa, batata frita ou purê",
        "preco": 42.99,
        "disponivel": True,
        "imagem": "peixe_parmegiana.jpg",
    },
    {
        "nome": "Frango ao Molho de Champignon",
        "descricao": "Filé de frango ao molho de champignon, arroz à grega, batata frita ou purê",
        "preco": 30.99,
        "disponivel": True,
        "imagem": "frango_champignon.jpg",
    },
]


def seed():
    db = SessionLocal()

    # ── Usuário admin ────────────────────────────────────
    existente = db.query(Usuario).filter(Usuario.email == "admin@wf.com").first()
    if not existente:
        admin = Usuario(
            nome="Administrador",
            email="admin@wf.com",
            senha_hash=gerar_hash("admin123"),
            role="admin",
        )
        db.add(admin)
        print("✓ Usuário admin criado.")
    else:
        print("• Usuário admin já existe — pulei.")

    # ── Cardápio ─────────────────────────────────────────
    criados = 0
    for item in CARDAPIO:
        ja_existe = db.query(Produto).filter(Produto.nome == item["nome"]).first()
        if ja_existe:
            continue
        db.add(Produto(**item))
        criados += 1

    db.commit()
    db.close()

    print(f"✓ Seed concluído! {criados} prato(s) novo(s) adicionado(s) ao cardápio.")
    print("  Login admin -> Email: admin@wf.com | Senha: admin123")


if __name__ == "__main__":
    seed()