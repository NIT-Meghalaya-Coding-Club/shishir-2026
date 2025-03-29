export interface EventType {
  name: string;
  time: string;
  place: string;
  description: string;
  category: string;
  speakers?: string[];
}

export const Schedule: { [key: string]: { [key: string]: EventType[] } } = {
  "day 1": {
    "Inaugural": [
      {
        name: "Inauguration",
        time: "10:30 AM - 12:00 PM",
        place: "Main Stage",
        description: "Welcome speech, performances, felicitation, speeches, and fest opening ceremony.",
        category: "ceremony",
        speakers: ["President, SAC", "Dean, SW", "Chief Guest", "Director", "Vice President, Cultural"]
      }
    ],
    "Fun Events": [
      { name: "Buzz Wire", time: "After Inauguration", place: "Stalls", description: "Fun game event.", category: "fun" },
      { name: "Arm Wrestling", time: "After Inauguration", place: "Stalls", description: "Test your strength!", category: "fun" },
      { name: "Gun Shooting", time: "After Inauguration", place: "Stalls", description: "Target shooting event.", category: "fun" },
      { name: "Dart Shooting", time: "After Inauguration", place: "Stalls", description: "Test your aiming skills!", category: "fun" }
    ],
    "Cultural": [
      { name: "Symphony", time: "12:30 PM - 01:30 PM", place: "Main Stage", description: "Music club event with solo and group performances.", category: "music" },
      { name: "Instrumental", time: "01:30 PM - 02:30 PM", place: "Main Stage", description: "Instrumental music event open to all students.", category: "music" },
      { name: "Step Up, Dramatics, Traditional Dance", time: "02:45 PM - 05:30 PM", place: "Main Stage", description: "Dance and drama competition featuring inter-institute participants.", category: "performance" }
    ],
    "Literary": [
      { name: "Jam Chat", time: "02:00 PM - 03:00 PM", place: "LH3", description: "Just A Minute (JAM) session where participants speak without hesitation.", category: "literary" }
    ],
    "Evening": [
      { name: "Classical Night", time: "06:30 PM - 08:00 PM", place: "Main Stage", description: "An Evening of classical performances.", category: "music" }
    ]
  },
  "day 2": {
    "Morning": [
      { name: "PC Gaming", time: "10:00 AM - 11:30 AM", place: "Main Stage", description: "PC gaming competition with teams of 4-5 members.", category: "gaming" },
      { name: "Food Fest", time: "10:30 AM - 06:30 PM", place: "Stalls", description: "Culinary event under Ek Bharat Shreshtha Bharat.", category: "exhibition" }
    ],
    "Afternoon": [
      { name: "Step Up, Dramatics, Traditional Dance", time: "12:00 PM - 02:30 PM", place: "Main Stage", description: "Continuation of dance and drama events.", category: "performance" },
      { name: "Quiz Time", time: "12:30 PM - 01:30 PM", place: "LH3", description: "Quiz competition on books, authors, and literature.", category: "literary" },
      { name: "Battle of the Bands", time: "02:45 PM - 05:00 PM", place: "Main Stage", description: "Inter-institute band competition.", category: "music" },
      { name: "Open Mic", time: "02:30 PM - 04:00 PM", place: "LH3", description: "A platform for participants to share their thoughts through storytelling, poetry, and comedy.", category: "literary" },
      { name: "Treasure Hunt", time: "04:00 PM - 05:00 PM", place: "LH3", description: "Final round of the treasure hunt event.", category: "fun" }
    ],
    "Evening": [
      { name: "Shimmer", time: "05:00 PM - 06:15 PM", place: "Main Stage", description: "Talent and personality contest for 1st and 2nd-year students.", category: "performance" },
      { name: "Artist Performance", time: "07:00 PM - 08:00 PM", place: "Main Stage", description: "Live performance by a guest artist.", category: "music" }
    ]
  },
  "day 3": {
    "Morning": [
      { name: "Model United Nations", time: "All Day", place: "Classrooms (Block D/C)", description: "Simulation of UN debates on global issues.", category: "debate" },
      { name: "Battle of the Bands", time: "10:00 AM - 12:30 PM", place: "Main Stage", description: "Continuation of the band competition.", category: "music" },
      { name: "Musical Chair", time: "10:00 AM - 11:00 AM", place: "In front of Main Stage", description: "Fun event with elimination rounds.", category: "fun" },
      { name: "Snakes and Ladders", time: "11:00 AM - 12:30 PM", place: "In front of Main Stage", description: "Life-size board game event.", category: "fun" },
      { name: "Art Battle", time: "10:30 AM - 11:30 AM", place: "Drawing Hall", description: "Art competition by Photography & Fine Arts Club.", category: "art" }
    ],
    "Afternoon": [
      { name: "Doodle Art", time: "11:35 AM - 12:35 PM", place: "LH3", description: "Freehand drawing event.", category: "art" },
      { name: "Panache", time: "01:00 PM - 03:30 PM", place: "Main Stage", description: "Fashion show representing India's cultural diversity.", category: "performance" }
    ],
    "Closing Ceremony": [
      {
        name: "Closing Ceremony & Prize Distribution",
        time: "04:15 PM - 06:00 PM",
        place: "Main Stage",
        description: "Speeches, prize distribution, and closing remarks.",
        category: "ceremony",
        speakers: ["President, SAC", "Dean, SW", "Chief Guest", "Director", "Vice President, Cultural"]
      }
    ],
    "Evening": [
      { name: "DJ Night", time: "06:30 PM - 08:00 PM", place: "Main Stage", description: "Concluding musical event with live DJ.", category: "music" }
    ]
  }
};
