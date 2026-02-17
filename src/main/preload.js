const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer process
contextBridge.exposeInMainWorld('api', {
  // API de inspectores
  inspectores: {
    getAll: () => ipcRenderer.invoke('inspectores:getAll'),
    create: (data) => ipcRenderer.invoke('inspectores:create', data),
    getById: (numero_nomina) => ipcRenderer.invoke('inspectores:getById', numero_nomina),
    update: (numero_nomina, data) => ipcRenderer.invoke('inspectores:update', numero_nomina, data),
    delete: (numero_nomina) => ipcRenderer.invoke('inspectores:delete', numero_nomina)
  },
  
  // API de productos
  productos: {
    getAll: () => ipcRenderer.invoke('productos:getAll'),
    create: (data) => ipcRenderer.invoke('productos:create', data),
    getById: (id) => ipcRenderer.invoke('productos:getById', id),
    update: (id, data) => ipcRenderer.invoke('productos:update', id, data),
    delete: (id) => ipcRenderer.invoke('productos:delete', id)
  },
  
  // API de registros
  registros: {
    getAll: () => ipcRenderer.invoke('registros:getAll'),
    create: (data) => ipcRenderer.invoke('registros:create', data),
    getById: (id) => ipcRenderer.invoke('registros:getById', id),
    getByInspector: (numero_nomina) => ipcRenderer.invoke('registros:getByInspector', numero_nomina)
  },
  
  // API de validación
  validar: {
    mediciones: (mediciones) => ipcRenderer.invoke('validar:mediciones', mediciones)
  }
});
