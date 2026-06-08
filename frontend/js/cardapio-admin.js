let delId = null;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

// ── CARREGAR — aceita termo de busca opcional ────────────
function carregar(nome = "") {
    $("#tbody").html('<tr><td colspan="6" class="text-center text-muted py-4">Carregando...</td></tr>');

    // Monta a URL com ou sem o parâmetro de busca
    const url = nome
        ? `${API}/produtos?nome=${encodeURIComponent(nome)}`
        : `${API}/produtos`;

    $.get(url, function(lista) {
        if (!lista.length) {
            const msg = nome
                ? `Nenhum prato encontrado para "<strong>${nome}</strong>".`
                : "Nenhum prato cadastrado.";
            $("#tbody").html(`<tr><td colspan="6" class="text-center text-muted py-4">${msg}</td></tr>`);
            return;
        }

        let html = "";
        lista.forEach(p => {
            html += `
            <tr>
                <td style="color:#aaa">#${p.id}</td>
                <td><strong>${p.nome}</strong></td>
                <td>${p.descricao || "—"}</td>
                <td style="color:var(--vermelho); font-weight:600">${formatarPreco(p.preco)}</td>
                <td>${badgeDisponivel(p.disponivel)}</td>
                <td>
                    <a href="editar-prato.html?id=${p.id}" class="btn btn-outline-secondary btn-sm me-1">Editar</a>
                    <button class="btn btn-outline-danger btn-sm btn-excluir" data-id="${p.id}">Excluir</button>
                </td>
            </tr>`;
        });
        $("#tbody").html(html);
    }).fail(() => {
        $("#tbody").html('<tr><td colspan="6" class="text-center text-danger py-4">Erro ao carregar.</td></tr>');
    });
}

// ── BUSCA EM TEMPO REAL ──────────────────────────────────
let timer = null;
$("#input-busca").on("input", function() {
    clearTimeout(timer);
    const termo = $(this).val().trim();
    // Espera 400ms depois que parar de digitar para chamar a API
    timer = setTimeout(() => carregar(termo), 400);
});

// ── LIMPAR BUSCA ─────────────────────────────────────────
function limparBusca() {
    $("#input-busca").val("");
    carregar();
}

// ── DELETE ───────────────────────────────────────────────
$(document).on("click", ".btn-excluir", function() {
    delId = $(this).data("id");
    modal.show();
});

$("#btn-del").on("click", function() {
    $.ajax({
        url: `${API}/produtos/${delId}`,
        method: "DELETE",
        headers: authHeader(),
        success() {
            modal.hide();
            // Mantém o filtro ativo ao recarregar após excluir
            carregar($("#input-busca").val().trim());
        },
        error(xhr) {
            if (xhr.status === 401) { avisar("Sessão expirada."); sair("../"); }
            else { avisar("Erro ao excluir prato."); }
        }
    });
});

// ── INICIAR ──────────────────────────────────────────────
carregar();
