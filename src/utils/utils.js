// hydro-station-data/src/utils/utils.js

// Função para mapear os valores dos períodos para novas legendas
export const mapPeriodLabel = (period) => {
    const periodMap = {
        "soma_ult_leituras": "24 HORAS",
        "ultimos 7d": "7 DIAS",
        "ultimos 30d": "30 DIAS",
        "ultimos 12 meses": "12 MESES"
    };
    return periodMap[period] || period;
};

// Mapeamento dos rótulos dos detalhes
export const detailLabels = {
    nome: "Nome",
    bacia: "Bacia",
    subbacia: "Sub-bacia",
    rio: "Rio",
    estado: "Estado",
    municipio: "Município",
    responsavel: "Responsável",
    operadora: "Operadora",
    latitude: "Latitude",
    longitude: "Longitude",
    areadrenagem: "Área de Drenagem",
    tipoestacao: "Tipo de Estação",
    operando: "Operando",
    telemetrica: "Telemétrica",
    climatologica: "Climatológica",
    pluviometro: "Pluviômetro",
    registradorchuva: "Registrador de Chuva",
    escala: "Escala",
    registradornivel: "Registrador de Nível",
    descargaliquida: "Descarga Líquida",
    sedimentos: "Sedimentos",
    qualidadedaagua: "Qualidade da Água",
    tanqueevapo: "Tanque Evaporimétrico"
};
  
// Função para formatar as datas no horário local do usuário
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formattedDate = date.toLocaleString('pt-BR', { timeZone: localTimeZone });
    console.log(`Original: ${dateString}, UTC Date: ${date.toISOString()}, Local Time Zone: ${localTimeZone}, Formatted: ${formattedDate}`);
    return formattedDate;
};
  
// Função para formatar os números
export const formatNumber = (number) => {
    if (number % 1 === 0) {
      return number.toLocaleString('pt-BR'); // Formata números inteiros
    }
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 1 }); // Formata números decimais
};

// Função para tratar valores nulos ou indefinidos
export const safeToString = (value) => {
    return value !== null && value !== undefined ? value.toString() : '';
};