import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import BackgroundTasks

# ── CONFIGURAÇÕES — lidas do .env ────────────────────────
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM     = os.getenv("MAIL_FROM")
MAIL_SERVER   = "smtp.gmail.com"
MAIL_PORT     = 587


# ── FUNÇÃO INTERNA DE ENVIO ──────────────────────────────
def _enviar(destinatario: str, assunto: str, corpo_html: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = assunto
        msg["From"]    = f"WF Restaurant <{MAIL_FROM}>"
        msg["To"]      = destinatario

        msg.attach(MIMEText(corpo_html, "html"))

        with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as servidor:
            servidor.starttls()
            servidor.login(MAIL_USERNAME, MAIL_PASSWORD)
            servidor.sendmail(MAIL_FROM, destinatario, msg.as_string())

        print(f"✓ Email enviado para {destinatario}")
    except Exception as e:
        print(f"✕ Erro ao enviar email: {e}")


# ── EMAIL DE BOAS-VINDAS ─────────────────────────────────
def enviar_boas_vindas(background: BackgroundTasks, nome: str, email: str):
    assunto = "Bem-vindo ao WF Restaurant! 🍽️"

    corpo = f"""
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        body {{ font-family: Arial, sans-serif; background: #f8f7f4; margin: 0; padding: 0; }}
        .container {{ max-width: 520px; margin: 40px auto; background: white;
                      border-radius: 12px; overflow: hidden;
                      box-shadow: 0 2px 12px rgba(0,0,0,0.08); }}
        .header {{ background: #8b0000; padding: 32px 32px 24px; text-align: center; }}
        .header h1 {{ color: white; font-size: 24px; margin: 0; }}
        .header p  {{ color: rgba(255,255,255,0.8); font-size: 14px; margin: 6px 0 0; }}
        .body {{ padding: 32px; }}
        .body h2 {{ color: #1a1a1a; font-size: 20px; margin-bottom: 12px; }}
        .body p  {{ color: #555; font-size: 14px; line-height: 1.7; margin-bottom: 12px; }}
        .card {{ background: #f8f7f4; border-radius: 8px; padding: 16px 20px;
                 margin: 20px 0; border-left: 4px solid #8b0000; }}
        .card p {{ margin: 0; color: #333; font-size: 13px; }}
        .btn {{ display: inline-block; background: #8b0000; color: white;
                text-decoration: none; padding: 12px 28px; border-radius: 8px;
                font-size: 14px; font-weight: 600; margin-top: 8px; }}
        .footer {{ background: #f0ece6; padding: 20px 32px; text-align: center; }}
        .footer p {{ color: #aaa; font-size: 12px; margin: 0; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍽️ WF Restaurant</h1>
          <p>Sistema de Gestão de Restaurante</p>
        </div>

        <div class="body">
          <h2>Olá, {nome}! 👋</h2>
          <p>Seu cadastro foi realizado com sucesso no <strong>WF Restaurant</strong>.</p>
          <p>Agora você já pode acessar o sistema e começar a usar todas as funcionalidades disponíveis para o seu perfil.</p>

          <div class="card">
            <p>📧 <strong>Email cadastrado:</strong> {email}</p>
          </div>

          <p>Se você não realizou esse cadastro, ignore este email.</p>
        </div>

        <div class="footer">
          <p>WF Restaurant — Sistema de Gestão © 2024</p>
          <p>Este é um email automático, não responda.</p>
        </div>
      </div>
    </body>
    </html>
    """

    # Dispara em background — API responde sem esperar o email
    background.add_task(_enviar, email, assunto, corpo)