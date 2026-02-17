import React, { useState, useEffect } from 'react';
import '../styles/InspeccionForm.css';

const RANGOS = {
  diametro_pilot: { min: 11.58, max: 11.71, label: 'Diámetro Pilot' },
  longitud: { min: 11.8, max: 12.4, label: 'Longitud' },
  bead: { min: 20.51, max: 20.91, label: 'Bead' }
};

function InspeccionForm({ inspectores, productos, onSubmit }) {
  const [formData, setFormData] = useState({
    numero_nomina: '',
    producto_id: '',
    diametro_pilot: '',
    longitud: '',
    bead: ''
  });

  const [validacion, setValidacion] = useState({
    diametro_pilot: { valido: null, mensaje: '' },
    longitud: { valido: null, mensaje: '' },
    bead: { valido: null, mensaje: '' }
  });

  const [mensaje, setMensaje] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validar mediciones en tiempo real
  useEffect(() => {
    if (formData.diametro_pilot && formData.longitud && formData.bead) {
      validarMediciones();
    }
  }, [formData.diametro_pilot, formData.longitud, formData.bead]);

  const validarMediciones = async () => {
    try {
      const response = await window.api.validar.mediciones({
        diametro_pilot: parseFloat(formData.diametro_pilot),
        longitud: parseFloat(formData.longitud),
        bead: parseFloat(formData.bead)
      });

      if (response.success) {
        setValidacion({
          diametro_pilot: {
            valido: response.data.diametro_pilot.valido,
            mensaje: response.data.diametro_pilot.valido 
              ? `OK (${RANGOS.diametro_pilot.min}-${RANGOS.diametro_pilot.max})` 
              : `NG - Fuera de rango (${RANGOS.diametro_pilot.min}-${RANGOS.diametro_pilot.max})`
          },
          longitud: {
            valido: response.data.longitud.valido,
            mensaje: response.data.longitud.valido 
              ? `OK (${RANGOS.longitud.min}-${RANGOS.longitud.max})` 
              : `NG - Fuera de rango (${RANGOS.longitud.min}-${RANGOS.longitud.max})`
          },
          bead: {
            valido: response.data.bead.valido,
            mensaje: response.data.bead.valido 
              ? `OK (${RANGOS.bead.min}-${RANGOS.bead.max})` 
              : `NG - Fuera de rango (${RANGOS.bead.min}-${RANGOS.bead.max})`
          }
        });
      }
    } catch (error) {
      console.error('Error al validar mediciones:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMensaje('');

    try {
      // Validar que todos los campos estén llenos
      if (!formData.numero_nomina || !formData.producto_id || 
          !formData.diametro_pilot || !formData.longitud || !formData.bead) {
        setMensaje('Por favor, complete todos los campos');
        setSubmitting(false);
        return;
      }

      const data = {
        numero_nomina: parseInt(formData.numero_nomina),
        producto_id: parseInt(formData.producto_id),
        diametro_pilot: parseFloat(formData.diametro_pilot),
        longitud: parseFloat(formData.longitud),
        bead: parseFloat(formData.bead)
      };

      const response = await onSubmit(data);
      
      if (response.success) {
        const resultado = response.validacion.resultadoGeneral;
        setMensaje(`Inspección registrada exitosamente. Resultado: ${resultado}`);
        
        // Limpiar formulario
        setFormData({
          numero_nomina: '',
          producto_id: '',
          diametro_pilot: '',
          longitud: '',
          bead: ''
        });
        
        setValidacion({
          diametro_pilot: { valido: null, mensaje: '' },
          longitud: { valido: null, mensaje: '' },
          bead: { valido: null, mensaje: '' }
        });
      }
    } catch (error) {
      setMensaje(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getInputClassName = (campo) => {
    if (validacion[campo].valido === null) return 'form-input';
    return validacion[campo].valido ? 'form-input input-ok' : 'form-input input-ng';
  };

  return (
    <form className="inspeccion-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="numero_nomina">Inspector (Número de Nómina)</label>
        <select
          id="numero_nomina"
          name="numero_nomina"
          value={formData.numero_nomina}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Seleccionar inspector</option>
          {inspectores.map(inspector => (
            <option key={inspector.numero_nomina} value={inspector.numero_nomina}>
              {inspector.numero_nomina} - {inspector.nombre} {inspector.apellido}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="producto_id">Producto</label>
        <select
          id="producto_id"
          name="producto_id"
          value={formData.producto_id}
          onChange={handleChange}
          className="form-input"
          required
        >
          <option value="">Seleccionar producto</option>
          {productos.map(producto => (
            <option key={producto.id} value={producto.id}>
              {producto.codigo} - {producto.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mediciones-grid">
        <div className="form-group">
          <label htmlFor="diametro_pilot">
            {RANGOS.diametro_pilot.label}
            <span className="rango-info">
              ({RANGOS.diametro_pilot.min} - {RANGOS.diametro_pilot.max})
            </span>
          </label>
          <input
            type="number"
            id="diametro_pilot"
            name="diametro_pilot"
            value={formData.diametro_pilot}
            onChange={handleChange}
            className={getInputClassName('diametro_pilot')}
            step="0.01"
            required
          />
          {validacion.diametro_pilot.mensaje && (
            <span className={`validacion-mensaje ${validacion.diametro_pilot.valido ? 'ok' : 'ng'}`}>
              {validacion.diametro_pilot.mensaje}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="longitud">
            {RANGOS.longitud.label}
            <span className="rango-info">
              ({RANGOS.longitud.min} - {RANGOS.longitud.max})
            </span>
          </label>
          <input
            type="number"
            id="longitud"
            name="longitud"
            value={formData.longitud}
            onChange={handleChange}
            className={getInputClassName('longitud')}
            step="0.01"
            required
          />
          {validacion.longitud.mensaje && (
            <span className={`validacion-mensaje ${validacion.longitud.valido ? 'ok' : 'ng'}`}>
              {validacion.longitud.mensaje}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="bead">
            {RANGOS.bead.label}
            <span className="rango-info">
              ({RANGOS.bead.min} - {RANGOS.bead.max})
            </span>
          </label>
          <input
            type="number"
            id="bead"
            name="bead"
            value={formData.bead}
            onChange={handleChange}
            className={getInputClassName('bead')}
            step="0.01"
            required
          />
          {validacion.bead.mensaje && (
            <span className={`validacion-mensaje ${validacion.bead.valido ? 'ok' : 'ng'}`}>
              {validacion.bead.mensaje}
            </span>
          )}
        </div>
      </div>

      <button type="submit" className="btn-submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Registrar Inspección'}
      </button>

      {mensaje && (
        <div className={`mensaje ${mensaje.includes('Error') ? 'error' : 'success'}`}>
          {mensaje}
        </div>
      )}
    </form>
  );
}

export default InspeccionForm;
