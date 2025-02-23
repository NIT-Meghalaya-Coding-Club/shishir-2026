import { Sparkles } from "lucide-react";

const Title:React.FC<{text: string}> = ({text}) => {
    return (
      <div className="text-center mb-5 relative">
        {/* Spotlight effect */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full" />
        <div className="relative">
          <div className="flex justify-center items-center gap-4">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              {text}
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
        </div>
      </div>
    );
}

export default Title;