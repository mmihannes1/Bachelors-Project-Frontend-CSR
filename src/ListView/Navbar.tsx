import * as React from 'react';

interface SearchBarProps {
  searchText: string;
  onSearch: (_query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearch }) => {
  const [inputValue, setInputValue] = React.useState(searchText);

  React.useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  const handleSearch = () => {
    onSearch(inputValue);
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Sök personal..."
        className="px-3 py-2 rounded-l border border-gray-300 focus:outline-none focus:border-blue-500 flex-1"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
      >
        Sök
      </button>
    </div>
  );
};

interface NavbarProps {
  onSearch: (_query: string) => void;
  isPersonView: boolean;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  pageSize: number;
  paginationSizes: number[];
  onPageSizeChange: (_size: number) => void;
  onReset: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  isPersonView,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}) => {
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = (query: string) => {
    setSearchText(query);
    onSearch(query);
  };

  const handleReset = () => {
    setSearchText('');
    onSearch('');
    onReset();
  };

  return (
    <div className="navbar bg-blue-600 text-primary-content">
      <div className="flex items-center gap-2 w-full">
        {!isPersonView && <SearchBar searchText={searchText} onSearch={handleSearch} />}
        <div className="ml-auto flex items-center space-x-4">
          <p>Starttid</p>
          <div className="form-control">
            <input
              type="date"
              className="flex-1 rounded-l border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <p>Sluttid</p>
          <div className="form-control">
            <input
              type="date"
              className="flex-1 rounded-l border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Återställ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
