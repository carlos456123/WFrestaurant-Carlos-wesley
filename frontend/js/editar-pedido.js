const id = getIdDaUrl();

if (!id) window.location.href = "pedidos.html";

$("#titulo-id").text(`#${id}`);

// ─── CARREGAR DADOS DO PEDIDO ───────────────────────────
$.get(`${API}/pedidos/${id}`, function(p) {
    $("#nome_cliente").val(p.nome_cliente);
    $("#telefone").val(p.telefone);
    $("#produto").val(p.produto);
    $("#quantidade").val(p.quantidade);
    $("#valor_total").val(p.valor_total);
    $("#status").val(p.status);
}).fail(() => {
    avisar("Pedido não encontrado.");
    window.location.href = "pedidos.html";
});

// ─── SALVAR ALTERAÇÕES ──────────────────────────────────
function salvar() {
    const dados = {
        nome_cliente: $("#nome_cliente").val().trim(),
        telefone:     $("#telefone").val().trim(),
        produto:      $("#produto").val().trim(),
        quantidade:   parseInt($("#quantidade").val()),
        valor_total:  parseFloat($("#valor_total").val()),
        status:       $("#status").val()
    };

    if (!dados.nome_cliente || !dados.telefone || !dados.produto) {
        avisar("Preencha todos os campos!");
        return;
    }

    $("#btn-salvar").prop("disabled", true).text("Salvando...");

    $.ajax({
        url: `${API}/pedidos/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dados),
        success() {
            avisar("Pedido atualizado!");
            window.location.href = "pedidos.html";
        },
        error() {
            avisar("Erro ao atualizar pedido.");
            $("#btn-salvar").prop("disabled", false).text("Salvar Alterações");
        }
    });
}

// ─── MÁSCARA TELEFONE ───────────────────────────────────
mascaraTelefone("#telefone");
