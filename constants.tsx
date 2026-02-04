
import { ActionType, RewardAction, UserProfile, LeaderboardEntry, Badge, ShopItem, ChatLeaderboardEntry } from './types';

export const COLORS = {
  emeraldDeep: '#004d2c',
  emeraldMid: '#065f46',
  emeraldLight: '#10b981',
  gold: '#d4af37',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  stone: '#4b5563',
  kellsGold: '#B8860B',
  neonBlue: '#00f2ff'
};

export const PATTERNS = {
  celtic: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0zm0 4c-14.359 0-26 11.641-26 26s11.641 26 26 26 26-11.641 26-26S44.359 4 30 4zm0 6c11.046 0 20 8.954 20 20s-8.954 20-20 20-20-8.954-20-20 8.954-20 20-20zm0 4c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 20 50 10 T 100 10' fill='none' stroke='white' stroke-opacity='0.15' stroke-width='2'/%3E%3C/svg%3E")`,
  shamrocks: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 18c2-2 5-2 5 2s-3 4-5 2c0 3 2 6-2 6s-2-3-2-6c-2 2-5 2-5-2s3-4 5-2c0-3-2-6 2-6s2 3 2 6z' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  mist: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='1' fill='white' fill-opacity='0.2'/%3E%3Ccircle cx='20' cy='30' r='0.5' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E")`,
  circuit: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 20h40M20 0v40' stroke='white' stroke-opacity='0.05'/%3E%3C/svg%3E")`,
  heather: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4z' fill='white' fill-opacity='0.08'/%3E%3C/svg%3E")`
};

export const COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Down', 
  'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny', 'Laois', 
  'Leitrim', 'Limerick', 'Londonderry', 'Longford', 'Louth', 'Mayo', 'Meath', 
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone', 'Waterford', 
  'Westmeath', 'Wexford', 'Wicklow'
];

export const GEOGRAPHY_DATA: Record<string, Record<string, string[]>> = {
  'Dublin': {
    'The Liberties': ['Francis St', 'Thomas St', 'Meath St', 'Vicar St', 'High St'],
    'Dalkey': ['Castle St', 'Railway Rd', 'Coliemore Rd', 'Vico Rd', 'Loreto Park'],
    'Rathmines': ['Rathmines Rd Upper', 'Rathmines Rd Lower', 'Leinster Rd', 'Charleville Rd'],
    'Ranelagh': ['Ranelagh Rd', 'Sandford Rd', 'Northbrook Rd', 'Dartmouth Square'],
    'Howth': ['Harbour Rd', 'Main St', 'Abbey St', 'Thormanby Rd'],
    'Tallaght': ['Belgard Rd', 'Greenhills Rd', 'Main St', 'Old Bawn Rd'],
  },
  'Cork': {
    'Cork City Centre': ['Grand Parade', 'Patrick St', 'Oliver Plunkett St', 'South Mall'],
    'Kinsale': ['Main St', 'Pearse St', 'Market Quay', 'The Glen'],
    'Cobh': ['West Beach', 'Casement Square', 'High Rd', 'Midleton St'],
    'Clonakilty': ['Main St', 'Astna Square', 'Casement St', 'Western Rd'],
  },
  'Galway': {
    'Galway City Centre': ['Shop St', 'Quay St', 'Eyre Square', 'High St', 'William St'],
    'Salthill': ['The Promenade', 'Upper Salthill Rd', 'Dalysfort Rd', 'Quincentennial Dr'],
    'Clifden': ['Main St', 'Market St', 'Bridge St', 'Church St'],
  }
};

export const COMMUNITY_GROUP_TYPES = [
  'GAA Club', 'Soccer Club', 'Rugby Club', 'Primary School', 
  'Secondary School', 'Parish Church', 'Tidy Towns', 
  'Community Centre', 'Historical Society', 'Sailing Club'
];

