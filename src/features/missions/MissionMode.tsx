import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { MISSIONS } from '../../config/missions';
import type { ActiveMission } from '../../lib/types';

export function MissionMode() {
    const { state, dispatch } = useGame();
    const [now, setNow] = useState(Date.now());
    const [viewingReport, setViewingReport] = useState<ActiveMission | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleStartMission = (missionId: string) => {
        const mission = MISSIONS.find(m => m.id === missionId);
        if (!mission) return;

        if (state.resources.warriors >= mission.cost) {
            dispatch({ type: 'START_MISSION', payload: { missionId, duration: mission.duration, cost: mission.cost } });
        }
    };

    const handleClaim = () => {
        if (!viewingReport) return;
        dispatch({ type: 'CLAIM_MISSION', payload: { missionInstanceId: viewingReport.id } });
        setViewingReport(null);
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', gap: '2rem', padding: '1rem', position: 'relative' }}>

            {/* Report Overlay */}
            {viewingReport && viewingReport.result && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '12px'
                }}>
                    <div className="glass-panel" style={{ width: '500px', maxWidth: '90%', padding: '2rem', border: `2px solid ${viewingReport.result.success ? 'var(--accent-secondary)' : 'var(--accent-primary)'}` }}>
                        <h2 style={{ color: viewingReport.result.success ? 'var(--accent-secondary)' : 'var(--accent-primary)', marginBottom: '1rem' }}>
                            {viewingReport.result.success ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
                        </h2>

                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace' }}>
                            {viewingReport.result.log.map((entry, i) => (
                                <div key={i} style={{
                                    marginBottom: '0.5rem',
                                    color: entry.type === 'danger' ? '#ff4d4d' : entry.type === 'success' ? '#4dff4d' : '#ccc'
                                }}>
                                    <span style={{ opacity: 0.5 }}>[{new Date(entry.timestamp).toLocaleTimeString()}]</span> {entry.message}
                                </div>
                            ))}
                        </div>

                        {viewingReport.result.success && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ color: 'var(--text-secondary)' }}>Recovered Resources:</h4>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    {viewingReport.result.rewards.map((r, i) => (
                                        <div key={i} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                            +{r.amount} {r.resource}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button className="btn-primary" onClick={handleClaim} style={{ width: '100%' }}>
                            {viewingReport.result.success ? 'Claim Resources & Return Squad' : 'Dismiss & Honor the Fallen'}
                        </button>
                    </div>
                </div>
            )}

            {/* Available Missions */}
            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ color: 'var(--accent-tertiary)' }}>Available Missions</h3>
                <div style={{ overflowY: 'auto' }}>
                    {MISSIONS.map(mission => {
                        const canAfford = state.resources.warriors >= mission.cost;
                        const activeCount = state.activeMissions.filter(m => m.missionId === mission.id).length;

                        return (
                            <div key={mission.id} style={{
                                padding: '1rem',
                                marginBottom: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontWeight: 'bold' }}>{mission.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{mission.rewards.map(r => `+${r.amount} ${r.resource}`).join(', ')}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>{mission.description}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>Duration: {mission.duration}s</span>
                                    <span>Risk: {Math.round(mission.risk * 100)}%</span>
                                </div>
                                <button
                                    className="btn-primary"
                                    style={{ width: '100%', marginTop: '0.5rem', opacity: canAfford ? 1 : 0.5, cursor: canAfford ? 'pointer' : 'not-allowed' }}
                                    disabled={!canAfford}
                                    onClick={() => handleStartMission(mission.id)}
                                >
                                    Send {mission.cost} Warriors
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Active Missions */}
            <div className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ color: 'var(--accent-secondary)' }}>Active Operations</h3>
                <div style={{ overflowY: 'auto' }}>
                    {state.activeMissions.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>No active missions.</div>}

                    {state.activeMissions.map(mission => {
                        const config = MISSIONS.find(m => m.id === mission.missionId);
                        if (!config) return null;

                        const timeLeft = Math.max(0, Math.ceil((mission.endTime - now) / 1000));
                        const progress = Math.min(100, ((now - mission.startTime) / (mission.endTime - mission.startTime)) * 100);
                        const isCompleted = mission.status === 'completed';

                        return (
                            <div key={mission.id} style={{
                                padding: '1rem',
                                marginBottom: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                border: isCompleted ? '1px solid var(--accent-tertiary)' : '1px solid var(--border-color)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 'bold' }}>{config.name}</span>
                                    <span>{isCompleted ? 'REPORT READY' : `${timeLeft}s`}</span>
                                </div>

                                {isCompleted ? (
                                    <button className="btn-primary"
                                        style={{ width: '100%', background: 'var(--accent-tertiary)', color: 'black', fontWeight: 'bold' }}
                                        onClick={() => setViewingReport(mission)}
                                    >
                                        REVIEW REPORT
                                    </button>
                                ) : (
                                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px' }}>
                                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-secondary)', borderRadius: '3px', transition: 'width 1s linear' }} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MissionMode;
