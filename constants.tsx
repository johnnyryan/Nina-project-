
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

export const COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Down', 
  'Dublin', 'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny', 'Laois', 
  'Leitrim', 'Limerick', 'Londonderry', 'Longford', 'Louth', 'Mayo', 'Meath', 
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Tyrone', 'Waterford', 
  'Westmeath', 'Wexford', 'Wicklow'
];

export const NEIGHBORHOODS = [
  'The Liberties, Dublin',
  'Dalkey, Dublin',
  'Galway City Centre',
  'Salthill, Galway',
  'Cork City Northside',
  'The Marina, Cork',
  'Limerick Medieval Quarter',
  'Killarney Town',
  'Tralee Town',
  'Letterkenny, Donegal',
  'Westport, Mayo',
  'Castlebar Town',
  'Dundalk Town Centre',
  'Drogheda, Louth',
  'Ennis Town',
  'Kilkenny City Centre',
  'Waterford Quay',
  'Sligo Town Centre',
  'The Bogside, Derry',
  'Belfast City Centre',
  'Ormeau Road, Belfast',
  'Enniskillen Town',
  'Athlone Town Centre',
  'Bray Seafront',
  'Greystones, Wicklow',
  'Enniskerry, Wicklow',
  'Mullingar Town Centre',
  'Tullamore, Offaly',
  'Naas Town Centre',
  'Maynooth, Kildare'
];

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
  // Rank Badges
  { id: 'rank1', name: '1st Place Ribbon', icon: '🎗️🥇', description: 'Top contributor in your neighborhood.', isRank: true },
  { id: 'rank2', name: '2nd Place Ribbon', icon: '🎗️🥈', description: 'Second highest contributor.', isRank: true },
  { id: 'rank3', name: '3rd Place Ribbon', icon: '🎗️🥉', description: 'Third highest contributor.', isRank: true },
  
  // Early Achievement
  { id: 'b1', name: 'Oak Planter', icon: '🌳', description: 'Planted your first native tree.' },
  { id: 'b2', name: 'Clean Coasts', icon: '🌊', description: 'Completed 5 rubbish collection actions.' },
  { id: 'b3', name: 'Wildlife Guardian', icon: '🦊', description: 'Helped local fauna three times.' },
  { id: 'b4', name: 'Community Pillar', icon: '🏛️', description: 'Verified 10 actions for neighbors.' },
  
  // Elite Milestone Badges
  { id: 'b5', name: 'Sustainability Sage', icon: '🧙‍♂️', description: 'Completed 50 environmental actions.' },
  { id: 'b6', name: 'The 100 Club', icon: '💯', description: 'Completed 100 environmental actions.' },
  { id: 'b7', name: 'Shamrock Tycoon', icon: '💎', description: 'Earned a total of 50,000 Shamrocks.' },
  { id: 'b8', name: 'Emerald Guardian', icon: '🛡️', description: 'Achieved Rank 1 for the first time.' },
  { id: 'b9', name: 'Keeper of the Lore', icon: '📜', description: 'Perfected every Irish Wildlife Game.' },
  { id: 'b_all_actions', name: 'Supreme Wildlife Guardian', icon: '🛡️🇮🇪', description: 'Master of all trades. Completed every type of environmental action on the list.' },

  // Longevity Badges (NEW)
  { id: 'b_year1', name: 'Year 1 Veteran', icon: '🥈🍃', description: 'Committed to Help Ireland for over a year.' },
  { id: 'b_year5', name: 'Emerald Elder', icon: '🥇🌿', description: '5 years of environmental stewardship.' },
  { id: 'b_year10', name: 'Ancient Oak', icon: '🌳✨', description: 'A decade of dedication to the Emerald Isle.' }
];

