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
  const [selectedHydro24h, setSelectedHydro24h] = useState(JSON.parse(localStorage.getItem('selectedHydro24h')) || {});

  const memoizedData = {};

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

  useEffect(() => {
    localStorage.setItem('selectedHydro24h', JSON.stringify(selectedHydro24h));
  }, [selectedHydro24h]);

  useEffect(() => {
    const allDetailKeys = Object.keys(detailLabels);
    const initialSelectedDetails = allDetailKeys.reduce((acc, key) => {
      acc[key] = selectedDetails[key] || false;
      return acc;
    }, {});
    setSelectedDetails(initialSelectedDetails);
  }, []);

  useEffect(() => {
    const allRainKeys = [
      'soma_ult_leituras', // As chaves devem incluir as aspas simples extras
      "ultimos 7d",
      "ultimos 30d",
      "ultimos 12 meses"
    ];
    const initialSelectedRainSummary = allRainKeys.reduce((acc, key) => {
      acc[key] = selectedRainSummary[key] || false;
      return acc;
    }, {});
    setSelectedRainSummary(initialSelectedRainSummary);
  }, []);


  useEffect(() => {
    const allHydro24hKeys = [
      "data",
      "chuva",
      "nivel",
      "vazao"
    ];
    const initialSelectedHydro24h = allHydro24hKeys.reduce((acc, key) => {
      acc[key] = selectedHydro24h[key] || false;
      return acc;
    }, {});
    setSelectedHydro24h(initialSelectedHydro24h);
  }, []);

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
        // console.log(`Detalhes da estação ${code}:`, details.data);
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
          // console.log(`Dados hidrométricos 24h da estação ${code}:`, hidro24h.data);
          fetchedData[code].hidro_24h = hidro24h.data;
        } catch (error) {
          console.error(`Erro ao buscar dados hidrométricos para a estação ${code}:`, error);
        }
      }

      if (selectedData.chuva_ult) {
        try {
          const chuvaUlt = await fetchRainSummary(code);
          // console.log(`Resumo de chuva da estação ${code}:`, chuvaUlt.data);
          fetchedData[code].chuva_ult = chuvaUlt.data;
        } catch (error) {
          console.error(`Erro ao buscar resumo de chuva para a estação ${code}:`, error);
        }
      }

      memoizedData[code] = fetchedData[code];
    });

    await Promise.all(requests);

    // console.log('Dados completos:', fetchedData);
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

      if (selectedData.hidro_24h) {
        filteredData[code].hidro_24h = {
          items: fetchedData[code].hidro_24h.items.map((item) =>
            Object.fromEntries(
              Object.entries(item).filter(([key]) => selectedHydro24h[key])
            )
          )
        };
      } else {
        delete filteredData[code].hidro_24h;
      }

      if (selectedData.chuva_ult) {
        filteredData[code].chuva_ult = {
          items: fetchedData[code].chuva_ult.items.filter((item) => {
            const periodKey = item["'soma_ult_leituras'"];
            // const periodLabel = mapPeriodLabel(periodKey);
            return selectedRainSummary[periodKey];
          })
        };
      } else {
        delete filteredData[code].chuva_ult;
      }

    }

    console.log('Dados filtrados:', filteredData);
    return filteredData;
  };


  const handlePreview = async () => {
    const filteredData = await fetchDataAndFilter();
    if (filteredData) {
      const allData = flattenData(filteredData);
      console.log('Dados para pré-visualização:', allData);
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
          flattened.push({ stationCode, category: 'Hidro 24h', ...filteredItem });
        });
      }
      if (selectedData.chuva_ult && stationData.chuva_ult) {
        stationData.chuva_ult.items.forEach(item => {
          const periodKey = item["'soma_ult_leituras'"];
          if (selectedRainSummary[periodKey]) {
            const periodLabel = mapPeriodLabel(periodKey);
            flattened.push({
              category: 'Chuva Últ',
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

  //OK 1/2
  const handleDownloadData = async (format) => {
    const fetchedData = await fetchData();
    if (!fetchedData) return;

    const detalhesData = flattenData(fetchedData).filter(d => d.category === 'Detalhes');
    const hidro24hData = flattenData(fetchedData).filter(d => d.category === 'Hidro 24h');
    const chuvaUltData = flattenData(fetchedData).filter(d => d.category === 'Chuva Últ');

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

  const handleHydro24hCheckboxChange = (e) => {
    setSelectedHydro24h({
      ...selectedHydro24h,
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

  const selectAll = (category, isSelected) => {
    if (category === 'detalhes') {
      const newSelectedDetails = Object.keys(selectedDetails).reduce((acc, key) => {
        acc[key] = isSelected;
        return acc;
      }, {});
      setSelectedDetails(newSelectedDetails);
    } else if (category === 'chuva_ult') {
      const newSelectedRainSummary = Object.keys(selectedRainSummary).reduce((acc, key) => {
        acc[key] = isSelected;
        return acc;
      }, {});
      setSelectedRainSummary(newSelectedRainSummary);
    } else if (category === 'hidro_24h') {
      const newSelectedHydro24h = Object.keys(selectedHydro24h).reduce((acc, key) => {
        acc[key] = isSelected;
        return acc;
      }, {});
      setSelectedHydro24h(newSelectedHydro24h);
    }
  };

  // Estados de visibilidade
  const [showDetails, setShowDetails] = useState(true);
  const [showRainSummary, setShowRainSummary] = useState(true);
  const [showHydro24h, setShowHydro24h] = useState(true);

  const toggleVisibility = (category) => {
    if (category === 'detalhes') {
      setShowDetails(prev => !prev);
    } else if (category === 'chuva_ult') {
      setShowRainSummary(prev => !prev);
    } else if (category === 'hidro_24h') {
      setShowHydro24h(prev => !prev);
    }
  };

  return (
    <div className="container">
      <h2>Página de Entrada de Dados</h2>
      <label className='list-stations'>
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
      <div className="filters-container">
        <div className="category">
          <h3 onClick={() => toggleVisibility('detalhes')}>Ficha da estação</h3>
          {showDetails && (
            <>
              <div className="select-buttons">
                <button onClick={() => selectAll('detalhes', true)}>Selecionar todos</button>
                <button onClick={() => selectAll('detalhes', false)}>Desmarcar todos</button>
              </div>
              <div className="filters">
                {Object.keys(selectedDetails).filter(key => key !== 'codigo').map((key) => (
                  <label key={key} className='label-checkbox'>
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
            </>
          )}
        </div>

        <div className="category">
          <h3 onClick={() => toggleVisibility('chuva_ult')}>Resumo de Chuva</h3>
          {showRainSummary && (
            <>
              <div className="select-buttons">
                <button onClick={() => selectAll('chuva_ult', true)}>Selecionar todos</button>
                <button onClick={() => selectAll('chuva_ult', false)}>Desmarcar todos</button>
              </div>
              <div className="filters">
                {Object.keys(selectedRainSummary).map((key) => (
                  <label key={key} className='label-checkbox'>
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
            </>
          )}
        </div>

        <div className="category">
          <h3 onClick={() => toggleVisibility('hidro_24h')}>Dados Hidrométricos 24h</h3>
          {showHydro24h && (
            <>
              <div className="select-buttons">
                <button onClick={() => selectAll('hidro_24h', true)}>Selecionar todos</button>
                <button onClick={() => selectAll('hidro_24h', false)}>Desmarcar todos</button>
              </div>
              <div className="filters">
                {Object.keys(selectedHydro24h).map((key) => (
                  <label key={key} className='label-checkbox'>
                    <input
                      type="checkbox"
                      name={key}
                      className="hydro-checkbox"
                      checked={selectedHydro24h[key]}
                      onChange={handleHydro24hCheckboxChange}
                    />
                    {key}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <button onClick={handleFetchData}>Buscar e Exibir Dados</button>
      <button onClick={handlePreview}>Revisar Dados Antes do Download</button>
      <button onClick={confirmDownload}>Confirmar e Baixar Dados XLSX</button>
      {data && <DataView
        className="data-view"
        data={data}
        selectedDetails={selectedDetails}
        selectedRainSummary={selectedRainSummary}
        selectedHydro24h={selectedHydro24h}
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
          selectedHydro24h={selectedHydro24h}
        />
      )}
    </div>
  );
};

export default DataInputPage;
