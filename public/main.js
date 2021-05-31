const { app, BrowserWindow, autoUpdater, dialog, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const api = require('./lib/db').api

const server = 'https://hazel-27923t225-mancioshell.vercel.app'
const url = `${server}/update/${process.platform}/${app.getVersion()}`

// Conditionally include the dev tools installer to load React Dev Tools
let installExtension, REACT_DEVELOPER_TOOLS

if (isDev) {
  const devTools = require('electron-devtools-installer')
  installExtension = devTools.default
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit()
}

function createAutoUpdater() {
  autoUpdater.setFeedURL({ url })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Riavvia', 'Ricordamelo più tardi'],
      title: 'Aggiornamento Applicazione',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        "E' stato eseguito il download di una nuova versione. Riavvia l'applicazione per applicare gli aggiornamenti."
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', (message) => {
    console.error('There was a problem updating the application')
    console.error(message)
  })

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 6000)
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'lib', 'preload.js')
    },
    icon: __dirname + '/favicon.ico'
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'bottom' })
  }

  if (!isDev) {
    win.removeMenu()
  }
}

app.whenReady().then(() => {
  createWindow()

  if (!isDev) createAutoUpdater()

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`))
  }

  for (let apiName of Object.keys(api)) {
    ipcMain.handle(apiName, async (event, args) => api[apiName](args))
  }

  ipcMain.handle('getAppVersion', async (event, args) => app.getVersion())

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
