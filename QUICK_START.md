# Quick Start Guide - Yokohama Quality System

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build & Initialize
```bash
# Build the React application
npm run build

# Initialize database with sample data
npm run seed
```

### Step 3: Start Application
```bash
npm start
```

## 📱 Using the Application

### Main Interface

```
┌─────────────────────────────────────────────────────────────┐
│  Sistema de Auditoría de Inspección Final                   │
│  Yokohama Industries - Control de Calidad                   │
└─────────────────────────────────────────────────────────────┘

┌─ Nueva Inspección ──────────────────────────────────────────┐
│                                                               │
│  Inspector (Número de Nómina): [1001 - Juan Pérez      ▼]  │
│                                                               │
│  Producto:                      [YKH-001 - Neumático... ▼]  │
│                                                               │
│  ┌─ Mediciones ───────────────────────────────────────────┐ │
│  │  Diámetro Pilot (11.58 - 11.71):  [11.65]  ✓ OK      │ │
│  │  Longitud (11.8 - 12.4):          [12.0 ]  ✓ OK      │ │
│  │  Bead (20.51 - 20.91):            [20.70]  ✓ OK      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│                   [Registrar Inspección]                     │
│                                                               │
│  ✓ Inspección registrada exitosamente. Resultado: OK       │
└───────────────────────────────────────────────────────────────┘

┌─ Historial de Inspecciones ─────────────────────────────────┐
│                                                               │
│  ID | Fecha       | Inspector  | Producto | Ø Pilot | ... │ │
│  ───|─────────────|────────────|──────────|─────────|─────  │
│  1  | 17/02 10:30 | Juan Pérez | YKH-001  | 11.65   | OK   │
│  2  | 17/02 10:15 | María G.   | YKH-002  | 11.75   | NG   │
└───────────────────────────────────────────────────────────────┘
```

## 🎨 Visual Feedback

### Input States

**Valid (OK)** - Green background:
```
┌───────────────┐
│   11.65       │  ← Value within range (11.58-11.71)
└───────────────┘
     ↑ Green
```

**Invalid (NG)** - Red background:
```
┌───────────────┐
│   11.50       │  ← Value below minimum (< 11.58)
└───────────────┘
     ↑ Red
```

## 🔄 Workflow

```
1. Select Inspector
        ↓
2. Select Product
        ↓
3. Enter Measurements
        ↓
4. Real-time Validation
   ├─ All OK → Green inputs
   └─ Any NG → Red input(s)
        ↓
5. Submit Form
        ↓
6. Record Saved
        ↓
7. View in History Table
```

## 📊 Sample Data

After running `npm run seed`, you'll have:

### Inspectores:
- 1001 - Juan Pérez
- 1002 - María González
- 1003 - Carlos Rodríguez

### Productos:
- YKH-001 - Neumático 205/55R16
- YKH-002 - Neumático 215/60R17
- YKH-003 - Neumático 225/45R18

## 🎯 Validation Rules

| Measurement     | Min   | Max   | Example OK | Example NG |
|----------------|-------|-------|------------|------------|
| Diámetro Pilot | 11.58 | 11.71 | 11.65      | 11.50      |
| Longitud       | 11.8  | 12.4  | 12.0       | 12.5       |
| Bead           | 20.51 | 20.91 | 20.70      | 20.95      |

**Result Logic:**
- All 3 measurements OK → Result: **OK** ✅
- Any measurement NG → Result: **NG** ❌

## 🔍 Verification

Check if everything is set up correctly:
```bash
npm run verify
```

Expected output:
```
✓ All folders exist
✓ All files present
✓ Dependencies installed
✓ Database initialized
✓ Build successful
✓ SYSTEM VERIFIED CORRECTLY
```

## 🛠️ Development Mode

### Terminal 1 - Watch & Rebuild:
```bash
npm run dev
```
Watches for file changes and automatically rebuilds

### Terminal 2 - Run Electron:
```bash
npm run electron-dev
```
Runs Electron with DevTools open

## 📂 Where Is My Data?

Database location by operating system:

**Windows:**
```
C:\Users\<username>\AppData\Roaming\yokohama-quality-system\yokohama-quality.db
```

**macOS:**
```
/Users/<username>/Library/Application Support/yokohama-quality-system/yokohama-quality.db
```

**Linux:**
```
/home/<username>/.local/share/yokohama-quality-system/yokohama-quality.db
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'better-sqlite3'"
**Solution:**
```bash
npm install
```

### Issue: "dist/renderer.js not found"
**Solution:**
```bash
npm run build
```

### Issue: "No inspectors/products in dropdown"
**Solution:**
```bash
npm run seed
```

### Issue: Electron window is blank
**Solution:**
1. Open DevTools (Ctrl+Shift+I / Cmd+Opt+I)
2. Check console for errors
3. Verify build: `npm run build`
4. Restart: `npm start`

## ⚡ Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run build` | Build production bundle |
| `npm run dev` | Build in watch mode |
| `npm start` | Start the application |
| `npm run electron-dev` | Start with DevTools |
| `npm run seed` | Initialize sample data |
| `npm run verify` | Verify setup |
| `npm run package` | Package for distribution |

## 📖 More Information

- **README.md**: Detailed user guide
- **ARCHITECTURE.md**: Technical documentation
- **IMPLEMENTATION_SUMMARY.md**: Complete implementation details

## 💡 Tips

1. **First Time Setup**: Run commands in order: install → build → seed → start
2. **Development**: Use two terminals (dev + electron-dev) for live reload
3. **Testing**: Use sample data from seed to test functionality
4. **Database**: The DB file is created automatically in user data directory
5. **Debugging**: DevTools are available in development mode

## 🎉 You're Ready!

The system is now ready to digitalize final inspection audits. Start the application with `npm start` and begin creating inspection records!

---

For technical support or questions, refer to the documentation files or check the GitHub repository.
