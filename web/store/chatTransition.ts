import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatTransitionState {
  query: string;
  files: File[];
  chatId: string | null;
  isUploading: boolean;

  setQuery: (query: string) => void;
  setFiles: (files: File[]) => void;
  addFiles: (newFiles: File[]) => void;
  removeFile: (index: number) => void;
  setChatId: (id: string) => void;
  clearTransition: () => void;
}

export const useChatTransitionStore = create<ChatTransitionState>()(
  persist(
    (set) => ({
      query: '',
      files: [],
      chatId: null,
      isUploading: false,

      setQuery: (query) => set({ query }),

      setFiles: (files) => set({ files }),

      addFiles: (newFiles) => {
        set((state) => ({
          files: [...state.files, ...newFiles],
        }));
      },

      removeFile: (index) => {
        set((state) => ({
          files: state.files.filter((_, i) => i !== index),
        }));
      },

      setChatId: (id) => set({ chatId: id }),

      clearTransition: () =>
        set({
          query: '',
          files: [],
          chatId: null,
        }),
    }),
    {
      name: 'chat-transition-storage',
      skipHydration: typeof window === 'undefined',
    }
  )
);
