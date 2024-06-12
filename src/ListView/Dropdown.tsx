import * as React from 'react';

export interface DropdownProps {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(event.target.value, 10);
    if (!isNaN(selectedValue)) {
      onChange(selectedValue);
    }
  };

  return (
    <select value={value ?? ''} onChange={handleChange} className="select select-bordered w-full max-w-xs">
      <option value="" disabled>
        Antal skift per sida
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
