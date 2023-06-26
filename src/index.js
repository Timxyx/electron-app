const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow = null;
let counter = 0;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  return mainWindow;
};

app.on("ready", () => {
  mainWindow = createWindow();
  setInterval(() => {
    counter++;
    if (mainWindow) {
      mainWindow.webContents.send("counterUpdated", counter);
    }
  }, 1500);

  let menuTemplate = [
    {
      label: "Menu",
      submenu: [
        {
          label: "Say Hello",
          click() {
            console.log("Hello");
          },
        },
        {
          label: "Say Goodbye",
          click() {
            console.log("Goodbye");
          },
        },
      ],
    },
  ];

  // Create Menu from template
  const menu = Menu.buildFromTemplate(menuTemplate);

  // Set application menu
  Menu.setApplicationMenu(menu);
});

ipcMain.on("buttonClicked", (event, text) => {
  console.log(text);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
