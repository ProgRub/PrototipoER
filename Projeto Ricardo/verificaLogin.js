if (sessionStorage.getItem("idUser") === "") {
  window.location.replace("./login.html");
}

function logout() {
  sessionStorage.setItem("idUser", "");
  window.location.replace("./login.html");
}
