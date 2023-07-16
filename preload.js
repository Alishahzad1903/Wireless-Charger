// window.addEventListener('DOMContentLoaded', () => {
//     const loadingScreen = document.getElementById('loading-screen');
//     const nextScreen = document.getElementById('next-screen');
//     const startButton = document.getElementById('start-button');
  
//     // Set initial screen to loading
//     //loadingScreen.classList.add('active');
  
//     // Listen for start button click event


const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    handlecontroller: (callback) => ipcRenderer.on('update', callback),
  
    
})

