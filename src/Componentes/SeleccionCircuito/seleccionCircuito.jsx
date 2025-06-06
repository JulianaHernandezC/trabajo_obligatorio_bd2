import FormularioRegistro from '../FormularioRegistro/formularioRegistro.jsx';
import './seleccionCircuito.css';
import React from 'react';


function SeleccionCircuito() {
  return (
    <div className="circuito-screen">
        <img src="./corteElectoral.jpg" alt="Logo Corte Electoral" className="logo_corteElectoral"/>
        <input type="text" placeholder="Ingrese su circuito de votacion correspondiente" className="circuito-input" />
      <button>Votar</button>

      {/* validar circuito de votacion sino marcarlo como observado */}

    </div>
  );
}
export default SeleccionCircuito;