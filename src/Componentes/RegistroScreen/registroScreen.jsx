import FormularioRegistro from '../FormularioRegistro/formularioRegistro.jsx';
import './registroScreen.css';
import React from 'react';


function RegistroScreen() {
  return (
    <div className="registro-screen">
        <img src="./corteElectoral.jpg" alt="Logo Corte Electoral" className="logo_corteElectoral"/>
      <h1>Registro</h1>
      <FormularioRegistro />
    </div>
  );
}
export default RegistroScreen;