import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import mushroomIcon from '../../assets/mushroom.png';
import { UpgradeList } from '../../components/UpgradeList';

export function ClickerMode() {
    const { state, dispatch, stats } = useGame();
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [rotation, setRotation] = useState(0);

    const randomizePosition = () => {
        const top = 10 + Math.random() * 80;
        const left = 10 + Math.random() * 80;
        const rot = -15 + Math.random() * 30;
        setPosition({ top: `${top}%`, left: `${left}%` });
        setRotation(rot);
    };

    const handleClick = () => {
        dispatch({ type: 'CLICK_MUSHROOM' });
        randomizePosition();
    };

    const handleGoldenClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Don't trigger normal click
        dispatch({ type: 'CLICK_GOLDEN' });
    };

    // XP Progress
    const xpNeeded = state.clickLevel;
    const progress = Math.min(100, (state.clickXP / xpNeeded) * 100);

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '600px', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* Level & XP Bar */}
                <div style={{
                    width: '100%',
                    marginBottom: '2rem',
                    background: 'rgba(0,0,0,0.5)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--accent-tertiary)' }}>MUTATION LEVEL {state.clickLevel}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{state.clickXP} / {xpNeeded} XP</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'var(--accent-tertiary)',
                            transition: 'width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Leveling up increases Golden Mushroom spawn chance!
                    </div>
                </div>

                {/* Main Mushroom */}
                <div style={{ position: 'relative', width: '100%', flex: 1 }}>
                    <button
                        onClick={handleClick}
                        style={{
                            position: 'absolute',
                            top: position.top,
                            left: position.left,
                            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                            background: 'none',
                            border: 'none',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            cursor: 'pointer',
                            filter: 'drop-shadow(0 0 15px var(--accent-primary))',
                            zIndex: 1
                        }}
                    >
                        <img
                            src={mushroomIcon}
                            alt="Mushroom"
                            style={{
                                width: '128px',
                                height: '128px',
                                imageRendering: 'pixelated'
                            }}
                            draggable={false}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '110%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.8rem',
                            opacity: 0.8,
                            whiteSpace: 'nowrap'
                        }}>
                            +{stats.clickPower}
                        </div>
                    </button>

                    {/* GOLDEN MUSHROOM */}
                    {state.goldenShroom && state.goldenShroom.active && (
                        <button
                            onClick={handleGoldenClick}
                            style={{
                                position: 'absolute',
                                top: `${state.goldenShroom.y}%`,
                                left: `${state.goldenShroom.x}%`,
                                transform: 'translate(-50%, -50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                zIndex: 10,
                                animation: 'pulse 0.5s infinite alternate'
                            }}
                        >
                            <img
                                src={mushroomIcon}
                                alt="Golden Mushroom"
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    imageRendering: 'pixelated',
                                    filter: 'hue-rotate(45deg) brightness(2) drop-shadow(0 0 10px gold)'
                                }}
                                draggable={false}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '-30%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: 'gold',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                                textShadow: '0 0 5px black'
                            }}>
                                CLICK ME!
                            </div>
                        </button>
                    )}
                </div>
            </div>

            <UpgradeList />
        </div>
    );
}

export default ClickerMode;
