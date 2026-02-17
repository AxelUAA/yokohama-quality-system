const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const db = require('../database/db');
const { validarMediciones } = require('../database/validacion');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Cargar el archivo HTML
  mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));

  // Abrir DevTools en desarrollo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers para inspectores
ipcMain.handle('inspectores:getAll', async () => {
  try {
    return { success: true, data: db.inspectores.getAll() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('inspectores:create', async (event, data) => {
  try {
    const result = db.inspectores.create(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('inspectores:getById', async (event, numero_nomina) => {
  try {
    const result = db.inspectores.getById(numero_nomina);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('inspectores:update', async (event, numero_nomina, data) => {
  try {
    const result = db.inspectores.update(numero_nomina, data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('inspectores:delete', async (event, numero_nomina) => {
  try {
    const result = db.inspectores.delete(numero_nomina);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handlers para productos
ipcMain.handle('productos:getAll', async () => {
  try {
    return { success: true, data: db.productos.getAll() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('productos:create', async (event, data) => {
  try {
    const result = db.productos.create(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('productos:getById', async (event, id) => {
  try {
    const result = db.productos.getById(id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('productos:update', async (event, id, data) => {
  try {
    const result = db.productos.update(id, data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('productos:delete', async (event, id) => {
  try {
    const result = db.productos.delete(id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handlers para registros
ipcMain.handle('registros:getAll', async () => {
  try {
    return { success: true, data: db.registros.getAll() };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('registros:create', async (event, data) => {
  try {
    // Validar las mediciones
    const validacion = validarMediciones({
      diametro_pilot: data.diametro_pilot,
      longitud: data.longitud,
      bead: data.bead
    });
    
    // Agregar el resultado de la validación al registro
    data.resultado = validacion.resultadoGeneral;
    
    const result = db.registros.create(data);
    return { success: true, data: result, validacion };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('registros:getById', async (event, id) => {
  try {
    const result = db.registros.getById(id);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('registros:getByInspector', async (event, numero_nomina) => {
  try {
    const result = db.registros.getByInspector(numero_nomina);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// IPC Handler para validar mediciones sin guardar
ipcMain.handle('validar:mediciones', async (event, mediciones) => {
  try {
    const validacion = validarMediciones(mediciones);
    return { success: true, data: validacion };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  // Inicializar la base de datos
  db.initDatabase();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  db.closeDatabase();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  db.closeDatabase();
});
