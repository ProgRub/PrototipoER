//LISTA DISCIPLINAS DO ALUNO:
function mostraDisciplinas(){
    var id = sessionStorage.getItem("idUser");
    query = "SELECT disciplina.id as disciplinaId, disciplina.nome as disciplinaNome, explicador.user_id as explicadorID, explicador.nome as explicadorNome FROM disciplina, explicador WHERE disciplina.explicador_user_id = explicador.user_id AND explicador.user_id = '"+ id +
    "'";
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
            explicador.innerHTML = "Explicador: "+disciplina.explicadorNome;
            console.log(disciplina.explicadorNome);

            nomeAux.appendChild(explicador);
  
          nome.onclick = function(){
            sessionStorage.setItem("idDisciplina", disciplina.disciplinaId);
            window.location.replace("../html/alunosNomes.html")
          };
          nome.appendChild(nomeAux);
  
          disci.appendChild(nome);
          document.getElementById("disciplinasExplicador").appendChild(disci);
          });
        }
      });
      closeConnectionDataBase();
  }

  //LISTA DISCIPLINAS DO ALUNO:
function mostraAlunos(){
    var id = sessionStorage.getItem("idUser");
    var idDisc = sessionStorage.getItem("idDisciplina");
    query = "SELECT explicando.user_id as idExplicando, explicando.nome as nomeExplicando FROM explicando, explicando_tem_explicador, explicador WHERE explicando.user_id = explicando_tem_explicador.explicando_user_id AND explicando_tem_explicador.explicador_user_id = explicador.user_id AND explicando_tem_explicador.explicador_user_id = '"+ id +"' AND explicando_tem_explicador.disciplina_id = '"+ idDisc +"'";
    console.log(query);
    connectDataBase();
  
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        result.forEach((explicando) => {
          console.log(explicando);
          //CARD:
          var explic = document.createElement("div");
          explic.value = explicando.user_id;
          explic.setAttribute("class", "col-xl-6 col-md-6 mb-2");
  
          //NOME ALUNO:
          var nome = document.createElement("button");
          nome.setAttribute("class", "card border-left-warning shadow h-100 py-2 w-100");
          var nomeAux = document.createElement("div");
          nomeAux.setAttribute("class", "card-body w-100");
          var nomeAux2 = document.createElement("div");
          nomeAux2.setAttribute("class", "text-x font-weight-bold text-danger text-uppercase mb-1");
          nomeAux2.innerHTML = explicando.nomeExplicando;
          nomeAux.appendChild(nomeAux2);

          nome.onclick = function(){
            sessionStorage.setItem("idExplicando", explicando.idExplicando);
            sessionStorage.setItem("idDisciplina", idDisc);
            window.location.replace("../html/alunoSumario.html")
          };
          nome.appendChild(nomeAux);
  
          explic.appendChild(nome);
          document.getElementById("listaAlunos").appendChild(explic);
          });
        }
      });
      closeConnectionDataBase();
  }

    function escrevaSumario(){
    var id = sessionStorage.getItem("idUser");
    var idDisc = sessionStorage.getItem("idDisciplina");
    var idExpndo = sessionStorage.getItem("idExplicando");
    var sumario = document.getElementById("textbox").value;
    query = "UPDATE explicando_tem_explicador SET sumario = '"+sumario+"' WHERE explicando_tem_explicador.explicando_user_id = '"+idExpndo+"' AND explicando_tem_explicador.explicador_user_id = '"+id+"' AND explicando_tem_explicador.disciplina_id = '"+idDisc+"'";
    console.log(query);
    connectDataBase();
    connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
            window.location.replace("../html/dashboard_explicador.html")
        }
    });
    closeConnectionDataBase();
  }