// src/data/genreData.ts (or any suitable location)
export interface Genre {
    name: string;
    competitions: string[];
  }
  
  export const genres: Genre[] = [
    { name: "CULTURAL", competitions: ["Spic Macay", "Traditional Dance"] },
    { name: "MUSIC", competitions: ["Battle of Bands", "Symphony", "Open Mic"] },
    { name: "GAMING", competitions: ["PC Gaming"] },
    { name: "DANCE", competitions: ["Step Up"] },
  ];
  