import { NumberCounter } from "@/components/homepage/stats";
import Title from "./Title";
import { MUN_LegacyData } from "@/data/MUN_Legacy";

const LegacySection:React.FC = () => {
    return (
        <div>
          <Title text="Legacy" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-7 gap-4">
            {Object.keys(MUN_LegacyData).map((year) => (
              <div key={year} className="p-6 bg-gray-900 rounded-2xl border border-yellow-500/10 shadow-2xl">
                <h2 className="text-2xl font-semibold text-yellow-400">{year}</h2>
                {
                  MUN_LegacyData[parseInt(year)].delegatesNo && 
                  <h2 className="text-3xl font-semibold text-yellow-400"> 
                    <NumberCounter end={MUN_LegacyData[parseInt(year)].delegatesNo ?? 0} />
                  {" "}Delegates</h2>
                }
                <p className="text-lg text-justify text-white">{MUN_LegacyData[parseInt(year)].description}</p>
              </div>
            ))}
          </div>
        </div>
    );
}

export default LegacySection;