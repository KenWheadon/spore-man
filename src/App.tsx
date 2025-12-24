import React from 'react';
import { useGame } from './context/GameContext';
import { useGameLoop } from './hooks/useGameLoop';
import { useMissionResolver } from './hooks/useMissionResolver';
import './styles/global.css';

// Modes
import ClickerMode from './features/clicker/ClickerMode';
import GardenMode from './features/garden/GardenMode';
import MissionMode from './features/missions/MissionMode';
// import HiveMode from './features/hive/HiveMode'; // TODO: Phase 4

function App() {
  // Initialize Game Loops
  useGameLoop();
  useMissionResolver();

  const { state, dispatch } = useGame();

  return (
    <div className="app-container" style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(circle at 50% 50%, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
      display: 'grid',
      gridTemplateRows: '60px 1fr 80px', // Header, Main, Footer (Nav)
      color: 'var(--text-primary)'
    }}>
      {/* Header / Resource Bar */}
      <header className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        margin: '10px 20px 0 20px',
        borderRadius: '12px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>
          FUNGAL EVOLUTION
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>Spores: <span style={{ color: 'var(--accent-primary)' }}>{Math.floor(state.resources.spores)}</span></div>
          <div>Mycelium: <span style={{ color: 'var(--accent-secondary)' }}>{Math.floor(state.resources.mycelium)}</span></div>
          <div>Warriors: <span style={{ color: 'var(--text-muted)' }}>{Math.floor(state.resources.warriors)}</span></div>
        </div>
      </header>

      {/* Main Game Area */}
      <main style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {state.currentMode === 'clicker' && <ClickerMode />}
        {state.currentMode === 'garden' && <GardenMode />}
        {state.currentMode === 'missions' && <MissionMode />}
        {/* {state.currentMode === 'hive' && <HiveMode />} */}
      </main>

      {/* Navigation Footer */}
      <footer className="glass-panel" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        margin: '0 20px 10px 20px',
        borderRadius: '12px'
      }}>
        <button
          className="btn-primary"
          style={{ background: state.currentMode === 'clicker' ? 'var(--accent-primary)' : 'transparent', color: state.currentMode === 'clicker' ? 'var(--bg-primary)' : 'var(--text-primary)', border: '1px solid var(--accent-primary)' }}
          onClick={() => dispatch({ type: 'SWITCH_MODE', payload: 'clicker' })}
        >
          Spore Cluster
        </button>

        {state.unlockedModes.includes('garden') && (
          <button
            className="btn-primary"
            style={{ background: state.currentMode === 'garden' ? 'var(--accent-secondary)' : 'transparent', color: state.currentMode === 'garden' ? 'var(--bg-primary)' : 'var(--text-primary)', border: '1px solid var(--accent-secondary)' }}
            onClick={() => dispatch({ type: 'SWITCH_MODE', payload: 'garden' })}
          >
            Mycelium Garden
          </button>
        )}

        {state.unlockedModes.includes('missions') && (
          <button
            className="btn-primary"
            style={{ background: state.currentMode === 'missions' ? 'var(--accent-tertiary)' : 'transparent', color: state.currentMode === 'missions' ? 'var(--bg-primary)' : 'var(--text-primary)', border: '1px solid var(--accent-tertiary)' }}
            onClick={() => dispatch({ type: 'SWITCH_MODE', payload: 'missions' })}
          >
            Warrior Missions
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
