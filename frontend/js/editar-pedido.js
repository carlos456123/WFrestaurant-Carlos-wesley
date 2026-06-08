const id = getIdDaUrl();
if (!id) window.location.href = "pedidos.html";
$("#titulo-id").text(`#${id}`);


$.get(`${API}/produtos`, function(lista) {
    const sel = $("#produto_id").empty();
    lista.forEach(p => {
        sel.append(`<option value="${p.id}">${p.nome} — R$ ${p.preco.toFixed(2)}</option>`);
    });

    
    carregarPedido();

}).fail(() => avisar("Erro ao carregar produtos."));

function carregarPedido() {
    $.get(`${API}/pedidos/${id}`, function(p) {
        $("#nome_cliente").val(p.nome_cliente);
        $("#telefone").val(p.telefone);
        $("#produto_id").val(p.produto_id);
        $("#quantidade").val(p.quantidade);
        $("#valor_total").val(p.valor_total);
        $("#status").val(p.status);
    }).fail(() => {
        avisar("Pedido não encontrado.");
        window.location.href = "pedidos.html";
    });
}

function salvar() {
    const dados = {
        nome_cliente: $("#nome_cliente").val().trim(),
        telefone:     $("#telefone").val().trim(),
        produto_id:   parseInt($("#produto_id").val()),
        quantidade:   parseInt($("#quantidade").val()),
        valor_total:  parseFloat($("#valor_total").val()),
        status:       $("#status").val()
    };

    if (!dados.nome_cliente || !dados.telefone || !dados.produto_id) {
        avisar("Preencha todos os campos!");
        return;
    }

    $("#btn-salvar").prop("disabled", true).text("Salvando...");

    // PUT protegido
    $.ajax({
        url: `${API}/pedidos/${id}`,
        method: "PUT",
        contentType: "application/json",
        headers: authHeader(),
        data: JSON.stringify(dados),
        success() {
            avisar("Pedido atualizado!");
            window.location.href = "pedidos.html";
        },
        error(xhr) {
            if (xhr.status === 401) { avisar("Sessão expirada."); sair("../"); }
            else { avisar("Erro ao atualizar pedido."); }
            $("#btn-salvar").prop("disabled", false).text("Salvar Alterações");
        }
    });
}

mascaraTelefone("#telefone");
