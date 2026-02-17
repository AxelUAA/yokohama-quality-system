import React from 'react';
import '../styles/RegistrosTable.css';

function RegistrosTable({ registros }) {
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!registros || registros.length === 0) {
    return (
      <div className="no-registros">
        <p>No hay registros de inspección disponibles</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="registros-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Inspector</th>
            <th>Producto</th>
            <th>Diámetro Pilot</th>
            <th>Longitud</th>
            <th>Bead</th>
            <th>Resultado</th>
          </tr>
        </thead>
        <tbody>
          {registros.map(registro => (
            <tr key={registro.id} className={`registro-row ${registro.resultado.toLowerCase()}`}>
              <td>{registro.id}</td>
              <td>{formatearFecha(registro.fecha_inspeccion)}</td>
              <td>{registro.inspector}</td>
              <td>{registro.producto}</td>
              <td>{registro.diametro_pilot}</td>
              <td>{registro.longitud}</td>
              <td>{registro.bead}</td>
              <td>
                <span className={`resultado-badge ${registro.resultado.toLowerCase()}`}>
                  {registro.resultado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegistrosTable;
