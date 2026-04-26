import React, { useState, useEffect } from 'react';
import { fetchStations } from '../api/apiService';
import './css/StationSearchPage.css';
import Loading from './Loading/Loading';
import { useLoading } from '../context/LoadingContext';

const StationSearchPage = () => {
  const { loading, setLoading } = useLoading();
  const [stations, setStations] = useState([]);
  const [cachedStations, setCachedStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(
    () => Number(localStorage.getItem('currentPage')) || 0
  );
  const pageSize = 25;
  const totalStations = 38339;
  const totalPages = Math.ceil(totalStations / pageSize);
  const maxPagesToShow = 5;

  const loadStations = async (newPage) => {
    if (cachedStations.length > 0) {
      const startIndex = newPage * pageSize;
      const paginatedStations = cachedStations.slice(startIndex, startIndex + pageSize);
      setStations(paginatedStations);
      console.log(`Exibindo estações da página ${newPage + 1}:`, paginatedStations.length, 'estações');
      setPage(newPage);
      localStorage.setItem('currentPage', newPage);
    } else {
      setLoading(true);
      try {
        const response = await fetchStations(newPage * pageSize, pageSize);
        setStations(response.data.items || []);
        console.log(`Exibindo estações da página ${newPage + 1} (sem cache):`, response.data.items.length, 'estações');
        setPage(newPage);
        localStorage.setItem('currentPage', newPage);
      } catch (error) {
        console.error('Erro ao buscar estações:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadStations(page);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const filteredStations = cachedStations.filter(station =>
          station.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.codigo.toString().includes(searchQuery)
        );
        setStations(filteredStations.slice(page * pageSize, (page + 1) * pageSize));
        console.log('Estações encontradas na pesquisa:', filteredStations.length);
      } else {
        loadStations(page);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, page]);

  const handlePageClick = (pageIndex) => {
    if (pageIndex !== page && pageIndex >= 0 && pageIndex < totalPages) {
      loadStations(pageIndex);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const halfWindow = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(0, page - halfWindow);
    let endPage = Math.min(totalPages - 1, page + halfWindow);

    if (startPage > 0) {
      pages.push(
        <button key={0} className="pagination-button" onClick={() => handlePageClick(0)}>
          1
        </button>
      );
      if (startPage > 1) {
        pages.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${page === i ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages - 1} className="pagination-button" onClick={() => handlePageClick(totalPages - 1)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="station-search-container">
      <h2>Pesquisar Estações Hidrométricas</h2>
      <div className="station-search-input-container">
        <input
          type="text"
          placeholder="Digite o código ou nome da estação"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="station-search-input"
        />
        <span className="station-search-icon">
          <i className="fas fa-search"></i>
        </span>
      </div>
      <div className="station-search-list">
        {stations.map(station => (
          <div key={`${station.codigo}-${station.nome}`} className="station-search-card">
            <h4>{station.nome}</h4>
            <p>Código: {station.codigo}</p>
            <p>Bacia: {station.bacia}</p>
            <p>Município: {station.municipio}</p>
            <p>Tipo: {station.tipoestacao}</p>
          </div>
        ))}
      </div>
      <div className="station-pagination-buttons">
        <button onClick={() => handlePageClick(page - 1)} disabled={page === 0} className="pagination-button">
          &lt;
        </button>
        {renderPagination()}
        <button onClick={() => handlePageClick(page + 1)} disabled={page >= totalPages - 1} className="pagination-button">
          &gt;
        </button>
      </div>
      {loading && <Loading />}
    </div>
  );
};

export default StationSearchPage;
