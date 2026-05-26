const API = "http://localhost:8000";

$("#form-criar").on("submit", function(e) {

    e.preventDefault();

    $.ajax({
        url: `${API}/produtos`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            nome:     $("#nome").val(),
            descricao:$("#descricao").val(),
            preco:    parseFloat($("#preco").val())
        }),
        success() {
            alert("Prato criado!");
            window.location.href = "../index.html";
        },
        error() {
            alert("Erro ao criar prato!");
        }
    });

});
