const electron = require('electron')
require('electron-reload')('..');
const { app, BrowserWindow } = electron

let win

app.on('ready', () => {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  win = new BrowserWindow({width, height, icon: "images/Icon.png",webPreferences: {
    nodeIntegration: true}})
    win.loadFile('html/login.html') //quando inicia o programa
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})