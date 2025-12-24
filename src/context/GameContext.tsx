import { createContext, useContext, useReducer, useMemo, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction, Plot, ActiveMission } from '../lib/types';
import { UPGRADES } from '../config/upgrades';
import { MISSIONS } from '../config/missions';
import { ACHIEVEMENTS } from '../config/achievements';

const INITIAL_PLOTS: Plot[] = Array(9).fill(null).map((_, i) => ({
    id: i,
    unlocked: i === 0, // First plot unlocked
    seedId: null,
    plantTime: null
}));

const INITIAL_STATE: GameState = {
    resources: {
        spores: 0,
        mycelium: 0,
        warriors: 0
    },
    unlockedModes: ['clicker'],
    currentMode: 'clicker',
    lastSaveTime: Date.now(),
    upgrades: {},
    plots: INITIAL_PLOTS,
    activeMissions: [],
    clickLevel: 1,
    clickXP: 0,
    goldenShroom: null,
    achievements: [],
    stats: {
        totalClicks: 0
    }
};

// Save Key
const SAVE_KEY = 'fungal_evolution_save_v1';

// Helper: Calculate derived stats
export const calculateStats = (upgrades: { [key: string]: number }) => {
    let clickPower = 1;
    let autoSpores = 0;

    UPGRADES.forEach(u => {
        const level = upgrades[u.id] || 0;
        if (level > 0) {
            if (u.effectType === 'click_power') clickPower += u.effectValue * level;
            if (u.effectType === 'auto_spores') autoSpores += u.effectValue * level;
        }
    });

    return { clickPower, autoSpores };
};

// Helper: Load from storage or return default
const getInitialState = (): GameState => {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) {
            const parsed: GameState = JSON.parse(saved);
            // Basic validation: ensure arrays exist (migration for old saves if we had them)
            if (!parsed.plots) parsed.plots = INITIAL_PLOTS;
            if (!parsed.activeMissions) parsed.activeMissions = [];
            if (!parsed.activeMissions) parsed.activeMissions = [];
            if (!parsed.clickLevel) parsed.clickLevel = 1;
            if (!parsed.achievements) parsed.achievements = [];
            if (!parsed.stats) parsed.stats = { totalClicks: 0 };

            // Offline Progress Calculation
            const now = Date.now();
            const timeDiff = (now - parsed.lastSaveTime) / 1000; // Seconds
            if (timeDiff > 1) {
                const stats = calculateStats(parsed.upgrades);
                const offlineSpores = stats.autoSpores * timeDiff;

                if (offlineSpores > 0) {
                    // We could show a toast here, but console is fine for now
                    console.log(`[Fungal Evolution] Offline for ${timeDiff.toFixed(1)}s. Gained ${offlineSpores.toFixed(0)} spores.`);
                    parsed.resources.spores += offlineSpores;
                }
            }
            parsed.lastSaveTime = now;
            return parsed;
        }
    } catch (e) {
        console.error('Failed to load save:', e);
    }
    return INITIAL_STATE;
};

const GameContext = createContext<{
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
    stats: { clickPower: number; autoSpores: number };
} | undefined>(undefined);

function checkAchievements(state: GameState): string[] {
    const newUnlocked: string[] = [];

    ACHIEVEMENTS.forEach(ach => {
        if (state.achievements.includes(ach.id)) return;

        let unlocked = false;
        switch (ach.type) {
            case 'click_count':
                if (state.stats.totalClicks >= ach.threshold) unlocked = true;
                break;
            case 'resource_count':
                if (ach.resource && state.resources[ach.resource as keyof typeof state.resources] >= ach.threshold) unlocked = true;
                break;
            case 'mode_unlock':
                if (ach.mode && state.unlockedModes.includes(ach.mode as any)) unlocked = true;
                break;
        }

        if (unlocked) {
            newUnlocked.push(ach.id);
        }
    });

    return newUnlocked;
}

