const { format } = require("mysql");

  //CODIFICA O FICHEIRO EM BASE64:
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  
  //INSERE FICHEIRO CARREGADO NA BASE DE DADOS:
  function ficheiro(){
    var conteudo_base64;
    var ficheiro = document.getElementById("recursoExtra").files[0];
    var ficheiroAux = document.getElementById("recursoExtra").value;
    var tipoFicheiro = document.querySelector('input[name="tipoFicheiro"]:checked').value;
    var titulo = document.getElementById("tituloFicheiro").value;
    console.log(titulo);
    if(ficheiro == null){
      alert("Por favor, insira um ficheiro.");
      return;
    }
    if(!ficheiroAux.endsWith(".pdf")){
      alert("Por favor, insira um ficheiro no formato PDF.");
      return;
    }
    if(titulo == ""){
      alert("Escreva o título do ficheiro.");
      return;
    }
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
          alert("O ficheiro é muito grande.");
        } else {
          console.log(query);
          alert("Ficheiro partilhado com sucesso.");
        }
      });
      closeConnectionDataBase();
    }, 2000);

  }

//ESCOLHA DA DISCIPLINA LECIONADA PELO EXPLICADOR PARA INSERIR FICHEIROS:
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
      select.required;
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
      a.setAttribute("class", "btn btn-primary bg-gradient-primary");
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

//TITULO DA PÁGINA DE CARREGAR RECURSOS DE UMA DISCIPLINA:
function tituloNomeDisciplina(){
  var titulo = document.createElement("H1");
  titulo.setAttribute("class", "h3 mb-0 text-light");
  var text = document.createTextNode("Inserir Ficheiro - "+ sessionStorage.getItem("disciplina_nome"));
  console.log(sessionStorage.getItem("disciplina_id"));
  titulo.appendChild(text);
  document.getElementById("carregarFile").appendChild(titulo);

}

function paragrafo(elemento){
  var paragrafo = document.createElement("br");
      document.getElementById(elemento).appendChild(paragrafo);
}


//LISTA DISCIPLINAS DO ALUNO:
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
      var i = 1;
      result.forEach((disciplina) => {
        console.log(disciplina);
        //CARD:
        var disci = document.createElement("div");
        disci.value = disciplina.id;
        disci.setAttribute("class", "col-xl-12 col-md-6 mb-0");

        //NOME DISCIPLINA:
        var nome = document.createElement("button");
        if(i%2 == 0){
          nome.setAttribute("class", "card border-left-primary shadow h-100 py-0 w-100");
        }else{
          nome.setAttribute("class", "card border-left-info shadow h-100 py-0 w-100");
        }
        
        
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body w-100");
        var nomeAux2 = document.createElement("div");
        if(i%2 == 0){
          nomeAux2.setAttribute("class", "text-x font-weight-bold text-primary text-uppercase mb-0");
        }else{
          nomeAux2.setAttribute("class", "text-x font-weight-bold text-info text-uppercase mb-0");
        }
        
        
        i++;
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

//DESCODIFICA O BASE64:
function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

//LISTA FICHEIROS DISPONIBILIZADOS NA DISCIPLINA ESCOLHIDA:
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
      div1.setAttribute("class","card-header bg-gradient-warning");
      var titulo = document.createElement("H3");
      titulo.setAttribute("class", "h3 mb-0 text-light");
      titulo.innerHTML = "Ficheiros - "+sessionStorage.getItem("disciplina_nome");
      div1.appendChild(titulo);
      document.getElementById("ficheirosDisciplinaAluno").appendChild(div1);

      var div2 = document.createElement("div");
      div2.setAttribute("class","card-body");

      var listing = document.createElement("dl");

      var fichaExercicios = document.createElement("lu");
      fichaExercicios.innerHTML = "<b>Fichas de Exercícios</b>";
      var apontamentos = document.createElement("lu");
      apontamentos.innerHTML = "<br><b>Apontamentos</b>";
      var outros = document.createElement("lu");
      outros.innerHTML = "<br><b>Outros</b>";

      var semFichas = true;
      var semApontamentos = true;
      var semOutros = true;

      result.forEach((ficheiro) => {
        console.log(ficheiro);
        var ficheiroPDF = document.createElement("li");
        var downloadLink = document.createElement("a");
        var link = document.createTextNode(""+ficheiro.Titulo);
        var data = document.createElement("h8");
        data.setAttribute("class", "text-secondary");
        data.setAttribute("style", "float:right");
        data.innerHTML = ""+(ficheiro.data_insercao.toString()).substring(4,24)+"";
        
        
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
        ficheiroPDF.appendChild(data);
        if(ficheiro.tipo == "Ficha de Exercicios"){
          fichaExercicios.appendChild(ficheiroPDF);
          semFichas = false;
        }else if (ficheiro.tipo == "Teórico"){
          apontamentos.appendChild(ficheiroPDF);
          semApontamentos = false;
        }else{
          outros.appendChild(ficheiroPDF);
          semOutros = false;
        }
        
      });
      if(semFichas){
        var info = document.createElement("li");
        info.innerHTML = "Não há fichas de exercícios.";
        fichaExercicios.appendChild(info);
      }
      if(semApontamentos){
        var info = document.createElement("li");
        info.innerHTML = "Não há apontamentos.";
        apontamentos.appendChild(info);
      }
      if(semOutros){
        var info = document.createElement("li");
        info.innerHTML = "Não há outros ficheiros.";
        outros.appendChild(info);
      }


      listing.appendChild(fichaExercicios);
      listing.appendChild(apontamentos);
      listing.appendChild(outros);

      div2.appendChild(listing);
      document.getElementById("ficheirosDisciplinaAluno").appendChild(div2);
      
    }
  });
  closeConnectionDataBase();
}


