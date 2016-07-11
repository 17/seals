'use strict'

const { app, BrowserWindow } = require('electron')

app.once('ready', () => {
  const mainWindow = new BrowserWindow({
    title: 'Seals'
    , width: 800
    , height: 600
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(`file://${__dirname}/static/hello.html`)
  // mainWindow.openDevTools()
})

app.on('window-all-closed', () => {
  app.quit()
})
