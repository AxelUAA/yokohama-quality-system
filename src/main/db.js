const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/yokohama.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a SQLite3');
  }
});

// Crear tabla de inspectores
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS inspectores (
      numero_nomina TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      apellido_paterno TEXT NOT NULL,
      apellido_materno TEXT,
      departamento TEXT,
      turno TEXT,
      activo INTEGER DEFAULT 1,
      fecha_registro TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear tabla inspectores:', err.message);
    } else {
      console.log('Tabla inspectores lista');
    }
  });
});

module.exports = db;
