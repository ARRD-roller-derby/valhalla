export type Booster = {
  title: string
  description: string
  cost: number
  common: number
  rare: number
  epic: number
  legendary: number
  key: 'classic' | 'rare' | 'epic' | 'legendary'
}

export const boosters: Booster[] = [
  {
    title: 'Booster Classique',
    description: 'Contient 5 cartes communes. Peut contenir une carte rare',
    cost: 15,
    key: 'classic',
    common: 5,
    rare: 0,
    epic: 0,
    legendary: 0,
  },

  {
    title: 'Booster Rare',
    description: 'Contient 4 cartes communes, 1 rare. Peut contenir une carte épique',
    cost: 100,
    common: 4,
    rare: 1,
    epic: 0,
    legendary: 0,
    key: 'rare',
  },

  {
    title: 'Booster Épique',
    description: 'Contient 3 cartes commune, 1 carte rare et une épique. Peut contenir une carte légendaire',
    cost: 500,
    common: 3,
    rare: 1,
    epic: 1,
    legendary: 0,
    key: 'epic',
  },
]
