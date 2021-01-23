document.getElementById("username").addEventListener("keyup", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      login();
    }
});

document.getElementById("password").addEventListener("keyup", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      login();
    }
});

function login() {
    connectDataBase();
    var username = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    var query = "SELECT * FROM user WHERE username='" + username + "' and password='" + pass + "'";
    connection.query(query, function(err, result, fields) {
    
        if (err) {
            console.log(err);
        }
        else{
            if (result.length == 0) {
                $("#dadosIncorretos").fadeTo(2000, 500).slideUp(500, function(){
                    $("#dadosIncorretos").slideUp(500);
                });
            } else {
                sessionStorage.setItem("idUser", result[0].id);
                sessionStorage.setItem("username", result[0].username);
                sessionStorage.setItem("typeUser", result[0].user_type);
                
                $("#dadosCorretos").fadeTo(2000, 500).slideUp(500, function(){
                    $("#dadosCorretos").slideUp(500);
                });
                setTimeout(function () {
                    //window.location.replace("../html/dashboard_"+result[0].user_type+".html")
                    window.location.replace("../html/editarFicheiros.html")
                }, 3000);
            }
        }
    });
    closeConnectionDataBase();
}
