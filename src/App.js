import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import DataInputPage from './components/DataInputPage';
import AllHydroDataPage from './components/AllHydroDataPage';
import StationDetailsPage from './components/StationDetailsPage';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Loading from './components/Loading/Loading';
import './App.css';

const App = () => {
  return (
    <LoadingProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <nav>
          <ul>
            <li><Link to="/">INÍCIO</Link></li>
            <li><Link to="/data-input">PESQUISAR ESTAÇÕES</Link></li>
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
