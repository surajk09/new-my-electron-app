const { app, BrowserWindow, ipcMain,screen,Menu} = require('electron')
const path = require('node:path')
const os = require('os');
const { autoUpdater,AppUpdater } = require('electron-updater');
let  win;
autoUpdater.autoDownload=true;

if(require('electron-squirrel-startup')) return;

const createWindow = () => {
  const {width,height} = screen.getPrimaryDisplay().workAreaSize;
   win = new BrowserWindow({
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
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });

  autoUpdater.checkForUpdates();
  console.log(`Checking for updates. Current version ${app.getVersion()}`);
  
})

ipcMain.on('close', () => {
  if (!win.isDestroyed()) {
    win.close();
  }
});
ipcMain.on('close', () => {
  app.quit()
})
/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  console.log(`Update available. Current version ${app.getVersion()}`);
  let pth = autoUpdater.downloadUpdate();
  console.log(pth);
});

autoUpdater.on("update-not-available", (info) => {
  console.log(`No update available. Current version ${app.getVersion()}`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  console.log(`Update downloaded. Current version ${app.getVersion()}`);
});

autoUpdater.on("error", (info) => {
  console.log(info);
});




//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});