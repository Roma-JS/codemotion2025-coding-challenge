import { GameStateProvider } from './contexts/GameStateContext';
import GameContainer from './components/GameContainer';

function App() {
  return (
    <GameStateProvider>
      <GameContainer />
    </GameStateProvider>
  )
}

export default App
