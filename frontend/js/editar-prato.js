const id = getIdDaUrl();

if (!id) window.location.href = "cardapio-admin.html";

$("#titulo-id").text(`#${id}`);

// ─── CARREGAR DADOS DO PRATO ────────────────────────────
$.get(`${API}/produtos/${id}`, function(p) {
    $("#nome").val(p.nome);
    $("#descricao").val(p.descricao);
    $("#preco").val(p.preco);
    $("#disponivel").val(String(p.disponivel));
}).fail(() => {
    avisar("Prato não encontrado.");
    window.location.href = "cardapio-admin.html";
});

// ─── SALVAR ALTERAÇÕES ──────────────────────────────────
function salvar() {
    const dados = {
        nome:       $("#nome").val().trim(),
        descricao:  $("#descricao").val().trim(),
        preco:      parseFloat($("#preco").val()),
        disponivel: $("#disponivel").val() === "true",
        imagem:     ""
    };

    if (!dados.nome || isNaN(dados.preco)) {
        avisar("Preencha nome e preço!");
        return;
    }

    $("#btn-salvar").prop("disabled", true).text("Salvando...");

    $.ajax({
        url: `${API}/produtos/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dados),
        success() {
            avisar("Prato atualizado!");
            window.location.href = "cardapio-admin.html";
        },
        error() {
            avisar("Erro ao atualizar prato.");
            $("#btn-salvar").prop("disabled", false).text("Salvar Alterações");
        }
    });
}
