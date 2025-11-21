import { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { GameGrid } from './3d/GameGrid';
import { Character3D } from './3d/Character3D';
import { Monster3D } from './3d/Monster3D';
import { CombatUI } from './ui/CombatUI';
import { useCharacterStore } from '../stores/characterStore';
import { useWorldStore } from '../stores/worldStore';
import { useGameStore } from '../stores/gameStore';
import { MONSTERS, getMonstersByLevel } from '../data/monsters';
import { Monster, MonsterType } from '../types/monster.types';
import { determineTurnOrder } from '../utils/combatLogic';

export const Game = () => {
  const { characters, playerCharacter } = useCharacterStore();
  const { monsters, addMonster, gridWidth, gridHeight } = useWorldStore();
  const { startCombat, isInCombat, setTurnOrder } = useGameStore();

  // Spawn initial monsters
  useEffect(() => {
    if (monsters.length === 0 && playerCharacter) {
      spawnInitialMonsters();
    }
  }, [playerCharacter]);

  const spawnInitialMonsters = () => {
    const monsterTypes = getMonstersByLevel(1, 5);
    const numMonsters = 20; // Spawn 20 monstres initiaux

    for (let i = 0; i < numMonsters; i++) {
      const randomMonsterDef = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
      
      const monster: Monster = {
        id: `monster_${Date.now()}_${i}`,
        name: randomMonsterDef.name,
        level: randomMonsterDef.level,
        experience: 0,
        hp: randomMonsterDef.baseHp,
        maxHp: randomMonsterDef.baseHp,
        mana: randomMonsterDef.baseMana,
        maxMana: randomMonsterDef.baseMana,
        vigor: randomMonsterDef.baseHp,
        wisdom: randomMonsterDef.baseIntelligence,
        strength: randomMonsterDef.baseStrength,
        intelligence: randomMonsterDef.baseIntelligence,
        agility: randomMonsterDef.baseAgility,
        luck: randomMonsterDef.baseLuck,
        pa: 10,
        maxPa: 10,
        pm: 5,
        maxPm: 5,
        stealth: 20,
        defense: randomMonsterDef.baseDefense,
        dodge: randomMonsterDef.baseAgility * 0.5,
        magicResistance: 10,
        meleeResistance: 10,
        rangedResistance: 10,
        moveSpeed: 5,
        elementalResistance: {},
        position: {
          x: Math.floor(Math.random() * gridWidth),
          z: Math.floor(Math.random() * gridHeight),
        },
        rebirthCount: 0,
        color: randomMonsterDef.color,
        isAlive: true,
        isPlayerControlled: false,
        monsterType: randomMonsterDef.type,
        definition: randomMonsterDef,
        aggroTarget: null,
      };

      addMonster(monster);
    }
  };

  // Démarrer le combat automatiquement
  useEffect(() => {
    if (!isInCombat && playerCharacter && monsters.length > 0) {
      // Trouver des monstres proches
      const nearbyMonsters = monsters
        .filter((m) => {
          const distance = Math.abs(m.position.x - playerCharacter.position.x) +
                          Math.abs(m.position.z - playerCharacter.position.z);
          return distance < 15 && m.isAlive;
        })
        .slice(0, 3);

      if (nearbyMonsters.length > 0) {
        const allCombatants = [playerCharacter, ...nearbyMonsters];
        const turnOrder = determineTurnOrder(allCombatants);
        setTurnOrder(turnOrder);
        startCombat(turnOrder);
      }
    }
  }, [playerCharacter, monsters, isInCombat]);

  const allCharacters = useMemo(() => {
    return [...characters, ...monsters];
  }, [characters, monsters]);

  return (
    <div className="w-full h-screen bg-slate-950">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[50, 30, 50]} fov={60} />
        <OrbitControls
          target={[gridWidth / 2, 0, gridHeight / 2]}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={8}
          maxDistance={50}
          enablePan
          panSpeed={0.5}
        />

        {/* Éclairage */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[gridWidth / 2, 10, gridHeight / 2]} intensity={0.5} color="#3b82f6" />

        {/* Grille */}
        <GameGrid />

        {/* Personnages du joueur */}
        {characters.map((char) => (
          <Character3D
            key={char.id}
            character={char}
            onClick={() => console.log('Character clicked:', char.name)}
          />
        ))}

        {/* Monstres */}
        {monsters.map((monster) => (
          <Monster3D
            key={monster.id}
            monster={monster}
            onClick={() => console.log('Monster clicked:', monster.name)}
          />
        ))}
      </Canvas>

      {/* UI de combat */}
      <CombatUI />

      {/* Instructions */}
      {!isInCombat && (
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 max-w-md">
          <h3 className="text-lg font-bold text-white mb-2">🎮 Bienvenue dans le MMORPG !</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Utilisez la souris pour faire tourner la caméra</li>
            <li>• Scroll pour zoomer/dézoomer</li>
            <li>• Le combat commencera automatiquement</li>
            <li>• Choisissez vos sorts et cliquez sur les ennemis</li>
          </ul>
        </div>
      )}

      {/* Minimap */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30">
        <h4 className="text-xs font-bold text-white mb-2">🗺️ Carte</h4>
        <div className="w-32 h-32 bg-slate-800 rounded relative">
          {/* Position du joueur */}
          {playerCharacter && (
            <div
              className="absolute w-2 h-2 bg-blue-500 rounded-full"
              style={{
                left: `${(playerCharacter.position.x / gridWidth) * 100}%`,
                top: `${(playerCharacter.position.z / gridHeight) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
          {/* Monstres */}
          {monsters.filter(m => m.isAlive).slice(0, 20).map((monster) => (
            <div
              key={monster.id}
              className="absolute w-1 h-1 bg-red-500 rounded-full"
              style={{
                left: `${(monster.position.x / gridWidth) * 100}%`,
                top: `${(monster.position.z / gridHeight) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Monstres: {monsters.filter(m => m.isAlive).length}
        </div>
      </div>
    </div>
  );
};
