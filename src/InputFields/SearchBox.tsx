import React, { useState } from 'react';

export interface UserListOption {
  value: string;
  name: string;
}

export interface UserListSelection {
  options: UserListOption[];
  onSelect: (_value: string) => void;
  placeholder?: string;
  onUpdateString: (str: string) => void;
}

const SearchBox: React.FC<UserListSelection> = ({ options, onSelect, placeholder, onUpdateString }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const filteredOptions =
    searchTerm === ''
      ? options
      : options.filter((option) => option.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelected = (value: string, name: string) => {
    onSelect(value);
    setSelectedName(name);
    setShowOptions(false);
    setSearchTerm('');
  };

  return (
    <div className="w-full relative">
      <label className="input input-bordered flex items-center w-full">
        <input
          type="text"
          className="grow"
          value={selectedName || searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onUpdateString(e.target.value);
            setSelectedName('');
          }}
          onFocus={() => {
            setShowOptions(true);
            setSelectedName('');
            setSearchTerm('');
          }}
          onBlur={() => setTimeout(() => setShowOptions(false), 100)}
          placeholder={placeholder || 'Sök efter personal...'}
        />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {showOptions && (
        <ul className="absolute left-0 right-0 mx-auto w-[97%] max-h-60 overflow-auto bg-stone-100 shadow-md mt-1 z-10">
          {filteredOptions.map((option) => (
            <li
              key={option.value}
              className="p-2 hover:bg-stone-200 cursor-pointer"
              onMouseDown={() => handleSelected(option.value, option.name)}
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
