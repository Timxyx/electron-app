// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { ipcRenderer, contextBridge } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  let mybtn = document.getElementById("btn");
  mybtn.addEventListener("click", () => {
    let text = document.getElementById("textBox").value;
    console.log(text);
    ipcRenderer.send("buttonClicked", text);
  });

  Bridge.counterUpdated((event, counterValue) => {
    document.getElementById("counter").textContent = `Counter: ${counterValue}`;
  });
});

let Bridge = {
  counterUpdated: (callback) => ipcRenderer.on("counterUpdated", callback),
};

contextBridge.exposeInMainWorld("Bridge", Bridge);
