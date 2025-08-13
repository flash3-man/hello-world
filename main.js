const { app, BrowserWindow, Menu, shell } = require('electron')
const path = require('path')
const express = require('express')
const { spawn } = require('child_process')

let mainWindow
let serverProcess

// 创建Express服务器
function createServer() {
  const expressApp = express()
  const port = 3000
  
  // 设置静态文件目录
  expressApp.use(express.static(path.join(__dirname, 'dist')))
  
  // 处理所有路由，返回index.html（用于Vue Router的history模式）
  expressApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
  
  return expressApp.listen(port, () => {
    console.log(`超悦业务管理系统服务器启动在端口 ${port}`)
  })
}

// 创建主窗口
function createWindow() {
  // 启动内置服务器
  serverProcess = createServer()
  
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
    title: '超悦业务管理系统',
    show: false, // 先不显示，等加载完成后再显示
    titleBarStyle: 'default'
  })

  // 等待窗口准备好后再显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // 开发模式下打开开发者工具
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools()
    }
  })

  // 加载应用
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3000')
  }, 1000) // 等待服务器启动

  // 处理窗口关闭
  mainWindow.on('closed', () => {
    mainWindow = null
    if (serverProcess) {
      serverProcess.close()
    }
  })

  // 处理外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '刷新',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload()
            }
          }
        },
        {
          label: '退出',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: '查看',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) {
              mainWindow.reload()
            }
          }
        },
        {
          label: '强制重新加载',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache()
            }
          }
        },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools()
            }
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于超悦业务管理系统',
              message: '超悦业务管理系统 v1.0.0',
              detail: '基于Vue 3的现代化业务管理平台\n\n开发者: Augment Agent\n构建时间: 2025年8月12日'
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// 应用事件处理
app.whenReady().then(() => {
  createWindow()
  createMenu()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.close()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.close()
  }
})

// 安全设置
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    shell.openExternal(navigationUrl)
  })
})
