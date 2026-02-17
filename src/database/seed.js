const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Determinar la ruta de la base de datos
const userDataPath = process.env.APPDATA || 
  (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.local/share');
const dbDir = path.join(userDataPath, 'yokohama-quality-system');

// Crear el directorio si no existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'yokohama-quality.db');
console.log('Ruta de la base de datos:', dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Crear las tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS inspectores (
    numero_nomina INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    activo INTEGER DEFAULT 1,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

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

console.log('Tablas creadas correctamente');

// Insertar datos de ejemplo
try {
  // Inspectores de ejemplo
  const insertInspector = db.prepare('INSERT OR IGNORE INTO inspectores (numero_nomina, nombre, apellido) VALUES (?, ?, ?)');
  
  insertInspector.run(1001, 'Juan', 'Pérez');
  insertInspector.run(1002, 'María', 'González');
  insertInspector.run(1003, 'Carlos', 'Rodríguez');
  
  console.log('Inspectores insertados correctamente');
  
  // Productos de ejemplo
  const insertProducto = db.prepare('INSERT OR IGNORE INTO productos (codigo, nombre, descripcion) VALUES (?, ?, ?)');
  
  insertProducto.run('YKH-001', 'Neumático 205/55R16', 'Neumático de alto rendimiento');
  insertProducto.run('YKH-002', 'Neumático 215/60R17', 'Neumático todo terreno');
  insertProducto.run('YKH-003', 'Neumático 225/45R18', 'Neumático deportivo');
  
  console.log('Productos insertados correctamente');
  
  console.log('\n=== Datos de ejemplo creados exitosamente ===');
  console.log('Base de datos ubicada en:', dbPath);
  console.log('\nPuedes iniciar la aplicación ahora.');
  
} catch (error) {
  console.error('Error al insertar datos:', error);
}

db.close();
