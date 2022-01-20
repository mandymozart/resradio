import produce from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    produce((set, get) => ({
      keyword: "vienna",
      setKeyword: (keyword) => set((state) => (state.keyword = keyword)),
    }))
  )
);

export default useThemeStore;