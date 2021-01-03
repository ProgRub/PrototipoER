const mysql = require("mysql");
let conection;
let ficheirosAudio;

function iniciarConexaoDB() {
  connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "er",
    port: "3306",
  });
  connection.connect(function (err) {
    if (err) {
      document.getElementById("erro").innerHTML =
        "Erro na conexao à base de dados.";
      console.log(err.code);
      console.log(err.fatal);
    }
  });
}

function fecharConexaoDB() {
  //Fechar coneção DB
  connection.end(function () {});
}

function login() {
  iniciarConexaoDB();
  var username = document.getElementById("username").value;
  var pass = document.getElementById("pass").value;
  var query =
    "SELECT * FROM accounts WHERE username='" +
    username +
    "' and password='" +
    pass +
    "'";
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
    }
    console.log(result);
    if (result.length == 0) {
      document.getElementById("erro").innerHTML =
        "Os dados não estão corretos.";
    } else {
      sessionStorage.setItem("idUser", result[0].id);
      sessionStorage.setItem("typeUser", result[0].type);
      window.location.replace("./index.html");
    }
  });
  fecharConexaoDB();
}

function obterAudiosFicheiro() {
  iniciarConexaoDB();
  var isGroupFile = sessionStorage.getItem("FicheiroGrupo");
  var idFile = sessionStorage.getItem("idFicheiro");
  if (isGroupFile == "true") {
    var query =
      "SELECT audio, start_line FROM audios where groupFiles_id = '" +
      idFile +
      "';";
  } else {
    var query =
      "SELECT audio, start_line FROM audios where disciplinaFiles_id = '" +
      idFile +
      "';";
  }
  //console.log(query)
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
    } else {
      result.forEach((FicheiroAudio) => {
        var li = document.createElement("div");
        li.className = "text-center";
        let tagTexto = document.createElement("p");
        tagTexto.innerHTML =
          "Comentário relativo à linha: " + FicheiroAudio.start_line;
        li.appendChild(tagTexto);
        let tagAudio = document.createElement("audio");
        tagAudio.controls = true;
        li.appendChild(tagAudio);
        let audioDB = document.createElement("source");
        audioDB.setAttribute(
          "src",
          "data:audio/mpeg;base64," + FicheiroAudio.audio + ""
        );
        tagAudio.appendChild(audioDB);
        tagAudio.load();
        document.getElementById("recordingsList").appendChild(li);
      });
    }
  });
  fecharConexaoDB();
}

function copiarFicheiroCaixaTexto() {
  iniciarConexaoDB();
  var isGroupFile = sessionStorage.getItem("FicheiroGrupo"); //true -> ficheiro grupo *** false -> ficheiro disciplina
  var idFile = sessionStorage.getItem("idFicheiro");
  if (isGroupFile == "true") {
    var query = "SELECT conteudo FROM groupfiles WHERE id='" + idFile + "'";
  } else {
    var query =
      "SELECT conteudo FROM disciplinafiles WHERE id='" + idFile + "'";
  }
  console.log(query);
  connection.query(query, function (err, result, fields) {
    console.log(result);
    if (err) {
      console.log("Erro na query.");
    } else {
      editor.setValue(result[0].conteudo);
    }
  });
  fecharConexaoDB();
}

function redirectAvaliarFicheiro(id) {
  sessionStorage.setItem("idFile", id);
  window.location.replace("./FicheiroAvaliar.html");
}

function obterFicheiroAvaliação() {
  iniciarConexaoDB();
  var idFile = sessionStorage.getItem("idFile");
  idFile = "1";
  var query = "SELECT conteudo FROM files where id = '" + idFile + "'";
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
    } else {
      editor.setValue(result[0].conteudo);
    }
  });
  fecharConexaoDB();
}

function updateNota() {
  var fileId = sessionStorage.getItem("idFicheiro");
  var nota = document.getElementById("validationCustom05").value;
  iniciarConexaoDB();
  var query =
    "UPDATE disciplinafiles SET nota='" +
    nota +
    "', estado='Resolvido' WHERE id='" +
    fileId +
    "'";
  console.log(query);
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
    } else {
      alert("Nota atribuída com sucesso.");
    }
  });
  fecharConexaoDB();
}

