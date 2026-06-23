$("#form-criar").on("submit", function(e) {
    e.preventDefault();

    const dados = {
        nome:       $("#nome").val().trim(),
        descricao:  $("#descricao").val().trim(),
        preco:      parseFloat($("#preco").val()),
        disponivel: true,
        imagem:     $("#imagem").val().trim()
    };

    if (!dados.nome || isNaN(dados.preco)) {
        avisar("Preencha nome e preço!", "warning");
        return;
    }

    $.ajax({
        url: `${API}/produtos`,
        method: "POST",
        contentType: "application/json",
        headers: authHeader(),
        data: JSON.stringify(dados),
        success() {
            avisar("Prato criado!", "success");
            window.location.href = "cardapio-admin.html";
        },
        error(xhr) {
            if (xhr.status === 401) { avisar("Sessão expirada.", "danger"); sair("../"); }
            else { avisar("Erro ao criar prato!", "danger"); }
        }
    });
});
