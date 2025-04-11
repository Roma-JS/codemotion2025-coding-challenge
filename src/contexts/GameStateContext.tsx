import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TestResult } from '../utils/testRunner';

interface GameStateContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  gameState: 'initial' | 'playing' | 'completed';
  startGame: () => void;
  endGame: () => void;
  elapsedTime: number;
  testResults: TestResult[];
  setTestResults: (results: TestResult[]) => void;
  allTestsPassing: boolean;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [gameState, setGameState] = useState<'initial' | 'playing' | 'completed'>('initial');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [allTestsPassing, setAllTestsPassing] = useState<boolean>(false);

  // Timer effect
  useEffect(() => {
    let timerInterval: number | null = null;

    if (gameState === 'playing' && startTime !== null) {
      timerInterval = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (timerInterval) window.clearInterval(timerInterval);
    };
  }, [gameState, startTime]);

  // Check if all tests are passing
  useEffect(() => {
    if (testResults.length > 0 && testResults.every(test => test.status === 'pass')) {
      setAllTestsPassing(true);
      if (gameState === 'playing') {
        endGame();
      }
    } else {
      setAllTestsPassing(false);
    }
  }, [testResults, gameState]);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedTime(0);
    setTestResults([]);
    setAllTestsPassing(false);
  };

  const endGame = () => {
    setGameState('completed');
  };

  return (
    <GameStateContext.Provider
      value={{
        playerName,
        setPlayerName,
        gameState,
        startGame,
        endGame,
        elapsedTime,
        testResults,
        setTestResults,
        allTestsPassing
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};