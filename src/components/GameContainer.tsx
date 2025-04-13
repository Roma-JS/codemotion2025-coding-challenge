import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Challenge from './Challenge';
import WelcomeScreen from './WelcomeScreen';
import CompletionScreen from './CompletionScreen';

const GameContainer: React.FC = () => {
  const { gameState } = useGameState();

  return (
    <>
      {gameState === 'initial' && <WelcomeScreen />}
      {(gameState === 'playing' || gameState === 'completed' || gameState === 'gameover') && (
        <div className="relative">
          <Challenge />
          {(gameState === 'completed' || gameState === 'gameover') && (
            <>
              <CompletionScreen />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default GameContainer;