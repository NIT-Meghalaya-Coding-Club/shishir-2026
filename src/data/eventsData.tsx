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
      image: "/img/event/Flash-Mob.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Dance Competitions",
      image: "/img/event/dance-competition.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Team Dance",
      image: "/img/event/group-dance.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Prom Night",
      image: "/img/event/prom-night.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Classical Song",
      image: "/img/event/class-song.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Drama Competition",
      image: "/img/event/drama-competition.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "EBSB CLUB": [
    {
      name: "Cultural Exhibition",
      image: "/img/event/cultural-exhibition.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Food Fest",
      image: "/img/event/food-fest.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "FUN EVENTS": [
    {
      name: "Buzz wire",
      image: "/img/event/buzz-wire.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Shooting Contest",
      image: "/img/event/shooting-contest.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Dart Throwing",
      image: "/img/event/dart-throwing.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "GAMING ": [
    {
      name: "Game 1",
      image: "/img/event/game-1.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "KRIGG ": [
    {
      name: "Dumb Charades",
      image: "/img/event/dumb-charades.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Snake & Ladder",
      image: "/img/event/snake-ladder.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Musical Chair",
      image: "/img/event/musical-chair.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Rangoli",
      image: "/img/event/Rangoli.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Tug of War",
      image: "/img/event/tug-of-war.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Box Cricket",
      image: "/img/event/box-cricket.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "LITERARY CLUB": [
    {
      name: "Treasure Hunt",
      image: "/img/event/treasure-hunt.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Open Mic",
      image: "/img/event/open-mic.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Literary Quiz",
      image: "/img/event/literary-quiz.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Doodle Art",
      image: "/img/event/doodle-art.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Jam Chat",
      image: "/img/event/jam-chat.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  MAINS: [
    {
      name: "Shimmer",
      image: "/img/event/shimmer.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Panache",
      image: "/img/event/panache.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "MODEL UNITED NATIONS": [
    {
      name: "MUN",
      image: "/img/event/mun.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "MUSIC CLUB": [
    {
      name: "Symphony",
      image: "/img/event/symphony.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Instrumental",
      image: "/img/event/Instrumental.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Battle of the Bands (Inter)",
      image: "/img/event/battle-of-bands.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "PHOTOGRAPHY & FINE ARTS CLUB": [
    {
      name: "Photo Walk",
      image: "/img/event/photo-walk.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Art Battle",
      image: "/img/event/art-battle.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      name: "Reel Making Competition",
      image: "/img/event/reel-making-competition.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "SPIC MACAY": [
    {
      name: "SPIC MACAY",
      image: "/img/event/spicmacay.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "TASKFORCE CLUB": [
    {
      name: "Stand-Up Comedy",
      image: "/img/event/stand-up-comedy.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
};

export default eventsData;
