import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatDate, getDomain } from '../utils/utils';
import './css/DataView.css';

const AllHydroDataPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, stationCode, stationName } = location.state || {};

    if (!data) {
        return <div>Nenhum dado disponível.</div>;
    }

    const chartData = data.map(item => ({
        data: formatDate(item.data),
        chuva: parseFloat(item.chuva),
        nivel: parseFloat(item.nivel),
        vazao: parseFloat(item.vazao),
    }));
  
    return (
        <div className="all-hydro-data-container">
            <div className="station-header">
                <div className="station-header-inner">
                    <h3 className="station-code">Estação {stationCode}</h3>
                    <h4 className="station-name">{stationName || 'Nome não disponível'}</h4>
                </div>
                <h3 style={{ margin: '0' }}>Dados Hidrométricos 24h</h3>
            </div>

            {/* Gráfico de Chuva */}
            <div className="chart-container">
                <h4>Chuva (mm)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                        <YAxis domain={getDomain(chartData,'chuva')} />
                        <Tooltip formatter={(value) => `${value} mm`} />
                        <Line type="monotone" dataKey="chuva" stroke="#8884d8" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Nível */}
            <div className="chart-container">
                <h4>Nível (cm)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 25, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                        <YAxis domain={getDomain('nivel')} />
                        <Tooltip formatter={(value) => `${value} cm`} />
                        <Line type="monotone" dataKey="nivel" stroke="#82ca9d" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Vazão */}
            <div className="chart-container">
                <h4>Vazão (m³/s)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 30, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="data" tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                        <YAxis domain={getDomain('vazao')} />
                        <Tooltip formatter={(value) => `${value} m³/s`} />
                        <Line type="monotone" dataKey="vazao" stroke="#ffc658" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <button className='btn-voltar' onClick={() => navigate(-1)}>Voltar</button>
        </div>
    );
};

export default AllHydroDataPage;
