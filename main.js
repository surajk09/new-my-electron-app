const { app, BrowserWindow, ipcMain,screen,Menu} = require('electron')
const path = require('node:path')
const os = require('os');
const { autoUpdater,AppUpdater } = require('electron-updater');

autoUpdater.autoDownload=true;
autoUpdater.autoInstallOnAppQuit=true;

if(require('electron-squirrel-startup')) return;

const createWindow = () => {
  const {width,height} = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    frame: true,
    width: 300,
    height: 400,
    useContentSize: true,
    transparent: false,
    resizable: false,
    x: width - 300,
    y: height - 450,
    visibleOnAllWorkspaces: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  //Menu.setApplicationMenu(null);
  screen.on('display-metrics-changed', (event, display, changedMetrics) =>
  {
    // console.log(display, changedMetrics);
    const {x, y, width, height} = display.workArea;
    // console.log(x, y, width, height);
    win.setBounds({x: width - 300, y: height - 450, width: 300, height: 400})
  });

  win.loadFile('index.html')

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('deviceInfo', {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      appVersion: app.getVersion()
    });
  });
}

//for mac doc
const dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    click () { console.log('New Window') }
  }, {
    label: 'New Window with Settings',
    submenu: [
      { label: 'Basic' },
      { label: 'Pro' }
    ]
  },
  { label: 'New Command...' }
])

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    app.dock.setMenu(dockMenu);
    
  }
  autoUpdater.checkForUpdates();
  
}).then(createWindow)

ipcMain.on('close', () => {
  if (!win.isDestroyed()) {
    win.close();
  }
});
ipcMain.on('close', () => {
  app.quit()
})