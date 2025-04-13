import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { transpileTypeScript } from '../utils/ts';
import { runCodeTests } from '../utils/testRunner';
import { useGameState } from '../contexts/GameStateContext';
import romajs from '../assets/romajs.png';
import codemotion from '../assets/codemotion.png';
import { defaultCode, tests } from '../utils/challenge';


// No props needed for now, using React.FC without generic parameter
const Challenge: React.FC = () => {
  const {
    elapsedTime,
    testResults,
    setTestResults,
    gameState
  } = useGameState();
  const [code, setCode] = useState<string>(defaultCode);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle code changes in the editor
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (gameState === 'playing' && value !== undefined) {
      setCode(value);
    }
  }, [gameState]);

  // Function to run tests with the current code
  const runTests = useCallback(async () => {
    const transpiledCode = transpileTypeScript(code);

    try {
      const results = await runCodeTests(transpiledCode, tests);
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
    }
  }, [code, setTestResults]);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.altKey) && event.key === 'Enter') {
        event.preventDefault();
        runTests();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [runTests]); // Re-run effect when code changes


  return (
    <div className="w-full flex flex-col h-screen p-4">
      {/* Header with player info and timer */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center">
        <div className="flex flex-row items-center justify-center gap-2">
          <img src={romajs} alt="romajs" className="h-14" />
          <img src={codemotion} alt="codemotion" className="h-14" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-0">The Coding Challenge</h1>
        </div>
        <div>
          <span className="font-semibold">Time: </span>
          <span className={`font-mono ${gameState === 'gameover' ? 'text-red-600' : 'text-blue-600'}`}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-row flex-1">
        {/* First column - Monaco Editor */}
        <div className="w-2/3 h-[calc(100vh-140px)]">
          <div className="h-full bg-gray-100 rounded-lg p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">The code</h2>
            <div className="flex-grow">
              <Editor
                defaultLanguage="typescript"
                defaultValue={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 16,
                  tabSize: 2,
                  automaticLayout: true,
                  contextmenu: false,
                  readOnly: gameState !== 'playing'
                }}
                onMount={(editor, monaco) => {
                  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function() {
                    // Trigger a keyboard event on window with meta + enter key
                    const event = new KeyboardEvent('keydown', {
                      key: 'Enter',
                      code: 'Enter',
                      metaKey: true,
                      bubbles: true,
                      cancelable: true
                    });
                    window.dispatchEvent(event);
                  });
                }}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={runTests}
                className={`bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700`}
              >
                Run Tests (Ctrl+Enter)
              </button>
            </div>
          </div>
        </div>

        {/* Second column - split into two rows */}
        <div className="w-1/3 flex flex-col pl-4">
          {/* Top row of second column - for output */}
          <div className="flex-1 mb-4 bg-gray-200 rounded-lg p-4 overflow-auto">
            <h2 className="text-xl font-bold mb-2">The Challenge</h2>
            <p>Write a function that takes a Roman numeral and returns a decimal number, i.e.<br />
              <span className="font-mono">convertRomanToDecimal('IV') returns 4</span><br />
              <span className="font-mono">convertRomanToDecimal('XI') returns 11</span>
            </p>
          </div>

          {/* Bottom row of second column - for test results */}
          <div className="flex-1 bg-gray-300 rounded-lg p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">
              Test Results
              {testResults.length > 0 && (
                <span className="ml-2 text-base font-normal">
                  ({testResults.filter(test => test.status === 'pass').length}/{testResults.length})
                </span>
              )}
            </h2>
            {testResults.length === 0 ? (
              <p>No tests run yet. Click "Run Tests" to start testing.</p>
            ) : (
              <div className='flex-1 overflow-y-scroll'>
                {testResults.map((test, index) => (
                  <div
                    key={index}
                    className={`mb-2 p-2 rounded ${test.status === 'pass' ? 'bg-green-100' : 'bg-red-100'}`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-4 h-4 mr-2 rounded-full ${test.status === 'pass' ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                      <span className="font-medium">{test.name}</span>
                    </div>
                    {test.error && <div className="mt-1 text-red-600 text-sm ml-6">{test.error}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;