export const BADGES: Badge[] = [
  { id: 'rank1', name: '1st Place Ribbon', icon: '🎗️🥇', description: 'Top contributor in your neighborhood.', isRank: true },
  { id: 'rank2', name: '2nd Place Ribbon', icon: '🎗️🥈', description: 'Second highest contributor.', isRank: true },
  { id: 'rank3', name: '3rd Place Ribbon', icon: '🎗️🥉', description: 'Third highest contributor.', isRank: true },
  { id: 'b1', name: 'Oak Planter', icon: '🌳', description: 'Planted your first native tree.' },
  { id: 'b2', name: 'Clean Coasts', icon: '🌊', description: 'Completed 5 rubbish collection actions.' },
  { id: 'b3', name: 'Wildlife Guardian', icon: '🦊', description: 'Helped local fauna three times.' },
  { id: 'b5', name: 'Sustainability Sage', icon: '🧙‍♂️', description: 'Completed 50 environmental actions.' },
  { id: 'b7', name: 'Shamrock Tycoon', icon: '💎', description: 'Earned a total of 50,000 Shamrocks.' }
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'av_rank1', name: '1st Place Ribbon Avatar', icon: '🎗️🥇', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_rank2', name: '2nd Place Ribbon Avatar', icon: '🎗️🥈', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_rank3', name: '3rd Place Ribbon Avatar', icon: '🎗️🥉', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_fox', name: 'Red Fox', icon: '🦊', cost: 500, type: 'avatar' },
  { id: 'av_squirrel', name: 'Red Squirrel', icon: '🐿️', cost: 600, type: 'avatar' },
  { id: 'av_hare', name: 'Irish Hare', icon: '🐇', cost: 750, type: 'avatar' },
  { id: 'av_puffin', name: 'Atlantic Puffin', icon: '🐧', cost: 850, type: 'avatar' },
  { id: 'av_otter', name: 'River Otter', icon: '🦦', cost: 950, type: 'avatar' },
  { id: 'av_eagle', name: 'Golden Eagle', icon: '🦅', cost: 1200, type: 'avatar' },
  { id: 'av_seal', name: 'Grey Seal', icon: '🦭', cost: 1500, type: 'avatar' },
  { id: 'av_lep', name: 'Leprechaun', icon: '🍀', cost: 5000, type: 'avatar' },
  { id: 'av_salmon', name: 'Salmon of Knowledge', icon: '🐟', cost: 7500, type: 'avatar' },
  { id: 'av_king', name: 'High King', icon: '👑', cost: 15000, type: 'avatar' },
  { 
    id: 'th_default', 
    name: 'Emerald Isle', 
    icon: '☘️', 
    cost: 0, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)', 
      accent: '#059669',
      pattern: PATTERNS.shamrocks
    }
  },
  { 
    id: 'th_atlantic', 
    name: 'Wild Atlantic Way', 
    icon: '🌊', 
    cost: 1500, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)', 
      accent: '#0ea5e9',
      pattern: PATTERNS.waves
    } 
  }
];

export const REWARD_ACTIONS: RewardAction[] = [
  { id: ActionType.PICK_UP_RUBBISH, title: 'Rubbish Collection', description: 'Keep our shared spaces clean.', points: 100, icon: '🗑️' },
  { id: ActionType.PLANT_A_TREE, title: 'Plant a Native Tree', description: 'Support biodiversity.', points: 1000, icon: '🌳' },
  { id: ActionType.PLANT_A_GARDEN, title: 'Plant a Garden', description: 'Create a green space.', points: 350, icon: '🌻' },
  { id: ActionType.SAVE_WATER, title: 'Water Conservation', description: 'Reduce water waste.', points: 50, icon: '💧' },
  { id: ActionType.RECYCLE, title: 'Proper Recycling', description: 'Sort household waste.', points: 200, icon: '♻️' },
  { id: ActionType.HELP_ANIMALS, title: 'Help Animals', description: 'Step in to help wildlife.', points: 1500, icon: '🦌' },
  { id: ActionType.DONATE_VOLUNTEER, title: 'Volunteering', description: 'Donate time to charities.', points: 10, icon: '🤝', unit: 'minutes' }
];

export const MOCK_USERS: UserProfile[] = [];
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];
export const MOCK_CHAT_LEADERBOARD: ChatLeaderboardEntry[] = [];
