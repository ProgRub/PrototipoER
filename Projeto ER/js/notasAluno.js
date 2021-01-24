const { format } = require("mysql");


//LISTA EXPLICADORES DO ALUNO:
function mostraExplicadoresAluno(){
  var id = sessionStorage.getItem("idUser");
  query = "SELECT * FROM explicando_tem_explicador WHERE explicando_user_id='"+id +"' GROUP BY explicador_user_id";
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
      closeConnectionDataBase();
    } else {
      var title = document.createElement("p");
      title.innerHTML="Selecione um <b>explicador</b>:";
      document.getElementById("explicadoresAluno").appendChild(title);
      result.forEach((explica) => {
        connectDataBase();
        query2 = "SELECT * FROM explicador WHERE user_id='"+ explica.explicador_user_id +"'";
        console.log(query2);
        connection.query(query2, function (err, result2) {
          if (err) {
            console.log(err);
            closeConnectionDataBase();
          } else {
            var explicadorAluno = document.createElement("button");
            var link = document.createTextNode(result2[0].nome);
            explicadorAluno.appendChild(link);
            explicadorAluno.setAttribute("class", "btn btn-link");
            explicadorAluno.onclick = function() {
              sessionStorage.setItem("explicador_id", result2[0].user_id);
              sessionStorage.setItem("explicador_nome", result2[0].nome);
              window.location.replace("../html/verNotas2.html");
            };
            console.log(explicadorAluno);
            document.getElementById("explicadoresAluno").appendChild(explicadorAluno);
            document.getElementById("explicadoresAluno").appendChild(document.createElement("br"));
            
          }
      });
      });
    }
  });
  closeConnectionDataBase();
}


//VER NOTAS DOS EXPLICADORES DO ALUNO:
function mostraNotasAluno(){
  var idExplicador = sessionStorage.getItem("explicador_id");
  var id = sessionStorage.getItem("idUser");
  query = "SELECT * FROM explicando_tem_explicador WHERE explicando_user_id='"+id +"' GROUP BY disciplina_id";
  console.log(query);
  connectDataBase();

  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
      closeConnectionDataBase();
    } else {
      var title = document.createElement("p");
      title.innerHTML="<b>Notas do Explicador</b>";
      document.getElementById("notasAluno").appendChild(title);

      result.forEach((nota) => {
        connectDataBase();
        query2 = "SELECT * FROM disciplina WHERE id='"+ nota.disciplina_id +"' AND explicador_user_id="+idExplicador;
        console.log(query2);
        connection.query(query2, function (err, result2) {
          if (err) {
            console.log(err);
            closeConnectionDataBase();
          } else {
            var title = document.createElement("li");
            title.innerHTML=sessionStorage.getItem(result2[0].notas);;
            document.getElementById("notasAluno").appendChild(title);

            var explicadorAluno = document.createElement("ul");
            var link = document.createTextNode(result2[0].nome);
            explicadorAluno.appendChild(link);
            explicadorAluno.setAttribute("class", "btn btn-link");
            explicadorAluno.onclick = function() {
              sessionStorage.setItem("explicador_id", result2[0].user_id);
              sessionStorage.setItem("explicador_nome", result2[0].nome);
              window.location.replace("verNotas2.html");
            };
            console.log(explicadorAluno);
            document.getElementById("notasAluno").appendChild(explicadorAluno);
            document.getElementById("notasAluno").appendChild(document.createElement("br"));
          }
        });

        
            
      });
    }
  });
  closeConnectionDataBase();
}

