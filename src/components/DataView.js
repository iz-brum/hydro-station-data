import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'shepherd.js/dist/css/shepherd.css';
import './css/DataView.css';
import { startDataViewTour } from './tourDataView'; // Importe o tour
import { detailLabels, formatNumber, formatDate, rainSummaryLabels, getDomain } from '../utils/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faBars, faCloudRain, faSlidersH } from '@fortawesome/free-solid-svg-icons';

const DataView = React.memo(({ data, selectedDetails, selectedRainSummary, selectedHydro24h }) => {
    const navigate = useNavigate();

    const initialListView = localStorage.getItem('isListView') === 'true';
    const initialGlobalControl = localStorage.getItem('isGlobalControlActive') === 'true';
    const initialLocalActiveTabs = JSON.parse(localStorage.getItem('localActiveTabs')) || {};

    const [isGlobalControlActive, setIsGlobalControlActive] = useState(initialGlobalControl);
    const [globalActiveTab, setGlobalActiveTab] = useState('chuva');
    const [localActiveTabs, setLocalActiveTabs] = useState(initialLocalActiveTabs);
    const [isListView, setIsListView] = useState(initialListView);
    
    useEffect(() => {
        startDataViewTour(); // Inicie o tour quando o componente for montado
    }, []);

    useEffect(() => {
        localStorage.setItem('isListView', isListView);
    }, [isListView]);

    useEffect(() => {
        localStorage.setItem('isGlobalControlActive', isGlobalControlActive);
    }, [isGlobalControlActive]);

    useEffect(() => {
        localStorage.setItem('localActiveTabs', JSON.stringify(localActiveTabs));
    }, [localActiveTabs]);

    const handleViewToggle = (view) => {
        setIsListView(view === 'list');
    };

    const handleTabClick = (stationCode, tabKey) => {
        if (isGlobalControlActive) {
            setGlobalActiveTab(tabKey);
        } else {
            setLocalActiveTabs(prevState => ({
                ...prevState,
                [stationCode]: tabKey
            }));
        }
    };

    const toggleGlobalControl = () => {
        setIsGlobalControlActive(!isGlobalControlActive);
    };

    const renderHydroData = (hydroData, stationCode, stationName) => {
        if (!selectedHydro24h || !Object.values(selectedHydro24h).some(v => v)) return null;
        if (!hydroData || hydroData.length === 0) return null;

        const activeTab = isGlobalControlActive ? globalActiveTab : localActiveTabs[stationCode] || 'chuva';
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
            <div className="hydro-data section">
                <h5>Dados Hidrométricos 24h</h5>
                <div className='background-hrydo-24h'>
                    <div className="tabs">
                        {tabs.map(tab => selectedHydro24h[tab.key] && (
                            <button
                                key={tab.key}
                                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => handleTabClick(stationCode, tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData.slice().reverse()} margin={{ left: 30, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="data"
                                    tickFormatter={(tick) =>
                                        tick ? new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : ''
                                    }
                                />
                                <YAxis
                                    domain={getDomain(chartData, activeTab) || [0, 1]}
                                    tickFormatter={(value) => (value !== null && value !== undefined ? value.toFixed(2) : '0')} />
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
                    </div>
                    <button
                        className="view-more-button"
                        onClick={() => navigate('/all-hydro-data', { state: { data: hydroData, stationCode, stationName } })}
                    >
                        Ver Mais
                    </button>
                </div>
            </div>
        );
    };

    const renderRainSummary = (rainSummary, stationCode) => {
        if (!selectedRainSummary || !Object.values(selectedRainSummary).some(v => v)) return null;
        if (!rainSummary || rainSummary.length === 0) return null;

        return (
            <div className="rain-summary section">
                <h5>Resumo de Chuva</h5>
                <div className="rain-summary-grid">
                    {rainSummary
                        .filter(item => selectedRainSummary[item["'soma_ult_leituras'"]])
                        .map((item, index) => (
                            <div className="rain-summary-item" key={index}>
                                <div className="rain-top">
                                    <FontAwesomeIcon icon={faCloudRain} className="rain-icon animated-rain" />
                                    <span className="rain-period">{rainSummaryLabels[item["'soma_ult_leituras'"]] || item["'soma_ult_leituras'"]}</span>
                                </div>
                                <div className="rain-value">
                                    <span>{formatNumber(item.sum_chuva)}</span> mm
                                </div>
                            </div>

                        ))}
                </div>
            </div>
        );
    };

    const renderDetails = (stationCode, stationData) => {
        if (!selectedDetails || !Object.values(selectedDetails).some(v => v)) return null;

        if (!stationData.detalhes || !stationData.detalhes.items || stationData.detalhes.items.length === 0) {
            return <p>Detalhes não disponíveis para esta estação.</p>;
        }

        return (
            <div className="details section">
                <h5>Ficha da estação</h5>
                <div className="details-grid">
                    {Object.keys(stationData.detalhes.items[0]).map((key) => (
                        selectedDetails[key] && (
                            <div className="detail-item" key={key}>
                                <strong>{detailLabels[key] || key}</strong>
                                <span>{stationData.detalhes.items[0][key] || 'N/A'}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>
        );
    };

    if (!data) return null;

    return (
        <div className="data-view-container">
            <div className="toggle-view-icons">
                <div className="icon-container">
                    <div className={`icon ${isListView ? 'icon-visible' : 'icon-hidden'}`} onClick={() => handleViewToggle('grid')}>
                        <FontAwesomeIcon icon={faThLarge} />
                        <span className="tooltip-text">Visualização em Grade</span>
                    </div>
                    <div className={`icon ${!isListView ? 'icon-visible' : 'icon-hidden'}`} onClick={() => handleViewToggle('list')}>
                        <FontAwesomeIcon icon={faBars} />
                        <span className="tooltip-text">Visualização em Lista</span>
                    </div>
                </div>
                <div className="icon-container">
                    <div className={`icon`} onClick={toggleGlobalControl} id='grafico_control'>
                        <FontAwesomeIcon icon={faSlidersH} />
                        <span className="tooltip-text">{isGlobalControlActive ? 'Ativar Controle Indiviual De Gráficos' : 'Desativar Controle Indiviual De Gráficos'}</span>
                    </div>
                </div>
            </div>
            <div className={`stations-container ${isListView ? 'list-view' : 'grid-view'}`}>
                {Object.keys(data).map((stationCode) => (
                    <div className="station-card" key={stationCode}>
                        <h4>{data[stationCode].nome || 'Nome não disponível'}</h4>
                        <p>{stationCode}</p>
                        {renderDetails(stationCode, data[stationCode])}
                        {renderRainSummary(data[stationCode].chuva_ult?.items, stationCode)}
                        {renderHydroData(data[stationCode].hidro_24h?.items, stationCode, data[stationCode].nome)}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default DataView;
