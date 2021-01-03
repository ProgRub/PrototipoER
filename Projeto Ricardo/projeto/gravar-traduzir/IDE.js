var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai"); //theme

function showVideoAulas() {
    var userType = sessionStorage.getItem("typeUser");
    var fileType = sessionStorage.getItem("fileType");
    var isFileGroup = sessionStorage.getItem("FicheiroGrupo");
    if (isFileGroup == "true") {
        fileType = "ficheiro de grupo";
    } else if ((userType == "aluno" || userType == 'auxiliar') && fileType == "video-aula") {
        editor.setReadOnly(true);
        document.getElementById("btn-group-record").style.display = "none";
    } else if (userType != "aluno" && fileType == "avaliacao") {
        document.getElementById("formularioDocente").style.display = "block";
        //document.getElementById("btnFormDocente").style.display = "inline-block";
    } else {
        return;
    }
    console.log(userType);
    console.log(fileType);
}

function changeAdaptLanguageEditor(programmingLanguage) {
    switch (programmingLanguage) {
        case "c":
            editor.getSession().setMode("ace/mode/c_cpp");
            break;
        case "cpp":
            editor.getSession().setMode("ace/mode/c_cpp");
            break;
        case "css":
            editor.getSession().setMode("ace/mode/css");
            break;
        case "html":
            editor.getSession().setMode("ace/mode/html");
            break;
        case "js":
            editor.getSession().setMode("ace/mode/javascript");
            break;
        case "py":
            editor.getSession().setMode("ace/mode/python");
            break;
        case "sql":
            editor.getSession().setMode("ace/mode/sql");
            break;
        case "txt":
            editor.getSession().setMode("ace/mode/text");
            break;
        case "php":
            editor.getSession().setMode("ace/mode/php");
            break;
        default:
            editor.getSession().setMode("ace/mode/javascript");
            break;
    }
    console.log("Detetou: " + programmingLanguage);
}