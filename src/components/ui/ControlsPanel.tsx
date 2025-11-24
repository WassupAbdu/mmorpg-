import { useState } from 'react';

export default function ControlsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton pour ouvrir/fermer le panneau */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        <span className="text-xl">🎮</span>
        <span>Contrôles</span>
      </button>

      {/* Panneau des contrôles */}
      {isOpen && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 bg-opacity-95 text-white p-6 rounded-lg shadow-2xl w-96 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              🎮 Guide des Contrôles
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Déplacement */}
            <section>
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                🚶 Déplacement
              </h3>
              <div className="space-y-2 bg-gray-800 p-3 rounded">
                <ControlRow keys={['Z', 'Q', 'S', 'D']} description="Se déplacer (avant/gauche/arrière/droite)" />
                <ControlRow keys={['↑', '←', '↓', '→']} description="Alternative: Flèches directionnelles" />
                <ControlRow keys={['Shift']} description="Maintenir pour courir" />
                <ControlRow keys={['Espace']} description="Sauter" />
              </div>
            </section>

            {/* Caméra */}
            <section>
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center gap-2">
                📷 Caméra
              </h3>
              <div className="space-y-2 bg-gray-800 p-3 rounded">
                <ControlRow keys={['Clic droit']} description="Maintenir + Souris pour faire pivoter" />
                <ControlRow keys={['Molette']} description="Zoomer / Dézoomer" />
              </div>
            </section>

            {/* Combat */}
            <section>
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                ⚔️ Combat
              </h3>
              <div className="space-y-2 bg-gray-800 p-3 rounded">
                <ControlRow keys={['Clic gauche']} description="Attaque basique" />
                <ControlRow keys={['1', '2', '3', '4', '5']} description="Lancer les sorts 1 à 5" />
                <ControlRow keys={['6', '7', '8', '9', '0']} description="Lancer les sorts 6 à 10" />
                <ControlRow keys={['Tab']} description="Cibler l'ennemi le plus proche" />
                <ControlRow keys={['R']} description="Ranger/Sortir l'arme (combat aux poings)" />
              </div>
            </section>

            {/* Interface */}
            <section>
              <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
                📋 Interface
              </h3>
              <div className="space-y-2 bg-gray-800 p-3 rounded">
                <ControlRow keys={['I']} description="Ouvrir l'inventaire" />
                <ControlRow keys={['C']} description="Ouvrir la feuille de personnage" />
                <ControlRow keys={['M']} description="Ouvrir la carte du monde" />
                <ControlRow keys={['L']} description="Ouvrir le livre de sorts" />
                <ControlRow keys={['ESC']} description="Menu / Pause" />
                <ControlRow keys={['Entrée']} description="Terminer le tour (mode tour par tour)" />
              </div>
            </section>

            {/* Social */}
            <section>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                👥 Social
              </h3>
              <div className="space-y-2 bg-gray-800 p-3 rounded">
                <ControlRow keys={['G']} description="Ouvrir le panneau de guilde" />
                <ControlRow keys={['P']} description="Ouvrir le panneau de groupe" />
                <ControlRow keys={['F']} description="Ouvrir la liste d'amis" />
                <ControlRow keys={['T']} description="Ouvrir le chat" />
              </div>
            </section>

            {/* Divers */}
            <section>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                🔧 Divers
              </h3>
              <div className="space-y-2 bg-gray-800 p-3 rounded">
                <ControlRow keys={['H']} description="Afficher/Masquer l'interface" />
                <ControlRow keys={['F11']} description="Plein écran" />
                <ControlRow keys={['F12']} description="Capture d'écran" />
              </div>
            </section>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
            <p className="text-sm text-gray-300 text-center">
              💡 Astuce: Survolez les ennemis pour voir leurs statistiques
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Composant pour afficher une ligne de contrôle
function ControlRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-2 py-1 bg-gray-700 text-white rounded text-xs font-mono border border-gray-600 shadow-sm min-w-[2rem] text-center"
          >
            {key}
          </kbd>
        ))}
      </div>
      <span className="text-sm text-gray-300">{description}</span>
    </div>
  );
}
