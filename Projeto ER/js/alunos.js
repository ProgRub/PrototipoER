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
        if (disciplinas != false) {
          document.getElementById("conteudo").appendChild(document.createTextNode("Selecione a disciplina da qual deseja ver a lista de aluno:"));
        }
        disciplinas = false;
        console.log(disciplina);
        //CARD:
        var disci = document.createElement("div");
        disci.value = disciplina.id;
        disci.setAttribute("class", "wd-100 mb-1");

        //NOME DISCIPLINA:
        var nome = document.createElement("button");
        nome.setAttribute("class", "card border-left-info shadow h-100 py-0 w-100");
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body w-100");
        var nomeAux2 = document.createElement("div");
        nomeAux2.setAttribute("class", "text-x font-weight-bold text-danger text-uppercase mb-1");
        nomeAux2.innerHTML = disciplina.disciplinaNome;
        nomeAux.appendChild(nomeAux2);


        nome.onclick = function () {
          sessionStorage.setItem("idDisciplina", disciplina.disciplinaId);
          window.location.assign("../html/alunosNomes.html")
        };
        nome.appendChild(nomeAux);

        disci.appendChild(nome);
        document.getElementById("disciplinasExplicador").appendChild(disci);
      });
      if (disciplinas != false) {
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
        if (alunos != false) {
          document.getElementById("conteudo").appendChild(document.createTextNode("Selecione o aluno:"));
        }
        alunos = false;
        //CARD:
        var explic = document.createElement("div");
        explic.value = explicando.user_id;
        explic.setAttribute("class", "wd-100 mb-1");

        //NOME ALUNO:
        var nome = document.createElement("button");
        nome.setAttribute("class", "card border-left-info shadow h-100 py-0 w-100");
        var nomeAux = document.createElement("div");
        nomeAux.setAttribute("class", "card-body w-100");
        var nomeAux2 = document.createElement("div");
        nomeAux2.setAttribute("class", "text-x font-weight-bold text-danger text-uppercase mb-1");
        nomeAux2.innerHTML = explicando.nomeExplicando;
        nomeAux.appendChild(nomeAux2);

        nome.onclick = function () {
          var edita = "false";
          var idSumario = null;
          var aux;
          sessionStorage.setItem("idExplicando", explicando.idExplicando);
          sessionStorage.setItem("idDisciplina", idDisc);
          sessionStorage.setItem("edita", edita);
          sessionStorage.setItem("idSumario", idSumario);
          verificaData(aux);
        };
        nome.appendChild(nomeAux);

        explic.appendChild(nome);
        document.getElementById("listaAlunos").appendChild(explic);
      });
      if (alunos != false) {
        document.getElementById("conteudo").appendChild(document.createTextNode("Não existe alunos inscritos nesta disciplina."));
      }
    }
  });
  closeConnectionDataBase();
}

  function verificaQuery() {
    query = "SELECT id, data, sumario FROM sumario";
    console.log(query);
    connectDataBase();
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var x = result.length;
        console.log(x);
        sessionStorage.setItem("resultado", x);
      }
    });
    closeConnectionDataBase();
  }

