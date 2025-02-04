import React from 'react';
import {faqData} from '@/data/faq-data';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQComponent: React.FC = () => {
  return (
    <div className="space-y-6 p-8">
      {faqData.map((item: FAQItem, index: number) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
          <p className="text-gray-700">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQComponent;