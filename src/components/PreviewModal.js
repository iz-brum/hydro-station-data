import React from 'react';
import './css/PreviewModal.css';
import { mapPeriodLabel, headerDictionary, formatDate, formatNumber, detailLabels } from '../utils/utils';

const PreviewModal = ({ data, onConfirm, onCancel, selectedDetails = {}, selectedHydro24h = {}, selectedRainSummary = {} }) => {
  console.log('Dados para pré-visualização:', data);

  if (!data) {
    return null;
  }

  const renderTable = (title, tableData, columns, isScrollable = false) => (
    <div className={isScrollable ? "table-overflow" : ""}>
      <h4>{title}</h4>
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{headerDictionary[col] || detailLabels[col] || col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                {col === 'soma_ult_leituras'
                  ? mapPeriodLabel(row[col])
                  : col === 'data'
                  ? formatDate(row[col])
                  : col === 'PERÍODO'
                  ? row['period'] // Usando 'period' para acessar os dados corretos
                  : row[col] !== null && row[col] !== undefined
                  ? formatNumber(row[col])
                  : 'N/A'}
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const detalhesData = data.filter(d => d.category === 'Detalhes');
  const hidro24hData = data.filter(d => d.category === 'Hidro 24h');
  const chuvaUltData = data.filter(d => d.category === 'Resumo chuvas');

  const selectedDetailColumns = Object.keys(selectedDetails).filter(key => selectedDetails[key]);
  const selectedHydrodataColumns = Object.keys(selectedHydro24h).filter(key => selectedHydro24h[key]);
  const selectedRainSummaryColumns = ['stationCode', 'PERÍODO', 'sum_chuva'];

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <h3>Pré-visualização dos Dados</h3>
        <div className="preview-table">
          {selectedDetailColumns.length > 0 && detalhesData.length > 0 && renderTable('Ficha das estações', detalhesData, ['stationCode', ...selectedDetailColumns], true)}
          {selectedRainSummaryColumns.length > 0 && chuvaUltData.length > 0 && renderTable('Resumo de chuvas', chuvaUltData, selectedRainSummaryColumns)}
          {selectedHydrodataColumns.length > 0 && hidro24hData.length > 0 && renderTable('Histórico 24h', hidro24hData, ['stationCode', ...selectedHydrodataColumns])}
        </div>
        <div className="button-container">
          <button className="confirm-button" onClick={onConfirm}>Confirmar Download</button>
          <button className="cancel-button" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
