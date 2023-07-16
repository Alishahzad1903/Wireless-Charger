const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ModbusRTU = require('modbus-serial');

//Oyee

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Test',
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMenu(null);

  //mainWindow.webContents.openDevTools();
  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createMainWindow();

  const modbusClient = new ModbusRTU();
  modbusClient.connectRTU('COM10', { baudRate: 9600, dataBits: 8, parity: 'none' }, (err) => {
    if (err) {
      console.error('Error opening serial port:', err);
      return;
    }

    modbusClient.setID(1);

    const startAddress = 0;
    const numRegisters = 10;

    setInterval(() => {
      modbusClient.readHoldingRegisters(startAddress, numRegisters, (error, data) => {
        if (error) {
          console.error('Error reading holding registers:', error);
        } else {
          const registerValues = data.data;
          mainWindow.webContents.send('update', registerValues);
        }
      });
    }, 2000);
  });
});

