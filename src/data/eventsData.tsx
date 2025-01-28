import { Category } from "./categoryData";

interface Event {
  name: string;
  image: string;
  registrationLink: string;
  rulebook: string;
}

type EventsData = Record<Category, Event[]>;

const eventsData: EventsData = {
  "DANCE AND DRAMA CLUB": [
    {
      name: "Flash Mob",
      image: "/images/events/flash-mob.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Dance Competitions",
      image: "/images/events/dance-competition.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Team Dance",
      image: "/images/events/group-dance.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Prom Night (Open For All)",
      image: "/images/events/prom-night.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Classical Song",
      image: "/images/events/class-song.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Multi Fusion Traditional Dance on opening day",
      image: "/images/events/fusion-dance.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Drama Performance by NITM Students",
      image: "/images/events/drama-performance.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Drama competition(inter NIT)",
      image: "/images/events/drama-competition.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "EBSB CLUB": [
    {
      name: "Cultural Exhibition",
      image: "/images/events/cultural-exhibition.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Food Fest",
      image: "/images/events/food-fest.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "FUN EVENTS": [
    {
      name: "Buzz wire",
      image: "/images/events/buzz-wire.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Gun shooting",
      image: "/images/events/gun-shooting.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Dart Shooting",
      image: "/images/events/dart-shooting.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "GAMING ": [
    {
      name: "Game 1",
      image: "/images/events/game-1.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Game 2 (Inter)",
      image: "/images/events/game-2.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "KRIGG ": [
    {
      name: "Dumb Charades",
      image: "/images/events/dumb-charades.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Snake & Ladder",
      image: "/images/events/snake-ladder.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Musical Chair",
      image: "/images/events/musical-chair.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Rangoli",
      image: "/images/events/rangoli.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Tug of War",
      image: "/images/events/tug-of-war.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Box Cricket",
      image: "/images/events/box-cricket.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "LITERARY CLUB": [
    {
      name: "Treasure Hunt",
      image: "/images/events/treasure-hunt.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Open Mic",
      image: "/images/events/open-mic.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Literary Quiz",
      image: "/images/events/literary-quiz.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Doodle Art",
      image: "/images/events/doodle-art.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Jam Chat",
      image: "/images/events/jam-chat.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  MAINS: [
    {
      name: "Shimmer",
      image: "/images/events/shimmer.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Panache",
      image: "/images/events/panache.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "MODEL UNITED NATIONS": [
    {
      name: "MUN",
      image: "/images/events/mun.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "MUSIC CLUB": [
    {
      name: "Symphony",
      image: "/images/events/symphony.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Instrumental",
      image: "/images/events/instrumental.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Battle of the Bands (Inter)",
      image: "/images/events/battle-of-bands.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "PHOTOGRAPHY & FINE ARTS CLUB": [
    {
      name: "Photo Walk",
      image: "/images/events/photo-walk.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Art Battle",
      image: "/images/events/art-battle.jpg",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Short Film making competition",
      image: "/images/events/short-film.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "SPIC MACAY": [
    {
      name: "SPIC MACAY",
      image: "/images/events/spicmacay.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "TASKFORCE CLUB": [
    {
      name: "Stand-Up Comedy",
      image: "/images/events/stand-up-comedy.jpg",
      registrationLink: "",
      rulebook: "",
    },
  ],
};

export default eventsData;