function gravarConteudoTextoDB() {
  iniciarConexaoDB();
  conteudoFicheiro = editor.getValue();
  var isGroupFile = sessionStorage.getItem("FicheiroGrupo"); //true -> ficheiro grupo *** false -> ficheiro disciplina
  var idFile = sessionStorage.getItem("idFicheiro");
  if (isGroupFile == "true") {
    var query =
      "UPDATE groupfiles SET conteudo = " +
      JSON.stringify(conteudoFicheiro) +
      "WHERE id = '" +
      idFile +
      "'";
  } else {
    var query =
      "UPDATE disciplinafiles SET conteudo = " +
      JSON.stringify(conteudoFicheiro) +
      "WHERE id ='" +
      idFile +
      "'";
  }
  console.log(query);
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
    } else {
    }
  });
  fecharConexaoDB();
}

function mostraEnunciado(idAvaliacao) {
  //Inicia a conexao
  iniciarConexaoDB();

  //Query para obter as avaliações que o utilizador tem acesso
  var query =
    "SELECT enunciado, name from avaliacao where avaliacao.id = " + idAvaliacao;

  //Obter ficheiro de avaliação
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      var binary = atob(result[0].enunciado);
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i);
      }
      // Criação do ficheiro blob do enunciado PDF
      var enunciadoAvaliacao = new Blob([view], {
        type: "application/pdf",
      });
      // Criação do download link do ficheiro
      var downloadLink = URL.createObjectURL(enunciadoAvaliacao);
      // Criação do nome do ficheiro com base na informação da DB
      var nomeFicheiro = result[0].name + ".pdf";
      // Criação de elemento 'a' para fazer o download
      var ficheiroDownload = document.createElement("a");
      // Atribuir link de download
      ficheiroDownload.href = downloadLink;
      // Atribuir nome ficheiro
      ficheiroDownload.download = nomeFicheiro;
      // Efetuar click para chamar o download
      ficheiroDownload.click();
    }
  });
}

function carregaDisciplinas() {
  //Inicia a conexao
  iniciarConexaoDB();

  //Obtem o id do user
  iduser = sessionStorage.getItem("idUser");

  //Query para obter todos os ficheiros do user
  var query =
    "SELECT disciplina.name as 'disciplinaNome', disciplina.id as 'disciplinaId' from disciplina, disciplina_has_accounts where disciplina_has_accounts.accounts_id = '" +
    iduser +
    "' and disciplina_has_accounts.disciplina_id = disciplina.id";

  //Faz a conexao
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      //para cada tuplo
      result.forEach((res) => {
        //Cria a div de fora
        let divDisciplina = document.createElement("div");
        divDisciplina.setAttribute("class", "w3-panel w3-card");

        divDisciplina.onclick = function () {
          sessionStorage.setItem("idDisciplina", res.disciplinaId);
          sessionStorage.setItem("nomeDisciplina", res.disciplinaNome);
          window.location.replace("./ficheirosDisciplina.html");
        };

        //Cria a imagem
        let imagem = document.createElement("img");
        imagem.setAttribute("src", "images/UC.png");
        imagem.setAttribute("alt", "Avatar");
        imagem.setAttribute("style", "width: 125px;");
        imagem.className = "m-3";

        //Cria a informação do ficheiro
        let pDisciplina = document.createElement("h5");
        pDisciplina.className = "float-right mt-5";
        pDisciplina.innerHTML = res.disciplinaNome;

        divDisciplina.appendChild(imagem);
        divDisciplina.appendChild(pDisciplina);
        document
          .getElementById("containerFicheiros")
          .appendChild(divDisciplina);
      });
    }
  });
  fecharConexaoDB();
}

