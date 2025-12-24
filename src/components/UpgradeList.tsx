import React from 'react';
import { useGame } from '../context/GameContext';
import { UPGRADES } from '../config/upgrades';

export function UpgradeList() {
    const { state, dispatch } = useGame();

    const handleBuy = (upgradeId: string, baseCost: number, multiplier: number, currentLevel: number) => {
        const cost = Math.floor(baseCost * Math.pow(multiplier, currentLevel));
        if (state.resources.spores >= cost) {
            dispatch({ type: 'BUY_UPGRADE', payload: { upgradeId, cost } });
        }
    };

    return (
        <div className="glass-panel" style={{
            width: '300px',
            padding: '1.5rem',
            marginLeft: '2rem',
            maxHeight: '600px',
            overflowY: 'auto'
        }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>Mutations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {UPGRADES.map(upgrade => {
                    const currentLevel = state.upgrades[upgrade.id] || 0;
                    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
                    const canAfford = state.resources.spores >= cost;

                    return (
                        <div key={upgrade.id} style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 'bold' }}>{upgrade.name}</span>
                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Lvl {currentLevel}</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                                {upgrade.description}
                            </p>
                            <button
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    fontSize: '0.8rem',
                                    padding: '0.5rem',
                                    opacity: canAfford ? 1 : 0.5,
                                    cursor: canAfford ? 'pointer' : 'not-allowed',
                                    border: canAfford ? 'none' : '1px solid var(--border-color)',
                                    background: canAfford ? 'var(--accent-primary)' : 'transparent',
                                    color: canAfford ? 'var(--bg-primary)' : 'var(--text-muted)'
                                }}
                                onClick={() => handleBuy(upgrade.id, upgrade.baseCost, upgrade.costMultiplier, currentLevel)}
                                disabled={!canAfford}
                            >
                                Evolve ({cost} Spores)
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
