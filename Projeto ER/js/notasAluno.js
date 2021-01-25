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
      var i = 1;
      result.forEach((explica) => {
        connectDataBase();
        query2 = "SELECT * FROM explicador WHERE user_id='"+ explica.explicador_user_id +"'";
        console.log(query2);
        
        connection.query(query2, function (err, result2) {
          if (err) {
            console.log(err);
            closeConnectionDataBase();
          } else {
            var aux = document.createElement("li");
            var explicadorAluno = document.createElement("button");
            var link = document.createTextNode(result2[0].nome);
            explicadorAluno.appendChild(link);
            
            if(i%2 == 0){
              explicadorAluno.setAttribute("class", "btn w-100 m-1 py-3 shadow border-left-success text-success font-weight-bold ");
            }else{
              explicadorAluno.setAttribute("class", "btn w-100 m-1 py-3 shadow border-left-danger text-danger font-weight-bold ");
            }
            i++;

            explicadorAluno.onclick = function() {
              sessionStorage.setItem("explicador_id", result2[0].user_id);
              sessionStorage.setItem("explicador_nome", result2[0].nome);
              window.location.replace("../html/verNotas2.html");
            };
            console.log(explicadorAluno);
            //aux.appendChild(explicadorAluno);
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
  query = "SELECT * FROM explicando_tem_explicador WHERE explicando_user_id='"+id +"' AND explicador_user_id="+idExplicador+" GROUP BY disciplina_id";
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
        console.log(result);
        connectDataBase();
        query2 = "SELECT * FROM disciplina WHERE id='"+ nota.disciplina_id +"' AND explicador_user_id="+idExplicador;
        console.log(query2);
        connection.query(query2, function (err, result2) {
          if (err) {
            console.log(err);
            closeConnectionDataBase();
          } else {
            console.log(result2);

            var box = document.createElement("div");
            box.setAttribute("class","card shadow mb-0 ");

            var box2 = document.createElement("div");
            box2.setAttribute("class","card-header bg-gradient-success py-2");
            
            var text6 = document.createElement("h6");
            text6.setAttribute("class","m-0 font-weight-bold text-light");
            text6.innerHTML = result2[0].nome;

            var box3 = document.createElement("div");
            box3.setAttribute("class","card-body text-secondary font-weight");
            var mostraNota = document.createElement("p");
            if(nota.notas == null){
              mostraNota.innerHTML = "<b>Sem notas do explicador.</b>";
            }else{
              mostraNota.innerHTML = ""+nota.notas;
            }
            
            
            box2.appendChild(text6);
            box.appendChild(box2);
            box3.appendChild(mostraNota);
            box.appendChild(box3);
            document.getElementById("notasAluno").appendChild(box);
            document.getElementById("notasAluno").appendChild(document.createElement("br"));
          }
        }); 
      });
    }
  });
  closeConnectionDataBase();
}

