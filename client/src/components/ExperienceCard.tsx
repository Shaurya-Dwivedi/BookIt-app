// client/src/components/ExperienceCard.tsx
import React from "react";
import type { Experience } from "../types";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
      <div className="overflow-hidden">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">
            {experience.title}
          </h3>
          <span className="bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {experience.location}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2 h-10">
          Curated small-group experience. Certified guide. Safety first with
          gear included.
        </p>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-900">
            <span className="text-sm font-normal text-gray-600">From </span>₹
            {experience.price}
          </p>
          <Link to={`/experience/${experience._id}`}>
            <button className="bg-primary text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors w-full">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
