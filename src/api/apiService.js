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

// Função para buscar estações com ou sem query
export const fetchStations = async (offset = 0, limit = 25) => {
  return axios.get(`${API_BASE_URL}estacao`, {
    params: { offset, limit }
  }).catch(error => {
    console.error('Erro ao buscar estações:', error);
    throw error;
  });
};


// Função para buscar estações globalmente com base no nome ou código
export const searchStations = async (query) => {
  return axios.get(`${API_BASE_URL}/estacao/`, {
    params: { nome_ou_codigo: query } // Substitua 'nome_ou_codigo' pelo nome real do parâmetro esperado pela API
  }).catch(error => {
    console.error('Erro ao buscar estações:', error);
    throw error;
  });
};