function editar_apagar_ficheiros(){


  var idExplicador = sessionStorage.getItem("idUser");

  query = "SELECT ficheiro.id, ficheiro.nome as fileName, ficheiro.data_insercao, ficheiro.Titulo, ficheiro.tipo, disciplina.nome as disciName FROM ficheiro, disciplina "+
  "WHERE ficheiro.explicador_user_id = '"+ idExplicador +"' AND ficheiro.disciplina_id =disciplina.id AND disciplina.explicador_user_id = ficheiro.explicador_user_id ORDER BY disciName, ficheiro.tipo";
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      var i=1;
      result.forEach((ficheiro) => {
        var accordion = document.createElement("div");
        accordion.setAttribute("class","card-header alert-primary btn-link bg-gradient-light shadow rounded-top");
        accordion.id = "ficheiroNº"+i;
        

        var collapseName = document.createElement("button");
        collapseName.setAttribute("href", "#"+(""+ficheiro.disciName+ficheiro.Titulo+i).replace(" ", "_"));
        collapseName.setAttribute("class", "btn btn-link");
        collapseName.setAttribute("data-toggle","collapse");
        collapseName.setAttribute("data-target","#"+(""+ficheiro.disciName+ficheiro.Titulo+i).replace(" ", "_"));
        collapseName.setAttribute("aria-expanded","false");
        collapseName.setAttribute("aria-controls",(""+ficheiro.disciName+ficheiro.Titulo+i).replace(" ", "_"));

        
        var data = document.createElement("h8");
        data.setAttribute("class", "text-secondary");
        data.setAttribute("style", "float:right");
        data.innerHTML = ficheiro.tipo;
        

        console.log(collapseName);
        
        var nome = document.createElement("H6");
        nome.setAttribute("class","m-0 font-weight-bold text-dark");
        nome.innerHTML=""+ficheiro.Titulo+" ("+ ficheiro.disciName+")";
        accordion.appendChild(data);
        collapseName.appendChild(nome);

        accordion.appendChild(collapseName);
        document.getElementById("listaFicheiros").appendChild(accordion);
        
        var formulario = document.createElement("div");
        formulario.setAttribute("class","collapse");
        formulario.setAttribute("aria-labelledby","ficheiroNº"+i);
        formulario.setAttribute("data-parent","#accordioned");
        formulario.id = (""+ficheiro.disciName+ficheiro.Titulo+i).replace(" ", "_");
        console.log(formulario);
        var formularioAux = document.createElement("div");
        formularioAux.setAttribute("class","card-body shadow rounded-bottom");

        var p = document.createElement("p");
        p.innerHTML = "<b>Novo título:</b>"
        formularioAux.appendChild(p);
        
        var form = document.createElement("input");
        form.type="text";
        form.setAttribute("class","form-control w-75");
        form.id = "novoTitulo"
        formularioAux.appendChild(form);
        var paragrafo = document.createElement("br");
        formularioAux.appendChild(paragrafo);

        var a = document.createElement("button");
        var link = document.createTextNode("Confirmar Edição");
        a.appendChild(link);
        a.title = "Confirmar";
        a.setAttribute("class", "btn btn-success");
        a.onclick = function() {
          query = "UPDATE ficheiro SET Titulo='"+ document.getElementById("novoTitulo").value +"' WHERE id='"+ ficheiro.id +"'";
          console.log(query);
          connectDataBase();
          connection.query(query, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              window.location.replace("editarFicheiros.html");
            }
          });
        };

        formularioAux.appendChild(a);
        var apagar = document.createElement("a");
        apagar.setAttribute("class","btn btn-danger bg-gradient-danger btn-xs");
        apagar.setAttribute("style","float: right");
        apagar.onclick = function(){
          var r = confirm("Deseja apagar o ficheiro?");
          if (r == true) {
            query = "DELETE FROM ficheiro WHERE id = '"+ ficheiro.id +"'";
            console.log(query);
            connectDataBase();
            connection.query(query, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                window.location.replace("editarFicheiros.html");
              }
          });
        }
        };

        var auxApagar = document.createElement("i");
        auxApagar.setAttribute("class","fas fa-trash");
        
        apagar.appendChild(auxApagar);
        formularioAux.appendChild(apagar);
        formulario.appendChild(formularioAux);
        document.getElementById("listaFicheiros").appendChild(formulario);
        i++;
      });
      if(i == 1){
        var nome = document.createElement("li");
        nome.setAttribute("class","alert alert-danger");
        nome.innerHTML="<b>Não tem ficheiros.</b> Faça upload de ficheiros <a href='disciplinaFicheiros.html' class='alert-link'>aqui</a>.";

        document.getElementById("listaFicheiros").appendChild(nome);
      }
    }
  });
  closeConnectionDataBase();
}
