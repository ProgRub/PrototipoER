//INSERE NOTAS NA BD:
function tomarNotas(){
    connectDataBase();
    var id_explicandor = sessionStorage.getItem("idUser");
    var id_disciplina = sessionStorage.getItem("disciplina_id");
    var id_explicando = sessionStorage.getItem("aluno_id");
    var nota = document.getElementById("textbox").value;

    setTimeout(function(){
    query = "UPDATE explicando_tem_explicador SET notas = '"+nota+"' WHERE explicando_user_id = "+id_explicando+" AND explicador_user_id = "+id_explicandor+" AND disciplina_id = "+id_disciplina+";";
        connection.query(query, function (err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                console.log(query);
                alert("Nota inserida com Sucesso");
                window.location.replace("editarNotasEscolheDisciplina.html");

            }
         });
        closeConnectionDataBase();
    }, 2000);
}


//listar alunos do explicando  //ver algo que verifique em que pagina estou(funcao listar alunos e listar disciplina) com if para nao estar a repetir funcoes iguais muda só:a.href = "editarNotas.html";
function listarAlunosExplicando2(){
  var id_explicador = sessionStorage.getItem("idUser");
  query = "SELECT explicando_user_id, explicador_user_id FROM explicando_tem_explicador WHERE explicador_user_id= "+id_explicador+" AND disciplina_id = "+ sessionStorage.getItem("disciplina_id")+" ";
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
        a.setAttribute("class", "btn btn-primary bg-gradient-primary");
        a.href = "editarNotas.html";
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


//listar alunos do explicando
function listarAlunosExplicando(){
    var id_explicador = sessionStorage.getItem("idUser");
    query = "SELECT explicando_user_id, explicador_user_id FROM explicando_tem_explicador WHERE explicador_user_id= "+id_explicador+" AND disciplina_id = "+ sessionStorage.getItem("disciplina_id")+" ";
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
          a.setAttribute("class", "btn btn-primary bg-gradient-primary");
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

//listar alunos do disciplina  //ver algo que verifique em que pagina estou(funcao listar alunos e listar disciplina) com if para nao estar a repetir funcoes iguais muda só:a.href = "editarNotas.html";
function listarDisciplinas2(){
  var id = sessionStorage.getItem("idUser");
  query = "SELECT id, nome FROM disciplina WHERE explicador_user_id = '"+ id +"' ORDER BY id";
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
      a.href = "editarNotasEscolheAluno.html";
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

function listarDisciplinas(){
  var id = sessionStorage.getItem("idUser");
  query = "SELECT id, nome FROM disciplina WHERE explicador_user_id = '"+ id +"' ORDER BY id";
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



function listarEditarApagarNotas(){
  var idExplicador = sessionStorage.getItem("idUser");
  var idAluno = sessionStorage.getItem("aluno_id");
  var IdDisciplina = sessionStorage.getItem("disciplina_id");
  query = "SELECT * FROM explicando_tem_explicador WHERE explicador_user_id = "+idExplicador+" AND explicando_user_id ="+idAluno+" AND disciplina_id = "+IdDisciplina+"";
  console.log(query);
  connectDataBase();
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      //document.getElementById("testarNota").innerHTML = result[0].notas;
      console.log(result[0].notas)

      if(result[0].notas != null){
        
        var accordion = document.createElement("div");
        accordion.setAttribute("class","card-header alert-primary btn-link shadow");
        accordion.id = "10";

        var collapseName = document.createElement("button");
        collapseName.setAttribute("href", "#"+"ligacao");
        collapseName.setAttribute("class", "btn btn-link");
        collapseName.setAttribute("data-toggle","collapse");
        collapseName.setAttribute("data-target","#"+"ligacao");
        collapseName.setAttribute("aria-expanded","false");
        collapseName.setAttribute("aria-controls","ligacao");

        var data = document.createElement("h8");
        data.setAttribute("class", "text-secondary");
        data.setAttribute("style", "float:right");
        //data.innerHTML = "";

        console.log(collapseName);

        var nome = document.createElement("H6");
        nome.setAttribute("class","m-0 font-weight-bold text-dark");
        nome.innerHTML=result[0].notas;
        accordion.appendChild(data);
        collapseName.appendChild(nome);

        accordion.appendChild(collapseName);
        document.getElementById("listaNotas").appendChild(accordion);

        var formulario = document.createElement("div");
        formulario.setAttribute("class","collapse");
        formulario.setAttribute("aria-labelledby","10");
        formulario.setAttribute("data-parent","#accordioned");
        formulario.id ="ligacao";
        console.log(formulario);
        var formularioAux = document.createElement("div");
        formularioAux.setAttribute("class","card-body shadow");


        var p = document.createElement("p");
        p.innerHTML = "<b>Nova Nota:</b>"
        formularioAux.appendChild(p);

        var form = document.createElement("textarea");
        form.type="textarea";
        form.setAttribute("class","form-control");
        form.id = "novaNota"
        formularioAux.appendChild(form);
        var paragrafo = document.createElement("br");
        formularioAux.appendChild(paragrafo);


        var a = document.createElement("button");
        var link = document.createTextNode("Confirmar Edição");
        a.appendChild(link);
        a.title = "Confirmar";
        a.setAttribute("class", "btn btn-success");
        a.onclick = function() {
          query = "UPDATE explicando_tem_explicador SET notas='"+ document.getElementById("novaNota").value +"' WHERE explicador_user_id = "+idExplicador+" AND explicando_user_id ="+idAluno+" AND disciplina_id = "+IdDisciplina+"";
          console.log(query);
          connectDataBase();
          connection.query(query, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              window.location.replace("editarNotas.html");
            }
          });
        };

        formularioAux.appendChild(a);
        var apagar = document.createElement("a");
        apagar.setAttribute("class","btn btn-danger btn-xs");
        apagar.setAttribute("style","float: right");
        apagar.onclick = function(){
          var r = confirm("Deseja apagar a nota?");
          if (r == true) {
            query = "UPDATE explicando_tem_explicador SET notas = NULL WHERE explicador_user_id = "+idExplicador+" AND explicando_user_id ="+idAluno+" AND disciplina_id = "+IdDisciplina+""
            console.log(query);
            connectDataBase();
            connection.query(query, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                window.location.replace("editarNotasEscolheDisciplina.html");
              }
            });
          }
        };

        var auxApagar = document.createElement("i");
        auxApagar.setAttribute("class","fas fa-trash");
        
        apagar.appendChild(auxApagar);
        formularioAux.appendChild(apagar);
        formulario.appendChild(formularioAux);
        document.getElementById("listaNotas").appendChild(formulario);
      }
      else{
        var nome = document.createElement("li");
        nome.setAttribute("class","alert alert-danger");
        nome.innerHTML="<b>Não tem Notas.</b> Faça uma nova nota em <a href='tomarNotasEscolheDisciplina.html' class='alert-link'>aqui</a>.";
    
        document.getElementById("listaNotas").appendChild(nome);
      }
    }
    
  });
  closeConnectionDataBase();

}