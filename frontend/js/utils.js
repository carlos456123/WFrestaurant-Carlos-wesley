const API = "http://localhost:8000";

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

// Marca o link ativo na sidebar
function navAtivo(pagina) {
    $(`.nav-link[data-p="${pagina}"]`).addClass("active");
}

// Sidebar HTML compartilhada — recebe o prefixo do caminho ('' ou '../')
function renderSidebar(base) {
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
    </aside>`;
}
