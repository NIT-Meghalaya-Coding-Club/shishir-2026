import React from 'react';

interface Genre {
  name: string;
  competitions: string[];
}

interface GenreListProps {
  genres: Genre[];
}

const GenreList: React.FC<GenreListProps> = ({ genres }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {genres.map((genre, index) => (
        <div key={index} className="text-[2vw] text-center p-4 w-[30vw] bg-blue-100 rounded-lg shadow-[1vh_1vh_0_0_#520000] cursor-pointer">
          <h3 className="font-bold mb-2">{genre.name}</h3>
          <div className="text-[1.5vw]">
            {genre.competitions.map((competition, idx) => (
              <div key={idx} className="mb-1">{competition}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenreList;  