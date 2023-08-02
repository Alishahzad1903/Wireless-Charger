
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    handlecontroller: (callback) => ipcRenderer.on('update', callback),
    sendCommand: (value) => ipcRenderer.send('send-command', value),
    handleConnection: (callback) => ipcRenderer.on('connection-control', callback),
})


