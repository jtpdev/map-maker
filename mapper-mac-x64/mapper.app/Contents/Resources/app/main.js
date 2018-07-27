const electron = require('electron');
const app = electron.app;

const url = require('url');
const path = require('path');

const BrowserWindow = electron.BrowserWindow;
var mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({with: 1600, heigth: 800});
    mainWindow.maximize();
    // mainWindow.setFullScreen(true);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname + '/app', 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
});