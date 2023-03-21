import produce from "immer";
import create, { GetState, SetState } from "zustand";
import { persist, StoreApiWithPersist } from "zustand/middleware";
import { BroadcastRefernce, Filter, ShowReference } from "../api/filter";

interface FilterState {
  genres: string[];
  setGenres: (genres: string[]) => void;
  moods: string[];
  setMoods: (moods: string[]) => void;
  tempos: number[];
  setTempos: (tempos: number[]) => void;
  variance: number; // 0-9 (0 tight, 9 go wild)
  setVariance: (variance: number) => void;
  history: BroadcastRefernce[];
  currentBroadcast: BroadcastRefernce;
  setCurrentBroadcast: (broadcast: BroadcastRefernce) => void;
  addBroadcast: (broadcast: BroadcastRefernce[]) => void;
  shows: ShowReference[];
  addShow: (show: ShowReference[]) => void;
}

const useFilterStore = create<FilterState>(
  persist(
    produce((set, get) => ({
      genres: [],
      setGenres: (genres: string[]) => set((state: FilterState) => (state.genres = genres)),
      tempos: [],
      setTempos: (tempos: number[]) => set((state: FilterState) => (state.tempos = tempos)),
      moods: [],
      setMoods: (moods: string[]) => set((state: FilterState) => (state.moods = moods)),
      variance: 5, // 0-9
      setVariance: (variance) => set((state: FilterState) => (state.variance = variance)),
      history: [],
      currentBroadcast: {},
      setCurrentBroadcast: (broadcast: BroadcastRefernce) =>
        set((state: FilterState) => (state.currentBroadcast = broadcast)),
      addBroadcast: (broadcast: BroadcastRefernce) => {
        set((state: FilterState) => ({
          history: [...state.history, broadcast],
        }));
      },
      shows: [],
      addShow: (show: ShowReference) => {
        set((state: FilterState) => ({
          shows: [...state.shows, show],
        }));
      },
    })),
    { name: "filter-store" }
  )
);

export default useFilterStore;
