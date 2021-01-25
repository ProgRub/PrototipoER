//LISTA DISCIPLINAS DO ALUNO:
function mostraDisciplinas() {
  var id = sessionStorage.getItem("idUser");
  var disciplinas = true;
  query = "SELECT disciplina.id as disciplinaId, disciplina.nome as disciplinaNome, explicador.user_id as explicadorID, explicador.nome as explicadorNome FROM disciplina, explicador WHERE disciplina.explicador_user_id = explicador.user_id AND explicador.user_id = '" + id +
    "'";
    
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      result.forEach((disciplina) => {
        if(disciplinas!=false){
          document.getElementById("conteudo").appendChild(document.createTextNode("Selecione a disciplina da qual deseja ver a lista de aluno:"));
        }
        disciplinas = false;
        console.log(disciplina);
        //CARD:
        var disci = document.createElement("div");
        disci.value = disciplina.id;
        disci.setAttribute("class", "col-xl-12 col-md-6 mb-2");

        //NOME DISCIPLINA:
        var nome = document.createElement("button");
        nome.setAttribute("class", "card border-left-warning shadow h-100 py-2 w-100");
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body w-100");
        var nomeAux2 = document.createElement("div");
        nomeAux2.setAttribute("class", "text-x font-weight-bold text-danger text-uppercase mb-1");
        nomeAux2.innerHTML = disciplina.disciplinaNome;
        nomeAux.appendChild(nomeAux2);

        //NOME EXPLICADOR:
        var explicador = document.createElement("div");
        explicador.setAttribute("class", "h9 mb-0 font-weight text-gray-800");
        explicador.innerHTML = "Explicador: " + disciplina.explicadorNome;
        console.log(disciplina.explicadorNome);

        nomeAux.appendChild(explicador);

        nome.onclick = function () {
          sessionStorage.setItem("idDisciplina", disciplina.disciplinaId);
          window.location.assign("../html/alunosNomes.html")
        };
        nome.appendChild(nomeAux);

        disci.appendChild(nome);
        document.getElementById("disciplinasExplicador").appendChild(disci);
      });
      if(disciplinas!=false){
        document.getElementById("conteudo").appendChild(document.createTextNode("Não está a leccionar nenhuma disciplina de momento."));
      }
    }
  });
  closeConnectionDataBase();
}

//LISTA DISCIPLINAS DO ALUNO:
function mostraAlunos() {
  var id = sessionStorage.getItem("idUser");
  var idDisc = sessionStorage.getItem("idDisciplina");
  var alunos = true;
  query = "SELECT explicando.user_id as idExplicando, explicando.nome as nomeExplicando FROM explicando, explicando_tem_explicador, explicador WHERE explicando.user_id = explicando_tem_explicador.explicando_user_id AND explicando_tem_explicador.explicador_user_id = explicador.user_id AND explicando_tem_explicador.explicador_user_id = '" + id + "' AND explicando_tem_explicador.disciplina_id = '" + idDisc + "'";
  console.log(query);
  connectDataBase();
  

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      result.forEach((explicando) => {
        console.log(explicando);
        if(alunos!=false){
          document.getElementById("conteudo").appendChild(document.createTextNode("Selecione o aluno:"));
        }
        alunos = false;
        //CARD:
        var explic = document.createElement("div");
        explic.value = explicando.user_id;
        explic.setAttribute("class", "col-xl-12 col-md-6 mb-2");

        //NOME ALUNO:
        var nome = document.createElement("button");
        nome.setAttribute("class", "card border-left-warning shadow h-100 py-2 w-100");
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body w-100");
        var nomeAux2 = document.createElement("div");
        nomeAux2.setAttribute("class", "text-x font-weight-bold text-danger text-uppercase mb-1");
        nomeAux2.innerHTML = explicando.nomeExplicando;
        nomeAux.appendChild(nomeAux2);

        nome.onclick = function () {
          sessionStorage.setItem("idExplicando", explicando.idExplicando);
          sessionStorage.setItem("idDisciplina", idDisc);
          window.location.assign("../html/alunoSumario.html")
        };
        nome.appendChild(nomeAux);

        explic.appendChild(nome);
        document.getElementById("listaAlunos").appendChild(explic);
      });
      if(alunos!=false){
        document.getElementById("conteudo").appendChild(document.createTextNode("Não existe alunos inscritos nesta disciplina."));
      }
    }
  });
  closeConnectionDataBase();
}

