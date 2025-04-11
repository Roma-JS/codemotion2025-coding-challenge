import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';

const WelcomeScreen: React.FC = () => {
  const { playerName, setPlayerName, startGame } = useGameState();
  const [nameError, setNameError] = useState<string>('');

  const handleStartGame = () => {
    if (!playerName.trim()) {
      setNameError('Please enter your name to start');
      return;
    }

    startGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">TypeScript Challenge</h1>

        <div className="mb-6">
          <label htmlFor="playerName" className="block text-sm font-medium mb-2">
            Enter your name
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              if (e.target.value.trim()) {
                setNameError('');
              }
            }}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}
        </div>

        <button
          onClick={handleStartGame}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200"
        >
          Start Challenge
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Complete all the tests to finish the challenge!</p>
          <p className="mt-1">The timer will start when you click the Start button.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;