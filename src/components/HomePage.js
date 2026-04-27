import React, { useEffect } from 'react';
import './css/HomePage.css';
import { useLoading } from '../context/LoadingContext';
import Footer from './Footer';

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
        <h1>Portal do SNIRH</h1>
        <p>Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH)</p>
      </header>

      <main className="home-content">
        <section className="home-section">
          <h3>Sobre o SNIRH</h3>
          <p>
            O SNIRH é a base para disponibilização das informações sobre águas no Brasil, contribuindo para a difusão do conhecimento sobre recursos hídricos.
          </p>
        </section>
        <section className="home-section">
          <h3>Funcionalidades</h3>
          <ul>
            <li>Consulta a dados detalhados de estações hidrometeorológicas em todo o país.</li>
            <li>Visualização de históricos de chuvas, níveis de água e vazões com gráficos interativos.</li>
            <li>Filtragem personalizada para criar relatórios e visualizações específicas.</li>
            <li>Acesso a informações geográficas e dados estatísticos das estações monitoradas.</li>
          </ul>
        </section>
        {/* Imagem removida nesta versão; mantenha link para o portal */}
        <section className="home-section flex-section">
          <div className="text-content">
            <h3>Como Utilizar</h3>
            <p>
              Navegar pelo portal é simples e intuitivo. Utilize o menu superior para acessar as principais funcionalidades:
            </p>
            <ul>
              <li><strong>Pesquisar Estações:</strong> Encontre e selecione estações específicas para visualizar seus dados detalhados.</li>
              <li><strong>Dados Hidrométricos 24h:</strong> Acesse gráficos com dados de chuvas, níveis de água e vazões nas últimas 24 horas.</li>
              <li><strong>Resumo de Chuva:</strong> Veja resumos de precipitação acumulada em diferentes períodos, como 24 horas, 7 dias, 30 dias e 12 meses.</li>
            </ul>
            <p>
              Para mais informações, visite o site oficial do SNIRH.
            </p>
            <a href="https://www.snirh.gov.br" target="_blank" rel="noopener noreferrer" className="cta-button">Saiba mais</a>
          </div>
        </section>
      </main>
      <Footer siteName="HidroInfo" />
    </div>
  );
};

export default HomePage;
