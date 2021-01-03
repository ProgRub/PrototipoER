//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
var microAcess; //acesso ao microfone
var rec; //objeto que guarda o ficheiro de audio
var input; //audio gravado

// especificações de audio
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//eventos ao clicar em cada um dos botões
recordButton.addEventListener("click", checkMicro);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

//ativamoso botao de gravar e desaativamos os botões para parar/pausar a gravação
recordButton.disabled = false;
stopButton.disabled = true;
pauseButton.disabled = true;

function checkMicro() {
  audioContext = new AudioContext();
  //verificamos se o micro já foi solicitado
  if (microAcess == 1) {
    startRecording(input);
    return;
  }
  //solicitamos ao utilizador a permissão de aceder ao seu microfone
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(function (stream) {
      //interface da caixa de audio
      input = audioContext.createMediaStreamSource(stream);
      microAcess = 0; //acesso ao microfone

      //iniciar gravação
      startRecording(input);
    })
    .catch(function (err) {
      /*
       * o catch é feito se:
       * - o utilizador negou o acesso ao micro
       * - o acesso ao micro falhou
       */

      //ativamoso botao de gravar e desaativamos os botões para parar/pausar a gravação
      recordButton.disabled = false;
      stopButton.disabled = true;
      pauseButton.disabled = true;
      console.log("Acesso ao microfone falhou.");
    });
}

function startRecording(input) {
  //garantir que não pede mais acesso ao microfone
  microAcess = 1;

  //desativamos o botao de gravar e ativamos os botões para parar/pausar a gravação
  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false;

  //objeto que guardo o audio
  rec = new Recorder(input, { numChannels: 1 });
  //iniciar a gravação
  rec.record();
  console.log("Gravação a decorrer...");
}

function pauseRecording() {
  if (rec.recording) {
    //pausar gravação do ficheiro de audio
    rec.stop();
    pauseButton.innerHTML = "Retomar";
    console.log("Gravação pausada.");
  } else {
    //retomar gravação do ficheiro de audio
    rec.record();
    pauseButton.innerHTML = "Pausar";
    console.log("Gravação retomada.");
  }
}

function stopRecording() {
  //desativamos o botao de parar gravação e ativamos os botões para iniciar/pausar a gravação
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;

  //parar a gravação de audio
  rec.stop();

  console.log(rec);
  document.getElementById("teste").style.display = "initial";

  console.log("Gravação finalizada.");
}
var base64data;
var url;

function adicionarAudioLista(blob) {
  var reader = new FileReader();
  url = URL.createObjectURL(blob);
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    base64data = reader.result;
    base64data = base64data.replace("data:audio/mpeg;base64,", "");
    insertAudioDB(base64data, url);
  };
}

function insertAudioDB(base64data, url) {
  console.log(base64data);
  iniciarConexaoDB();
  var isGroupFile = sessionStorage.getItem("FicheiroGrupo");

  if (isGroupFile == "true") {
    var query =
      "INSERT INTO audios (audio, start_line, disciplinaFiles_id, groupFiles_id) VALUES ('" +
      base64data +
      "'," +
      sessionStorage.getItem("nrLinha") +
      ", NULL, '" +
      sessionStorage.getItem("idFicheiro") +
      "');";
  } else {
    var query =
      "INSERT INTO audios (audio, start_line, disciplinaFiles_id, groupFiles_id) VALUES ('" +
      base64data +
      "'," +
      sessionStorage.getItem("nrLinha") +
      "," +
      sessionStorage.getItem("idFicheiro") +
      ", NULL);";
  }
  setTimeout(function () {
    console.log(query);
    connection.query(query, function (err, result, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log("Inseriu um audio com sucesso.");
      }
    });
    fecharConexaoDB();
  }, 1000);

  var au = document.createElement("audio"); //elemento para produzir o audio
  var li = document.createElement("div"); //elemento para listar os audios
  var tagTexto = document.createElement("p");
  //controlos de audio -> aumentar o volume, play
  au.controls = true;
  au.src = url;

  //adicionar o ficheiro a lista
  tagTexto.innerHTML =
    "Comentário relativo à linha: " + sessionStorage.getItem("nrLinha");
  li.appendChild(tagTexto);
  li.appendChild(au);
  li.className = "text-center";
  recordingsList.appendChild(li);
}
