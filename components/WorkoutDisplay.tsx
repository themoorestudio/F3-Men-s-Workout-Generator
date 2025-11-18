import React, { useState } from 'react';
import { formatWorkoutForExport } from '../utils/formatWorkout';
import { parseTime } from '../utils/parseTime';
import { ExportIcon } from './icons/ExportIcon';
import { CheckIcon } from './icons/CheckIcon';
import { TimerIcon } from './icons/TimerIcon';
import { Timer } from './Timer';

interface WorkoutDisplayProps {
  workout: string;
}

export const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [timerConfig, setTimerConfig] = useState<{ duration: number; title: string } | null>(null);

  if (!workout) {
    return null;
  }

  const handleExport = () => {
    const formattedText = formatWorkoutForExport(workout);
    navigator.clipboard.writeText(formattedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const renderWorkoutContent = () => {
    const lines = workout.split('\n');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      // Main Heading: **Title**
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl md:text-2xl font-bold text-red-500 uppercase tracking-wider mt-6 first:mt-0 mb-3 border-b-2 border-gray-700 pb-2">
            {trimmedLine.slice(2, -2)}
          </h3>
        );
      }

      // Sub-heading: ### Title
      if (trimmedLine.startsWith('###')) {
        return (
          <h4 key={index} className="text-lg md:text-xl font-bold text-red-400 mt-4 mb-2">
            {trimmedLine.replace(/###/g, '').trim()}
          </h4>
        );
      }
      
      // List item: *, -, or ➤
      const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ') || trimmedLine.startsWith('➤');
      if (isListItem) {
        let content = trimmedLine.replace(/^(\* |- |➤) ?/, '');
        const duration = parseTime(content);

        const parts = content.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        const renderedContent = parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        return (
          <div key={index} className="flex items-start justify-between group py-1">
            <p className="leading-relaxed text-gray-300 flex-grow">
              <span className="text-red-500 mr-2">&#10148;</span>
              {renderedContent}
            </p>
            {duration && (
              <button 
                onClick={() => setTimerConfig({ duration, title: content.replace(/\*\*.*\*\*/g, '') })}
                className="ml-4 p-1.5 rounded-full bg-gray-700/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 flex-shrink-0"
                aria-label={`Start ${duration} second timer for ${content}`}
              >
                <TimerIcon className="h-5 w-5 text-red-400" />
              </button>
            )}
          </div>
        );
      }

      // Plain paragraph
      if(trimmedLine) {
        return <p key={index} className="leading-relaxed text-gray-300 my-2">{trimmedLine}</p>;
      }

      return null;
    }).filter(Boolean);
  };


  return (
    <>
      <div className="animate-fade-in-up bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl p-6 md:p-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExport}
            className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out border
              ${isCopied 
                ? 'bg-green-600/20 border-green-500 text-green-400'
                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            {isCopied ? (
              <>
                <CheckIcon className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <ExportIcon className="mr-2 h-4 w-4" />
                Export for Slack
              </>
            )}
          </button>
        </div>

        <div>
          {renderWorkoutContent()}
        </div>
      </div>
      
      {timerConfig && (
        <Timer
          isOpen={!!timerConfig}
          duration={timerConfig.duration}
          title={timerConfig.title}
          onClose={() => setTimerConfig(null)}
        />
      )}
    </>
  );
};