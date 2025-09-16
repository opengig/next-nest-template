import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ModelOption, availableModels } from '@/types/chat.type';

interface ModelSelectionState {
  selectedModel: string;
  availableModels: ModelOption[];

  setSelectedModel: (model: string) => void;
  getSelectedModel: () => string;
  resetToDefault: () => void;
}

const DEFAULT_MODEL = 'openai/gpt-5-chat-latest';

export const useModelSelectionStore = create<ModelSelectionState>()(
  persist(
    (set, get) => ({
      selectedModel: DEFAULT_MODEL,
      availableModels: availableModels,

      setSelectedModel: (model: string) => {
        const isValidModel = availableModels.some((m) => m.id === model);
        if (isValidModel) {
          set({ selectedModel: model });
        }
      },

      getSelectedModel: () => get().selectedModel,

      resetToDefault: () => set({ selectedModel: DEFAULT_MODEL }),
    }),
    {
      name: 'model-selection-storage',
      skipHydration: typeof window === 'undefined',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
      }),
    }
  )
);
