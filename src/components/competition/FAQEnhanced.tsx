"use client";
import React from "react";
import { motion } from "framer-motion";
import router from "next/router";
import Link from "next/link";

const faqData = [
  {
    question: "Who can participate in the competitions?",
    answer:
      "All students from recognized colleges and universities are eligible to participate. Some competitions may have specific eligibility criteria, which will be mentioned in their respective guidelines.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "Most competitions have a nominal registration fee that varies based on the event. Early bird registrations get special discounts. Check the specific competition page for details.",
  },
  {
    question: "Can I participate in multiple competitions?",
    answer:
      "Yes, you can register for multiple competitions as long as there are no schedule conflicts. We recommend checking the event timeline before registering.",
  },
  {
    question: "What are the prizes?",
    answer:
      "We have exciting cash prizes, trophies, certificates, and special recognition for winners. The total prize pool is over ₹500,000 across all competitions.",
  },
];

export const FAQEnhanced: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-lg overflow-hidden shadow-lg border border-blue-800"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <motion.div
              className="p-6 cursor-pointer"
              whileHover={{ backgroundColor: "rgba(30, 58, 138, 0.4)" }}
            >
              <h3 className="text-xl font-bold mb-3 text-yellow-400 flex items-center">
                <span className="text-2xl mr-2">Q.</span>
                {item.question}
              </h3>
              <div className="pl-7 text-gray-300 border-l-2 border-yellow-600 ml-1">
                <p>{item.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-gray-300 mb-6">
          Still have questions? Contact our team
        </p>
        <Link
          href="/team"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Contact Team
        </Link>
      </motion.div>
    </div>
  );
};
