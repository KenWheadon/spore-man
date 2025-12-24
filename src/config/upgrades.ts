export interface UpgradeConfig {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    costMultiplier: number;
    effectType: 'click_power' | 'auto_spores';
    effectValue: number;
}

export const UPGRADES: UpgradeConfig[] = [
    {
        id: 'sharper_spores',
        name: 'Sharper Spores',
        description: '+1 Spore per click',
        baseCost: 15,
        costMultiplier: 1.8,
        effectType: 'click_power',
        effectValue: 1
    },
    {
        id: 'mycelial_network',
        name: 'Mycelial Network',
        description: '+1 Spore per second',
        baseCost: 50,
        costMultiplier: 1.5,
        effectType: 'auto_spores',
        effectValue: 1
    },
    {
        id: 'dense_clusters',
        name: 'Dense Clusters',
        description: '+5 Spores per click',
        baseCost: 250,
        costMultiplier: 2.0,
        effectType: 'click_power',
        effectValue: 5
    },
    {
        id: 'fungal_growth',
        name: 'Fungal Growth',
        description: '+10 Spores per second',
        baseCost: 500,
        costMultiplier: 1.6,
        effectType: 'auto_spores',
        effectValue: 10
    }
];
