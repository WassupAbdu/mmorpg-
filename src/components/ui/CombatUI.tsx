import { useGameStore } from '../../stores/gameStore';
import { useCharacterStore } from '../../stores/characterStore';
import { useCombatStore } from '../../stores/combatStore';
import { SPELLS_BY_CLASS } from '../../data/spells';

export const CombatUI = () => {
  const { combatLog, currentTurn, isInCombat, turnOrder, currentTurnIndex, nextTurn } = useGameStore();
  const { characters, playerCharacter } = useCharacterStore();
  const { selectedSpell, selectSpell } = useCombatStore();

  if (!isInCombat || !playerCharacter) return null;

  const currentCharacterId = turnOrder[currentTurnIndex];
  const currentCharacter = characters.find((c) => c.id === currentCharacterId);
  const isPlayerTurn = currentCharacter?.isPlayerControlled;

  const playerSpells = SPELLS_BY_CLASS[playerCharacter.class];

  return (
    <div className="fixed inset-0 pointer-events-none">
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* HUD en haut */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className={`bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border-2 shadow-2xl ${
          isPlayerTurn 
            ? 'border-green-500/70 shadow-green-500/30' 
            : 'border-purple-500/30'
        }`}>
          <div className="flex items-center gap-6">
            {/* Tour actuel */}
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Tour</div>
              <div className="text-2xl font-bold text-white">{currentTurn}</div>
            </div>

            {/* Personnage actuel */}
            <div className="border-l border-slate-700 pl-6">
              <div className="text-gray-400 text-xs mb-1">Tour de</div>
              <div className={`text-xl font-bold flex items-center gap-2 ${
                isPlayerTurn ? 'text-green-400' : 'text-white'
              }`}>
                {isPlayerTurn && <span className="animate-pulse">👤</span>}
                {currentCharacter?.name}
                {isPlayerTurn && <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">VOUS</span>}
              </div>
            </div>

            {/* Stats du joueur */}
            <div className="border-l border-slate-700 pl-6">
              <div className="flex gap-4">
                {/* HP */}
                <div>
                  <div className="text-gray-400 text-xs mb-1">HP</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all"
                        style={{ width: `${(playerCharacter.hp / playerCharacter.maxHp) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {playerCharacter.hp}/{playerCharacter.maxHp}
                    </span>
                  </div>
                </div>

                {/* Mana */}
                <div>
                  <div className="text-gray-400 text-xs mb-1">Mana</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all"
                        style={{ width: `${(playerCharacter.mana / playerCharacter.maxMana) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-white">
                      {playerCharacter.mana}/{playerCharacter.maxMana}
                    </span>
                  </div>
                </div>

                {/* PA */}
                <div>
                  <div className="text-gray-400 text-xs mb-1">PA</div>
                  <div className="text-xl font-bold text-yellow-400">
                    {playerCharacter.pa}/{playerCharacter.maxPa}
                  </div>
                </div>

                {/* PM */}
                <div>
                  <div className="text-gray-400 text-xs mb-1">PM</div>
                  <div className="text-xl font-bold text-green-400">
                    {playerCharacter.pm}/{playerCharacter.maxPm}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sorts disponibles - Bas de l'écran */}
      {isInCombat && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto max-w-screen-lg">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl p-5 border-2 border-purple-500/50 shadow-2xl">
            {/* En-tête de la barre de sorts */}
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-white mb-1">⚔️ Sorts Disponibles</h3>
              <p className="text-xs text-gray-400">
                {!isPlayerTurn 
                  ? `⏳ En attente du tour de ${currentCharacter?.name}...`
                  : selectedSpell 
                  ? `✨ ${selectedSpell.name} sélectionné - Cliquez sur une cible` 
                  : 'Sélectionnez un sort puis cliquez sur une cible'}
              </p>
            </div>

            {/* Grille de sorts */}
            <div className="flex gap-2 mb-4 justify-center flex-wrap max-w-4xl">
              {playerSpells.map((spell, index) => {
                const canAfford = playerCharacter.pa >= spell.pa;
                const isSelected = selectedSpell?.id === spell.id;

                return (
                  <div key={spell.id} className="relative">
                    <button
                      onClick={() => selectSpell(isSelected ? null : spell)}
                      disabled={!canAfford || !isPlayerTurn}
                      className={`relative group ${
                        !isPlayerTurn
                          ? 'opacity-30 cursor-not-allowed grayscale'
                          : isSelected
                          ? 'ring-4 ring-purple-500 scale-110 shadow-lg shadow-purple-500/50'
                          : canAfford
                          ? 'hover:scale-105 hover:shadow-lg'
                          : 'opacity-40 cursor-not-allowed grayscale'
                      } transition-all duration-200`}
                    >
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl relative"
                        style={{
                          backgroundColor: `${getElementColor(spell.element)}60`,
                          border: `3px solid ${getElementColor(spell.element)}`,
                          boxShadow: isSelected ? `0 0 20px ${getElementColor(spell.element)}80` : 'none',
                        }}
                      >
                        {getElementEmoji(spell.element)}
                      </div>
                      
                      {/* Numéro de raccourci */}
                      <div className="absolute -top-2 -left-2 bg-slate-800 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-slate-600">
                        {index + 1}
                      </div>

                      {/* PA Cost */}
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-yellow-600">
                        {spell.pa}
                      </div>

                      {/* Nom du sort en dessous */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className="text-xs font-semibold text-white bg-slate-800/90 px-2 py-1 rounded">
                          {spell.name}
                        </span>
                      </div>

                      {/* Tooltip détaillé */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <div className="bg-slate-800 rounded-lg p-4 shadow-2xl border-2 border-purple-500/50 whitespace-nowrap">
                          <div className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                            {getElementEmoji(spell.element)} {spell.name}
                          </div>
                          <div className="text-sm text-gray-400 mb-3 max-w-xs whitespace-normal">
                            {spell.description}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-slate-700/50 p-2 rounded">
                              <div className="text-gray-400 text-xs">Dégâts</div>
                              <div className="text-red-400 font-bold">{spell.damageMin}-{spell.damageMax}</div>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded">
                              <div className="text-gray-400 text-xs">Portée</div>
                              <div className="text-blue-400 font-bold">{spell.rangeMin}-{spell.rangeMax}</div>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded">
                              <div className="text-gray-400 text-xs">Coût PA</div>
                              <div className="text-yellow-400 font-bold">{spell.pa} PA</div>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded">
                              <div className="text-gray-400 text-xs">Critique</div>
                              <div className="text-purple-400 font-bold">{(spell.critChance * 100).toFixed(1)}%</div>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-600">
                            <div className="text-xs text-gray-400">
                              Élément: <span style={{ color: getElementColor(spell.element) }} className="font-bold">{spell.element}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              {selectedSpell && (
                <button
                  onClick={() => selectSpell(null)}
                  className="flex-1 py-2 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-all"
                >
                  ❌ Annuler
                </button>
              )}
              <button
                onClick={nextTurn}
                disabled={!isPlayerTurn}
                className={`flex-1 py-3 font-bold rounded-lg transition-all shadow-lg ${
                  isPlayerTurn
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                ⏭️ Terminer le Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal de combat - Droite */}
      <div className="absolute right-4 top-20 bottom-4 w-80 pointer-events-auto">
        <div className="bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 border-2 border-purple-500/40 shadow-2xl h-full flex flex-col">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            📜 Journal de Combat
            <span className="text-xs text-gray-400 font-normal">({combatLog.length})</span>
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800">
            {combatLog.slice().reverse().map((entry, index) => (
              <div
                key={entry.id}
                style={{ 
                  animation: index === 0 ? 'slideInRight 0.3s ease-out' : 'none'
                }}
                className={`p-3 rounded-lg text-sm shadow-md ${
                  entry.type === 'critical'
                    ? 'bg-yellow-500/30 text-yellow-200 font-bold border-l-4 border-yellow-400'
                    : entry.type === 'damage'
                    ? 'bg-red-500/30 text-red-200 border-l-4 border-red-400'
                    : entry.type === 'heal'
                    ? 'bg-green-500/30 text-green-200 border-l-4 border-green-400'
                    : entry.type === 'death'
                    ? 'bg-purple-500/30 text-purple-200 font-bold border-l-4 border-purple-400'
                    : entry.type === 'turn'
                    ? 'bg-blue-500/30 text-blue-200 font-semibold border-l-4 border-blue-400'
                    : 'bg-slate-700/70 text-gray-200 border-l-4 border-slate-500'
                }`}
              >
                {entry.message}
              </div>
            ))}
            {combatLog.length === 0 && (
              <div className="text-center text-gray-500 italic py-8">
                Le combat va commencer...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getElementColor = (element: string): string => {
  const colors: Record<string, string> = {
    EARTH: '#92400e',
    FIRE: '#dc2626',
    AIR: '#3b82f6',
    WATER: '#0ea5e9',
    LIGHT: '#fbbf24',
    SHADOW: '#6b7280',
    POISON: '#22c55e',
    DARKNESS: '#1f2937',
    ARCANE: '#a855f7',
    ICE: '#06b6d4',
    ELECTRIC: '#eab308',
    STEALTH: '#374151',
  };
  return colors[element] || '#6b7280';
};

const getElementEmoji = (element: string): string => {
  const emojis: Record<string, string> = {
    EARTH: '🪨',
    FIRE: '🔥',
    AIR: '💨',
    WATER: '💧',
    LIGHT: '✨',
    SHADOW: '🌑',
    POISON: '☠️',
    DARKNESS: '🌚',
    ARCANE: '🔮',
    ICE: '❄️',
    ELECTRIC: '⚡',
    STEALTH: '👁️',
  };
  return emojis[element] || '⚔️';
};
