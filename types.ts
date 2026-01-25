
export enum ActionType {
  PICK_UP_RUBBISH = 'PICK_UP_RUBBISH',
  PLANT_A_TREE = 'PLANT_A_TREE',
  PLANT_A_GARDEN = 'PLANT_A_GARDEN',
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
  county: string;
  neighborhood: string;
  street: string;
  communityGroups: string[];
  bio: string;
  avatar: string;
  activeTheme?: string; 
  totalShamrocks: number;
  goldenShamrocks: number; 
  isMaster: boolean; 
  isCaptain: boolean; 
  isAssistantCaptain: boolean;
  weeklyGoalSetAt?: string; 
  activeGoal?: string; 
  hasCaptainTickedGoal?: boolean;
  hasAssistantTickedGoal?: boolean;
  completedActions: number;
  completedActionTypes: ActionType[]; 
  joinedDate: string;
  badges: string[]; 
  unlockedAvatars: string[];
  unlockedThemes: string[];
  rank?: number; 
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  roomType: 'neighborhood' | 'street' | 'group' | 'leadership';
  roomName: string;
  isGoal?: boolean; 
  isCaptain?: boolean; 
  isAssistantCaptain?: boolean;
  verificationActionId?: ActionType; // If this message is a request for verification
  isVerified?: boolean; // If this request has been fulfilled
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
  county: string;
  isCurrentUser?: boolean;
  avatar?: string;
  isMaster?: boolean;
}

export interface ChatLeaderboardEntry {
  neighborhood: string;
  county: string;
  totalPoints: number;
  activeMembers: number;
  rank: number;
}

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  type: 'avatar' | 'theme' | 'achievement';
  earnedOnly?: boolean;
  themeConfig?: {
    bg: string;
    accent: string;
    pattern?: string;
  };
}

export type AppView = 'home' | 'profile' | 'chat' | 'user-view' | 'games' | 'about' | 'chat-leaderboard';