function carregaFicheiroDisciplina() {
  //Inicia a conexao
  iniciarConexaoDB();

  //Obtem o id do user
  iduser = sessionStorage.getItem("idUser");
  idDisciplina = sessionStorage.getItem("idDisciplina");
  nomeDisciplina = sessionStorage.getItem("nomeDisciplina");

  var titulo = document.createElement("div");
  titulo.className = "float-left";
  var botao = document.createElement("div");
  botao.setAttribute("style", "padding-left: 94%;display:block;width:20px");
  botao.innerHTML =
    '<a onclick="irPaginaCarregarVideoAulas()" style="padding-left: 94%;"><img src="https://img.icons8.com/cute-clipart/64/000000/add-property.png"></a>';
  titulo.innerHTML =
    '<h2 class="mb-4"> Video Aulas de ' + nomeDisciplina + "</h2>";
  document.getElementById("titulosVideoAulas").appendChild(titulo);

  userType = sessionStorage.getItem("typeUser");
  console.log(userType);
  if (userType !== "aluno") {
    document.getElementById("titulosVideoAulas").appendChild(botao);
  }

  //Query para obter todos os ficheiros da disciplina
  var query =
    "SELECT disciplinafiles.tipo as 'tipo', disciplinafiles.programming_language as 'linguagemProgramacao', disciplinafiles.name as'nomeFicheiro', disciplinafiles.id as 'id' from disciplinafiles, disciplina, disciplina_has_accounts where disciplina_has_accounts.accounts_id = '" +
    iduser +
    "' and disciplina.id = disciplina_has_accounts.disciplina_id and disciplinafiles.disciplina_id = disciplina.id and disciplinafiles.tipo = 'video-aula' and disciplina.id = " +
    idDisciplina +
    ";";

  //Faz a conexao
  connection.query(query, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(query);
      //para cada tuplo
      result.forEach((ficheiro) => {
        //Cria a div de fora
        let divFicheiro = document.createElement("div");
        divFicheiro.setAttribute("class", "w3-panel w3-card");

        divFicheiro.onclick = function () {
          sessionStorage.setItem("idFicheiro", ficheiro.id);
          sessionStorage.setItem("fileType", ficheiro.tipo);
          sessionStorage.setItem(
            "programmingLanguage",
            ficheiro.linguagemProgramacao
          );
          sessionStorage.setItem("FicheiroGrupo", false);
          window.location.replace("./gravarAudio.html");
        };

        //Cria a imagem
        let imagem = document.createElement("img");
        imagem.setAttribute("src", escolherIcon(ficheiro.linguagemProgramacao));
        imagem.setAttribute("alt", "Avatar");
        imagem.setAttribute("style", "width: 125px;");
        imagem.className = "m-3";

        //Cria a informação do ficheiro
        let pFicheiro = document.createElement("h5");
        pFicheiro.className = "float-right mt-5";
        pFicheiro.innerHTML = "Nome: " + ficheiro.nomeFicheiro;

        divFicheiro.appendChild(imagem);
        divFicheiro.appendChild(pFicheiro);
        document
          .getElementById("containerFicheirosDisciplina")
          .appendChild(divFicheiro);
      });
    }
  });
  fecharConexaoDB();
}

function mudaFicheiro(id, tipo, linguagem) {
  sessionStorage.setItem("FicheiroGrupo", false);
  sessionStorage.setItem("idFicheiro", id);
  sessionStorage.setItem("fileType", tipo);
  sessionStorage.setItem("programmingLanguage", linguagem);
  window.location.replace("./gravarAudio.html");
}

function carregaFicheiroGrupo() {
  //Inicia a conexao
  iniciarConexaoDB();

  //Obtem o id do user
  iduser = sessionStorage.getItem("idUser");
  idGrupo = sessionStorage.getItem("idGrupo");
  nomeGrupo = sessionStorage.getItem("nomeGrupo");

  //Query para obter todos os ficheiros do user
  var query =
    "SELECT groupfiles.name as 'nome', groupfiles.id as 'id', groupfiles.programming_language as 'linguagemProgramacao', groups.name as 'grupo'FROM  groups, accounts_has_groups, groupfiles where '" +
    iduser +
    "'  = accounts_has_groups.accounts_id and accounts_has_groups.groups_id=groups.id and groupfiles.groups_id = groups.id and groups.id = " +
    idGrupo +
    ";";
  let botaoCriar = document.createElement("div");
  botaoCriar.setAttribute(
    "style",
    "padding-left: 94%;display:block;width:20px"
  );
  botaoCriar.innerHTML =
    '<a onclick="irPaginaAdicionarFicheirosGrupo()" style="padding-left: 94%;"><img src="https://img.icons8.com/cute-clipart/64/000000/add-property.png"></a>';
  document.getElementById("containerFicheirosGrupo").innerHTML =
    '<h2 class="mb-4" style="position: absolute;"> Ficheiros ' +
    nomeGrupo +
    "</h2>";
  document.getElementById("containerFicheirosGrupo").appendChild(botaoCriar);
  //Faz a conexao
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      //para cada tuplo
      result.forEach((ficheiro) => {
        //Cria a div de fora
        let divFicheiro = document.createElement("div");
        divFicheiro.setAttribute("class", "w3-panel w3-card");

        divFicheiro.onclick = function () {
          sessionStorage.setItem("idFicheiro", ficheiro.id);
          sessionStorage.setItem("FicheiroGrupo", true);
          sessionStorage.setItem(
            "programmingLanguage",
            ficheiro.linguagemProgramacao
          );
          window.location.replace("./gravarAudio.html");
        };

        //Cria a imagem
        let imagem = document.createElement("img");
        imagem.setAttribute("src", escolherIcon(ficheiro.linguagemProgramacao));
        imagem.setAttribute("alt", "Avatar");
        imagem.setAttribute("style", "width: 125px;");
        imagem.className = "m-3";

        //Cria a informação do ficheiro
        let pFicheiro = document.createElement("h5");
        pFicheiro.innerHTML =
          "Nome do ficheiro: " +
          ficheiro.nome +
          "<br>Linguagem: " +
          ficheiro.linguagemProgramacao;
        pFicheiro.className = "float-right mt-5";

        divFicheiro.appendChild(imagem);
        divFicheiro.appendChild(pFicheiro);
        document
          .getElementById("containerFicheirosGrupo")
          .appendChild(divFicheiro);
      });
    }
  });
  fecharConexaoDB();
}

