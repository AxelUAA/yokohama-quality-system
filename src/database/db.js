const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

let db = null;

// Inicializar la base de datos
function initDatabase() {
  try {
    const dbPath = path.join(app.getPath('userData'), 'yokohama-quality.db');
    console.log('Ruta de la base de datos:', dbPath);
    
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    
    // Crear tabla de inspectores
    db.exec(`
      CREATE TABLE IF NOT EXISTS inspectores (
        numero_nomina INTEGER PRIMARY KEY,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        activo INTEGER DEFAULT 1,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de productos
    db.exec(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Crear tabla de registros de inspección
    db.exec(`
      CREATE TABLE IF NOT EXISTS registros (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_nomina INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        diametro_pilot REAL NOT NULL,
        longitud REAL NOT NULL,
        bead REAL NOT NULL,
        resultado TEXT NOT NULL,
        fecha_inspeccion DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (numero_nomina) REFERENCES inspectores(numero_nomina),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
      )
    `);
    
    console.log('Base de datos inicializada correctamente');
    return db;
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Obtener instancia de la base de datos
function getDatabase() {
  if (!db) {
    throw new Error('Base de datos no inicializada');
  }
  return db;
}

// Cerrar la base de datos
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Funciones CRUD para inspectores
const inspectores = {
  create: (data) => {
    const stmt = db.prepare('INSERT INTO inspectores (numero_nomina, nombre, apellido) VALUES (?, ?, ?)');
    return stmt.run(data.numero_nomina, data.nombre, data.apellido);
  },
  
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM inspectores WHERE activo = 1');
    return stmt.all();
  },
  
  getById: (numero_nomina) => {
    const stmt = db.prepare('SELECT * FROM inspectores WHERE numero_nomina = ?');
    return stmt.get(numero_nomina);
  },
  
  update: (numero_nomina, data) => {
    const stmt = db.prepare('UPDATE inspectores SET nombre = ?, apellido = ? WHERE numero_nomina = ?');
    return stmt.run(data.nombre, data.apellido, numero_nomina);
  },
  
  delete: (numero_nomina) => {
    const stmt = db.prepare('UPDATE inspectores SET activo = 0 WHERE numero_nomina = ?');
    return stmt.run(numero_nomina);
  }
};

// Funciones CRUD para productos
const productos = {
  create: (data) => {
    const stmt = db.prepare('INSERT INTO productos (codigo, nombre, descripcion) VALUES (?, ?, ?)');
    return stmt.run(data.codigo, data.nombre, data.descripcion);
  },
  
  getAll: () => {
    const stmt = db.prepare('SELECT * FROM productos');
    return stmt.all();
  },
  
  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM productos WHERE id = ?');
    return stmt.get(id);
  },
  
  update: (id, data) => {
    const stmt = db.prepare('UPDATE productos SET codigo = ?, nombre = ?, descripcion = ? WHERE id = ?');
    return stmt.run(data.codigo, data.nombre, data.descripcion, id);
  },
  
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM productos WHERE id = ?');
    return stmt.run(id);
  }
};

// Funciones CRUD para registros
const registros = {
  create: (data) => {
    const stmt = db.prepare(`
      INSERT INTO registros (numero_nomina, producto_id, diametro_pilot, longitud, bead, resultado)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      data.numero_nomina,
      data.producto_id,
      data.diametro_pilot,
      data.longitud,
      data.bead,
      data.resultado
    );
  },
  
  getAll: () => {
    const stmt = db.prepare(`
      SELECT r.*, i.nombre || ' ' || i.apellido as inspector, p.nombre as producto
      FROM registros r
      JOIN inspectores i ON r.numero_nomina = i.numero_nomina
      JOIN productos p ON r.producto_id = p.id
      ORDER BY r.fecha_inspeccion DESC
    `);
    return stmt.all();
  },
  
  getById: (id) => {
    const stmt = db.prepare('SELECT * FROM registros WHERE id = ?');
    return stmt.get(id);
  },
  
  getByInspector: (numero_nomina) => {
    const stmt = db.prepare('SELECT * FROM registros WHERE numero_nomina = ? ORDER BY fecha_inspeccion DESC');
    return stmt.all(numero_nomina);
  }
};

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase,
  inspectores,
  productos,
  registros
};
