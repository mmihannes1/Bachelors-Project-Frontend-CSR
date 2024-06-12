import * as React from 'react';
import { useState } from 'react';

interface TableHeaderRowProps {
  onSortChange: (_columnName: 'first_name' | 'start_time', _sortOrder: 'asc' | 'desc' | 'none') => void;
}

export interface SortOptions {
  columnName: 'first_name' | 'start_time';
  sortOrder: 'asc' | 'desc' | 'none';
}

const TableHeaderRow: React.FC<TableHeaderRowProps> = ({ onSortChange }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  const handleSort = (columnName: 'first_name' | 'start_time') => {
    if (sortColumn === columnName) {
      // Toggle sorting order if clicking on the same column
      const newSortOrder = sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? 'none' : 'asc';
      setSortOrder(newSortOrder);
      onSortChange(columnName, newSortOrder);
    } else {
      // Sort a new column in ascending order
      setSortColumn(columnName);
      setSortOrder('asc');
      onSortChange(columnName, 'asc');
    }
  };

  return (
    <thead>
      <tr>
        <th onClick={() => handleSort('first_name')}>
          Namn {sortColumn === 'first_name' && (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '')}
        </th>
        <th onClick={() => handleSort('start_time')}>
          Starttid {sortColumn === 'start_time' && (sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '')}
        </th>
        <th>Sluttid</th>
        <th>Kommentar</th>
      </tr>
    </thead>
  );
};

export default TableHeaderRow;
