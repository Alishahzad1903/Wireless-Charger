const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ModbusRTU = require('modbus-serial');

let mainWindow;
let isClockRunning = false;

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

function startModbusCommunication() {  
  const modbusClient = new ModbusRTU();
  modbusClient.connectRTU('COM10', { baudRate: 9600, dataBits: 8, parity: 'none' },  (err) => {
    if (err) {
      console.error('Error opening serial port:', err);
      return;
    }

    modbusClient.setID(1);

    const startAddress = 0;
    const numRegisters = 10;

    setInterval(() => {

      // Set a timeout of 5 seconds
      const timeoutDuration = 1000;
      let isTimeoutTriggered = false;

      // Set a timeout to handle the case when the slave doesn't respond within the specified duration
      const timeout = setTimeout(() => {
        if (!isTimeoutTriggered) {
          isTimeoutTriggered = true;
          console.log('Timeout: No response from the slave.');

          /*Stop the clock here*/
          if(isClockRunning){
            isClockRunning = false;
            mainWindow.webContents.send('clock-control', isClockRunning);
          }
        }
      }, timeoutDuration);
      

      modbusClient.readHoldingRegisters(startAddress, numRegisters, (error, data) => {
        clearTimeout(timeout); // Clear the timeout since the response arrived before the timeout

        /*Start/Restart the clock from here*/
        if(isClockRunning) {
          if (error) {
            console.error('Error reading holding registers:', error);
          } else {
            const registerValues = data.data;
            mainWindow.webContents.send('update', registerValues);
          }
        }
        else {
          console.log("Clock signaled to start")
          isClockRunning = true;
          mainWindow.webContents.send('clock-control', isClockRunning);
        }
      });
    }, 1000);
  });
}


function handleSendCommand (event, value) {
  console.log(value);
}

app.whenReady().then(() => {

  createMainWindow();
  startModbusCommunication();


  ipcMain.on('send-command', handleSendCommand);


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      sendModbusStatus();
    }
  })

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

