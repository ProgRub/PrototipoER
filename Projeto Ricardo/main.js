// Modulos de control da app
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  //instancia da janela
  const mainWindow = new BrowserWindow({
    minWidth: 875,
    width: 1920,
    height: 1080,
    icon: "projeto/Login/images/icons/favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenuBarVisibility(false);

  //carregar o ficheiro html
  mainWindow.loadFile("./Projeto/Login.html");

  // abrir DevTools.
  //mainWindow.webContents.openDevTools();
}

//quando a app carrega, a janela é criada
app.whenReady().then(createWindow);

//Quandoa app é fechada,a janela fecha.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// quando a app é ativada obtemos a janela
app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
