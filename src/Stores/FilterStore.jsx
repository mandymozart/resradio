import produce from "immer";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from "zustand";
import { persist } from "zustand/middleware";

const useFilterStore = create(
  persist(
    produce((set, get) => ({
      genres: [],
      setGenres: (genres) => set((state) => (state.genres = genres)),
      tempos: [],
      setTempos: (tempos) => set((state) => (state.tempos = tempos)),
      moods: [],
      setMoods: (moods) => set((state) => (state.moods = moods)),
      history: [],
      currentBroadcast: null,
      setCurrentBroadcast: (broadcast) =>
        set((state) => (state.currentBroadcast = broadcast)),
      addBroadcast: (broadcast) => {
        set((state) => ({
          history: [...state.history, broadcast],
        }));
      },
      shows: [],
      addShow: (show) => {
        set((state) => ({
          shows: [...state.shows, show],
        }));
      },
    })),
    { name: "filter-store" }
  )
);

export default useFilterStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('FilterStore', useFilterStore);
}
