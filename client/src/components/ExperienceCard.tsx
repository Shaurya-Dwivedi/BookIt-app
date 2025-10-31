import React from "react";
import type { Experience } from "../types";
import { Link } from "react-router-dom";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div className="flex flex-col w-full max-w-[280px] rounded-xl overflow-hidden">
      <img
        src={experience.imageUrl}
        alt={experience.title}
        className="h-[170px] w-full object-cover"
      />
      
      <div className="flex flex-col gap-5 p-4 bg-[#F0F0F0]">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[#161616] text-base font-medium leading-5">
              {experience.title}
            </h3>
            <div className="flex items-center justify-center bg-[#D6D6D6] rounded px-2 py-1">
              <span className="text-[#161616] text-[11px] font-medium leading-4">
                {experience.location}
              </span>
            </div>
          </div>
          
          <p className="text-[#6C6C6C] text-xs leading-4">
            Curated small-group experience. Certified guide. Safety first with gear included.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[#161616] text-xs leading-4">From</span>
            <span className="text-[#161616] text-xl font-medium leading-6">₹{experience.price}</span>
          </div>
          
          <Link to={`/experience/${experience._id}`}>
            <button className="flex items-center justify-center bg-[#FFD643] rounded px-2 py-1.5">
              <span className="text-[#161616] text-sm font-medium leading-[18px]">View Details</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
