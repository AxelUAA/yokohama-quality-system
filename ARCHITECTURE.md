# Arquitectura del Sistema

## Yokohama Quality System - Sistema de Auditoría de Inspección Final

### Visión General

El sistema está diseñado como una aplicación de escritorio multiplataforma utilizando Electron, React y SQLite para digitalizar y automatizar el proceso de auditoría de inspección final en Yokohama Industries.

## Arquitectura de Tres Capas

### 1. Capa de Presentación (Renderer Process - React)

**Ubicación**: `src/renderer/`

#### Componentes Principales:

- **App.js**: Componente raíz que gestiona el estado global
  - Carga inicial de datos (inspectores, productos, registros)
  - Coordinación entre formulario y tabla
  - Gestión de actualizaciones

- **InspeccionForm.js**: Formulario de inspección
  - Selección de inspector y producto
  - Entrada de mediciones (Diámetro Pilot, Longitud, Bead)
  - **Validación en tiempo real** con feedback visual
  - Estados de color: Verde (OK) / Rojo (NG)
  - Comunicación con el main process vía IPC

- **RegistrosTable.js**: Tabla de historial
  - Visualización de inspecciones realizadas
  - Indicadores visuales de resultado (OK/NG)
  - Información del inspector y producto

#### Flujo de Validación UI:

```
Usuario ingresa medición
     ↓
useEffect detecta cambio
     ↓
Llama window.api.validar.mediciones()
     ↓
Recibe resultado de validación
     ↓
Actualiza estado y aplica clases CSS
     ↓
input-ok (verde) o input-ng (rojo)
```

### 2. Capa de Lógica de Negocio (Main Process - Electron)

**Ubicación**: `src/main/`

#### main.js - Proceso Principal

Responsabilidades:
- Inicialización de la aplicación Electron
- Creación de ventanas
- Gestión del ciclo de vida de la aplicación
- Registro de handlers IPC
- Inicialización y cierre de base de datos

#### preload.js - Bridge de Seguridad

- Implementa Context Isolation
- Expone API segura al renderer via `contextBridge`
- Previene acceso directo a Node.js desde el renderer
- Define contratos de comunicación IPC

**API Expuesta**:
```javascript
window.api = {
  inspectores: { getAll, create, getById, update, delete },
  productos: { getAll, create, getById, update, delete },
  registros: { getAll, create, getById, getByInspector },
  validar: { mediciones }
}
```

#### IPC Handlers

**Patrón de Respuesta**:
```javascript
{
  success: boolean,
  data: any,
  error?: string
}
```

**Handlers Implementados**:
- `inspectores:*` - CRUD de inspectores
- `productos:*` - CRUD de productos
- `registros:*` - CRUD de registros
- `validar:mediciones` - Validación sin persistencia

### 3. Capa de Datos (Database Layer)

**Ubicación**: `src/database/`

#### db.js - Gestión de Base de Datos

**Funciones Principales**:
- `initDatabase()`: Inicializa la BD y crea tablas
- `getDatabase()`: Obtiene instancia de la BD
- `closeDatabase()`: Cierra conexión

**Objetos CRUD**:
```javascript
inspectores = { create, getAll, getById, update, delete }
productos = { create, getAll, getById, update, delete }
registros = { create, getAll, getById, getByInspector }
```

**Características**:
- Write-Ahead Logging (WAL) para mejor rendimiento
- Prepared statements para prevenir SQL injection
- Transacciones implícitas
- Claves foráneas habilitadas

#### validacion.js - Lógica de Validación

**Rangos Definidos**:
```javascript
{
  diametro_pilot: { min: 11.58, max: 11.71 },
  longitud: { min: 11.8, max: 12.4 },
  bead: { min: 20.51, max: 20.91 }
}
```

**Función Principal**: `validarMediciones(mediciones)`

**Retorna**:
```javascript
{
  diametro_pilot: { valor, valido, rango },
  longitud: { valor, valido, rango },
  bead: { valor, valido, rango },
  resultadoGeneral: 'OK' | 'NG',
  mensaje: string
}
```

**Lógica**:
- Valida cada medición contra su rango
- Resultado OK solo si TODAS las mediciones son válidas
- Resultado NG si AL MENOS UNA medición está fuera de rango

## Flujo de Datos Completo

### Flujo de Nueva Inspección:

```
1. Usuario completa formulario
   ├─ Selecciona inspector (dropdown)
   ├─ Selecciona producto (dropdown)
   └─ Ingresa mediciones (inputs numéricos)

2. Validación en Tiempo Real (onChange)
   ├─ React detecta cambio en input
   ├─ Llama window.api.validar.mediciones()
   ├─ Main process llama validarMediciones()
   ├─ Retorna resultado de validación
   └─ UI actualiza colores (verde/rojo)

3. Submit del Formulario
   ├─ Usuario presiona "Registrar Inspección"
   ├─ React valida campos requeridos
   ├─ Llama window.api.registros.create()
   ├─ Main process:
   │   ├─ Ejecuta validarMediciones()
   │   ├─ Agrega resultado al registro
   │   └─ Inserta en BD
   ├─ Retorna éxito/error
   └─ UI:
       ├─ Muestra mensaje de confirmación
       ├─ Limpia formulario
       └─ Recarga lista de registros
```

### Flujo de Carga de Datos:

