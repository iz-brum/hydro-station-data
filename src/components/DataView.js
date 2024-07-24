// hydro-station-data/src/components/DataView.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DataView.css';  // Importa o novo CSS para os cartões de estação
import { detailLabels, mapPeriodLabel, formatNumber, formatDate } from '../utils/utils'; // Importa os utilitários

// Componente para visualizar os dados buscados
const DataView = ({ data, selectedDetails, selectedRainSummary }) => {
    const navigate = useNavigate();

    const renderHydroData = (hydroData) => {
        const dataToShow = hydroData.slice(0, 5); // Mostrar apenas os 10 primeiros dados
        return (
            <div>
                <h5>Dados Hidrométricos 24h</h5>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th style={{ textAlign: 'center' }}>Chuva (mm)</th>
                            <th style={{ textAlign: 'center' }}>Nível (cm)</th>
                            <th style={{ textAlign: 'center' }}>Vazão (m³/s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataToShow.map((item, index) => (
                            <tr key={index}>
                                <td>{formatDate(item.data)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(item.chuva)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(item.nivel)}</td>
                                <td style={{ textAlign: 'center' }}>{formatNumber(item.vazao)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="view-more-button" onClick={() => navigate('/all-hydro-data', { state: { data: hydroData } })}>
                    Ver Mais
                </button>
            </div>
        );
    };

    const filterRainSummary = (rainSummary) => {
        return rainSummary.filter(item => selectedRainSummary[mapPeriodLabel(item["'soma_ult_leituras'"])]);
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
                    {data[stationCode].hidro_24h && renderHydroData(data[stationCode].hidro_24h.items)}
                    {data[stationCode].chuva_ult && (
                        <div>
                            <h5>Resumo de Chuva</h5>
                            <table>
                                <colgroup>
                                    <col style={{ width: '145px' }} />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Período</th>
                                        <th style={{ textAlign: 'center' }}>Soma da Chuva (mm)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterRainSummary(data[stationCode].chuva_ult.items).map((item, index) => (
                                        <tr key={index}>
                                            <td>{mapPeriodLabel(item["'soma_ult_leituras'"])}</td>
                                            <td style={{ textAlign: 'center' }}>{formatNumber(item.sum_chuva)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DataView;
