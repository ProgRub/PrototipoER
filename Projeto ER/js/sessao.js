let form = document.getElementById("formSessao");
form.addEventListener("submit", function (event) {
  let prevenirSubmit = false;
  let inputData = document.getElementById("inputData");
  console.log(inputData.value);
  let inputTempoInicial = document.getElementById("inputTempoInicial");
  console.log(inputTempoInicial.value);
  let inputTempoFinal = document.getElementById("inputTempoFinal");
  console.log(inputTempoFinal.value);
  if (new Date(inputData.value) < new Date()) {
    console.log("Data passada!");
    prevenirSubmit = true;
  }
  let tempoInicial =
    parseInt(inputTempoInicial.value.split(":")[0], 10) * 60 +
    parseInt(inputTempoInicial.value.split(":")[1], 10);
  let tempoFinal =
    parseInt(inputTempoFinal.value.split(":")[0], 10) * 60 +
    parseInt(inputTempoFinal.value.split(":")[1], 10);
  if (tempoInicial > tempoFinal) {
    console.log("Tempo Final inferior ao Tempo Inicial!");
    prevenirSubmit = true;
  }
  //  console.log(sessionStorage.getItem("idUser"));
  connectDataBase();
  let query =
    "SELECT planoAcesso_id FROM explicando WHERE user_id=" +
    sessionStorage.getItem("idUser");
  var planoAcessoID = -1;
  connection.query(query, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      planoAcessoID = result[0].planoAcesso_id;
    console.log(planoAcessoID);
    if (planoAcessoID != -1) {
      query = "SELECT tipo FROM planoacesso WHERE id=" + planoAcessoID;
      // console.log(query);
      let diaHoje = new Date();
      let diaSelecionado = new Date(inputData.value);
      connection.query(query, function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          if (result[0].tipo == "mensal") {
            if (diaHoje.getMonth() != diaSelecionado.getMonth()) {
              console.log("Fim do plano mensal");
              prevenirSubmit = true;
            }
          } else if (result[0].tipo == "anual") {
            if (diaHoje.getFullYear() != diaSelecionado.getFullYear()) {
              console.log("Fim do plano anual");
              prevenirSubmit = true;
            }
          }
        }
      });
      closeConnectionDataBase();
    } else {
      prevenirSubmit = true;
    }
    }
  });
  if (prevenirSubmit || true) {
    event.preventDefault();
  }
});
