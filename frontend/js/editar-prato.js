const id = getIdDaUrl();
if (!id) window.location.href = "cardapio-admin.html";
$("#titulo-id").text(`#${id}`);

$.get(`${API}/produtos/${id}`, function(p) {
    $("#nome").val(p.nome);
    $("#descricao").val(p.descricao);
    $("#preco").val(p.preco);
    $("#disponivel").val(String(p.disponivel));
}).fail(() => {
    avisar("Prato não encontrado.", "danger");
    window.location.href = "cardapio-admin.html";
});

function salvar() {
    const dados = {
        nome:       $("#nome").val().trim(),
        descricao:  $("#descricao").val().trim(),
        preco:      parseFloat($("#preco").val()),
        disponivel: $("#disponivel").val() === "true",
        imagem:     ""
    };

    if (!dados.nome || isNaN(dados.preco)) {
        avisar("Preencha nome e preço!", "warning");
        return;
    }

    $("#btn-salvar").prop("disabled", true).text("Salvando...");

    // PUT protegido
    $.ajax({
        url: `${API}/produtos/${id}`,
        method: "PUT",
        contentType: "application/json",
        headers: authHeader(),
        data: JSON.stringify(dados),
        success() {
            avisar("Prato atualizado!", "success");
            window.location.href = "cardapio-admin.html";
        },
        error(xhr) {
            if (xhr.status === 401) { avisar("Sessão expirada.", "danger"); sair("../"); }
            else { avisar("Erro ao atualizar prato.", "danger"); }
            $("#btn-salvar").prop("disabled", false).text("Salvar Alterações");
        }
    });
}
