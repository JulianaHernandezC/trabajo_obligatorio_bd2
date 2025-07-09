export const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    BUSCAR_CIUDADANO: `${API_BASE_URL}/ciudadanos/buscar`,
    REGISTRAR_VOTANTE: `${API_BASE_URL}/ciudadanos/registrar-votante`,
    VOTAR: `${API_BASE_URL}/votacion/votar`,
    LISTAS: `${API_BASE_URL}/votacion/listas`,
    PAPELETAS: `${API_BASE_URL}/votacion/papeletas`,
    VALIDAR_AUTORIDAD: `${API_BASE_URL}/autoridades/validar`,
    
    ESTADISTICAS_DEPARTAMENTOS: (id_eleccion) => `${API_BASE_URL}/votacion/estadisticas/${id_eleccion}/departamentos`,
    ESTADISTICAS_PARTIDOS: (id_eleccion) => `${API_BASE_URL}/votacion/estadisticas/${id_eleccion}/partidos`,
    ESTADISTICAS_DEPARTAMENTO_DETALLE: (id_eleccion, id_departamento) => `${API_BASE_URL}/votacion/estadisticas/${id_eleccion}/departamentos/${id_departamento}`,
    ESTADISTICAS_DEPARTAMENTOS_PARTIDOS: (id_eleccion) => `${API_BASE_URL}/votacion/estadisticas/${id_eleccion}/departamentos-partidos`,
    RANKING_PARTIDOS_DEPARTAMENTO: (id_eleccion, id_departamento) => `${API_BASE_URL}/votacion/estadisticas/${id_eleccion}/departamentos/${id_departamento}/ranking-partidos`,
    RESUMEN_COMPLETO: (id_eleccion) => `${API_BASE_URL}/votacion/estadisticas/${id_eleccion}/resumen-completo`,
    ELECCIONES: `${API_BASE_URL}/votacion/elecciones`
};

export const CURRENT_ELECTION_ID = 1;
export const CURRENT_ESTABLECIMIENTO_ID = 1; 