function carregaGrupos() {
  //Inicia a conexao
  iniciarConexaoDB();

  //Obtem o id do user
  iduser = sessionStorage.getItem("idUser");

  //Query para obter todos os grupos do user
  var query =
    "SELECT groups.name as 'grupo', groups.id as 'id' FROM accounts, groups, accounts_has_groups where accounts.id = '" +
    iduser +
    "' and accounts.id = accounts_has_groups.accounts_id and accounts_has_groups.groups_id=groups.id ";

  //Faz a conexao
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      //para cada tuplo
      result.forEach((ficheiro) => {
        //Cria a div de fora
        let divFicheiro = document.createElement("div");
        divFicheiro.setAttribute("class", "w3-panel w3-card");
        divFicheiro.onclick = function () {
          sessionStorage.setItem("idGrupo", ficheiro.id);
          sessionStorage.setItem("nomeGrupo", ficheiro.grupo);
          window.location.replace("./ficheirosGrupo.html");
        };
        //Cria a imagem
        let imagem = document.createElement("img");
        imagem.setAttribute("src", "images/default-group.png");
        imagem.setAttribute("alt", "Avatar");
        imagem.setAttribute("style", "width: 125px;");
        imagem.className = "m-3";

        //Cria a informação do ficheiro
        let pFicheiro = document.createElement("h3");
        pFicheiro.className = "float-right mt-5";
        pFicheiro.innerHTML = "\n Nome: " + ficheiro.grupo;

        divFicheiro.appendChild(imagem);
        divFicheiro.appendChild(pFicheiro);
        document.getElementById("containerGrupos").appendChild(divFicheiro);
      });
    }
  });
  fecharConexaoDB();
}

var auxNomeAvaliacao;

