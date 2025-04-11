import { GameStateProvider } from './contexts/GameStateContext';
import GameContainer from './components/GameContainer';

function App() {
  return (
    <div className="container mx-auto p-4">
      <GameStateProvider>
        <GameContainer />
      </GameStateProvider>
    </div>
  )
}

export default App
