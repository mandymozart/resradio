import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

const useThemeStore = create((set) => ({
  nightMode: false,
  setNightMode: (value) => set((state) => ({ nightMode: value })),
  searchbarIsVisible: false,
  setSearchbarIsVisible: (value) => set((state) => ({ searchbarIsVisible: value }))
}));

export default useThemeStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('ThemeStore', useThemeStore);
}