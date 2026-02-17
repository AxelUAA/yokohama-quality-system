#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Verificación del Sistema Yokohama Quality ===\n');

let allGood = true;

// Verificar estructura de carpetas
console.log('1. Verificando estructura de carpetas...');
const requiredDirs = [
  'src/main',
  'src/renderer/components',
  'src/renderer/styles',
  'src/database',
  'public',
  'dist'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✓ ${dir}`);
  } else {
    console.log(`   ✗ ${dir} - NO EXISTE`);
    allGood = false;
  }
});

// Verificar archivos principales
console.log('\n2. Verificando archivos principales...');
const requiredFiles = [
  'src/main/main.js',
  'src/main/preload.js',
  'src/renderer/App.js',
  'src/renderer/index.js',
  'src/renderer/components/InspeccionForm.js',
  'src/renderer/components/RegistrosTable.js',
  'src/database/db.js',
  'src/database/validacion.js',
  'src/database/seed.js',
  'webpack.config.js',
  'babel.config.js',
  'package.json',
  'dist/renderer.js',
  'dist/index.html'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ ${file}`);
  } else {
    console.log(`   ✗ ${file} - NO EXISTE`);
    allGood = false;
  }
});

// Verificar node_modules
console.log('\n3. Verificando dependencias...');
if (fs.existsSync('node_modules')) {
  const criticalDeps = ['electron', 'react', 'react-dom', 'better-sqlite3'];
  criticalDeps.forEach(dep => {
    if (fs.existsSync(`node_modules/${dep}`)) {
      console.log(`   ✓ ${dep}`);
    } else {
      console.log(`   ✗ ${dep} - NO INSTALADO`);
      allGood = false;
    }
  });
} else {
  console.log('   ✗ node_modules - Ejecutar npm install');
  allGood = false;
}

// Verificar base de datos
console.log('\n4. Verificando base de datos...');
const userDataPath = process.env.APPDATA || 
  (process.platform === 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.local/share');
const dbPath = path.join(userDataPath, 'yokohama-quality-system', 'yokohama-quality.db');

if (fs.existsSync(dbPath)) {
  console.log(`   ✓ Base de datos existe en: ${dbPath}`);
  
  // Verificar tablas
  try {
    const Database = require('better-sqlite3');
    const db = new Database(dbPath, { readonly: true });
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    
    const requiredTables = ['inspectores', 'productos', 'registros'];
    requiredTables.forEach(table => {
      if (tableNames.includes(table)) {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`   ✓ Tabla ${table} existe (${count.count} registros)`);
      } else {
        console.log(`   ✗ Tabla ${table} - NO EXISTE`);
        allGood = false;
      }
    });
    
    db.close();
  } catch (error) {
    console.log(`   ✗ Error al verificar base de datos: ${error.message}`);
    allGood = false;
  }
} else {
  console.log(`   ⚠ Base de datos no existe. Ejecutar: npm run seed`);
  console.log(`     Se creará en: ${dbPath}`);
}

// Verificar build
console.log('\n5. Verificando build...');
if (fs.existsSync('dist/renderer.js')) {
  const stats = fs.statSync('dist/renderer.js');
  console.log(`   ✓ renderer.js (${Math.round(stats.size / 1024)} KB)`);
} else {
  console.log('   ✗ renderer.js - Ejecutar npm run build');
  allGood = false;
}

// Verificar scripts en package.json
console.log('\n6. Verificando scripts...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['start', 'build', 'seed', 'dev', 'electron-dev'];
requiredScripts.forEach(script => {
  if (pkg.scripts[script]) {
    console.log(`   ✓ npm run ${script}`);
  } else {
    console.log(`   ✗ npm run ${script} - NO DEFINIDO`);
    allGood = false;
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✓ SISTEMA VERIFICADO CORRECTAMENTE');
  console.log('\nPara iniciar la aplicación:');
  console.log('  npm start');
  console.log('\nPara desarrollo:');
  console.log('  Terminal 1: npm run dev');
  console.log('  Terminal 2: npm run electron-dev');
} else {
  console.log('✗ SE ENCONTRARON PROBLEMAS');
  console.log('\nSoluciones sugeridas:');
  console.log('  - Instalar dependencias: npm install');
  console.log('  - Construir aplicación: npm run build');
  console.log('  - Inicializar base de datos: npm run seed');
}
console.log('='.repeat(50) + '\n');

process.exit(allGood ? 0 : 1);
