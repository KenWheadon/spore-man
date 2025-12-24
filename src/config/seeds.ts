export interface SeedConfig {
    id: string;
    name: string;
    cost: number;
    growthTime: number; // Seconds
    warriorYield: number;
    tier: number;
    color: string;
}

export const SEEDS: SeedConfig[] = [
    {
        id: 'basic_spore',
        name: 'Basic Spore',
        cost: 50,
        growthTime: 10,
        warriorYield: 1,
        tier: 1,
        color: '#a3ff47' // Green
    },
    {
        id: 'poison_cap',
        name: 'Poison Cap',
        cost: 200,
        growthTime: 30,
        warriorYield: 3,
        tier: 2,
        color: '#9d4edd' // Purple
    },
    {
        id: 'glow_shroom',
        name: 'Glow Shroom',
        cost: 1000,
        growthTime: 60,
        warriorYield: 8,
        tier: 3,
        color: '#00b4d8' // Blue
    }
];
