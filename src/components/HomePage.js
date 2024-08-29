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

      <main className="home-content">
        <section className="home-section">
          <h3>Sobre o Aplicativo</h3>
          <p>
            Bem-vindo ao HidroInfo, uma plataforma avançada para acesso a dados hidrológicos e meteorológicos em tempo real. Desenvolvido pela Agência Nacional de Águas (ANA), nosso aplicativo é parte integrante do Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH), permitindo a visualização dos dados coletados pela Rede Hidrometeorológica Nacional (RHN). Através do HidroInfo, você pode monitorar e analisar informações essenciais sobre o clima e os recursos hídricos do Brasil.
          </p>
        </section>
        <section className="home-section">
          <h3>Funcionalidades</h3>
          <ul>
            <li>Consulta a dados detalhados de estações hidrometeorológicas em todo o país.</li>
            <li>Visualização de históricos de chuvas, níveis de água e vazões com gráficos interativos.</li>
            <li>Filtragem personalizada para criar relatórios e visualizações específicas de acordo com suas necessidades.</li>
            <li>Acesso a informações geográficas e dados estatísticos das estações monitoradas.</li>
          </ul>
        </section>
        <div className="home-gif-container">
          <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHNpcDM4cWNwZ28zeGZjcTIxMDZtNjI5ODhneGRpcGN6aXdqbW5lZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPEqDGUULpEU0aQ/giphy.webp" alt="Descrição do GIF" className="home-gif" />
          <p className="home-gif-credit"><a href="https://giphy.com/gifs/cartoon-character-2d-3oKIPEqDGUULpEU0aQ" target="_blank" rel="noopener noreferrer">via GIPHY</a></p>
        </div>
        <section className="home-section flex-section">
          <div className="text-content">
            <h3>Como Utilizar</h3>
            <p>
              Navegar pelo HidroInfo é simples e intuitivo. Utilize o menu superior para acessar as principais funcionalidades:
            </p>
            <ul>
              <li><strong>Pesquisar Estações:</strong> Encontre e selecione estações específicas para visualizar seus dados detalhados.</li>
              <li><strong>Dados Hidrométricos 24h:</strong> Acesse gráficos com dados de chuvas, níveis de água e vazões nas últimas 24 horas.</li>
              <li><strong>Resumo de Chuva:</strong> Veja resumos de precipitação acumulada em diferentes períodos, como 24 horas, 7 dias, 30 dias e 12 meses.</li>
            </ul>
            <p>
              Explore esta e outras funcionalidades (em breve) para obter insights valiosos sobre as condições hidrológicas e meteorológicas. Para mais informações, visite o site oficial do SNIRH.
            </p>
            <a href="https://www.snirh.gov.br" target="_blank" rel="noopener noreferrer" className="cta-button">Saiba mais</a>
          </div>
        </section>
      </main>
      <footer className="home-footer">
        <p>&copy; 2024 HidroInfo. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
