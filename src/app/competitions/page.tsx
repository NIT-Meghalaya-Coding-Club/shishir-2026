import React from 'react'
import GenreList from '@/components/competition/genreList';
import FAQComponent from '@/components/competition/faq-section';

const genres = [
  { name: 'DANCE' },
  { name: 'DRAMATICS' },
  { name: 'SPEAKING ARTS' },
  { name: 'SPEAKING ARTS' },
  { name: 'SPEAKING ARTS' },
  { name: 'SPEAKING ARTS' },
];

const Competition: React.FC = () => {
  return (
    <div className="p-10">
      <h1 className="text-[13vw] font-bold mb-4 mt-20 text-center text-teal-950">GENRES</h1>
        <GenreList genres={genres} />
      <div className='text-center text-[10vw] text-bold mt-20'>
        FAQs
      </div>
      <div className="min-h-screen bg-gray-50 py-12">
        <FAQComponent />
      </div>
      <div className="mt-8">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Competitions Head</h2>
      <div className="space-y-2">
        <p className="text-gray-700"><strong>aaaaaaaaaaa</strong></p>
        <p className="text-gray-700">Phone: <a href="tel:xxxxxxxxxx" className="text-blue-500 hover:underline">+91 7066615145</a></p>
        <p className="text-gray-700"><strong>bbbbbbbbb</strong></p>
        <p className="text-gray-700">Phone: <a href="tel:xxxxxxxxx" className="text-blue-500 hover:underline">+91 9399359503</a></p>
      </div>
    </div>
      </div>
    </div>
  );
};

export default Competition;