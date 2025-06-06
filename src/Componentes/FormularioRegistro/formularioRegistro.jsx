import React, { useState } from 'react';
import './formularioRegistro.css';


function FormularioRegistro() {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    credencial: '',
    fechaNacimiento: '',
    rol: 'Ciudadano',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    // Aquí podrías enviar los datos al backend
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre completo:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Cédula de Identidad:</label>
        <input
          type="text"
          name="cedula"
          value={formData.cedula}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Credencial Cívica:</label>
        <input
          type="text"
          name="credencial"
          value={formData.credencial}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Fecha de nacimiento:</label>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Rol:</label>
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
        >
          <option value="Ciudadano">Ciudadano</option>
          <option value="Presidente de mesa">Presidente de mesa</option>
        </select>
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}

export default FormularioRegistro;
