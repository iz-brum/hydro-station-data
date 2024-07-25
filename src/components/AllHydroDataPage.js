import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatNumber, formatDate } from '../utils/utils'; // Importa os utilitários
import './css/DataView.css';  // Importa o novo CSS para os cartões de estação

// Componente para exibir todos os dados hidrométricos
const AllHydroDataPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, stationCode, stationName } = location.state || {};

    if (!data) {
        return <div>Nenhum dado disponível.</div>;
    }

    return (
        <div className="all-hydro-data-container">
            <div className="station-header">
                <div className="station-header-inner">
                    <h3 className="station-code">Estação {stationCode}</h3>
                    <h4 className="station-name">{stationName || 'Nome não disponível'}</h4>
                </div>
                <h3 style={{ margin: '0' }}>Dados Hidrométricos 24h</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Chuva (mm)</th>
                        <th>Nível (cm)</th>
                        <th>Vazão (m³/s)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{formatDate(item.data)}</td>
                            <td>{formatNumber(item.chuva)}</td>
                            <td>{formatNumber(item.nivel)}</td>
                            <td>{formatNumber(item.vazao)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
    );
};

export default AllHydroDataPage;
