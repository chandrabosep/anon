import React from 'react';
import { Star } from 'lucide-react';

type Company = {
  name: string;
  reputation: number;
};

const companies: Company[] = [
  { name: "TechVision Corp", reputation: 4.8 },
  { name: "Global Innovations", reputation: 4.5 },
  { name: "Future Systems", reputation: 4.3 },
  { name: "DataFlow Inc", reputation: 4.2 },
  { name: "Cloud Dynamics", reputation: 4.0 },
  { name: "Smart Solutions", reputation: 3.9 },
  { name: "Digital Nexus", reputation: 3.8 },
  { name: "Quantum Corp", reputation: 3.7 },
  { name: "Cyber Systems", reputation: 3.6 },
  { name: "Tech Frontier", reputation: 3.5 }
];

function CompanyCard({ company }: { company: Company }) {
  const firstLetter = company.name.charAt(0);
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < Math.floor(company.reputation)
          ? 'text-blue-400 fill-blue-400'
          : 'text-gray-600'
      }`}
    />
  ));

  return (
    <div className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{firstLetter}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{company.name}</h3>
          <div className="flex items-center gap-1">
            {stars}
            <span className="ml-2 text-gray-400">({company.reputation})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function page() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Company Ratings</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Anonymous feedback-based company reputation scores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {companies.map((company, index) => (
            <CompanyCard key={index} company={company} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;