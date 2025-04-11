import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
// import Mocha from 'mocha';
// import {assert} from 'chai';
import { transpileTypeScript } from '../utils/ts';
import { runCodeTests } from '../utils/testRunner';
import { useGameState } from '../contexts/GameStateContext';

// Mocha.setup('bdd');

// Default TypeScript code to display in the editor
const defaultCode = `// TypeScript code goes here
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const result = greet('Codemotion');
console.log(result);
`;

// No props needed for now, using React.FC without generic parameter
const Challenge: React.FC = () => {
  const { playerName, elapsedTime, testResults, setTestResults } = useGameState();
  const [code, setCode] = useState<string>(defaultCode);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle code changes in the editor
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  // Function to run tests with the current code
  const runTests = async () => {
    const transpiledCode = transpileTypeScript(code);

    try {
      const results = await runCodeTests(transpiledCode);
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header with player info and timer */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center">
        <div>
          <span className="font-semibold">Player: </span>{playerName}
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-0">TypeScript Challenge</h1>
        </div>
        <div>
          <span className="font-semibold">Time: </span>
          <span className="text-blue-600 font-mono">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-row h-[calc(100vh-150px)]">
        {/* First column - Monaco Editor */}
        <div className="w-1/2 p-4">
          <div className="h-full bg-gray-100 rounded-lg p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-2">TypeScript Editor</h2>
            <div className="flex-grow">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                defaultValue={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  tabSize: 2,
                  automaticLayout: true,
                }}
              />
            </div>
            <div className="mt-4">
              <button
                onClick={runTests}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Run Tests
              </button>
            </div>
          </div>
        </div>

        {/* Second column - split into two rows */}
        <div className="w-1/2 flex flex-col p-4">
          {/* Top row of second column - for output */}
          <div className="h-1/2 mb-4 bg-gray-200 rounded-lg p-4 overflow-auto">
            <h2 className="text-xl font-bold mb-2">Code Output</h2>
            <div className="font-mono whitespace-pre-wrap">
              {/* You can add code output here */}
            </div>
          </div>

          {/* Bottom row of second column - for test results */}
          <div className="h-1/2 bg-gray-300 rounded-lg p-4 overflow-auto">
            <h2 className="text-xl font-bold mb-2">Test Results</h2>
            {testResults.length === 0 ? (
              <p>No tests run yet. Click "Run Tests" to start testing.</p>
            ) : (
              <div>
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