"use client";

import { defaultImageUrl, Teams } from "@/data/Teams";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaPhone, FaEnvelope } from "react-icons/fa6";
import {
  RiMenu4Line,
  RiArrowUpLine,
  RiSparkling2Fill,
} from "@remixicon/react";

import "animate.css";

import "./team_style.css";

type TeamMember = {
  name: string;
  contactNo: string;
  email: string;
  position: string;
  imageLink?: string;
};

export default function Contact() {
  const [teams, setTeams] =
    useState<Record<string, TeamMember[]>>(Teams);

  const [activeTeam, setActiveTeam] = useState(
    Object.keys(Teams)[0] ?? ""
  );

  const [showTopButton, setShowTopButton] = useState(false);

  const teamRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  const indexRefs = useRef<{
    [key: string]: HTMLButtonElement | null;
  }>({});

  const teamNames = Object.keys(teams);

  /* =============== LOAD TEAMS =============== */

  useEffect(() => {
    fetch("/api/teams")
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) return;

        const databaseTeams = data.teams || [];

        setTeams({
          ...Teams,
          ...Object.fromEntries(
            databaseTeams.map(
              (team: {
                name: string;
                members: TeamMember[];
              }) => [
                team.name,
                team.members,
              ]
            )
          ),
        });
      })
      .catch((error) =>
        console.error(
          "Failed to load teams:",
          error
        )
      );
  }, []);

  /* =============== ACTIVE TEAM DETECTION =============== */

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(
            (entry) => entry.isIntersecting
          )
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visibleEntries.length > 0) {
          setActiveTeam(
            visibleEntries[0].target.getAttribute(
              "data-team"
            ) || ""
          );
        }
      },
      {
        root: null,
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    Object.values(teamRefs.current).forEach(
      (section) => {
        if (section) {
          observer.observe(section);
        }
      }
    );

    return () => observer.disconnect();
  }, [teams]);

  /* =============== CENTER ACTIVE INDEX ITEM =============== */

  useEffect(() => {
    const activeIndexItem =
      indexRefs.current[activeTeam];

    if (activeIndexItem) {
      activeIndexItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTeam]);

  /* =============== SHOW GO TO TOP BUTTON =============== */

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(
        window.scrollY > 400
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =============== SCROLL TO TEAM =============== */

  function scrollToTeam(team: string) {
    const teamElement =
      teamRefs.current[team];

    if (teamElement) {
      const navbarOffset = 120;

      const elementPosition =
        teamElement.getBoundingClientRect()
          .top;

      const offsetPosition =
        elementPosition +
        window.scrollY -
        navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  /* =============== SCROLL TO TOP =============== */

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="teams-page w-full min-h-screen">
      {/* =============== PAGE TITLE =============== */}

      <header className="teams-header">
        <div className="teams-title-wrapper">
          <RiSparkling2Fill className="teams-icon" />

          <h1
            className="teams-title animate__animated"
            onMouseEnter={(event) => {
              event.currentTarget.classList.add("animate__rubberBand");
            }}
            onAnimationEnd={(event) => {
              event.currentTarget.classList.remove("animate__rubberBand");
            }}
          >
            Teams
          </h1>

          <RiSparkling2Fill className="teams-icon" />
        </div>
      </header>

      {/* =============== CONTENT AREA =============== */}

      <div className="flex flex-col sm:flex-row w-full">
        {/* =============== SIDEBAR / INDEX =============== */}

        <div className="team-index-sidebar">
          <nav
            className="team-index"
            aria-label="Team sections"
          >
            {teamNames.map((team) => (
              <button
                key={team}
                ref={(el) => {
                  indexRefs.current[team] = el;
                }}
                type="button"
                onClick={() => scrollToTeam(team)}
                className={`team-index__item ${
                  activeTeam === team
                    ? "team-index__item--active"
                    : ""
                }`}
              >
                {team}
              </button>
            ))}
          </nav>
        </div>

        {/* =============== MAIN CONTENT =============== */}

        <div className="teams-main relative z-10 px-4 sm:px-8 pt-4">
          {teamNames.map((team) => (
            <div
              key={team}
              ref={(el) => {
                teamRefs.current[team] =
                  el;
              }}
              data-team={team}
              className="card"
            >
              {/* =============== TEAM MEMBERS =============== */}

              <div className="card__container container">
                {teams[team].map(
                  (member, index) => {
                    const cardTheme = [
                      "card-yellow",
                      "card-green",
                      "card-pink",
                    ][index % 3];

                    return (
                      <article
                        key={`${team}-${index}`}
                        className={`card__article ${cardTheme}`}
                      >
                        {/* Profile Image */}

                        <div className="relative w-full">
                          <Image
                            src={
                              member.imageLink ||
                              defaultImageUrl
                            }
                            alt={`${member.name}'s photo`}
                            width={400}
                            height={500}
                            className="card__img"
                          />
                        </div>

                        {/* Image Shadow */}

                        <div className="card__shadow" />

                        {/* Member Basic Information */}

                        <div className="card__data">
                          <h2 className="card__name">
                            {member.name}
                          </h2>

                          <span className="card__profession">
                            {member.position}
                          </span>
                        </div>

                        {/* Expand Button */}

                        <div className="card__clip">
                          <RiMenu4Line />
                        </div>

                        {/* Expanded Information */}

                        <div className="info">
                          <div className="info__data">
                            <h2 className="info__name">
                              {member.name}
                            </h2>

                            <p className="info__description">
                              {member.position}
                            </p>

                            <div className="info__divider" />

                            <div className="info__contact">
                              <a
                                href={`tel:${member.contactNo}`}
                                className="info__contact-link"
                              >
                                <FaPhone className="info__contact-icon" />
                                <span>
                                  {
                                    member.contactNo
                                  }
                                </span>
                              </a>

                              <a
                                href={`mailto:${member.email}`}
                                className="info__contact-link"
                              >
                                <FaEnvelope className="info__contact-icon" />
                                <span>
                                  {member.email}
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =============== GO TO TOP BUTTON =============== */}

      {showTopButton && (
        <button
          type="button"
          onClick={scrollToTop}
          className="go-top-button"
          aria-label="Go to top"
        >
          <RiArrowUpLine />
        </button>
      )}
    </div>
  );
}