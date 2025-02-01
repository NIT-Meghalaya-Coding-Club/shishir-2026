import React from 'react';

interface Genre {
  name: string;
}

interface GenreListProps {
  genres: Genre[];
}

const GenreList: React.FC<GenreListProps> = ({ genres }) => {
  return (
        <div className="flex flex-wrap gap-4">
      {genres.map((genre, index) => (
        <div key={index} className="text-[2vw] text-center text-nowrap text-bold p-4 w-[30vw] h-[30vw] bg-blue-100 rounded-lg shadow-[1vh_1vh_0_0_#520000] cursor-pointer">
          {genre.name}
        </div>
      ))}
    </div>
    
  );
};

export default GenreList;   