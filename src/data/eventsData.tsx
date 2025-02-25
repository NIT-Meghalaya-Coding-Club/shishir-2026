import { Category } from "./categoryData";

interface Event {
  code: string;
  name: string;
  image: string;
  registrationLink: string;
  rulebook: string;
}

type EventsData = Record<Category, Event[]>;

const eventsData: EventsData = {
  "DANCE AND DRAMA CLUB": [
    {
      code: "flash_mob",
      name: "Flash Mob",
      image: "/img/event/Flash-Mob.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "dance_comp",
      name: "Dance Competitions",
      image: "/img/event/dance-competition.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "team_dance",
      name: "Team Dance",
      image: "/img/event/group-dance.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "prom_night",
      name: "Prom Night",
      image: "/img/event/prom-night.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "class_song",
      name: "Classical Song",
      image: "/img/event/class-song.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "drama_comp",
      name: "Drama Competition",
      image: "/img/event/drama-competition.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "EBSB CLUB": [
    {
      code: "cul_exb",
      name: "Cultural Exhibition",
      image: "/img/event/cultural-exhibition.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "food_fest",
      name: "Food Fest",
      image: "/img/event/food-fest.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "FUN EVENTS": [
    {
      code: "",
      name: "Buzz wire",
      image: "/img/event/buzz-wire.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "shoot_cont",
      name: "Shooting Contest",
      image: "/img/event/shooting-contest.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "dart_throw",
      name: "Dart Throwing",
      image: "/img/event/dart-throwing.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "GAMING ": [
    {
      code: "game_1",
      name: "Game 1",
      image: "/img/event/game-1.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "KRIGG ": [
    {
      code: "dumb_charades",
      name: "Dumb Charades",
      image: "/img/event/dumb-charades.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "snake_ladder",
      name: "Snake & Ladder",
      image: "/img/event/snake-ladder.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "mus_chair",
      name: "Musical Chair",
      image: "/img/event/musical-chair.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "rangoli",
      name: "Rangoli",
      image: "/img/event/Rangoli.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "tug_war",
      name: "Tug of War",
      image: "/img/event/tug-of-war.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "box_cric",
      name: "Box Cricket",
      image: "/img/event/box-cricket.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "LITERARY CLUB": [
    {
      code: "trea_hunt",
      name: "Treasure Hunt",
      image: "/img/event/treasure-hunt.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "open_mic",
      name: "Open Mic",
      image: "/img/event/open-mic.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "lit_quiz",
      name: "Literary Quiz",
      image: "/img/event/literary-quiz.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "doo_art",
      name: "Doodle Art",
      image: "/img/event/doodle-art.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "jam_chat",
      name: "Jam Chat",
      image: "/img/event/jam-chat.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  MAINS: [
    {
      code: "shimmer",
      name: "Shimmer",
      image: "/img/event/shimmer.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "panache",
      name: "Panache",
      image: "/img/event/panache.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "MODEL UNITED NATIONS": [
    {
      code: "mun",
      name: "MUN",
      image: "/img/event/mun.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "MUSIC CLUB": [
    {
      code: "symp",
      name: "Symphony",
      image: "/img/event/symphony.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "inst",
      name: "Instrumental",
      image: "/img/event/Instrumental.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "bob",
      name: "Battle of the Bands (Inter)",
      image: "/img/event/battle-of-bands.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "PHOTOGRAPHY & FINE ARTS CLUB": [
    {
      code: "photo_walk",
      name: "Photo Walk",
      image: "/img/event/photo-walk.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "art_bat",
      name: "Art Battle",
      image: "/img/event/art-battle.png",
      registrationLink: "",
      rulebook: "",
    },
    {
      code: "reel_makg",
      name: "Reel Making Competition",
      image: "/img/event/reel-making-competition.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "SPIC MACAY": [
    {
      code: "spic_mac",
      name: "SPIC MACAY",
      image: "/img/event/spicmacay.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
  "TASKFORCE CLUB": [
    {
      code: "stand_up",
      name: "Stand-Up Comedy",
      image: "/img/event/stand-up-comedy.png",
      registrationLink: "",
      rulebook: "",
    },
  ],
};

export default eventsData;
