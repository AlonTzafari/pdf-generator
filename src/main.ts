import { app, BrowserWindow, protocol } from "electron";
import * as path from "path";
import * as fs from 'fs';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 800,
  });

  // and load the index.html of the app.
  const isDev = process.env.NODE_ENV === 'dev';
  const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../renderer/index.html')}`  
  mainWindow.loadURL(url); 
  
  // Open the DevTools.
  if (isDev) mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const log = (txt: string) => fs.appendFileSync(path.join(__dirname, 'url.txt'), txt, {encoding: "utf-8"});
app.on("ready", () => {
    const root = path.join(__dirname, '..');
    log(`dir: ${__dirname}\n`);
    log(`root: ${root}\n`);
    protocol.interceptFileProtocol('file', (req, cb) => {
        log(`recived: ${req.url}\n`);
        if (path.normalize(req.url).includes(root)) {
            log(`sent unchanged: ${req.url}\n`);
            cb({url: req.url});
        } else {
            const file = path.join(root, 'renderer', req.url.substring(10)).replaceAll('\\', '/'); 
            log(`sent: ${file}\n`);
            cb({path: file})
        } 
    })
    // protocol.interceptFileProtocol('http', (req, cb) => {
    //     fs.writeFileSync(path.join(__dirname, 'file.txt'), req.url, {encoding: "utf-8"});
    //     const url = req.url;
    //     protocol.uninterceptProtocol('http')
    // })
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.