function tabelasAvaliacoes() {
  //Obtem o tipo de utilizador
  typeUser = sessionStorage.getItem("typeUser");
  idUser = sessionStorage.getItem("idUser");

  //Obtem as partes da tabela avaliaçoes
  var tHead = document.getElementById("tabelaThead");
  var tBody = document.getElementById("tabelaBody");

  //Obtem as partes da tabela duvidas
  var tHeadDuvidas = document.getElementById("tabelaTheadDuvidas");
  var tBodyDuvidas = document.getElementById("tabelaBodyDuvidas");

  if (typeUser == "aluno") {
    //Coloca o head da tabela
    tHead.innerHTML =
      '<tr><th scope="col">Nome da disicplina</th> <th scope="col">Nome da avaliação</th><th scope="col">Enunciado</th><th scope="col">Data de fim de submissão</th> <th scope="col">Estado</th><th scope="col">Avaliação</th></tr>';
    tHeadDuvidas.innerHTML =
      '<tr><th scope="col">Nome da disicplina</th><th scope="col">Ficheiro Inserido</th><th scope="col">Data de Inserção</th><th scope="col">Estado</th></tr>';

    //Query para obter todas as avaliações do user
    var query =
      "Select disciplina.name as 'nomeDisciplina', avaliacao.name as 'nomeAvaliacao', avaliacao.id as 'avaliacaoId', DATE_FORMAT(avaliacao.data_fim, '%d/%m/%Y %H:%i:%s')  as 'dataFim', avaliacao.enunciado as 'enunciado' from disciplina, avaliacao, disciplina_has_accounts where disciplina_has_accounts.accounts_id ='" +
      idUser +
      "' and disciplina_has_accounts.disciplina_id = disciplina.id and avaliacao.disciplina_id = disciplina.id";

    iniciarConexaoDB();
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        for (i in result) {
          //Insere no tbody
          tBody.innerHTML =
            tBody.innerHTML +
            "<tr><td>" +
            result[i].nomeDisciplina +
            "</td> <td>" +
            result[i].nomeAvaliacao +
            "</td><td><button type='button' class='btn btn-link' onclick='mostraEnunciado(" +
            result[i].avaliacaoId +
            ")'>Enunciado</button></td><td>" +
            result[i].dataFim +
            "</td><td id='estado" +
            result[i].avaliacaoId +
            "'><button type='button' class='btn btn-danger'>Submeter</button>" +
            "</td>" +
            "<td id='avaliacao" +
            result[i].avaliacaoId +
            "'>Não atribuida" +
            "</td></tr>";
        }
      }
    });
    fecharConexaoDB();

    setTimeout(() => {
      //Verifica os ficheiros submetidos
      query =
        "Select disciplinafiles.programming_language as 'linguagem', disciplinafiles.tipo as 'tipo', disciplinafiles.avaliacao_id as 'avaliacaoId', disciplinafiles.id as 'idFicheiro', disciplinafiles.name as 'nomeficheiro', disciplinafiles.nota as 'avaliacao',disciplinafiles.estado as 'estadoFicheiro',  disciplina.name as 'nomeDisciplina', DATE_FORMAT(disciplinafiles.dataInsercao, '%d/%m/%Y %H:%i:%s')   as 'data' from disciplinafiles,  disciplina where disciplinafiles.accounts_id = '" +
        idUser +
        "' and disciplinafiles.disciplina_id = disciplina.id";

      iniciarConexaoDB();
      connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          for (i in result) {
            //Caso o ficheiro nao seja uma avaliacao sera uma duvida e tera que aparecer na tabela
            if (result[i].avaliacaoId == null) {
              var auxEstadoFicheiro;
              if (result[i].estadoFicheiro == "Pendente") {
                auxEstadoFicheiro =
                  '<button type="button" class="btn btn-warning">Aguarda pelo docente</button>';
              } else {
                auxEstadoFicheiro =
                  '<button type="button" class="btn btn-success">Docente enviou resposta</button>';
              }
              tBodyDuvidas.innerHTML =
                tBodyDuvidas.innerHTML +
                "<tr><td >" +
                result[i].nomeDisciplina +
                "</td><td><div class='btn btn-primary' onclick='mudaFicheiro(" +
                result[i].idFicheiro +
                ", `" +
                result[i].tipo.toString() +
                "`,`" +
                result[i].linguagem +
                "`)'>" +
                result[i].nomeficheiro +
                "</td><td >" +
                result[i].data +
                "</td><td >" +
                auxEstadoFicheiro +
                "</td></tr>";

              //Caso seja uma avaliacao
            } else {
              if (result[i].avaliacao === null) {
                document.getElementById(
                  "avaliacao" + result[i].avaliacaoId
                ).innerHTML = "Não atribuida";
                document.getElementById(
                  "estado" + result[i].avaliacaoId
                ).innerHTML =
                  "<button type='button' class='btn btn-success'>Enviado</button>";
              } else {
                document.getElementById(
                  "avaliacao" + result[i].avaliacaoId
                ).innerHTML = result[i].avaliacao;
                document.getElementById(
                  "estado" + result[i].avaliacaoId
                ).innerHTML =
                  "<button type='button' class='btn btn-success'>Corrigido</button>";
              }
            }
          }
        }
      });
      fecharConexaoDB();
    }, 50);

    document.getElementById("btnAdicionarDuvida").style.display = "block";
  } else {
    //Coloca o head da tabela
    tHead.innerHTML =
      '<tr><th scope="col">Nome da Disciplina</th> <th scope="col">Nome da Avaliação</th><th scope="col">Carregado por:</th><th scope="col">Ficheiro</th>  <th scope="col">Data de submissão</th> <th scope="col">Estado</th> <th scope="col">Nota</th></tr>';
    tHeadDuvidas.innerHTML =
      '<tr><th scope="col">Disciplina</th><th scope="col">Nome do Aluno</th> <th scope="col">Ficheiro</th><th scope="col">Data de inserção</th>  <th scope="col">Estado</th><th scope="col"></th></tr>';

    //Query para obter todas as avaliaçoes
    var query =
      "Select disciplina.name as 'nomeDisciplina', avaliacao.name as 'nomeAvaliacao', avaliacao.id as 'avaliacaoId' from disciplina, avaliacao, disciplina_has_accounts where disciplina_has_accounts.accounts_id ='" +
      idUser +
      "' and disciplina_has_accounts.disciplina_id = disciplina.id and avaliacao.disciplina_id = disciplina.id";

    iniciarConexaoDB();
    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        sessionStorage.setItem("novaDisciplina", true);
        sessionStorage.setItem("auxNomeDisciplina", "");
        for (i in result) {
          if (
            sessionStorage.getItem("auxNomeDisciplina") !=
            result[i].nomeDisciplina
          ) {
            sessionStorage.setItem(
              "auxNomeDisciplina",
              result[i].nomeDisciplina
            );
            sessionStorage.setItem("novaDisciplina", true);
          } else {
            sessionStorage.setItem("novaDisciplina", false);
          }

          auxNomeAvaliacao = result[i].nomeAvaliacao;

          iniciarConexaoDB();

          //Query para obter todas as avaliaçoes
          var query2 =
            "Select disciplinafiles.programming_language as 'linguagem', disciplinafiles.tipo as 'tipo', disciplinafiles.id as 'id', disciplinafiles.name as 'nomeFicheiro', accounts.username as 'nomeUser', DATE_FORMAT(disciplinafiles.dataInsercao, '%d/%m/%Y %H:%i:%s')  as 'data', disciplinafiles.estado as 'estado', disciplinafiles.nota as 'nota'  from disciplinafiles, accounts where disciplinafiles.avaliacao_id = '" +
            result[i].avaliacaoId +
            "' and disciplinafiles.accounts_id = accounts.id";

          connection.query(query2, function (err, result2) {
            if (err) {
              console.log(err);
            } else {
              for (i in result2) {
                var auxEstado;
                if (result2[i].estado == "Pendente") {
                  auxEstado =
                    '<button type="button" class="btn btn-warning">Por Corrigir</button>';
                } else {
                  auxEstado =
                    '<button type="button" class="btn btn-success">Corrigido</button>';
                }
                var auxNota;
                if (result2[i].nota == null) {
                  auxNota = "Não avaliado";
                } else {
                  auxNota = result2[i].nota;
                }
                tBody.innerHTML =
                  tBody.innerHTML +
                  "<tr><td >" +
                  sessionStorage.getItem("auxNomeDisciplina") +
                  "</td><td id='NomeAv" +
                  result2[i].id +
                  "'  >" +
                  auxNomeAvaliacao +
                  "</td><td >" +
                  result2[i].nomeUser +
                  "</td><td><div class='btn btn-primary' onclick='mudaFicheiro(" +
                  result2[i].id +
                  ", `" +
                  result2[i].tipo.toString() +
                  "`,`" +
                  result2[i].linguagem +
                  "`)'>" +
                  result2[i].nomeFicheiro +
                  "</td><td >" +
                  result2[i].data +
                  "</td><td >" +
                  auxEstado +
                  "</td><td >" +
                  auxNota +
                  "</td></tr>";
              }
            }
          });
          fecharConexaoDB();
        }
      }
    });
    fecharConexaoDB();

    query =
      "SELECT disciplina.id as 'disciplinaId' from disciplina, disciplina_has_accounts where disciplina_has_accounts.accounts_id = " +
      idUser +
      " and disciplina.id = disciplina_has_accounts.disciplina_id";

    iniciarConexaoDB();

    connection.query(query, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        for (i in result) {
          iniciarConexaoDB();
          var query4 =
            "Select disciplinafiles.programming_language as 'linguagem', disciplinafiles.tipo as 'tipo', disciplinafiles.estado as 'estado', disciplinafiles.id as 'id', disciplinafiles.name as 'nomeFicheiro', accounts.username as 'nome',disciplinafiles.disciplina_id as 'idDisciplina', DATE_FORMAT(disciplinafiles.dataInsercao, '%d/%m/%Y %H:%i:%s') as 'dataInsercao', disciplina.name as 'nomeDisciplina' from disciplinafiles, disciplina, accounts where disciplinafiles.disciplina_id = " +
            result[i].disciplinaId +
            " and disciplina.id = " +
            result[i].disciplinaId +
            " and disciplinafiles.avaliacao_id is null and accounts.id = disciplinafiles.accounts_id and disciplinafiles.tipo = 'duvida'";

          connection.query(query4, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              for (i in result) {
                var auxEstado;
                if (result[i].estado == "Pendente") {
                  auxEstado =
                    '<button type="button" class="btn btn-warning">Por resolver</button>';
                } else {
                  auxEstado =
                    '<button type="button" class="btn btn-success">Resolvido</button>';
                }
                tBodyDuvidas.innerHTML =
                  tBodyDuvidas.innerHTML +
                  "<tr><td>" +
                  result[i].nomeDisciplina +
                  "</td><td>" +
                  result[i].nome +
                  "</td><td><div class='btn btn-primary' onclick='mudaFicheiro(" +
                  result[i].id +
                  ", `" +
                  result[i].tipo +
                  "`,`" +
                  result[i].linguagem +
                  "`)'>" +
                  result[i].nomeFicheiro +
                  "</td><td>" +
                  result[i].dataInsercao +
                  "</td><td>" +
                  auxEstado +
                  "</td></tr>";
              }
            }
          });
          fecharConexaoDB();
        }
      }
    });
    fecharConexaoDB();

    setTimeout(function () {
      iniciarConexaoDB();
      query =
        "select disciplinafiles.id as 'id', avaliacao.name as 'nome' from disciplinafiles, avaliacao where disciplinafiles.avaliacao_id = avaliacao.id";
      connection.query(query, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          for (i in result) {
            if (document.getElementById("NomeAv" + result[i].id) != undefined) {
              document.getElementById("NomeAv" + result[i].id).innerHTML =
                result[i].nome;
            }
          }
        }
      });
      fecharConexaoDB();
    }, 500);

    document.getElementById("btnAdicionarAvaliacao").style.display = "block";
  }
}

