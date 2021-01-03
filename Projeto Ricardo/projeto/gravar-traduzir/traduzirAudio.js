var noteContent = '';

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.lang = "PT"
} catch (e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}



// Get all notes from previous sessions and display them.
var notes = getAllNotes();



/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far. 
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        textarea.value = noteContent;
    }
};


/*-----------------------------
      App buttons and input 
------------------------------*/
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var textarea = document.getElementById("textarea");

recordButton.addEventListener("click", sta);
stopButton.addEventListener("click", sto);
pauseButton.addEventListener("click", pau);
textarea.addEventListener("input", i);


function sta() {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
}

function sto() {
    recognition.stop();
    if (!noteContent.length) {
        console.log("Tradução não detetada")
    }
}

function pau() {
    recognition.stop();
}


// Sync the text inside the text area with the noteContent variable.
function i() {
    noteContent = this.value;
}


/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if (key.substring(0, 5) == 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: localStorage.getItem(localStorage.key(i))
            });
        }
    }
    return notes;
}
var commentI;
var commentE;

function insertComment() {
    //insere comentario
    var selectionRange = editor.getSelectionRange();
    var startLine = selectionRange.start.row;
    changeAdaptCommentEditor(sessionStorage.getItem("programmingLanguage"));
    if (noteContent == "") {
        alert("Nenhum comentário para adicionar...")
        return;
    }
    editor.session.insert({ row: startLine, column: 0 }, commentI + noteContent + commentE + "\n");
    sessionStorage.setItem('nrLinha', startLine + 1);
    textarea.value = "";
    gravarConteudoTextoDB();

    //mudança de estado quando o professor atende uma duvida
    var userType = sessionStorage.getItem("typeUser");
    var fileType = sessionStorage.getItem("fileType");
    var fileId = sessionStorage.getItem("idFicheiro");
    if (userType != "aluno" && fileType == "duvida") {
        iniciarConexaoDB();
        var query = "UPDATE disciplinafiles SET estado='Resolvido' WHERE id='" + fileId + "'";
        console.log(query);
        connection.query(query, function(err, result, fields) {
            if (err) {
                console.log("Erro na query.");
            }
        });
        fecharConexaoDB();
    }

    rec.exportWAV(adicionarAudioLista, 'audio/mpeg');
    noteContent = "";
}



function changeAdaptCommentEditor(programmingLanguage) {
    switch (programmingLanguage) {
        case "html":
            commentI = "<!--";
            commentE = "-->";
            break;
        case "py":
            commentI = '"""';
            commentE = '"""';
            break;
        case "txt":
            commentI = "@";
            commentE = "@";
            break;
        default:
            commentI = "/*";
            commentE = "*/";
            break;
    }
    console.log("Detetou: " + programmingLanguage);
}