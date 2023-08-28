import produce from "immer";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from "zustand";

const useThemeStore = create(
  produce((set) => ({
    nightMode: false,
    setNightMode: (value) => set({ nightMode: value }),
    searchbarIsVisible: false,
    setSearchbarIsVisible: (value) => set({ searchbarIsVisible: value })
  }))
);

export default useThemeStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('ThemeStore', useThemeStore);
}
