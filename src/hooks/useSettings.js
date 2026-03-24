import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useSettings = create(
  persist(
    (set) => ({
      quietMode: true,
      theme: 'light',
      language: 'ru', 

      setTheme: (newTheme) => set({ theme: newTheme}),
      setQuiteMode: () => set((state) => ({ quietMode: !state.quietMode })),
      setLanguage: (newLanguage) => set({ language: newLanguage}),
    }),
    {
      name: 'settings-key',
      partialize: (state) => {
        return {
          theme: state.theme,
          language: state.language,
          quietMode:state.quietMode,
        };
    }
  }
)
);
