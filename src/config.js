export const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    BUSCAR_CIUDADANO: `${API_BASE_URL}/ciudadanos/buscar`,
    REGISTRAR_VOTANTE: `${API_BASE_URL}/registrar-votante`,
    VOTAR: `${API_BASE_URL}/votar`,
    LISTAS: `${API_BASE_URL}/listas`,
    PAPELETAS: `${API_BASE_URL}/papeletas`,
    VALIDAR_AUTORIDAD: `${API_BASE_URL}/autoridades/validar`
};

export const CURRENT_ELECTION_ID = 1;
export const CURRENT_ESTABLECIMIENTO_ID = 1; 