document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ingreso-form');
  const summary = document.getElementById('validation-summary');
  const confirmationSection = document.getElementById('confirmation-section');
  const resetFormButton = document.getElementById('reset-form');

  const inputs = {
    nombre: document.getElementById('nombre'),
    dni: document.getElementById('dni'),
    email: document.getElementById('email'),
    emailConfirm: document.getElementById('email-confirm'),
    telefono: document.getElementById('telefono'),
    tipoCliente: document.querySelectorAll('input[name="tipo-cliente"]'),
    empresa: document.getElementById('empresa'),
    cuit: document.getElementById('cuit'),
    provincia: document.getElementById('provincia'),
    localidad: document.getElementById('localidad'),
    tipoEquipo: document.getElementById('tipo-equipo'),
    otroEquipo: document.getElementById('otro-equipo'),
    marca: document.getElementById('marca'),
    otraMarca: document.getElementById('otra-marca'),
    modelo: document.getElementById('modelo'),
    ordenCompra: document.getElementById('orden-compra'),
    sistemaOperativo: document.getElementById('sistema-operativo'),
    garantia: document.getElementById('garantia'),
    datosImportantes: document.getElementById('datos-importantes'),
    tipoProblema: document.getElementById('tipo-problema'),
    desdeCuando: document.getElementById('desde-cuando'),
    problemaTipo: document.querySelectorAll('input[name="problema-tipo"]'),
    descripcionProblema: document.getElementById('descripcion-problema'),
    intentoReparar: document.getElementById('intento-reparar'),
    descripcionAnterior: document.getElementById('descripcion-anterior'),
    entrega: document.querySelectorAll('input[name="entrega"]'),
    direccionDomicilio: document.getElementById('direccion-domicilio'),
    presupuesto: document.getElementById('presupuesto'),
    contacto: document.querySelectorAll('input[name="contacto"]'),
    horario: document.getElementById('horario'),
    aceptaDiagnostico: document.getElementById('acepta-diagnostico'),
    aceptaTerminos: document.getElementById('acepta-terminos'),
  };

  const conditionalFields = {
    empresa: document.getElementById('empresa-fields'),
    otroEquipo: document.getElementById('otro-equipo-field'),
    otraMarca: document.getElementById('otra-marca-field'),
    garantia: document.getElementById('garantia-field'),
    descripcionAnterior: document.getElementById('descripcion-anterior-field'),
    direccionDomicilio: document.getElementById('direccion-domicilio-field'),
  };

  const confirmationValues = {
    nombre: document.getElementById('confirm-nombre'),
    dispositivo: document.getElementById('confirm-dispositivo'),
    marca: document.getElementById('confirm-marca'),
    modelo: document.getElementById('confirm-modelo'),
    entrega: document.getElementById('confirm-entrega'),
    orden: document.getElementById('confirm-orden'),
  };

  const toggleVisibility = (element, show) => {
    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
      const inputsToClear = element.querySelectorAll('input, textarea');
      inputsToClear.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
        removeValidation(input);
      });
    }
  };

  const showError = (element, message) => {
    removeValidation(element);
    element.classList.add('campo-error');
    element.classList.remove('campo-ok');
    const error = document.createElement('p');
    error.className = 'error-message';
    error.textContent = message;
    element.parentNode.appendChild(error);
  };

  const removeValidation = (element) => {
    if (!element) return;
    element.classList.remove('campo-error');
    element.classList.remove('campo-ok');
    const existing = element.parentNode.querySelector('.error-message');
    if (existing) existing.remove();
  };

  const markValid = (element) => {
    removeValidation(element);
    element.classList.add('campo-ok');
  };

  const getFirstChecked = (group) => Array.from(group).find(input => input.checked);

  const countDigits = (value) => (value.match(/\d/g) || []).length;

  const validateText = (field, regex, min, max, message) => {
    const value = field.value.trim();
    if (value.length < min || value.length > max || !regex.test(value)) {
      showError(field, message);
      return false;
    }
    markValid(field);
    return true;
  };

  const validate = () => {
    summary.classList.add('hidden');
    summary.textContent = '';
    const errors = [];

    if (!validateText(inputs.nombre, /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/, 5, 80, 'Nombre debe tener solo letras y espacios, entre 5 y 80 caracteres.')) {
      errors.push(inputs.nombre);
    }

    if (!validateText(inputs.dni, /^\d{7,8}$/, 7, 8, 'DNI debe tener 7 u 8 dígitos numéricos.')) {
      errors.push(inputs.dni);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateText(inputs.email, emailRegex, 6, 80, 'Ingresa un correo válido.')) {
      errors.push(inputs.email);
    }

    if (inputs.emailConfirm.value.trim() !== inputs.email.value.trim()) {
      showError(inputs.emailConfirm, 'Los correos deben coincidir exactamente.');
      errors.push(inputs.emailConfirm);
    } else {
      markValid(inputs.emailConfirm);
    }

    const telefonoValue = inputs.telefono.value.trim();
    if (!/^[\d +\-]+$/.test(telefonoValue) || countDigits(telefonoValue) < 8) {
      showError(inputs.telefono, 'Teléfono solo dígitos, guiones, espacios y +, mínimo 8 dígitos.');
      errors.push(inputs.telefono);
    } else {
      markValid(inputs.telefono);
    }

    const tipoClienteSelected = getFirstChecked(inputs.tipoCliente);
    if (!tipoClienteSelected) {
      const fallback = inputs.tipoCliente[0];
      showError(fallback, 'Selecciona el tipo de cliente.');
      errors.push(fallback);
    }

    if (tipoClienteSelected && tipoClienteSelected.value === 'Empresa') {
      if (inputs.empresa.value.trim().length === 0) {
        showError(inputs.empresa, 'Ingresa el nombre de la empresa.');
        errors.push(inputs.empresa);
      } else {
        markValid(inputs.empresa);
      }
      const cuitValue = inputs.cuit.value.trim();
      if (!/^(?:\d{2}-\d{8}-\d|\d{11})$/.test(cuitValue)) {
        showError(inputs.cuit, 'CUIT debe tener formato ##-########-# o 11 dígitos seguidos.');
        errors.push(inputs.cuit);
      } else {
        markValid(inputs.cuit);
      }
    }

    if (inputs.provincia.value === '') {
      showError(inputs.provincia, 'Selecciona una provincia.');
      errors.push(inputs.provincia);
    } else {
      markValid(inputs.provincia);
    }

    if (inputs.localidad.value.trim().length < 2) {
      showError(inputs.localidad, 'Localidad debe tener mínimo 2 caracteres.');
      errors.push(inputs.localidad);
    } else {
      markValid(inputs.localidad);
    }

    if (inputs.tipoEquipo.value === '') {
      showError(inputs.tipoEquipo, 'Selecciona un tipo de dispositivo.');
      errors.push(inputs.tipoEquipo);
    } else {
      markValid(inputs.tipoEquipo);
    }

    if (!conditionalFields.otroEquipo.classList.contains('hidden')) {
      if (inputs.otroEquipo.value.trim().length === 0) {
        showError(inputs.otroEquipo, 'Especifica el otro dispositivo.');
        errors.push(inputs.otroEquipo);
      } else {
        markValid(inputs.otroEquipo);
      }
    }

    if (inputs.marca.value === '') {
      showError(inputs.marca, 'Selecciona una marca.');
      errors.push(inputs.marca);
    } else {
      markValid(inputs.marca);
    }

    if (!conditionalFields.otraMarca.classList.contains('hidden')) {
      if (inputs.otraMarca.value.trim().length === 0) {
        showError(inputs.otraMarca, 'Especifica otra marca.');
        errors.push(inputs.otraMarca);
      } else {
        markValid(inputs.otraMarca);
      }
    }

    if (inputs.modelo.value.trim().length < 2) {
      showError(inputs.modelo, 'Modelo debe tener al menos 2 caracteres.');
      errors.push(inputs.modelo);
    } else {
      markValid(inputs.modelo);
    }

    if (inputs.sistemaOperativo.value === '') {
      showError(inputs.sistemaOperativo, 'Selecciona el sistema operativo.');
      errors.push(inputs.sistemaOperativo);
    } else {
      markValid(inputs.sistemaOperativo);
    }

    if (inputs.garantia.checked) {
      if (inputs.ordenCompra.value.trim().length === 0) {
        showError(inputs.ordenCompra, 'Ingresa el número de orden o fecha de compra.');
        errors.push(inputs.ordenCompra);
      } else {
        markValid(inputs.ordenCompra);
      }
    }

    if (inputs.tipoProblema.value === '') {
      showError(inputs.tipoProblema, 'Selecciona el tipo de problema.');
      errors.push(inputs.tipoProblema);
    } else {
      markValid(inputs.tipoProblema);
    }

    if (inputs.desdeCuando.value === '') {
      showError(inputs.desdeCuando, 'Selecciona desde cuándo ocurre el problema.');
      errors.push(inputs.desdeCuando);
    } else {
      markValid(inputs.desdeCuando);
    }

    if (!getFirstChecked(inputs.problemaTipo)) {
      const fallback = inputs.problemaTipo[0];
      showError(fallback, 'Selecciona si el problema es permanente o intermitente.');
      errors.push(fallback);
    }

    if (inputs.descripcionProblema.value.trim().length < 20 || inputs.descripcionProblema.value.trim().length > 500) {
      showError(inputs.descripcionProblema, 'Describe el problema entre 20 y 500 caracteres.');
      errors.push(inputs.descripcionProblema);
    } else {
      markValid(inputs.descripcionProblema);
    }

    if (inputs.intentoReparar.checked) {
      if (inputs.descripcionAnterior.value.trim().length > 300) {
        showError(inputs.descripcionAnterior, 'La descripción no puede superar 300 caracteres.');
        errors.push(inputs.descripcionAnterior);
      } else {
        markValid(inputs.descripcionAnterior);
      }
    }

    const entregaSeleccionada = getFirstChecked(inputs.entrega);
    if (!entregaSeleccionada) {
      const fallback = inputs.entrega[0];
      showError(fallback, 'Selecciona una modalidad de entrega.');
      errors.push(fallback);
    }

    if (entregaSeleccionada && entregaSeleccionada.value === 'Domicilio') {
      if (inputs.direccionDomicilio.value.trim().length < 10) {
        showError(inputs.direccionDomicilio, 'La dirección debe tener al menos 10 caracteres.');
        errors.push(inputs.direccionDomicilio);
      } else {
        markValid(inputs.direccionDomicilio);
      }
    }

    if (inputs.presupuesto.value === '') {
      showError(inputs.presupuesto, 'Selecciona el presupuesto autorizado.');
      errors.push(inputs.presupuesto);
    } else {
      markValid(inputs.presupuesto);
    }

    if (!Array.from(inputs.contacto).some(input => input.checked)) {
      const fallback = inputs.contacto[0];
      showError(fallback, 'Selecciona al menos una preferencia de contacto.');
      errors.push(fallback);
    }

    if (inputs.horario.value === '') {
      showError(inputs.horario, 'Selecciona el horario preferido.');
      errors.push(inputs.horario);
    } else {
      markValid(inputs.horario);
    }

    if (!inputs.aceptaDiagnostico.checked) {
      showError(inputs.aceptaDiagnostico, 'Debes aceptar que el diagnóstico puede demorar hasta 48 horas hábiles.');
      errors.push(inputs.aceptaDiagnostico);
    }

    if (!inputs.aceptaTerminos.checked) {
      showError(inputs.aceptaTerminos, 'Debes aceptar los términos y condiciones del servicio.');
      errors.push(inputs.aceptaTerminos);
    }

    if (errors.length > 0) {
      summary.textContent = `Hay ${errors.length} error(es) en el formulario. Revisa los campos marcados.`;
      summary.classList.remove('hidden');
      const first = errors[0];
      if (first.focus) first.focus();
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return false;
    }

    displayConfirmation();
    return true;
  };

  const displayConfirmation = () => {
    form.classList.add('hidden');
    confirmationSection.classList.remove('hidden');

    confirmationValues.nombre.textContent = inputs.nombre.value.trim();
    confirmationValues.dispositivo.textContent = inputs.tipoEquipo.value === 'Otro' ? inputs.otroEquipo.value.trim() : inputs.tipoEquipo.value;
    confirmationValues.marca.textContent = inputs.marca.value === 'Otra' ? inputs.otraMarca.value.trim() : inputs.marca.value;
    confirmationValues.modelo.textContent = inputs.modelo.value.trim();
    confirmationValues.entrega.textContent = getFirstChecked(inputs.entrega).value;
    confirmationValues.orden.textContent = `ORD-${Math.floor(Math.random() * 900000) + 100000}`;

    confirmationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetValidation = () => {
    summary.classList.add('hidden');
    summary.textContent = '';
    const allFields = form.querySelectorAll('input, select, textarea');
    allFields.forEach(field => removeValidation(field));
  };

  const toggleClienteEmpresa = () => {
    const selected = getFirstChecked(inputs.tipoCliente);
    toggleVisibility(conditionalFields.empresa, selected && selected.value === 'Empresa');
  };
  const toggleEquipoOtro = () => toggleVisibility(conditionalFields.otroEquipo, inputs.tipoEquipo.value === 'Otro');
  const toggleMarcaOtra = () => toggleVisibility(conditionalFields.otraMarca, inputs.marca.value === 'Otra');
  const toggleGarantia = () => toggleVisibility(conditionalFields.garantia, inputs.garantia.checked);
  const toggleDescripcionAnterior = () => toggleVisibility(conditionalFields.descripcionAnterior, inputs.intentoReparar.checked);
  const toggleDireccion = () => {
    const selected = getFirstChecked(inputs.entrega);
    toggleVisibility(conditionalFields.direccionDomicilio, selected && selected.value === 'Domicilio');
  };

  document.querySelectorAll('input[name="tipo-cliente"]').forEach(input => input.addEventListener('change', () => {
    toggleClienteEmpresa();
    resetValidation();
  }));
  inputs.tipoEquipo.addEventListener('change', () => {
    toggleEquipoOtro();
    resetValidation();
  });
  inputs.marca.addEventListener('change', () => {
    toggleMarcaOtra();
    resetValidation();
  });
  inputs.garantia.addEventListener('change', () => {
    toggleGarantia();
    resetValidation();
  });
  inputs.intentoReparar.addEventListener('change', () => {
    toggleDescripcionAnterior();
    resetValidation();
  });
  document.querySelectorAll('input[name="entrega"]').forEach(input => input.addEventListener('change', () => {
    toggleDireccion();
    resetValidation();
  }));

  const updateTextareaCounter = (field, counter, limit) => {
    const length = field.value.length;
    counter.textContent = length;
    field.classList.remove('campo-error', 'campo-ok');
    if (length > limit * 0.8) {
      field.style.borderColor = '#f39c12';
    } else {
      field.style.borderColor = '';
    }
    if (length >= limit) {
      field.style.borderColor = '#c0392b';
    }
  };

  const problemCounter = document.getElementById('contador-problema');
  const previousCounter = document.getElementById('contador-anterior');
  inputs.descripcionProblema.addEventListener('input', () => updateTextareaCounter(inputs.descripcionProblema, problemCounter, 500));
  inputs.descripcionAnterior.addEventListener('input', () => updateTextareaCounter(inputs.descripcionAnterior, previousCounter, 300));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    resetValidation();
    if (validate()) {
      return;
    }
  });

  form.addEventListener('reset', () => {
    setTimeout(() => {
      resetValidation();
      toggleClienteEmpresa();
      toggleEquipoOtro();
      toggleMarcaOtra();
      toggleGarantia();
      toggleDescripcionAnterior();
      toggleDireccion();
      confirmationSection.classList.add('hidden');
      form.classList.remove('hidden');
    }, 0);
  });

  resetFormButton.addEventListener('click', () => {
    window.location.reload();
  });

  toggleClienteEmpresa();
  toggleEquipoOtro();
  toggleMarcaOtra();
  toggleGarantia();
  toggleDescripcionAnterior();
  toggleDireccion();
});