interface InputBoxProps {
  title: string;
  type: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ type, title, required = true, onChange }) => {
    return (
        <div className="space-y-1 flex flex-col">
          <label htmlFor={title}>{title}</label>
          <input 
            onChange={onChange} 
            name={title} 
            id={title} 
            className="p-2 rounded-md text-black" 
            type={type}
            required={required} 
          />
        </div>
    );
}

export default InputBox;