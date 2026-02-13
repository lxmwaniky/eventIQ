'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Event Planning', count: '1.2k' },
  { name: 'Venue Sourcing', count: '800+' },
  { name: 'Catering Services', count: '2.5k' },
  { name: 'Audio Visual (AV)', count: '500+' },
  { name: 'Decor & Styling', count: '1.8k' },
  { name: 'Entertainment', count: '3k+' },
  { name: 'Photography', count: '2k+' },
  { name: 'Security', count: '400+' },
];

const Categories = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse talent by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gray-50 rounded-lg p-6 hover:bg-green-50 transition-colors cursor-pointer border border-transparent hover:border-green-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                {category.name}
              </h3>
              <div className="flex justify-between items-center text-sm text-gray-500 group-hover:text-green-600">
                <span>{category.count} skills</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center md:text-left">
           <p className="text-gray-600 text-lg">Looking for work? <Link href="/signup" className="text-green-600 font-medium hover:underline">Browse jobs</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Categories;
