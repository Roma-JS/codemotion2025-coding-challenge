import React from 'react';
import { useGameState } from '../contexts/GameStateContext';
import Challenge from './Challenge';
import WelcomeScreen from './WelcomeScreen';
import CompletionScreen from './CompletionScreen';

const GameContainer: React.FC = () => {
  const { gameState } = useGameState();

  // Render different screens based on game state
  return (
    <>
      {gameState === 'initial' && <WelcomeScreen />}
      {gameState === 'playing' && <Challenge />}
      {gameState === 'completed' && <CompletionScreen />}
    </>
  );
};

export default GameContainer;