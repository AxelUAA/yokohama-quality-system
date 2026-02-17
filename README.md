# yokohama-quality-system

Sistema de Gestión de Calidad (SDCC-Y) desarrollado con Electron, React y SQLite para la digitalización y validación automatizada de inspecciones industriales en Yokohama Industries.

## Características

- **Aplicación de Escritorio**: Construida con Electron para funcionar en Windows, macOS y Linux
- **Interfaz Moderna**: Desarrollada con React para una experiencia de usuario fluida
- **Base de Datos Local**: SQLite para almacenamiento seguro y eficiente
- **Validación en Tiempo Real**: Valida automáticamente las mediciones contra rangos establecidos
- **Feedback Visual**: Fondos verdes (OK) y rojos (NG) para resultados de validación
- **IPC Seguro**: Comunicación segura entre procesos mediante Context Isolation

## Requisitos

- Node.js 16 o superior
- npm 7 o superior

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/AxelUAA/yokohama-quality-system.git
cd yokohama-quality-system
```

2. Instalar dependencias:
```bash
npm install
```

3. Construir la aplicación:
```bash
npm run build
```

4. Inicializar la base de datos con datos de ejemplo:
```bash
npm run seed
```

## Uso

### Iniciar la aplicación

```bash
npm start
```

### Modo desarrollo

Para desarrollo con recarga automática:
```bash
# Terminal 1: Compilar React con watch
npm run dev

# Terminal 2: Iniciar Electron
npm run electron-dev
```

## Estructura del Proyecto

```
yokohama-quality-system/
├── src/
│   ├── main/                 # Proceso principal de Electron
│   │   ├── main.js          # Punto de entrada principal
│   │   └── preload.js       # Script de precarga para IPC seguro
│   ├── renderer/            # Proceso de renderizado (React)
│   │   ├── components/      # Componentes de React
│   │   ├── styles/          # Estilos CSS
│   │   ├── App.js           # Componente principal
│   │   └── index.js         # Punto de entrada de React
│   └── database/            # Lógica de base de datos
│       ├── db.js            # Conexión y operaciones CRUD
│       ├── validacion.js    # Lógica de validación de mediciones
│       └── seed.js          # Script para datos de ejemplo
├── public/                  # Archivos estáticos
│   └── index.html          # HTML base
├── dist/                    # Archivos compilados
├── webpack.config.js        # Configuración de Webpack
├── babel.config.js          # Configuración de Babel
└── package.json            # Dependencias y scripts
```

## Base de Datos

### Tablas

#### inspectores
- `numero_nomina` (INTEGER, PK): Número de nómina del inspector
- `nombre` (TEXT): Nombre del inspector
- `apellido` (TEXT): Apellido del inspector
- `activo` (INTEGER): Estado activo/inactivo
- `fecha_registro` (DATETIME): Fecha de registro

#### productos
- `id` (INTEGER, PK): ID autoincremental
- `codigo` (TEXT, UNIQUE): Código del producto
- `nombre` (TEXT): Nombre del producto
- `descripcion` (TEXT): Descripción del producto
- `fecha_registro` (DATETIME): Fecha de registro

#### registros
- `id` (INTEGER, PK): ID autoincremental
- `numero_nomina` (INTEGER, FK): Referencia al inspector
- `producto_id` (INTEGER, FK): Referencia al producto
- `diametro_pilot` (REAL): Medición del diámetro pilot
- `longitud` (REAL): Medición de longitud
- `bead` (REAL): Medición de bead
- `resultado` (TEXT): Resultado de la inspección (OK/NG)
- `fecha_inspeccion` (DATETIME): Fecha y hora de la inspección

## Rangos de Validación

Las mediciones se validan automáticamente contra los siguientes rangos:

- **Diámetro Pilot**: 11.58 - 11.71
- **Longitud**: 11.8 - 12.4
- **Bead**: 20.51 - 20.91

Si todas las mediciones están dentro del rango, el resultado es **OK** (fondo verde).
Si alguna medición está fuera del rango, el resultado es **NG** (fondo rojo).

## API IPC

La aplicación utiliza IPC (Inter-Process Communication) para comunicación segura:

### Inspectores
- `inspectores:getAll` - Obtener todos los inspectores
- `inspectores:create` - Crear nuevo inspector
- `inspectores:getById` - Obtener inspector por número de nómina
- `inspectores:update` - Actualizar inspector
- `inspectores:delete` - Desactivar inspector

### Productos
- `productos:getAll` - Obtener todos los productos
- `productos:create` - Crear nuevo producto
- `productos:getById` - Obtener producto por ID
- `productos:update` - Actualizar producto
- `productos:delete` - Eliminar producto

### Registros
- `registros:getAll` - Obtener todos los registros
- `registros:create` - Crear nuevo registro de inspección
- `registros:getById` - Obtener registro por ID
- `registros:getByInspector` - Obtener registros por inspector

### Validación
- `validar:mediciones` - Validar mediciones sin guardar

## Tecnologías Utilizadas

- **Electron**: Framework para aplicaciones de escritorio
- **React**: Biblioteca para interfaces de usuario
- **SQLite**: Base de datos embebida
- **better-sqlite3**: Driver SQLite para Node.js
- **Webpack**: Empaquetador de módulos
- **Babel**: Transpilador de JavaScript

## Licencia

ISC

## Autor

Yokohama Industries
