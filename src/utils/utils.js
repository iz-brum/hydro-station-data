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
