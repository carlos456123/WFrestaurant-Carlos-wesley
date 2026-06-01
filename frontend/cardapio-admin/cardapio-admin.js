const API = "http://localhost:8000";

let delId = null;
const modal = new bootstrap.Modal(document.getElementById("modal-del"));

function carregar() {
    $("#tbody").html('<tr><td colspan="6" class="text-center text-muted py-3">Carregando...</td></tr>');

    $.get(`${API}/produtos`, function(lista) {

        if (!lista.length) {
            $("#tbody").html('<tr><td colspan="6" class="text-center text-muted py-3">Nenhum prato cadastrado.</td></tr>');
            return;
        }

        let html = "";

        lista.forEach(p => {
            html += `
            <tr>
                <td>#${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.descricao || "—"}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>${p.disponivel
                    ? '<span class="badge bg-success">Sim</span>'
                    : '<span class="badge bg-danger">Não</span>'}</td>
                <td>
                    <a href="../editar-prato/index.html?id=${p.id}"
                       class="btn btn-outline-secondary btn-sm me-1">Editar</a>
                    <button class="btn btn-outline-danger btn-sm btn-excluir"
                            data-id="${p.id}">Excluir</button>
                </td>
            </tr>`;
        });

        $("#tbody").html(html);

    }).fail(() => {
        $("#tbody").html('<tr><td colspan="6" class="text-danger text-center py-3">Erro ao carregar.</td></tr>');
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
        success() {
            modal.hide();
            carregar();
        },
        error() {
            alert("Erro ao excluir prato.");
        }
    });
});

carregar();