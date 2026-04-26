import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import HomePage from './components/HomePage';
import DataInputPage from './components/DataInputPage';
import AllHydroDataPage from './components/AllHydroDataPage';
import StationDetailsPage from './components/StationDetailsPage';
import StationSearchPage from './components/StationSearchPage';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Loading from './components/Loading/Loading';
import { fetchStations } from './api/apiService'; // Importa a função de API
import './App.css';

const totalStations = 38339;
const pageSize = 25;
const totalPages = Math.ceil(totalStations / pageSize);
const parallelRequests = 10;

const App = () => {

  // Função para carregar e armazenar as estações no cache em segundo plano
  const loadAndCacheStations = async () => {
    let allStations = [];
    const startTime = performance.now(); 

    for (let i = 0; i < totalPages; i += parallelRequests) {
      const promises = [];
      for (let j = 0; j < parallelRequests && i + j < totalPages; j++) {
        promises.push(fetchStations((i + j) * pageSize, pageSize));
      }

      const results = await Promise.all(promises);
      results.forEach((response, index) => {
        const currentStations = response.data.items || [];
        allStations = allStations.concat(currentStations);

        // Aqui você pode salvar as estações no cache global ou localStorage
        console.log(`Página ${i + index + 1} carregada e salva no cache:`, currentStations.length, 'estações');
      });
    }

    const endTime = performance.now(); 
    const totalTime = (endTime - startTime) / 1000; 
    console.log('Todas as estações foram carregadas no cache:', allStations.length);
    console.log(`Tempo total para carregar e armazenar todas as estações no cache: ${totalTime.toFixed(2)} segundos`);
  };

  useEffect(() => {
    loadAndCacheStations(); // Inicia o cache ao carregar o aplicativo
  }, []);

  return (
    <LoadingProvider>
      <Router>
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                INÍCIO
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/data-input" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                PESQUISAR ESTAÇÕES
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/station-search" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                BUSCAR ESTAÇÕES
              </NavLink>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/data-input" element={<DataInputPage />} />
          <Route path="/all-hydro-data" element={<AllHydroDataPage />} />
          <Route path="/station-details" element={<StationDetailsPage />} />
          <Route path="/station-search" element={<StationSearchPage />} />
        </Routes>
        <LoadingOverlay />
      </Router>
    </LoadingProvider>
  );
};

const LoadingOverlay = () => {
  const { loading } = useLoading();
  return loading ? <Loading /> : null;
};

export default App;
