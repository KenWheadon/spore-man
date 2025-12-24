export interface MissionConfig {
    id: string;
    name: string;
    description: string;
    duration: number; // Seconds
    risk: number; // 0-1 probability of losing warrior
    cost: number; // Warriors needed
    rewards: {
        resource: 'spores' | 'mycelium';
        amount: number;
    }[];
}

export const MISSIONS: MissionConfig[] = [
    {
        id: 'scout_surroundings',
        name: 'Scout Surroundings',
        description: 'Send a warrior to explore nearby caves.',
        duration: 5,
        risk: 0.1,
        cost: 1,
        rewards: [{ resource: 'spores', amount: 50 }]
    },
    {
        id: 'gather_nutrients',
        name: 'Gather Nutrients',
        description: 'Collect nutrient-rich soil for the garden.',
        duration: 15,
        risk: 0.2,
        cost: 2,
        rewards: [{ resource: 'mycelium', amount: 10 }]
    },
    {
        id: 'raid_termite_mound',
        name: 'Raid Termite Mound',
        description: 'Attack a termite colony for massive resources.',
        duration: 30,
        risk: 0.5,
        cost: 5,
        rewards: [{ resource: 'spores', amount: 500 }, { resource: 'mycelium', amount: 50 }]
    }
];
