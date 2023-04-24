import produce from "immer";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import create from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
  genres: [],
  tempos: [],
  moods: [],
}

const useFilterStore = create(
  persist(
    produce((set, get) => ({
      ...initialState,
      setGenres: (genres) => set((state) => (state.genres = genres)),
      addGenre: (genre) => set(state => ({
        genres: { ...state.genres, genre },
      })),
      removeGenre: (id) => set(state => ({
        genres: state.genres.filter(genre => genre.value !== id)
      })),
      setTempos: (tempos) => set((state) => (state.tempos = tempos)),
      removeTempo: (id) => set(state => ({
        tempos: state.tempos.filter(tempo => tempo.value === id)
      })),
      setMoods: (moods) => set((state) => (state.moods = moods)),
      removeMood: (id) => set(state => ({
        moods: state.moods.filter(mood => mood.value !== id)
      })),
      addGenre: (mood) => set(state => ({
        mood: { ...state.moods, mood },
      })),
      reset: () => set(initialState)
    })),
    { name: "filter-store" }
  )
);

export default useFilterStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('FilterStore', useFilterStore);
}
