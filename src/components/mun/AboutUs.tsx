"use client";

import { motion } from "framer-motion";
import CardWrapper from "./CardWrapper";

const AboutUs: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
      }}
      whileHover={{ y: -4 }}
      className="group w-full"
    >
      <CardWrapper title="About Us">
        <div className="text-[#E0FBFC]">

          <p className="py-3">
            Started in 2023 by a cohort of passionate debaters, our parliamentary initiative was conceived to foster democratic literacy, diplomacy, and critical inquiry among the youth.
          </p>

          <p className="py-3">
            Having weathered testing waters in our third edition, the platform rebounded stronger than ever in its fourth edition recording over 250 registrations and hosting around 150 delegates in spirited legislative debate.
          </p>

          <p className="py-3">
            Across our successive editions, we have engaged hundreds of aspiring policymakers, earning widespread recognition for promoting structured dialogue, cross-ideological consensus, and civic responsibility.
          </p>

          <p className="py-3">
            Stepping into Youth Parliament 2026, we promise intellectually invigorating committees, evidence-driven debates, and a definitive space for young voices to shape contemporary policy discourse.
          </p>

        </div>
      </CardWrapper>
    </motion.div>
  );
};

export default AboutUs;