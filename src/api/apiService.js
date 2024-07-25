// hydro-station-data/src/api/apiService.js

import axios from 'axios';

const API_BASE_URL = 'https://ows.snirh.gov.br/ords/servicos/hidro/';

// Função para buscar detalhes da estação
export const fetchStationDetails = (code) => {
  return axios.get(`${API_BASE_URL}estacao/${code}`)
    .catch(error => {
      console.error(`Erro ao buscar detalhes da estação ${code}:`, error);
      throw error; // Re-throw para que o chamador lide com o erro
    });
};

// Função para buscar dados hidrométricos das últimas 24 horas
export const fetchHydro24h = (code) => {
  return axios.get(`${API_BASE_URL}estacao/24h/${code}`)
    .catch(error => {
      console.error(`Erro ao buscar dados hidrométricos para a estação ${code}:`, error);
      throw error; // Re-throw para que o chamador lide com o erro
    });
};

// Função para buscar o resumo de chuva
export const fetchRainSummary = (code) => {
  return axios.get(`${API_BASE_URL}chuva_ult/${code}`)
    .catch(error => {
      console.error(`Erro ao buscar resumo de chuva para a estação ${code}:`, error);
      throw error; // Re-throw para que o chamador lide com o erro
    });
};
