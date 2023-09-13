const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const ModbusRTU = require('modbus-serial');

let mainWindow;
let isClockRunning = false;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'Wireless EV Charger',
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mainWindow.setMinimumSize(900, 600);
  mainWindow.setMenu(null);
  mainWindow.maximize();
  //mainWindow.webContents.openDevTools();

  mainWindow.maximize();

  const aspectRatio = 3 / 2; // Replace with your desired aspect ratio
  let prevSize = mainWindow.getSize();

  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize();
    const [prevWidth, prevHeight] = prevSize;
  
    if (width > prevWidth || height > prevHeight) {
      // Increasing both width and height
      if (aspectRatio > width / height) {
        const newWidth = Math.floor(height * aspectRatio);
        mainWindow.setSize(newWidth, height);
      } else {
        const newHeight = Math.floor(width / aspectRatio);
        mainWindow.setSize(width, newHeight);
      }
    } else {
      // Decreasing or equal size, adjust based on the smaller dimension
      if (aspectRatio < width / height) {
        const newWidth = Math.floor(height * aspectRatio);
        mainWindow.setSize(newWidth, height);
      } else {
        const newHeight = Math.floor(width / aspectRatio);
        mainWindow.setSize(width, newHeight);
      }
    }

    prevSize = mainWindow.getSize();
  });

  //mainWindow.webContents.openDevTools();
  mainWindow.loadFile('main.html');

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('connection-control', isClockRunning);
  });
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

      // Set a timeout
      const timeoutDuration = 500;
      let isTimeoutTriggered = false;

      // Set a timeout to handle the case when the slave doesn't respond within the specified duration
      const timeout = setTimeout(() => {
        if (!isTimeoutTriggered) {
          isTimeoutTriggered = true;
          console.log('Timeout: No response from the slave.');

          /*Stop the clock here*/
          if(isClockRunning){
            isClockRunning = false;
            mainWindow.webContents.send('connection-control', isClockRunning);
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
            var registerValues = data.data.map(value => {
              // Convert unsigned to signed
              if (value >= 0x8000) {
                  return value - 0x10000;
              } else {
                  return value;
              }
          });

          mainWindow.webContents.send('update', registerValues);
          }
        }
        else {
          console.log("Clock signaled to start")
          isClockRunning = true;
          mainWindow.webContents.send('connection-control', isClockRunning);
        }
      });
      
    }, 500);
  });
}


function handleSendCommand (event, value) {
  console.log(value);
  //shell.openExternal('https://www.ee.cityu.edu.hk/~chjiang/Research.html');

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

ipcMain.on('open-external-link', (event, url) => {
  shell.openExternal('https://www.ee.cityu.edu.hk/~chjiang/Research.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

