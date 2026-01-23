
import { ActionType, RewardAction, UserProfile, LeaderboardEntry, Badge, ShopItem } from './types';

export const COLORS = {
  emeraldDeep: '#004d2c',
  emeraldMid: '#065f46',
  emeraldLight: '#10b981',
  gold: '#d4af37',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  stone: '#4b5563'
};

export const NEIGHBORHOODS = [
  'The Liberties, Dublin',
  'Dalkey, Dublin',
  'Galway City Centre',
  'Cork City Northside',
  'Limerick Medieval Quarter',
  'Killarney Town'
];

export const BADGES: Badge[] = [
  { id: 'rank1', name: '1st Place Ribbon', icon: '🎗️🥇', description: 'Top contributor in your neighborhood.', isRank: true },
  { id: 'rank2', name: '2nd Place Ribbon', icon: '🎗️🥈', description: 'Second highest contributor.', isRank: true },
  { id: 'rank3', name: '3rd Place Ribbon', icon: '🎗️🥉', description: 'Third highest contributor.', isRank: true },
  { id: 'b1', name: 'Oak Planter', icon: '🌳', description: 'Planted your first native tree.' },
  { id: 'b2', name: 'Clean Coasts', icon: '🌊', description: 'Completed 5 rubbish collection actions.' },
  { id: 'b3', name: 'Wildlife Guardian', icon: '🦊', description: 'Helped local fauna three times.' },
  { id: 'b4', name: 'Community Pillar', icon: '🏛️', description: 'Verified 10 actions for neighbors.' }
];

export const SHOP_ITEMS: ShopItem[] = [
  // Achievement items (Non-purchasable)
  { id: 'rank1', name: 'Gold Ribbon', icon: '🥇', cost: 0, type: 'achievement', earnedOnly: true },
  { id: 'rank2', name: 'Silver Ribbon', icon: '🥈', cost: 0, type: 'achievement', earnedOnly: true },
  { id: 'rank3', name: 'Bronze Ribbon', icon: '🥉', cost: 0, type: 'achievement', earnedOnly: true },
  
  // Purchasable avatars
  { id: 'av1', name: 'Red Fox', icon: '🦊', cost: 500, type: 'avatar' },
  { id: 'av2', name: 'Golden Eagle', icon: '🦅', cost: 1000, type: 'avatar' },
  { id: 'av3', name: 'Irish Hare', icon: '🐇', cost: 750, type: 'avatar' },
  { id: 'av4', name: 'Red Deer', icon: '🦌', cost: 1500, type: 'avatar' },
  { id: 'th1', name: 'Gold Border', icon: '✨', cost: 2000, type: 'theme' }
];

export const REWARD_ACTIONS: RewardAction[] = [
  {
    id: ActionType.PICK_UP_RUBBISH,
    title: 'Rubbish Collection',
    description: 'Help keep our shared spaces clean and safe.',
    points: 100,
    icon: '🗑️'
  },
  {
    id: ActionType.PLANT_A_TREE,
    title: 'Plant a Native Tree',
    description: 'Support biodiversity by planting native species.',
    points: 1000,
    icon: '🌳'
  },
  {
    id: ActionType.RECYCLE,
    title: 'Proper Recycling',
    description: 'Sort household waste into the correct channels.',
    points: 200,
    icon: '♻️'
  },
  {
    id: ActionType.HELP_ANIMALS,
    title: 'Support Local Wildlife',
    description: 'Assist in the care of domestic or wild animals.',
    points: 200,
    icon: '🦌'
  },
  {
    id: ActionType.DONATE_VOLUNTEER,
    title: 'Charitable Contribution',
    description: 'Volunteer time or donate to Irish charities.',
    points: 1,
    icon: '🤝',
    unit: 'amount'
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Patrick O’Malley',
    neighborhood: 'The Liberties, Dublin',
    bio: 'Dedicated to urban greening projects.',
    avatar: '🦊',
    totalShamrocks: 15400,
    completedActions: 45,
    joinedDate: '2023-05-12',
    badges: ['b1', 'b2', 'rank1'],
    unlockedAvatars: ['👤', '🦊'],
    rank: 1
  },
  {
    id: '2',
    name: 'Siobhán Murphy',
    neighborhood: 'The Liberties, Dublin',
    bio: 'Preserving our natural heritage for future generations.',
    avatar: '🦅',
    totalShamrocks: 12100,
    completedActions: 32,
    joinedDate: '2023-08-20',
    badges: ['b1', 'b3', 'rank2'],
    unlockedAvatars: ['👤', '🦅'],
    rank: 2
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Patrick O’Malley', points: 15400, avatar: '🦊' },
  { id: '2', name: 'Siobhán Murphy', points: 12100, avatar: '🦅' },
  { id: '3', name: 'Cillian O’Sullivan', points: 9800, avatar: '👤' },
  { id: '4', name: 'Aoife Kelly', points: 8500, avatar: '👤' }
];
