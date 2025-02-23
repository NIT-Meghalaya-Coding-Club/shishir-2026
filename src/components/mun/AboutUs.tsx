import CardWrapper from "./CardWrapper";

const AboutUs:React.FC = () => {
    return (
      <CardWrapper title="About Us">
        <p className="py-3">The NITM MUN was started in 2023 by a group of young, spirited debate enthusiasts and turned out to be a spectacular success in its very first edition. The MUN at NIT Meghalaya is an enthralling version of a parliamentary debate, fostering diplomacy and critical thinking.</p>
        <p className="py-3">We promise intellectually stimulating debates, global challenge solutions, and meaningful connections. With vibrant enthusiasm, young minds contribute to this grand event. The previous edition&apos;s success, with over 80 delegates, indicates a promising future.</p>
        <p className="py-3">NITM MUN aims to engage Meghalaya&apos;s youth in global affairs, fostering leadership and diplomacy. NITMMUN is officially recognized by government bodies and international sub-organizations across the world.</p>
        <p className="py-3">NITM MUN has successfully conducted debates, youth parliaments, and Model United Nations conferences, with a cumulative participation of over 500 individuals in our events.</p>
      </CardWrapper>
    );
}

export default AboutUs;