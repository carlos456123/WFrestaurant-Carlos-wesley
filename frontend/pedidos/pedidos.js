const API = "http://localhost:8000";

let delId = null;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

const statusCores = {
    "Preparando": "warning",
    "Pronto":     "success",
    "Entregue":   "primary",
    "Cancelado":  "danger"
};

function carregar() {

    $("#tbody").html(
        '<tr><td colspan="8" class="text-center text-muted py-3">Carregando...</td></tr>'
    );

    $.get(`${API}/pedidos`, function(lista) {

        if (!lista.length) {
            $("#tbody").html(
                '<tr><td colspan="8" class="text-center text-muted py-3">Nenhum pedido registrado.</td></tr>'
            );
            return;
        }

        let html = "";

        lista.forEach(p => {
            const cor = statusCores[p.status] || "secondary";
            html += `
            <tr>
                <td>#${p.id}</td>
                <td>${p.nome_cliente}</td>
                <td>${p.telefone}</td>
                <td>${p.produto}</td>
                <td>${p.quantidade}</td>
                <td>R$ ${p.valor_total.toFixed(2)}</td>
                <td><span class="badge bg-${cor}">${p.status}</span></td>
                <td>
                    <a href="../editar/index.html?id=${p.id}" class="btn btn-outline-secondary btn-sm me-1">Editar</a>
                    <button class="btn btn-outline-danger btn-sm btn-excluir" data-id="${p.id}">Excluir</button>
                </td>
            </tr>
            `;
        });

        $("#tbody").html(html);

    }).fail(() => {
        $("#tbody").html(
            '<tr><td colspan="8" class="text-center text-danger py-3">Erro ao carregar pedidos.</td></tr>'
        );
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
        success() {
            modal.hide();
            carregar();
        },
        error() {
            alert("Erro ao excluir pedido.");
        }
    });
});

carregar();
