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
            if (result.length == 0) {
                $("#dadosIncorretos").fadeTo(2000, 500).slideUp(500, function(){
                    $("#dadosIncorretos").slideUp(500);
                });
                
                setTimeout(function () {
                    window.location.replace("../html/login.html")
                }, 3000);
                
            } else {
                sessionStorage.setItem("idUser", result[0].id);
                sessionStorage.setItem("username", result[0].username);
                sessionStorage.setItem("typeUser", result[0].user_type);
                
                $("#dadosCorretos").fadeTo(2000, 500).slideUp(500, function(){
                    $("#dadosCorretos").slideUp(500);
                });
                setTimeout(function () {
                    window.location.replace("../html/dashboard_"+result[0].user_type+".html")
                }, 3000);
            }
        }
    });
    closeConnectionDataBase();
}
