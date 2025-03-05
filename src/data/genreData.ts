// src/data/genreData.ts

export interface Competition {
  name: string;
  posterUrl: string;
  registerLink: string; // Added registerLink to the interface
}

export interface Genre {
  name: string;
  competitions: Competition[];
}

export const genreData: Genre[] = [
  {
    name: "DANCE & DRAMA COMPETITION",
    competitions: [
      {
        name: "Dance Competition",
        posterUrl: "/img/event/dance-competition.png",
        registerLink: "https://shishir.nitm.ac.in/register/dance_comp",
      },
      {
        name: "Drama Competition",
        posterUrl: "/img/event/drama-competition.png",
        registerLink: "https://shishir.nitm.ac.in/register/drama_comp",
      },
      {
        name: "Prom Night",
        posterUrl: "/img/event/PromNight.png",
        registerLink: "https://shishir.nitm.ac.in/register/prom_night",
      },
    ],
  },
  {
    name: "MUSIC",
    competitions: [
      {
        name: "Battle of Bands",
        posterUrl: "/img/event/battle-of-bands.png",
        registerLink: "https://shishir.nitm.ac.in/register/bob",
      },
      {
        name: "Symphony",
        posterUrl: "/img/event/symphony.png",
        registerLink: "https://shishir.nitm.ac.in/register/symp",
      },
      {
        name: "Instrumental",
        posterUrl: "/img/event/Instrumental.png",
        registerLink: "https://shishir.nitm.ac.in/register/inst",
      },
    ],
  },
  {
    name: "LITERARY",
    competitions: [
      {
        name: "Open Mic",
        posterUrl: "/img/event/open-mic.png",
        registerLink: "https://shishir.nitm.ac.in/register/open_mic",
      },
      {
        name: "Doodle Art",
        posterUrl: "/img/event/doodle-art.png",
        registerLink: "https://shishir.nitm.ac.in/register/doo_art",
      },
    ],
  },
  {
    name: "GAMING",
    competitions: [
      {
        name: "Valorant",
        posterUrl: "/img/event/Valorant.png",
        registerLink: "https://shishir.nitm.ac.in/register/valorant",
      },
      {
        name: "Free Fire",
        posterUrl: "/img/event/FreeFire.png",
        registerLink: "https://shishir.nitm.ac.in/register/free_fire",
      },
    ],
  },

  {
    name: "PHOTOGRAPHY",
    competitions: [
      {
        name: "Art Battle",
        posterUrl: "/img/event/art-battle.png",
        registerLink: "https://shishir.nitm.ac.in/register/art_bat",
      },
    ],
  },
  {
    name: "MUN",
    competitions: [
      {
        name: "NITM Model United Nation",
        posterUrl: "/img/mun_logo.png",
        registerLink:
          "https://docs.google.com/forms/d/1vbrhrbnte5RRreJOnH3nQlgewDCuSv2aLWFw_czVg4c/viewform?ts=67bde88f&edit_requested=true",
      },
    ],
  },
];
