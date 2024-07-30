import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import './css/DataView.css';
import { detailLabels, formatNumber, formatDate, rainSummaryLabels, getDomain } from '../utils/utils';


const DataView = React.memo(({ data, selectedDetails, selectedRainSummary, selectedHydro24h }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chuva');

    const renderHydroData = (hydroData, stationCode, stationName) => {
        if (!selectedHydro24h || !Object.values(selectedHydro24h).some(v => v)) return null;
        if (!hydroData || hydroData.length === 0) return null;

        const chartData = hydroData.map(item => ({
            data: formatDate(item.data),
            chuva: selectedHydro24h.chuva ? parseFloat(item.chuva) : null,
            nivel: selectedHydro24h.nivel ? parseFloat(item.nivel) : null,
            vazao: selectedHydro24h.vazao ? parseFloat(item.vazao) : null,
        }));

        const tabs = [
            { key: 'chuva', label: 'Chuva (mm)' },
            { key: 'nivel', label: 'Nível (cm)' },
            { key: 'vazao', label: 'Vazão (m³/s)' },
        ];

        return (
            <div>
                <h5>Dados Hidrométricos 24h</h5>
                <div className="tabs">
                    {tabs.map(tab => selectedHydro24h[tab.key] && (
                        <button
                            key={tab.key}
                            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <ResponsiveContainer width="101%" height={400}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 30, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="data"
                            tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        />
                        <YAxis
                            domain={getDomain(chartData, activeTab)}
                            tickFormatter={(value) => value.toFixed(2)} />
                        <Tooltip
                            formatter={(value, name) => {
                                switch (name) {
                                    case 'chuva':
                                        return [`${value} mm`, 'Chuva'];
                                    case 'nivel':
                                        return [`${value} cm`, 'Nível'];
                                    case 'vazao':
                                        return [`${value} m³/s`, 'Vazão'];
                                    default:
                                        return [value, name];
                                }
                            }}
                        />
                        {activeTab === 'chuva' && (
                            <Line type="monotone" dataKey="chuva" stroke="#8884d8" dot={true} />
                        )}
                        {activeTab === 'nivel' && (
                            <Line type="monotone" dataKey="nivel" stroke="#82ca9d" dot={true} />
                        )}
                        {activeTab === 'vazao' && (
                            <Line type="monotone" dataKey="vazao" stroke="#ffc658" dot={true} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
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
        if (!selectedRainSummary || !Object.values(selectedRainSummary).some(v => v)) return null;
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
                        {rainSummary
                            .filter(item => selectedRainSummary[item["'soma_ult_leituras'"]])
                            .map((item, index) => (
                                <tr key={index}>
                                    <td>{rainSummaryLabels[item["'soma_ult_leituras'"]] || item["'soma_ult_leituras'"]}</td>
                                    <td style={{ textAlign: 'center' }}>{formatNumber(item.sum_chuva)}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderDetails = (stationCode, stationData) => {
        if (!selectedDetails || !Object.values(selectedDetails).some(v => v)) return null;

        if (!stationData.detalhes || !stationData.detalhes.items || stationData.detalhes.items.length === 0) {
            return <p>Detalhes não disponíveis para esta estação.</p>;
        }

        return (
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
                        {Object.keys(stationData.detalhes.items[0]).map((key) => (
                            selectedDetails[key] && (
                                <tr key={key}>
                                    <td>{detailLabels[key]}</td>
                                    <td style={{ textAlign: 'center' }}>{stationData.detalhes.items[0][key]}</td>
                                </tr>
                            )
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
                    {renderDetails(stationCode, data[stationCode])}
                    {renderHydroData(data[stationCode].hidro_24h?.items, stationCode, data[stationCode].nome)}
                    {renderRainSummary(data[stationCode].chuva_ult?.items, stationCode)}
                </div>
            ))}
        </div>
    );
});

export default DataView;
