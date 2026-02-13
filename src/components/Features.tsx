'use client';

import React from 'react';
import { ShieldCheck, DollarSign, Star } from 'lucide-react';

const features = [
  {
    icon: <Star className="h-8 w-8 text-green-600" />,
    title: 'Proof of quality',
    description: 'Check any pro’s work samples, client reviews, and identity verification.',
  },
  {
    icon: <DollarSign className="h-8 w-8 text-green-600" />,
    title: 'No cost until you hire',
    description: 'Interview potential fits for your job, negotiate rates, and only pay for work you approve.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
    title: 'Safe and secure',
    description: 'Focus on your work knowing we help protect your data and privacy. We’re here with 24/7 support if you need it.',
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">Why businesses turn to eventIQ</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center md:items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
