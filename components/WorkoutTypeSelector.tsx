import React from 'react';
import { WORKOUT_OPTIONS } from '../constants';
import { WorkoutType } from '../types';

interface WorkoutTypeSelectorProps {
  selectedTypes: WorkoutType[];
  onToggleType: (type: WorkoutType) => void;
}

export const WorkoutTypeSelector: React.FC<WorkoutTypeSelectorProps> = ({ selectedTypes, onToggleType }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
      {WORKOUT_OPTIONS.map((type) => (
        <button
          key={type}
          onClick={() => onToggleType(type)}
          aria-pressed={selectedTypes.includes(type)}
          className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-all duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500
            ${
              selectedTypes.includes(type)
                ? 'bg-red-600 border-red-600 text-white shadow-lg'
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
            }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
};
