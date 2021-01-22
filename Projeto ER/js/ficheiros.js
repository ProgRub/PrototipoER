
  function ficheiro(){
    var ficheiro = document.getElementById("recursoExtra").files[0];
    var ficheiroAux = document.getElementById("recursoExtra").value;
    var nomeFicheiro = ficheiroAux.split("C:\\fakepath\\")[1];

    var conteudo_base64;
    var reader = new FileReader();
    reader.readAsDataURL(ficheiro);
    reader.onloadend = function () {
      conteudo_base64 = reader.result;
      conteudo_base64 = conteudo_base64.replace("data:application/pdf;base64,", "");
      console.log(conteudo_base64);
    };

    connectDataBase();
    var id = sessionStorage.getItem("idUser");
    var disciplina = sessionStorage.getItem("disciplina");
    console.log(id);
    query = "INSERT INTO ficheiro (id, nome, explicador_user_id, conteudo, data_insercao, disciplina_id) VALUES ("+ null +", '" + nomeFicheiro + "','" + id + "','"+ conteudo_base64 +"', CURRENT_TIMESTAMP(),'"+ disciplina+"');";
      connection.query(query, function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          alert("Ficheiro partilhado com sucesso.");
        }
      });
      
      closeConnectionDataBase();

  }

function listarDisciplinas(){
  var id = sessionStorage.getItem("idUser");
  query = "SELECT id, nome FROM disciplina WHERE explicador_user_id = '"+ id +"'";
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var select = document.createElement("select");
      select.classList.add("form-select");
      select.id = "disciplinaEscolhida";
      document.getElementById("escolherDisciplina").appendChild(select);

      result.forEach((disciplina) => {
        console.log(disciplina);
        var opcao = document.createElement("option");
        opcao.value = disciplina.id;
        opcao.innerHTML = disciplina.nome;
        select.appendChild(opcao);
      });

      var paragrafo = document.createElement("br");
      document.getElementById("escolherDisciplina").appendChild(paragrafo);

      var a = document.createElement("a");
      var link = document.createTextNode("Continuar");
      a.appendChild(link);
      a.title = "Continuar";
      a.href = "recursoExtra.html";
      a.onclick = function() {
        var x = document.getElementById("disciplinaEscolhida").value;
        sessionStorage.setItem("disciplina", x);
      };
      console.log(a);
      document.getElementById("escolherDisciplina").appendChild(a);
      
    }
  });
  closeConnectionDataBase();
}
