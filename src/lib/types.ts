export type ResourceType = 'spores' | 'mycelium' | 'warriors';

export type Resources = {
    [key in ResourceType]: number;
};

export type GameMode = 'clicker' | 'garden' | 'missions' | 'hive';

export interface Plot {
    id: number;
    unlocked: boolean;
    seedId: string | null;
    plantTime: number | null; // Timestamp
}

export interface MissionLogEntry {
    timestamp: number;
    message: string;
    type: 'info' | 'danger' | 'success';
}

export interface MissionResult {
    success: boolean;
    rewards: { resource: ResourceType; amount: number }[];
    log: MissionLogEntry[];
}

export interface ActiveMission {
    id: string; // Unique instance ID
    missionId: string; // Config ID
    startTime: number;
    endTime: number;
    status: 'active' | 'completed';
    result?: MissionResult;
}

export interface GoldenShroomState {
    active: boolean;
    x: number;
    y: number;
    expiresAt: number;
}

export interface GameState {
    resources: Resources;
    unlockedModes: GameMode[];
    currentMode: GameMode;
    lastSaveTime: number;
    upgrades: { [key: string]: number };
    plots: Plot[];
    activeMissions: ActiveMission[];
    clickLevel: number;
    clickXP: number;
    goldenShroom: GoldenShroomState | null;
    achievements: string[];
    stats: {
        totalClicks: number;
    };
}

export type GameAction =
    | { type: 'ADD_RESOURCE'; payload: { resource: ResourceType; amount: number } }
    | { type: 'SPEND_RESOURCE'; payload: { resource: ResourceType; amount: number } }
    | { type: 'BUY_UPGRADE'; payload: { upgradeId: string; cost: number } }
    | { type: 'UNLOCK_MODE'; payload: GameMode }
    | { type: 'SWITCH_MODE'; payload: GameMode }
    | { type: 'LOAD_GAME'; payload: GameState }
    | { type: 'TICK'; payload: { deltaTime: number } }
    | { type: 'UNLOCK_PLOT'; payload: { plotId: number; cost: number } }
    | { type: 'PLANT_SEED'; payload: { plotId: number; seedId: string; cost: number } }
    | { type: 'HARVEST_PLOT'; payload: { plotId: number; warriorYield: number } }
    | { type: 'START_MISSION'; payload: { missionId: string; duration: number; cost: number } }
    | { type: 'COMPLETE_MISSION'; payload: { missionInstanceId: string; result: MissionResult } }
    | { type: 'CLAIM_MISSION'; payload: { missionInstanceId: string } }
    | { type: 'CLICK_MUSHROOM' }
    | { type: 'SPAWN_GOLDEN'; payload: { x: number; y: number } }
    | { type: 'CLICK_GOLDEN' }
    | { type: 'DESPAWN_GOLDEN' };
