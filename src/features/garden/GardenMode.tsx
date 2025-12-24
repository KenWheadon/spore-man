import React from 'react';
import { useGame } from '../../context/GameContext';
import { GardenPlot } from './GardenPlot';

export function GardenMode() {
    const { state } = useGame();

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--accent-secondary)' }}>Mycelium Garden</h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                width: '600px',
                maxWidth: '90vw'
            }}>
                {state.plots.map((plot) => (
                    <GardenPlot key={plot.id} plot={plot} />
                ))}
            </div>
        </div>
    );
}

export default GardenMode;
