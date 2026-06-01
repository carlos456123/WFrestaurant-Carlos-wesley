const API = "http://localhost:8000";

const id = new URLSearchParams(window.location.search).get("id");

if (!id) window.location.href = "../cardapio/index.html";

$("#titulo-id").text(`#${id}`);

// Carrega os dados do prato
$.get(`${API}/produtos/${id}`, function(p) {
    $("#nome").val(p.nome);
    $("#descricao").val(p.descricao);
    $("#preco").val(p.preco);
    $("#disponivel").val(String(p.disponivel)); // "true" ou "false"
}).fail(() => {
    alert("Prato não encontrado.");
    window.location.href = "../cardapio-admin/cardapio-admin.html";
});

function salvar() {
    const dados = {
        nome:       $("#nome").val().trim(),
        descricao:  $("#descricao").val().trim(),
        preco:      parseFloat($("#preco").val()),
        disponivel: $("#disponivel").val() === "true"
    };

    if (!dados.nome || isNaN(dados.preco)) {
        alert("Preencha nome e preço!");
        return;
    }

    $("#btn-salvar").prop("disabled", true).text("Salvando...");

    $.ajax({
        url: `${API}/produtos/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(dados),
        success() {
            alert("Prato atualizado!");
            window.location.href = "../cardapio-admin/cardapio-admin.html";
        },
        error() {
            alert("Erro ao atualizar prato.");
            $("#btn-salvar").prop("disabled", false).text("Salvar Alterações");
        }
    });
}