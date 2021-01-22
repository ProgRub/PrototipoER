
  function ficheiro(){
    var ficheiro = document.getElementById("recursoExtra").value;
    var nomeFicheiro = ficheiro.split("C:\\fakepath\\")[1];
    var base64data;
    var reader = new FileReader();
    reader.readAsDataURL(ficheiro);
    reader.onloadend = function () {
      base64data = reader.result;
      base64data = base64data.replace("data:application/pdf;base64,", "");
      console.log(base64data);
    };

    connectDataBase();
    var id = sessionStorage.getItem("idUser");
    console.log(id);
    query = "INSERT INTO ficheiro (id, nome, explicador_user_id) VALUES ("+ null +", '" + nomeFicheiro + "','" + id + "');";
      connection.query(query, function (err, result, fields) {
        if (err) {
          console.log(err);
        } else {
          alert("Ficheiro partilhado com sucesso.");
        }
      });
      
      closeConnectionDataBase();

  }