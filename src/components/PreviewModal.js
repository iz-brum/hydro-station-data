import React from 'react';
import './css/PreviewModal.css';
import { mapPeriodLabel, headerDictionary, formatDate, formatNumber, detailLabels } from '../utils/utils';

const PreviewModal = ({ data, onConfirm, onCancel, selectedDetails = {}, selectedRainSummary = {} }) => {
  if (!data) {
    return null;
  }

  // Função para renderizar a tabela específica de cada categoria
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
                  {col === "'soma_ult_leituras'"
                    ? mapPeriodLabel(row[col])
                    : col === 'data'
                    ? formatDate(row[col])
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

  // Dados filtrados de acordo com as seleções
  const detalhesData = data.filter(d => d.category === 'Detalhes');
  const hidro24hData = data.filter(d => d.category === 'Hidro 24h');
  const chuvaUltData = data.filter(d => d.category === 'Chuva Últ');

  // Seleção das colunas de detalhes
  const selectedDetailColumns = Object.keys(selectedDetails).filter(key => selectedDetails[key]);
  const selectedRainSummaryColumns = ['stationCode', 'soma_ult_leituras', 'sum_chuva'];

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal">
        <h3>Pré-visualização dos Dados</h3>
        <div className="preview-table">
          {detalhesData.length > 0 && renderTable('Detalhes', detalhesData, ['stationCode', ...selectedDetailColumns], true)}
          {hidro24hData.length > 0 && renderTable('Dados Hidrométricos 24h', hidro24hData, ['stationCode', 'data', 'chuva', 'nivel', 'vazao'])}
          {chuvaUltData.length > 0 && renderTable('Chuva Últ', chuvaUltData, selectedRainSummaryColumns)}
        </div>
        <button onClick={onConfirm}>Confirmar Download</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
};

export default PreviewModal;
