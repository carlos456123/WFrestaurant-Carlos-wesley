let pedido = [];

function carregar() {
    $.get(`${API}/produtos?limit=100`, function(res) {
        const lista = res.data;
        let html = "";
        lista.forEach(p => {
            if (!p.disponivel) return;
            html += `
            <div class="col-md-6">
                <div class="card card-prato">
                    ${imagemPrato(p.imagem, p.nome, "")}
                    <div class="card-body">
                        <h5 class="mb-1">${p.nome}</h5>
                        <p class="text-muted mb-3" style="font-size:12px">${p.descricao || ""}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="preco">${formatarPreco(p.preco)}</span>
                        </div>
                        <button
                            class="btn btn-vermelho w-100 mt-3 btn-pedir"
                            data-id="${p.id}"
                            data-nome="${p.nome}"
                            data-preco="${p.preco}"
                        >
                            Adicionar ao Pedido
                        </button>
                    </div>
                </div>
            </div>`;
        });
        if (!html) html = `<div class="col"><p class="text-muted">Nenhum produto disponível.</p></div>`;
        $("#lista").html(html);
    }).fail(() => avisar("Erro ao carregar cardápio."));
}

function atualizarPedido() {
    let html = "";
    let total = 0;
    pedido.forEach(item => {
        total += item.preco * item.quantidade;
        html += `
        <div class="item-pedido">
            <strong>${item.nome}</strong>
            <div class="text-muted" style="font-size:12px">Qtd: ${item.quantidade}</div>
            <div>${formatarPreco(item.preco * item.quantidade)}</div>
        </div>`;
    });
    if (!pedido.length) html = `<p class="text-muted" style="font-size:13px">Nenhum item adicionado.</p>`;
    $("#pedido-lista").html(html);
    $("#total").text(formatarPreco(total));
    $("#btn-finalizar").prop("disabled", pedido.length === 0);
}

function adicionarPedido(produto) {
    let existente = pedido.find(i => i.id === produto.id);
    if (existente) {
        existente.quantidade++;
    } else {
        pedido.push({ ...produto, quantidade: 1 });
    }
    atualizarPedido();
}

$(document).on("click", ".btn-pedir", function() {
    adicionarPedido({
        id:    $(this).data("id"),
        nome:  $(this).data("nome"),
        preco: parseFloat($(this).data("preco"))
    });
});

$("#btn-confirmar").on("click", function() {
    const nome_cliente = $("#cli-nome").val().trim();
    const telefone     = $("#cli-telefone").val().trim();

    if (!nome_cliente || !telefone) {
        avisar("Preencha nome e telefone!");
        return;
    }

    // POST protegido — envia token no header
    let promessas = pedido.map(item => $.ajax({
        url: `${API}/pedidos`,
        method: "POST",
        contentType: "application/json",
        headers: authHeader(),
        data: JSON.stringify({
            nome_cliente: nome_cliente,
            telefone:     telefone,
            produto_id:   item.id,
            quantidade:   item.quantidade,
            valor_total:  item.preco * item.quantidade,
            status:       "Preparando"
        })
    }));

    $.when(...promessas)
        .done(function() {
            bootstrap.Modal.getInstance(document.getElementById("modal-pedido")).hide();
            pedido = [];
            atualizarPedido();
            avisar(`Pedido de ${nome_cliente} registrado!`);
            $("#cli-nome, #cli-telefone").val("");
        })
        .fail(xhr => {
            if (xhr.status === 401) {
                avisar("Sessão expirada. Faça login novamente.");
                sair("");
            } else {
                avisar("Erro ao registrar pedido.");
            }
        });
});

mascaraTelefone("#cli-telefone");
carregar();
