import { useState } from 'react';
import { LoginRegister } from './components/auth/LoginRegister';
import { ClassSelection } from './components/character/ClassSelection';
import { Game } from './components/Game';
import { useAuthStore } from './stores/authStore';
import { useCharacterStore } from './stores/characterStore';

type GameState = 'auth' | 'class-selection' | 'game';

function App() {
  const [gameState, setGameState] = useState<GameState>('auth');
  const { isAuthenticated } = useAuthStore();
  const { playerCharacter } = useCharacterStore();

  // Déterminer quel écran afficher
  if (!isAuthenticated && gameState === 'auth') {
    return <LoginRegister />;
  }

  if (isAuthenticated && !playerCharacter && gameState !== 'game') {
    return <ClassSelection onComplete={() => setGameState('game')} />;
  }

  if (playerCharacter) {
    return <Game />;
  }

  // Par défaut, afficher l'authentification
  return <LoginRegister />;
}

export default App;
