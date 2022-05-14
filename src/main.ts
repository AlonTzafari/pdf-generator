import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as fs from 'fs';

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.menuBarVisible = false;
  const isDev = process.env.NODE_ENV === 'dev';
  const target = isDev ? 'http://localhost:3000' : path.join(__dirname, 'renderer', 'index.html');  
  if(isDev) mainWindow.loadURL(target);
  else mainWindow.loadFile(target);
  
  if (isDev) mainWindow.webContents.openDevTools();
}

const log = (txt: string) => fs.appendFileSync(path.join(__dirname, 'url.txt'), txt, {encoding: "utf-8"});
app.on("ready", () => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
