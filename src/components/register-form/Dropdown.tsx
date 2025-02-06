interface DropdownProps {
    title: string;
    options: string[];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

const Dropdown: React.FC<DropdownProps> = ({ title, options, onChange}) => {
    return (
      <div className="space-y-1 flex flex-col">
      <label htmlFor={title}>{title}</label>
      <select onChange={onChange} id={title} name={title} className="p-2 rounded-md text-black">
        {options.map((option: string, index: number) => {
          return <option key={index} value={option}>{option}</option>
        })}
      </select>
    </div>
    );
}

export default Dropdown;