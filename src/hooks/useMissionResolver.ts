import { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { MISSIONS } from '../config/missions';
import type { MissionLogEntry, MissionResult } from '../lib/types';

// Simple flavor text generator
const generateLog = (missionName: string, success: boolean, duration: number): MissionLogEntry[] => {
    const logs: MissionLogEntry[] = [];
    const now = Date.now();

    // Start
    logs.push({ timestamp: now - duration * 1000, message: `Squad departed for ${missionName}.`, type: 'info' });

    // Middle events (mock timestamps)
    if (duration > 5) {
        logs.push({ timestamp: now - (duration * 0.5) * 1000, message: 'Encountered local fauna.', type: 'info' });
    }

    // End
    if (success) {
        logs.push({ timestamp: now, message: 'Mission successful! Resources secured.', type: 'success' });
        logs.push({ timestamp: now, message: 'Squad returning home.', type: 'info' });
    } else {
        logs.push({ timestamp: now, message: 'Ambush! Squad was overwhelmed.', type: 'danger' });
        logs.push({ timestamp: now, message: 'Signal lost. No survivors.', type: 'danger' });
    }

    return logs;
};

export function useMissionResolver() {
    const { state, dispatch } = useGame();

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();

            state.activeMissions.forEach(mission => {
                // Only resolve ACTIVE missions that have finished time
                if (mission.status === 'active' && now >= mission.endTime) {

                    const config = MISSIONS.find(m => m.id === mission.missionId);
                    if (config) {
                        const isSuccess = Math.random() > config.risk;

                        const result: MissionResult = {
                            success: isSuccess,
                            rewards: isSuccess ? config.rewards : [],
                            log: generateLog(config.name, isSuccess, config.duration)
                        };

                        dispatch({
                            type: 'COMPLETE_MISSION',
                            payload: {
                                missionInstanceId: mission.id,
                                result: result
                            }
                        });
                    }
                }
            });
        }, 1000); // Check every second

        return () => clearInterval(interval);
    }, [state.activeMissions, dispatch]);
}
