import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from 'zustand';

export const initialState = {
  genres: [],
  slowest: 30,
  fastest: 270,
  selectedMood: null,
}

const useFilterStore = create((set, get) => ({
  ...initialState,
  addGenre: (genre) => set((state) => ({
    genres: [...state.genres, genre],
  })),
  removeGenre: (genre) => set((state) => ({
    genres: state.genres.filter(g => g !== genre)
  })),
  setSlowest: (bpm) => set({ slowest: bpm }),
  setFastest: (bpm) => set({ fastest: bpm }),
  clearMood: () => set({ selectedMood: null }),
  setMood: (mood) => set({ selectedMood: mood }),
  isDirty: () => {
    if (get().selectedMood !== null) return true;
    if (get().genres.length > 0) return true;
    if (get().slowest !== initialState.slowest) return true;
    if (get().fastest !== initialState.fastest) return true;
    return false;
  },
  reset: () => set(initialState)
}));

export default useFilterStore;

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('FilterStore', useFilterStore);
}