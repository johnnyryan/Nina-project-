
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
    'Cork City Centre': ['Grand Parade', 'Patrick St', 'Open Mall', 'South Mall'],
    'Kinsale': ['Main St', 'Pearse St', 'Market Quay', 'The Glen'],
    'Cobh': ['West Beach', 'Casement Square', 'High Rd', 'Midleton St'],
    'Clonakilty': ['Main St', 'Astna Square', 'Casement St', 'Western Rd'],
  },
  'Galway': {
    'Galway City Centre': ['Shop St', 'Quay St', 'Eyre Square', 'High St', 'William St'],
    'Salthill': ['The Promenade', 'Upper Salthill Rd', 'Dalysfort Rd', 'Quincentennial Dr'],
    'Clifden': ['Main St', 'Market St', 'Bridge St', 'Church St'],
  },
  'Limerick': {
    'Medieval Quarter': ['Nicholas St', 'Mary St', 'Castle St', 'High St'],
    'Adare': ['Main St', 'Kildare Rd', 'Station Rd', 'Blackabbey Rd'],
  },
  'Kerry': {
    'Killarney': ['Main St', 'High St', 'New St', 'Muckross Rd'],
    'Dingle': ['Main St', 'Green St', 'The Wood', 'Grey\'s Lane'],
  },
  'Donegal': {
    'Letterkenny': ['Main St', 'Port Rd', 'High Rd', 'Pearse Rd'],
    'Bundoran': ['Main St', 'Sea Rd', 'Station Rd', 'West End'],
  },
  'Waterford': {
    'Waterford Quay': ['The Quay', 'Barronstrand St', 'Broad St', 'George\'s St'],
    'Tramore': ['Main St', 'Strand Rd', 'Priory Village', 'Sweetbriar'],
  }
};

export const COMMUNITY_GROUP_TYPES = [
  'GAA Club',
  'Soccer Club',
  'Rugby Club',
  'Primary School',
  'Secondary School',
  'Parish Church',
  'Tidy Towns',
  'Community Centre',
  'Historical Society',
  'Sailing Club'
];

