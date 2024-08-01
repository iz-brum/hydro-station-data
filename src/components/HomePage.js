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
            O aplicativo HidroWeb mobile é uma ferramenta integrante do Sistema Nacional de Informações sobre Recursos Hídricos (SNIRH), gerenciado pela Agência Nacional de Águas (ANA), e permite o acesso aos dados telemétricos coletados pela Rede Hidrometeorológica Nacional (RHN)...
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
        <section className="home-section flex-section">
          <div className="text-content">
            <h3>Como Utilizar</h3>
            <p>
              Navegue pelo aplicativo para explorar as diferentes funcionalidades oferecidas. Utilize o menu principal para acessar seções específicas como "Estatísticas", "Alertas", "Mapas" e muito mais.
            </p>
            <a href="https://www.snirh.gov.br" target="_blank" rel="noopener noreferrer" className="cta-button">Saiba mais</a>
          </div>
          <div className="home-gif-container">
            <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHNpcDM4cWNwZ28zeGZjcTIxMDZtNjI5ODhneGRpcGN6aXdqbW5lZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPEqDGUULpEU0aQ/giphy.webp" alt="Descrição do GIF" className="home-gif" />
            <p className="home-gif-credit"><a href="https://giphy.com/gifs/cartoon-character-2d-3oKIPEqDGUULpEU0aQ" target="_blank" rel="noopener noreferrer">via GIPHY</a></p>
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
