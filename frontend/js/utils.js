// ─── URL BASE DO BACKEND ────────────────────────────────
const API = "http://localhost:8000";

// ─── ALERTA SIMPLES ─────────────────────────────────────
function avisar(msg) {
    alert(msg);
}

// ─── FORMATAR PREÇO ─────────────────────────────────────
function formatarPreco(valor) {
    return `R$ ${parseFloat(valor).toFixed(2)}`;
}

// ─── BADGE DE STATUS DO PEDIDO ──────────────────────────
function badgeStatus(status) {
    const cores = {
        "Preparando": "warning",
        "Pronto":     "success",
        "Entregue":   "primary",
        "Cancelado":  "danger"
    };
    const cor = cores[status] || "secondary";
    return `<span class="badge bg-${cor}">${status}</span>`;
}

// ─── BADGE DISPONIBILIDADE ──────────────────────────────
function badgeDisponivel(disponivel) {
    return disponivel
        ? `<span class="badge bg-success">Sim</span>`
        : `<span class="badge bg-danger">Não</span>`;
}

// ─── MÁSCARA DE TELEFONE ────────────────────────────────
function mascaraTelefone(input) {
    $(input).on("input", function () {
        let v = $(this).val().replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);

        if (v.length > 6) {
            v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
        } else if (v.length > 2) {
            v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        } else if (v.length > 0) {
            v = `(${v}`;
        }

        $(this).val(v);
    });
}

// ─── PEGAR ID DA URL ────────────────────────────────────
function getIdDaUrl() {
    return new URLSearchParams(window.location.search).get("id");
}
