import React from 'react';

interface GameOverPopupProps {
  onClose: () => void;
}

const GameOverPopup: React.FC<GameOverPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="text-5xl text-red-500 mb-4">⏰</div>
        <h1 className="text-3xl font-bold mb-6">Time's Up!</h1>
        <p className="text-lg mb-6">
          The challenge has ended. You can still run tests to check your solution, but you cannot modify the code anymore.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white font-bold py-3 px-6 rounded-md transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default GameOverPopup;