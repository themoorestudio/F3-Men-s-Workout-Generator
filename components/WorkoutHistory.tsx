import React from 'react';
import { HistoricalWorkout } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';

interface WorkoutHistoryProps {
  history: HistoricalWorkout[];
  onView: (workout: string) => void;
  onClear: () => void;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ history, onView, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 p-10 border-2 border-dashed border-gray-700 rounded-lg mt-8">
        <h2 className="text-xl font-semibold">Workout History</h2>
        <p>Your past workouts will be saved here.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-300 flex items-center">
          <HistoryIcon className="mr-3 text-red-500" />
          Workout History
        </h2>
        <button
          onClick={onClear}
          className="flex items-center text-sm text-gray-400 hover:text-red-400 transition-colors"
          aria-label="Clear workout history"
        >
          <TrashIcon className="mr-1 h-4 w-4" />
          Clear History
        </button>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-4 space-y-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onView(item.workout)}
            className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <p className="font-semibold text-gray-200">
              {new Date(item.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-xs text-gray-400">{item.types.join(', ')}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
