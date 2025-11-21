import { useState } from 'react';
import { CharacterClass } from '../../types/character.types';
import { CLASSES } from '../../data/classes';
import { useCharacterStore } from '../../stores/characterStore';

interface ClassSelectionProps {
  onComplete: () => void;
}

export const ClassSelection = ({ onComplete }: ClassSelectionProps) => {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [characterName, setCharacterName] = useState('');
  
  const { createPlayerCharacter, setPlayerCharacter } = useCharacterStore();

  const handleCreateCharacter = () => {
    if (!selectedClass || !characterName) return;
    
    const character = createPlayerCharacter(characterName, selectedClass);
    setPlayerCharacter(character);
    onComplete();
  };

  const generateRandomName = () => {
    const prefixes = ['Shadow', 'Dark', 'Iron', 'Swift', 'Noble', 'Mighty', 'Brave', 'Eternal'];
    const suffixes = ['blade', 'heart', 'fist', 'soul', 'wing', 'storm', 'flame', 'frost'];
    const name = prefixes[Math.floor(Math.random() * prefixes.length)] +
                 suffixes[Math.floor(Math.random() * suffixes.length)];
    setCharacterName(name);
  };

  const classData = selectedClass ? CLASSES[selectedClass] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12">
          Choisissez Votre Classe
        </h1>

        {/* Grille de classes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.values(CharacterClass).map((classType) => {
            const classInfo = CLASSES[classType];
            const isSelected = selectedClass === classType;

            return (
              <button
                key={classType}
                onClick={() => setSelectedClass(classType)}
                className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                  isSelected
                    ? 'ring-4 ring-purple-500 shadow-2xl shadow-purple-500/50'
                    : 'hover:ring-2 hover:ring-purple-400'
                }`}
                style={{
                  backgroundColor: `${classInfo.color}20`,
                  borderColor: classInfo.color,
                  borderWidth: '2px',
                }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                  style={{ backgroundColor: classInfo.color }}
                >
                  {classType === CharacterClass.WARRIOR && '⚔️'}
                  {classType === CharacterClass.PALADIN && '🛡️'}
                  {classType === CharacterClass.ARCHER && '🏹'}
                  {classType === CharacterClass.SORCERER && '🔮'}
                  {classType === CharacterClass.CLERIC && '✨'}
                  {classType === CharacterClass.THIEF && '🗡️'}
                  {classType === CharacterClass.ASSASSIN && '⚡'}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{classInfo.name}</h3>
                <p className="text-sm text-gray-300 mb-2">{classInfo.description}</p>
                <div className="text-xs text-gray-400">
                  <p>Évolution: {classInfo.evolution}</p>
                  <p className="text-yellow-400 mt-1">{classInfo.bonus}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Détails de la classe sélectionnée */}
        {classData && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-4" style={{ color: classData.color }}>
                  {classData.name}
                </h2>
                <p className="text-gray-300 mb-4">{classData.description}</p>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">
                    <span className="font-semibold">Équipement:</span> {classData.equipment.join(', ')}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-semibold">Évolution:</span> {classData.evolution}
                  </p>
                  <p className="text-yellow-400 font-semibold">
                    {classData.bonus}
                  </p>
                </div>
              </div>

              {/* Statistiques */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Statistiques de base</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Stat label="HP" value={classData.baseHp} color="#ef4444" />
                  <Stat label="Mana" value={classData.baseMana} color="#3b82f6" />
                  <Stat label="Force" value={classData.baseStrength} color="#f59e0b" />
                  <Stat label="Intelligence" value={classData.baseIntelligence} color="#a855f7" />
                  <Stat label="Agilité" value={classData.baseAgility} color="#10b981" />
                  <Stat label="Chance" value={classData.baseLuck} color="#14b8a6" />
                  <Stat label="Défense" value={classData.baseDefense} color="#6b7280" />
                  <Stat label="Esquive" value={classData.baseDodge} color="#84cc16" />
                </div>
              </div>
            </div>

            {/* Formulaire de création */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Nommez votre personnage</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Nom du personnage"
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  maxLength={20}
                />
                <button
                  onClick={generateRandomName}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  🎲 Aléatoire
                </button>
                <button
                  onClick={handleCreateCharacter}
                  disabled={!characterName}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="bg-slate-700/50 rounded-lg p-3">
    <div className="text-gray-400 text-xs mb-1">{label}</div>
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, (value / 150) * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-white font-bold">{value}</span>
    </div>
  </div>
);
