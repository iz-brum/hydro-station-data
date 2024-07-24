// src/components/apiService.js

import axios from 'axios';

const API_BASE_URL = 'https://ows.snirh.gov.br/ords/servicos/hidro/';

// Função para buscar detalhes da estação
export const fetchStationDetails = (code) => {
  return axios.get(`${API_BASE_URL}estacao/${code}`);
};

// Função para buscar dados hidrométricos das últimas 24 horas
export const fetchHydro24h = (code) => {
  return axios.get(`${API_BASE_URL}estacao/24h/${code}`);
};

// Função para buscar o resumo de chuva
export const fetchRainSummary = (code) => {
  return axios.get(`${API_BASE_URL}chuva_ult/${code}`);
};
