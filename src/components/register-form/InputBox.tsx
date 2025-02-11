interface InputBoxProps {
  title: string;
  type: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ type, title, required = true, onChange }) => {
    return (
        <div className="space-y-1 text-yellow-500 font-serif text-lg  flex flex-col">
          <label htmlFor={title}>{title}</label>
          <input
            onChange={onChange}
            name={title}
            id={title}
            className="p-[6.5px] text-white bg-white/10 rounded-lg backdrop-blur-lg border-b-[1.1px] border-yellow-500 focus:outline-none focus:border-yellow-50 transition-all duration-200"
            type={type}
            required={required}
          />

        </div>
    );
}

export default InputBox;