```
1. App.js useEffect (componentDidMount)
   ├─ Llama window.api.inspectores.getAll()
   ├─ Llama window.api.productos.getAll()
   └─ Llama window.api.registros.getAll()

2. Main Process
   ├─ Ejecuta queries SQL
   └─ Retorna resultados

3. React
   ├─ Actualiza estados
   └─ Re-renderiza componentes
```

## Seguridad

### Context Isolation

- **Habilitada**: `contextIsolation: true`
- **Node Integration**: Deshabilitada en renderer
- **Preload Script**: Único punto de comunicación

### Comunicación IPC Segura

- No exposición directa de módulos Node.js
- API limitada y definida explícitamente
- Validación en ambos lados (renderer y main)
- Uso de `ipcRenderer.invoke()` (async/await)

### Base de Datos

- Prepared statements previenen SQL injection
- Sin entrada directa de usuario en queries
- Validación de tipos en capa de negocio
- Base de datos local (no acceso remoto)

## Estructura de la Base de Datos

### Esquema de Relaciones:

```
inspectores (1) ──< (N) registros (N) >── (1) productos
```

### Tabla: inspectores

```sql
CREATE TABLE inspectores (
  numero_nomina INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  activo INTEGER DEFAULT 1,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tabla: productos

```sql
CREATE TABLE productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Tabla: registros

```sql
CREATE TABLE registros (
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
```

## Tecnologías y Dependencias

### Producción:
- **electron**: ^40.4.1 - Framework de aplicación de escritorio
- **react**: ^19.2.4 - Biblioteca UI
- **react-dom**: ^19.2.4 - Renderizado DOM
- **better-sqlite3**: ^12.6.2 - Driver SQLite sincrónico

### Desarrollo:
- **@babel/core**: ^7.29.0 - Transpilador JavaScript
- **@babel/preset-env**: ^7.29.0 - Preset para ES6+
- **@babel/preset-react**: ^7.28.5 - Preset para JSX
- **webpack**: ^5.105.2 - Empaquetador de módulos
- **webpack-cli**: ^6.0.1 - CLI de Webpack
- **babel-loader**: ^8.4.1 - Loader de Babel para Webpack
- **style-loader**: ^4.0.0 - Inyecta CSS en DOM
- **css-loader**: ^7.1.4 - Procesa imports de CSS
- **html-webpack-plugin**: ^5.6.6 - Genera HTML
- **electron-builder**: ^26.7.0 - Empaquetador de aplicación

## Configuración de Build

### webpack.config.js

- **Entry**: `src/renderer/index.js`
- **Target**: `electron-renderer`
- **Output**: `dist/renderer.js`
- **Loaders**:
  - custom loader (manual-babel-loader.js) para JS/JSX
  - style-loader + css-loader para CSS
- **Plugins**:
  - HtmlWebpackPlugin para generar index.html
- **Source Maps**: Habilitados para debugging

### babel.config.js

- **Source Type**: unambiguous (auto-detección)
- **Presets**:
  - @babel/preset-env (ES6+ → ES5)
  - @babel/preset-react con runtime clásico

## Ubicación de Archivos

### Base de Datos:
- **Windows**: `%APPDATA%/yokohama-quality-system/yokohama-quality.db`
- **macOS**: `~/Library/Application Support/yokohama-quality-system/yokohama-quality.db`
- **Linux**: `~/.local/share/yokohama-quality-system/yokohama-quality.db`

### Build Output:
- `dist/` - Archivos compilados de React
- No se incluye en el repositorio (.gitignore)

## Extensibilidad

### Agregar Nuevos Campos de Validación:

1. Actualizar `RANGOS_VALIDACION` en `validacion.js`
2. Modificar esquema de tabla `registros`
3. Actualizar `InspeccionForm.js` con nuevo input
4. Agregar campo en el objeto de mediciones
5. Actualizar UI en `RegistrosTable.js`

### Agregar Nuevas Tablas:

1. Definir esquema en `db.js` (función `initDatabase`)
2. Crear objeto CRUD con métodos necesarios
3. Exportar objeto en module.exports
4. Crear handlers IPC en `main.js`
5. Exponer API en `preload.js`
6. Consumir desde componentes React

## Consideraciones de Rendimiento

- **WAL Mode**: Mejora concurrencia en SQLite
- **Prepared Statements**: Reutilización de queries
- **React Memo**: Potencial optimización para tablas grandes
- **Pagination**: Implementar si registros > 1000

## Mantenimiento

### Backup de Base de Datos:
```bash
# La BD se encuentra en la carpeta de datos de usuario
# Hacer backup periódico del archivo .db
```

### Actualización de Dependencias:
```bash
npm outdated
npm update
```

### Debugging:
- DevTools disponibles en modo desarrollo
- Source maps habilitados
- Console.log en ambos procesos (main y renderer)

## Próximas Mejoras Sugeridas

1. **Autenticación**: Login de inspectores
2. **Reportes**: Exportación a PDF/Excel
3. **Gráficos**: Visualización de tendencias
4. **Notificaciones**: Alertas de mediciones fuera de rango
5. **Multi-idioma**: i18n para español/inglés
6. **Tests**: Unit tests para validación
7. **CI/CD**: Pipeline de build automático
8. **Firma Digital**: Para trazabilidad de inspecciones
