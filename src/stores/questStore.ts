import { create } from 'zustand';
import { Quest, UserQuest } from '../types/multiplayer.types';

interface QuestState {
  availableQuests: Quest[];
  activeQuests: UserQuest[];
  completedQuests: string[];
  
  // Actions
  setAvailableQuests: (quests: Quest[]) => void;
  setActiveQuests: (quests: UserQuest[]) => void;
  acceptQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, objectiveIndex: number, progress: number) => void;
  completeQuest: (questId: string) => void;
  abandonQuest: (questId: string) => void;
}

export const useQuestStore = create<QuestState>((set, get) => ({
  availableQuests: [],
  activeQuests: [],
  completedQuests: [],
  
  setAvailableQuests: (quests: Quest[]) => {
    set({ availableQuests: quests });
  },
  
  setActiveQuests: (quests: UserQuest[]) => {
    set({ activeQuests: quests });
  },
  
  acceptQuest: (questId: string) => {
    const quest = get().availableQuests.find(q => q.id === questId);
    if (quest) {
      const userQuest: UserQuest = {
        questId,
        startedAt: Date.now(),
        objectives: quest.objectives.map(obj => ({
          type: obj.type,
          current: 0,
          required: obj.required,
        })),
        completed: false,
      };
      
      set(state => ({
        activeQuests: [...state.activeQuests, userQuest],
        availableQuests: state.availableQuests.filter(q => q.id !== questId),
      }));
    }
  },
  
  updateQuestProgress: (questId: string, objectiveIndex: number, progress: number) => {
    set(state => ({
      activeQuests: state.activeQuests.map(quest => {
        if (quest.questId === questId) {
          const updatedObjectives = [...quest.objectives];
          updatedObjectives[objectiveIndex].current = progress;
          
          // Check if all objectives are completed
          const allCompleted = updatedObjectives.every(obj => obj.current >= obj.required);
          
          return {
            ...quest,
            objectives: updatedObjectives,
            completed: allCompleted,
            completedAt: allCompleted ? Date.now() : undefined,
          };
        }
        return quest;
      }),
    }));
  },
  
  completeQuest: (questId: string) => {
    set(state => ({
      activeQuests: state.activeQuests.filter(q => q.questId !== questId),
      completedQuests: [...state.completedQuests, questId],
    }));
  },
  
  abandonQuest: (questId: string) => {
    const quest = get().activeQuests.find(q => q.questId === questId);
    if (quest) {
      const originalQuest = get().availableQuests.find(q => q.id === questId);
      
      set(state => ({
        activeQuests: state.activeQuests.filter(q => q.questId !== questId),
        availableQuests: originalQuest 
          ? [...state.availableQuests, originalQuest]
          : state.availableQuests,
      }));
    }
  },
}));
