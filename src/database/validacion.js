// Rangos de validación para mediciones
const RANGOS_VALIDACION = {
  diametro_pilot: {
    min: 11.58,
    max: 11.71,
    nombre: 'Diámetro Pilot'
  },
  longitud: {
    min: 11.8,
    max: 12.4,
    nombre: 'Longitud'
  },
  bead: {
    min: 20.51,
    max: 20.91,
    nombre: 'Bead'
  }
};

/**
 * Valida si un valor está dentro del rango especificado
 * @param {number} valor - Valor a validar
 * @param {number} min - Valor mínimo del rango
 * @param {number} max - Valor máximo del rango
 * @returns {boolean} - true si está dentro del rango, false si no
 */
function validarRango(valor, min, max) {
  return valor >= min && valor <= max;
}

/**
 * Valida todas las mediciones y devuelve el resultado
 * @param {Object} mediciones - Objeto con las mediciones
 * @param {number} mediciones.diametro_pilot - Medición del diámetro pilot
 * @param {number} mediciones.longitud - Medición de la longitud
 * @param {number} mediciones.bead - Medición del bead
 * @returns {Object} - Objeto con el resultado de la validación
 */
function validarMediciones(mediciones) {
  const resultados = {
    diametro_pilot: {
      valor: mediciones.diametro_pilot,
      valido: validarRango(
        mediciones.diametro_pilot,
        RANGOS_VALIDACION.diametro_pilot.min,
        RANGOS_VALIDACION.diametro_pilot.max
      ),
      rango: RANGOS_VALIDACION.diametro_pilot
    },
    longitud: {
      valor: mediciones.longitud,
      valido: validarRango(
        mediciones.longitud,
        RANGOS_VALIDACION.longitud.min,
        RANGOS_VALIDACION.longitud.max
      ),
      rango: RANGOS_VALIDACION.longitud
    },
    bead: {
      valor: mediciones.bead,
      valido: validarRango(
        mediciones.bead,
        RANGOS_VALIDACION.bead.min,
        RANGOS_VALIDACION.bead.max
      ),
      rango: RANGOS_VALIDACION.bead
    }
  };
  
  // Determinar el resultado general
  const todasValidas = resultados.diametro_pilot.valido && 
                       resultados.longitud.valido && 
                       resultados.bead.valido;
  
  return {
    ...resultados,
    resultadoGeneral: todasValidas ? 'OK' : 'NG',
    mensaje: todasValidas 
      ? 'Todas las mediciones están dentro de los rangos permitidos' 
      : 'Una o más mediciones están fuera de los rangos permitidos'
  };
}

module.exports = {
  RANGOS_VALIDACION,
  validarRango,
  validarMediciones
};
