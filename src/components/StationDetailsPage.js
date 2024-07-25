import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatNumber } from '../utils/utils'; // Importa os utilitários


// Componente para exibir os detalhes da estação
const StationDetailsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stationData = location.state?.data;

    if (!stationData) {
        return <div>Nenhum dado disponível.</div>;
    }

    return (
        <div>
            <h3>Detalhes da Estação {stationData.detalhes.items[0].codigo}</h3>
            <table>
                <tbody>
                    <tr>
                        <td>Código</td>
                        <td>{stationData.detalhes.items[0].codigo}</td>
                    </tr>
                    <tr>
                        <td>Nome</td>
                        <td>{stationData.detalhes.items[0].nome}</td>
                    </tr>
                    <tr>
                        <td>Bacia</td>
                        <td>{stationData.detalhes.items[0].bacia}</td>
                    </tr>
                    <tr>
                        <td>Rio</td>
                        <td>{stationData.detalhes.items[0].rio}</td>
                    </tr>
                    <tr>
                        <td>Estado</td>
                        <td>{stationData.detalhes.items[0].estado}</td>
                    </tr>
                    <tr>
                        <td>Município</td>
                        <td>{stationData.detalhes.items[0].municipio}</td>
                    </tr>
                    <tr>
                        <td>Responsável</td>
                        <td>{stationData.detalhes.items[0].responsavel}</td>
                    </tr>
                    <tr>
                        <td>Operadora</td>
                        <td>{stationData.detalhes.items[0].operadora}</td>
                    </tr>
                    <tr>
                        <td>Latitude</td>
                        <td>{formatNumber(stationData.detalhes.items[0].latitude)}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>{formatNumber(stationData.detalhes.items[0].longitude)}</td>
                    </tr>
                    <tr>
                        <td>Área de Drenagem</td>
                        <td>{formatNumber(stationData.detalhes.items[0].areadrenagem)}</td>
                    </tr>
                    <tr>
                        <td>Tipo de Estação</td>
                        <td>{stationData.detalhes.items[0].tipoestacao}</td>
                    </tr>
                    <tr>
                        <td>Operando</td>
                        <td>{stationData.detalhes.items[0].operando}</td>
                    </tr>
                    <tr>
                        <td>Telemétrica</td>
                        <td>{stationData.detalhes.items[0].telemetrica}</td>
                    </tr>
                    <tr>
                        <td>Climatológica</td>
                        <td>{stationData.detalhes.items[0].climatologica}</td>
                    </tr>
                    <tr>
                        <td>Pluviômetro</td>
                        <td>{stationData.detalhes.items[0].pluviometro}</td>
                    </tr>
                    <tr>
                        <td>Registrador de Chuva</td>
                        <td>{stationData.detalhes.items[0].registradorchuva}</td>
                    </tr>
                    <tr>
                        <td>Escala</td>
                        <td>{stationData.detalhes.items[0].escala}</td>
                    </tr>
                    <tr>
                        <td>Registrador de Nível</td>
                        <td>{stationData.detalhes.items[0].registradornivel}</td>
                    </tr>
                    <tr>
                        <td>Descarga Líquida</td>
                        <td>{stationData.detalhes.items[0].descargaliquida}</td>
                    </tr>
                    <tr>
                        <td>Sedimentos</td>
                        <td>{stationData.detalhes.items[0].sedimentos}</td>
                    </tr>
                    <tr>
                        <td>Qualidade da Água</td>
                        <td>{stationData.detalhes.items[0].qualidadedaagua}</td>
                    </tr>
                    <tr>
                        <td>Tanque Evapo</td>
                        <td>{stationData.detalhes.items[0].tanqueevapo}</td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
    );
};

export default StationDetailsPage;
    