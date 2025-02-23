import Title from "./Title";

const CardWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="w-full sm:w-3/4 p-4 sm:p-10 m-4 sm:m-10 backdrop-blur-sm border border-yellow-400/20 bg-white/10 bg-opacity-70 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
      <Title text={title} />
      <div className="text-justify text-white/90">
        {children}
      </div>
    </div>
  );
}

export default CardWrapper;