
export enum ActionType {
  PICK_UP_RUBBISH = 'PICK_UP_RUBBISH',
  PLANT_A_TREE = 'PLANT_A_TREE',
  RECYCLE = 'RECYCLE',
  HELP_ANIMALS = 'HELP_ANIMALS',
  DONATE_VOLUNTEER = 'DONATE_VOLUNTEER',
  SAVE_WATER = 'SAVE_WATER'
}

export interface RewardAction {
  id: ActionType;
  title: string;
  description: string;
  points: number;
  icon: string;
  unit?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isRank?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  neighborhood: string;
  street?: string;
  communityGroups: string[];
  bio: string;
  avatar: string;
  totalShamrocks: number;
  completedActions: number;
  joinedDate: string;
  badges: string[]; // IDs of earned badges
  unlockedAvatars: string[];
  rank?: number; // 1, 2, or 3
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  roomType: 'neighborhood' | 'street' | 'group';
  roomName: string;
  attachment?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface GeminiVerificationResponse {
  verified: boolean;
  message: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  points: number;
  isCurrentUser?: boolean;
  avatar?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  type: 'avatar' | 'theme' | 'achievement';
  earnedOnly?: boolean;
}

export type AppView = 'home' | 'profile' | 'chat' | 'user-view' | 'games';