//Falta alterar (variavel de sessao a dizer se é um ficheiro de grupo ou da disciplina)
function carregarPaginaGravarAudio() {
  changeAdaptLanguageEditor(sessionStorage.getItem("programmingLanguage"));
  copiarFicheiroCaixaTexto();
  obterAudiosFicheiro();
  showVideoAulas();
}

function criaGrupo() {
  iniciarConexaoDB();
  var gravaGrupoBtn = document.getElementById("gravaGrupo");

  var nomeInput = document.getElementById("nameInput");

  nomeGrupo = nomeInput.value;

  userType = sessionStorage.getItem("typeUser");
  userID = sessionStorage.getItem("idUser");

  var queryGrupos = "SELECT * FROM groups WHERE name = '" + nomeGrupo + "'";

  connection.query(queryGrupos, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
    }
    console.log(result);
    if (result.length == 0 && nomeGrupo != "") {
      gravaGrupoBtn.style.display = "block";
      nomeInput.disabled = "disabled";
      fecharConexaoDB();

      var divTabela = document.getElementById("divTabelaContas");

      var tabelaAcc =
        "<table id='tabelaAcc' class='table' style='margin-top: 4%;'> <tr> <td class='text-center'><b> Utilizador </b></td> <td class='text-center'><b> Tipo </b></td> <td class='text-center'><b> Adicionar </b></td> </tr>";

      iniciarConexaoDB();

      var queryAcc = "SELECT * FROM accounts WHERE id != " + userID + "";

      var gravaBtn = document.getElementById("gravaGrupo");

      connection.query(queryAcc, function (err2, result2, fields2) {
        if (err2) {
          console.log("Erro na query.");
          console.log(err2);
        } else {
          result2.forEach((ficheiro) => {
            tabelaAcc +=
              "<tr> <td class='text-center'>" +
              ficheiro.username +
              "</td> <td class='text-center'>" +
              ficheiro.type +
              "</td> <td class='text-center'> <input type='checkbox' id=" +
              ficheiro.username +
              " name=" +
              ficheiro.username +
              " value=" +
              ficheiro.id +
              "> </td> </tr>";
          });
          tabelaAcc += "</table>";
          divTabela.innerHTML = tabelaAcc;
        }
        fecharConexaoDB();
      });
    } else {
      if (nomeGrupo == "") {
        alert("Não pode introduzir um nome sem carateres.");
      } else {
        alert("Nome introduzido já utilizado.");
      }
    }
  });
}

