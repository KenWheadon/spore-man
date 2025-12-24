import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import type { Plot } from '../../lib/types';
import { SEEDS } from '../../config/seeds';

export function GardenPlot({ plot }: { plot: Plot }) {
    const { state, dispatch } = useGame();
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const handleUnlock = () => {
        const cost = 100 * (plot.id + 1); // Simple scaling cost
        if (state.resources.spores >= cost) {
            dispatch({ type: 'UNLOCK_PLOT', payload: { plotId: plot.id, cost } });
        }
    };

    const handlePlant = (seedId: string) => {
        const seed = SEEDS.find(s => s.id === seedId);
        if (!seed) return;
        if (state.resources.spores >= seed.cost) {
            dispatch({ type: 'PLANT_SEED', payload: { plotId: plot.id, seedId, cost: seed.cost } });
        }
    };

    const handleHarvest = () => {
        if (!plot.seedId || !plot.plantTime) return;
        const seed = SEEDS.find(s => s.id === plot.seedId);
        if (!seed) return;

        dispatch({ type: 'HARVEST_PLOT', payload: { plotId: plot.id, warriorYield: seed.warriorYield } });
    };

    if (!plot.unlocked) {
        const cost = 100 * (plot.id + 1);
        const canAfford = state.resources.spores >= cost;
        return (
            <div className="glass-panel" style={{
                aspectRatio: '1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                opacity: 0.5,
                borderStyle: 'dashed'
            }}>
                <div style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>Locked Plot</div>
                <button
                    className="btn-primary"
                    style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                    disabled={!canAfford}
                    onClick={handleUnlock}
                >
                    {cost} Spores
                </button>
            </div>
        );
    }

    if (plot.seedId) {
        const seed = SEEDS.find(s => s.id === plot.seedId);
        if (!seed) return null; // Should not happen

        const progress = Math.min(100, ((now - (plot.plantTime || 0)) / (seed.growthTime * 1000)) * 100);
        const isReady = progress >= 100;

        return (
            <div className="glass-panel" style={{
                aspectRatio: '1',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isReady ? `2px solid ${seed.color}` : '1px solid var(--border-color)',
                boxShadow: isReady ? `0 0 15px ${seed.color}` : 'none'
            }}>
                <div style={{ fontWeight: 'bold', color: seed.color }}>{seed.name}</div>

                {isReady ? (
                    <button className="btn-primary" onClick={handleHarvest}>
                        HARVEST ({seed.warriorYield} Warriors)
                    </button>
                ) : (
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: seed.color,
                            borderRadius: '4px',
                            transition: 'width 1s linear'
                        }} />
                        <div style={{ fontSize: '0.7rem', textAlign: 'center', marginTop: '5px' }}>
                            {Math.ceil(seed.growthTime - (now - (plot.plantTime || 0)) / 1000)}s
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Empty Plot - Seed Selection
    return (
        <div className="glass-panel" style={{
            aspectRatio: '1',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            overflowY: 'auto'
        }}>
            <div style={{ fontSize: '0.8rem', textAlign: 'center', opacity: 0.7 }}>Plant Seed</div>
            <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr' }}>
                {SEEDS.map(seed => (
                    <button
                        key={seed.id}
                        onClick={() => handlePlant(seed.id)}
                        disabled={state.resources.spores < seed.cost}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            cursor: state.resources.spores >= seed.cost ? 'pointer' : 'not-allowed',
                            opacity: state.resources.spores >= seed.cost ? 1 : 0.5
                        }}
                    >
                        <span style={{ color: seed.color, fontSize: '0.7rem' }}>{seed.name}</span>
                        <span style={{ fontSize: '0.7rem' }}>{seed.cost}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
