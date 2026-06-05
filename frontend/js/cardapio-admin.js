let delId = null;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

function carregar() {
    $("#tbody").html('<tr><td colspan="6" class="text-center text-muted py-4">Carregando...</td></tr>');

    $.get(`${API}/produtos`, function(lista) {
        if (!lista.length) {
            $("#tbody").html('<tr><td colspan="6" class="text-center text-muted py-4">Nenhum prato cadastrado.</td></tr>');
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
                    <a href="editar-prato.html?id=${p.id}"
                       class="btn btn-outline-secondary btn-sm me-1">Editar</a>
                    <button class="btn btn-outline-danger btn-sm btn-excluir"
                            data-id="${p.id}">Excluir</button>
                </td>
            </tr>`;
        });

        $("#tbody").html(html);
    }).fail(() => {
        $("#tbody").html('<tr><td colspan="6" class="text-center text-danger py-4">Erro ao carregar.</td></tr>');
    });
}

$(document).on("click", ".btn-excluir", function() {
    delId = $(this).data("id");
    modal.show();
});

$("#btn-del").on("click", function() {
    $.ajax({
        url: `${API}/produtos/${delId}`,
        method: "DELETE",
        success() { modal.hide(); carregar(); },
        error()   { avisar("Erro ao excluir prato."); }
    });
});

carregar();