export const SHOP_ITEMS: ShopItem[] = [
  // Rank-locked Ribbon Avatars
  { id: 'av_rank1', name: '1st Place Ribbon Avatar', icon: '🎗️🥇', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_rank2', name: '2nd Place Ribbon Avatar', icon: '🎗️🥈', cost: 0, type: 'avatar', earnedOnly: true },
  { id: 'av_rank3', name: '3rd Place Ribbon Avatar', icon: '🎗️🥉', cost: 0, type: 'avatar', earnedOnly: true },
  
  // Poop & Nature Avatars (New Additions)
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

  // Tier 1: Common Avatars (300 - 600)
  { id: 'av_oak_leaf', name: 'Oak Leaf', icon: '🍃', cost: 300, type: 'avatar' },
  { id: 'av_primrose', name: 'Primrose', icon: '🌼', cost: 400, type: 'avatar' },
  { id: 'av_fox', name: 'Red Fox', icon: '🦊', cost: 500, type: 'avatar' },
  { id: 'av_squirrel', name: 'Red Squirrel', icon: '🐿️', cost: 600, type: 'avatar' },
  
  // Tier 2: Uncommon Avatars (750 - 1500)
  { id: 'av_hare', name: 'Irish Hare', icon: '🐇', cost: 750, type: 'avatar' },
  { id: 'av_puffin', name: 'Atlantic Puffin', icon: '🐧', cost: 850, type: 'avatar' },
  { id: 'av_otter', name: 'River Otter', icon: '🦦', cost: 950, type: 'avatar' },
  { id: 'av_eagle', name: 'Golden Eagle', icon: '🦅', cost: 1200, type: 'avatar' },
  { id: 'av_seal', name: 'Grey Seal', icon: '🦭', cost: 1500, type: 'avatar' },

  // Tier 3: Legendary Mythological Avatars (5000 - 25000)
  { id: 'av_lep', name: 'Leprechaun', icon: '🍀', cost: 5000, type: 'avatar' },
  { id: 'av_salmon', name: 'Salmon of Knowledge', icon: '🐟', cost: 7500, type: 'avatar' },
  { id: 'av_banshee', name: 'The Banshee', icon: '👰', cost: 10000, type: 'avatar' },
  { id: 'av_king', name: 'High King', icon: '👑', cost: 15000, type: 'avatar' },
  { id: 'av_queen', name: 'High Queen', icon: '👸', cost: 15000, type: 'avatar' },
  { id: 'av_celtic_cross', name: 'Celtic Cross', icon: '✝️', cost: 20000, type: 'avatar' },
  { id: 'av_claddagh', name: 'Claddagh Ring', icon: '💍', cost: 25000, type: 'avatar' },

  // NEW End-Game Avatars (75000 - 150000)
  { id: 'av_fionn', name: 'Fionn Mac Cumhaill', icon: '⚔️', cost: 75000, type: 'avatar' },
  { id: 'av_cu_chulainn', name: 'Cú Chulainn', icon: '🛡️', cost: 100000, type: 'avatar' },
  { id: 'av_emerald_dragon', name: 'Emerald Dragon', icon: '🐲', cost: 150000, type: 'avatar' },

  // Profile Themes
  { 
    id: 'th_default', 
    name: 'Emerald Isle', 
    icon: '☘️', 
    cost: 0, 
    type: 'theme',
    themeConfig: { bg: '#004d2c', accent: '#065f46' }
  },
  { 
    id: 'th_sunset', 
    name: 'Atlantic Sunset', 
    icon: '🌅', 
    cost: 1500, 
    type: 'theme',
    themeConfig: { bg: '#7c2d12', accent: '#9a3412' } 
  },
  { 
    id: 'th_mist', 
    name: 'Wicklow Mist', 
    icon: '🌫️', 
    cost: 2500, 
    type: 'theme',
    themeConfig: { bg: '#334155', accent: '#475569' } 
  },
  // Elite Themes
  { 
    id: 'th_gold', 
    name: 'Golden Gorse', 
    icon: '✨', 
    cost: 5000, 
    type: 'theme',
    themeConfig: { bg: '#854d0e', accent: '#a16207' } 
  },
  { 
    id: 'th_kells', 
    name: 'Book of Kells', 
    icon: '📜', 
    cost: 7500, 
    type: 'theme',
    themeConfig: { bg: '#422006', accent: '#b45309' } 
  },
  { 
    id: 'th_neon', 
    name: 'Cyber Dublin', 
    icon: '🌃', 
    cost: 10000, 
    type: 'theme',
    themeConfig: { bg: '#0f172a', accent: '#0891b2' } 
  },
  { 
    id: 'th_royal', 
    name: 'Royal Tara', 
    icon: '👑', 
    cost: 15000, 
    type: 'theme',
    themeConfig: { bg: '#4c1d95', accent: '#5b21b6' } 
  },
  { 
    id: 'th_aurora', 
    name: 'Northern Lights', 
    icon: '🌌', 
    cost: 50000, 
    type: 'theme',
    themeConfig: { bg: '#1e1b4b', accent: '#065f46' } 
  },
  // NEW Mythic Themes (100000+)
  { 
    id: 'th_tir_na_nog', 
    name: 'Tír na nÓg', 
    icon: '🌸', 
    cost: 100000, 
    type: 'theme',
    themeConfig: { bg: '#be185d', accent: '#db2777' } 
  },
  { 
    id: 'th_eternal_emerald', 
    name: 'Eternal Emerald', 
    icon: '💎', 
    cost: 250000, 
    type: 'theme',
    themeConfig: { bg: '#064e3b', accent: '#10b981' } 
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
    county: 'Dublin',
    neighborhood: 'The Liberties, Dublin',
    street: 'Francis St',
    communityGroups: ['The Liberties GAA'],
    bio: 'Dedicated to urban greening projects.',
    avatar: '👤',
    totalShamrocks: 0, 
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
    neighborhood: 'The Liberties, Dublin',
    street: 'Thomas St',
    communityGroups: ['St. Catherine’s Parish'],
    bio: 'Preserving our natural heritage for future generations.',
    avatar: '👤',
    totalShamrocks: 0, 
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
  { neighborhood: 'The Liberties, Dublin', county: 'Dublin', totalPoints: 125400, activeMembers: 142, rank: 1 },
  { neighborhood: 'Galway City Centre', county: 'Galway', totalPoints: 110200, activeMembers: 98, rank: 2 },
  { neighborhood: 'The Marina, Cork', county: 'Cork', totalPoints: 95000, activeMembers: 76, rank: 3 },
  { neighborhood: 'Dalkey, Dublin', county: 'Dublin', totalPoints: 88200, activeMembers: 64, rank: 4 },
  { neighborhood: 'Killarney Town', county: 'Kerry', totalPoints: 82300, activeMembers: 54, rank: 5 },
  { neighborhood: 'Letterkenny, Donegal', county: 'Donegal', totalPoints: 71000, activeMembers: 42, rank: 6 },
  { neighborhood: 'Westport, Mayo', county: 'Mayo', totalPoints: 65400, activeMembers: 39, rank: 7 },
  { neighborhood: 'Limerick Medieval Quarter', county: 'Limerick', totalPoints: 59000, activeMembers: 31, rank: 8 },
  { neighborhood: 'Kilkenny City Centre', county: 'Kilkenny', totalPoints: 52100, activeMembers: 28, rank: 9 },
  { neighborhood: 'Salthill, Galway', county: 'Galway', totalPoints: 48900, activeMembers: 25, rank: 10 }
];
