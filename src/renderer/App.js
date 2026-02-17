import React, { useState, useEffect } from 'react';
import InspeccionForm from './components/InspeccionForm';
import RegistrosTable from './components/RegistrosTable';
import './styles/App.css';

function App() {
  const [registros, setRegistros] = useState([]);
  const [inspectores, setInspectores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar inspectores
      const respInspectores = await window.api.inspectores.getAll();
      if (respInspectores.success) {
        setInspectores(respInspectores.data);
      }

      // Cargar productos
      const respProductos = await window.api.productos.getAll();
      if (respProductos.success) {
        setProductos(respProductos.data);
      }

      // Cargar registros
      const respRegistros = await window.api.registros.getAll();
      if (respRegistros.success) {
        setRegistros(respRegistros.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevaInspeccion = async (data) => {
    try {
      const response = await window.api.registros.create(data);
      if (response.success) {
        await cargarDatos(); // Recargar datos
        return response;
      }
      throw new Error(response.error);
    } catch (error) {
      console.error('Error al crear inspección:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Auditoría de Inspección Final</h1>
        <p className="subtitle">Yokohama Industries - Control de Calidad</p>
      </header>
      
      <main className="app-main">
        <section className="form-section">
          <h2>Nueva Inspección</h2>
          <InspeccionForm 
            inspectores={inspectores}
            productos={productos}
            onSubmit={handleNuevaInspeccion}
          />
        </section>
        
        <section className="table-section">
          <h2>Historial de Inspecciones</h2>
          <RegistrosTable registros={registros} />
        </section>
      </main>
    </div>
  );
}

export default App;