function escrevaSumario() {
  var resultado = sessionStorage.getItem("resultado");
  console.log(resultado);
  if(resultado > 0){
    var id = sessionStorage.getItem("idUser");
    var idDisc = sessionStorage.getItem("idDisciplina");
    var idExpndo = sessionStorage.getItem("idExplicando");
    var edita = sessionStorage.getItem("edita");
    var sumText = sessionStorage.getItem("sumText");
    var texto = sessionStorage.getItem("texto");
    var idSumario = sessionStorage.getItem("idSumario");
    var idSumarioaux = sessionStorage.getItem("idSumarioaux");
  }
  else{
    var id = sessionStorage.getItem("idUser");
    var idDisc = sessionStorage.getItem("idDisciplina");
    var idExpndo = sessionStorage.getItem("idExplicando");
    var idSumarioaux = null;
    var edita = "false";
    var sumText = null;
    var texto = "false";
    var idSumario = null;
  }
  console.log(idSumario);
  console.log(idSumarioaux);
  console.log(edita);
  console.log(sumText);
  console.log(texto);
    query = "SELECT sumario.id, sumario.sumario as sum, sumario.data as data FROM sumario WHERE sumario.id_explicando = '" + idExpndo + "' AND sumario.id_explicador = '" + id + "' AND sumario.id_disciplina = '" + idDisc + "'";
    console.log(query);
    connectDataBase();
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        if(resultado > 0){
          var subtitulo = document.createElement("p");
          subtitulo.innerHTML = "Clique num sumário para <b>editá-lo</b>."
          document.getElementById("conteudo").appendChild(subtitulo);
          document.getElementById("conteudo").appendChild(document.createTextNode("Sumários:"));
        }
        result.forEach((sumario) => {
          console.log(sumario);
          sumario.data = sumario.data.toISOString().split("T")[0]
          //CARD:
          var sumariocard = document.createElement("div");
          sumariocard.value = sumario.id;
          sumariocard.setAttribute("class", "wd-100 mb-2");

          //DATA:
          if (edita == "true" && sumario.id == idSumario) {
            var data = document.createElement("div");
            data.setAttribute("class", "card shadow border-left-primary h-100 py-2 w-100");
            data.style.backgroundColor = "lightblue";
          }

          else if (edita == "true" && sumario.id == idSumarioaux) {
            var data = document.createElement("div");
            data.setAttribute("class", "card shadow border-left-danger h-100 py-2 w-100");
            data.style.backgroundColor = "pink";
          }
          else if (edita == "true") {
            var data = document.createElement("button");
            data.setAttribute("class", "card shadow border-left-danger h-100 py-2 w-100");
            
            data.onclick = function () {
              edita = "true";
              sessionStorage.setItem("idExplicando", idExpndo);
              sessionStorage.setItem("idDisciplina", idDisc);
              sessionStorage.setItem("edita", edita);
              sessionStorage.setItem("sumText", sumario.sum);
              sessionStorage.setItem("idSumarioaux", idSumario);
              sessionStorage.setItem("idSumario", sumario.id);
              window.location.assign("../html/alunoSumario.html")
            };
          }
          else {
            var data = document.createElement("button");
            data.setAttribute("class", "card shadow border-left-danger h-100 py-2 w-100");

            data.onclick = function () {
              edita = "true";
              sessionStorage.setItem("idExplicando", idExpndo);
              sessionStorage.setItem("idDisciplina", idDisc);
              sessionStorage.setItem("edita", edita);
              sessionStorage.setItem("sumText", sumario.sum);
              sessionStorage.setItem("idSumario", sumario.id);
              window.location.assign("../html/alunoSumario.html")
            };
          }
          var dataAux = document.createElement("div");
          dataAux.setAttribute("class", "card-body w-100");
          var dataAux2 = document.createElement("div");
          dataAux2.setAttribute("class", "text-x font-weight-bold text-danger mb-1");
          dataAux2.setAttribute("align", "justify");
          dataAux2.style.fontSize = "large";
          dataAux2.innerHTML = sumario.data;
          dataAux.appendChild(dataAux2);

          //SUMARIO:
          var sumariocnt = document.createElement("div");
          sumariocnt.setAttribute("class", "h9 mb-0 font-weight");
          sumariocnt.setAttribute("align", "justify");
          sumariocnt.innerHTML = sumario.sum;
          console.log(sumario.sum);

          if (edita == "false" || (edita == "true" && (sumario.id != idSumario && sumario.id != idSumarioaux))) {
            var span = document.createElement("span")
            var btn2 = document.createElement("button");
            btn2.setAttribute("class", "btn btn-danger bg-gradient-danger w-100 mb-2");
            var sp2 = document.createElement("i");
            sp2.setAttribute("class", "icon text-white-50 fa fa-trash");
            btn2.appendChild(sp2);
            var btntext2 = document.createTextNode(" Eliminar");
            btn2.appendChild(btntext2);

            btn2.onclick = function () {
              eliminaSumario(sumario.id);
            };
            span.appendChild(btn2);
          }

          dataAux.appendChild(sumariocnt);

          data.appendChild(dataAux);

          sumariocard.appendChild(data);
          if (edita == "false" || (edita == "true" && (sumario.id != idSumario && sumario.id != idSumarioaux))) {
            sumariocard.appendChild(span);
          }
          document.getElementById("sumario").appendChild(sumariocard);
        });
      }
      if (resultado <= 0) {
        document.getElementById("conteudo").appendChild(document.createTextNode("Introduza um novo sumário:"));
      }
      else {
        var div = document.createElement("div");
        div.setAttribute("class", "mb-3 mt-3");
        div.appendChild(document.createTextNode("Introduza um novo sumário:"));
        document.getElementById("sumario").appendChild(div);
      }
      var textarea = document.createElement("TEXTAREA");
      textarea.setAttribute("class", "w-100");
      console.log(edita);
      if (edita == "false") {
        var conteudotextarea = document.createTextNode("");
      }
      else {
        var conteudotextarea = document.createTextNode(sumText);
      }
      textarea.appendChild(conteudotextarea);
      var btn = document.createElement("button");
      btn.setAttribute("class", "btn btn-primary bg-gradient-primary w-100");
      var sp = document.createElement("i");
      sp.setAttribute("class", "icon text-white-50 fas fa-floppy-o");
      btn.appendChild(sp);
      var btntext = document.createTextNode(" Guardar");
      btn.appendChild(btntext);
      btn.onclick = function () {
        if (edita == "true") {
          texto="true";
          sessionStorage.setItem("edita", edita);
          sessionStorage.setItem("texto", texto);
          guardaconteudo(id, idExpndo, idDisc, textarea.value, idSumario);
        }
        else {
          texto="true";
          sessionStorage.setItem("edita", edita);
          sessionStorage.setItem("texto", texto);
          guardaconteudo(id, idExpndo, idDisc, textarea.value);
        }
      };
      document.getElementById("sumario").appendChild(textarea);
      document.getElementById("sumario").appendChild(btn);
    });
    closeConnectionDataBase();



}

  function guardaconteudo(id, idExpndo, idDisc, textarea, idSumario) {
    var edita = sessionStorage.getItem("edita");
    if (edita == "true") {
      query = "UPDATE sumario SET sumario = '" + textarea + "' WHERE id = '" + idSumario + "'"
      connectDataBase();
      connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          texto = "true";
          sessionStorage.setItem("idExplicando", idExpndo);
          sessionStorage.setItem("idDisciplina", idDisc);
          sessionStorage.setItem("texto", texto);
          verificaData();
        }
      });
      closeConnectionDataBase();
    }
    else {
      query = "INSERT INTO sumario (id_explicando, id_explicador, id_disciplina, sumario, data) VALUES ('" + idExpndo + "', '" + id + "', '" + idDisc + "', '" + textarea + "', CURDATE())";
      
    connectDataBase();
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        texto = "true";
        sessionStorage.setItem("idExplicando", idExpndo);
        sessionStorage.setItem("idDisciplina", idDisc);
        sessionStorage.setItem("texto", texto);
        verificaData();
      }
    });
    closeConnectionDataBase();
    }
  }



