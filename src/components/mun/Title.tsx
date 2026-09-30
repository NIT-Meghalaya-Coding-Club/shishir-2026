import { Sparkles } from "lucide-react";

const Title: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="text-center mb-5 relative">

      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#EE6C4D]/10 blur-3xl rounded-full" />

      <div className="relative">
        <div className="flex justify-center items-center gap-4">

          <Sparkles className="w-5 h-5 text-[#EE6C4D]" />

          <h2 className="text-2xl sm:text-3xl font-semibold text-[#EE6C4D]">
            {text}
          </h2>

          <Sparkles className="w-5 h-5 text-[#EE6C4D]" />

        </div>

        <div className="h-1 w-24 mx-auto bg-[#3D5A80] rounded-full" />

      </div>
    </div>
  );
};

export default Title;