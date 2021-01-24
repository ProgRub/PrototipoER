function tomarNotas(nota){
    
    connectDataBase();
    var id_explicandor = sessionStorage.getItem("idUser");
    var id_disciplina = sessionStorage.getItem("disciplina_id");
    //var id_explicando = sessionStorage.getItem("idExplicando");

    setTimeout(function(){
    query = "UPDATE explicando_tem_explicador SET notas = '"+nota+"' WHERE explicando_user_id = '4' AND explicador_user_id = '"+id_explicandor+"' AND disciplina_id = '"+id_disciplina+"';";
        connection.query(query, function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log(query);
                alert("Nota inserida com Sucesso");
            }
         });
        closeConnectionDataBase();
    }, 2000);
}

//listar alunos do explicando
function listarAlunosExplicando(){

    var id_explicandor = sessionStorage.getItem("idUser");
    query = "SELECT explicando_user_id, explicador_user_id FROM explicando_tem_explicador WHERE explicador_user_id= '"+id_explicandor+"'";
    console.log(query);
    connectDataBase();

    connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
            result.forEach(explicando_tem_explicador => {
                console.log(explicando_tem_explicador);
                var opcao = document.createElement("option");
                opcao.value = explicando_tem_explicador.explicando_user_id;
                select.appendChild(opcao);
            });



        }
      });



      closeConnectionDataBase();
}



//LISTA DISCIPLINAS DO ALUNO:
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

  function paragrafo(elemento){
    var paragrafo = document.createElement("br");
        document.getElementById(elemento).appendChild(paragrafo);
  }