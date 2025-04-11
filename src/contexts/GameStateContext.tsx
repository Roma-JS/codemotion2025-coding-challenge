import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TestResult } from '../utils/testRunner';
import { saveUserData } from '../utils/db';

interface UserData {
  name: string;
  email: string;
  phone: string;
  dataSharingConsent: boolean;
  completionTime?: number;
  completionDate?: string;
}

interface GameStateContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  playerEmail: string;
  setPlayerEmail: (email: string) => void;
  playerPhone: string;
  setPlayerPhone: (phone: string) => void;
  dataSharingConsent: boolean;
  setDataSharingConsent: (consent: boolean) => void;
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
  const [playerEmail, setPlayerEmail] = useState<string>('');
  const [playerPhone, setPlayerPhone] = useState<string>('');
  const [dataSharingConsent, setDataSharingConsent] = useState<boolean>(false);
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

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedTime(0);
    setTestResults([]);
    setAllTestsPassing(false);
  };

  const endGame = useCallback(async () => {
    setGameState('completed');
    // Save user data to IndexedDB
    const userData: UserData = {
      name: playerName,
      email: playerEmail,
      phone: playerPhone,
      dataSharingConsent,
      completionTime: elapsedTime,
      completionDate: new Date().toISOString()
    };

    try {
      await saveUserData(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }, [playerName, playerEmail, playerPhone, dataSharingConsent, elapsedTime]);


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
  }, [testResults, gameState, endGame]);

  return (
    <GameStateContext.Provider
      value={{
        playerName,
        setPlayerName,
        playerEmail,
        setPlayerEmail,
        playerPhone,
        setPlayerPhone,
        dataSharingConsent,
        setDataSharingConsent,
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