var convidados = new Array();

function gravaGrupo() {
  var tableAux = document.getElementById("tabelaAcc");
  var inpts = tableAux.getElementsByTagName("INPUT");

  var nomeInput = document.getElementById("nameInput");
  nomeGrupo = nomeInput.value;
  userID = sessionStorage.getItem("idUser");

  convidados.push(userID);
  for (var i = 0; i < inpts.length; i++) {
    if (inpts[i].checked) {
      convidados.push(inpts[i].value);
    }
  }
  iniciarConexaoDB();
  var insertGroup =
    "INSERT INTO groups (id, name) VALUES(NULL, '" + nomeGrupo + "')";
  connection.query(insertGroup, function (err, result, fields) {
    if (err) {
      console.log("Erro na query.");
      console.log(err);
    } else if (result) {
      fecharConexaoDB();
      var selectGroup =
        "SELECT id from groups WHERE name = '" + nomeGrupo + "'";
      iniciarConexaoDB();
      connection.query(selectGroup, function (err2, result2, fields2) {
        if (err2) {
          console.log("Erro na query.");
          console.log(err2);
        }
        var idInserir = result2[0].id;
        convidados.forEach((idd) => {
          fecharConexaoDB();
          console.log(idd);
          var insertQuery =
            "INSERT INTO accounts_has_groups (accounts_id, groups_id) VALUES(" +
            idd +
            ", " +
            idInserir +
            ")";
          iniciarConexaoDB();
          connection.query(insertQuery, function (err3, result3, fields3) {
            if (err3) {
              console.log("Erro na query.");
              console.log(err3);
            } else if (result3) {
              fecharConexaoDB();
            }
          });
        });
        alert("Grupo criado com sucesso!");
        window.location.replace("./grupos.html");
      });
    }
  });
}

