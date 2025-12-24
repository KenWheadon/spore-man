export interface AchievementConfig {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji character
    secret: boolean;
    type: 'click_count' | 'resource_count' | 'upgrade_count' | 'mode_unlock';
    threshold: number;
    resource?: string;
    mode?: string;
}

export const ACHIEVEMENTS: AchievementConfig[] = [
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Click the mushroom 100 times',
        icon: '🌱',
        secret: false,
        type: 'click_count',
        threshold: 100
    },
    {
        id: 'dedicated_mycologist',
        name: 'Dedicated Mycologist',
        description: 'Click the mushroom 1,000 times',
        icon: '🍄',
        secret: false,
        type: 'click_count',
        threshold: 1000
    },
    {
        id: 'spore_hoarder',
        name: 'Spore Hoarder',
        description: 'Accumulate 1,000 Spores',
        icon: '🎒',
        secret: true,
        type: 'resource_count',
        threshold: 1000,
        resource: 'spores'
    },
    {
        id: 'green_thumb',
        name: 'Green Thumb',
        description: 'Unlock the Garden',
        icon: '🌿',
        secret: true,
        type: 'mode_unlock',
        threshold: 1,
        mode: 'garden'
    },
    {
        id: 'colony_builder',
        name: 'Colony Builder',
        description: 'Have 50 Warriors',
        icon: '⚔️',
        secret: true,
        type: 'resource_count',
        threshold: 50,
        resource: 'warriors'
    }
];
