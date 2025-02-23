import CardWrapper from "./CardWrapper";

const Intro:React.FC = () => {
    return (
        <CardWrapper title="What is MUN?">
            <div className="text-white/90"> 
                <p className = "p-2">MUN stands for <span className="text-yellow-600"> Model United Nations </span>. It&apos;s an educational simulation and academic competition where students typically shadow delegates to the United Nations and simulate UN committees.</p>
                <p className = "p-2">Model United Nations (MUN) is characterized by role-playing, where participants act as diplomats representing different countries in simulated UN committees like the General Assembly or Security Council. They engage in formal debates and negotiations, drafting resolutions to address global issues.</p>
                <p className = "p-2">Extensive research is essential, covering assigned countries &apos policies and agenda topics. Public speaking and diplomacy skills are honed through speeches and interventions advocating for their country&apos;s stance. MUN cultivates critical thinking by analyzing complex issues and seeking solutions. It fosters cultural exchange and networking opportunities, facilitating interactions with diverse peers worldwide.</p>
            </div>  
        </CardWrapper>
    );
}

export default Intro;