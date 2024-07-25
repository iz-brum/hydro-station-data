import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/DataView.css';
import { detailLabels, mapPeriodLabel, formatNumber, formatDate } from '../utils/utils';

const DataView = ({ data, selectedDetails, selectedRainSummary }) => {
    const navigate = useNavigate();

    const renderHydroData = (hydroData, stationCode, stationName) => {
        const dataToShow = hydroData.slice(0, 5); // Exibir apenas os primeiros 5 registros
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
                        {rainSummary.map((item, index) => (
                            <tr key={index}>
                                <td>{mapPeriodLabel(item["'soma_ult_leituras'"])}</td>
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
};

export default DataView;

// FILTROS DESMARCADOS EM RESUMO DE CHUVAS CONTINUAM A SEREM RENDERIZADOS EM DATAVIEW.