import React, { useState, useEffect } from 'react';
import { fetchStationDetails, fetchHydro24h, fetchRainSummary } from '../api/apiService';
import DataView from './DataView';
import './css/DataInputPage.css';
import Popup from './Popup';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { detailLabels, hydroDataLabels, rainSummaryLabels, mapPeriodLabel, replaceColumnNames, setColumnWidths } from '../utils/utils';
import { useLoading } from '../context/LoadingContext';
import PreviewModal from './PreviewModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faFileDownload } from '@fortawesome/free-solid-svg-icons';

const DataInputPage = () => {
  const { setLoading } = useLoading();

  const [codes, setCodes] = useState(localStorage.getItem('codes') || '');
  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')) || null);

  const [selectedData] = useState(JSON.parse(localStorage.getItem('selectedData')) || {
    detalhes: true,
    hidro_24h: true,
    chuva_ult: true,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState([]);

  const initialDetails = Object.keys(detailLabels).reduce((acc, key) => {
    acc[key] = true; // Define todos os filtros como true
    return acc;
  }, {});

  const initialRainSummary = Object.keys(rainSummaryLabels).reduce((acc, key) => {
    acc[key] = true; // Define todos os filtros como true
    return acc;
  }, {});

  const initialHydro24h = Object.keys(hydroDataLabels).reduce((acc, key) => {
    acc[key] = true; // Define todos os filtros como true
    return acc;
  }, {});

  const [selectedDetails, setSelectedDetails] = useState(
    JSON.parse(localStorage.getItem('selectedDetails')) || initialDetails
  );

  const [selectedRainSummary, setSelectedRainSummary] = useState(
    JSON.parse(localStorage.getItem('selectedRainSummary')) || initialRainSummary
  );

  const [selectedHydro24h, setSelectedHydro24h] = useState(
    JSON.parse(localStorage.getItem('selectedHydro24h')) || initialHydro24h
  );


  // Memoized data for caching
  const memoizedData = {};

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, [setLoading]);

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

  const fetchData = async () => {
    if (!codes) {
      setPopupMessage('Por favor, digite os códigos das estações.');
      setShowPopup(true);
      return null;
    }

    const noDetailsSelected = selectedData.detalhes && !Object.values(selectedDetails).some(v => v);
    const noRainSummarySelected = selectedData.chuva_ult && !Object.values(selectedRainSummary).some(v => v);
    const noHydro24hSelected = selectedData.hidro_24h && !Object.values(selectedHydro24h).some(v => v);

    if (noDetailsSelected && noRainSummarySelected && noHydro24hSelected) {
      setPopupMessage('Por favor, selecione pelo menos um filtro em uma das categorias.');
      setShowPopup(true);
      return null;
    }

    setLoading(true);
    const codesArray = codes.split(',').map(code => code.trim()).filter(code => code);
    const fetchedData = {};
    const invalidCodes = new Set();

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
        } else {
          invalidCodes.add(code);
        }
      } catch (error) {
        console.error(`Erro ao buscar detalhes da estação ${code}:`, error);
        invalidCodes.add(code);
      }

      if (selectedData.hidro_24h) {
        try {
          const hidro24h = await fetchHydro24h(code);
          if (hidro24h.data) {
            fetchedData[code].hidro_24h = hidro24h.data;
          } else {
            invalidCodes.add(code);
          }
        } catch (error) {
          console.error(`Erro ao buscar dados hidrométricos para a estação ${code}:`, error);
          invalidCodes.add(code);
        }
      }

      if (selectedData.chuva_ult) {
        try {
          const chuvaUlt = await fetchRainSummary(code);
          if (chuvaUlt.data) {
            fetchedData[code].chuva_ult = chuvaUlt.data;
          } else {
            invalidCodes.add(code);
          }
        } catch (error) {
          console.error(`Erro ao buscar resumo de chuva para a estação ${code}:`, error);
          invalidCodes.add(code);
        }
      }

      memoizedData[code] = fetchedData[code];
    });

    await Promise.all(requests);

    // Remover estações sem dados válidos
    const validData = {};
    Object.keys(fetchedData).forEach(code => {
      if (
        fetchedData[code].detalhes ||
        (fetchedData[code].hidro_24h && fetchedData[code].hidro_24h.items && fetchedData[code].hidro_24h.items.length > 0) ||
        (fetchedData[code].chuva_ult && fetchedData[code].chuva_ult.items && fetchedData[code].chuva_ult.items.length > 0)
      ) {
        validData[code] = fetchedData[code];
      } else {
        invalidCodes.add(code);
      }
    });

    if (invalidCodes.size > 0) {
      setPopupMessage(`Os seguintes códigos de estação são inválidos ou não possuem dados: ${[...invalidCodes].join(', ')}`);
      setShowPopup(true);
    }

    setData(validData);
    setLoading(false);
    return validData;
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

  const handleDownloadData = async () => {
    const fetchedData = await fetchData();
    if (!fetchedData) return;

    const flattenedData = flattenData(fetchedData, selectedData, selectedDetails, selectedHydro24h, selectedRainSummary);

    const labelMap = {
      stationCode: 'Código',
      period: 'Período',
      data: 'Data',
      chuva: 'Chuva',
      nivel: 'Nível (cm)',
      vazao: 'Vazão (m³/s)',
      sum_chuva: 'Soma da Chuva (mm)',
      nome: 'Nome',
      // Adicione outros mapeamentos conforme necessário
    };

    const workbook = XLSX.utils.book_new();

    // Filtrando apenas os dados que foram selecionados e aparecem em DataView e PreviewModal
    const detailsData = flattenedData.filter(d => d.category === 'Detalhes');
    if (detailsData.length > 0 && Object.values(selectedDetails).some(v => v)) {
      const detailsDataWithHeaders = replaceColumnNames(detailsData, labelMap);
      const detailsWorksheet = XLSX.utils.aoa_to_sheet(detailsDataWithHeaders);
      setColumnWidths(detailsWorksheet, detailsData);
      XLSX.utils.book_append_sheet(workbook, detailsWorksheet, 'Detalhes');
    }

    const hydro24hData = flattenedData.filter(d => d.category === 'Hidro 24h');
    if (hydro24hData.length > 0 && Object.values(selectedHydro24h).some(v => v)) {
      const hydro24hDataWithHeaders = replaceColumnNames(hydro24hData, labelMap);
      const hydro24hWorksheet = XLSX.utils.aoa_to_sheet(hydro24hDataWithHeaders);
      setColumnWidths(hydro24hWorksheet, hydro24hData);
      XLSX.utils.book_append_sheet(workbook, hydro24hWorksheet, 'Hidro 24h');
    }

    const rainSummaryData = flattenedData.filter(d => d.category === 'Resumo chuvas');
    if (rainSummaryData.length > 0 && Object.values(selectedRainSummary).some(v => v)) {
      const rainSummaryDataWithHeaders = replaceColumnNames(rainSummaryData, labelMap);
      const rainSummaryWorksheet = XLSX.utils.aoa_to_sheet(rainSummaryDataWithHeaders);
      setColumnWidths(rainSummaryWorksheet, rainSummaryData);
      XLSX.utils.book_append_sheet(workbook, rainSummaryWorksheet, 'Resumo chuvas');
    }

    if (workbook.SheetNames.length === 0) {
      console.warn("Nenhuma categoria de dados selecionada para download.");
      setLoading(false);
      return;
    }

    const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsxData], { type: 'application/octet-stream' });
    saveAs(blob, 'hydro_station_data.xlsx');

    setLoading(false);
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
      <h2>Painel de Controle de Dados</h2>
      
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
                    {rainSummaryLabels[key] || key}
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
                    {hydroDataLabels[key]}
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <label className='list-stations'>
        Lista de códigos de estações:
      </label>
      <textarea
        rows="3"
        cols="50"
        placeholder="Digite os códigos das estações separados por vírgulas"
        value={codes}
        onChange={(e) => setCodes(e.target.value)}
        style={{ resize: 'vertical' }}
      ></textarea>

      <div className="action-icons">
        <div className="icon-container">
          <div className="icon" onClick={handleFetchData}>
            <FontAwesomeIcon icon={faSearch} />
            <span className="tooltip-text">Buscar e Exibir Dados</span>
          </div>
        </div>
        <div className="icon-container">
          <div className="icon" onClick={handlePreview}>
            <FontAwesomeIcon icon={faEye} />
            <span className="tooltip-text">Revisar Dados Antes do Download</span>
          </div>
        </div>
        <div className="icon-container">
          <div className="icon" onClick={confirmDownload}>
            <FontAwesomeIcon icon={faFileDownload} />
            <span className="tooltip-text">Confirmar e Baixar Dados XLSX</span>
          </div>
        </div>
      </div>

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
