const API = "http://localhost:8000";

// Toast simples
function toast(msg, tipo = "ok") {
  const id = "t" + Date.now();
  const cor = tipo === "ok" ? "#22c55e" : "#ef4444";
  const html = `
    <div id="${id}" class="toast ${tipo} show align-items-center mb-2" role="alert">
      <div class="d-flex align-items-center gap-2 p-3">
        <span style="color:${cor}; font-size:16px;">${tipo === "ok" ? "✓" : "✕"}</span>
        <span>${msg}</span>
      </div>
    </div>`;
  if (!$("#toast-box").length) {
    $("body").append('<div id="toast-box" class="toast-container"></div>');
  }
  $("#toast-box").append(html);
  setTimeout(() => $(`#${id}`).remove(), 3000);
}

// Formatar moeda BRL
function brl(v) {
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Badge status pedido
function badgePedido(status) {
  const cores = {
    "Preparando": "warning",
    "Pronto":     "success",
    "Entregue":   "primary",
    "Cancelado":  "danger",
  };
  return `<span class="badge bg-${cores[status] || 'secondary'}">${status}</span>`;
}

// Badge disponibilidade
function badgeDisp(disponivel) {
  return disponivel
    ? `<span class="badge bg-success">Disponível</span>`
    : `<span class="badge bg-danger">Indisponível</span>`;
}

// Marcar nav ativo
function navAtivo(pagina) {
  $(`.sidebar a[data-p="${pagina}"]`).addClass("active");
}
