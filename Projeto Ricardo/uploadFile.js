function readFile(idLocal, idDiv, tipo) {
    var file_name = "";
    var content = "";
    var programming_language;
    var file = document.getElementById(idDiv).files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8")
        file_name = file.name.split('.')[0];;
        programming_language = file.name.split('.')[1];
        reader.onload = function(ficheiro) {
            content = ficheiro.target.result;
            sessionStorage.setItem("fileType", tipo);
            uploadFile(file_name, content, programming_language, idLocal, tipo);
        }
        reader.onerror = function(ficheiro) {
            content = "error reading file";
            alert(content)
            return;
        }
    }
}

function uploadFile(file_name, content, programming_language, idLocal, tipo) {
    let ficheiroInserido;
    console.log(tipo)
    if (tipo == 'duvida') {
        console.log("Nome do ficheiro: " + file_name);
        console.log("Conteudo: " + content);
        console.log("Linguagem de programação: " + programming_language);
        console.log(idLocal)
        iniciarConexaoDB();
        query = "INSERT INTO disciplinafiles (name, conteudo, programming_language, estado, tipo, accounts_id, disciplina_id, avaliacao_id, dataInsercao) VALUES ('" + file_name + "'," + JSON.stringify(content) + ", '" + programming_language + "', 'Pendente', 'duvida', " + sessionStorage.getItem('idUser') + ", " + idLocal + ", NULL, CURRENT_TIMESTAMP());";
        console.log(query);
        connection.query(query, function(err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                ficheiroInserido = result.insertID;
                alert("Ficheiro de dúvida carregado, por favor dirija-se à secção de dúvidas de forma a acrescentar os comentários de voz/texto.");
            }
        });
        fecharConexaoDB();
        setTimeout(window.location.replace('Avaliacao.html'), 1000);
    } else if (tipo == 'video-aula') {

        iniciarConexaoDB();
        query = "INSERT INTO disciplinafiles (name, conteudo, programming_language, estado, tipo, accounts_id, disciplina_id) VALUES ('" + file_name + "'," + JSON.stringify(content) + ", '" + programming_language + "', NULL, 'video-aula', " + sessionStorage.getItem('idUser') + ", " + idLocal + ");";
        console.log(query);
        connection.query(query, function(err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                ficheiroInserido = result.insertID;
                alert("Ficheiro da video-aula carregado, por favor dirija-se à secção de video-aulas de forma a acrescentar os comentários de voz/texto.");
            }
        });
        fecharConexaoDB();
        setTimeout(window.location.replace('ficheirosDisciplina.html'), 1000);
    } else if (tipo == 'ficheiroGrupo'){
        iniciarConexaoDB();
        query = "INSERT INTO groupfiles (name, conteudo, programming_language, groups_id) VALUES ('" + file_name + "'," + JSON.stringify(content) + ", '" + programming_language + "', " + idLocal + ");";
        console.log(query);
        connection.query(query, function(err, result, fields) {
            if (err) {
                console.log(err);
            } else {
                ficheiroInserido = result.insertID;
                alert("Ficheiro de grupo carregado, por favor dirija-se à secção de ficheiros de grupo de forma a acrescentar os comentários de voz/texto.");
            }
        });
        fecharConexaoDB();
        setTimeout(window.location.replace('ficheirosGrupo.html'), 1000);
    } else {
        console.log("outro")
    }
    return ficheiroInserido;
}