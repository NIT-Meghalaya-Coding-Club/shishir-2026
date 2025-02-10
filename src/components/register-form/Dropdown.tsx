import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface DropdownProps {
  title: string;
  options: string[];
  onChange?: (selectedValue: string) => void;
  required?: boolean;
}

const Dropdown:React.FC<DropdownProps> = ({title, options, onChange, required=true}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [finalOptions, setFinalOptions] = useState<string[]>(options);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string | null>(null);

  useEffect(() => {
    onChange?.(selectedOption || '');
  },[selectedOption])

  useEffect(() => {
    if (inputValue === '') {
      setFinalOptions(options);
    }
  },[inputValue])

  return (
      <div className="space-y-2">
        <p className="text-yellow-500">{title}</p>
        <div 
          className="backdrop-blur-lg bg-white/10 p-2.5 
          rounded-lg border-b-2 border-orange-800
          flex justify-between items-center"
          onClick={() => setMenuOpen(!menuOpen)}
        > 
          <input 
            type="text" 
            placeholder="Select or type..." 
            required={required}
            onChange={
              (e) => {
                setInputValue(e.currentTarget.value);
                setFinalOptions(options.filter(option => option.toLowerCase().startsWith((inputValue || '').toLowerCase())));
              }
            }
            className="bg-transparent text-white focus:outline-none"
            value={ inputValue || selectedOption || ''}
          />
          <ChevronDown 
            className="w-6 h-6 text-white" 
          />
          
        </div>
        {menuOpen && (
            <div className="z-50 w-44 absolute max-h-60 overflow-hidden
             bg-white border border-gray-300 rounded-md shadow-lg h-fit"
            >
              {finalOptions.map((option, index) => (
                <p 
                  key={index} 
                  className="border-b-1 border-gray-600 p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                  onClick={()=>{
                    setSelectedOption(option)
                    setMenuOpen(false)
                  }}
                >{option}</p>
              ))}
              <input
                type="text"
                placeholder="Please specify"
                className="p-2 w-full text-black focus:outline-none"
                onChange={(e) => setSelectedOption(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setMenuOpen(false);
                  }
                }}
              /> 
            </div>
          )}
      </div>
  );
}

export default Dropdown;