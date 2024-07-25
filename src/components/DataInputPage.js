// hydro-station-data/src/components/DataInputPage.js

import React, { useState, useEffect } from 'react';
import { fetchStationDetails, fetchHydro24h, fetchRainSummary } from '../api/apiService';
import DataView from './DataView';
import './css/DataInputPage.css';
import Popup from './Popup';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { detailLabels, mapPeriodLabel, safeToString } from '../utils/utils';
import { useLoading } from '../context/LoadingContext';
import PreviewModal from './PreviewModal';

const DataInputPage = () => {
  const { setLoading } = useLoading();
  const [codes, setCodes] = useState(localStorage.getItem('codes') || '');
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || null);
  const [selectedData, setSelectedData] = useState(JSON.parse(localStorage.getItem('selectedData')) || {
    detalhes: true,
    hidro_24h: true,
    chuva_ult: true,
  });
  const [selectedDetails, setSelectedDetails] = useState(JSON.parse(localStorage.getItem('selectedDetails')) || {});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [selectedRainSummary, setSelectedRainSummary] = useState(JSON.parse(localStorage.getItem('selectedRainSummary')) || {});

  const memoizedData = {};

  useEffect(() => {
    localStorage.setItem('codes', codes);
    localStorage.setItem('data', JSON.stringify(data));
    localStorage.setItem('selectedData', JSON.stringify(selectedData));
    localStorage.setItem('selectedDetails', JSON.stringify(selectedDetails));
    localStorage.setItem('selectedRainSummary', JSON.stringify(selectedRainSummary));
  }, [codes, data, selectedData, selectedDetails, selectedRainSummary]);

  useEffect(() => {
    const allDetailKeys = Object.keys(detailLabels);
    const initialSelectedDetails = allDetailKeys.reduce((acc, key) => {
      acc[key] = selectedDetails[key] || false;
      return acc;
    }, {});

    setSelectedDetails(initialSelectedDetails);
  }, [selectedDetails]);  // Adicionando selectedDetails como dependência


  const fetchData = async () => {
    if (!codes) {
      setPopupMessage('Por favor, digite os códigos das estações.');
      setShowPopup(true);
      return null;
    }

    if (selectedData.detalhes && !Object.values(selectedDetails).some(v => v)) {
      setPopupMessage('Por favor, selecione pelo menos um detalhe.');
      setShowPopup(true);
      return null;
    }

    if (selectedData.chuva_ult && !Object.values(selectedRainSummary).some(v => v)) {
      setPopupMessage('Por favor, selecione pelo menos um período de chuva.');
      setShowPopup(true);
      return null;
    }

    setLoading(true);
    const codesArray = codes.split(',').map(code => code.trim());
    const fetchedData = {};

    const requests = codesArray.map(async (code) => {
      if (memoizedData[code]) {
        fetchedData[code] = memoizedData[code];
        return;
      }

      fetchedData[code] = {};

      try {
        const details = await fetchStationDetails(code);
        if (details.data && details.data.items && details.data.items[0]) {
          fetchedData[code].nome = details.data.items[0].nome;
          if (selectedData.detalhes) {
            fetchedData[code].detalhes = details.data;
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar detalhes da estação ${code}:`, error);
      }

      if (selectedData.hidro_24h) {
        try {
          const hidro24h = await fetchHydro24h(code);
          fetchedData[code].hidro_24h = hidro24h.data;
        } catch (error) {
          console.error(`Erro ao buscar dados hidrométricos para a estação ${code}:`, error);
        }
      }

      if (selectedData.chuva_ult) {
        try {
          const chuvaUlt = await fetchRainSummary(code);
          fetchedData[code].chuva_ult = chuvaUlt.data;
        } catch (error) {
          console.error(`Erro ao buscar resumo de chuva para a estação ${code}:`, error);
        }
      }

      memoizedData[code] = fetchedData[code];
    });

    await Promise.all(requests);

    setData(fetchedData);
    setLoading(false);
    return fetchedData;
  };

  const handleFetchData = async () => {
    const fetchedData = await fetchData();
    if (fetchedData) {
      setData(fetchedData);
    }
  };

  // Função para obter dados da API e filtrar conforme a seleção do usuário
   // Função para obter dados da API e filtrar conforme a seleção do usuário
  const fetchDataAndFilter = async () => {
    const fetchedData = await fetchData();
    if (!fetchedData) return;

    const filteredData = {};
    for (let code in fetchedData) {
      filteredData[code] = { ...fetchedData[code] };

      if (selectedData.detalhes) {
        filteredData[code].detalhes = {
          items: fetchedData[code].detalhes.items.map((item) =>
            Object.fromEntries(
              Object.entries(item).filter(([key]) => selectedDetails[key])
            )
          )
        };
      } else {
        delete filteredData[code].detalhes;
      }

      if (!selectedData.hidro_24h) {
        delete filteredData[code].hidro_24h;
      }

      if (selectedData.chuva_ult) {
        filteredData[code].chuva_ult = {
          items: fetchedData[code].chuva_ult.items.filter((item) =>
            selectedRainSummary[mapPeriodLabel(item["'soma_ult_leituras'"])]
          )
        };
      } else {
        delete filteredData[code].chuva_ult;
      }
    }

    return filteredData;
  };

  // Handler para visualização de dados
  const handlePreview = async () => {
    const filteredData = await fetchDataAndFilter();
    if (filteredData) {
      const allData = flattenData(filteredData);
      setPreviewData(allData);
      setShowPreview(true);
    }
  };

  const flattenData = (data) => {
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
          flattened.push({ stationCode, category: 'Detalhes', ...filteredItem });
        });
      }
      if (selectedData.hidro_24h && stationData.hidro_24h) {
        stationData.hidro_24h.items.forEach(item => {
          flattened.push({ stationCode, category: 'Hidro 24h', ...item });
        });
      }
      if (selectedData.chuva_ult && stationData.chuva_ult) {
        stationData.chuva_ult.items
          .filter(item => selectedRainSummary[mapPeriodLabel(item["'soma_ult_leituras'"])])
          .forEach(item => {
            flattened.push({ stationCode, category: 'Chuva Últ', ...item });
          });
      }
    });
    return flattened;
  };

  const handleDownloadData = async (format) => {
    const fetchedData = await fetchData();
    if (!fetchedData) return;

    const detalhesData = flattenData(fetchedData, 'detalhes');
    const hidro24hData = flattenData(fetchedData, 'hidro_24h');
    const chuvaUltData = flattenData(fetchedData, 'chuva_ult');

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

    setLoading(false);
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

  const handleCheckboxChange = (e) => {
    setSelectedData({
      ...selectedData,
      [e.target.name]: e.target.checked,
    });
  };

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

  const closePopup = () => {
    setShowPopup(false);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  const confirmDownload = () => {
    setShowPreview(false);
    handleDownloadData();
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
        style={{ resize: 'vertical' }}
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
      <button onClick={handlePreview}>Pré-visualizar Dados</button>
      <button onClick={confirmDownload}>Baixar Dados XLSX</button>
      {data && <DataView
        className="data-view"
        data={data}
        selectedDetails={selectedDetails}
        selectedRainSummary={selectedRainSummary}
      />}

      {showPopup && (
        <Popup message={popupMessage} onClose={closePopup} />
      )}

      {showPreview && (
        <PreviewModal
          data={previewData}
          onConfirm={confirmDownload}
          onCancel={closePreview}
          selectedDetails={selectedDetails}
          selectedRainSummary={selectedRainSummary}
        />
      )}
    </div>
  );
};

export default DataInputPage;

// PROBLEMA ATUAL NA EXIBIÇÃO DOS VALORES NA TABELA 'RESUMO DE CHUVAS' EM DATAVIEW (VERIFICANDO)