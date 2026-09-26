"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPhone, FaEnvelope } from "react-icons/fa6";
import { RiMenu4Line } from "@remixicon/react";

import { MUN_Team } from "@/data/MUN_Team";
import { defaultImageUrl } from "@/data/Teams";
import Title from "./Title";

const TeamSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <Title text="Meet the Team" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MUN_Team.map((member, index) => {
          const isActive = activeIndex === index;
          const imageUrl = member.imageLink || defaultImageUrl;

          return (
            <motion.div
              key={index}
              className="group relative mx-auto h-[340px] w-full max-w-[300px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
              }}
            >
              {/* Card */}
              <motion.div
                className="
                  relative
                  h-full
                  w-full
                  overflow-hidden
                  rounded-lg
                  border
                  border-[#3D5A80]
                  bg-[#293241]
                "
                animate={{
                  y: isActive ? -4 : 0,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
              >
                {/* Image */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial="rest"
                  whileHover="hover"
                >
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url("${imageUrl}")`,
                    }}
                    variants={{
                      rest: {
                        scale: 1,
                      },
                      hover: {
                        scale: 1.06,
                      },
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>

                {/* Dark overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#293241] via-[#293241]/30 to-transparent" />

                {/* Subtle hover tint */}
                <motion.div
                  className="pointer-events-none absolute inset-0 bg-[#98C1D9]/0"
                  whileHover={{
                    backgroundColor: "rgba(152, 193, 217, 0.05)",
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                />

                {/* Menu Button */}
                <motion.button
                  type="button"
                  aria-label={
                    isActive
                      ? `Close ${member.name} details`
                      : `Show ${member.name} details`
                  }
                  onClick={() =>
                    setActiveIndex(isActive ? null : index)
                  }
                  className="
                    absolute
                    right-4
                    top-4
                    z-50
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#98C1D9]/60
                    bg-[#293241]/90
                    text-[#98C1D9]
                    backdrop-blur-sm
                    transition-colors
                    duration-300
                    hover:border-[#98C1D9]
                    hover:text-[#E0FBFC]
                  "
                  animate={{
                    rotate: isActive ? -45 : 0,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                >
                  <RiMenu4Line size={19} />
                </motion.button>

                {/* Name */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 z-10 p-5"
                  animate={{
                    opacity: isActive ? 0 : 1,
                    y: isActive ? 15 : 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  {/* <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-[#98C1D9]">
                    NITM MUN
                  </p> */}

                  <h3 className="text-xl font-semibold text-[#E0FBFC]">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#98C1D9]">
                    {member.position}
                  </p>
                </motion.div>

                {/* Details */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="
                        absolute
                        inset-0
                        z-30
                        overflow-hidden
                        bg-[#293241]/95
                      "
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      {/* Small accent */}
                      <div className="absolute left-7 top-8 h-8 w-[2px] bg-[#EE6C4D]" />

                      {/* Details Content */}
                      <div className="relative z-10 flex h-full flex-col justify-center px-8">
                        {/* Name */}
                        <motion.h2
                          className="text-2xl font-semibold text-[#E0FBFC]"
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.15,
                            duration: 0.3,
                          }}
                        >
                          {member.name}
                        </motion.h2>

                        {/* Position */}
                        <motion.p
                          className="mt-2 text-sm text-[#98C1D9]"
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.2,
                            duration: 0.3,
                          }}
                        >
                          {member.position}
                        </motion.p>

                        {/* Divider */}
                        <div className="my-6 h-px w-full bg-[#3D5A80]" />

                        {/* Contact */}
                        <div className="flex flex-col gap-4">
                          {member.contactNo && (
                            <motion.a
                              href={`tel:${member.contactNo}`}
                              className="
                                flex
                                items-center
                                gap-3
                                text-sm
                                text-[#E0FBFC]/80
                                transition-colors
                                duration-300
                                hover:text-[#98C1D9]
                              "
                              initial={{
                                opacity: 0,
                                x: -10,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              transition={{
                                delay: 0.28,
                                duration: 0.3,
                              }}
                            >
                              <FaPhone className="shrink-0 text-[#98C1D9]" />
                              <span>{member.contactNo}</span>
                            </motion.a>
                          )}

                          {member.email && (
                            <motion.a
                              href={`mailto:${member.email}`}
                              className="
                                flex
                                items-center
                                gap-3
                                break-all
                                text-sm
                                text-[#E0FBFC]/80
                                transition-colors
                                duration-300
                                hover:text-[#98C1D9]
                              "
                              initial={{
                                opacity: 0,
                                x: -10,
                              }}
                              animate={{
                                opacity: 1,
                                x: 0,
                              }}
                              transition={{
                                delay: 0.33,
                                duration: 0.3,
                              }}
                            >
                              <FaEnvelope className="shrink-0 text-[#98C1D9]" />
                              <span>{member.email}</span>
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;