export const BADGES: Badge[] = [
  { id: 'rank1', name: '1st Place Ribbon', icon: '🎗️🥇', description: 'Top contributor in your neighborhood.', isRank: true },
  { id: 'rank2', name: '2nd Place Ribbon', icon: '🎗️🥈', description: 'Second highest contributor.', isRank: true },
  { id: 'rank3', name: '3rd Place Ribbon', icon: '🎗️🥉', description: 'Third highest contributor.', isRank: true },
  { id: 'b1', name: 'Oak Planter', icon: '🌳', description: 'Planted your first native tree.' },
  { id: 'b2', name: 'Clean Coasts', icon: '🌊', description: 'Completed 5 rubbish collection actions.' },
  { id: 'b3', name: 'Wildlife Guardian', icon: '🦊', description: 'Helped local fauna three times.' },
  { id: 'b4', name: 'Community Pillar', icon: '🏛️', description: 'Verified 10 actions for neighbors.' },
  { id: 'b5', name: 'Sustainability Sage', icon: '🧙‍♂️', description: 'Completed 50 environmental actions.' },
  { id: 'b6', name: 'The 100 Club', icon: '💯', description: 'Completed 100 environmental actions.' },
  { id: 'b7', name: 'Shamrock Tycoon', icon: '💎', description: 'Earned a total of 50,000 Shamrocks.' },
  { id: 'b8', name: 'Emerald Guardian', icon: '🛡️', description: 'Achieved Rank 1 for the first time.' },
  { id: 'b9', name: 'Keeper of the Lore', icon: '📜', description: 'Perfected every Irish Wildlife Game.' },
  { id: 'b_all_actions', name: 'Supreme Wildlife Guardian', icon: '🛡️🇮🇪', description: 'Master of all trades. Completed every type of environmental action on the list.' },
  { id: 'b_year1', name: 'Year 1 Veteran', icon: '🥈🍃', description: 'Committed to Help Ireland for over a year.' },
  { id: 'b_year5', name: 'Emerald Elder', icon: '🥇🌿', description: '5 years of environmental stewardship.' },
  { id: 'b_year10', name: 'Ancient Oak', icon: '🌳✨', description: 'A decade of dedication to the Emerald Isle.' }
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'av_rank1', name: '1st Place Ribbon Avatar', icon: '🎗️🥇', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_rank2', name: '2nd Place Ribbon Avatar', icon: '🎗️🥈', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_rank3', name: '3rd Place Ribbon Avatar', icon: '🎗️🥉', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_poop', name: 'Lucky Fertilizer', icon: '💩', cost: 100, type: 'avatar' },
  { id: 'av_flower_w', name: 'Wilted Flower', icon: '🥀', cost: 150, type: 'avatar' },
  { id: 'av_leaf_f', name: 'Fallen Leaf', icon: '🍂', cost: 200, type: 'avatar' },
  { id: 'av_leaf_m', name: 'Maple Leaf', icon: '🍁', cost: 250, type: 'avatar' },
  { id: 'av_mushroom', name: 'Wild Mushroom', icon: '🍄', cost: 300, type: 'avatar' },
  { id: 'av_cactus', name: 'Wild Cactus', icon: '🌵', cost: 350, type: 'avatar' },
  { id: 'av_palm', name: 'Island Palm', icon: '🌴', cost: 400, type: 'avatar' },
  { id: 'av_evergreen', name: 'Evergreen Pine', icon: '🌲', cost: 450, type: 'avatar' },
  { id: 'av_deciduous', name: 'Ancient Oak', icon: '🌳', cost: 500, type: 'avatar' },
  { id: 'av_bamboo', name: 'Lucky Bamboo', icon: '🎋', cost: 550, type: 'avatar' },
  { id: 'av_potted', name: 'Potted Ivy', icon: '🪴', cost: 600, type: 'avatar' },
  { id: 'av_shell', name: 'Coastal Shell', icon: '🐚', cost: 650, type: 'avatar' },
  { id: 'av_coral', name: 'Irish Coral', icon: '🪸', cost: 700, type: 'avatar' },
  { id: 'av_rock', name: 'Stone Circle Rock', icon: '🪨', cost: 750, type: 'avatar' },
  { id: 'av_mountain', name: 'Slieve Donard', icon: '🏔️', cost: 800, type: 'avatar' },
  { id: 'av_wave', name: 'Atlantic Wave', icon: '🌊', cost: 850, type: 'avatar' },
  { id: 'av_volcano', name: 'Dormant Volcano', icon: '🌋', cost: 900, type: 'avatar' },
  { id: 'av_sun', name: 'Rare Irish Sun', icon: '☀️', cost: 1000, type: 'avatar' },
  { id: 'av_rainbow', name: 'Bog Rainbow', icon: '🌈', cost: 1200, type: 'avatar' },
  { id: 'av_storm', name: 'Atlantic Gale', icon: '⛈️', cost: 1300, type: 'avatar' },
  { id: 'av_snowflake', name: 'Winter Frost', icon: '❄️', cost: 1400, type: 'avatar' },
  { id: 'av_fire', name: 'Solstice Fire', icon: '🔥', cost: 1500, type: 'avatar' },
  { id: 'av_oak_leaf', name: 'Oak Leaf', icon: '🍃', cost: 300, type: 'avatar' },
  { id: 'av_primrose', name: 'Primrose', icon: '🌼', cost: 400, type: 'avatar' },
  { id: 'av_fox', name: 'Red Fox', icon: '🦊', cost: 500, type: 'avatar' },
  { id: 'av_squirrel', name: 'Red Squirrel', icon: '🐿️', cost: 600, type: 'avatar' },
  { id: 'av_hare', name: 'Irish Hare', icon: '🐇', cost: 750, type: 'avatar' },
  { id: 'av_puffin', name: 'Atlantic Puffin', icon: '🐧', cost: 850, type: 'avatar' },
  { id: 'av_otter', name: 'River Otter', icon: '🦦', cost: 950, type: 'avatar' },
  { id: 'av_eagle', name: 'Golden Eagle', icon: '🦅', cost: 1200, type: 'avatar' },
  { id: 'av_seal', name: 'Grey Seal', icon: '🦭', cost: 1500, type: 'avatar' },
  { id: 'av_lep', name: 'Leprechaun', icon: '🍀', cost: 5000, type: 'avatar' },
  { id: 'av_salmon', name: 'Salmon of Knowledge', icon: '🐟', cost: 7500, type: 'avatar' },
  { id: 'av_banshee', name: 'The Banshee', icon: '👰', cost: 10000, type: 'avatar' },
  { id: 'av_king', name: 'High King', icon: '👑', cost: 15000, type: 'avatar' },
  { id: 'av_queen', name: 'High Queen', icon: '👸', cost: 15000, type: 'avatar' },
  { id: 'av_celtic_cross', name: 'Celtic Cross', icon: '✝️', cost: 20000, type: 'avatar' },
  { id: 'av_claddagh', name: 'Claddagh Ring', icon: '💍', cost: 25000, type: 'avatar' },
  { id: 'av_fionn', name: 'Fionn Mac Cumhaill', icon: '⚔️', cost: 75000, type: 'avatar' },
  { id: 'av_cu_chulainn', name: 'Cú Chulainn', icon: '🛡️', cost: 100000, type: 'avatar' },
  { id: 'av_emerald_dragon', name: 'Emerald Dragon', icon: '🐲', cost: 150000, type: 'avatar' },
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
  },
  { 
    id: 'th_mist', 
    name: 'Wicklow Mist', 
    icon: '🌫️', 
    cost: 2500, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', 
      accent: '#64748b',
      pattern: PATTERNS.mist
    } 
  },
  { 
    id: 'th_heather', 
    name: 'Bog Heather', 
    icon: '🌸', 
    cost: 5000, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #701a75 0%, #4a044e 100%)', 
      accent: '#d946ef',
      pattern: PATTERNS.heather
    } 
  },
  { 
    id: 'th_kells', 
    name: 'Book of Kells', 
    icon: '📜', 
    cost: 7500, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)', 
      accent: '#d97706',
      pattern: PATTERNS.celtic
    } 
  },
  { 
    id: 'th_neon', 
    name: 'Cyber Dublin', 
    icon: '🌃', 
    cost: 10000, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #1e1b4b 0%, #020617 100%)', 
      accent: '#06b6d4',
      pattern: PATTERNS.circuit
    } 
  },
  { 
    id: 'th_burren', 
    name: 'The Burren', 
    icon: '🪨', 
    cost: 15000, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #57534e 0%, #292524 100%)', 
      accent: '#78716c',
      pattern: PATTERNS.mist
    } 
  },
  { 
    id: 'th_aurora', 
    name: 'Northern Lights', 
    icon: '🌌', 
    cost: 50000, 
    type: 'theme',
    themeConfig: { 
      bg: 'linear-gradient(135deg, #064e3b 0%, #1e1b4b 100%)', 
      accent: '#10b981',
      pattern: PATTERNS.mist
    } 
  }
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
    id: ActionType.PLANT_A_GARDEN,
    title: 'Plant a Garden',
    description: 'Create a green space or community garden plot.',
    points: 350,
    icon: '🌻'
  },
  {
    id: ActionType.SAVE_WATER,
    title: 'Water Conservation',
    description: 'Reduce water waste through conscious usage.',
    points: 50,
    icon: '💧'
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
    title: 'Help Animals in Trouble',
    description: 'If you see an animal in trouble, step in to help!',
    points: 1500,
    icon: '🦌'
  },
  {
    id: ActionType.DONATE_VOLUNTEER,
    title: 'Charitable Contribution',
    description: 'Volunteer time or donate to Irish charities (10 pts per 20 mins).',
    points: 10,
    icon: '🤝',
    unit: 'minutes'
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Patrick O’Malley',
    county: 'Dublin',
    neighborhood: 'The Liberties',
    street: 'Francis St',
    communityGroups: ['The Liberties GAA'],
    bio: 'Dedicated to urban greening projects.',
    avatar: '👤',
    totalShamrocks: 0, // Mock users start with zero shamrock points
    goldenShamrocks: 0,
    isMaster: false,
    isCaptain: false,
    isAssistantCaptain: false,
    completedActions: 0,
    completedActionTypes: [],
    joinedDate: '2023-05-12T10:00:00.000Z',
    badges: [], 
    unlockedAvatars: ['👤'],
    unlockedThemes: ['th_default'],
    rank: 0
  },
  {
    id: '2',
    name: 'Siobhán Murphy',
    county: 'Dublin',
    neighborhood: 'The Liberties',
    street: 'Thomas St',
    communityGroups: ['St. Catherine’s Parish'],
    bio: 'Preserving our natural heritage for future generations.',
    avatar: '👤',
    totalShamrocks: 0, // Mock users start with zero shamrock points
    goldenShamrocks: 0,
    isMaster: false,
    isCaptain: false,
    isAssistantCaptain: false,
    completedActions: 0,
    completedActionTypes: [],
    joinedDate: '2023-08-20T10:00:00.000Z',
    badges: [], 
    unlockedAvatars: ['👤'],
    unlockedThemes: ['th_default'],
    rank: 0
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Patrick O’Malley', points: 0, county: 'Dublin', avatar: '👤' },
  { id: '2', name: 'Siobhán Murphy', points: 0, county: 'Dublin', avatar: '👤' },
  { id: '3', name: 'Cillian O’Sullivan', points: 0, county: 'Galway', avatar: '👤' },
  { id: '4', name: 'Aoife Kelly', points: 0, county: 'Cork', avatar: '👤' },
  { id: '5', name: 'Liam Byrne', points: 0, county: 'Dublin', avatar: '👤' },
  { id: '6', name: 'Eoin Gallagher', points: 0, county: 'Galway', avatar: '👤' }
];

