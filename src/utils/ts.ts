import * as ts from "typescript"

// Transpile TypeScript to JavaScript
export function transpileTypeScript(code: string): string {
  try {
    // TypeScript compiler options
    const compilerOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2015,
      module: ts.ModuleKind.CommonJS,
      strict: false,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
    }

    // Transpile the code
    const result = ts.transpileModule(code, {
      compilerOptions,
      reportDiagnostics: true,
    })

    // Check for compilation errors
    if (result.diagnostics && result.diagnostics.length > 0) {
      const errors = result.diagnostics
        .filter((diag) => diag.category === ts.DiagnosticCategory.Error)
        .map((diag) => {
          const message = ts.flattenDiagnosticMessageText(diag.messageText, "\n")
          const position = diag.file?.getLineAndCharacterOfPosition(diag.start!)

          if (position) {
            return `Line ${position.line + 1}, Column ${position.character + 1}: ${message}`
          }

          return message
        })
        .join("\n")

      if (errors) {
        throw new Error(`TypeScript compilation errors:\n${errors}`)
      }
    }

    return result.outputText
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Failed to transpile TypeScript: ${error}`)
  }
}