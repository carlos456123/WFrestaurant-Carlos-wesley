let delId = null;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

function carregar() {
    $("#tbody").html('<tr><td colspan="8" class="text-center text-muted py-4">Carregando...</td></tr>');

    $.get(`${API}/pedidos`, function(lista) {
        if (!lista.length) {
            $("#tbody").html('<tr><td colspan="8" class="text-center text-muted py-4">Nenhum pedido registrado.</td></tr>');
            return;
        }

        let html = "";
        lista.forEach(p => {
            // produto_rel vem embutido pelo backend graças ao FK
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
                    <a href="editar-pedido.html?id=${p.id}"
                       class="btn btn-outline-secondary btn-sm me-1">Editar</a>
                    <button class="btn btn-outline-danger btn-sm btn-excluir"
                            data-id="${p.id}">Excluir</button>
                </td>
            </tr>`;
        });

        $("#tbody").html(html);
    }).fail(() => {
        $("#tbody").html('<tr><td colspan="8" class="text-center text-danger py-4">Erro ao carregar pedidos.</td></tr>');
    });
}

$(document).on("click", ".btn-excluir", function() {
    delId = $(this).data("id");
    modal.show();
});

$("#btn-del").on("click", function() {
    $.ajax({
        url: `${API}/pedidos/${delId}`,
        method: "DELETE",
        success() { modal.hide(); carregar(); },
        error()   { avisar("Erro ao excluir pedido."); }
    });
});

carregar();
