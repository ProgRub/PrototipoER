let mysql = require("mysql");
let connection;

function connectDataBase() {
    connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'er' //nome da base de dados
    });
    connection.connect(function (err) {
        if (err) {
            console.log(err)
            console.log(err.code);
            console.log(err.fatal);

        } else {
            //console.log("Conexão efetuada")
        }

    })
}

function closeConnectionDataBase() {
    connection.end(function () {
        //console.log('Conexão concluida.');
    });
}