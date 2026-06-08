const API = "http://localhost:8000";

// ── FUNÇÕES GERAIS ───────────────────────────────────────
function avisar(msg) { alert(msg); }

function formatarPreco(valor) {
    return `R$ ${parseFloat(valor).toFixed(2)}`;
}

function badgeStatus(status) {
    const cores = {
        "Preparando": "warning",
        "Pronto":     "success",
        "Entregue":   "primary",
        "Cancelado":  "danger"
    };
    return `<span class="badge bg-${cores[status] || 'secondary'} text-dark">${status}</span>`;
}

function badgeDisponivel(disponivel) {
    return disponivel
        ? `<span class="badge bg-success">Sim</span>`
        : `<span class="badge bg-danger">Não</span>`;
}

function mascaraTelefone(seletor) {
    $(seletor).on("input", function () {
        let v = $(this).val().replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else if (v.length > 0) v = `(${v}`;
        $(this).val(v);
    });
}

function getIdDaUrl() {
    return new URLSearchParams(window.location.search).get("id");
}


function navAtivo(pagina) {

    $(`.nav-link[data-p="${pagina}"]`).addClass("active");
}

// ── AUTH ─────────────────────────────────────────────────

// Retorna o token salvo
function getToken() {
    return localStorage.getItem("token");
}

// Monta o header Authorization para requisições protegidas
function authHeader() {
    return { "Authorization": `Bearer ${getToken()}` };
}

// Redireciona para login se não estiver autenticado
function exigirLogin(base) {
    if (!getToken()) {
        window.location.href = base + "login.html";
    }
}

// Logout
function sair(base) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = base + "login.html";
}

// ── SIDEBAR ──────────────────────────────────────────────
function renderSidebar(base) {
    const usuario = localStorage.getItem("usuario") || "Usuário";

    return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span>🍽️ WF Restaurant</span>
        <small>Sistema de Gestão</small>
      </div>

      <div class="nav-group">
        <div class="nav-group-label">Cardápio</div>
        <a href="${base}index.html" class="nav-link" data-p="inicio">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
          Fazer Pedido
        </a>
        <a href="${base}pages/cardapio-admin.html" class="nav-link" data-p="cardapio-admin">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Gerenciar Cardápio
        </a>
        <a href="${base}pages/criar-prato.html" class="nav-link" data-p="criar-prato">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Novo Prato
        </a>
      </div>

      <div class="nav-group">
        <div class="nav-group-label">Pedidos</div>
        <a href="${base}pages/pedidos.html" class="nav-link" data-p="pedidos">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
          </svg>
          Ver Pedidos
        </a>
      </div>

      <!-- Usuário logado + botão sair (fixo na base da sidebar) -->
      <div style="margin-top:auto; padding:12px 10px; border-top:1px solid rgba(255,255,255,0.15);">
        <div style="font-size:12px; color:rgba(255,255,255,0.5); margin-bottom:2px;">Logado como</div>
        <div style="font-size:13px; color:white; font-weight:500; margin-bottom:10px;">${usuario}</div>
        <button
          onclick="sair('${base}')"
          class="btn btn-sm w-100"
          style="background:rgba(255,255,255,0.1); color:white; border:1px solid rgba(255,255,255,0.2); font-size:12px;"
        >
          Sair
        </button>
      </div>
    </aside>`;
}
