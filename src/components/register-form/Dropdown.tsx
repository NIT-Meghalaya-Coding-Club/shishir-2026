import React, { useState } from 'react';

interface DropdownProps {
  title: string;
  options: string[];
  onChange?: (selectedValue: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (value !== 'Others') {
      setCustomText('');
      onChange?.(value);
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomText(value);
    onChange?.(value);
  };

  return (
    <div className="space-y-1 flex flex-col text-yellow-500 font-serif text-lg">
      <label htmlFor={title}>{title}</label>
      {selectedOption === 'Others' ? (
        // When 'Others' is selected, replace the dropdown with an input field
        <input
          type="text"
          value={customText}
          onChange={handleCustomTextChange}
          placeholder="Please specify"
          className="p-1.5 bg-white/10 text-white rounded-sm backdrop-blur-lg border-b-[1.2px] border-yellow-500 focus:outline-none focus:border-yellow-50 transition-all duration-200"
        />
      ) : (
        // Otherwise, display the dropdown
        <select
          onChange={handleSelectChange}
          id={title}
          name={title}
          value={selectedOption}
          className="p-2   bg-white/10 text-gray-200 rounded-sm backdrop-blur-lg border-b-[1.2px] border-yellow-500 focus:outline-none focus:border-yellow-50 transition-all duration-200"
        >
          {options.map((option: string, index: number) => (
            <option 
              key={index} 
              value={option==='--SELECT--' ? '' : option} 
              className="bg-white/10 text-gray-500"
              disabled={option === '--SELECT--'}
            >
              {option}
            </option>
          ))}
          <option value="Others" className="bg-white/10 text-gray-500">
            Others
          </option>
        </select>
      )}
    </div>
  );
};

export default Dropdown;
