import React, { useState, useCallback, useEffect } from 'react';
import { WorkoutType, HistoricalWorkout } from './types';
import { generateF3Workout } from './services/geminiService';
import { WorkoutTypeSelector } from './components/WorkoutTypeSelector';
import { WorkoutDisplay } from './components/WorkoutDisplay';
import { LoaderIcon } from './components/icons/LoaderIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { WorkoutHistory } from './components/WorkoutHistory';

const HISTORY_KEY = 'f3WorkoutHistory';
const MAX_HISTORY = 10;

const App: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<WorkoutType[]>([]);
  const [generatedWorkout, setGeneratedWorkout] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoricalWorkout[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
      localStorage.removeItem(HISTORY_KEY);
    }
  }, []);

  const handleGenerateWorkout = useCallback(async () => {
    if (selectedTypes.length === 0) {
      setError('Please select at least one workout type.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const workout = await generateF3Workout(selectedTypes);
      setGeneratedWorkout(workout);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const newEntry: HistoricalWorkout = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        types: selectedTypes,
        workout,
      };
      
      setHistory((prevHistory) => {
        const updatedHistory = [newEntry, ...prevHistory].slice(0, MAX_HISTORY);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedTypes]);

  const handleToggleType = (type: WorkoutType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setError(null);
  };
  
  const handleViewHistory = (workout: string) => {
    setGeneratedWorkout(workout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.setItem(HISTORY_KEY, '[]');
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>

      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center my-8 md:my-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tighter text-red-600">
            F3 Workout Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-2xl">
            Select a workout focus, and the Q will generate a beatdown for the Pax. Leave no man behind!
          </p>
        </header>

        <div className="w-full sticky top-0 bg-gray-900/80 backdrop-blur-md py-6 z-10">
          <WorkoutTypeSelector selectedTypes={selectedTypes} onToggleType={handleToggleType} />
          <div className="flex justify-center">
             <button
                onClick={handleGenerateWorkout}
                disabled={isLoading || selectedTypes.length === 0}
                className="flex items-center justify-center w-full max-w-xs px-6 py-3 text-lg font-bold text-white bg-red-600 rounded-full hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 shadow-lg"
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-3" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="mr-3" />
                    Generate Workout
                  </>
                )}
            </button>
          </div>
          {error && <p className="text-center text-red-400 mt-4">{error}</p>}
        </div>

        <div className="w-full mt-8">
          {isLoading && !generatedWorkout && (
            <div className="text-center p-8">
              <div className="flex justify-center items-center mb-4">
                  <LoaderIcon className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-300">The Q is thinking...</h2>
              <p className="text-gray-400">Preparing a proper beatdown. Stand by, Pax!</p>
            </div>
          )}
          {generatedWorkout && <WorkoutDisplay workout={generatedWorkout} />}
          {!isLoading && !generatedWorkout && (
             <div className="text-center text-gray-500 p-10 border-2 border-dashed border-gray-700 rounded-lg mt-8">
                <h2 className="text-xl font-semibold">Ready for the Gloom?</h2>
                <p>Your generated workout will appear here.</p>
              </div>
          )}
        </div>

        <WorkoutHistory 
          history={history}
          onView={handleViewHistory}
          onClear={handleClearHistory}
        />
        
        <footer className="text-center text-gray-600 text-sm mt-12 pb-6">
          <p>&copy; {new Date().getFullYear()} F3 Workout Generator. For informational purposes only.</p>
          <p>F3 concepts and logos are trademarks of F3 Nation.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
