import React from 'react';
import { HashRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import HomePage from './components/HomePage';
import DataInputPage from './components/DataInputPage';
import AllHydroDataPage from './components/AllHydroDataPage';
import StationDetailsPage from './components/StationDetailsPage';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Loading from './components/Loading/Loading';
import './App.css';

const App = () => {
  const basename = process.env.NODE_ENV === 'development' ? '' : '/hydro-station-data';

  return (
    <LoadingProvider>
      <Router basename={basename}>
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item"><NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>INÍCIO</NavLink></li>
            <li className="nav-item"><NavLink to="/data-input" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>PESQUISAR ESTAÇÕES</NavLink></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/data-input" element={<DataInputPage />} />
          <Route path="/all-hydro-data" element={<AllHydroDataPage />} />
          <Route path="/station-details" element={<StationDetailsPage />} />
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
