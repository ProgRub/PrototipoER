function enviarEnunciado() {
    iniciarConexaoDB();
    var base64data;
    var idDisciplina = document.getElementById("opcoesDisciplinaRegente").value;
    var dataFinalSubmissao = document.getElementById("dataFinal").value;
    var ficheiro = document.getElementById("enunciado").files[0];
    var nomeAvaliacao = document.getElementById("nomeAvaliacao").value;
    var reader = new FileReader();
    reader.readAsDataURL(ficheiro);
    reader.onloadend = function () {
      base64data = reader.result;
      base64data = base64data.replace("data:application/pdf;base64,", "");
      console.log(base64data);
    };
  
    setTimeout(function () {
      query =
        "INSERT INTO avaliacao (name, data_fim, enunciado, disciplina_id) VALUES ('" +
        nomeAvaliacao +
        "','" +
        dataFinalSubmissao +
        "', '" +
        base64data +
        "', " +
        idDisciplina +
        ");";
      console.log(query);
      console.log(ficheiro);
      connection.query(query, function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          alert("Ficheiro partilhado com sucesso.");
          setTimeout(window.location.replace("Avaliacao.html"), 5000);
        }
      });
      fecharConexaoDB();
    }, 1000);
  }