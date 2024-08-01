import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatDate, getDomain } from '../utils/utils';
import './css/AllHydroDataPage.css';

const AllHydroDataPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, stationName } = location.state || {};

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
                    <h3 className="station-name">{stationName || 'Nome não disponível'}</h3>
                </div>
                <h4 className="station-title">Dados Hidrométricos 24h</h4>
            </div>

            {/* Gráfico de Chuva */}
            <div className="chart-container">
                <h4 className='text-center'>Chuva (mm)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 10, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="data"
                            tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            defaultValue=""
                        />
                        <YAxis
                            domain={getDomain(chartData, 'chuva')}
                            tickFormatter={(value) => value.toFixed(2)}
                            defaultValue={[0, 1]}
                        />
                        <Tooltip formatter={(value) => `${value} mm`} />
                        <Line
                            type="linear"
                            dataKey="chuva"
                            stroke="#3498db"  // Cor azul para chuva
                            strokeWidth={4}   // Espessura da linha
                            dot={{ r: 4 }}    // Tamanho dos pontos
                            activeDot={{ r: 8 }} // Tamanho do ponto quando ativo
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Nível */}
            <div className="chart-container">
                <h4 className='text-center'>Nível (cm)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 25, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="data"
                            tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            defaultValue=""
                        />
                        <YAxis
                            domain={getDomain(chartData, 'nivel')}
                            tickFormatter={(value) => value.toFixed(2)}
                            defaultValue={[0, 1]}
                        />
                        <Tooltip formatter={(value) => `${value} cm`} />
                        <Line
                            type="step"
                            dataKey="nivel"
                            stroke="#82ca9d"  // Cor azul para nível
                            strokeWidth={2}   // Espessura da linha
                            dot={{ r: 4 }}    // Tamanho dos pontos
                            activeDot={{ r: 8 }} // Tamanho do ponto quando ativo
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de Vazão */}
            <div className="chart-container">
                <h4 className='text-center'>Vazão (m³/s)</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.slice().reverse()} margin={{ left: 30, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="data"
                            tickFormatter={(tick) => new Date(tick.replace(/(\d{2})\/(\d{2})\/(\d{4}),/, '$2/$1/$3')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            defaultValue=""
                        />
                        <YAxis
                            domain={getDomain(chartData, 'vazao')}
                            tickFormatter={(value) => value.toFixed(2)}
                            defaultValue={[0, 1]}
                        />
                        <Tooltip formatter={(value) => `${value} m³/s`} />
                        <Line
                            type="monotone"
                            dataKey="vazao"
                            stroke="#ffc658"
                            strokeWidth={3}   // Espessura da linha
                            dot={{ r: 4 }}    // Tamanho dos pontos
                            activeDot={{ r: 8 }} // Tamanho do ponto quando ativo
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <button className='btn-voltar' onClick={() => navigate(-1)}>Voltar</button>
        </div>
    );
};

export default AllHydroDataPage;