function adicionarDuvida() {
  window.location.replace("./adicionarDuvidaAvaliacao.html");
}

function adicionarAvaliacao() {
  if (sessionStorage.getItem("typeUser") === "regente") {
    window.location.replace("./adicionarDuvidaAvaliacao.html");
  } else {
    alert("Apenas um regente pode adicionar um enunciado de avaliação");
  }
}

function mostrarConteudoCorreto() {
  if (sessionStorage.getItem("typeUser") === "regente") {
    document.getElementById("enunciadoAvaliacao").style.display = "block";
    var selectAdicionar = "opcoesDisciplinaRegente";
  } else {
    document.getElementById("duvidaAluno").style.display = "block";
    var selectAdicionar = "opcoesDisciplinaAluno";
  }

  iniciarConexaoDB();
  var query =
    "SELECT disciplina.name as 'name', disciplina.id as 'id' FROM disciplina, disciplina_has_accounts WHERE disciplina_has_accounts.accounts_id ='" +
    sessionStorage.getItem("idUser") +
    "' and disciplina.id = disciplina_has_accounts.disciplina_id";
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      result.forEach((disciplina) => {
        var opcao = document.createElement("option");
        opcao.value = disciplina.id;
        opcao.innerHTML = disciplina.name;
        document.getElementById(selectAdicionar).appendChild(opcao);
      });
    }
  });
  fecharConexaoDB();
}

function enviarEnunciado() {
  iniciarConexaoDB();
  var base64data;
  var idDisciplina = document.getElementById("opcoesDisciplinaRegente").value;
  var dataFinalSubmissao = document.getElementById("dataFinal").value;
  var ficheiro = document.getElementById("enunciado").files[0];
  var nomeAvaliacao = document.getElementById("nomeAvaliacao").value;
  var reader = new FileReader();
  reader.readAsDataURL(ficheiro);
  reader.onloadend = function () {
    base64data = reader.result;
    base64data = base64data.replace("data:application/pdf;base64,", "");
    console.log(base64data);
  };

  setTimeout(function () {
    query =
      "INSERT INTO avaliacao (name, data_fim, enunciado, disciplina_id) VALUES ('" +
      nomeAvaliacao +
      "','" +
      dataFinalSubmissao +
      "', '" +
      base64data +
      "', " +
      idDisciplina +
      ");";
    console.log(query);
    console.log(ficheiro);
    connection.query(query, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        alert("Ficheiro partilhado com sucesso.");
        setTimeout(window.location.replace("Avaliacao.html"), 5000);
      }
    });
    fecharConexaoDB();
  }, 1000);
}

function enviarDuvida() {
  var idDisciplina = document.getElementById("opcoesDisciplinaAluno").value;
  let idInserido = readFile(idDisciplina, "ficheiroDuvidas", "duvida");
  sessionStorage.setItem("idFicheiro", idInserido);
  //window.location.replace('gravarAudio.html');
}

function enviarVideoAula() {
  let idInserido = readFile(
    sessionStorage.getItem("idDisciplina"),
    "ficheiroVideoAula",
    "video-aula"
  );
  sessionStorage.setItem("idFicheiro", idInserido);
  //window.location.replace('gravarAudio.html');
}

function irPaginaCarregarVideoAulas() {
  if (sessionStorage.getItem("typeUser") === "regente") {
    window.location.replace("./adicionarVideoAula.html");
  } else {
    alert("Não tens permissão para adicionar video-aulas.");
  }
}

function enviarFicheiroGrupo() {
  let idInserido = readFile(
    sessionStorage.getItem("idGrupo"),
    "ficheiroParaGrupo",
    "ficheiroGrupo"
  );
  sessionStorage.setItem("idFicheiro", idInserido);
}

function irPaginaAdicionarFicheirosGrupo() {
  window.location.replace("adicionarFicheiroGrupo.html");
}

function escolherIcon(linguagemProgramacao) {
  switch (linguagemProgramacao) {
    case "c":
      return "images/c.png";
      break;
    case "cpp":
      return "images/cpp.png";
      break;
    case "css":
      return "images/css.png";
      break;
    case "html":
      return "images/html.png";
      break;
    case "js":
      return "images/js.png";
      break;
    case "py":
      return "images/py.png";
      break;
    case "sql":
      return "images/sql.png";
      break;
    case "txt":
      return "images/txt.png";
      break;
    case "php":
      return "images/php.png";
      break;
    default:
      return "images/unknown-icon.png";
      break;
  }
}
