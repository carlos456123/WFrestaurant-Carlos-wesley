let delId = null;
let paginaAtual = 1;
const LIMIT = 10;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

// ── CARREGAR PEDIDOS COM PAGINAÇÃO ───────────────────────
function carregar(page = 1) {
    paginaAtual = page;
    $("#tbody").html('<tr><td colspan="8" class="text-center text-muted py-4">Carregando...</td></tr>');

    $.get(`${API}/pedidos?page=${page}&limit=${LIMIT}`, function(res) {
        if (!res.data.length) {
            $("#tbody").html('<tr><td colspan="8" class="text-center text-muted py-4">Nenhum pedido registrado.</td></tr>');
            renderPaginacao(res);
            return;
        }

        let html = "";
        res.data.forEach(p => {
            const nomeProduto = p.produto_rel ? p.produto_rel.nome : "—";
            html += `
            <tr>
                <td style="color:#aaa">#${p.id}</td>
                <td><strong>${p.nome_cliente}</strong></td>
                <td>${p.telefone}</td>
                <td>${nomeProduto}</td>
                <td>${p.quantidade}</td>
                <td style="color:var(--vermelho); font-weight:600">${formatarPreco(p.valor_total)}</td>
                <td>${badgeStatus(p.status)}</td>
                <td>
                    <a href="editar-pedido.html?id=${p.id}" class="btn btn-outline-secondary btn-sm me-1">Editar</a>
                    <button class="btn btn-outline-danger btn-sm btn-excluir" data-id="${p.id}">Excluir</button>
                </td>
            </tr>`;
        });
        $("#tbody").html(html);
        renderPaginacao(res);
    }).fail(() => {
        $("#tbody").html('<tr><td colspan="8" class="text-center text-danger py-4">Erro ao carregar pedidos.</td></tr>');
    });
}

// ── RENDERIZA OS BOTÕES DE PAGINAÇÃO ────────────────────
function renderPaginacao(res) {
    const { page, pages, total } = res;

    $("#paginacao").html(`
    <div class="d-flex align-items-center justify-content-between mt-3 px-1">
        <small class="text-muted">${total} pedido(s) no total</small>
        <div class="d-flex align-items-center gap-2">
            <button
                class="btn btn-outline-secondary btn-sm"
                onclick="carregar(${page - 1})"
                ${page <= 1 ? "disabled" : ""}
            >← Anterior</button>

            <span style="font-size:13px; color:#666">Página ${page} de ${pages}</span>

            <button
                class="btn btn-outline-secondary btn-sm"
                onclick="carregar(${page + 1})"
                ${page >= pages ? "disabled" : ""}
            >Próximo →</button>
        </div>
    </div>`);
}

// ── DELETE ───────────────────────────────────────────────
$(document).on("click", ".btn-excluir", function() {
    delId = $(this).data("id");
    modal.show();
});

$("#btn-del").on("click", function() {
    $.ajax({
        url: `${API}/pedidos/${delId}`,
        method: "DELETE",
        headers: authHeader(),
        success() { modal.hide(); carregar(paginaAtual); },
        error(xhr) {
            if (xhr.status === 401) { avisar("Sessão expirada."); sair("../"); }
            else { avisar("Erro ao excluir pedido."); }
        }
    });
});

carregar();
