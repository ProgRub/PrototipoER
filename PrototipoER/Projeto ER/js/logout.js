function logout() {
    sessionStorage.setItem("idUser", "");
    window.location.replace("../html/login.html");
  }