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
      {/* HUD en haut */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 shadow-2xl">
          <div className="flex items-center gap-6">
            {/* Tour actuel */}
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">Tour</div>
              <div className="text-2xl font-bold text-white">{currentTurn}</div>
            </div>

            {/* Personnage actuel */}
            <div className="border-l border-slate-700 pl-6">
              <div className="text-gray-400 text-xs mb-1">Tour de</div>
              <div className="text-xl font-bold text-white">{currentCharacter?.name}</div>
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
      {isPlayerTurn && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 shadow-2xl">
            <div className="flex gap-3 mb-4">
              {playerSpells.slice(0, 10).map((spell) => {
                const canAfford = playerCharacter.pa >= spell.pa;
                const isSelected = selectedSpell?.id === spell.id;

                return (
                  <button
                    key={spell.id}
                    onClick={() => selectSpell(isSelected ? null : spell)}
                    disabled={!canAfford}
                    className={`relative group ${
                      isSelected
                        ? 'ring-2 ring-purple-500 scale-105'
                        : canAfford
                        ? 'hover:scale-105'
                        : 'opacity-50'
                    } transition-all`}
                  >
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl"
                      style={{
                        backgroundColor: `${getElementColor(spell.element)}40`,
                        border: `2px solid ${getElementColor(spell.element)}`,
                      }}
                    >
                      {getElementEmoji(spell.element)}
                    </div>
                    
                    {/* PA Cost */}
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {spell.pa}
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-slate-800 rounded-lg p-3 shadow-xl border border-slate-600 whitespace-nowrap">
                        <div className="font-bold text-white mb-1">{spell.name}</div>
                        <div className="text-xs text-gray-400 mb-2">{spell.description}</div>
                        <div className="text-xs text-gray-300">
                          <div>Dégâts: {spell.damageMin}-{spell.damageMax}</div>
                          <div>Portée: {spell.rangeMin}-{spell.rangeMax}</div>
                          <div>Critique: {(spell.critChance * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={nextTurn}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Terminer le Tour
            </button>
          </div>
        </div>
      )}

      {/* Journal de combat - Droite */}
      <div className="absolute right-4 top-20 bottom-4 w-80 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 shadow-2xl h-full flex flex-col">
          <h3 className="text-lg font-bold text-white mb-3">📜 Journal de Combat</h3>
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-800">
            {combatLog.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className={`p-2 rounded text-sm ${
                  entry.type === 'critical'
                    ? 'bg-yellow-500/20 text-yellow-300 font-bold'
                    : entry.type === 'damage'
                    ? 'bg-red-500/20 text-red-300'
                    : entry.type === 'heal'
                    ? 'bg-green-500/20 text-green-300'
                    : entry.type === 'death'
                    ? 'bg-purple-500/20 text-purple-300 font-bold'
                    : entry.type === 'turn'
                    ? 'bg-blue-500/20 text-blue-300 font-semibold'
                    : 'bg-slate-700/50 text-gray-300'
                }`}
              >
                {entry.message}
              </div>
            ))}
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
