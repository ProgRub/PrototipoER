function login() {
    connectDataBase();
    var username = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var query = "SELECT * FROM user WHERE username='" + username + "' and password='" + pass + "'";
    connection.query(query, function(err, result, fields) {

        if (err) {
            console.log("Erro na query.");
        }
        else{
            if (username == "") {
                return;
            } else if (pass == "") {
                return;
            } else if (result.length == 0) {
                alert("Os dados não estão corretos.")
                window.location.replace("./login.html")
            } else {
                sessionStorage.setItem("idUser", result[0].id);
                sessionStorage.setItem("username", result[0].username);
                sessionStorage.setItem("typeUser", result[0].user_type);
                window.location.replace("./dashboard_aluno.html")
                alert("Login efetuado.")
            }
        }
    });
    closeConnectionDataBase();
}

/*
function login(){
    window.location.replace("./dashboard_aluno.html")
}*/
