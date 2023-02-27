import produce from "immer";
import create from "zustand";
import { persist } from "zustand/middleware";

const useFilterStore = create(
    persist(
        produce((set) => ({
            genres: [],
            setGenres: (genres) => set((state) => (state.genres = genres)),
            tempos: [],
            setTempos: (tempos) => set((state) => (state.tempos = tempos)),
            moods: [],
            setmoods: (moods) => set((state) => (state.moods = moods)),
            variance: 5, // 0-9
            setVariance: (variance) => set((state) => (state.variance = variance)),
            history: [],
            addBroadcast: (broadcast) => {
                set((state) => ({
                    history: [
                        ...state.history,
                        broadcast
                    ],
                }))
            },
            currentBroadcast: {},
            setCurrentBroadcast: (broadcast) => set((state) => (state.currentBroadcast = broadcast))
        }))
    )
);

export default useFilterStore;
