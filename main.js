// Import required modules
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const ModbusRTU = require('modbus-serial');

// Declare global variables
let mainWindow;
let isClockRunning = false;

// Function to create the main application window
function createMainWindow() {
  // Create a new browser window
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

  // Set minimum window size and remove menu
  mainWindow.setMinimumSize(900, 600);
  mainWindow.setMenu(null);

  // Maximize the window
  mainWindow.maximize();

  // Define the aspect ratio for resizing
  const aspectRatio = 3 / 2; // Replace with your desired aspect ratio
  let prevSize = mainWindow.getSize();

  // Handle window resize event to maintain aspect ratio
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

  // Load the main HTML file
  mainWindow.loadFile('start.html');

  // Send a message to the window when the page finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('connection-control', isClockRunning);
  });
}

// Function to start Modbus communication
function startModbusCommunication() {
  const modbusClient = new ModbusRTU();
  
  // Connect to the COM10 serial port with specified settings
  modbusClient.connectRTU('COM10', { baudRate: 9600, dataBits: 8, parity: 'none' }, (err) => {
    if (err) {
      console.error('Error opening serial port:', err);
      return;
    }

    // Set the Modbus slave ID
    modbusClient.setID(1);

    const startAddress = 0;
    const numRegisters = 10;

    // Set up a periodic interval to read Modbus registers
    setInterval(() => {
      // Set a timeout
      const timeoutDuration = 500;
      let isTimeoutTriggered = false;

      // Set a timeout to handle the case when the slave doesn't respond within the specified duration
      const timeout = setTimeout(() => {
        if (!isTimeoutTriggered) {
          isTimeoutTriggered = true;
          console.log('Timeout: No response from the slave.');

          // Stop the clock here if it's running
          if (isClockRunning) {
            isClockRunning = false;
            mainWindow.webContents.send('connection-control', isClockRunning);
          }
        }
      }, timeoutDuration);

      // Read holding registers from Modbus
      modbusClient.readHoldingRegisters(startAddress, numRegisters, (error, data) => {
        clearTimeout(timeout); // Clear the timeout since the response arrived before the timeout

        // Start/Restart the clock from here
        if (isClockRunning) {
          if (error) {
            console.error('Error reading holding registers:', error);
          } else {
            // Convert unsigned to signed for register values
            var registerValues = data.data.map(value => {
              if (value >= 0x8000) {
                return value - 0x10000;
              } else {
                return value;
              }
            });

            // Send the register values to the main window
            mainWindow.webContents.send('update', registerValues);
          }
        } else {
          // Start the clock and signal it
          console.log("Clock signaled to start");
          isClockRunning = true;
          mainWindow.webContents.send('connection-control', isClockRunning);
        }
      });
    }, 500);
  });
}

// Application setup and event handling
app.whenReady().then(() => {
  createMainWindow();
  startModbusCommunication();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
      startModbusCommunication();
    }
  });
});

// Quit the application when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
