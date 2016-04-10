'use strict'

const app = require('app')
const BrowserWindow = require('browser-window')

app.once('ready', () => {
  const mainWindow = new BrowserWindow({
    title: 'Seals'
    , width: 800
    , height: 600
  })

  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadUrl('file://' + __dirname + '/static/hello.html')
  // mainWindow.openDevTools()
})

app.on('window-all-closed', () => {
  app.quit()
})