function eliminaSumario(idSumario) {
  query = "DELETE FROM sumario WHERE id = '" + idSumario + "'"
  console.log(query);
  connectDataBase();
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      verificaData();
    }
  });
  closeConnectionDataBase();
}

function goBack() {
  var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if (page == 'alunos.html') {
    window.location.replace("../html/dashboard_explicador.html")
  }
  else {
    window.history.back();
  }
}

function actiondw(){
  console.log(data);
}

function verificaData() {
  query = "SELECT id, data, sumario FROM sumario ORDER BY id DESC LIMIT 1";
  console.log(query);
  connectDataBase();
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
        result.forEach((sumario) => {
          var data = new Date();
          console.log(query);
          console.log(data);
          if (isDateInThisWeek(data, sumario.data)) {
            verificaQuery();
            var edita = "true";
            var idSumario = sumario.id;
            sessionStorage.setItem("edita", edita);
            sessionStorage.setItem("idSumario", idSumario);
            sessionStorage.setItem("sumText", sumario.sumario);
            window.location.replace("../html/alunoSumario.html")
          }
          else{
            window.location.replace("../html/alunoSumario.html")
          }
      });
    }
  });
  closeConnectionDataBase();
}

function verificaData(aux) {
  query = "SELECT id, data, sumario FROM sumario ORDER BY id DESC LIMIT 1";
  
  connectDataBase();
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if(result.length > 0){
          result.forEach((sumario) => {
          var data = new Date();
          if (isDateInThisWeek(data, sumario.data)) {
            verificaQuery();
            var edita = "true";
            var idSumario = sumario.id;
            sessionStorage.setItem("edita", edita);
            sessionStorage.setItem("idSumario", idSumario);
            sessionStorage.setItem("sumText", sumario.sumario);
            window.location.assign("../html/alunoSumario.html")
          }
          else{
            var idSumario = null;
            var idSumarioaux = null;
            sumario.sumario = "";
            sessionStorage.setItem("idSumario", idSumario);
            sessionStorage.setItem("idSumarioaux", idSumarioaux);
            sessionStorage.setItem("sumText", sumario.sumario);
            window.location.assign("../html/alunoSumario.html")
          }
          });
      }else{
        verificaQuery();
         window.location.assign("../html/alunoSumario.html")
      }
       
      
    }
  });
  closeConnectionDataBase();
}

function isDateInThisWeek(date, ultimadata) {
  const todayObj = ultimadata;
  const todayDate = todayObj.getDate();
  const todayDay = todayObj.getDay();
  // get first date of week
  const firstDayOfWeek = new Date(todayObj.setDate(todayDate - todayDay));

  // get last date of week
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
  // if date is equal or within the first and last dates of the week
  return date >= firstDayOfWeek && date <= lastDayOfWeek;
}
