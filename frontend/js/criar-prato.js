$("#form-criar").on("submit", function(e) {
    e.preventDefault();

    const dados = {
        nome:       $("#nome").val().trim(),
        descricao:  $("#descricao").val().trim(),
        preco:      parseFloat($("#preco").val()),
        disponivel: true,
        imagem:     ""
    };

    if (!dados.nome || isNaN(dados.preco)) {
        avisar("Preencha nome e preço!");
        return;
    }

    $.ajax({
        url: `${API}/produtos`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(dados),
        success() {
            avisar("Prato criado!");
            window.location.href = "cardapio-admin.html";
        },
        error() { avisar("Erro ao criar prato!"); }
    });
});
