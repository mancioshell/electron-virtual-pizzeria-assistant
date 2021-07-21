const { app, BrowserWindow, autoUpdater, dialog, ipcMain } = require('electron')
const backend = require('i18next-electron-fs-backend')
const fs = require('fs')
const isDev = require('electron-is-dev')
const path = require('path')
const api = require('./lib/db').api

const i18n = require('./i18n')
let i18next

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
      buttons: [i18next.t('button.close'), i18next.t('button.remind-later')],
      title: i18next.t('title'),
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: i18next.t('button.detail')
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

  backend.mainBindings(ipcMain, win, fs)

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
  i18next = i18n.initI18Next(app.getLocale())
  createWindow()

  if (!isDev) createAutoUpdater()

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((error) => console.log(`An error occurred: , ${error}`))
  }

  for (let apiName of Object.keys(api)) {
    ipcMain.handle(apiName, async (event, arg0, arg1) =>
      api[apiName](arg0, arg1)
    )
  }

  ipcMain.handle('getAppVersion', async (event, args) => app.getVersion())

  ipcMain.handle('getAppLocale', async (event, args) => app.getLocale())

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  } else {
    backend.clearMainBindings(ipcMain)
  }
})

// app.on('ready', () => {
//   let currentLocale = app.getLocale()
//   console.log(currentLocale)
//   //console.log('electron-ready currentLocale: ' + currentLocale);
//   // currentLocale = 'bn';
// })
