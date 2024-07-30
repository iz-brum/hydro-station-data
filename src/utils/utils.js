// hydro-station-data/src/utils/utils.js

export const mapPeriodLabel = (period) => {
  const periodMap = {
    "soma_ult_leituras": "24 HORAS",
    "ultimos 7d": "7 DIAS",
    "ultimos 30d": "30 DIAS",
    "ultimos 12 meses": "12 MESES"
  };
  return periodMap[period] || period;
};

export const rainSummaryLabels = {
  'soma_ult_leituras': '24 Horas',
  "ultimos 7d": '7 Dias',
  "ultimos 30d": '30 Dias',
  "ultimos 12 meses": '12 Meses'
};

export const hydroDataLabels = {
  "data": "Data",
  "chuva": "Chuva (mm)",
  "nivel": "Nível (cm)",
  "vazao": "Vazão (m³/s)"
};

// Mapeamento dos rótulos dos detalhes
export const detailLabels = {
  nome: "Nome",
  bacia: "Bacia",
  subbacia: "Sub-bacia",
  rio: "Rio",
  estado: "Estado",
  municipio: "Município",
  latitude: "Latitude",
  longitude: "Longitude",
  escala: "Escala",
  operadora: "Operadora",
  operando: "Operando",
  responsavel: "Responsável",
  telemetrica: "Telemétrica",
  sedimentos: "Sedimentos",
  areadrenagem: "Área de Drenagem",
  climatologica: "Climatológica",
  pluviometro: "Pluviômetro",
  tipoestacao: "Tipo de Estação",
  descargaliquida: "Descarga Líquida",
  qualidadedaagua: "Qualidade da Água",
  registradornivel: "Registrador de Nível",
  registradorchuva: "Registrador de Chuva",
  tanqueevapo: "Tanque Evaporimétrico"
};

// Mapeamento dos rótulos para os cabeçalhos das tabelas
export const headerDictionary = {
  stationCode: "CÓDIGO DA ESTAÇÃO",
  nome: "NOME",
  bacia: "BACIA",
  subbacia: "SUB-BACIA",
  rio: "RIO",
  estado: "ESTADO",
  municipio: "MUNICÍPIO",
  responsavel: "RESPONSÁVEL",
  operadora: "OPERADORA",
  latitude: "LATITUDE",
  longitude: "LONGITUDE",
  areadrenagem: "ÁREA DE DRENAGEM",
  tipoestacao: "TIPO DE ESTAÇÃO",
  operando: "OPERANDO",
  telemetrica: "TELEMETRIA",
  climatologica: "CLIMATOLÓGICA",
  pluviometro: "PLUVIÔMETRO",
  registradorchuva: "REGISTRADOR DE CHUVA",
  escala: "ESCALA",
  registradornivel: "REGISTRADOR DE NÍVEL",
  descargaliquida: "DESCARGA LÍQUIDA",
  sedimentos: "SEDIMENTOS",
  qualidadedaagua: "QUALIDADE DA ÁGUA",
  tanqueevapo: "TANQUE EVAPORIMÉTRICO",
  data: "DATA",
  chuva: "CHUVA (MM)",
  nivel: "NÍVEL (CM)",
  vazao: "VAZÃO (M³/S)",
  'soma_ult_leituras': "PERÍODO",
  sum_chuva: "SOMA DA CHUVA (MM)"
};

// Função para formatar as datas no horário local do usuário
export const formatDate = (dateString) => {
  if (!dateString) return 'Data inválida';  // Verifica se a data é nula ou indefinida
  const date = new Date(dateString);
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return date.toLocaleString('pt-BR', { timeZone: localTimeZone });
};

// Função para formatar os números
export const formatNumber = (number) => {
  if (number === null || number === undefined) return 'N/A';  // Trata valores nulos ou indefinidos
  if (number % 1 === 0) {
    return number.toLocaleString('pt-BR'); // Formata números inteiros
  }
  return number.toLocaleString('pt-BR', { minimumFractionDigits: 1 }); // Formata números decimais
};

// Função para tratar valores nulos ou indefinidos
export const safeToString = (value) => {
  return value !== null && value !== undefined ? value.toString() : '';
};


export const flattenData = (data, selectedData, selectedDetails, selectedHydro24h, selectedRainSummary) => {
  const flattened = [];
  Object.keys(data).forEach(stationCode => {
    const stationData = data[stationCode];
    if (selectedData.detalhes && stationData.detalhes) {
      stationData.detalhes.items.forEach(item => {
        const filteredItem = Object.keys(item).reduce((acc, key) => {
          if (selectedDetails[key]) {
            acc[key] = item[key];
          }
          return acc;
        }, {});
        flattened.push({ category: 'Detalhes', stationCode, ...filteredItem });
      });
    }
    if (selectedData.hidro_24h && stationData.hidro_24h) {
      stationData.hidro_24h.items.forEach(item => {
        const filteredItem = Object.keys(item).reduce((acc, key) => {
          if (selectedHydro24h[key]) {
            acc[key] = item[key];
          }
          return acc;
        }, {});
        flattened.push({ category: 'Hidro 24h', stationCode, ...filteredItem });
      });
    }
    if (selectedData.chuva_ult && stationData.chuva_ult) {
      stationData.chuva_ult.items.forEach(item => {
        const periodKey = item["'soma_ult_leituras'"];
        if (selectedRainSummary[periodKey]) {
          const periodLabel = mapPeriodLabel(periodKey);
          flattened.push({
            category: 'Resumo chuvas',
            stationCode,
            period: periodLabel,
            sum_chuva: item.sum_chuva
          });
        }
      });
    }
  });
  return flattened;
};

export const replaceColumnNames = (data, labelMap) => {
  if (data.length === 0) return data;

  const newHeaders = Object.keys(data[0]).map(header => labelMap[header] || header);
  const newData = data.map(row => {
    return Object.keys(row).reduce((acc, key) => {
      acc[labelMap[key] || key] = row[key];
      return acc;
    }, {});
  });

  return [newHeaders, ...newData.map(row => Object.values(row))];
};

export const setColumnWidths = (worksheet, data) => {
  const objectMaxLength = [];
  for (let i = 0; i < data.length; i++) {
    const value = Object.values(data[i]);
    for (let j = 0; j < value.length; j++) {
      objectMaxLength[j] = Math.max(objectMaxLength[j] || 0, safeToString(value[j]).length);
    }
  }
  worksheet['!cols'] = objectMaxLength.map(width => ({ wch: width + 2 }));
};

export const getDomain = (chartData, key) => {
  // Filtra apenas valores numéricos válidos e maiores ou iguais a zero
  const filteredData = chartData.map(d => d[key]).filter(value => typeof value === 'number' && !isNaN(value) && value >= 0 && value < Number.MAX_SAFE_INTEGER);

  if (filteredData.length === 0) return [0, 1]; // Retorna um domínio padrão se não houver dados válidos

  const min = Math.min(...filteredData);
  const max = Math.max(...filteredData);
  const margin = (max - min) * 0.1;

  // Corrige o domínio caso min e max sejam iguais ou se max é muito alto
  if (min === max || max > Number.MAX_SAFE_INTEGER) return [min - 1, max + 1];

  // Garante que o valor mínimo não seja menor que zero e aplica margem
  return [Math.max(min - margin, 0), max + margin];
};