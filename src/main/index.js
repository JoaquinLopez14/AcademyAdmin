import { app, shell, BrowserWindow, screen, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import icon from '../renderer/src/assets/icon.png'

let mainWindow

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    frame: true,
    resizable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false
    }
  })

  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  let zoomLevel = 1.0

  globalShortcut.register('CommandOrControl+=', () => {
    zoomLevel += 0.1
    mainWindow.webContents.setZoomFactor(zoomLevel)
  })

  globalShortcut.register('CommandOrControl+-', () => {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1)
    mainWindow.webContents.setZoomFactor(zoomLevel)
  })

  globalShortcut.register('CommandOrControl+0', () => {
    zoomLevel = 1.0
    mainWindow.webContents.setZoomFactor(zoomLevel)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

const loadData = () => {
  const filePath = path.join(app.getPath('userData'), 'couples.json')
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  }
  return []
}

// Guardar datos en un archivo JSON
const saveData = (data) => {
  const filePath = path.join(app.getPath('userData'), 'couples.json')
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8')
}

// Establecer comunicación entre el proceso de renderizado y el principal (IPC)
ipcMain.handle('load-couples', () => {
  return loadData()
})

ipcMain.handle('save-couples', (event, couples) => {
  saveData(couples)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
