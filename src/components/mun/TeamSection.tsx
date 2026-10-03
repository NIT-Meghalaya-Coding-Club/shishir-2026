"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope } from "react-icons/fa6";
import { RiMenu4Line } from "@remixicon/react";

import Title from "./Title";

import "./TeamSection.css";

type TeamMember = {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  image?: string;
  position: string;
};

type MunPost = {
  _id: string;
  title: string;
  users: Omit<TeamMember, "position">[];
};

const TeamSection: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/mun/public")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load MUN team")))
      .then((data: { posts: MunPost[] }) => {
        setTeam(data.posts.flatMap((post) => post.users.map((user) => ({ ...user, position: post.title }))));
      })
      .catch((error) => console.error("Load MUN team error:", error));
  }, []);

  return (
    <section className="team-section">
      {/* Section Heading */}
      <Title text="Meet the Team" />

      {/* Team Cards */}
      <div className="card__container">
        {team.map((member, index) => {
          const imageUrl = member.image || "/defaultPhoto.webp";

          return (
            <motion.article
              key={`${member._id}-${member.position}`}
              className="card__article"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                opacity: {
                  duration: 0.7,
                  delay: index * 0.08,
                },
                y: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            >
              {/* Image */}
              <div className="card__image-wrapper">
                <div
                  className="card__img"
                  style={{
                    backgroundImage: `url("${imageUrl}")`,
                  }}
                />
              </div>

              {/* Image Bottom Overlay */}
              <div className="card__shadow" />

              {/* Name and Position */}
              <div className="card__data">
                <h2 className="card__name">{member.name}</h2>

                <span className="card__profession">
                  {member.position}
                </span>
              </div>

              {/* Contact Button */}
              <div className="card__clip">
                <RiMenu4Line />
              </div>

              {/* Contact Information */}
              <div className="info">
                <div className="info__data">
                  <h2 className="info__name">{member.name}</h2>

                  <p className="info__description">
                    {member.position}
                  </p>

                  <div className="info__divider" />

                  <div className="info__contact">
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="info__contact-link"
                      >
                        <FaPhone className="info__contact-icon" />
                        <span>{member.phone}</span>
                      </a>
                    )}

                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="info__contact-link"
                      >
                        <FaEnvelope className="info__contact-icon" />
                        <span>{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default TeamSection;