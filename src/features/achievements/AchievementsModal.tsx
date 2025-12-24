import { useGame } from '../../context/GameContext';
import { ACHIEVEMENTS } from '../../config/achievements';

interface AchievementsModalProps {
    onClose: () => void;
}

export function AchievementsModal({ onClose }: AchievementsModalProps) {
    const { state } = useGame();

    const unlockedCount = state.achievements.length;
    const totalCount = ACHIEVEMENTS.length;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-emerald-500/30 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] flex flex-col relative shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                >
                    ✕
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-emerald-400 mb-2">Achievements</h2>
                    <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden">
                        <div
                            className="bg-emerald-500 h-full transition-all duration-500"
                            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm text-zinc-400 mt-2 text-right">
                        {unlockedCount} / {totalCount} Unlocked
                    </p>
                </div>

                <div className="overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4 custom-scrollbar">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = state.achievements.includes(ach.id);
                        const isSecret = ach.secret && !isUnlocked;

                        return (
                            <div
                                key={ach.id}
                                className={`
                                    p-6 rounded-lg border transition-all duration-300 flex flex-col items-center text-center relative group
                                    ${isUnlocked
                                        ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                        : 'bg-zinc-800/50 border-zinc-700 opacity-70'}
                                `}
                            >
                                <div className={`text-4xl mb-3 transition-transform duration-300 ${isUnlocked ? 'scale-110' : 'grayscale opacity-50'}`}>
                                    {isSecret ? '🔒' : ach.icon}
                                </div>

                                <h3 className={`font-bold mb-1 ${isUnlocked ? 'text-emerald-300' : 'text-zinc-400'}`}>
                                    {ach.name}
                                </h3>

                                <p className="text-sm text-zinc-400 leading-tight">
                                    {isSecret ? "???" : ach.description}
                                </p>

                                {isUnlocked && (
                                    <div className="absolute top-2 right-2 text-emerald-400 text-xs font-bold border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-900/40">
                                        UNLOCKED
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
