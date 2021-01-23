
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  
  
  function ficheiro(){
    var conteudo_base64;
    var ficheiro = document.getElementById("recursoExtra").files[0];
    var ficheiroAux = document.getElementById("recursoExtra").value;
    var tipoFicheiro = document.querySelector('input[name="tipoFicheiro"]:checked').value;
    var titulo = document.getElementById("tituloFicheiro").value;

    var nomeFicheiro = ficheiroAux.split("C:\\fakepath\\")[1];

    var reader = new FileReader();
    reader.readAsDataURL(ficheiro);
    reader.onloadend = function () {
      conteudo_base64 = reader.result;
      conteudo_base64 = conteudo_base64.replace("data:application/pdf;base64,", "");
      console.log(conteudo_base64);
    };

    connectDataBase();
    var id = sessionStorage.getItem("idUser");
    var disciplina = sessionStorage.getItem("disciplina_id");
    console.log(id);
    setTimeout(function(){
    query = "INSERT INTO ficheiro (id, nome, explicador_user_id, conteudo, data_insercao, disciplina_id, tipo, titulo) VALUES ("+ null +", '" + nomeFicheiro + "','" + id + "', '"+ conteudo_base64 +"' , CURRENT_TIMESTAMP(),'"+ disciplina+"','"+ tipoFicheiro +"','"+ titulo+"');";
      connection.query(query, function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          console.log(query);
          alert("Ficheiro partilhado com sucesso.");
        }
      });
      closeConnectionDataBase();
    }, 2000);

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
        nome.setAttribute("class", "card border-left-warning shadow h-100 py-2");
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body");
        var nomeAux2 = document.createElement("div");
        nomeAux2.setAttribute("class", "text-x font-weight-bold text-danger text-uppercase mb-1");
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
          sessionStorage.setItem("explicador_id", disciplina.explicadorID);
          window.location.replace("../html/recursoExtraAluno.html")
        };
        nome.appendChild(nomeAux);

        disci.appendChild(nome);
        document.getElementById("disciplinasAluno").appendChild(disci);
        });
      }
    });
    closeConnectionDataBase();
}

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function ficheirosDisciplinaAluno(){
  var idAluno = sessionStorage.getItem("idUser");
  var idExplicador = sessionStorage.getItem("explicador_id");
  var idDisciplina = sessionStorage.getItem("disciplina_id");

  query = "SELECT * FROM ficheiro WHERE explicador_user_id = '"+ idExplicador +"' AND disciplina_id ='"+ idDisciplina +"'";
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {

      var div1 = document.createElement("div");
      div1.setAttribute("class","card-header");
      var titulo = document.createElement("H3");
      titulo.setAttribute("class", "h3 mb-0 text-gray-800");
      titulo.innerHTML = "Ficheiros - "+sessionStorage.getItem("disciplina_nome");
      div1.appendChild(titulo);
      document.getElementById("ficheirosDisciplinaAluno").appendChild(div1);

      var div2 = document.createElement("div");
      div2.setAttribute("class","card-body");

      var listing = document.createElement("ul");

      result.forEach((ficheiro) => {
        console.log(ficheiro);
        var ficheiroPDF = document.createElement("li");
        var downloadLink = document.createElement("a");
        var link = document.createTextNode(""+ficheiro.nome);
        downloadLink.appendChild(link);

        downloadLink.download = ficheiro.nome;
        var base64str = ficheiro.conteudo;

        // create the blob object with content-type "application/pdf"               
        var blob = new Blob( [base64ToArrayBuffer(base64str)], { type: "application/pdf" });
        var url = URL.createObjectURL(blob);

        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.title = ficheiro.nome;
        console.log(downloadLink);
        ficheiroPDF.appendChild(downloadLink);
        listing.appendChild(ficheiroPDF);
      });

      div2.appendChild(listing);
      document.getElementById("ficheirosDisciplinaAluno").appendChild(div2);
      
    }
  });
  closeConnectionDataBase();
}