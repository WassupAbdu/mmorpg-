import { create } from 'zustand';
import { Achievement, UserAchievement } from '../types/multiplayer.types';

interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  recentUnlock: Achievement | null;
  
  // Actions
  setAchievements: (achievements: Achievement[]) => void;
  setUserAchievements: (userAchievements: UserAchievement[]) => void;
  updateProgress: (achievementId: string, progress: number) => void;
  unlockAchievement: (achievementId: string) => void;
  setRecentUnlock: (achievement: Achievement | null) => void;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  userAchievements: [],
  recentUnlock: null,
  
  setAchievements: (achievements: Achievement[]) => {
    set({ achievements });
  },
  
  setUserAchievements: (userAchievements: UserAchievement[]) => {
    set({ userAchievements });
  },
  
  updateProgress: (achievementId: string, progress: number) => {
    const achievement = get().achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    const userAch = get().userAchievements.find(ua => ua.achievementId === achievementId);
    
    if (userAch) {
      // Update existing
      set(state => ({
        userAchievements: state.userAchievements.map(ua =>
          ua.achievementId === achievementId
            ? { ...ua, progress }
            : ua
        ),
      }));
    } else {
      // Create new
      set(state => ({
        userAchievements: [
          ...state.userAchievements,
          {
            achievementId,
            progress,
            completed: false,
          },
        ],
      }));
    }
    
    // Check if completed
    if (progress >= achievement.criteria.required) {
      get().unlockAchievement(achievementId);
    }
  },
  
  unlockAchievement: (achievementId: string) => {
    const achievement = get().achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    set(state => ({
      userAchievements: state.userAchievements.map(ua =>
        ua.achievementId === achievementId
          ? { ...ua, completed: true, completedAt: Date.now() }
          : ua
      ),
      recentUnlock: achievement,
    }));
    
    // Clear recent unlock after 5 seconds
    setTimeout(() => {
      set({ recentUnlock: null });
    }, 5000);
  },
  
  setRecentUnlock: (achievement: Achievement | null) => {
    set({ recentUnlock: achievement });
  },
}));