function gameReducer(state: GameState, action: GameAction): GameState {
    let newState = state;

    switch (action.type) {
        case 'ADD_RESOURCE':
            // Keep generic add for other sources, but CLICK_MUSHROOM now handles clicks specifically
            const nextSpores = state.resources[action.payload.resource] + action.payload.amount;
            const unlockGarden = (state.resources.spores + (action.payload.resource === 'spores' ? action.payload.amount : 0)) >= 100 && !state.unlockedModes.includes('garden');
            const unlockMissions = (state.resources.warriors + (action.payload.resource === 'warriors' ? action.payload.amount : 0)) >= 1 && !state.unlockedModes.includes('missions');

            let nextUnlockedModes = state.unlockedModes;
            if (unlockGarden) nextUnlockedModes = [...nextUnlockedModes, 'garden'];
            if (unlockMissions && !nextUnlockedModes.includes('missions')) nextUnlockedModes = [...nextUnlockedModes, 'missions'];

            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    [action.payload.resource]: nextSpores,
                },
                unlockedModes: nextUnlockedModes
            };
            break;

        case 'CLICK_MUSHROOM':
            const stats = calculateStats(state.upgrades);
            const addedSpores = stats.clickPower;

            let newXP = state.clickXP + 1;
            let newLevel = state.clickLevel;

            if (newXP >= newLevel) {
                newXP -= newLevel;
                newLevel++;
            }

            // Check Golden Spawn
            const spawnChance = newLevel * 0.005;
            const shouldSpawnGolden = Math.random() < spawnChance && !state.goldenShroom;

            let newGoldenShroom = state.goldenShroom;
            if (shouldSpawnGolden) {
                newGoldenShroom = {
                    active: true,
                    x: 10 + Math.random() * 80,
                    y: 10 + Math.random() * 80,
                    expiresAt: Date.now() + 3000 // 3 seconds
                };
            }

            const totalSpores = state.resources.spores + addedSpores;
            const willUnlockGarden = totalSpores >= 100 && !state.unlockedModes.includes('garden');
            let modes = state.unlockedModes;
            if (willUnlockGarden) modes = [...modes, 'garden'];

            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    spores: totalSpores
                },
                clickLevel: newLevel,
                clickXP: newXP,
                goldenShroom: newGoldenShroom,
                unlockedModes: modes,
                stats: {
                    ...state.stats,
                    totalClicks: state.stats.totalClicks + 1
                }
            };
            break;

        case 'SPAWN_GOLDEN':
            newState = {
                ...state,
                goldenShroom: {
                    active: true,
                    x: action.payload.x,
                    y: action.payload.y,
                    expiresAt: Date.now() + 3000
                }
            };
            break;

        case 'CLICK_GOLDEN':
            if (!state.goldenShroom || !state.goldenShroom.active) return state;

            const bonus = state.clickLevel * 100;

            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    spores: state.resources.spores + bonus
                },
                goldenShroom: null
            };
            break;

        case 'DESPAWN_GOLDEN':
            newState = {
                ...state,
                goldenShroom: null
            };
            break;

        case 'SPEND_RESOURCE':
            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    [action.payload.resource]: Math.max(0, state.resources[action.payload.resource] - action.payload.amount),
                },
            };
            break;

        case 'BUY_UPGRADE':
            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    spores: state.resources.spores - action.payload.cost
                },
                upgrades: {
                    ...state.upgrades,
                    [action.payload.upgradeId]: (state.upgrades[action.payload.upgradeId] || 0) + 1
                }
            };
            break;

        case 'UNLOCK_MODE':
            if (state.unlockedModes.includes(action.payload)) return state;
            newState = {
                ...state,
                unlockedModes: [...state.unlockedModes, action.payload],
            };
            break;

        case 'SWITCH_MODE':
            newState = {
                ...state,
                currentMode: action.payload,
            };
            break;

        case 'LOAD_GAME':
            // Need to migrate stats if missing in loaded save, though getInitialState usually handles this
            newState = {
                ...action.payload,
                stats: action.payload.stats || { totalClicks: 0 },
                achievements: action.payload.achievements || []
            };
            break;

        case 'UNLOCK_PLOT':
            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    spores: state.resources.spores - action.payload.cost
                },
                plots: state.plots.map(p => p.id === action.payload.plotId ? { ...p, unlocked: true } : p)
            };
            break;

        case 'PLANT_SEED':
            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    spores: state.resources.spores - action.payload.cost
                },
                plots: state.plots.map(p => p.id === action.payload.plotId ? { ...p, seedId: action.payload.seedId, plantTime: Date.now() } : p)
            };
            break;

        case 'HARVEST_PLOT':
            const gainedWarriors = state.resources.warriors + action.payload.warriorYield;
            const unlockMissionsHarvest = gainedWarriors >= 1 && !state.unlockedModes.includes('missions');

            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    warriors: gainedWarriors,
                },
                plots: state.plots.map(p => p.id === action.payload.plotId ? { ...p, seedId: null, plantTime: null } : p),
                unlockedModes: unlockMissionsHarvest ? [...state.unlockedModes, 'missions'] : state.unlockedModes
            };
            break;

        case 'START_MISSION':
            const newMission: ActiveMission = {
                id: Math.random().toString(36).substr(2, 9),
                missionId: action.payload.missionId,
                startTime: Date.now(),
                endTime: Date.now() + action.payload.duration * 1000,
                status: 'active'
            };
            newState = {
                ...state,
                resources: {
                    ...state.resources,
                    warriors: state.resources.warriors - action.payload.cost
                },
                activeMissions: [...state.activeMissions, newMission]
            };
            break;

        case 'COMPLETE_MISSION':
            newState = {
                ...state,
                activeMissions: state.activeMissions.map(m =>
                    m.id === action.payload.missionInstanceId
                        ? { ...m, status: 'completed', result: action.payload.result }
                        : m
                )
            };
            break;

        case 'CLAIM_MISSION':
            const missionToClaim = state.activeMissions.find(m => m.id === action.payload.missionInstanceId);
            if (!missionToClaim || !missionToClaim.result) return state;

            const config = MISSIONS.find(m => m.id === missionToClaim.missionId);
            if (!config) return state;

            let newResources = { ...state.resources };

            if (missionToClaim.result.success) {
                newResources.warriors += config.cost;
                missionToClaim.result.rewards.forEach(r => {
                    newResources[r.resource] += r.amount;
                });
            }

            newState = {
                ...state,
                resources: newResources,
                activeMissions: state.activeMissions.filter(m => m.id !== action.payload.missionInstanceId)
            };
            break;

        case 'TICK':
            const { autoSpores: aSpores } = calculateStats(state.upgrades);
            const gen = aSpores * action.payload.deltaTime;

            let newStateRef = state;

            if (gen > 0) {
                newStateRef = {
                    ...state,
                    resources: {
                        ...state.resources,
                        spores: state.resources.spores + gen
                    },
                    lastSaveTime: Date.now()
                };
            } else {
                newStateRef = { ...state, lastSaveTime: Date.now() };
            }

            if (newStateRef.goldenShroom && Date.now() > newStateRef.goldenShroom.expiresAt) {
                newStateRef = { ...newStateRef, goldenShroom: null };
            }

            if (newStateRef.resources.spores >= 100 && !newStateRef.unlockedModes.includes('garden')) {
                newStateRef.unlockedModes = [...newStateRef.unlockedModes, 'garden'];
            }

            newState = newStateRef;
            break;

        default:
            return state;
    }

    // Check Achievements
    const unlockedAchievements = checkAchievements(newState);
    if (unlockedAchievements.length > 0) {
        return {
            ...newState,
            achievements: [...newState.achievements, ...unlockedAchievements]
        };
    }

    return newState;
}

export function GameProvider({ children }: { children: ReactNode }) {
    // Use getInitialState to load from storage or return default
    const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

    const stats = useMemo(() => calculateStats(state.upgrades), [state.upgrades]);

    // Auto-Save: Update a ref with current state every render, then save from interval
    const stateRef = useRef(state);

    // Keep ref in sync
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Interval saver (every 5 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
            // console.log('Game Saved'); 
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <GameContext.Provider value={{ state, dispatch, stats }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}
