// src/components/HomePage.js
import React, { useEffect } from 'react';
import './css/HomePage.css';
import { useLoading } from '../context/LoadingContext';

const HomePage = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // Simula um carregamento de 1 segundo
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div>
      <div className="container home-content">
        <div className="home-section">
          <h2>Sobre o Aplicativo</h2>
          <p>
            O aplicativo HidroWeb mobile é uma ferramenta integrante do Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH), gerenciado pela Agência Nacional de Águas (ANA), e permite o acesso aos dados telemétricos coletados pela Rede Hidrometeorológica Nacional (RHN), reunindo dados de chuvas, níveis e vazões de rios, além de informações sobre vazões afluentes, defluentes, níveis e volumes de vários reservatórios em todo o território nacional.
          </p>
          <p>
            Trata-se de uma importante ferramenta para a sociedade e instituições públicas e privadas, pois os dados de reservatórios e aqueles coletados pelas estações hidrometeorológicas são imprescindíveis para a gestão dos recursos hídricos e em diversas atividades econômicas, como geração de energia, irrigação, navegação e indústria, além do projeto, manutenção e operação de infraestrutura hidráulica de pequeno e grande porte, como barragens, drenagem pluvial urbana e mesmo bueiros e telhados.
          </p>
          <p>
            Por meio dessas informações, pode-se, ainda, acompanhar a ocorrência de eventos hidrológicos considerados críticos, inundações e secas, e se planejar medidas de mitigação dos impactos decorrente desses eventos. Mais que acompanhar esses fenômenos, o conjunto de dados até hoje coletados no âmbito da RHN também permite, em diversos casos, a simulação e previsão de eventos hidrológicos e de seus impactos em áreas urbanas ou rurais em diversas bacias hidrográficas.
          </p>
        </div>
        <div className="home-section">
          <a href="https://www.snirh.gov.br" target="_blank" rel="noopener noreferrer">Saiba mais</a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
