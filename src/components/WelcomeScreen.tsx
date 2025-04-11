import React, { useState } from 'react';
import { useGameState } from '../contexts/GameStateContext';

import romajs from '../assets/romajs.png';
import codemotion from '../assets/codemotion.png';

const WelcomeScreen: React.FC = () => {
  const {
    playerName,
    setPlayerName,
    playerEmail,
    setPlayerEmail,
    playerPhone,
    setPlayerPhone,
    dataSharingConsent,
    setDataSharingConsent,
    startGame
  } = useGameState();

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    if (!playerName.trim()) {
      setNameError('Please enter your name');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!playerEmail.trim()) {
      setEmailError('Please enter your email');
      hasError = true;
    } else if (!validateEmail(playerEmail)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!playerPhone.trim()) {
      setPhoneError('Please enter your phone number');
      hasError = true;
    } else if (!validatePhone(playerPhone)) {
      setPhoneError('Please enter a valid phone number');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!hasError) {
      startGame();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6">The Coding Challenge</h1>

        <p className="mb-6">
          Welcome to the coding challenge powered by RomaJS. This challenge is designed to test your skills in JavaScript, solving a problem in a given time. You have 10 minutes to complete the challenge.<br />
          If you are confident in your skills, ask for the EXTREME mode! You will get a bonus on the final score.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Enter your name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              required
              autoComplete="off"
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

          <div className="mb-6">
            <label htmlFor="playerEmail" className="block text-sm font-medium mb-2">
              Enter your email
            </label>
            <input
              type="email"
              id="playerEmail"
              value={playerEmail}
              required
              autoComplete="off"
              onChange={(e) => {
                setPlayerEmail(e.target.value);
                if (e.target.value.trim()) {
                  setEmailError('');
                }
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="playerPhone" className="block text-sm font-medium mb-2">
              Enter your phone number
            </label>
            <input
              type="tel"
              id="playerPhone"
              value={playerPhone}
              required
              autoComplete="off"
              onChange={(e) => {
                setPlayerPhone(e.target.value);
                if (e.target.value.trim()) {
                  setPhoneError('');
                }
              }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
            />
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={dataSharingConsent}
                onChange={(e) => setDataSharingConsent(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Acconsento che Codemotion condivida i mei dati personali con gli sponsor in conferenza che utilizzano le medesime tecnologie al fine di ricevere notizie su prossimi eventi e offerte di lavoro.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition duration-200"
          >
            Start Challenge
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 flex flex-row items-center justify-center gap-2">
          <img src={romajs} alt="romajs" className="h-14" />
          <img src={codemotion} alt="codemotion" className="h-14" />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;