import React from 'react';
import { useGameState } from '../contexts/GameStateContext';

const CompletionScreen: React.FC = () => {
  const { playerName, elapsedTime } = useGameState();

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="text-5xl text-green-500 mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-6">Congratulations!</h1>

        <p className="text-xl mb-2">
          Well done, <span className="font-semibold">{playerName}</span>!
        </p>
        <p className="text-lg mb-6">
          You've completed the TypeScript challenge.
        </p>

        <div className="bg-gray-100 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">Your completion time:</p>
          <p className="text-4xl font-bold text-blue-600">{formatTime(elapsedTime)}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-200"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;