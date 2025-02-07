interface DropdownProps {
    title: string;
    options: string[];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const Dropdown: React.FC<DropdownProps> = ({ title, options, onChange }) => {
    return (
      <div className="space-y-1 flex flex-col text-yellow-500 font-serif text-lg">
        <label htmlFor={title}>{title}</label>
        <select
          onChange={onChange}
          id={title}
          name={title}
          className="p-2 bg-white/10 text-gray-200 rounded-sm backdrop-blur-lg border-b-[1.2px] border-yellow-500 focus:outline-none focus:border-yellow-50 transition-all duration-200"
        >
          {options.map((option: string, index: number) => (
            <option key={index} value={option} className="bg-white/10 text-gray-500">
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default Dropdown;
  