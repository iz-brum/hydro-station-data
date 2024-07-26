// hydro-station-data/src/components/DataView.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DataView.css';
import { detailLabels, formatNumber, formatDate } from '../utils/utils';

const DataView = React.memo(({ data, selectedDetails, selectedRainSummary, selectedHydro24h }) => {
    // console.log('Dados recebidos pelo DataView:', data); 

    const navigate = useNavigate();

    const renderHydroData = (hydroData, stationCode, stationName) => {
        const dataToShow = hydroData.slice(0, 5); // Exibir apenas os primeiros 5 registros
        if (!hydroData || hydroData.length === 0) return null;
        
        return (
            <div>
                <h5>Dados Hidrométricos 24h</h5>
                <table>
                    <thead>
                        <tr>
                            {selectedHydro24h.data && <th>Data</th>}
                            {selectedHydro24h.chuva && <th style={{ textAlign: 'center' }}>Chuva (mm)</th>}
                            {selectedHydro24h.nivel && <th style={{ textAlign: 'center' }}>Nível (cm)</th>}
                            {selectedHydro24h.vazao && <th style={{ textAlign: 'center' }}>Vazão (m³/s)</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((item, index) => (
                            <tr key={index}>
                                {selectedHydro24h.data && <td>{formatDate(item.data)}</td>}
                                {selectedHydro24h.chuva && <td style={{ textAlign: 'center' }}>{formatNumber(item.chuva)}</td>}
                                {selectedHydro24h.nivel && <td style={{ textAlign: 'center' }}>{formatNumber(item.nivel)}</td>}
                                {selectedHydro24h.vazao && <td style={{ textAlign: 'center' }}>{formatNumber(item.vazao)}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button
                    className="view-more-button"
                    onClick={() => navigate('/all-hydro-data', { state: { data: hydroData, stationCode, stationName } })}
                >
                    Ver Mais
                </button>
            </div>
        );
    };

    const renderRainSummary = (rainSummary, stationCode) => {
        if (!rainSummary || rainSummary.length === 0) return null;
    
        console.log(`Resumo de chuva para a estação ${stationCode}:`, rainSummary); // Adicione isto
    
        return (
            <div>
                <h5>Resumo de Chuva</h5>
                <table>
                    <thead>
                        <tr>
                            <th>Período</th>
                            <th style={{ textAlign: 'center' }}>Soma da Chuva (mm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rainSummary
                            .filter(item => selectedRainSummary[item["'soma_ult_leituras'"]])
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{item["'soma_ult_leituras'"]}</td>
                                    <td style={{ textAlign: 'center' }}>{formatNumber(item.sum_chuva)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        );
    };

    if (!data) return null;

    return (
        <div className="stations-container">
            {Object.keys(data).map((stationCode) => (
                <div className="station-card" key={stationCode}>
                    <h4>Estação {stationCode}</h4>
                    <p style={{ marginBottom: '-5px ' }}>{data[stationCode].nome || 'Nome não disponível'}</p>
                    {data[stationCode].detalhes && (
                        <div>
                            <h5>Detalhes</h5>
                            <table>
                                <colgroup>
                                    <col style={{ width: '155px' }} />
                                    <col style={{ width: 'auto' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Chave</th>
                                        <th style={{ textAlign: 'center' }}>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(data[stationCode].detalhes.items[0]).map((key) => (
                                        selectedDetails[key] && (
                                            <tr key={key}>
                                                <td>{detailLabels[key]}</td>
                                                <td style={{ textAlign: 'center' }}>{data[stationCode].detalhes.items[0][key]}</td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {data[stationCode].hidro_24h && renderHydroData(data[stationCode].hidro_24h.items, stationCode, data[stationCode].nome)}
                    {data[stationCode].chuva_ult && renderRainSummary(data[stationCode].chuva_ult.items, stationCode)}
                </div>
            ))}
        </div>
    );
});

export default DataView;