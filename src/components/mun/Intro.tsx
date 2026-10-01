import CardWrapper from "./CardWrapper";

const Intro: React.FC = () => {
  return (
    <CardWrapper title="What is Youth Parliament?">
      <div className="space-y-6">
        <p
          className="
            text-sm
            leading-7
            text-[#293241]/85
            dark:text-[#E0FBFC]/85
            sm:text-base
          "
        >
          Youth Parliament is an interactive platform that immerses young people in legislative debate and democratic governance. By stepping into the shoes of elected representatives, participants tackle pressing contemporary issues in a structured, formal assembly.
        </p>

        <p
          className="
            text-sm
            leading-7
            text-[#293241]/85
            dark:text-[#E0FBFC]/85
            sm:text-base
          "
        >
          Through simulated proceedings, delegates learn to defend policy proposals, scrutinize opposing viewpoints, and negotiate meaningful solutions. This hands-on experience sharpens essential competencies, including persuasive public speaking, critical analysis, and consensus-building.
        </p>

        <p
          className="
            text-sm
            leading-7
            text-[#293241]/85
            dark:text-[#E0FBFC]/85
            sm:text-base
          "
        >
          Ultimately, the initiative bridges civic awareness and leadership. By demystifying the democratic process, Youth Parliament empowers the next generation to move beyond passive observation and become informed, active changemakers.
        </p>
      </div>
    </CardWrapper>
  );
};

export default Intro;