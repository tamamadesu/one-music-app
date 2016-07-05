"use strict";

let request = require("request");
let $ =  require("jquery");

var origin = 'http://music.163.com';
const url = `${origin}/api/search/suggest/web`;
let limit = 3;
let type = 1;
let offset = 0;
const option = {
    form:{
        s: '周杰伦',
        limit,type,offset
    },
    method:'post',
    url:url,
    headers: {
        'Origin': origin,
        'Referer': origin,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      proxy: false
};
request(option, (err, res, body) => {
    if (!err && res.statusCode == 200) {
        let info = JSON.parse(body).result.albums[0];
        $("body").html(JSON.stringify(info,'',2));
    }
});

console.log(process);

// const electron = require('electron')
// // Module to control application life.
// const app = electron.app
// // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow

// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow

// function createWindow () {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({width: 800, height: 600})

//   // and load the index.html of the app.
//   mainWindow.loadURL(`file://${__dirname}/index.html`)

//   // Open the DevTools.
//   mainWindow.webContents.openDevTools()

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
