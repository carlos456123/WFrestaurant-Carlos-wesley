const API = "http://localhost:8000";

let pedido = [];

/* ATUALIZA A CAIXA DO PEDIDO */
function atualizarPedido() {

    let html = "";
    let total = 0;

    for (let i = 0; i < pedido.length; i++) {
        let item = pedido[i];
        total += item.preco * item.quantidade;

        html += `
        <div class="item-pedido">
            <strong>${item.nome}</strong>
            <div class="text-muted" style="font-size:13px;">Quantidade: ${item.quantidade}</div>
            <div>R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
        </div>
        `;
    }


    if (pedido.length === 0) {
        html = `<p class="text-muted">Nenhum item no pedido.</p>`;
    }

    $("#pedido-lista").html(html);
    $("#total").text(`R$ ${total.toFixed(2)}`);

    // Habilita ou desabilita o botão de finalizar
    $("#btn-finalizar").prop("disabled", pedido.length === 0);
}
// Máscara de telefone — formata enquanto digita
$("#cli-telefone").on("input", function() {
    let v = $(this).val().replace(/\D/g, ""); // remove tudo que não é número
    if (v.length > 11) v = v.slice(0, 11);    // limita a 11 dígitos

    if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
        v = `(${v}`;
    }

    $(this).val(v);

});



/* ADICIONA OU INCREMENTA ITEM NO PEDIDO */
function adicionarPedido(produto) {

    let existente = pedido.find(item => item.id === produto.id);

    if (existente) {
        existente.quantidade++;
    } else {
        pedido.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    atualizarPedido();
}

/* CARREGA OS PRODUTOS DO CARDÁPIO */
function carregar() {

    $.get(`${API}/produtos`, function(lista) {

        let html = "";

        for (let i = 0; i < lista.length; i++) {
            let p = lista[i];

            // pula produtos indisponíveis
            if (!p.disponivel) continue;

            html += `
            <div class="col-md-6">
                <div class="card card-prato shadow-sm">

                    <img
                        src="${p.imagem || 'https://picsum.photos/500/300?random=' + p.id}"
                        class="imagem-prato"
                        onerror="this.src='https://picsum.photos/500/300?random=${p.id}'"
                    >

                    <div class="card-body">
                        <h5>${p.nome}</h5>
                        <p class="text-muted">${p.descricao || ''}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="preco">R$ ${p.preco.toFixed(2)}</span>
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
            </div>
            `;
        }

        if (html === "") {
            html = `<div class="col"><p class="text-muted">Nenhum produto disponível.</p></div>`;
        }

        $("#lista").html(html);
    });
}

/* EVENTO: clique em "Adicionar ao Pedido" */
$(document).on("click", ".btn-pedir", function() {
    adicionarPedido({
        id:    $(this).data("id"),
        nome:  $(this).data("nome"),
        preco: parseFloat($(this).data("preco"))
    });
});

/* EVENTO: confirmar pedido no modal */
$("#btn-confirmar").on("click", function() {

    const nome_cliente = $("#cli-nome").val().trim();
    const telefone     = $("#cli-telefone").val().trim();

    if (!nome_cliente || !telefone) {
        alert("Preencha nome e telefone!");
        return;
    }

    // Envia um pedido para cada item
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

    // Quando todos enviarem com sucesso
    $.when(...promessas)
        .done(function() {
            bootstrap.Modal.getInstance(
                document.getElementById("modal-pedido")
            ).hide();

            pedido = [];
            atualizarPedido();

            alert(`Pedido de ${nome_cliente} registrado com sucesso!`);

            // Limpa os campos do modal
            $("#cli-nome").val("");
            $("#cli-telefone").val("");
        })
        .fail(function() {
            alert("Erro ao registrar pedido. Tente novamente.");
        });
});

/* INICIAR */
carregar();