export const MOCK_CHAT_LEADERBOARD: ChatLeaderboardEntry[] = [
  { neighborhood: 'The Liberties', county: 'Dublin', totalPoints: 125400, activeMembers: 142, rank: 1 },
  { neighborhood: 'Galway City Centre', county: 'Galway', totalPoints: 110200, activeMembers: 98, rank: 2 },
  { neighborhood: 'The Marina', county: 'Cork', totalPoints: 95000, activeMembers: 76, rank: 3 },
  { neighborhood: 'Dalkey', county: 'Dublin', totalPoints: 88200, activeMembers: 64, rank: 4 },
  { neighborhood: 'Killarney', county: 'Kerry', totalPoints: 82300, activeMembers: 54, rank: 5 },
  { neighborhood: 'Letterkenny', county: 'Donegal', totalPoints: 71000, activeMembers: 42, rank: 6 },
  { neighborhood: 'Westport', county: 'Mayo', totalPoints: 65400, activeMembers: 39, rank: 7 },
  { neighborhood: 'Limerick Medieval Quarter', county: 'Limerick', totalPoints: 59000, activeMembers: 31, rank: 8 },
  { neighborhood: 'Kilkenny City Centre', county: 'Kilkenny', totalPoints: 52100, activeMembers: 28, rank: 9 },
  { neighborhood: 'Salthill', county: 'Galway', totalPoints: 48900, activeMembers: 25, rank: 10 }
];
