// hydro-station-data/src/components/DataInputPage.js

import React, { useState, useEffect } from 'react';
import { fetchStationDetails, fetchHydro24h, fetchRainSummary } from '../api/apiService';
import DataView from './DataView';
import './css/DataInputPage.css';  // Importa o CSS específico para DataInputPage
import Popup from './Popup';  // Importa o componente de pop-up
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { detailLabels, mapPeriodLabel, safeToString } from '../utils/utils'; // Importa o mapeamento e a função de mapeamento
import { useLoading } from '../context/LoadingContext'; // Importa o contexto de carregamento



const DataInputPage = () => {
  const { setLoading } = useLoading();
  const [codes, setCodes] = useState(localStorage.getItem('codes') || '');  // Estado para armazenar os códigos das estações
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || null);  // Estado para armazenar os dados das estações
  const [selectedData, setSelectedData] = useState(JSON.parse(localStorage.getItem('selectedData')) || {  // Estado para armazenar as opções de dados selecionadas
    detalhes: true,
    hidro_24h: true,
    chuva_ult: true,
  });

  const [selectedDetails, setSelectedDetails] = useState(JSON.parse(localStorage.getItem('selectedDetails')) || {
    // codigo: true,
    nome: true,
    bacia: true,
    subbacia: true,
    rio: true,
    estado: true,
    municipio: true,
    responsavel: true,
    operadora: true,
    latitude: true,
    longitude: true,
    areadrenagem: true,
    tipoestacao: true,
    operando: true,
    telemetrica: true,
    climatologica: true,
    pluviometro: true,
    registradorchuva: true,
    escala: true,
    registradornivel: true,
    descargaliquida: true,
    sedimentos: true,
    qualidadedaagua: true,
    tanqueevapo: true,
  });

  const [showPopup, setShowPopup] = useState(false); // Estado para controlar a exibição do pop-up
  const [popupMessage, setPopupMessage] = useState(''); // Mensagem do pop-up

  const [selectedRainSummary, setSelectedRainSummary] = useState(JSON.parse(localStorage.getItem('selectedRainSummary')) || {
    "24 HORAS": true,
    "7 DIAS": true,
    "30 DIAS": true,
    "12 MESES": true
  });

  // Salvar estados no localStorage sempre que forem atualizados
  useEffect(() => {
    localStorage.setItem('codes', codes);
  }, [codes]);

  useEffect(() => {
    localStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('selectedData', JSON.stringify(selectedData));
  }, [selectedData]);

  useEffect(() => {
    localStorage.setItem('selectedDetails', JSON.stringify(selectedDetails));
  }, [selectedDetails]);

  useEffect(() => {
    localStorage.setItem('selectedRainSummary', JSON.stringify(selectedRainSummary));
  }, [selectedRainSummary]);

  // Função para buscar os dados das estações
  const handleFetchData = async () => {
    if (!codes) {
      setPopupMessage('Por favor, digite os códigos das estações.');
      setShowPopup(true);
      return;
    }

    if (selectedData.detalhes && !Object.values(selectedDetails).some(v => v)) {
      setPopupMessage('Por favor, selecione pelo menos um detalhe.');
      setShowPopup(true);
      return;
    }

    if (selectedData.chuva_ult && !Object.values(selectedRainSummary).some(v => v)) {
      setPopupMessage('Por favor, selecione pelo menos um período de chuva.');
      setShowPopup(true);
      return;
    }

    setLoading(true); // Ativa o carregamento
    const codesArray = codes.split(',').map(code => code.trim());
    const fetchedData = {};

    for (let code of codesArray) {
      fetchedData[code] = {};

      // Sempre buscar o nome da estação
      const details = await fetchStationDetails(code);
      if (details.data && details.data.items && details.data.items[0]) {
        fetchedData[code].nome = details.data.items[0].nome;
      }

      if (selectedData.detalhes) {
        const details = await fetchStationDetails(code);
        fetchedData[code].detalhes = details.data;
      }

      if (selectedData.hidro_24h) {
        const hidro24h = await fetchHydro24h(code);
        fetchedData[code].hidro_24h = hidro24h.data;
      }

      if (selectedData.chuva_ult) {
        const chuvaUlt = await fetchRainSummary(code);
        fetchedData[code].chuva_ult = chuvaUlt.data;
      }
    }

    setData(fetchedData);  // Atualiza o estado com os dados buscados
    setLoading(false); // Desativa o carregamento

  };

  // Função para baixar os dados como arquivo CSV ou XLSX, OK
  // DOWLOAD APENAS DE ARQUIVOS NÃO VAZIOS OK
  const handleDownloadData = (format) => {
    setLoading(true); // Ativa o carregamento
    if (!data) return;

    const flattenData = (data, type) => {
      const flattened = [];
      Object.keys(data).forEach(stationCode => {
        const stationData = data[stationCode];
        if (type === 'detalhes' && stationData.detalhes) {
          stationData.detalhes.items.forEach(item => {
            const filteredItem = Object.keys(item).reduce((acc, key) => {
              if (selectedDetails[key]) {
                acc[key] = item[key];
              }
              return acc;
            }, {});
            flattened.push({ stationCode, category: 'Detalhes', ...filteredItem });
          });
        } else if (type === 'hidro_24h' && stationData.hidro_24h) {
          stationData.hidro_24h.items.forEach(item => {
            flattened.push({ stationCode, category: 'Hidro 24h', ...item });
          });
        } else if (type === 'chuva_ult' && stationData.chuva_ult) {
          stationData.chuva_ult.items
            .filter(item => selectedRainSummary[mapPeriodLabel(item["'soma_ult_leituras'"])])
            .forEach(item => {
              flattened.push({ stationCode, category: 'Chuva Últ', ...item });
            });
        }
      });
      return flattened;
    };

    const setColumnWidths = (worksheet, data) => {
      const objectMaxLength = [];
      for (let i = 0; i < data.length; i++) {
        const value = Object.values(data[i]);
        for (let j = 0; j < value.length; j++) {
          objectMaxLength[j] = Math.max(objectMaxLength[j] || 0, safeToString(value[j]).length);
        }
      }
      worksheet['!cols'] = objectMaxLength.map(width => ({ wch: width + 2 }));
    };

    if (format === 'csv') {
      const detalhesData = flattenData(data, 'detalhes');
      const hidro24hData = flattenData(data, 'hidro_24h');
      const chuvaUltData = flattenData(data, 'chuva_ult');

      const allData = [...detalhesData, ...hidro24hData, ...chuvaUltData];
      const csv = Papa.unparse(allData);

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'hydro_station_data.csv');
    } else if (format === 'xlsx') {
      const detalhesData = flattenData(data, 'detalhes');
      const hidro24hData = flattenData(data, 'hidro_24h');
      const chuvaUltData = flattenData(data, 'chuva_ult');

      const workbook = XLSX.utils.book_new();

      if (detalhesData.length > 0) {
        const detalhesWorksheet = XLSX.utils.json_to_sheet(detalhesData);
        setColumnWidths(detalhesWorksheet, detalhesData);
        XLSX.utils.book_append_sheet(workbook, detalhesWorksheet, 'Detalhes');
      }

      if (hidro24hData.length > 0) {
        const hidro24hWorksheet = XLSX.utils.json_to_sheet(hidro24hData);
        setColumnWidths(hidro24hWorksheet, hidro24hData);
        XLSX.utils.book_append_sheet(workbook, hidro24hWorksheet, 'Hidro 24h');
      }

      if (chuvaUltData.length > 0) {
        const chuvaUltWorksheet = XLSX.utils.json_to_sheet(chuvaUltData);
        setColumnWidths(chuvaUltWorksheet, chuvaUltData);
        XLSX.utils.book_append_sheet(workbook, chuvaUltWorksheet, 'Chuva Últ');
      }

      const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([xlsxData], { type: 'application/octet-stream' });
      saveAs(blob, 'hydro_station_data.xlsx');
    }
    setLoading(false); // Desativa o carregamento
  };


  // Função para lidar com mudanças nas opções selecionadas
  const handleCheckboxChange = (e) => {
    setSelectedData({
      ...selectedData,
      [e.target.name]: e.target.checked,
    });
  };

  // Função para lidar com mudanças nos sub-filtros
  const handleDetailsCheckboxChange = (e) => {
    setSelectedDetails({
      ...selectedDetails,
      [e.target.name]: e.target.checked,
    });
  };

  const handleRainSummaryCheckboxChange = (e) => {
    setSelectedRainSummary({
      ...selectedRainSummary,
      [e.target.name]: e.target.checked,
    });
  };

  // Função para fechar o pop-up
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="container">
      <h2>Página de Entrada de Dados</h2>
      <label>
        Lista de códigos de estações:
      </label>
      <textarea
        rows="5"
        cols="50"
        placeholder="Digite os códigos das estações separados por vírgulas"
        value={codes}
        onChange={(e) => setCodes(e.target.value)}
        style={{ resize: 'vertical' }}  // Permitir redimensionamento vertical
      ></textarea>
      <div style={{ marginBottom: '15px' }}>
        <label className="label-checkbox">
          <input
            type="checkbox"
            name="detalhes"
            className="details-checkbox"
            checked={selectedData.detalhes}
            onChange={handleCheckboxChange}
          />
          Detalhes
        </label>
        {selectedData.detalhes && (
          <div className="details-filters">
            {Object.keys(selectedDetails).filter(key => key !== 'codigo').map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  className="details-checkbox"
                  checked={selectedDetails[key]}
                  onChange={handleDetailsCheckboxChange}
                />
                {detailLabels[key]}
              </label>
            ))}
          </div>
        )}
        <label className="label-checkbox">
          <input
            type="checkbox"
            name="chuva_ult"
            className="rain-checkbox"
            checked={selectedData.chuva_ult}
            onChange={handleCheckboxChange}
          />
          Resumo de Chuva
        </label>
        {selectedData.chuva_ult && (
          <div className="details-filters">
            {Object.keys(selectedRainSummary).map((key) => (
              <label key={key}>
                <input
                  type="checkbox"
                  name={key}
                  className="rain-checkbox"
                  checked={selectedRainSummary[key]}
                  onChange={handleRainSummaryCheckboxChange}
                />
                {key}
              </label>
            ))}
          </div>
        )}
        <label className="label-checkbox">
          <input
            type="checkbox"
            name="hidro_24h"
            className="hydro-checkbox"
            checked={selectedData.hidro_24h}
            onChange={handleCheckboxChange}
          />
          Dados Hidrométricos 24h
        </label>
      </div>
      <button onClick={handleFetchData}>Visualizar Dados</button>
      <button onClick={() => handleDownloadData('csv')}>Baixar Dados CSV</button>
      <button onClick={() => handleDownloadData('xlsx')}>Baixar Dados XLSX</button>
      {data && <DataView
        className="data-view"
        data={data}
        selectedDetails={selectedDetails}
        selectedRainSummary={selectedRainSummary}
      />}

      {showPopup && (
        <Popup message={popupMessage} onClose={closePopup} />
      )}
    </div>
  );
};

export default DataInputPage;