function escrevaSumario() {
  var id = sessionStorage.getItem("idUser");
  var idDisc = sessionStorage.getItem("idDisciplina");
  var idExpndo = sessionStorage.getItem("idExplicando");
  var texto = true;
  
  query = "SELECT sumario.id, sumario.sumario as sum, sumario.data as data FROM sumario WHERE sumario.id_explicando = '" + idExpndo + "' AND sumario.id_explicador = '" + id + "' AND sumario.id_disciplina = '" + idDisc + "'";
  console.log(query);
  connectDataBase();
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
        result.forEach((sumario) => {
          if(texto!=false){
            document.getElementById("conteudo").appendChild(document.createTextNode("Sumários:"));
          }
          texto=false;
        console.log(sumario);
        sumario.data = sumario.data.toISOString().split("T")[0]
        //CARD:
        var sumariocard = document.createElement("div");
        sumariocard.value = sumario.id;
        sumariocard.setAttribute("class", "col-xl-12 col-md-6 mb-2");

        //DATA:
        var data = document.createElement("div");
        data.setAttribute("class", "card shadow border-left-danger h-100 py-2 w-100");
        var dataAux = document.createElement("div");
        dataAux.setAttribute("class", "card-body");
        var dataAux2 = document.createElement("div");
        dataAux2.setAttribute("class", "text-x font-weight-bold text-danger mb-1");
        dataAux2.setAttribute("align","justify");
        dataAux2.style.fontSize="large";
        dataAux2.innerHTML = sumario.data;
        dataAux.appendChild(dataAux2);

        //SUMARIO:
        var sumariocnt = document.createElement("div");
        sumariocnt.setAttribute("class", "h9 mb-0 font-weight");
        sumariocnt.setAttribute("align","justify");
        sumariocnt.innerHTML = sumario.sum;
        console.log(sumario.sum);

        dataAux.appendChild(sumariocnt);

        data.appendChild(dataAux);

        sumariocard.appendChild(data);
        document.getElementById("sumario").appendChild(sumariocard);
      });
    }
    if(texto!=false){
      document.getElementById("conteudo").appendChild(document.createTextNode("Introduza o sumário:"));
    }
    else{
      var div = document.createElement("div");
      div.setAttribute("class", "mb-3 mt-3");
      div.appendChild(document.createTextNode("Introduza um novo sumário:"));
      document.getElementById("sumario").appendChild(div);
    }
    var textarea = document.createElement("TEXTAREA");
        textarea.setAttribute("class", "w-100");
        if(sumario.sum == null){
          var conteudotextarea = document.createTextNode("");
        }
        else{
          var conteudotextarea = document.createTextNode(sumario.sum);
        }
        textarea.appendChild(conteudotextarea);
        
        var btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-primary w-100");
        var sp = document.createElement("i");
        sp.setAttribute("class", "icon text-white-50 fas fa-floppy-o");
        btn.appendChild(sp);
        var btntext = document.createTextNode(" Guardar");
        btn.appendChild(btntext);
        btn.onclick = function () {
          guardaconteudo(id,idExpndo,idDisc,textarea.value);
        };
        document.getElementById("sumario").appendChild(textarea);
        document.getElementById("sumario").appendChild(btn);
  });
  closeConnectionDataBase();
}

function guardaconteudo(id,idExpndo,idDisc,textarea) {
  var data = new Date();
  query = "INSERT INTO sumario (id_explicando, id_explicador, id_disciplina, sumario, data) VALUES ('"+idExpndo+"', '"+id+"', '"+idDisc+"', '"+textarea+"', CURDATE())";
  console.log(query);
  connectDataBase();
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      sessionStorage.setItem("idExplicando", idExpndo);
      sessionStorage.setItem("idDisciplina", idDisc);
      window.location.replace("../html/alunoSumario.html")
    }
  });
  closeConnectionDataBase();
}

function goBack() {
  var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if(page == 'alunos.html')
  {
    window.location.replace("../html/dashboard_explicador.html")
  }
  else
  {
    window.history.back();
  }
}