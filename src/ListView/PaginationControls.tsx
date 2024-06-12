import * as React from 'react';

export interface PaginationData {
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface PaginationControlsProps {
  paginationData: PaginationData;
  onPageChange: (_page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ paginationData, onPageChange }) => {
  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="join">
      {/* First page button */}
      <button className="join-item btn" onClick={() => handlePageChange(1)} disabled={paginationData.page === 1}>
        1
      </button>

      {/* Previous button */}
      <button
        className="join-item btn"
        onClick={() => {
          if (paginationData.page > 1) {
            handlePageChange(paginationData.page - 1);
          }
        }}
        disabled={paginationData.page === 1}
      >
        Förgående
      </button>
      <button className="join-item btn" disabled>
        {paginationData.page}
      </button>
      {/* Next button */}
      <button
        className="join-item btn"
        onClick={() => {
          if (paginationData.page < paginationData.pages) {
            handlePageChange(paginationData.page + 1);
          }
        }}
        disabled={paginationData.page === paginationData.pages}
      >
        Nästa
      </button>

      {/* Last page button */}
      <button
        className="join-item btn"
        onClick={() => handlePageChange(paginationData.pages)}
        disabled={paginationData.page === paginationData.pages}
      >
        {paginationData.pages}
      </button>
    </div>
  );
};

export default PaginationControls;
