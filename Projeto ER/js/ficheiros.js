
  function ficheiro(){
    var ficheiro = document.getElementById("recursoExtra").files[0];
    var ficheiroAux = document.getElementById("recursoExtra").value;
    var nomeFicheiro = ficheiroAux.split("C:\\fakepath\\")[1];

    var conteudo_base64;
    var reader = new FileReader();
    reader.readAsDataURL(ficheiro);
    reader.onloadend = function () {
      conteudo_base64 = reader.result;
      console.log(conteudo_base64);
      conteudo_base64 = conteudo_base64.replace("data:application/pdf;base64,", "");
      console.log(conteudo_base64);
    };

    connectDataBase();
    var id = sessionStorage.getItem("idUser");
    var disciplina = sessionStorage.getItem("disciplina_id");
    console.log(id);
    query = "INSERT INTO ficheiro (id, nome, explicador_user_id, conteudo, data_insercao, disciplina_id) VALUES ("+ null +", '" + nomeFicheiro + "','" + id + "','"+ conteudo_base64 +"', CURRENT_TIMESTAMP(),'"+ disciplina+"');";
      connection.query(query, function (err, result, fields) {
        if (err) {
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
      select.setAttribute("class", "form-control");
      select.id = "disciplinaEscolhida";
      select.size = 5;
      document.getElementById("escolherDisciplina").appendChild(select);

      result.forEach((disciplina) => {
        console.log(disciplina);
        var opcao = document.createElement("option");
        opcao.value = disciplina.id;
        opcao.innerHTML = disciplina.nome;
        select.appendChild(opcao);
      });

      paragrafo("escolherDisciplina");
      paragrafo("escolherDisciplina");

      var a = document.createElement("a");
      var link = document.createTextNode("Continuar");
      a.appendChild(link);
      a.title = "Continuar";
      a.setAttribute("class", "btn btn-primary");
      a.href = "recursoExtra.html";
      a.onclick = function() {
        var x = document.getElementById("disciplinaEscolhida").value;
        var y = select.options[select.selectedIndex].text;
        sessionStorage.setItem("disciplina_id", x);
        sessionStorage.setItem("disciplina_nome", y);
      };
      console.log(a);
      document.getElementById("escolherDisciplina").appendChild(a);
      
    }
  });
  closeConnectionDataBase();
}

function tituloNomeDisciplina(){
  var titulo = document.createElement("H1");
  titulo.setAttribute("class", "h3 mb-0 text-gray-800");
  var text = document.createTextNode("Recursos - "+ sessionStorage.getItem("disciplina_nome"));
  console.log(sessionStorage.getItem("disciplina_id"));
  titulo.appendChild(text);
  console.log(titulo);
  document.getElementById("carregarFile").appendChild(titulo);

}

function paragrafo(elemento){
  var paragrafo = document.createElement("br");
      document.getElementById(elemento).appendChild(paragrafo);
}


function mostraDisciplinasAluno(){
  var id = sessionStorage.getItem("idUser");
  query = "SELECT disciplina.id as disciplinaId, disciplina.nome as disciplinaNome, explicador.user_id as explicadorID, explicador.nome as explicadorNome "+
  "FROM disciplina, explicando_tem_explicador, explicador WHERE explicando_tem_explicador.explicando_user_id = '"+ id +
  "'AND disciplina.id = explicando_tem_explicador.disciplina_id AND explicador.user_id= explicando_tem_explicador.explicador_user_id";
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      result.forEach((disciplina) => {
        console.log(disciplina);
        //CARD:
        var disci = document.createElement("div");
        disci.value = disciplina.id;
        disci.setAttribute("class", "col-xl-6 col-md-6 mb-2");

        //NOME DISCIPLINA:
        var nome = document.createElement("button");
        nome.setAttribute("class", "card border-left-primary shadow h-100 py-2");
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body");
        var nomeAux2 = document.createElement("div");
        nomeAux2.setAttribute("class", "text-x font-weight-bold text-primary text-uppercase mb-1");
        nomeAux2.innerHTML = disciplina.disciplinaNome;
        nomeAux.appendChild(nomeAux2);
        //NOME EXPLICADOR:
        var explicador = document.createElement("div");
        explicador.setAttribute("class", "h9 mb-0 font-weight text-gray-800");
        explicador.innerHTML = "Explicador: "+disciplina.explicadorNome;
        console.log(disciplina.explicadorNome);

        nomeAux.appendChild(explicador);
        
        nome.onclick = function(){
          sessionStorage.setItem("disciplina_id", disciplina.disciplinaId);
          sessionStorage.setItem("disciplina_nome", disciplina.disciplinaNome);
          window.location.replace("../html/recursoExtra.html")
        };
        nome.appendChild(nomeAux);

        disci.appendChild(nome);
        document.getElementById("disciplinasAluno").appendChild(disci);
        });
      }
    });
    closeConnectionDataBase();
}
  