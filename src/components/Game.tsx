import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Character3D } from './3d/Character3D';
import { Monster3D } from './3d/Monster3D';
import { CombatUI } from './ui/CombatUI';
import { SocialPanel } from './ui/SocialPanel';
import { QuestPanel } from './ui/QuestPanel';
import { BattlePassPanel } from './ui/BattlePassPanel';
import { AchievementPanel } from './ui/AchievementPanel';
import { WorldMapPanel } from './ui/WorldMapPanel';
import ThirdPersonCamera from './3d/ThirdPersonCamera';
import Environment3D from './3d/Environment3D';
import Terrain from './3d/Terrain';
import WeaponModel from './3d/WeaponModel';
import ControlsPanel from './ui/ControlsPanel';
import { useCharacterStore } from '../stores/characterStore';
import { useWorldStore } from '../stores/worldStore';
import { useGameStore } from '../stores/gameStore';
import { useWeaponStore } from '../stores/weaponStore';
import { useCombatStore } from '../stores/combatStore';
import { getMonstersByLevel } from '../data/monsters';
import { Monster } from '../types/monster.types';
import { CombatLogEntry } from '../types/combat.types';
import { determineTurnOrder } from '../utils/combatLogic';
import { generateMonsterGroups } from '../utils/monsterGroupGenerator';
import * as THREE from 'three';

