//INSERE NOTAS NA BD:
function tomarNotas(nota){
    connectDataBase();
    var id_explicandor = sessionStorage.getItem("idUser");
    var id_disciplina = sessionStorage.getItem("disciplina_id");
    var id_explicando = sessionStorage.getItem("aluno_id");

    setTimeout(function(){
    query = "UPDATE explicando_tem_explicador SET notas = '"+nota+"' WHERE explicando_user_id = '"+id_explicando+"' AND explicador_user_id = '"+id_explicandor+"' AND disciplina_id = '"+id_disciplina+"';";
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
    let idsExplicandos = [];
    var id_explicador = sessionStorage.getItem("idUser");
    query = "SELECT explicando_user_id, explicador_user_id FROM explicando_tem_explicador WHERE explicador_user_id= '"+id_explicador+"'";
    console.log(query);
    connectDataBase();

    connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var select = document.createElement("select");
          select.setAttribute("class", "form-control");
          select.id = "alunoEscolhido";
          select.size = 5;
          
            result.forEach(explicando_tem_explicador => {
            //idsExplicandos.push(explicando_tem_explicador.explicando_user_id);
            query2 = "SELECT * FROM explicando WHERE user_id='"+ explicando_tem_explicador.explicando_user_id +"'";
            console.log(query2);
            connection.query(query2, function (err, result2) {
              if (err) {
                console.log(err);
                closeConnectionDataBase();
              } else {
                var opcao = document.createElement("option");
                opcao.value = result2[0].user_id;
                opcao.innerHTML = result2[0].nome;
                console.log(opcao);
                select.appendChild(opcao);
              }
            });
          });
          document.getElementById("escolherAluno").appendChild(select);

          paragrafo("escolherAluno");
          paragrafo("escolherAluno");
    
          var a = document.createElement("a");
          var link = document.createTextNode("Continuar");
          a.appendChild(link);
          a.title = "Continuar";
          a.setAttribute("class", "btn btn-primary");
          a.href = "tomarNotas.html";
          a.onclick = function() {
            var x = document.getElementById("alunoEscolhido").value;
            var y = select.options[select.selectedIndex].text;
            sessionStorage.setItem("aluno_id", x);
            sessionStorage.setItem("aluno_nome", y);
          };
          console.log(a);
          document.getElementById("escolherAluno").appendChild(a);
          closeConnectionDataBase();
        }
        
      });
    }

function paragrafo(elemento){
  var paragrafo = document.createElement("br");
      document.getElementById(elemento).appendChild(paragrafo);
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
      a.setAttribute("class", "btn btn-primary");
      a.href = "tomarNotasEscolheAluno.html";
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