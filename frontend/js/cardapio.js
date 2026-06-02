let pedido = [];

// ─── CARREGAR PRATOS ────────────────────────────────────
function carregar() {
    $.get(`${API}/produtos`, function(lista) {

        let html = "";

        lista.forEach(p => {
            if (!p.disponivel) return;

            html += `
            <div class="col-md-6">
                <div class="card card-prato shadow-sm">

                    <img
                        src="${p.imagem || `https://picsum.photos/500/300?random=${p.id}`}"
                        class="imagem-prato"
                        onerror="this.src='https://picsum.photos/500/300?random=${p.id}'"
                    >

                    <div class="card-body">
                        <h5>${p.nome}</h5>
                        <p class="text-muted">${p.descricao || ""}</p>
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

        if (html === "") {
            html = `<div class="col"><p class="text-muted">Nenhum produto disponível.</p></div>`;
        }

        $("#lista").html(html);

    }).fail(() => avisar("Erro ao carregar cardápio."));
}

// ─── ATUALIZAR PAINEL DO PEDIDO ─────────────────────────
function atualizarPedido() {
    let html = "";
    let total = 0;

    pedido.forEach(item => {
        total += item.preco * item.quantidade;
        html += `
        <div class="item-pedido">
            <strong>${item.nome}</strong>
            <div class="text-muted" style="font-size:13px">Quantidade: ${item.quantidade}</div>
            <div>${formatarPreco(item.preco * item.quantidade)}</div>
        </div>`;
    });

    if (pedido.length === 0) {
        html = `<p class="text-muted">Nenhum item no pedido.</p>`;
    }

    $("#pedido-lista").html(html);
    $("#total").text(formatarPreco(total));
    $("#btn-finalizar").prop("disabled", pedido.length === 0);
}

// ─── ADICIONAR ITEM AO PEDIDO ───────────────────────────
function adicionarPedido(produto) {
    let existente = pedido.find(item => item.id === produto.id);

    if (existente) {
        existente.quantidade++;
    } else {
        pedido.push({ ...produto, quantidade: 1 });
    }

    atualizarPedido();
}

// ─── EVENTO: CLIQUE NO BOTÃO ADICIONAR ─────────────────
$(document).on("click", ".btn-pedir", function() {
    adicionarPedido({
        id:    $(this).data("id"),
        nome:  $(this).data("nome"),
        preco: parseFloat($(this).data("preco"))
    });
});

// ─── EVENTO: CONFIRMAR PEDIDO ───────────────────────────
$("#btn-confirmar").on("click", function() {
    const nome_cliente = $("#cli-nome").val().trim();
    const telefone     = $("#cli-telefone").val().trim();

    if (!nome_cliente || !telefone) {
        avisar("Preencha nome e telefone!");
        return;
    }

    let promessas = pedido.map(item => {
        return $.ajax({
            url: `${API}/pedidos`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                nome_cliente: nome_cliente,
                telefone:     telefone,
                produto:      item.nome,
                quantidade:   item.quantidade,
                valor_total:  item.preco * item.quantidade,
                status:       "Preparando"
            })
        });
    });

    $.when(...promessas)
        .done(function() {
            bootstrap.Modal.getInstance(
                document.getElementById("modal-pedido")
            ).hide();

            pedido = [];
            atualizarPedido();
            avisar(`Pedido de ${nome_cliente} registrado com sucesso!`);
            $("#cli-nome").val("");
            $("#cli-telefone").val("");
        })
        .fail(() => avisar("Erro ao registrar pedido. Tente novamente."));
});

// ─── INICIAR ────────────────────────────────────────────
mascaraTelefone("#cli-telefone");
carregar();
