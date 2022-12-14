const { app, ipcMain, BrowserWindow } = require("electron");
const Store = require("electron-store");

let appWin;
const store = new Store();

//This function creates the window and its properties.
createWindow = () => {
    appWin = new BrowserWindow({
        width: 800, 
        height: 600, 
        title: "BIYUYO",
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: __dirname + '/assets/Ecommerce_686-removebg-preview.png'
    });
    appWin.maximize();
    appWin.loadURL(`file://${__dirname}/dist/index.html`);

    appWin.setMenu(null);

    // appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
});
