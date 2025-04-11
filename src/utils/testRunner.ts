import { assert } from 'chai';

export interface TestResult {
  name: string;
  status: 'pass' | 'fail';
  error?: string;
}

/**
 * Runs test cases against the provided code
 * @param transpiledCode The JavaScript code to test
 * @returns An array of test results
 */
export async function runCodeTests(transpiledCode: string): Promise<TestResult[]> {
  return new Promise((resolve) => {
    try {
      // Create a test environment
      const testEnv = {
        describe: window.describe,
        it: window.it,
        assert: assert,
        code: transpiledCode
      };

      // Create test script to evaluate
      const testScript = `
        ${transpiledCode}

        describe('Code Tests', function() {
          it('should properly greet a person', function() {
            const result = greet('Tester');
            assert.equal(result, 'Hello, Tester!');
          });

          it('should handle empty strings', function() {
            const result = greet('');
            assert.equal(result, 'Hello, !');
          });
        });
      `;

      // Clear previous test results
      const mocha = new Mocha({
        reporter: 'html',
        ui: 'bdd'
      });

      mocha.suite.emit('pre-require', testEnv, null, mocha);
      const testResults: TestResult[] = [];

      try {
        // Evaluate test script in context
        new Function('describe', 'it', 'assert', 'code', testScript)(
          testEnv.describe,
          testEnv.it,
          testEnv.assert,
          testEnv.code
        );

        // Run tests and collect results
        const runner = mocha.run();

        runner.on('pass', test => {
          testResults.push({ name: test.title, status: 'pass' });
        });

        runner.on('fail', (test, err) => {
          testResults.push({ name: test.title, status: 'fail', error: err.message });
        });

        runner.on('end', () => {
          resolve(testResults);
        });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        resolve([{ name: 'Code Execution Error', status: 'fail', error: errorMessage }]);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error running tests:', errorMessage);
      resolve([{ name: 'Test Runner Error', status: 'fail', error: errorMessage }]);
    }
  });
}