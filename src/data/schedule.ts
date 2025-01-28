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
    "keynotes": [
      {
        name: "Future of Technology",
        time: "09:00 - 10:30",
        place: "Grand Ballroom",
        description: "Opening keynote discussing emerging tech trends",
        category: "keynotes",
        speakers: ["Dr. Sarah Chen", "Mark Thompson"]
      },
      {
        name: "Innovation in AI",
        time: "11:00 - 12:30",
        place: "Grand Ballroom",
        description: "Exploring breakthrough AI applications",
        category: "keynotes",
        speakers: ["Prof. James Wilson"]
      }
    ],
    "workshops": [
      {
        name: "Hands-on Machine Learning",
        time: "14:00 - 16:00",
        place: "Workshop Room A",
        description: "Interactive ML workshop for beginners",
        category: "workshops",
        speakers: ["Dr. Emily Martinez"]
      },
      {
        name: "Cloud Architecture",
        time: "16:30 - 18:30",
        place: "Workshop Room B",
        description: "Building scalable cloud solutions",
        category: "workshops"
      }
    ]
  },
  "day 2": {
    "technical": [
      {
        name: "Quantum Computing",
        time: "09:00 - 10:30",
        place: "Tech Hall 1",
        description: "Deep dive into quantum algorithms",
        category: "technical",
        speakers: ["Dr. Robert Chang"]
      },
      {
        name: "Blockchain Development",
        time: "11:00 - 12:30",
        place: "Tech Hall 2",
        description: "Advanced blockchain concepts",
        category: "technical"
      }
    ],
    "networking": [
      {
        name: "Startup Meetup",
        time: "14:00 - 16:00",
        place: "Networking Lounge",
        description: "Connect with founders and investors",
        category: "networking"
      },
      {
        name: "Career Fair",
        time: "16:30 - 18:30",
        place: "Exhibition Hall",
        description: "Meet top tech companies",
        category: "networking"
      }
    ]
  },
  "day 3": {
    "panels": [
      {
        name: "Future of Work",
        time: "09:00 - 10:30",
        place: "Panel Room 1",
        description: "Expert discussion on remote work trends",
        category: "panels",
        speakers: ["Lisa Johnson", "Michael Brown", "David Lee"]
      },
      {
        name: "Sustainability in Tech",
        time: "11:00 - 12:30",
        place: "Panel Room 2",
        description: "Green technology initiatives",
        category: "panels",
        speakers: ["Emma Wilson", "Tom Clark"]
      }
    ],
    "closing": [
      {
        name: "Awards Ceremony",
        time: "14:00 - 15:30",
        place: "Grand Ballroom",
        description: "Recognizing outstanding contributions",
        category: "closing"
      },
      {
        name: "Closing Party",
        time: "16:00 - 18:00",
        place: "Rooftop Garden",
        description: "Networking and celebrations",
        category: "closing"
      }
    ]
  }
};