import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Função para formatar as datas no horário local do usuário
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formattedDate = date.toLocaleString('pt-BR', { timeZone: localTimeZone });
    console.log(`Original: ${dateString}, UTC Date: ${date.toISOString()}, Local Time Zone: ${localTimeZone}, Formatted: ${formattedDate}`);
    return formattedDate;
};


// Função para formatar os números
const formatNumber = (number) => {
    if (number % 1 === 0) {
        return number.toLocaleString('pt-BR'); // Formata números inteiros
    }
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 1 }); // Formata números decimais
};

// Componente para exibir todos os dados hidrométricos
const AllHydroDataPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.data;

    if (!data) {
        return <div>Nenhum dado disponível.</div>;
    }

    return (
        <div>
            <h3>Todos os Dados Hidrométricos 24h</h3>
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

// VERSÃO ANTERIOR OK