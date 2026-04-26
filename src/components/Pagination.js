import React from 'react';
import './css/Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  const pageLimit = 3; // Number of pages to show before and after the current page

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getPageNumbers = () => {
    const visiblePages = [];
    const startPage = Math.max(1, currentPage - pageLimit);
    const endPage = Math.min(totalPages, currentPage + pageLimit);

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {currentPage > pageLimit + 1 && (
        <>
          <button
            className={`pagination-number`}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          <span className="pagination-dots">...</span>
        </>
      )}
      {getPageNumbers().map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-number ${
            currentPage === number ? 'active' : ''
          }`}
        >
          {number}
        </button>
      ))}
      {currentPage < totalPages - pageLimit && (
        <>
          <span className="pagination-dots">...</span>
          <button
            className="pagination-number"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
