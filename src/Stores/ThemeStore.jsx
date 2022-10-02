import produce from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    produce((set) => ({
      keyword: "vienna",
      setKeyword: (keyword) => set((state) => (state.keyword = keyword)),
      mousePosition: {x:0,y:0}, 
      nightMode: false,
      setNightMode: (value)=> set((state) => {
        state.nightMode = value;
      }),
      showGifs: true,
      setShowGifs: (value)=> set((state) => {
        state.showGifs = value;
      }),
      setMousePosition: (pos) => {
        return set((state) => {
          state.mousePosition = pos;
        })},
    }))
  )
);

export default useThemeStore;
