import { useState } from 'react';
import { LoginRegister } from './components/auth/LoginRegister';
import { ClassSelection } from './components/character/ClassSelection';
import { Game } from './components/Game';
import { useAuthStore } from './stores/authStore';
import { useCharacterStore } from './stores/characterStore';

type GameState = 'auth' | 'class-selection' | 'game';

function App() {
  const [gameState, setGameState] = useState<GameState>('auth');
  const { isAuthenticated, login } = useAuthStore();
  const { playerCharacter } = useCharacterStore();

  // Mode test rapide : démarrer directement avec sélection de classe
  const quickStart = () => {
    login('test@test.com', 'test123');
    setGameState('class-selection');
  };

  // Déterminer quel écran afficher
  if (!isAuthenticated && gameState === 'auth') {
    return (
      <div className="relative">
        <LoginRegister />
        {/* Bouton de test rapide */}
        <button
          onClick={quickStart}
          className="absolute top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg font-bold text-sm"
        >
          🚀 Démarrage Rapide (Test)
        </button>
      </div>
    );
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
