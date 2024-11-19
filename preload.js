const { contextBridge, ipcRenderer } = require("electron");

// Usando contextBridge para expor apenas a funcionalidade necessária de forma segura
contextBridge.exposeInMainWorld("electron", {
  sendData: (data) => ipcRenderer.send("enviar-dados", data),
  onReceiveResult: (callback) => ipcRenderer.on("resultado-loteria", callback),
});
