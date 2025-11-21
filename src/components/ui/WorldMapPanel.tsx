import { useState } from 'react';
import { COUNTRIES, MAPS } from '../../data/countries';
import { DUNGEONS } from '../../data/dungeons';
import { Country } from '../../types/multiplayer.types';

export function WorldMapPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-36 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow-lg z-50"
      >
        🗺️ World Map
      </button>
    );
  }

  const country = selectedCountry ? COUNTRIES[selectedCountry] : null;
  const map = selectedMap ? MAPS[selectedMap] : null;

  return (
    <div className="fixed inset-4 bg-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-blue-900 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">World Map</h2>
            <p className="text-green-200">Explore the vast world of the MMORPG</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Countries Sidebar */}
        <div className="w-64 bg-slate-900 overflow-y-auto border-r border-slate-700">
          <div className="p-4">
            <h3 className="text-white font-bold mb-3">Countries</h3>
            <div className="space-y-2">
              {Object.values(COUNTRIES).map((country: Country) => (
                <button
                  key={country.id}
                  onClick={() => {
                    setSelectedCountry(country.id);
                    setSelectedMap(null);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCountry === country.id
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-semibold">{country.name}</div>
                  <div className="text-xs opacity-75">{country.maps.length} maps</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedCountry && !selectedMap && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-2xl text-white font-bold mb-2">Select a Country</h3>
              <p className="text-gray-400">Choose a country from the left to view its maps</p>
            </div>
          )}

          {country && !selectedMap && (
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{country.name}</h2>
                <p className="text-gray-300">{country.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {country.maps.map(mapId => {
                  const mapData = MAPS[mapId];
                  if (!mapData) return null;

                  return (
                    <button
                      key={mapId}
                      onClick={() => setSelectedMap(mapId)}
                      className="text-left p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <h4 className="text-white font-semibold mb-2">{mapData.name}</h4>
                      <p className="text-sm text-gray-400 mb-3">{mapData.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Lv. {mapData.minLevel}-{mapData.maxLevel}</span>
                        <span>{mapData.dungeons.length} dungeons</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Size: {mapData.width}x{mapData.height}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {map && (
            <div>
              <button
                onClick={() => setSelectedMap(null)}
                className="mb-4 text-blue-400 hover:text-blue-300"
              >
                ← Back to {country?.name}
              </button>

              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{map.name}</h2>
                    <p className="text-gray-300 mb-2">{map.description}</p>
                  </div>
                  <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                    Travel Here
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-600 rounded p-3">
                    <div className="text-gray-400 mb-1">Level Range</div>
                    <div className="text-white font-semibold">
                      {map.minLevel} - {map.maxLevel}
                    </div>
                  </div>
                  <div className="bg-slate-600 rounded p-3">
                    <div className="text-gray-400 mb-1">Map Size</div>
                    <div className="text-white font-semibold">
                      {map.width} x {map.height}
                    </div>
                  </div>
                  <div className="bg-slate-600 rounded p-3">
                    <div className="text-gray-400 mb-1">Dungeons</div>
                    <div className="text-white font-semibold">
                      {map.dungeons.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dungeons */}
              {map.dungeons.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Dungeons</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {map.dungeons.map(dungeonId => {
                      const dungeon = DUNGEONS[dungeonId];
                      if (!dungeon) return null;

                      const difficultyColors = {
                        normal: 'text-green-400 bg-green-900/30',
                        hard: 'text-yellow-400 bg-yellow-900/30',
                        extreme: 'text-red-400 bg-red-900/30',
                      };

                      return (
                        <div
                          key={dungeonId}
                          className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-white font-semibold">{dungeon.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${difficultyColors[dungeon.difficulty]}`}>
                              {dungeon.difficulty.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-400 mb-3">{dungeon.description}</p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>👥 {dungeon.requiredPlayers} players</span>
                            <span>Lv. {dungeon.minLevel}+</span>
                          </div>
                          
                          <div className="border-t border-slate-600 pt-3">
                            <div className="text-xs text-gray-400 mb-1">Rewards:</div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="text-blue-400">🎯 {dungeon.rewards.experience} XP</span>
                              <span className="text-yellow-400">💰 {dungeon.rewards.gold} Gold</span>
                              <span className="text-purple-400">📦 {dungeon.rewards.items.length} items</span>
                            </div>
                          </div>
                          
                          <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">
                            Enter Dungeon
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
