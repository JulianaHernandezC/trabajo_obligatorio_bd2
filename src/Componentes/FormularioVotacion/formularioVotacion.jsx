import React, { useState } from 'react';
import './formularioVotacion.css';

const partidos = [
  {
    nombre: 'Partido A',
    color: '#e3f2fd',
    intendentes: [{ id: 'a1', nombre: 'Intendente A1', departamento: 'Canelones' }],
    alcaldes: [{ id: 'a2', nombre: 'Alcalde A2', municipio: 'Municipio 2' }],
    ediles: [{ id: 'a3', nombre: 'Lista 101' }]
  },
  {
    nombre: 'Partido B',
    color: '#fce4ec',
    intendentes: [{ id: 'b1', nombre: 'Intendente B1', departamento: 'Canelones' }],
    alcaldes: [{ id: 'b2', nombre: 'Alcalde B2', municipio: 'Municipio 2' }],
    ediles: [{ id: 'b3', nombre: 'Lista 202' }]
  }
];

export default function FormularioVotacion() {
  const [seleccion, setSeleccion] = useState({
    intendente: null,
    alcalde: null,
    edil: null
  });

  const [votoGeneral, setVotoGeneral] = useState(null); // 'blanco' | 'anulado' | null

  const circuitoDetectado = 102;
  const departamentoDetectado = 'Canelones';
  const municipioDetectado = 'Municipio 2';

  const handleSeleccion = (tipo, id) => {
    if (votoGeneral) return;
    setSeleccion(prev => ({ ...prev, [tipo]: id }));
  };

  const seleccionarVotoGeneral = (tipo) => {
    setVotoGeneral(prev => (prev === tipo ? null : tipo));
    if (votoGeneral !== tipo) {
      setSeleccion({ intendente: null, alcalde: null, edil: null });
    }
  };

  const handleSubmit = () => {
    if (votoGeneral) {
      alert(`Voto general: ${votoGeneral.toUpperCase()}`);
    } else {
      alert(`Voto registrado:
        Intendente: ${seleccion.intendente || 'No votó'}
        Alcalde: ${seleccion.alcalde || 'No votó'}
        Edil: ${seleccion.edil || 'No votó'}`);
    }
  };

  return (
    <div className="contenedor">
      <h1>Formulario de Votación</h1>
      <p>
        Circuito: <strong>{circuitoDetectado}</strong><br />
        Departamento: <strong>{departamentoDetectado}</strong><br />
        Municipio: <strong>{municipioDetectado}</strong>
      </p>

      <div className={`columnas ${votoGeneral ? 'deshabilitado' : ''}`}>
        {/* Alcaldes */}
        <div className="columna">
          <h2>Alcaldes</h2>
          {partidos.map(p => (
            <div key={p.nombre} className="partido" style={{ background: p.color }}>
              <h3>{p.nombre}</h3>
              {p.alcaldes
                .filter(c => c.municipio === municipioDetectado)
                .map(c => (
                  <div
                    key={c.id}
                    className={`opcion ${seleccion.alcalde === c.id ? 'seleccionado' : ''}`}
                    onClick={() => handleSeleccion('alcalde', c.id)}
                  >
                    {c.nombre}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Ediles */}
        <div className="columna">
          <h2>Ediles</h2>
          {partidos.map(p => (
            <div key={p.nombre} className="partido" style={{ background: p.color }}>
              <h3>{p.nombre}</h3>
              {p.ediles.map(e => (
                <div
                  key={e.id}
                  className={`opcion ${seleccion.edil === e.id ? 'seleccionado' : ''}`}
                  onClick={() => handleSeleccion('edil', e.id)}
                >
                  {e.nombre}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Intendentes */}
        <div className="columna">
          <h2>Intendentes</h2>
          {partidos.map(p => (
            <div key={p.nombre} className="partido" style={{ background: p.color }}>
              <h3>{p.nombre}</h3>
              {p.intendentes
                .filter(i => i.departamento === departamentoDetectado)
                .map(i => (
                  <div
                    key={i.id}
                    className={`opcion ${seleccion.intendente === i.id ? 'seleccionado' : ''}`}
                    onClick={() => handleSeleccion('intendente', i.id)}
                  >
                    {i.nombre}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="voto-general">
        <div
          className={`opcion especial ${votoGeneral === 'blanco' ? 'seleccionado' : ''}`}
          onClick={() => seleccionarVotoGeneral('blanco')}
        >
          Voto en Blanco
        </div>
        <div
          className={`opcion especial ${votoGeneral === 'anulado' ? 'seleccionado' : ''}`}
          onClick={() => seleccionarVotoGeneral('anulado')}
        >
          Voto Anulado
        </div>
      </div>

      <button onClick={handleSubmit} className="boton">Enviar Voto</button>
    </div>
  );
}
