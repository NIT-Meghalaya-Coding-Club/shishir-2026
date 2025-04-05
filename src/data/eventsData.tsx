import { Category } from "./categoryData";

interface Event {
  registrationClosed?: boolean;
  code: string;
  name: string;
  image: string;
  eventType?: "individual" | "team" | "performance";
  allowPerformanceTypes?: boolean;
  
  registrationLink: string;
  rulebook: string;
  min: number;
  max: number;
  paymentRequired?: { 
    amount: number;    // Amount in rupees
    qrCodeUrl: string; // URL to the event-specific QR code image
  };
}

type EventsData = Record<Category, Event[]>;

const eventsData: EventsData = {
  "DANCE AND DRAMA CLUB": [
    {
      code: "flash_mob",
      name: "Flash Mob",
      image: "/img/event/Flash-Mob.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://forms.gle/3SpbzLLYs9q52GBH6",
      rulebook: "",
      min: 3,
      max: 5,
    },
    {
      code: "dance_comp",
      name: "Dance Competitions",
      image: "/img/event/dance-competition.webp",
      registrationClosed: true,
      eventType: "performance",
      registrationLink: "https://shishir.nitm.ac.in/register/dance_comp",
      rulebook:
        "https://drive.google.com/file/d/1w2tB4lvZtp3qQiqOPG_giRYmMZiaVXHu/view?usp=drive_link",
      min: 1,
      max: 12,
    },
    {
      code: "prom_night",
      name: "Prom Night",
      image: "/img/event/PromNight.webp",
      registrationClosed: true,
      registrationLink: "https://shishir.nitm.ac.in/register/prom_night",
      rulebook:
        "https://drive.google.com/file/d/1V8O3waMwpn5cZdGxGNyXW2d7IMBPPxsg/view?usp=drive_link",
      min: 2,
      max: 2,
    },
    {
      code: "drama_comp",
      name: "Drama Competition",
      image: "/img/event/drama-competition.webp",
      registrationClosed: true,
      eventType: "performance",
      registrationLink: "https://shishir.nitm.ac.in/register/drama_comp",
      rulebook:
        "https://drive.google.com/file/d/1-XSeDmF7xa-2N5sEPSkB3hOS7tudBtQb/view?usp=drive_link",
      min: 1,
      max: 8,
    },
  ],
  "EBSB CLUB": [
    {
      code: "cul_exb",
      name: "Cultural Exhibition",
      image: "/img/event/cultural-exhibition.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/cul_exb",
      rulebook: "https://drive.google.com/file/d/1KY9CJJAnN2ULf2Vft9C8-avyiz6oDkV1/view?usp=drive_link",
      min: 3,
      max: 5,
    },
    {
      code: "food_fest",
      name: "Food Fest",
      image: "/img/event/food-fest.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/food_fest",
      rulebook: "https://drive.google.com/file/d/1aRwP2v0403OTBbJF-TEOZTf91rPgSyRC/view?usp=drive_link",
      min: 3,
      max: 5,
    },
  ],
  "FUN EVENTS": [
    {
      code: "buzz_wire",
      name: "Buzz wire",
      image: "/img/event/BUZZWIRE.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/buzz_wire",
      rulebook: "",
      min: 1,
      max: 1,
    },
    {
      code: "shoot_cont",
      name: "Shooting Contest",
      image: "/img/event/shooting-contest.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/shoot_cont",
      rulebook: "",
      min: 1,
      max: 1,
    },
    {
      code: "dart_throw",
      name: "Dart Throwing",
      image: "/img/event/dart-throwing.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/dart_throw",
      rulebook: "",
      min: 1,
      max: 1,
    },
  ],
  "GAMING ": [
    {
      code: "valorant",
      name: "Valorant",
      image: "/img/event/Valorant.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/valorant",
      rulebook: "",
      min: 5,
      max: 7,
    },
    {
      code: "free_fire",
      name: "Free Fire",
      image: "/img/event/FreeFire.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/free_fire",
      rulebook: "",
      min: 4,
      max: 6,
    },
  ],
  "KRIGG ": [
    {
      code: "dumb_charades",
      name: "Dumb Charades",
      image: "/img/event/dumb-charades.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/dumb_charades",
      rulebook:
        "https://drive.google.com/file/d/1CHjVCSmjexOCn8U7uwsW2-S-QILMOKGQ/view?usp=drive_link",
      min: 4,
      max: 4,
    },
    {
      code: "snake_ladder",
      name: "Snake & Ladder",
      image: "/img/event/snake-ladder.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/snake_ladder",
      rulebook:
        "https://drive.google.com/file/d/1KzfVIYtkNzMgjxOwdSvabjhwnKQtaLdy/view?usp=drive_link",
      min: 1,
      max: 1,
    },
    {
      code: "mus_chair",
      name: "Musical Chair",
      image: "/img/event/musical-chair.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/mus_chair",
      rulebook:
        "https://drive.google.com/file/d/1CvkT7AZ7Iq8cu2DZKFOX28ClAH5kl79F/view?usp=drive_link",
      min: 1,
      max: 1,
    },
    // {
    //   code: "rangoli",
    //   name: "Rangoli",
    //   image: "/img/event/Rangoli.webp",
    //   eventType: "individual",
    //   registrationLink: "https://shishir.nitm.ac.in/register/rangoli",
    //   rulebook: "",
    //   min: 1,
    //   max: 1,
    // },
    {
      code: "tug_war",
      name: "Tug of War",
      image: "/img/event/tug-of-war.webp",
      eventType: "team",
      registrationClosed: true,
      registrationLink: "https://shishir.nitm.ac.in/register/tug_war",
      rulebook:
        "https://drive.google.com/file/d/1vaFLkFBOMuSKwihqXCrDB6lMBMhbR1xT/view?usp=drive_link",
      min: 6,
      max: 8,
    },
    {
      code: "box_cric",
      name: "Box Cricket",
      image: "/img/event/box-cricket.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/box_cric",
      rulebook: "",
      min: 3,
      max: 5,
    },
  ],
  "LITERARY CLUB": [
    {
      code: "trea_hunt",
      name: "Treasure Hunt",
      image: "/img/event/treasure-hunt.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/trea_hunt",
      rulebook:
        "https://drive.google.com/file/d/1UO0GFETWJuuRc1CkH2TA2Zme5i3y4_CQ/view?usp=drive_link",
      min: 3,
      max: 3,
    },
    {
      code: "open_mic",
      name: "Open Mic",
      image: "/img/event/open-mic.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/open_mic",
      rulebook:
        "https://drive.google.com/file/d/16VJQwKGyWCL6lUbowYu9F365bnP8lyre/view?usp=drive_link",
      min: 1,
      max: 1,
    },
    {
      code: "lit_quiz",
      name: "Literary Quiz",
      image: "/img/event/literary-quiz.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/lit_quiz",
      rulebook:
        "https://drive.google.com/file/d/1Dq7tPP2R3s4lc2L76UC1TuZL7ZnfXhbv/view?usp=drive_link",
      min: 2,
      max: 2,
    },
    {
      code: "doo_art",
      name: "Doodle Art",
      image: "/img/event/doodle-art.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/doo_art",
      rulebook:
        "https://drive.google.com/file/d/103G69lMyhM-kEfglXSRUIA0Q9BtRjcDh/view?usp=drive_link",
      min: 1,
      max: 1,
    },
    {
      code: "jam",
      name: "Jam",
      image: "/img/event/JustaMinute.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/jam",
      rulebook:
        "https://drive.google.com/file/d/1qRhXYIjzia9D0eKjkMKznqwRlnJWCDuk/view?usp=drive_link",
      min: 1,
      max: 1,
    },
  ],
  MAINS: [
    {
      code: "shimmer",
      name: "Shimmer",
      image: "/img/event/shimmer.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/shimmer",
      rulebook: "",
      min: 1,
      max: 1,
    },
    {
      code: "panache",
      name: "Panache",
      image: "/img/event/panache.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSdlssD9Fyi1OkVPkmCJWM_zKyxjlv7j_tmx9oPbZntbNzl48Q/viewform?usp=header",
      rulebook:
        "https://drive.google.com/file/d/1gO8hkDCNbLRpaE0DC1rCP94bzepdMc3K/view?usp=drive_link",
      min: 1,
      max: 2,
    },
  ],
  "MODEL UNITED NATIONS": [
    {
      code: "mun",
      name: "MUN",
      image: "/img/mun_logo.webp",
      registrationClosed: true,
      registrationLink: "https://docs.google.com/forms/d/1vbrhrbnte5RRreJOnH3nQlgewDCuSv2aLWFw_czVg4c/viewform?ts=67bde88f&edit_requested=true",
      rulebook: "https://shishir.nitm.ac.in/mun",
      min: 1,
      max: 1,
    },
  ],
  "MUSIC CLUB": [
    {
      code: "symp",
      name: "Symphony",
      image: "/img/event/symphony.webp",
      registrationClosed: true,
      eventType: "team",
      registrationLink: "https://shishir.nitm.ac.in/register/symp",
      rulebook:
        "https://drive.google.com/file/d/1FaXgmzXhHPWGbsrGVtdRPn5oI4SRq3uy/view?usp=sharing",
      min: 1,
      max: 2,
    },
    {
      code: "inst",
      name: "Instrumental",
      image: "/img/event/Instrumental.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/inst",
      rulebook:
        "https://drive.google.com/file/d/1FaXgmzXhHPWGbsrGVtdRPn5oI4SRq3uy/view?usp=sharing",
      min: 3,
      max: 5,
    },
    {
      code: "bob",
      name: "Battle of the Bands",
      eventType: "team",
      image: "/img/event/battle-of-bands.webp",
      registrationClosed: true,
      registrationLink: "https://shishir.nitm.ac.in/register/bob",
      rulebook:
        "https://drive.google.com/file/d/1FaXgmzXhHPWGbsrGVtdRPn5oI4SRq3uy/view?usp=sharing",
      min: 4,
      max: 7,
      paymentRequired: {  // Add this
        amount: 700,
        qrCodeUrl: "/payment/bob.jpg",
      },
    },
  ],
  "PHOTOGRAPHY & FINE ARTS CLUB": [
    {
      code: "photo_walk",
      name: "Photo Walk",
      eventType: "individual",
      image: "/img/event/photo-walk.webp",
      registrationClosed: true,
      registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSdYGl47FvapzMbryH-iPuweSjKSbote-ZYBzgsdO3QI_xk7Sg/viewform?usp=pp_url",
      rulebook:
        "https://drive.google.com/file/d/1wgWtdFB_iEKHzJ2pNXpJa7Xz9aIYgr4q/view?usp=drive_link",
      min: 1,
      max: 1,
    },
    {
      code: "art_bat",
      name: "Art Battle",
      image: "/img/event/art-battle.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/art_bat",
      rulebook:
        "https://drive.google.com/file/d/1YJoZHhUXDKi8gdb4reoWiZ_pmhUYdtWu/view?usp=drive_link",
      min: 1,
      max: 1,
    },
    {
      code: "reel_makg",
      name: "Reel Making Competition",
      image: "/img/event/reel-making-competition.webp",
      registrationClosed: true,
      eventType: "individual",
      registrationLink: "https://shishir.nitm.ac.in/register/reel_makg",
      rulebook:
        "https://drive.google.com/file/d/1j2tiYXteDOsZoEymNk7YzhC10xEA6Y4J/view?usp=drive_link",
      min: 1,
      max: 1,
    },
  ],
};

export default eventsData;
