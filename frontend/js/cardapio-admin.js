let delId  = null;
let paginaAtual = 1;
const LIMIT = 8;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

// ── CARREGAR — busca + paginação juntas ──────────────────
function carregar(page = 1) {
    paginaAtual = page;
    const nome  = $("#input-busca").val().trim();

    $("#tbody").html('<tr><td colspan="6" class="text-center text-muted py-4">Carregando...</td></tr>');

    let url = `${API}/produtos?page=${page}&limit=${LIMIT}`;
    if (nome) url += `&nome=${encodeURIComponent(nome)}`;

    $.get(url, function(res) {
        // res = { data, total, page, limit, pages }
        if (!res.data.length) {
            const msg = nome
                ? `Nenhum prato encontrado para "<strong>${nome}</strong>".`
                : "Nenhum prato cadastrado.";
            $("#tbody").html(`<tr><td colspan="6" class="text-center text-muted py-4">${msg}</td></tr>`);
            renderPaginacao(res);
            return;
        }

        let html = "";
        res.data.forEach(p => {
            html += `
            <tr>
                <td style="color:#aaa">#${p.id}</td>
                <td>${thumbPrato(p.imagem, p.nome, "../")}</td>
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
        renderPaginacao(res);
    }).fail(() => {
        $("#tbody").html('<tr><td colspan="6" class="text-center text-danger py-4">Erro ao carregar.</td></tr>');
    });
}

// ── RENDERIZA OS BOTÕES DE PAGINAÇÃO ────────────────────
function renderPaginacao(res) {
    const { page, pages, total } = res;

    let html = `
    <div class="d-flex align-items-center justify-content-between mt-3 px-1">
        <small class="text-muted">${total} prato(s) encontrado(s)</small>
        <div class="d-flex align-items-center gap-2">
            <button
                class="btn btn-outline-danger btn-sm"
                onclick="carregar(${page - 1})"
                ${page <= 1 ? "disabled" : ""}
            >← Anterior</button>

            <span style="font-size:13px; color:#666">Página ${page} de ${pages}</span>

            <button
                class="btn btn-outline-danger btn-sm"
                onclick="carregar(${page + 1})"
                ${page >= pages ? "disabled" : ""}
            >Próximo →</button>
        </div>
    </div>`;

    $("#paginacao").html(html);
}

// ── BUSCA COM DEBOUNCE ───────────────────────────────────
let timer = null;
$("#input-busca").on("input", function() {
    clearTimeout(timer);
    timer = setTimeout(() => carregar(1), 400); // volta pra página 1 ao buscar
});

function limparBusca() {
    $("#input-busca").val("");
    carregar(1);
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
            carregar(paginaAtual);
        },
        error(xhr) {
            if (xhr.status === 401) { avisar("Sessão expirada."); sair("../"); }
            else { avisar("Erro ao excluir prato."); }
        }
    });
});

carregar();
