const API = "https://wfrestaurant-backend.onrender.com";

// ── FUNÇÕES GERAIS ───────────────────────────────────────

// ── TOASTS (Bootstrap) ────────────────────────────────────
// Container fixo no canto inferior direito, criado sob demanda.
function garantirToastContainer() {
    if (!$("#toast-container").length) {
        $("body").append(
            '<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090;"></div>'
        );
    }
}

// Substitui o antigo alert(). Uso: avisar("mensagem", "success"|"danger"|"warning"|"info")
function avisar(msg, tipo = "info") {
    garantirToastContainer();

    const cores = {
        success: "text-bg-success",
        danger:  "text-bg-danger",
        warning: "text-bg-warning",
        info:    "text-bg-info"
    };
    const classeCor = cores[tipo] || cores.info;
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const html = `
        <div id="${id}" class="toast align-items-center ${classeCor} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">${msg}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>`;

    $("#toast-container").append(html);

    const elEl = document.getElementById(id);
    const toast = new bootstrap.Toast(elEl, { delay: 4000 });
    toast.show();

    // Remove do DOM depois que sumir, pra não acumular elementos escondidos
    elEl.addEventListener("hidden.bs.toast", () => elEl.remove());
}

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
function getToken() {
    return localStorage.getItem("token");
}

function authHeader() {
    return { "Authorization": `Bearer ${getToken()}` };
}

function exigirLogin(base) {
    if (!getToken()) {
        window.location.href = base + "login.html";
    }
}

function sair(base) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = base + "login.html";
}

// ── IMAGENS — pasta img/ ──────────────────────────────────
// Recebe o nome do arquivo salvo no banco (ex: "frango.jpg")
// e devolve o caminho correto considerando a profundidade da página.
// base = "" para index.html (raiz) ou "../" para páginas dentro de pages/
function caminhoImagem(nomeArquivo, base) {
    if (!nomeArquivo) return null;
    return `${base}img/${nomeArquivo}`;
}

// Thumbnail pequena (tabelas)
function thumbPrato(nomeArquivo, nome, base) {
    const src = caminhoImagem(nomeArquivo, base);
    if (src) {
        return `<img
            src="${src}"
            alt="${nome}"
            class="thumb-prato"
            onerror="this.outerHTML='<div class=\\'thumb-placeholder\\'>🍽️</div>'"
        />`;
    }
    return `<div class="thumb-placeholder">🍽️</div>`;
}

// Imagem grande (card do cardápio do cliente)
function imagemPrato(nomeArquivo, nome, base) {
    const src = caminhoImagem(nomeArquivo, base);
    if (src) {
        return `<img
            src="${src}"
            alt="${nome}"
            class="imagem-prato"
            onerror="this.outerHTML='<div class=\\'imagem-prato d-flex align-items-center justify-content-center\\' style=\\'font-size:40px\\'>🍽️</div>'"
        />`;
    }
    return `<div class="imagem-prato d-flex align-items-center justify-content-center" style="font-size:40px">🍽️</div>`;
}

// ── SIDEBAR TOGGLE — funciona em qualquer tamanho de tela ─
function initSidebarToggle() {
    if (!$("#sidebar-overlay").length) {
        $("body").append('<div class="sidebar-overlay" id="sidebar-overlay"></div>');
    }

    // Estado salvo (lembra se o usuário fechou a sidebar)
    const fechada = localStorage.getItem("sidebarFechada") === "true";
    if (fechada && window.innerWidth > 768) {
        $("#sidebar").addClass("fechada");
        $(".main").addClass("expandido");
    }

    // Toggle ao clicar no hambúrguer
    $("#btn-hamburguer").on("click", function() {
        const isMobile = window.innerWidth <= 768;

        $("#sidebar").toggleClass("fechada");
        $(".main").toggleClass("expandido");

        const estaFechada = $("#sidebar").hasClass("fechada");

        // No mobile, usa overlay; no desktop, apenas desliza
        if (isMobile) {
            $("#sidebar-overlay").toggleClass("ativo", !estaFechada);
        } else {
            localStorage.setItem("sidebarFechada", estaFechada);
        }
    });

    // Fecha ao clicar no overlay (mobile)
    $("#sidebar-overlay").on("click", function() {
        $("#sidebar").addClass("fechada");
        $(this).removeClass("ativo");
    });

    // No mobile, sidebar sempre começa fechada (independente do localStorage)
    if (window.innerWidth <= 768) {
        $("#sidebar").addClass("fechada");
        $(".main").removeClass("expandido");
    }

    // Fecha ao clicar em um link (mobile)
    $(".sidebar .nav-link").on("click", function() {
        if (window.innerWidth <= 768) {
            $("#sidebar").addClass("fechada");
            $("#sidebar-overlay").removeClass("ativo");
        }
    });
}

// ── TOPBAR — injeta o botão hambúrguer ───────────────────
function initTopbar() {
    const topbar = $(".topbar");
    if (topbar.length && !$("#btn-hamburguer").length) {
        let titulo = topbar.children("div").first();

        // Fallback: se não achar nenhum <div> filho direto, usa o primeiro filho qualquer
        if (!titulo.length) {
            titulo = topbar.children().first();
        }

        const botaoHTML = `
            <button class="btn-hamburguer" id="btn-hamburguer" title="Abrir/Fechar menu">
                <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <line x1="3" y1="6"  x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>
        `;

        if (titulo.length) {
            titulo.wrap('<div class="topbar-left"></div>');
            titulo.before(botaoHTML);
        } else {
            // Último fallback: insere direto no início da topbar
            topbar.prepend(botaoHTML);
        }

        initSidebarToggle();
    }
}

// ── SIDEBAR ──────────────────────────────────────────────
function renderSidebar(base) {
    const usuario = localStorage.getItem("usuario") || "Usuário";

    return `
    <aside class="sidebar" id="sidebar">
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

      <!-- Usuário logado + Sair -->
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