export const Game = () => {
  const { characters, playerCharacter, updateCharacter } = useCharacterStore();
  const { monsters, addMonster } = useWorldStore();
  const { startCombat, isInCombat, setTurnOrder, turnOrder, currentTurnIndex, addLogEntry } = useGameStore();
  const { toggleWeapon } = useWeaponStore();
  
  const playerRef = useRef<THREE.Group>(null);
  const playerPosition = useRef({ x: 0, z: 0 });
  const [keys, setKeys] = useState<Set<string>>(new Set());
  
  const { selectedSpell, selectTarget, clearSelection } = useCombatStore();
  
  // Helper pour ajouter des logs facilement
  const addLog = (message: string, type: CombatLogEntry['type'] = 'info') => {
    addLogEntry({
      id: `log_${Date.now()}_${Math.random()}`,
      message,
      timestamp: Date.now(),
      type,
    });
  };

  // Helper pour obtenir l'emoji d'un élément
  const getElementEmoji = (element: string): string => {
    const emojis: Record<string, string> = {
      EARTH: '🪨', FIRE: '🔥', AIR: '💨', WATER: '💧',
      LIGHT: '✨', SHADOW: '🌑', POISON: '☠️', DARKNESS: '🌚',
      ARCANE: '🔮', ICE: '❄️', ELECTRIC: '⚡', STEALTH: '👁️',
    };
    return emojis[element] || '⚔️';
  };

  // Gestionnaire de clic sur monstre pour lancer un sort
  const handleMonsterClick = (monster: Monster) => {
    if (!isInCombat || !playerCharacter || !selectedSpell) {
      if (!selectedSpell) {
        addLog('⚠️ Sélectionnez d\'abord un sort !', 'info');
      }
      return;
    }

    // Vérifier si c'est le tour du joueur
    const currentCharacterId = turnOrder[currentTurnIndex];
    if (currentCharacterId !== playerCharacter.id) {
      addLog('⚠️ Ce n\'est pas votre tour !', 'info');
      return;
    }

    // Vérifier si le joueur a assez de PA
    if (playerCharacter.pa < selectedSpell.pa) {
      addLog('⚠️ Pas assez de PA !', 'info');
      return;
    }

    // Vérifier si le monstre est vivant
    if (!monster.isAlive) {
      addLog('⚠️ Cette cible est déjà morte !', 'info');
      return;
    }

    // Calculer la distance
    const distance = Math.sqrt(
      Math.pow(monster.position.x - playerCharacter.position.x, 2) +
      Math.pow(monster.position.z - playerCharacter.position.z, 2)
    );

    // Vérifier la portée
    if (distance < selectedSpell.rangeMin || distance > selectedSpell.rangeMax) {
      addLog(
        `⚠️ Hors de portée ! Distance: ${distance.toFixed(1)}, Portée: ${selectedSpell.rangeMin}-${selectedSpell.rangeMax}`,
        'info'
      );
      return;
    }

    // Calculer les dégâts
    const baseDamage = Math.floor(
      Math.random() * (selectedSpell.damageMax - selectedSpell.damageMin + 1) + selectedSpell.damageMin
    );
    
    const isCritical = Math.random() < selectedSpell.critChance;
    const finalDamage = Math.floor(isCritical ? baseDamage * 1.5 : baseDamage);

    // Appliquer les dégâts
    const newHp = Math.max(0, monster.hp - finalDamage);
    const updateMonster = useWorldStore.getState().updateMonster;
    updateMonster(monster.id, { hp: newHp, isAlive: newHp > 0 });

    // Retirer les PA
    updateCharacter(playerCharacter.id, { pa: playerCharacter.pa - selectedSpell.pa });

    // Log
    if (isCritical) {
      addLog(
        `💥 COUP CRITIQUE ! ${playerCharacter.name} lance ${selectedSpell.name} sur ${monster.name} pour ${finalDamage} dégâts !`,
        'critical'
      );
    } else {
      addLog(
        `⚔️ ${playerCharacter.name} lance ${selectedSpell.name} sur ${monster.name} pour ${finalDamage} dégâts`,
        'damage'
      );
    }

    // Vérifier si le monstre est mort
    if (newHp <= 0) {
      addLog(`💀 ${monster.name} a été vaincu !`, 'death');
    }

    // Nettoyer la sélection
    clearSelection();
  };

  // Spawn initial monster groups
  useEffect(() => {
    if (monsters.length === 0 && playerCharacter) {
      spawnInitialMonsterGroups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCharacter]);

  const spawnInitialMonsterGroups = () => {
    const monsterTypes = getMonstersByLevel(1, 5);
    const numGroups = 10; // 10 groupes de monstres

    for (let g = 0; g < numGroups; g++) {
      const randomMonsterDef = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
      
      // Créer un monstre de base pour le groupe
      const baseMonster: Monster = {
        id: `temp_${g}`,
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
        position: { x: 0, z: 0 },
        rebirthCount: 0,
        color: randomMonsterDef.color,
        isAlive: true,
        isPlayerControlled: false,
        monsterType: randomMonsterDef.type,
        definition: randomMonsterDef,
        aggroTarget: null,
      };

      // Générer un groupe avec ce monstre de base
      const monsterGroup = generateMonsterGroups(baseMonster, 1, 100);
      
      // Ajouter le boss
      addMonster(monsterGroup[0].boss);
      
      // Ajouter les sous-fifres
      monsterGroup[0].minions.forEach((minion) => {
        addMonster(minion);
      });
    }
  };

  // Gestion des contrôles clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => new Set(prev).add(e.key.toLowerCase()));
      
      // Ranger/Sortir l'arme avec R
      if (e.key.toLowerCase() === 'r') {
        toggleWeapon();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(e.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleWeapon]);

  // Initialiser la position du joueur
  useEffect(() => {
    if (playerCharacter) {
      playerPosition.current = { 
        x: playerCharacter.position.x, 
        z: playerCharacter.position.z 
      };
    }
  }, [playerCharacter?.id]); // Seulement quand le personnage change
  
  // Mouvement du personnage avec ZQSD
  useEffect(() => {
    if (!playerCharacter) return;

    const interval = setInterval(() => {
      if (keys.size === 0) return;
      
      const moveSpeed = keys.has('shift') ? 0.2 : 0.1; // Sprint avec Shift
      let newX = playerPosition.current.x;
      let newZ = playerPosition.current.z;
      let moved = false;

      if (keys.has('z') || keys.has('arrowup')) {
        newZ -= moveSpeed;
        moved = true;
      }
      if (keys.has('s') || keys.has('arrowdown')) {
        newZ += moveSpeed;
        moved = true;
      }
      if (keys.has('q') || keys.has('arrowleft')) {
        newX -= moveSpeed;
        moved = true;
      }
      if (keys.has('d') || keys.has('arrowright')) {
        newX += moveSpeed;
        moved = true;
      }

      if (moved) {
        playerPosition.current = { x: newX, z: newZ };
        updateCharacter(playerCharacter.id, {
          position: { x: newX, z: newZ },
        });
      }
    }, 50); // Mise à jour toutes les 50ms

    return () => clearInterval(interval);
  }, [keys, playerCharacter?.id, updateCharacter]);

  // Démarrer le combat automatiquement quand on approche des monstres
  useEffect(() => {
    if (!isInCombat && playerCharacter && monsters.length > 0) {
      const nearbyMonsters = monsters
        .filter((m) => {
          const distance = Math.sqrt(
            Math.pow(m.position.x - playerCharacter.position.x, 2) +
            Math.pow(m.position.z - playerCharacter.position.z, 2)
          );
          return distance < 5 && m.isAlive;
        })
        .slice(0, 3);

      if (nearbyMonsters.length > 0) {
        const allCombatants = [playerCharacter, ...nearbyMonsters];
        const turnOrder = determineTurnOrder(allCombatants);
        setTurnOrder(turnOrder);
        startCombat(turnOrder);
        addLog(`⚔️ Combat engagé contre ${nearbyMonsters.length} monstre(s) !`, 'turn');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCharacter?.position.x, playerCharacter?.position.z, isInCombat]);

  return (
    <div className="w-full h-screen bg-slate-950">
      <Canvas shadows gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={75} />
        
        {/* Caméra 3ème personne */}
        {playerCharacter && (
          <ThirdPersonCamera target={playerRef} distance={8} height={4} smoothness={0.1} />
        )}

        {/* Environnement 3D complet */}
        <Environment3D />

        {/* Terrain avec décors */}
        <Terrain />

        {/* Personnages du joueur avec ref pour la caméra */}
        {characters.map((char) => {
          const isPlayer = char.id === playerCharacter?.id;
          return (
            <group key={char.id} ref={isPlayer ? playerRef : undefined}>
              <Character3D
                character={char}
                onClick={() => console.log('Character clicked:', char.name)}
              />
              {/* Arme équipée */}
              {isPlayer && <WeaponModel parentRef={playerRef} />}
            </group>
          );
        })}

        {/* Monstres avec indication de boss */}
        {monsters.map((monster) => (
          <group key={monster.id}>
            <Monster3D
              monster={monster}
              onClick={() => handleMonsterClick(monster)}
            />
            {/* Indicateur de boss */}
            {monster.name.includes('Chef') && (
              <mesh position={[monster.position.x, 3.5, monster.position.z]}>
                <ringGeometry args={[0.6, 0.8, 32]} />
                <meshBasicMaterial color="#ff0000" transparent opacity={0.7} />
              </mesh>
            )}
          </group>
        ))}

        {/* Fog pour l'atmosphère */}
        <fog attach="fog" args={['#0a0a1a', 50, 150]} />
      </Canvas>

      {/* UI de combat */}
      <CombatUI />

      {/* Message d'aide au centre quand pas en combat */}
      {!isInCombat && playerCharacter && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-500/50 shadow-2xl max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-4">🎮 Bienvenue !</h2>
            <p className="text-lg text-gray-300 mb-4">
              Utilisez <kbd className="px-2 py-1 bg-slate-700 rounded text-white font-bold">ZQSD</kbd> ou les flèches pour vous déplacer
            </p>
            <p className="text-md text-yellow-300 mb-6">
              👾 Approchez-vous des monstres ou cliquez sur le bouton en haut à gauche pour commencer le combat !
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <span>💡</span>
              <span>Le combat se déclenchera automatiquement à moins de 5 cases d'un monstre</span>
            </div>
          </div>
        </div>
      )}

      {/* Indicateur de sort sélectionné (suit le curseur) */}
      {selectedSpell && isInCombat && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="bg-purple-600/90 backdrop-blur-sm rounded-full p-3 border-2 border-purple-400 shadow-lg shadow-purple-500/50 animate-pulse">
            <div className="text-2xl">{getElementEmoji(selectedSpell.element)}</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-slate-900/95 px-3 py-1 rounded-lg border border-purple-500/50 whitespace-nowrap">
            <div className="text-xs font-bold text-white">{selectedSpell.name}</div>
            <div className="text-xs text-gray-400">Portée: {selectedSpell.rangeMin}-{selectedSpell.rangeMax}</div>
          </div>
        </div>
      )}

      {/* Panneau des contrôles */}
      <ControlsPanel />

      {/* New UI Panels */}
      <SocialPanel />
      <QuestPanel />
      <BattlePassPanel />
      <AchievementPanel />
      <WorldMapPanel />

      {/* Instructions et bouton de combat */}
      {!isInCombat && playerCharacter && monsters.length > 0 && (() => {
        const nearbyMonsters = monsters.filter((m) => {
          const distance = Math.sqrt(
            Math.pow(m.position.x - playerCharacter.position.x, 2) +
            Math.pow(m.position.z - playerCharacter.position.z, 2)
          );
          return distance < 10 && m.isAlive;
        });
        const veryClose = nearbyMonsters.filter((m) => {
          const distance = Math.sqrt(
            Math.pow(m.position.x - playerCharacter.position.x, 2) +
            Math.pow(m.position.z - playerCharacter.position.z, 2)
          );
          return distance < 5;
        });

        return (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 max-w-md">
            <h3 className="text-lg font-bold text-white mb-2">🎮 MMORPG 3D - 3ème Personne</h3>
            <ul className="text-sm text-gray-300 space-y-1 mb-3">
              <li>• ZQSD ou Flèches : Se déplacer</li>
              <li>• Shift : Courir</li>
              <li>• Clic droit + Souris : Tourner la caméra</li>
              <li>• Molette : Zoom</li>
              <li>• R : Ranger/Sortir l'arme (combat aux poings)</li>
            </ul>
            
            {nearbyMonsters.length > 0 && (
              <div className="mb-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-300 text-sm font-semibold">
                  ⚠️ {nearbyMonsters.length} monstre(s) à proximité
                </p>
                {veryClose.length > 0 && (
                  <p className="text-red-300 text-xs mt-1">
                    🎯 {veryClose.length} très proche(s) - Combat auto dans 5 cases
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => {
                const combatMonsters = monsters.filter(m => m.isAlive).slice(0, 3);
                if (combatMonsters.length > 0) {
                  const allCombatants = [playerCharacter, ...combatMonsters];
                  const order = determineTurnOrder(allCombatants);
                  setTurnOrder(order);
                  startCombat(order);
                  addLog('⚔️ Le combat commence !', 'turn');
                }
              }}
              className="w-full py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-lg animate-pulse"
            >
              ⚔️ Commencer le Combat Maintenant
            </button>
          </div>
        );
      })()}

      {/* Indicateur d'arme */}
      {playerCharacter && (
        <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">⚔️</span>
            <div>
              <div className="text-xs text-gray-400">Arme équipée</div>
              <div className="text-sm text-white font-semibold">
                {useWeaponStore.getState().weaponDrawn 
                  ? useWeaponStore.getState().currentWeapon?.name || 'Poings'
                  : 'Poings (Arme rangée)'}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-2">Appuyez sur R pour changer</div>
        </div>
      )}

      {/* Minimap améliorée */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30">
        <h4 className="text-xs font-bold text-white mb-2">🗺️ Carte du monde</h4>
        <div className="w-40 h-40 bg-slate-800 rounded relative overflow-hidden">
          {/* Grille */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-slate-700/30" />
            ))}
          </div>
          
          {/* Position du joueur */}
          {playerCharacter && (
            <div
              className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10"
              style={{
                left: `${((playerCharacter.position.x + 50) / 100) * 100}%`,
                top: `${((playerCharacter.position.z + 50) / 100) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
            </div>
          )}
          
          {/* Monstres (bosses en rouge foncé) */}
          {monsters.filter(m => m.isAlive).map((monster) => {
            const isBoss = monster.name.includes('Chef');
            return (
              <div
                key={monster.id}
                className={`absolute rounded-full ${isBoss ? 'w-2 h-2 bg-red-600 border border-yellow-500' : 'w-1.5 h-1.5 bg-red-400'}`}
                style={{
                  left: `${((monster.position.x + 50) / 100) * 100}%`,
                  top: `${((monster.position.z + 50) / 100) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}
        </div>
        <div className="text-xs text-gray-400 mt-2 flex justify-between">
          <span>Monstres: {monsters.filter(m => m.isAlive).length}</span>
          <span className="text-red-500">◆ Boss</span>
        </div>
      </div>
    </div>
  );
};
