import React, { useEffect } from 'react';
import './css/HomePage.css';
import { useLoading } from '../context/LoadingContext';

const HomePage = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Portal HidroInfo</h1>
        <p>Informações hidrológicas e meteorológicas ao seu alcance.</p>
      </header>

      <div className="home-content">
        <section className="home-section">
          <h3>Sobre o Aplicativo</h3>
          <p>
            O aplicativo HidroWeb mobile é uma ferramenta integrante do Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH), gerenciado pela Agência Nacional de Águas (ANA), e permite o acesso aos dados telemétricos coletados pela Rede Hidrometeorológica Nacional (RHN), reunindo dados de chuvas, níveis e vazões de rios, além de informações sobre vazões afluentes, defluentes, níveis e volumes de vários reservatórios em todo o território nacional.
          </p>
          <p>
            Trata-se de uma importante ferramenta para a sociedade e instituições públicas e privadas, pois os dados de reservatórios e aqueles coletados pelas estações hidrometeorológicas são imprescindíveis para a gestão dos recursos hídricos e em diversas atividades econômicas, como geração de energia, irrigação, navegação e indústria, além do projeto, manutenção e operação de infraestrutura hidráulica de pequeno e grande porte, como barragens, drenagem pluvial urbana e mesmo bueiros e telhados.
          </p>
          <p>
            Por meio dessas informações, pode-se, ainda, acompanhar a ocorrência de eventos hidrológicos considerados críticos, inundações e secas, e se planejar medidas de mitigação dos impactos decorrente desses eventos. Mais que acompanhar esses fenômenos, o conjunto de dados até hoje coletados no âmbito da RHN também permite, em diversos casos, a simulação e previsão de eventos hidrológicos e de seus impactos em áreas urbanas ou rurais em diversas bacias hidrográficas.
          </p>
        </section>
        <section className="home-section">
          <h3>Funcionalidades</h3>
          <ul>
            <li>Acesso a dados de estações meteorológicas em tempo real.</li>
            <li>Visualização de históricos de níveis de água e vazões.</li>
            <li>Alertas para eventos hidrológicos críticos.</li>
            <li>Mapas interativos para localização das estações.</li>
          </ul>
        </section>
        <section className="home-section">
          <h3>Como Utilizar</h3>
          <p>
            Navegue pelo aplicativo para explorar as diferentes funcionalidades oferecidas. Utilize o menu principal para acessar seções específicas como "Estatísticas", "Alertas", "Mapas" e muito mais.
          </p>
          <a href="https://www.snirh.gov.br" target="_blank" rel="noopener noreferrer">Saiba mais</a>
        </section>
      </div>
      <footer className="home-footer">
        <div className="footer-socials">
          <a href="#facebook">Facebook</a>
          <a href="#twitter">Twitter</a>
          <a href="#instagram">Instagram</a>
        </div>
        <p>&copy; 2024 HidroInfo. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
