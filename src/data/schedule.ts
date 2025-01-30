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
    "inaugural": [
      {
        name: "Opening Ceremony & SPIC MACAY",
        time: "09:00 - 10:30",
        place: "Main Auditorium",
        description: "Traditional cultural performance and inaugural ceremony",
        category: "cultural",
        speakers: ["Dr. Rajesh Kumar", "Pandit Birju Maharaj"]
      }
    ],
    "cultural": [
      {
        name: "Cultural Exhibition",
        time: "11:00 - 17:00",
        place: "Exhibition Hall",
        description: "Showcasing diverse cultural heritage through art and artifacts",
        category: "exhibition"
      },
      {
        name: "Symphony",
        time: "14:00 - 16:00",
        place: "Concert Hall",
        description: "Musical performances featuring classical and modern fusion",
        category: "music",
        speakers: ["Music Club Coordinators"]
      }
    ],
    "evening": [
      {
        name: "Battle of Bands",
        time: "17:00 - 19:30",
        place: "Open Air Theatre",
        description: "Inter-college band competition",
        category: "music"
      }
    ]
  },
  "day 2": {
    "morning": [
      {
        name: "MUN Conference",
        time: "09:00 - 13:00",
        place: "Conference Hall",
        description: "Model United Nations debate and discussion",
        category: "academic",
        speakers: ["Prof. Sarah Mitchell", "Dr. James Cooper"]
      },
      {
        name: "Literary Quiz",
        time: "10:00 - 12:00",
        place: "Seminar Hall",
        description: "Competitive quiz on literature and arts",
        category: "literary"
      }
    ],
    "afternoon": [
      {
        name: "Drama Competition",
        time: "14:00 - 17:00",
        place: "Main Auditorium",
        description: "Inter-NIT theatrical performances",
        category: "drama"
      },
      {
        name: "Gaming Tournament",
        time: "15:00 - 18:00",
        place: "Tech Hub",
        description: "Competitive gaming championships",
        category: "gaming"
      }
    ],
    "evening": [
      {
        name: "Classical Dance Showcase",
        time: "18:30 - 20:30",
        place: "Main Stage",
        description: "Traditional dance performances",
        category: "dance",
        speakers: ["Ms. Anjali Mehta"]
      }
    ]
  },
  "day 3": {
    "competitions": [
      {
        name: "Short Film Festival",
        time: "09:00 - 12:00",
        place: "Media Center",
        description: "Screening of student-made short films",
        category: "film",
        speakers: ["Prof. Robert Adams"]
      },
      {
        name: "Art Battle",
        time: "10:00 - 13:00",
        place: "Creative Studio",
        description: "Live competitive art creation",
        category: "arts"
      }
    ],
    "performances": [
      {
        name: "Stand-Up Comedy Show",
        time: "14:00 - 16:00",
        place: "College Auditorium",
        description: "Humor and entertainment by student performers",
        category: "entertainment"
      }
    ],
    "finale": [
      {
        name: "Shimmer & Panache",
        time: "17:00 - 19:00",
        place: "Grand Arena",
        description: "Fashion show and cultural extravaganza",
        category: "flagship"
      },
      {
        name: "Closing Ceremony",
        time: "19:30 - 21:00",
        place: "Main Ground",
        description: "Award distribution and closing celebrations",
        category: "closing",
        speakers: ["College Director", "Cultural Secretary"]
      }
    ]
  }
};